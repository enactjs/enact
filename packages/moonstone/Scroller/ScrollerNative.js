/*
 * Exports the {@link moonstone/Scroller.ScrollerNative} and
 * {@link moonstone/Scroller.ScrollerBase} components.
 * The default export is {@link moonstone/Scroller.ScrollerNative}.
 */

import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

import ScrollableNative from './ScrollableNative';
import {ScrollerBase} from './Scroller';

/**
 * {@link moonstone/Scroller.ScrollerNative} is a Scroller with Moonstone styling,
 * SpotlightContainerDecorator and ScrollableNative applied.
 *
 * Usage:
 * ```
 * <ScrollerNative>Scroll me.</ScrollerNative>
 * ```
 *
 * @class ScrollerNative
 * @memberof moonstone/Scroller
 * @mixes moonstone/Scroller.ScrollableNative
 * @see moonstone/Scroller.ScrollerBase
 * @ui
 * @private
 */
const ScrollerNative = SpotlightContainerDecorator(
	{restrict: 'self-first'},
	ScrollableNative(
		ScrollerBase
	)
);

// Docs for ScrollerNative
/**
 * The callback function to get scroll top, left values.
 * The callback function should be called after being rendered.
 * If not, it will return `'{left: null, top: null}'`.
 * You should specify a callback function as the value of this prop
 * to use getScrollDistance feature.
 *
 * The getScrollDistance function passed to the parent component requires below as an argument.
 * - {position: {x, y}} - You can set a pixel value for x and/or y position
 * - {align} - You can set one of values below for align
 *   `'left'`, `'right'`, `'top'`, `'bottom'`,
 *   `'topleft'`, `'topright'`, `'bottomleft'`, and `'bottomright'`.
 * - {index} - You can set an index of specific item. (`0` or positive integer)
 *   This option is available for only VirtualList kind.
 * - {node} - You can set a node to scroll
 *
 * @name cbScrollDistance
 * @type {Function}
 * @memberof moonstone/Scroller.ScrollerNative
 * @example
 *	// If you set cbScrollDistance prop like below;
 *	cbScrollDistance: (fn) => {this.getScrollDistance = fn;}
 *	// You can simply call like below;
 *	const {left, top} = this.getScrollDistance({align: 'top'});
 *  // or
 *  const {left, top} = this.getScrollDistance({index: 100});
 * @instance
 * @public
 */

/**
 * When `true`, allows 5-way navigation to the scrollbar controls. By default, 5-way will
 * not move focus to the scrollbar controls.
 *
 * @name focusableScrollbar
 * @type {Boolean}
 * @memberof moonstone/Scroller.ScrollerNative
 * @instance
 * @public
 */

/**
 * Direction of the scroller; valid values are `'both'`, `'horizontal'`, and `'vertical'`.
 *
 * @name direction
 * @type {String}
 * @default 'both'
 * @memberof moonstone/Scroller.ScrollerNative
 * @instance
 * @public
 */

/**
 * Specifies how to show horizontal scrollbar. Acceptable values are `'auto'`,
 * `'visible'`, and `'hidden'`.
 *
 * @name horizontalScrollbar
 * @type {String}
 * @default 'auto'
 * @memberof moonstone/Scroller.ScrollerNative
 * @instance
 * @public
 */

/**
 * Called when scrolling
 *
 * @name onScroll
 * @type {Function}
 * @memberof moonstone/Scroller.ScrollerNative
 * @instance
 * @public
 */

/**
 * Called when scroll starts
 *
 * @name onScrollStart
 * @type {Function}
 * @memberof moonstone/Scroller.ScrollerNative
 * @instance
 * @public
 */

/**
 * Called when scroll stops
 *
 * @name onScrollStop
 * @type {Function}
 * @memberof moonstone/Scroller.ScrollerNative
 * @instance
 * @public
 */

/**
 * Specifies how to show vertical scrollbar. Acceptable values are `'auto'`,
 * `'visible'`, and `'hidden'`.
 *
 * @name verticalScrollbar
 * @type {String}
 * @default 'auto'
 * @memberof moonstone/Scroller.ScrollerNative
 * @instance
 * @public
 */

export default ScrollerNative;
export {ScrollerNative, ScrollerBase};
