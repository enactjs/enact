import type {HandlerFunction} from '@enact/core/types';

/**
 * Props consumed by {@link spotlight/Spottable.SpottableCore}.
 */
export interface SpottableCoreProps {
	disabled?: boolean;
	handleForceUpdate?: () => void;
	onSelectionCancel?: (ev: any) => void;
	onSpotlightDisappear?: (ev: any) => void;
	onSpotlightDown?: (ev: any) => void;
	onSpotlightLeft?: (ev: any) => void;
	onSpotlightRight?: (ev: any) => void;
	onSpotlightUp?: (ev: any) => void;
	selectionKeys?: number[];
	spotlightDisabled?: boolean;
	spotlightId?: string;
}

/**
 * Context passed to {@link spotlight/Spottable.SpottableCore}.
 */
export interface SpottableCoreContext {
	prevSpotlightDisabled?: boolean;
	spotlightDisabled?: boolean;
}

/**
 * Configuration for {@link spotlight/Spottable.useSpottable}.
 */
export interface UseSpottableConfig extends SpottableCoreProps {
	emulateMouse?: boolean;
	getSpotRef: () => HTMLElement | null | undefined;
}

/**
 * Object returned by {@link spotlight/Spottable.useSpottable}.
 */
export interface UseSpottableResult {
	attributes: Record<string, string>;
	className: string | null;
	onBlur: HandlerFunction;
	onFocus: HandlerFunction;
	onKeyDown: HandlerFunction;
	onKeyUp: HandlerFunction;
	onMouseEnter: HandlerFunction;
	onMouseLeave: HandlerFunction;
}

/**
 * Props for {@link spotlight/Spottable.Spottable}.
 */
export interface SpottableProps {
	className?: string;
	disabled?: boolean;
	handleForceUpdate?: () => void;
	onSpotlightDisappear?: (ev: any) => void;
	onSpotlightDown?: (ev: any) => void;
	onSpotlightLeft?: (ev: any) => void;
	onSpotlightRight?: (ev: any) => void;
	onSpotlightUp?: (ev: any) => void;
	selectionKeys?: number[];
	spotlightDisabled?: boolean;
	spotlightId?: string;
	tabIndex?: number;
	[prop: string]: any;
}
