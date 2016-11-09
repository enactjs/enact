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

import VirtualListBase from './VirtualListBase';

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
		 * Size of data for the VirtualList; valid value is a number.
		 *
		 * @type {Number}
		 * @public
		 */
		dataSize: PropTypes.number.isRequired,

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
		 * Size of data for the VirtualGridList; valid value is a number.
		 *
		 * @type {Number}
		 * @public
		 */
		dataSize: PropTypes.number.isRequired,

		/**
		 * Size of an item for the VirtualGridList; valid value is an object that has `minWidth`
		 * and `minHeight` as properties.
		 *
		 * Usage:
		 * ```
		 * <VirtualGridList itemSize={{minWidth: ri.scale(180), minHeight: ri.scale(270)}}/>
		 * ```
		 *
		 * @type {Object}
		 * @public
		 */
		itemSize: PropTypes.object.isRequired
	},

	render: (props) => <VirtualListBase {...props} />
});

/**
 * {@link module:@enact/moonstone/VirtualList~VirtualVariableList} is a VirtualList with Moonstone styling
 * which has a variable width or height.
 *
 * @class VirtualVariableList
 * @ui
 * @public
 */
const VirtualVariableList = kind({
	name: 'VirtualVariableList',

	propTypes: {
		/**
		 * Size of data for the VirtualVariableList; valid value is an object
		 * that has `fixed` for the data size of fixed dimension and `variable` for
		 * the data size of variable dimension.
		 *
		 * @type {Object}
		 * @public
		 */
		dataSize: PropTypes.object.isRequired,

		/**
		 * Size of an item for the VirtualVariableList; valid value is an object
		 * that has `fixed` for the item size of fixed dimension
		 * and `variable` for the item sizes of variable dimension.
		 *
		 * @type {Object}
		 * @public
		 */
		itemSize: PropTypes.object.isRequired,

		/**
		 * To fix the position for first row and column items
		 *
		 * @type {Boolean}
		 * @public
		 */
		lockHeaders: PropTypes.bool.isRequired,

		/**
		 * Direction specific options of the list; valid values are `'width'` and `'height'`.
		 *
		 * @type {String}
		 * @public
		 */
		variableDimension: PropTypes.oneOf(['width', 'height']).isRequired,

		/**
		 * For variable width or variable height, we need to define max scroll width or max scroll height
		 * instead of calculating them from all items.
		 *
		 * @type {Number}
		 * @public
		 */
		variableMaxScrollSize: PropTypes.number.isRequired
	},

	render: (orgProps) => {
		const props = Object.assign({}, orgProps);

		if (props.variableDimension === 'height') {
			props.direction = 'horizontal';
		}

		return (<VirtualListBase {...props} />);
	}
});

export default VirtualList;
export {VirtualList, VirtualGridList, VirtualVariableList};
export * from './GridListImageItem';
