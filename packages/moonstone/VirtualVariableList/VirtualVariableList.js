/**
 * Exports the {@link moonstone/VirtualVariableList.VirtualVariableList},
 * {@link moonstone/VirtualVariableList.PositionableVirtualVariableList}, and
 * {@link moonstone/VirtualVariableList.VirtualVariableListCore} components.
 * The default export is {@link moonstone/VirtualVariableList.VirtualVariableList}.
 *
 * @module moonstone/VirtualVariableList
 */

import React, {PropTypes} from 'react';
import classNames from 'classnames';

import kind from '@enact/core/kind';

import {VirtualListCore} from '../VirtualList/VirtualListBase';

import Positionable from './Positionable';
import {VirtualVariableListCore} from './VirtualVariableListCore';
import css from './VirtualVariableList.less';

const
	PositionableVirtualList = Positionable(VirtualListCore),
	PositionableVirtualVariableList = Positionable(VirtualVariableListCore);

// PropTypes shape
const sizeShape = PropTypes.oneOfType(
	[PropTypes.shape({
		row: PropTypes.number.isRequired,
		col: PropTypes.func.isRequired,
		rowHeader: PropTypes.number,
		colHeader: PropTypes.number
	}),
	PropTypes.shape({
		row: PropTypes.func.isRequired,
		col: PropTypes.number.isRequired,
		rowHeader: PropTypes.number,
		colHeader: PropTypes.number
	})]
);

/**
 * {@link module:@enact/moonstone/VirtualVariableList~VirtualVariableList} is a VirtualVariableList with Moonstone styling
 * which has a variable width or height.
 *
 * @class VirtualVariableList
 * @memberof moonstone/VirtualVariableList
 * @ui
 * @public
 */
const VirtualVariableList = kind({
	name: 'VirtualVariableList',

	propTypes: /** @lends moonstone/VirtualVariableList.VirtualVariableList.prototype */ {
		/**
		 * The render function for an item of the list.
		 * `index` is for accessing the index of the item.
		 * `key` MUST be passed as a prop for DOM recycling.
		 * Data manipulation can be done in this function.
		 *
		 * @type {Function|Object}
		 * @public
		 */
		component: PropTypes.shape({item: PropTypes.func.isRequired, rowHeader: PropTypes.func, colHeader: PropTypes.func, corner: PropTypes.func}).isRequired,

		/**
		 * Data for the list.
		 * Check mutation of this and determine whether the list should update or not.
		 *
		 * @type {Array|Object}
		 * @public
		 */
		data: PropTypes.shape({item: PropTypes.any.isRequired, rowHeader: PropTypes.any, colHeader: PropTypes.any}).isRequired,

		/**
		 * Size of data for the list.
		 *
		 * @type {Object}
		 * @public
		 */
		dataSize: sizeShape,

		/**
		 * Size of an item for the list.
		 *
		 * @type {Object}
		 * @public
		 */
		itemSize: sizeShape,

		/**
		 * Option to use row and column headers
		 *
		 * @type {String}
		 * @public
		 */
		headers: PropTypes.oneOf(['both', 'none'])
	},

	defaultProps: {
		headers: 'none'
	},

	styles: {
		css,
		className: 'virtualVariableList'
	},

	computed: {
		rowProps: ({component, data, dataSize, headers, itemSize, posY}) => (headers === 'none') ? null : {
			data: data.rowHeader,
			dataSize: dataSize.rowHeader,
			direction: 'vertical',
			itemSize: itemSize.row,
			posY,
			style: {width: itemSize.rowHeader + 'px', height: 'calc(100% - ' + itemSize.row + 'px)', top: itemSize.row + 'px'},
			component: component.rowHeader
		},
		colProps: ({component, data, dataSize, headers, itemSize, posX}) => (headers === 'none') ? null : {
			data: data.colHeader,
			dataSize: dataSize.colHeader,
			direction: 'horizontal',
			itemSize: itemSize.colHeader,
			posX,
			style: {width: 'calc(100% - ' + itemSize.rowHeader + 'px)', height: itemSize.row + 'px', left: itemSize.rowHeader + 'px'},
			component: component.colHeader
		},
		itemProps: ({component, data, dataSize, headers, itemSize, maxVariableScrollSize, posX, posY, variableAxis}) => ({
			data: data.item,
			dataSize: {
				row: dataSize.row,
				col: dataSize.col
			},
			itemSize: {
				row: itemSize.row,
				col: itemSize.col
			},
			maxVariableScrollSize,
			posX,
			posY,
			variableAxis,
			style: {width: 'calc(100% - ' + itemSize.rowHeader + 'px)', height: 'calc(100% - ' + itemSize.row + 'px)', top: itemSize.row + 'px', left: itemSize.rowHeader + 'px'},
			component: component.item
		})
	},

	render: ({headers, rowProps, colProps, itemProps, className, ...rest}) => {
		const props = Object.assign({}, rest);

		delete props.component;
		delete props.data;
		delete props.dataSize;
		delete props.itemSize;
		delete props.maxVariableScrollSize;
		delete props.posX;
		delete props.posY;
		delete props.variableAxis;

		if (headers === 'both') {
			return (
				<div {...props} className={classNames(className, css.headers)}>
					<PositionableVirtualList {...rowProps} />
					<PositionableVirtualList {...colProps} />
					<PositionableVirtualVariableList {...itemProps} />
					{rest.component.corner()}
				</div>
			);
		} else {
			return (<PositionableVirtualVariableList {...props} {...itemProps} className={className} />);
		}
	}
});

export default VirtualVariableList;
export {VirtualVariableList, PositionableVirtualVariableList, VirtualVariableListCore};
