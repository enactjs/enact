import React from 'react';

import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import {ScrollerBaseNative as UiScrollerBaseNative} from '@enact/ui/Scroller';

import {ScrollableNative} from '../Scrollable/ScrollableNative';

const SpottableScrollableNative = SpotlightContainerDecorator({restrict: 'self-first'}, ScrollableNative);

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
const ScrollerNative = (props) => (
	<SpottableScrollableNative
		{...props}
		render={// eslint-disable-line react/jsx-no-bind
			(scrollerProps) => (<UiScrollerBaseNative {...scrollerProps} />)
		}
	/>
);

export default ScrollerNative;
export {
	ScrollerNative
};
