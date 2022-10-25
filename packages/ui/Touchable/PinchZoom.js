import clamp from 'ramda/src/clamp';
import PropTypes from 'prop-types';

class PinchZoom {
	pinchZoomConfig = null;
	startScale = 1.0;
	scale = 1.0;

	isZooming = () => this.pinchZoomConfig != null;

	setContainerBounds = (node) => {
		const {global: isGlobal, boxSizing} = this.pinchZoomConfig;
		let bounds = null;

		if (typeof window === 'undefined' || !node) return;

		if (isGlobal) {
			bounds = {
				minX: 0,
				minY: 0,
				maxX: window.innerWidth,
				maxY: window.innerHeight
			};
		} else {
			bounds = node.getBoundingClientRect();

			// adjust for padding when using content-box
			if (boxSizing === 'content-box') {
				const computedStyle = window.getComputedStyle(node);
				bounds = {
					minX: bounds.left + parseInt(computedStyle.paddingLeft),
					minY: bounds.top + parseInt(computedStyle.paddingTop),
					maxX: bounds.right - parseInt(computedStyle.paddingRight),
					maxY: bounds.bottom - parseInt(computedStyle.paddingBottom)
				};
			} else {
				bounds = {
					minX: bounds.left,
					minY: bounds.top,
					maxX: bounds.right,
					maxY: bounds.bottom
				};
			}
		}

		this.bounds = bounds;
	};

	getBoundsCoords = ({x, y}) => {
		const {maxX, maxY, minX, minY} = this.bounds;

		return {x: clamp(minX, maxX, x) - minX, y: clamp(minY, maxY, y) - minY};
	};

	updateZoom = (scale) => {
		const {maxZoom, minZoom} = this.pinchZoomConfig;
		const newScale = clamp(minZoom, maxZoom, scale);

		if (newScale !== this.scale) {
			this.scale = newScale;
			return true;
		}

		return false;
	};

	begin = (config, {noResume, onPinchZoom, onPinchZoomEnd, onPinchZoomStart}, coords, node) => {
		if (!onPinchZoom && !onPinchZoomStart && !onPinchZoomEnd) {
			return;
		}

		this.pinchZoomConfig = {
			...config,
			node,
			resume: !noResume
		};

		this.setContainerBounds(node);
		const {x: x1, y: y1} = this.getBoundsCoords(coords[0]);
		const {x: x2, y: y2} = this.getBoundsCoords(coords[1]);
		const dx = x1 - x2;
		const dy = y1 - y2;

		this.startDist = Math.sqrt((dx * dx + dy * dy));
		this.startScale = this.scale;

		this.onPinchZoom = onPinchZoom;
		this.onPinchZoomStart = onPinchZoomStart;
		this.onPinchZoomEnd = onPinchZoomEnd;

		if (this.onPinchZoomStart) {
			this.onPinchZoomStart({
				type: 'onPinchZoomStart',
				coords
			});
		}
	};

	// This method will get the `onPinchZoom`, `onPinchZoomEnd`, and `onPinchZoomStart` props.
	updateProps = ({onPinchZoom, onPinchZoomEnd, onPinchZoomStart}) => {
		// Check `isZooming` gesture is not in progress. Check if gesture exists before updating the references to the `pinchZoomConfig`
		if (!this.isZooming()) return;

		// This will update the `pinchZoomConfig` with the new value
		this.onPinchZoom = onPinchZoom;
		this.onPinchZoomStart = onPinchZoomStart;
		this.onPinchZoomEnd = onPinchZoomEnd;
	};

	move = (coords) => {
		if (!this.isZooming()) return;

		const {scaleTolerance} = this.pinchZoomConfig;

		let {x: x1, y: y1} = this.getBoundsCoords(coords[0]);
		let {x: x2, y: y2} = this.getBoundsCoords(coords[1]);

		const dx = x1 - x2;
		const dy = y1 - y2;

		const scale = (Math.sqrt(dx * dx + dy * dy) / this.startDist) * this.startScale;

		if (Math.abs(this.scale - scale) > scaleTolerance && this.onPinchZoom && this.updateZoom(scale)) {
			this.onPinchZoom({
				type: 'onPinchZoom',
				scale: this.scale,
				coords
			});
		}
	};

	blur = () => {
		if (!this.isZooming()) return;

		if (!this.pinchZoomConfig.global) {
			this.end();
		}
	};

	end = () => {
		if (!this.isZooming()) return;

		if (this.onPinchZoomEnd ) {
			this.onPinchZoomEnd({type: 'onPinchZoomEnd'});
		}

		this.pinchZoomConfig = null;
	};
}

const defaultPinchZoomConfig = {
	boxSizing: 'border-box',
	global: false,
	maxZoom: 4,
	minZoom: 0.5,
	scaleTolerance: 0.02
};

const pinchZoomConfigPropType = PropTypes.shape({
	boxSizing: PropTypes.string,
	global: PropTypes.bool,
	maxZoom: PropTypes.number,
	minZoom: PropTypes.number,
	scaleTolerance: PropTypes.number
});

export default PinchZoom;
export {
	defaultPinchZoomConfig,
	PinchZoom,
	pinchZoomConfigPropType
};
