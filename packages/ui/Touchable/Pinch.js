import clamp from 'ramda/src/clamp';
import PropTypes from 'prop-types';

class Pinch {
	pinchConfig = null;
	startScale = 1.0;
	scale = 1.0;

	isPinching = () => this.pinchConfig != null;

	setContainerBounds = (node) => {
		const {global: isGlobal, boxSizing} = this.pinchConfig;
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

	getDistance = (coords) => {
		if (Array.isArray(coords)) {
			const {x: x1, y: y1} = this.getBoundsCoords(coords[0]);
			const {x: x2, y: y2} = this.getBoundsCoords(coords[1]);
			const dx = x1 - x2;
			const dy = y1 - y2;

			return Math.sqrt((dx * dx + dy * dy));
		}
		return 0;
	};

	updateScale = (scale) => {
		const {maxScale, minScale} = this.pinchConfig;
		const newScale = clamp(minScale, maxScale, scale);

		if (newScale !== this.scale) {
			this.scale = newScale;
			return true;
		}

		return false;
	};

	begin = (config, {noResume, onPinch, onPinchEnd, onPinchStart}, coords, node) => {
		if (!onPinch && !onPinchStart && !onPinchEnd) {
			return;
		}

		this.pinchConfig = {
			...config,
			node,
			resume: !noResume
		};

		this.setContainerBounds(node);

		this.startDist = this.getDistance(coords);
		this.previousDist = this.startDist;
		this.startScale = this.scale;

		this.onPinch = onPinch;
		this.onPinchStart = onPinchStart;
		this.onPinchEnd = onPinchEnd;

		if (this.onPinchStart) {
			this.onPinchStart({
				type: 'onPinchStart',
				coords
			});
		}
	};

	// This method will get the `onPinch`, `onPinchEnd`, and `onPinchStart` props.
	updateProps = ({onPinch, onPinchEnd, onPinchStart}) => {
		// Check `isPinching` gesture is not in progress. Check if gesture exists before updating the references to the `pinchConfig`
		if (!this.isPinching()) return;

		// This will update the `pinchConfig` with the new value
		this.onPinch = onPinch;
		this.onPinchStart = onPinchStart;
		this.onPinchEnd = onPinchEnd;
	};

	move = (coords) => {
		if (!this.isPinching()) return;

		const {moveTolerance} = this.pinchConfig;

		const currentDist = this.getDistance(coords);
		const scale = (currentDist / this.startDist) * this.startScale;


		if (Math.abs(this.previousDist - currentDist) > moveTolerance && this.onPinch && this.updateScale(scale)) {
			this.onPinch({
				type: 'onPinch',
				scale: this.scale,
				coords
			});

			this.previousDist = currentDist;
		}
	};

	blur = () => {
		if (!this.isPinching()) return;

		if (!this.pinchConfig.global) {
			this.end();
		}
	};

	end = () => {
		if (!this.isPinching()) return;

		if (this.onPinchEnd) {
			this.onPinchEnd({type: 'onPinchEnd'});
		}

		this.pinchConfig = null;
	};
}

const defaultPinchConfig = {
	boxSizing: 'border-box',
	global: false,
	maxScale: 4,
	minScale: 0.5,
	moveTolerance: 16
};

const pinchConfigPropType = PropTypes.shape({
	boxSizing: PropTypes.string,
	global: PropTypes.bool,
	maxScale: PropTypes.number,
	minScale: PropTypes.number,
	moveTolerance: PropTypes.number
});

export default Pinch;
export {
	defaultPinchConfig,
	Pinch,
	pinchConfigPropType
};
