/**
 * Provides Moonstone-themed virtual list components and behaviors.
 *
 * @module moonstone/VirtualList
 * @exports VirtualGridList
 * @exports VirtualList
 * @exports VirtualListBase
 */

import kind from '@enact/core/kind';
import {ResizeContext} from '@enact/ui/Resizable';
import {gridListItemSizeShape, itemSizesShape, VirtualListBase as UiVirtualListBase} from '@enact/ui/VirtualList';
import PropTypes from 'prop-types';
import React from 'react';
import warning from 'warning';

import Scrollbar from '../Scrollable/Scrollbar';
import useScrollableComponentizable from '../Scrollable/useScrollableComponentizable';
import Skinnable from '../Skinnable';

import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

import {useSpottableVirtualList, VirtualListBase} from './useSpottableVirtualList';

/**
 * A Moonstone-styled scrollable and spottable virtual list component.
 *
 * @class VirtualList
 * @memberof moonstone/VirtualList
 * @extends moonstone/VirtualList.VirtualListBase
 * @ui
 * @public
 */
const VirtualListComp = ({itemSize, role, ...rest}) => {
	const props = itemSize && itemSize.minSize ?
		{
			itemSize: itemSize.minSize,
			itemSizes: itemSize.size
		} :
		{
			itemSize
		};

	warning(
		!rest.itemSizes || !rest.cbScrollTo,
		'VirtualList with `minSize` in `itemSize` prop does not support `cbScrollTo` prop'
	);

	const {
		childWrapper: ChildWrapper,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible,

		resizeContextProps,
		scrollableContainerProps,
		flexLayoutProps,
		childWrapperProps,
		childProps,
		verticalScrollbarProps,
		horizontalScrollbarProps
	} = useScrollableComponentizable({...rest, ...props});

	const uiChildProps = useSpottableVirtualList({
		...childProps,
		focusableScrollbar: rest.focusableScrollbar,
		role: role
	});

	return (
		<ResizeContext.Provider {...resizeContextProps}>
			<div {...scrollableContainerProps}>
				<div {...flexLayoutProps}>
					<ChildWrapper {...childWrapperProps}>
						<UiVirtualListBase {...uiChildProps} />
					</ChildWrapper>
					{isVerticalScrollbarVisible ? <Scrollbar {...verticalScrollbarProps} /> : null}
				</div>
				{isHorizontalScrollbarVisible ? <Scrollbar {...horizontalScrollbarProps} /> : null}
			</div>
		</ResizeContext.Provider>
	);
};

VirtualListComp.displayName = 'VirtualList';

VirtualListComp.propTypes = /** @lends moonstone/VirtualList.VirtualList.prototype */ {
	/**
	 * Size of an item for the VirtualList; valid value is a number generally.
	 * For different item size, value is an object that has `minSize`
	 * and `size` as properties.
	 * If the direction for the list is vertical, itemSize means the height of an item.
	 * For horizontal, it means the width of an item.
	 *
	 * Usage:
	 * ```
	 * <VirtualList itemSize={ri.scale(72)} />
	 * ```
	 *
	 * @type {Number|ui/VirtualList.itemSizesShape}
	 * @required
	 * @public
	 */
	itemSize: PropTypes.oneOfType([PropTypes.number, itemSizesShape]).isRequired,

	cbScrollTo: PropTypes.func,
	direction: PropTypes.oneOf(['horizontal', 'vertical']),
	focusableScrollbar: PropTypes.bool,
	itemSizes: PropTypes.array,
	preventBubblingOnKeyDown: PropTypes.oneOf(['none', 'programmatic']),
	role: PropTypes.string
};

VirtualListComp.defaultProps = {
	direction: 'vertical',
	focusableScrollbar: false,
	preventBubblingOnKeyDown: 'programmatic',
	role: 'list',

	'data-spotlight-container-disabled': false,
	focusableScrollbar: false,
	overscrollEffectOn: {
		arrowKey: false,
		drag: false,
		pageKey: false,
		scrollbarButton: false,
		wheel: true
	},
	preventBubblingOnKeyDown: 'none',
	type: 'JS'
};

const VirtualList = Skinnable(
	SpotlightContainerDecorator(
		{
			overflow: true,
			preserveId: true,
			restrict: 'self-first'
		},
		I18nContextDecorator(
			{rtlProp: 'rtl'},
			VirtualListComp
		)
	)
);

/**
 * A Moonstone-styled scrollable and spottable virtual grid list component.
 *
 * @class VirtualGridList
 * @memberof moonstone/VirtualList
 * @extends moonstone/VirtualList.VirtualListBase
 * @ui
 * @public
 */
const VirtualGridListComp = ({role, ...rest}) => {
	const {
		childWrapper: ChildWrapper,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible,

		resizeContextProps,
		scrollableContainerProps,
		flexLayoutProps,
		childWrapperProps,
		childProps,
		verticalScrollbarProps,
		horizontalScrollbarProps
	} = useScrollableComponentizable(rest);

	const uiChildProps = useSpottableVirtualList({
		...childProps,
		focusableScrollbar: rest.focusableScrollbar,
		role: role
	});

	return (
		<ResizeContext.Provider {...resizeContextProps}>
			<div {...scrollableContainerProps}>
				<div {...flexLayoutProps}>
					<ChildWrapper {...childWrapperProps}>
						<UiVirtualListBase {...uiChildProps} />
					</ChildWrapper>
					{isVerticalScrollbarVisible ? <Scrollbar {...verticalScrollbarProps} /> : null}
				</div>
				{isHorizontalScrollbarVisible ? <Scrollbar {...horizontalScrollbarProps} /> : null}
			</div>
		</ResizeContext.Provider>
	);
};

VirtualGridListComp.displayName = 'VirtualGridList';

VirtualGridListComp.propTypes = /** @lends moonstone/VirtualList.VirtualGridList.prototype */ {
	/**
	 * Size of an item for the VirtualGridList; valid value is an object that has `minWidth`
	 * and `minHeight` as properties.
	 *
	 * Usage:
	 * ```
	 * <VirtualGridList
	 * 	itemSize={{
	 * 		minWidth: ri.scale(180),
	 * 		minHeight: ri.scale(270)
	 * 	}}
	 * />
	 * ```
	 *
	 * @type {ui/VirtualList.gridListItemSizeShape}
	 * @required
	 * @public
	 */
	itemSize: gridListItemSizeShape.isRequired,

	cbScrollTo: PropTypes.func,
	direction: PropTypes.oneOf(['horizontal', 'vertical']),
	focusableScrollbar: PropTypes.bool,
	itemSizes: PropTypes.array,
	preventBubblingOnKeyDown: PropTypes.oneOf(['none', 'programmatic']),
	role: PropTypes.string
};

VirtualGridListComp.defaultProps = {
	direction: 'vertical',
	focusableScrollbar: false,
	preventBubblingOnKeyDown: 'programmatic',
	role: 'list',

	'data-spotlight-container-disabled': false,
	focusableScrollbar: false,
	overscrollEffectOn: {
		arrowKey: false,
		drag: false,
		pageKey: false,
		scrollbarButton: false,
		wheel: true
	},
	preventBubblingOnKeyDown: 'none',
	type: 'JS'
};

const VirtualGridList = Skinnable(
	SpotlightContainerDecorator(
		{
			overflow: true,
			preserveId: true,
			restrict: 'self-first'
		},
		I18nContextDecorator(
			{rtlProp: 'rtl'},
			VirtualGridListComp
		)
	)
);

export default VirtualList;
export {
	VirtualGridList,
	VirtualList,
	VirtualListBase
};
