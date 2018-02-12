import ScrollableNative from '../Scrollable/ScrollableNative';
import {ScrollerBase as ScrollerBaseNative} from './Scroller';

/**
 * A basic native scroller, [ScrollableNative]{@link ui/Scrollable.ScrollableNative} applied.
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
 * @memberof ui/Scroller
 * @mixes ui/Scrollable.ScrollableNative
 * @ui
 * @public
 */
const ScrollerNative = ScrollableNative(ScrollerBaseNative);

export default ScrollerNative;
export {
	ScrollerNative,
	ScrollerBaseNative
};
