import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

import {ScrollableNative} from '../Scrollable/ScrollableNative';
import {ScrollerBase as ScrollerBaseNative} from '../Scroller';

/**
 * A moonstone-styled native Scroller, SpotlightContainerDecorator and Scrollable applied.
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
