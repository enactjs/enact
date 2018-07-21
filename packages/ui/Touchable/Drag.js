import clamp from 'ramda/src/clamp';
import PropTypes from 'prop-types';

const Tracking = {
	Untracked: 0,
	Active: 1,
	Paused: 2
};

class Drag {
	dragConfig = null

	isDragging = () => this.dragConfig != null

	setContainerBounds = (node) => {
		const {global: isGlobal, boxSizing} = this.dragConfig;
		let bounds = null;

		if (!node) return;

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
			}
		}

		this.bounds = bounds;
	}

	updatePosition = (clientX, clientY) => {
		const {maxX, maxY, minX, minY} = this.bounds;

		const x = clamp(minX, maxX, clientX) - minX;
		const y = clamp(minY, maxY, clientY) - minY;

		if (x !== this.x || y !== this.y) {
			this.x = x;
			this.y = y;

			return true;
		}

		return false;
	}

	begin = (config, {noResume, onDrag, onDragEnd, onDragStart}, coords, node) => {
		if (!onDrag && !onDragStart && !onDragEnd) return;

		const {x, y} = coords;

		this.tracking = Tracking.Untracked;
		this.startX = x;
		this.startY = y;

		this.dragConfig = {
			...config,
			node,
			onDragStart,
			onDragEnd,
			onDrag,
			resume: !noResume
		};

		this.setContainerBounds(node);
		this.move(coords);
	}

	move = (coords) => {
		if (!this.isDragging()) return;

		const {moveTolerance, onDrag, onDragStart} = this.dragConfig;

		if (this.tracking === Tracking.Untracked) {
			const dx = coords.x - this.startX;
			const dy = coords.y - this.startY;

			if (Math.sqrt(dx * dx + dy * dy) >= moveTolerance) {
				this.tracking = Tracking.Active;

				if (onDragStart) {
					onDragStart({
						type: 'onDragStart',
						...coords
					});
				}
			}
		} else if (onDrag && this.tracking === Tracking.Active && this.updatePosition(coords)) {
			onDrag({
				type: 'onDrag',
				...coords
			});
		}
	}

	end = () => {
		if (!this.isDragging()) return;

		const {onDragEnd} = this.dragConfig;
		if (onDragEnd && this.tracking !== Tracking.Untracked) {
			onDragEnd({type: 'onDragEnd'});
		}

		this.tracking = Tracking.Untracked;
		this.dragConfig = null;
	}

	enter = () => {
		if (!this.isDragging()) return;

		if (this.dragConfig.resume && this.tracking === Tracking.Paused) {
			this.tracking = Tracking.Active;
		}
	}

	leave = () => {
		if (!this.isDragging()) return;

		if (!this.dragConfig.global && this.tracking === Tracking.Active) {
			this.tracking = Tracking.Paused;
		}
	}

}

const defaultDragConfig = {
	boxSizing: 'border-box',
	global: false,
	moveTolerance: 16
};

const dragConfigPropType = PropTypes.shape({
	boxSizing: PropTypes.string,
	global: PropTypes.bool,
	moveTolerance: PropTypes.number
});

export default Drag;
export {
	defaultDragConfig,
	Drag,
	dragConfigPropType
};
