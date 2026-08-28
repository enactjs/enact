import {Job} from '@enact/core/util';
import {ReactNode, RefObject, WheelEvent} from 'react';

export interface AnimationInfo {
	targetX: number;
	targetY: number;
	duration?: number;
	sourceX?: number;
	sourceY?: number;
	easing?: string;
}

export interface ReachedEdgeInfo {
	bottom: boolean;
	left: boolean;
	right: boolean;
	top: boolean;
}

export interface ScrollEventData {
	scrollLeft: number;
	scrollTop: number;
	moreInfo: any;
	reachedEdgeInfo?: ReachedEdgeInfo;
}

export interface ScrollToOptions {
	position?: {x?: number; y?: number};
	align?: ScrollAlign;
	index?: number;
	stickTo?: string;
	offset?: number;
	disallowNegativeOffset?: boolean;
	node?: Node;
	animate?: boolean;
}

export interface FlickTarget {
	targetX: number;
	targetY: number;
	duration?: number;
}

export interface OverscrollStatus {
	horizontal: {before: {type: number; ratio: number}; after: {type: number; ratio: number}};
	vertical: {before: {type: number; ratio: number}; after: {type: number; ratio: number}};
}

export interface ScrollBounds {
	clientWidth: number;
	clientHeight: number;
	scrollWidth: number;
	scrollHeight: number;
	maxTop: number;
	maxLeft: number;
}

export interface MutableScrollState {
	overscrollEnabled: boolean;
	animationInfo: AnimationInfo | null;
	scrollEndGraceTimer: ReturnType<typeof setTimeout> | null;
	resizeRegistry: any | null;
	pixelPerLine: number;
	scrollWheelMultiplierForDeltaPixel: number;
	deferScrollTo: boolean;
	isScrollAnimationTargetAccumulated: boolean;
	rtl?: boolean;
	lastInputType: 'wheel' | 'drag' | 'pageKey' | 'arrowKey' | null;
	overscrollStatus: OverscrollStatus;
	bounds: ScrollBounds;
	wheelDirection: number;
	isDragging: boolean;
	isTouching: boolean;
	scrolling: boolean;
	scrollLeft: number;
	scrollTop: number;
	scrollToInfo: ScrollToOptions | null;
	keyPressed?: boolean;
	keyScroll?: boolean;
	repeat?: boolean;
	animator: any;
	scrollStopJob: Job | null;

	// were missing entirely:
	observerOnScroll: Array<(data: ScrollEventData) => void>;
	accumulatedTargetX: number;
	accumulatedTargetY: number;
	flickTarget: FlickTarget | null;
	dragStartX: number;
	dragStartY: number;
	prevState: {isHorizontalScrollbarVisible: boolean; isVerticalScrollbarVisible: boolean};
}

export interface CustomScrollEvent {
	scrollPos: {
		top: number;
		left: number;
	};
}

export interface UseScrollProps {
	childProps?: ReactNode[];
	children?: ReactNode;
	className?: string;
	clientSize?: {clientWidth: number; clientHeight: number};
	assignProperties: (name: string, props: any) => void;
	dataSize?: number;
	direction?: 'horizontal' | 'vertical' | 'both';
	horizontalScrollbar?: 'visible' | 'hidden' | 'auto';
	horizontalScrollbarHandle?: RefObject<any>;
	itemRenderer?: Function;
	noScrollByDrag?: boolean;
	noScrollByWheel?: boolean;
	overhang?: number;
	overscrollEffectOn?: {
		drag?: boolean;
		wheel?: boolean;
		pageKey?: boolean;
		arrowKey?: boolean;
	};
	pageScroll?: boolean;
	role?: string;
	rtl?: boolean;
	scrollContainerRef?: RefObject<any>;
	scrollContentHandle?: RefObject<any>;
	scrollContentRef: RefObject<any>;
	scrollMode?: 'native' | 'translate';
	setScrollContainerHandle?: (handle: any) => void;
	snapToCenter?: boolean;
	spacing?: number;
	spotlightContainerDisabled?: boolean;
	verticalScrollbar?: 'visible' | 'hidden' | 'auto';
	verticalScrollbarHandle?: RefObject<any>;
	wrap?: boolean;
	itemSize?: number | {minWidth: number; minHeight: number};
	itemSizes?: number[];

	// Callbacks
	addEventListeners?: (ref: RefObject<any>) => void;
	applyOverscrollEffect?: (orientation: string, edge: string, type: number, ratio: number) => void;
	cbScrollTo?: (fn: (opt: ScrollToOptions) => void) => void;
	clearOverscrollEffect?: (orientation: string, edge: string) => void;
	handleResizeWindow?: () => boolean;
	onFlick?: Function;
	onKeyDown?: Function;
	onMouseDown?: Function;
	onScroll?: Function;
	onScrollStart?: Function;
	onScrollStop?: Function;
	onWheel?: Function;
	preventScroll?: (ev: Event) => void;
	removeEventListeners?: (ref: RefObject<any>) => void;
	scrollStopOnScroll?: () => void;
	scrollTo?: (opt: ScrollToOptions) => void;
	start?: (animate?: boolean) => void;
	stop?: () => void;
	[key: string]: any;
}

export interface LegacyWheelEvent extends WheelEvent {
	wheelDeltaY?: number;
	wheelDelta?: number;
}

export interface FlickEvent {
	direction: 'vertical' | 'horizontal' | 'up' | 'down' | 'left' | 'right' | string;
	velocityX: number;
	velocityY: number;
	type?: string;
	target?: EventTarget | null;
	currentTarget?: EventTarget | null;
}

export type OverscrollOrientation = 'horizontal' | 'vertical';

export type OverscrollEdge = 'before' | 'after';

export type ScrollAlign =
	| 'left' | 'right' | 'top' | 'bottom'
	| 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
