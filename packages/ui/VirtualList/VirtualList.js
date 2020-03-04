/**
 * Unstyled virtual list components and behaviors to be customized by a theme or application.
 *
 * @module ui/VirtualList
 * @exports gridListImageSizeShape
 * @exports VirtualGridList
 * @exports VirtualList
 * @exports VirtualListBase
 * @exports VirtualListBasic
 */

import PropTypes from 'prop-types';
import React from 'react';

import {ResizeContext} from '../Resizable';
import useScroll from '../useScroll';
import Scrollbar from '../useScroll/Scrollbar';

import {UiVirtualListBase, UiVirtualListBaseNative} from './UiVirtualListBase';
import {gridListItemSizeShape, itemSizesShape, VirtualListBasic} from './VirtualListBasic';

/**
 * An unstyled scrollable virtual list component with touch support.
 *
 * @class VirtualList
 * @memberof ui/VirtualList
 * @extends ui/VirtualList.VirtualListBasic
 * @ui
 * @public
 */
const VirtualList = ({role, ...rest}) => {
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
	} = useScroll(rest);

	// Render

	return (
		<ResizeContext.Provider {...resizeContextProps}>
			<div {...scrollContainerProps}>
				<div {...scrollInnerContainerProps}>
					<ScrollContentWrapper {...scrollContentWrapperProps}>
						<VirtualListBasic
							{...scrollContentProps}
							itemsRenderer={({cc}) => ( // eslint-disable-line react/jsx-no-bind
								cc.length ? <div role={role}>{cc}</div> : null
							)}
						/>
					</ScrollContentWrapper>
					{isVerticalScrollbarVisible ? <Scrollbar {...verticalScrollbarProps} /> : null}
				</div>
				{isHorizontalScrollbarVisible ? <Scrollbar {...horizontalScrollbarProps} /> : null}
			</div>
		</ResizeContext.Provider>
	);
};

VirtualList.displayName = 'ui:VirtualList';

VirtualList.propTypes = /** @lends ui/VirtualList.VirtualList.prototype */ {
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
	 * The ARIA role for the list.
	 *
	 * @type {String}
	 * @default 'list'
	 * @public
	 */
	role: PropTypes.string,

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

VirtualList.defaultProps = {
	direction: 'vertical',
	horizontalScrollbar: 'auto',
	role: 'list',
	verticalScrollbar: 'auto'
};

/**
 * An unstyled scrollable virtual grid list component with touch support.
 *
 * @class VirtualGridList
 * @memberof ui/VirtualList
 * @extends ui/VirtualList.VirtualListBasic
 * @ui
 * @public
 */
const VirtualGridList = ({role, ...rest}) => {
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
	} = useScroll(rest);

	return (
		<ResizeContext.Provider {...resizeContextProps}>
			<div {...scrollContainerProps}>
				<div {...scrollInnerContainerProps}>
					<ScrollContentWrapper {...scrollContentWrapperProps}>
						<VirtualListBasic
							{...scrollContentProps}
							itemsRenderer={({cc}) => ( // eslint-disable-line react/jsx-no-bind
								cc.length ? <div role={role}>{cc}</div> : null
							)}
						/>
					</ScrollContentWrapper>
					{isVerticalScrollbarVisible ? <Scrollbar {...verticalScrollbarProps} /> : null}
				</div>
				{isHorizontalScrollbarVisible ? <Scrollbar {...horizontalScrollbarProps} /> : null}
			</div>
		</ResizeContext.Provider>
	);
};

VirtualGridList.displaytName = 'ui:VirtualGridList';

VirtualGridList.propTypes = /** @lends ui/VirtualList.VirtualGridList.prototype */ {
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
	 * The ARIA role for the list.
	 *
	 * @type {String}
	 * @default 'list'
	 * @public
	 */
	role: PropTypes.string,

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

VirtualGridList.defaultProps = {
	direction: 'vertical',
	horizontalScrollbar: 'auto',
	role: 'list',
	verticalScrollbar: 'auto'
};

export default VirtualList;
export {
	gridListItemSizeShape,
	itemSizesShape,
	UiVirtualListBase as VirtualListBase, // to support legacy VirtualListBase
	UiVirtualListBaseNative as VirtualListBaseNative, // to support legacy VirtualListBaseNative
	VirtualGridList,
	VirtualList,
	VirtualListBasic
};
