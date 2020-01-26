/**
 * Provides Moonstone-themed virtual list components and behaviors.
 *
 * @module moonstone/VirtualList
 * @exports VirtualGridList
 * @exports VirtualList
 * @exports VirtualListBase
 */

import kind from '@enact/core/kind';
import {gridListItemSizeShape, itemSizesShape} from '@enact/ui/VirtualList';
import PropTypes from 'prop-types';
import React from 'react';
import warning from 'warning';

import Scrollable from '../Scrollable';
import VirtualListBase from './VirtualListBase';

/* eslint-disable enact/prop-types */
const listItemsRenderer = (props) => {
	const {
		cc,
		handlePlaceholderFocus,
		itemContainerRef: initUiItemContainerRef,
		needsScrollingPlaceholder,
		primary,
		role,
		SpotlightPlaceholder
	} = props;

	return (
		<React.Fragment>
			{cc.length ? (
				<div ref={initUiItemContainerRef} role={role}>{cc}</div>
			) : null}
			{primary ? null : (
				<SpotlightPlaceholder
					data-index={0}
					data-vl-placeholder
					// a zero width/height element can't be focused by spotlight so we're giving
					// the placeholder a small size to ensure it is navigable
					onFocus={handlePlaceholderFocus}
					style={{width: 10}}
				/>
			)}
			{needsScrollingPlaceholder ? (
				<SpotlightPlaceholder />
			) : null}
		</React.Fragment>
	);
};
/* eslint-enable enact/prop-types */

/**
 * A Moonstone-styled scrollable and spottable virtual list component.
 *
 * @class VirtualList
 * @memberof moonstone/VirtualList
 * @extends moonstone/VirtualList.VirtualListBase
 * @ui
 * @public
 */
const VirtualList = kind({
	name: 'VirtualList',

	propTypes: /** @lends moonstone/VirtualList.VirtualList.prototype */ {
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
	},

	defaultProps: {
		direction: 'vertical',
		focusableScrollbar: false,
		preventBubblingOnKeyDown: 'programmatic',
		role: 'list'
	},

	render: ({itemSize, role, ...rest}) => {
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

		return (
			<Scrollable
				{...rest}
				{...props}
				childRenderer={(childProps) => ( // eslint-disable-line react/jsx-no-bind
					<VirtualListBase
						{...childProps}
						focusableScrollbar={rest.focusableScrollbar}
						itemsRenderer={listItemsRenderer}
						role={role}
					/>
				)}
			/>
		);
	}
});

/**
 * A Moonstone-styled scrollable and spottable virtual grid list component.
 *
 * @class VirtualGridList
 * @memberof moonstone/VirtualList
 * @extends moonstone/VirtualList.VirtualListBase
 * @ui
 * @public
 */
const VirtualGridList = kind({
	name: 'VirtualGridList',

	propTypes: /** @lends moonstone/VirtualList.VirtualGridList.prototype */ {
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
	},

	defaultProps: {
		direction: 'vertical',
		focusableScrollbar: false,
		preventBubblingOnKeyDown: 'programmatic',
		role: 'list'
	},

	render: ({role, ...rest}) => {
		return (
			<Scrollable
				{...rest}
				childRenderer={(childProps) => ( // eslint-disable-line react/jsx-no-bind
					<VirtualListBase
						{...childProps}
						focusableScrollbar={rest.focusableScrollbar}
						itemsRenderer={listItemsRenderer}
						role={role}
					/>
				)}
			/>
		);
	}
});

export default VirtualList;
export {
	VirtualGridList,
	VirtualList,
	VirtualListBase
};
