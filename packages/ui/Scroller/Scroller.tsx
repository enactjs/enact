/**
 * Unstyled scroller components and behaviors to be customized by a theme or application.
 *
 * @module ui/Scroller
 * @exports Scroller
 * @exports ScrollerBasic
 */

import {checkPropTypes, setDefaultProps} from '@enact/core/util';

import {ResizeContext} from '../Resizable';
import useScroll from '../useScroll';
import Scrollbar from '../useScroll/Scrollbar';

import ScrollerBasic from './ScrollerBasic';

type ScrollAlign =
	| 'left'
	| 'right'
	| 'top'
	| 'bottom'
	| 'topleft'
	| 'topright'
	| 'bottomleft'
	| 'bottomright';
type ScrollToOptions =
	| {position: {x?: number; y?: number}; animate?: boolean}
	| {align: ScrollAlign; animate?: boolean}
	| {node: HTMLElement; animate?: boolean; focus?: boolean};

export type OnScrollFunction = (event: {scrollLeft: number, scrollTop: number}) => void;
export type ScrollToFunction = (options: ScrollToOptions) => void;

export interface ScrollerProps {
	/**
	 * A callback function that receives a reference to the `scrollTo` feature.
	 *
	 * Once received, the `scrollTo` method can be called as an imperative interface.
	 *
	 * - {position: {x, y}} - Pixel value for x and/or y position
	 * - {align} - Where the scroll area should be aligned. Values are:
	 *   `'left'`, `'right'`, `'top'`, `'bottom'`,
	 *   `'topleft'`, `'topright'`, `'bottomleft'`, and `'bottomright'`.
	 * - {node} - Node to scroll into view
	 * - {animate} - When `true`, scroll occurs with animation. When `false`, no
	 *   animation occurs.
	 * - {focus} - When `true`, attempts to focus item after scroll. Only valid when scrolling
	 *   by `node`.
	 * > Note: Only specify one of: `position`, `align`, `node`
	 *
	 * Example:
	 * ```
	 *	// If you set cbScrollTo prop like below;
	 *	cbScrollTo: (fn) => {this.scrollTo = fn;}
	 *	// You can simply call like below;
	 *	this.scrollTo({align: 'top'}); // scroll to the top
	 * ```
	 *
	 * @type {Function}
	 * @public
	 */
	cbScrollTo: ScrollToFunction,

	/**
	 * Direction of the scroller.
	 *
	 * Valid values are:
	 * * `'both'`,
	 * * `'horizontal'`, and
	 * * `'vertical'`.
	 *
	 * @type {String}
	 * @default 'both'
	 * @public
	 */
	direction: 'both' | 'horizontal' | 'vertical',

	/**
	 * Specifies how to show horizontal scrollbar.
	 *
	 * Valid values are:
	 * * `'auto'`,
	 * * `'visible'`, and
	 * * `'hidden'`.
	 *
	 * @type {String}
	 * @default 'auto'
	 * @public
	 */
	horizontalScrollbar: 'auto' | 'visible' | 'hidden',

	/**
	 * Prevents scroll by dragging or flicking on the scroller.
	 *
	 * @type {Boolean}
	 * @default false
	 * @private
	 */
	noScrollByDrag: boolean,

	/**
	 * Prevents scroll by wheeling on the scroller.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	noScrollByWheel: boolean,

	/**
	 * Called when scrolling.
	 *
	 * Passes `scrollLeft`, `scrollTop`.
	 * It is not recommended to set this prop since it can cause performance degradation.
	 * Use `onScrollStart` or `onScrollStop` instead.
	 *
	 * @type {Function}
	 * @param {Object} event
	 * @param {Number} event.scrollLeft Scroll left value.
	 * @param {Number} event.scrollTop Scroll top value.
	 * @public
	 */
	onScroll: OnScrollFunction,

	/**
	 * Called when scroll starts.
	 *
	 * Passes `scrollLeft` and `scrollTop`.
	 *
	 * Example:
	 * ```
	 * onScrollStart = ({scrollLeft, scrollTop}) => {
	 *     // do something with scrollLeft and scrollTop
	 * }
	 *
	 * render = () => (
	 *     <Scroller
	 *         ...
	 *         onScrollStart={this.onScrollStart}
	 *         ...
	 *     />
	 * )
	 * ```
	 *
	 * @type {Function}
	 * @param {Object} event
	 * @param {Number} event.scrollLeft Scroll left value.
	 * @param {Number} event.scrollTop Scroll top value.
	 * @public
	 */
	onScrollStart: OnScrollFunction,

	/**
	 * Called when scroll stops.
	 *
	 * Passes `scrollLeft` and `scrollTop`.
	 *
	 * Example:
	 * ```
	 * onScrollStop = ({scrollLeft, scrollTop}) => {
	 *     // do something with scrollLeft and scrollTop
	 * }
	 *
	 * render = () => (
	 *     <Scroller
	 *         ...
	 *         onScrollStop={this.onScrollStop}
	 *         ...
	 *     />
	 * )
	 * ```
	 *
	 * @type {Function}
	 * @param {Object} event
	 * @param {Number} event.scrollLeft Scroll left value.
	 * @param {Number} event.scrollTop Scroll top value.
	 * @public
	 */
	onScrollStop: OnScrollFunction,

	/**
	 * Specifies overscroll effects shows on which type of inputs.
	 *
	 * @type {Object}
	 * @default {drag: false, pageKey: false, wheel: false}
	 * @private
	 */
	readonly overscrollEffectOn: {
		drag: boolean,
		pageKey: boolean,
		wheel: boolean
	},

	/**
	 * Specifies how to scroll.
	 *
	 * Valid values are:
	 * * `'translate'`,
	 * * `'native'`.
	 *
	 * @type {String}
	 * @default 'translate'
	 * @public
	 */
	scrollMode: 'translate' | 'native',

	/**
	 * Specifies how to show vertical scrollbar.
	 *
	 * Valid values are:
	 * * `'auto'`,
	 * * `'visible'`, and
	 * * `'hidden'`.
	 *
	 * @type {String}
	 * @default 'auto'
	 * @public
	 */
	verticalScrollbar: 'auto' | 'visible' | 'hidden'
}

const nop = () => {};

const scrollerDefaultProps: ScrollerProps = {
	cbScrollTo: nop,
	direction: 'both',
	horizontalScrollbar: 'auto',
	noScrollByDrag: false,
	noScrollByWheel: false,
	onScroll: nop,
	onScrollStart: nop,
	onScrollStop: nop,
	overscrollEffectOn: {
		drag: false,
		pageKey: false,
		wheel: false
	},
	scrollMode: 'translate',
	verticalScrollbar: 'auto'
};

/**
 * An unstyled scroller.
 *
 * Example:
 * ```
 * <Scroller>Scroll me.</Scroller>
 * ```
 *
 * @class Scroller
 * @memberof ui/Scroller
 * @extends ui/Scroller.ScrollerBasic
 * @ui
 * @public
 */
const Scroller = (props: ScrollerProps = scrollerDefaultProps) => {
	// Hooks

	const scrollerProps = setDefaultProps(props, scrollerDefaultProps);

	const {
		scrollContentHandle,
		scrollContentWrapper: ScrollContentWrapper,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible,

		resizeContextProps,
		scrollContainerProps,
		scrollInnerContainerProps,
		scrollContentWrapperProps,
		scrollContentProps,
		verticalScrollbarProps,
		horizontalScrollbarProps
	} = useScroll(scrollerProps);

	// Return

	return (
		<ResizeContext {...resizeContextProps}>
			<div {...scrollContainerProps}>
				<div {...scrollInnerContainerProps}>
					<ScrollContentWrapper {...scrollContentWrapperProps}>
						<ScrollerBasic {...scrollContentProps} ref={scrollContentHandle} />
					</ScrollContentWrapper>
					{isVerticalScrollbarVisible ? <Scrollbar {...verticalScrollbarProps} /> : null}
				</div>
				{isHorizontalScrollbarVisible ? <Scrollbar {...horizontalScrollbarProps} /> : null}
			</div>
		</ResizeContext>
	);
};

Scroller.displayName = 'ui:Scroller';

export default Scroller;
export {
	Scroller,
	ScrollerBasic // to support theme libraries
};
