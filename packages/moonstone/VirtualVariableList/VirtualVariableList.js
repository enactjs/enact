/**
 * Exports the {@link moonstone/VirtualVariableList/VirtualVariableList.VirtualVariableList} component.
 *
 * @module moonstone/VirtualVariableList/VirtualVariableList
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
const
	componentShpae = PropTypes.shape({
		item: PropTypes.func.isRequired,
		rowHeader: PropTypes.func,
		colHeader: PropTypes.func,
		corner: PropTypes.object
	}),
	dataShape = PropTypes.shape({
		item: PropTypes.any.isRequired,
		rowHeader: PropTypes.any,
		colHeader: PropTypes.any
	}),
	sizeShape = PropTypes.oneOfType([
		PropTypes.shape({
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
		})
	]);

/**
 * {@link module:@enact/moonstone/VirtualVariableList~VirtualVariableList} is a VirtualVariableList with Moonstone styling
 * which has a variable width or height.
 *
 * @class VirtualVariableList
 * @ui
 * @public
 */
const VirtualVariableList = kind({
	name: 'VirtualVariableList',

	propTypes: /** @lends moonstone/VirtualVariableList.VirtualVariableList.prototype */ {
		/**
		 * `component` has `item`, `rowHeaer`, `colHeader`, and `corner` properties.
		 * `item`, `rowHeaer`, and `colHeader` are used for the render function for an item,
		 * a row header, and a column header of the list. `corner` is used for
		 * the component for a corner.
		 * The object including `data`, `index`, and `key` properties is passed as the parameter
		 * of the render function. `data` is the one of `VirtualVariableList`'s `data` prop.
		 * `index` is for accessing the index of the item, the row header, and the colmun header.
		 * For the row header, and the colmun header, `index` is a number. For the item,
		 * `index` is the object which has 'row' property for a row index and
		 * 'col' property for a column index. `key` MUST be passed as a prop for DOM recycling.
		 * Data manipulation can be done in this function.
		 *
		 * @type {Object}
		 * @public
		 */
		component: componentShpae.isRequired,

		/**
		 * Data for the list.
		 * Check mutation of this and determine whether the list should update or not.
		 *
		 * @type {Object}
		 * @public
		 */
		data: dataShape.isRequired,

		/**
		 * Size of data for the list.
		 *
		 * @type {Object}
		 * @public
		 */
		dataSize: sizeShape.isRequired,

		/**
		 * Size of an item for the list.
		 *
		 * @type {Object}
		 * @public
		 */
		itemSize: sizeShape.isRequired,

		/**
		 * For variable width or variable height, we need to define max scroll width or max scroll height
		 * instead of calculating them from all items.
		 *
		 * @type {Number}
		 * @public
		 */
		maxVariableScrollSize: PropTypes.number.isRequired,

		/**
		 * Direction specific options of the list; valid values are `'row'` and `'col'`.
		 *
		 * @type {String}
		 * @public
		 */
		variableAxis: PropTypes.oneOf(['row', 'col']).isRequired,

		/**
		 * Option to use row and column headers
		 *
		 * @type {String}
		 * @default `'none'`
		 * @public
		 */
		headers: PropTypes.oneOf(['both', 'none']),

		/**
		 * Position x.
		 *
		 * @type {Number}
		 * @public
		 */
		x: PropTypes.number,

		/**
		 * Position y.
		 *
		 * @type {Number}
		 * @public
		 */
		y: PropTypes.number
	},

	defaultProps: {
		headers: 'none'
	},

	styles: {
		css,
		className: 'virtualVariableList'
	},

	computed: {
		rowProps: ({component, data, dataSize, headers, itemSize, y}) => (headers === 'none') ? null : {
			data: data.rowHeader,
			dataSize: dataSize.rowHeader,
			direction: 'vertical',
			itemSize: itemSize.row,
			y,
			style: {width: itemSize.rowHeader + 'px', height: 'calc(100% - ' + itemSize.row + 'px)', top: itemSize.row + 'px'},
			component: component.rowHeader
		},
		colProps: ({component, data, dataSize, headers, itemSize, x}) => (headers === 'none') ? null : {
			data: data.colHeader,
			dataSize: dataSize.colHeader,
			direction: 'horizontal',
			itemSize: itemSize.colHeader,
			x,
			style: {width: 'calc(100% - ' + itemSize.rowHeader + 'px)', height: itemSize.row + 'px', left: itemSize.rowHeader + 'px'},
			component: component.colHeader
		},
		itemProps: ({component, data, dataSize, itemSize, maxVariableScrollSize, x, y, variableAxis}) => ({
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
			x,
			y,
			variableAxis,
			style: {width: 'calc(100% - ' + itemSize.rowHeader + 'px)', height: 'calc(100% - ' + itemSize.row + 'px)', top: itemSize.row + 'px', left: itemSize.rowHeader + 'px'},
			component: component.item
		}),
		cornerProps: (itemSize) => ({
			style: {width: itemSize.rowHeader + 'px', height: itemSize.row + 'px', overflow: 'hidden'}
		})
	},

	render: ({headers, rowProps, colProps, itemProps, cornerProps, className, ...rest}) => {
		const corner = rest.component.corner;

		delete rest.component;
		delete rest.data;
		delete rest.dataSize;
		delete rest.itemSize;
		delete rest.maxVariableScrollSize;
		delete rest.x;
		delete rest.y;
		delete rest.variableAxis;

		if (headers === 'both') {
			return (
				<div {...rest} className={classNames(className, css.headers)}>
					<PositionableVirtualList {...rowProps} />
					<PositionableVirtualList {...colProps} />
					<PositionableVirtualVariableList {...itemProps} />
					<div {...cornerProps}>{corner}</div>
				</div>
			);
		} else {
			return (<PositionableVirtualVariableList {...rest} {...itemProps} className={className} />);
		}
	}
});

export default VirtualVariableList;
export {VirtualVariableList, VirtualVariableList as VirtualVariableListBase};
