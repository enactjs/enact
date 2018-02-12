import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

import {ScrollableNative} from '../Scrollable/ScrollableNative';
import {ScrollerBase as ScrollerBaseNative} from '../Scroller';

/**
 * A moonstone-styled native Scroller, SpotlightContainerDecorator and Scrollable applied.
 * For smooth native scrolling, web engine with below Chromium 61, should be launched
 * with the flag '--enable-blink-features=CSSOMSmoothScroll' to support it.
 * The one with Chromium 61 or above, is launched to support it by default.
 *
 * Usage:
 * ```
 * <ScrollerNative>Scroll me.</ScrollerNative>
 * ```
 *
 * @class ScrollerNative
 * @memberof moonstone/Scroller
 * @mixes moonstone/Scroller.ScrollableNative
 * @ui
 * @public
 */
const ScrollerNative = SpotlightContainerDecorator(
	{restrict: 'self-first'},
	ScrollableNative(ScrollerBaseNative)
);

export default ScrollerNative;
export {
	ScrollerNative,
	ScrollerBaseNative
};
