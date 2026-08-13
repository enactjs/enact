import type {Position} from './Position';

/**
 * Center point of a rect with edge aliases used by navigation.
 */
export interface RectCenter extends Position {
	left: number;
	right: number;
	top: number;
	bottom: number;
}

/**
 * Bounding rectangle used by spotlight navigation algorithms.
 */
export interface Rect {
	left: number;
	top: number;
	right: number;
	bottom: number;
	width: number;
	height: number;
	center: RectCenter;
	element?: Element;
}
