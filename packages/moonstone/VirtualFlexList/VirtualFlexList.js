/**
 * Exports the {@link moonstone/VirtualFlexList/VirtualFlexList.VirtualFlexList} component.
 *
 * @module moonstone/VirtualFlexList/VirtualFlexList
 */

import classNames from 'classnames';
import React, {PropTypes} from 'react';

import kind from '@enact/core/kind';

import {VirtualListCore} from '../VirtualList/VirtualListBase';

import Positionable from './Positionable';
import {VirtualFlexListCore} from './VirtualFlexListCore';

import css from './VirtualFlexList.less';

const
	PositionableVirtualList = Positionable(VirtualListCore),
	PositionableVirtualFlexList = Positionable(VirtualFlexListCore);

// PropTypes shape

/**
 * The shape for the component of the list corner. for {@link moonstone/VirtualFlexList.corner}.
 *
 * @typedef {Object} cornerShape
 * @memberof moonstone/VirtualFlexList
 * @property {Object} component - React component, a render function or DOM elements.
 */

const cornerShape = PropTypes.shape({
	component: PropTypes.object.isRequired
});

/**
 * The information of a column or a row header for {@link moonstone/VirtualFlexList.headersShape}.
 *
 * @typedef {Object} headersColumnOrRow
 * @memberof moonstone/VirtualFlexList
 * @property {Function} component - The render function for an item.
 * @property {Number} count - Item count. It should be a number.
 * @property {Object} data - Any data which is passed as the render funtion.
 * @property {Number} height - The item height.
 * @property {Number} width - The item width.
 */

/**
 * The shape for the a column or a row headers in a list. for {@link moonstone/VirtualFlexList.headers}.
 *
 * @typedef {Object} headersShape
 * @memberof moonstone/VirtualFlexList
 * @property {headersColumnOrRow} col - The information of a column header.
 * @property {headersColumnOrRow} row - The information of a row header.
 */
const headersShape = PropTypes.shape({
	row: PropTypes.shape({
		component: PropTypes.func.isRequired,
		count:  PropTypes.number.isRequired,
		data: PropTypes.any.isRequired,
		height: PropTypes.number.isRequired,
		width: PropTypes.number.isRequired
	}),
	col: PropTypes.shape({
		component: PropTypes.func.isRequired,
		count:  PropTypes.number.isRequired,
		data: PropTypes.any.isRequired,
		height: PropTypes.number.isRequired,
		width: PropTypes.number.isRequired
	})
});

/**
 * The number of item row information in a list for {@link moonstone/VirtualFlexList.itemsShape}.
 *
 * @typedef {Object} itemsCol
 * @memberof moonstone/VirtualFlexList
 * @property {Number|Function} count - Item count. It could be a number or the function to get it.
 */

/**
 *  The number of item column information in a list {@link moonstone/VirtualFlexList.itemsShape}.
 *
 * @typedef {Object} itemsRow
 * @memberof moonstone/VirtualFlexList
 * @property {Number|Function} count - Item count. It could be a number or the function to get it.
 */

/**
 * The shape for the list items. for {@link moonstone/VirtualFlexList.items}.
 *
 * @typedef {Object} itemsShape
 * @memberof moonstone/VirtualFlexList
 * @property {itemsCol} col - It has `count` property for the number of items horizontally.
 * @property {Number|Function} component - The render function for an item.
 * @property {Object} data - Any data which is passed as the render funtion.
 * @property {Number|Function} height - The item height.
 * @property {itemsRow} row - It has `count` property for the number of items vertically.
 * @property {Number|Function} width - The item width.
 */
const itemsShape = PropTypes.oneOfType([
	PropTypes.shape({
		col: PropTypes.shape({
			count: PropTypes.func.isRequired
		}),
		component: PropTypes.func.isRequired,
		data: PropTypes.any.isRequired,
		height: PropTypes.number.isRequired,
		row: PropTypes.shape({
			count: PropTypes.number.isRequired
		}),
		width: PropTypes.func.isRequired
	}),
	PropTypes.shape({
		col: PropTypes.shape({
			count: PropTypes.number.isRequired
		}),
		component: PropTypes.func.isRequired,
		data: PropTypes.any.isRequired,
		height: PropTypes.func.isRequired,
		row: PropTypes.shape({
			count: PropTypes.func.isRequired
		}),
		width: PropTypes.number.isRequired
	})
]);

/**
 * {@link module:@enact/moonstone/VirtualFlexList~VirtualFlexList} is a VirtualFlexList with Moonstone styling
 * which has a variable width or height.
 *
 * @class VirtualFlexList
 * @ui
 * @public
 */
const VirtualFlexList = kind({
	name: 'VirtualFlexList',

	propTypes: /** @lends moonstone/VirtualFlexList.VirtualFlexList.prototype */ {
		/**
		 * List items including the following properties.
		 *
		 * `col` has `count` property for the number of items horizontally.
		 * `component` is the render function for an item.
		 * `data` is any data which is passed as the render funtion.
		 * `height` is the item height.
		 * `row` has `count` property for the number of items vertically.
		 * `width` is the item width.
		 *
		 * The object including `data`, `index`, and `key` properties
		 * is passed as the parameter of the `component` render function.
		 *
		 * `data` is the same prop with this prop.
		 * `index` is for accessing the index of the item and is the object
		 * which has `row` property for a row index and `col` property for a column index.
		 * `key` MUST be passed as a prop for DOM recycling.
		 *
		 * @type {moonstone/VirtualFlexList.itemShape}
		 * @public
		 */
		items: itemsShape.isRequired,

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
		 * The component for the list corner.
		 * It has `component` property to render the list corner.
		 *
		 * @type {moonstone/VirtualFlexList.cornerShape}
		 * @public
		 */
		corner: cornerShape,

		/**
		 * List row and column headers including the following properties.
		 *
		 * `col` for a column header
		 * `row` for a row header
		 *
		 * Thoese properties have the following properties.
		 *
		 * `component` is the render function for an item.
		 * `count` is the property for the number of items vertically.
		 * `data` is any data which is passed as the render funtion.
		 * `height` is the item height.
		 * `width` is the item width.
		 *
		 * `data` is the same prop with this prop.
		 * `index` is for accessing the index of the item and is an number.
		 * `key` MUST be passed as a prop for DOM recycling.
		 *
		 * @type {moonstone/VirtualFlexList.headersShape}
		 * @public
		 */
		headers: headersShape,

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

	styles: {
		css,
		className: 'virtualFlexList'
	},

	computed: {
		colHeaderProps: ({headers, x}) => (
			headers ?
			{
				data: headers.col.data,
				dataSize: headers.col.count,
				direction: 'horizontal',
				itemSize: headers.col.width,
				x,
				style: {width: 'calc(100% - ' + headers.row.width + 'px)', height: headers.col.height + 'px', left: headers.row.width + 'px'},
				component: headers.col.component
			} :
			null
		),
		cornerProps: ({headers}) => (
			headers ?
			{style: {width: headers.row.width + 'px', height: headers.col.height + 'px', overflow: 'hidden'}} :
			null
		),
		itemProps: ({headers, items, maxVariableScrollSize, variableAxis, x, y}) => ({
			data: items.data,
			dataSize: {
				row: items.row.count,
				col: items.col.count
			},
			itemSize: {
				row: items.height,
				col: items.width
			},
			maxVariableScrollSize,
			x,
			y,
			variableAxis,
			style: headers ?
				{width: 'calc(100% - ' + headers.row.width + 'px)', height: 'calc(100% - ' + headers.col.height + 'px)', top: headers.col.height + 'px', left: headers.row.width + 'px'} :
				{width: '100%', height: '100%'},
			component: items.component
		}),
		rowHeaderProps: ({headers, y}) => (
			headers ?
			{
				data: headers.row.data,
				dataSize: headers.row.count,
				direction: 'vertical',
				itemSize: headers.row.height,
				y,
				style: {width: headers.row.width + 'px', height: 'calc(100% - ' + headers.row.height + 'px)', top: headers.col.height + 'px'},
				component: headers.row.component
			} :
			null
		)
	},

	render: ({className, colHeaderProps, corner, cornerProps, headers, itemProps, rowHeaderProps, ...rest}) => {
		const cornerComponent = corner ? corner.component : null;

		delete rest.items;
		delete rest.maxVariableScrollSize;
		delete rest.variableAxis;
		delete rest.x;
		delete rest.y;

		if (headers) {
			return (
				<div {...rest} className={classNames(className, css.headers)}>
					<PositionableVirtualList {...rowHeaderProps} />
					<PositionableVirtualList {...colHeaderProps} />
					<PositionableVirtualFlexList {...itemProps} />
					<div {...cornerProps}>{cornerComponent}</div>
				</div>
			);
		} else {
			return (<PositionableVirtualFlexList {...rest} {...itemProps} className={className} />);
		}
	}
});

export default VirtualFlexList;
export {VirtualFlexList, VirtualFlexList as VirtualFlexListBase};
