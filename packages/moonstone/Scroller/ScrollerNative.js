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
 * A callback function that receives a reference to the `scrollTo` feature. Once received,
 * the `scrollTo` method can be called as an imperative interface.
 *
 * The `scrollTo` function accepts the following paramaters:
 * - {position: {x, y}} - Pixel value for x and/or y position
 * - {align} - Where the scroll area should be aligned. Values are:
 *   `'left'`, `'right'`, `'top'`, `'bottom'`,
 *   `'topleft'`, `'topright'`, `'bottomleft'`, and `'bottomright'`.
 * - {index} - Index of specific item. (`0` or positive integer)
 *   This option is available for only `VirtualList` kind.
 * - {node} - Node to scroll into view
 * - {animate} - When `true`, scroll occurs with animation. When `false`, no
 *   animation occurs.
 * - {indexToFocus} - Deprecated: Use `focus` instead.
 * - {focus} - When `true`, attempts to focus item after scroll. Only valid when scrolling
 *   by `index` or `node`.
 * > Note: Only specify one of: `position`, `align`, `index` or `node`
 *
 * Example:
 * ```
 *	// If you set cbScrollTo prop like below;
 *	cbScrollTo: (fn) => {this.scrollTo = fn;}
 *	// You can simply call like below;
 *	this.scrollTo({align: 'top'}); // scroll to the top
 * ```
 *
 * @name cbScrollTo
 * @type {Function}
 * @memberof moonstone/Scroller.ScrollerNative
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
 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`
 * It is not recommended to set this prop since it can cause performance degradation. Use
 * `onScrollStart` or `onScrollStop` instead.
 *
 * @name onScroll
 * @type {Function}
 * @memberof moonstone/Scroller.ScrollerNative
 * @instance
 * @public
 */

/**
 * Called when scroll starts
 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`
 *
 * @name onScrollStart
 * @type {Function}
 * @memberof moonstone/Scroller.ScrollerNative
 * @instance
 * @public
 */

/**
 * Called when scroll stops
 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`
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
