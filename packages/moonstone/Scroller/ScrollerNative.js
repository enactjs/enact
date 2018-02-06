/**
 * Provides Moonstone-themed scroller native components and behaviors.
 *
 * @module moostone/Scroller
 * @exports ScrollerNative
 * @exports ScrollerBaseNative
 */

import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

import {ScrollableNative} from '../Scrollable/ScrollableNative';
import {ScrollerBase as ScrollerBaseNative} from '../Scroller';

/**
 * [ScrollerNative]{@link moonstone/Scroller.ScrollerNative} is a Scroller with Moonstone styling,
 * SpotlightContainerDecorator and Scrollable applied.
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
