import compose from 'ramda/src/compose';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import {ScrollerBase as UiScrollerBaseNative} from '@enact/ui/Scroller';
import {ScrollableNative as UiScrollableNative} from '@enact/ui/Scrollable/ScrollableNative';

import {ScrollableNative} from '../Scrollable/ScrollableNative';
import {SpottableScrollerDecorator} from './Scroller';

/**
 * Moonstone-specific Scroller native behavior to apply to ScrollerNative.
 *
 * @hoc
 * @memberof moonstone/Scroller
 * @mixes moonstone/Scrollable.ScrollableNative
 * @mixes ui/Scrollable.ScrollableNative
 * @ui
 * @private
 */
const ScrollerNativeDecorator = compose(
	SpotlightContainerDecorator({restrict: 'self-first'}),
	ScrollableNative,
	SpottableScrollerDecorator,
	UiScrollableNative,
);

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
 * @mixes moonstone/Scrollable.ScrollableNative
 * @ui
 * @public
 */
const ScrollerNative = ScrollerNativeDecorator(UiScrollerBaseNative);

export default ScrollerNative;
export {
	ScrollerNative,
	ScrollerNativeDecorator
};
