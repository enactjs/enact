import clamp from 'ramda/src/clamp';

import {BoundsType} from './Drag';
import {TouchableProps} from './Touchable';

export interface pinchConfigPropType {
	boxSizing: 'border-box' | 'content-box';
	global: boolean;
	maxScale: number;
	minScale: number;
	moveTolerance: number;
}

class Pinch {
	bounds: BoundsType | DOMRect | null = null;
	pinchConfig: pinchConfigPropType & {resume?: boolean, node?: HTMLElement} | null = null;
	scale: number = 1.0;
	startScale: number = 1.0;
	startDist: number = 0;
	previousDist: number = 0;
	onPinch?: TouchableProps['onPinch'];
	onPinchStart?: TouchableProps['onPinchStart'];
	onPinchEnd?: TouchableProps['onPinchEnd'];

	isPinching = () => this.pinchConfig != null;

	setContainerBounds = (node: HTMLElement) => {
		const {global: isGlobal, boxSizing} = this.pinchConfig || {};
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

	getBoundsCoords = ({x, y}: {x: number, y: number}) => {
		const {maxX, maxY, minX, minY} = this.bounds as BoundsType;

		return {x: clamp(minX, maxX, x) - minX, y: clamp(minY, maxY, y) - minY};
	};

	getDistance = (coords: Array<{x: number, y: number}>) => {
		if (Array.isArray(coords)) {
			const {x: x1, y: y1} = this.getBoundsCoords(coords[0]);
			const {x: x2, y: y2} = this.getBoundsCoords(coords[1]);
			const dx = x1 - x2;
			const dy = y1 - y2;

			return Math.sqrt((dx * dx + dy * dy));
		}
		return 0;
	};

	updateScale = (scale: number) => {
		const {maxScale, minScale} = this.pinchConfig || defaultPinchConfig;
		const newScale = clamp(minScale, maxScale, scale);

		if (newScale !== this.scale) {
			this.scale = newScale;
			return true;
		}

		return false;
	};

	begin = (config: pinchConfigPropType, {noResume, onPinch, onPinchEnd, onPinchStart}: Partial<TouchableProps>, coords: Array<{x: number; y: number}>, node: HTMLElement) => {
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
	updateProps = ({onPinch, onPinchEnd, onPinchStart}: Partial<TouchableProps>) => {
		// Check `isPinching` gesture is not in progress. Check if gesture exists before updating the references to the `pinchConfig`
		if (!this.isPinching()) return;

		// This will update the `pinchConfig` with the new value
		this.onPinch = onPinch;
		this.onPinchStart = onPinchStart;
		this.onPinchEnd = onPinchEnd;
	};

	move = (coords:  Array<{ x: number; y: number; }>) => {
		if (!this.isPinching()) return;

		const {moveTolerance} = this.pinchConfig || defaultPinchConfig;

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

		if (!this.pinchConfig?.global) {
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

const defaultPinchConfig: pinchConfigPropType = {
	boxSizing: 'border-box',
	global: false,
	maxScale: 4,
	minScale: 0.5,
	moveTolerance: 16
};

export default Pinch;
export {
	defaultPinchConfig,
	Pinch
};
