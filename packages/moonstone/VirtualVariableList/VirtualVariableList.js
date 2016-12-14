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

// PropTypes shapes
const
	itemHeadersAnyShape = PropTypes.shape({item: PropTypes.any.isRequired, rowHeader: PropTypes.any.isRequired, colHeader: PropTypes.any.isRequired}),
	itemHeadersFuncShpae = PropTypes.shape({item: PropTypes.func.isRequired, rowHeader: PropTypes.func.isRequired, colHeader: PropTypes.func.isRequired}),
	rowNumberColFuncShape = PropTypes.shape({row: PropTypes.number.isRequired, col: PropTypes.func.isRequired}),
	rowFuncColNumberShape = PropTypes.shape({row: PropTypes.func.isRequired, col: PropTypes.number.isRequired}),
	rowNumberColFuncHeadersNumberShape = PropTypes.shape({row: PropTypes.number.isRequired, col: PropTypes.func.isRequired, rowHeader: PropTypes.number.isRequired, colHeader: PropTypes.number.isRequired}),
	rowFuncColNumberHeadersNumberShape = PropTypes.shape({row: PropTypes.func.isRequired, col: PropTypes.number.isRequired, rowHeader: PropTypes.number.isRequired, colHeader: PropTypes.number.isRequired});

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
		 * The render function for an item of the list.
		 * `index` is for accessing the index of the item.
		 * `key` MUST be passed as a prop for DOM recycling.
		 * Data manipulation can be done in this function.
		 *
		 * @type {Function|Object}
		 * @public
		 */
		component: PropTypes.oneOfType([PropTypes.func, itemHeadersFuncShpae]).isRequired,

		/**
		 * Data for the list.
		 * Check mutation of this and determine whether the list should update or not.
		 *
		 * @type {Array|Object}
		 * @public
		 */
		data: PropTypes.oneOfType([PropTypes.array, itemHeadersAnyShape]).isRequired,

		/**
		 * Size of data for the list.
		 *
		 * @type {Object}
		 * @public
		 */
		dataSize: PropTypes.oneOfType([rowNumberColFuncShape, rowFuncColNumberShape, rowNumberColFuncHeadersNumberShape, rowFuncColNumberHeadersNumberShape]).isRequired,

		/**
		 * Size of an item for the list.
		 *
		 * @type {Object}
		 * @public
		 */
		itemSize: PropTypes.oneOfType([rowNumberColFuncShape, rowFuncColNumberShape, rowNumberColFuncHeadersNumberShape, rowFuncColNumberHeadersNumberShape]).isRequired,

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
			posX: 0,
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
			posY: 0,
			style: {width: 'calc(100% - ' + itemSize.rowHeader + 'px)', height: itemSize.row + 'px', left: itemSize.rowHeader + 'px'},
			component: component.colHeader
		},
		itemProps: ({component, data, dataSize, headers, itemSize, maxVariableScrollSize, posX, posY, variableAxis}) => (headers === 'none') ? null : {
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
		},
		childProps: ({headers, itemSize}) => (headers === 'none') ? null : {
			style: {width: itemSize.rowHeader + 'px', height: itemSize.row + 'px'}
		}
	},

	render: ({headers, rowProps, colProps, itemProps, childProps, children, className, style, ...listProps}) => {
		if  (headers === 'both') {
			return (
				<div className={classNames(className, css.headers)} style={style}>
					<PositionableVirtualList {...rowProps} />
					<PositionableVirtualList {...colProps} />
					<PositionableVirtualVariableList {...itemProps} />
					<div {...childProps}>{children}</div>
				</div>
			);
		} else {
			return (<PositionableVirtualVariableList {...listProps} className={className} style={style} />);
		}
	}
});

export default VirtualVariableList;
export {VirtualVariableList, PositionableVirtualVariableList, VirtualVariableListCore};
