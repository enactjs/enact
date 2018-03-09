import React from 'react';

import ScrollableNative from '../Scrollable/ScrollableNative';

import {ScrollerBase as ScrollerBaseNative} from './Scroller';

/**
 * An unstyled native scroller, [ScrollableNative]{@link ui/Scrollable.ScrollableNative} applied.
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
 * @extends ui/Scrollable.ScrollableNative
 * @extends ui/Scrollable.ScrollerBase
 * @ui
 * @private
 */
const ScrollerNative = (props) => (
	<ScrollableNative
		{...props}
		childRenderer={(scrollerProps) => ( // eslint-disable-line react/jsx-no-bind
			<ScrollerBaseNative {...scrollerProps} />
		)}
	/>
);

export default ScrollerNative;
export {
	ScrollerBaseNative,
	ScrollerNative
};
