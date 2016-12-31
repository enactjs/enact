/**
 * Exports the {@link moonstone/VirtualList.VirtualList},
 * {@link moonstone/VirtualList.VirtualGridList}, and
 * {@link moonstone/VirtualList.GridListImageItem} components. The default export is
 * {@link moonstone/VirtualList.VirtualList}.
 *
 * @module moonstone/VirtualList
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import VirtualListBase, {gridListItemSizeShape} from './VirtualListBase';

/**
 * {@link moonstone/VirtualList.VirtualList} is a VirtualList with Moonstone styling.
 *
 * @class VirtualList
 * @memberof moonstone/VirtualList
 * @ui
 * @public
 */
const VirtualList = kind({
	name: 'VirtualList',

	propTypes: /** @lends moonstone/VirtualList.VirtualList.prototype */ {
		/**
		 * Size of an item for the VirtualList; valid value is a number.
		 * If the direction for the list is vertical, itemSize means the height of an item.
		 * For horizontal, it means the width of an item.
		 *
		 * Usage:
		 * ```
		 * <VirtualList itemSize={ri.scale(72)}/>
		 * ```
		 *
		 * @type {Number}
		 * @public
		 */
		itemSize: PropTypes.number.isRequired
	},

	render: (props) => <VirtualListBase {...props} />
});

/**
 * {@link moonstone/VirtualList.VirtualGridList} is a VirtualGridList with Moonstone styling.
 *
 * @class VirtualGridList
 * @memberof moonstone/VirtualList
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
		 * <VirtualGridList itemSize={{minWidth: ri.scale(180), minHeight: ri.scale(270)}}/>
		 * ```
		 *
		 * @type {moonstone/VirtualList.gridListItemSizeShape}
		 * @public
		 */
		itemSize: gridListItemSizeShape.isRequired
	},

	render: (props) => <VirtualListBase {...props} pageScroll />
});

export default VirtualList;
export {VirtualList, VirtualGridList};
export * from './GridListImageItem';
