/**
 * Exports the {@link moonstone/Scroller.ScrollerNative} and
 * {@link moonstone/Scroller.ScrollerBase} components.
 * The default export is {@link moonstone/Scroller.ScrollerNative}.
 *
 * @module moonstone/ScrollerNative
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
 * @public
 */
const ScrollerNative = SpotlightContainerDecorator(
	{restrict: 'self-first'},
	ScrollableNative(
		ScrollerBase
	)
);

// Docs for ScrollerNative
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
 * Specifies how to horizontally scroll. Acceptable values are `'auto'`, `'default'` ,
 * `'hidden'`, and `'scroll'`.
 *
 * @name horizontal
 * @type {String}
 * @default 'auto'
 * @memberof moonstone/Scroller.ScrollerNative
 * @instance
 * @public
 */

/**
 * Specifies how to vertically scroll. Acceptable values are `'auto'`, `'auto'` ,
 * `'hidden'`, and `'scroll'`.
 *
 * @name vertical
 * @type {String}
 * @default 'auto'
 * @memberof moonstone/Scroller.ScrollerNative
 * @instance
 * @public
 */

export default ScrollerNative;
export {ScrollerNative, ScrollerBase};
