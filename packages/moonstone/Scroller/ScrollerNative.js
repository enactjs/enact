import React from 'react';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

import {ScrollerBase as ScrollerBaseNative} from './Scroller';
import {ScrollableNative} from '../Scrollable/ScrollableNative';

const ScrollableScrollerNative = (props) => (
	<ScrollableNative
		{...props}
		render={(scrollerProps) => ( // eslint-disable-line react/jsx-no-bind
			<ScrollerBaseNative {...scrollerProps} />
		)}
	/>
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
const ScrollerNative = SpotlightContainerDecorator({restrict: 'self-first'}, ScrollableScrollerNative);

export default ScrollerNative;
export {
	ScrollerNative
};
