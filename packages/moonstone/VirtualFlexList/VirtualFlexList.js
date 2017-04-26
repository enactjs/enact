/**
 * Exports the {@link moonstone/VirtualFlexList.VirtualFlexList} and
 * {@link moonstone/VirtualFlexList.VirtualFlexListBase} components.
 * The default export is {@link moonstone/VirtualFlexList.VirtualFlexList}.
 *
 * @module moonstone/VirtualFlexList
 */

import classNames from 'classnames';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import {forward} from '@enact/core/handle';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

import {VirtualListCore} from '../VirtualList/VirtualListBase';

import css from './VirtualFlexList.less';
import Positionable from './Positionable';
import {VirtualFlexListBase} from './VirtualFlexListBase';

const
	PositionableVirtualList = Positionable(VirtualListCore),
	SpotlightPositionableVirtualList = SpotlightContainerDecorator({enterTo: ''}, Positionable(VirtualListCore));

const forwardPositionChange = forward('onPositionChange');

const nop = () => {};

// PropTypes shape

/**
 * The shape for the component of the list corner for {@link moonstone/VirtualFlexList.corner}.
 *
 * @typedef {Object} cornerShape
 * @memberof moonstone/VirtualFlexList
 * @property {Object} component - React element, a render function.
 * @property {String} background - Background inline style.
 */

const cornerShape = PropTypes.shape({
	component: PropTypes.object.isRequired,
	background: PropTypes.string
});

/**
 * The information of a column or a row header for {@link moonstone/VirtualFlexList.headersShape}.
 *
 * @typedef {Object} headersColumnOrRow
 * @memberof moonstone/VirtualFlexList
 * @property {Function} component - The render function for an item.
 * @property {Number} count - Item count. It should be a number.
 * @property {Object} data - Any data which is passed to the render funtion.
 * @property {Number} height - The item height.
 * @property {Number} width - The item width.
 * @property {String} background - Background inline style.
 */

/**
 * The shape for the a column or a row headers in a list for {@link moonstone/VirtualFlexList.headers}.
 *
 * @typedef {Object} headersShape
 * @memberof moonstone/VirtualFlexList
 * @property {headersColumnOrRow} col - The information of a column header.
 * @property {headersColumnOrRow} row - The information of a row header.
 */
const headersShape = PropTypes.shape({
	row: PropTypes.shape({
		component: PropTypes.func.isRequired,
		count: PropTypes.number.isRequired,
		data: PropTypes.any.isRequired,
		height: PropTypes.number.isRequired,
		width: PropTypes.number.isRequired,
		background: PropTypes.string
	}),
	col: PropTypes.shape({
		component: PropTypes.func.isRequired,
		count: PropTypes.number.isRequired,
		data: PropTypes.any.isRequired,
		height: PropTypes.number.isRequired,
		width: PropTypes.number.isRequired,
		background: PropTypes.string
	})
});

/**
 * The shape for the list items for {@link moonstone/VirtualFlexList.items}.
 *
 * @typedef {Object} itemsShape
 * @memberof moonstone/VirtualFlexList
 * @property {Number|Function} colCount - The number of items or the function to get it horizontally.
 * @property {Function} component - The render function for an item.
 * @property {Object} data - Any data which is passed to the render funtion.
 * @property {Number|Function} height - The item height.
 * @property {Number|Function} rowCount - The number of items or the function to get it vertically.
 * @property {Number|Function} width - The item width.
 * @property {String} background - Background inline style.
 */
const itemsShape = PropTypes.oneOfType([
	PropTypes.shape({
		colCount: PropTypes.func.isRequired,
		component: PropTypes.func.isRequired,
		data: PropTypes.any.isRequired,
		height: PropTypes.number.isRequired,
		rowCount: PropTypes.number.isRequired,
		width: PropTypes.func.isRequired,
		background: PropTypes.string
	}),
	PropTypes.shape({
		colCount: PropTypes.number.isRequired,
		component: PropTypes.func.isRequired,
		data: PropTypes.any.isRequired,
		height: PropTypes.func.isRequired,
		rowCount: PropTypes.func.isRequired,
		width: PropTypes.number.isRequired,
		background: PropTypes.string
	})
]);

/**
 * {@link moonstone/VirtualFlexList~VirtualFlexList} is a VirtualFlexList with Moonstone styling
 * which has a variable width or height.
 *
 * @class VirtualFlexList
 * @memberof moonstone/VirtualFlexList
 * @ui
 * @public
 */
class VirtualFlexList extends Component {
	static propTypes = /** @lends moonstone/VirtualFlexList.VirtualFlexList.prototype */ {
		/**
		 * List items including the following properties.
		 *
		 * `colCount` is the number of items horizontally.
		 * `component` is the render function for an item.
		 * `data` is any data which is passed to the render funtion.
		 * `height` is the item height.
		 * `rowCount` is the number of items vertically.
		 * `width` is the item width.
		 * `background` is for `background` inline style.
		 *
		 * The object including `data`, `index`, and `key` properties
		 * are passed as the parameters of the `component` render function.
		 *
		 * @type {moonstone/VirtualFlexList.itemsShape}
		 * @public
		 */
		items: itemsShape.isRequired,

		/**
		 * The predefined maxScrollSize for variable width or height.
		 *
		 * @type {Number}
		 * @public
		 */
		maxFlexScrollSize: PropTypes.number.isRequired,

		/**
		 * The component for corner in a list.
		 * It has `component` property to render the list corner and
		 * `background` property for `background` inline style.
		 *
		 * @type {moonstone/VirtualFlexList.cornerShape}
		 * @public
		 */
		corner: cornerShape,

		/**
		 * Row and column headers in a list including the following properties.
		 *
		 * `col` for a column header
		 * `row` for a row header
		 *
		 * Thoese properties have the following properties.
		 *
		 * `component` is the render function for an item.
		 * `count` is the property for the number of items vertically.
		 * `data` is any data which is passed to the render funtion.
		 * `height` is the item height.
		 * `width` is the item width.
		 * `background` is for `background` inline style.
		 *
		 * @type {moonstone/VirtualFlexList.headersShape}
		 * @public
		 */
		headers: headersShape,

		/**
		 * Called when position updates
		 *
		 * The object including `x`, `y` properties for position,
		 * are passed as the parameters of the `onPositionChange` callback function.
		 *
		 * @type {Function}
		 * @public
		 */
		onPositionChange: PropTypes.func,

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
	}

	static contextTypes = contextTypes

	static defaultProps = {
		onPositionChange: nop
	}

	/*
	 * Constructor
	 */

	constructor (props, context) {
		super(props);

		this.state = {
			x: props.x,
			y: props.y
		};

		this.componentProps = this.getComponentProps(props, context);
	}

	/*
	 * Life cycle methods
	 */

	componentWillReceiveProps (nextProps, nextContext) {
		const
			{headers, items, x, y} = this.props,
			{rtl} = this.context;

		if (
			items.colCount !== nextProps.items.colCount || items.height !== nextProps.items.height || items.rowCount !== nextProps.items.rowCount ||
			headers && (headers.col.count !== nextProps.headers.col.count || headers.row.count !== nextProps.headers.row.count) ||
			rtl !== nextContext.rtl
		) {
			this.componentProps = this.getComponentProps(nextProps, nextContext);
		}

		if (x !== nextProps.x || y !== nextProps.y) {
			this.setState({x: nextProps.x, y: nextProps.y});
		}
	}

	/*
	 * Calculate the position and the size of the header and the item lists.
	 */

	getColHeaderProps = ({headers}, {itemsOriginLeft, itemsOriginTop, itemsListWidth}) => ({
		data: headers.col.data,
		dataSize: headers.col.count,
		direction: 'horizontal',
		itemSize: headers.col.width,
		style: {background: headers.col.background, width: itemsListWidth, height: itemsOriginTop, transform: 'translate3d(' + itemsOriginLeft + ', 0, 0)'},
		component: headers.col.component
	})

	getCornerProps = ({corner, headers}, {itemsOriginLeft, itemsOriginTop}) => ({
		style: {background: corner.background, width: itemsOriginLeft, height: itemsOriginTop, overflow: 'hidden', transform: 'translate3d(0, 0, 0)'}
	})

	getItemsProps = ({headers, items, maxFlexScrollSize}, {itemsOriginLeft, itemsOriginTop, itemsListWidth, itemsListHeight}, flexAxis) => ({
		data: items.data,
		dataSize: {
			row: items.rowCount,
			col: items.colCount
		},
		flexAxis,
		handlesNavigation: true,
		itemSize: {
			row: items.height,
			col: items.width
		},
		maxFlexScrollSize,
		onPositionChange: this.onPositionChange,
		style: {background: items.background, width: itemsListWidth, height: itemsListHeight, transform: 'translate3d(' + itemsOriginLeft + ', ' + itemsOriginTop + ', 0)'},
		component: items.component
	})

	getRowHeaderProps = ({headers}, {itemsOriginLeft, itemsOriginTop, itemsListHeight}) => ({
		data: headers.row.data,
		dataSize: headers.row.count,
		direction: 'vertical',
		handlesNavigation: true,
		itemSize: headers.row.height,
		onPositionChange: this.onPositionChange,
		pageScroll: true,
		style: {background: headers.row.background, width: itemsOriginLeft, height: itemsListHeight, transform: 'translate3d(0, ' + itemsOriginTop + ', 0)'},
		component: headers.row.component
	})

	getComponentProps = (props, context) => {
		const
			{corner, headers, items} = props,
			flexAxis = (typeof items.colCount === 'function' && typeof items.width === 'function') ? 'row' : 'col',
			rtlDirection = context.rtl ? -1 : 1;

		if (headers) {
			const size = {
				itemsOriginLeft: headers.row.width * rtlDirection + 'px',
				itemsOriginTop: headers.col.height + 'px',
				itemsListWidth: 'calc(100% - ' + headers.row.width + 'px)',
				itemsListHeight: 'calc(100% - ' + headers.col.height + 'px)'
			};

			return {
				corner: corner ? this.getCornerProps(props, size) : null,
				headers: {
					col: this.getColHeaderProps(props, size),
					row: this.getRowHeaderProps(props, size)
				},
				items: this.getItemsProps(props, size, flexAxis)
			};
		} else {
			return {
				items: this.getItemsProps(props, {
					itemsOriginLeft: 0,
					itemsOriginTop: 0,
					itemsListWidth: '100%',
					itemsListHeight: '100%'
				}, flexAxis)
			};
		}
	}

	getCorner = (corner, props) => (corner ? <div {...props}>{corner.component}</div> : null)

	/*
	 * Callback functions
	 */

	onPositionChange = (position) => {
		this.setState(position);
		forwardPositionChange(position, this.props);
	}

	render () {
		const
			props = Object.assign({}, this.props),
			{x, y} = this.state,
			componentProps = this.componentProps;

		delete props.corner;
		delete props.headers;
		delete props.items;
		delete props.maxFlexScrollSize;
		delete props.onPositionChange;
		delete props.x;
		delete props.y;

		return (this.props.headers ?
			<div {...props} className={classNames(css.virtualFlexList, css.headers)}>
				<SpotlightPositionableVirtualList {...componentProps.headers.row} y={y} />
				<PositionableVirtualList {...componentProps.headers.col} x={x} />
				<VirtualFlexListBase {...componentProps.items} x={x} y={y} />
				{this.getCorner(this.props.corner, componentProps.corner)}

			</div> :
			<VirtualFlexListBase {...props} {...componentProps.items} x={x} y={y} className={css.virtualFlexList} />
		);
	}
}

export default VirtualFlexList;
export {VirtualFlexList, VirtualFlexListBase};
