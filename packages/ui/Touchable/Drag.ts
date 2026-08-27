import clamp from 'ramda/src/clamp';
import {TouchableProps} from './Touchable';

export interface dragConfigPropType {
	boxSizing: 'border-box' | 'content-box';
	global: boolean;
	moveTolerance: number;
}

export type BoundsType = {
	maxX: number,
	maxY: number
	minX: number,
	minY: number,
};

const Tracking = {
	Untracked: 0,
	Active: 1,
	Paused: 2
};

class Drag {
	bounds: BoundsType | DOMRect | null = null;
	dragConfig: dragConfigPropType & {resume?: boolean, node?: HTMLElement} | null = null;
	startX: number = 0;
	startY: number = 0;
	tracking: number | null = null;
	x: number = 0;
	y: number = 0;
	onDrag?: TouchableProps['onDrag'] | null = null;
	onDragStart?: TouchableProps['onDragStart'] | null = null;
	onDragEnd?: TouchableProps['onDragEnd'] | null = null;

	isDragging = () => this.dragConfig != null;

	setContainerBounds = (node: HTMLElement) => {
		const {global: isGlobal, boxSizing} = this.dragConfig || {};
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
	};

	updatePosition = (clientX: number, clientY: number) => {
		const {maxX, maxY, minX, minY} = this.bounds as BoundsType;

		const x = clamp(minX, maxX, clientX) - minX;
		const y = clamp(minY, maxY, clientY) - minY;

		if (x !== this.x || y !== this.y) {
			this.x = x;
			this.y = y;

			return true;
		}

		return false;
	};

	begin = (config: dragConfigPropType, {noResume, onDrag, onDragEnd, onDragStart}: Partial<TouchableProps>, coords: {x: number, y: number}, node: HTMLElement) => {
		if (!onDrag && !onDragStart && !onDragEnd) return;

		const {x, y} = coords;

		this.tracking = Tracking.Untracked;
		this.startX = x;
		this.startY = y;

		this.dragConfig = {
			...config,
			node,
			resume: !noResume
		};

		this.onDrag = onDrag;
		this.onDragStart = onDragStart;
		this.onDragEnd = onDragEnd;

		this.setContainerBounds(node);
		this.move(coords);
	};

	// This method will get the `onDrag`, `onDragEnd`, `onDragStart` props.
	updateProps = ({onDrag, onDragEnd, onDragStart}: Partial<TouchableProps>) => {
		// Check `isDragging` gesture is not in progress. Check if gesture exists before updating the references to the `dragConfig`
		if (!this.isDragging()) return;

		// This will update the `dragConfig` with the new value
		this.onDrag = onDrag;
		this.onDragStart = onDragStart;
		this.onDragEnd = onDragEnd;
	};

	move = (coords: {x: number, y: number}) => {
		if (!this.isDragging()) return;

		const {moveTolerance} = this.dragConfig || defaultDragConfig;

		if (this.tracking === Tracking.Untracked) {
			const dx = coords.x - this.startX;
			const dy = coords.y - this.startY;

			if (Math.sqrt(dx * dx + dy * dy) >= moveTolerance) {
				this.tracking = Tracking.Active;

				if (this.onDragStart) {
					this.onDragStart({
						type: 'onDragStart',
						...coords
					});
				}
			}
		} else if (this.onDrag && this.tracking === Tracking.Active && this.updatePosition(coords.x, coords.y)) {
			this.onDrag({
				type: 'onDrag',
				...coords
			});
		}
	};

	blur = () => {
		if (!this.isDragging()) return;

		if (!this.dragConfig?.global) {
			this.end();
		}
	};

	end = () => {
		if (!this.isDragging()) return;

		if (this.onDragEnd && this.tracking !== Tracking.Untracked) {
			this.onDragEnd({type: 'onDragEnd'});
		}

		this.tracking = Tracking.Untracked;
		this.dragConfig = null;
	};

	enter = () => {
		if (!this.isDragging()) return;

		if (this.dragConfig?.resume && this.tracking === Tracking.Paused) {
			this.tracking = Tracking.Active;
		}
	};

	leave = () => {
		if (!this.isDragging()) return;

		if (!this.dragConfig?.global && this.tracking === Tracking.Active) {
			this.tracking = Tracking.Paused;
		}
	};

}

const defaultDragConfig: dragConfigPropType = {
	boxSizing: 'border-box',
	global: false,
	moveTolerance: 16
};

export default Drag;
export {
	defaultDragConfig,
	Drag
};
