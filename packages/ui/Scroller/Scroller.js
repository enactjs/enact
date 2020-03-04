/**
 * Unstyled scroller components and behaviors to be customized by a theme or application.
 *
 * @module ui/Scroller
 * @exports Scroller
 * @exports ScrollerBase
 * @exports ScrollerBasic
 */

import React from 'react';

import {ResizeContext} from '../Resizable';
import useScroll from '../useScroll';
import Scrollbar from '../useScroll/Scrollbar';

import ScrollerBasic from './ScrollerBasic';
import ScrollerBase from './UiScrollerBase';

const nop = () => {};

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

Scroller.defaultProps = {
	cbScrollTo: nop,
	direction: 'both',
	horizontalScrollbar: 'auto',
	noScrollByDrag: false,
	noScrollByWheel: false,
	onScroll: nop,
	onScrollStart: nop,
	onScrollStop: nop,
	overscrollEffectOn: {
		drag: false,
		pageKey: false,
		wheel: true
	},
	scrollMode: 'translate',
	verticalScrollbar: 'auto'
};

export default Scroller;
export {
	Scroller,
	ScrollerBase, // to support legacy ScrollerBase
	ScrollerBasic // to support theme libraries
};
