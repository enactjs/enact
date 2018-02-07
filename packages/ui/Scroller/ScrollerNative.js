/**
 * Provides unstyled scroller native components and behaviors to be customized by a theme or application.
 *
 * @module ui/Scroller
 * @exports ScrollerNative
 * @exports ScrollerBaseNative
 */

import ScrollableNative from '../Scrollable/ScrollableNative';
import {ScrollerBase as ScrollerBaseNative} from './Scroller';

/**
 * [ScrollerNative]{@link ui/Scroller.ScrollerNative} is a native scroller.
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
