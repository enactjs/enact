/**
 * Unstyled scroller components and behaviors to be customized by a theme or application.
 *
 * @module ui/Scroller
 * @exports Scroller
 * @exports ScrollerBase
 * @exports ScrollerBasic
 * @exports ScrollerNative
 */

import PropTypes from 'prop-types';
import React from 'react';

import {ResizeContext} from '../Resizable';
import useScroll from '../useScroll';
import Scrollbar from '../useScroll/Scrollbar';

import ScrollerBasic from './ScrollerBasic';
import ScrollerBase from './UiScrollerBase';

/**
 * An unstyled scroller.
 *
 * Example:
 * ```
 * <Scroller>Scroll me.</Scroller>
 * ```
 *
 * @class Scroller
 * @memberof ui/Scroller
 * @extends ui/Scroller.ScrollerBasic
 * @ui
 * @public
 */
const Scroller = (props) => {
	// Hooks

	const {
		scrollContentWrapper: ScrollContentWrapper,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible,

		resizeContextProps,
		scrollContainerProps,
		scrollInnerContainerProps,
		scrollContentWrapperProps,
		scrollContentProps,
		verticalScrollbarProps,
		horizontalScrollbarProps
	} = useScroll(props);

	// Return

	return (
		<ResizeContext.Provider {...resizeContextProps}>
			<div {...scrollContainerProps}>
				<div {...scrollInnerContainerProps}>
					<ScrollContentWrapper {...scrollContentWrapperProps}>
						<ScrollerBasic {...scrollContentProps} />
					</ScrollContentWrapper>
					{isVerticalScrollbarVisible ? <Scrollbar {...verticalScrollbarProps} /> : null}
				</div>
				{isHorizontalScrollbarVisible ? <Scrollbar {...horizontalScrollbarProps} /> : null}
			</div>
		</ResizeContext.Provider>
	);
};

Scroller.propTypes = /** @lends ui/Scroller.Scroller.prototype */ {
	direction: PropTypes.oneOf(['both', 'horizontal', 'vertical']),

	/**
	 * Specifies how to show horizontal scrollbar.
	 *
	 * Valid values are:
	 * * `'auto'`,
	 * * `'visible'`, and
	 * * `'hidden'`.
	 *
	 * @type {String}
	 * @default 'auto'
	 * @public
	 */
	horizontalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden']),

	/**
	 * Specifies how to show vertical scrollbar.
	 *
	 * Valid values are:
	 * * `'auto'`,
	 * * `'visible'`, and
	 * * `'hidden'`.
	 *
	 * @type {String}
	 * @default 'auto'
	 * @public
	 */
	verticalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden'])
};

Scroller.defaultProps = {
	direction: 'both',
	horizontalScrollbar: 'auto',
	verticalScrollbar: 'auto'
};

export default Scroller;
export {
	Scroller,
	ScrollerBase, // to support legacy ScrollerBase
	ScrollerBasic // to support theme libraries
};
