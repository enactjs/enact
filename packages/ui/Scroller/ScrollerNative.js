import ScrollableNative from '../Scrollable/ScrollableNative';
import {ScrollerBase as ScrollerBaseNative} from './Scroller';

/**
 * A basic native scroller, [ScrollableNative]{@link ui/Scrollable.ScrollableNative} applied.
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
