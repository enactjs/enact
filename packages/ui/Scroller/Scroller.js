/**
 * Unstyled scroller components and behaviors to be customized by a theme or application.
 *
 * @module ui/Scroller
 * @exports Scroller
 * @exports ScrollerBase
 * @exports ScrollerBasic
 */

import PropTypes from 'prop-types';

import {ResizeContext} from '../Resizable';
import useScroll from '../useScroll';
import Scrollbar from '../useScroll/Scrollbar';

import ScrollerBasic from './ScrollerBasic';
import ScrollerBase from './UiScrollerBase';

const nop = () => {};

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
const scrollerDefaultProps = {
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

const Scroller = (props) => {
	// Hooks

	const scrollerProps = Object.assign({}, scrollerDefaultProps, props);

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
		<ResizeContext.Provider {...resizeContextProps}>
			<div {...scrollContainerProps}>
				<div {...scrollInnerContainerProps}>
					<ScrollContentWrapper {...scrollContentWrapperProps}>
						<ScrollerBasic {...scrollContentProps} ref={scrollContentHandle} />
					</ScrollContentWrapper>
					{isVerticalScrollbarVisible ? <Scrollbar {...verticalScrollbarProps} /> : null}
				</div>
				{isHorizontalScrollbarVisible ? <Scrollbar {...horizontalScrollbarProps} /> : null}
			</div>
		</ResizeContext.Provider>
	);
};

Scroller.displayName = 'ui:Scroller';

Scroller.propTypes = /** @lends ui/Scroller.Scroller.prototype */ {
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
	cbScrollTo: PropTypes.func,

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
	direction: PropTypes.string,

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
	horizontalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden']),

	/**
	 * Prevents scroll by dragging or flicking on the scroller.
	 *
	 * @type {Boolean}
	 * @default false
	 * @private
	 */
	noScrollByDrag: PropTypes.bool,

	/**
	 * Prevents scroll by wheeling on the scroller.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	noScrollByWheel: PropTypes.bool,

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
	onScroll: PropTypes.func,

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
	onScrollStart: PropTypes.func,

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
	onScrollStop: PropTypes.func,

	/**
	 * Specifies overscroll effects shows on which type of inputs.
	 *
	 * @type {Object}
	 * @default {drag: false, pageKey: false, wheel: false}
	 * @private
	 */
	overscrollEffectOn: PropTypes.shape({
		drag: PropTypes.bool,
		pageKey: PropTypes.bool,
		wheel: PropTypes.bool
	}),

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
	scrollMode: PropTypes.string,

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
	verticalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden'])
};


export default Scroller;
export {
	Scroller,
	ScrollerBase, // to support legacy ScrollerBase
	ScrollerBasic // to support theme libraries
};
