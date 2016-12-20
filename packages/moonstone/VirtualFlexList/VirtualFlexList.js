/**
 * Exports the {@link moonstone/VirtualFlexList.VirtualFlexList} and
 * {@link moonstone/VirtualFlexList.VirtualFlexListBase} components.
 * The default export is {@link moonstone/VirtualFlexList.VirtualFlexList}.
 *
 * @module moonstone/VirtualFlexList/VirtualFlexList
 */

import classNames from 'classnames';
import React, {Component, PropTypes} from 'react';

import {SpotlightContainerDecorator} from '@enact/spotlight';

import {VirtualListCore} from '../VirtualList/VirtualListBase';

import Positionable from './Positionable';
import {VirtualFlexListCore} from './VirtualFlexListCore';

import css from './VirtualFlexList.less';

const
	PositionableVirtualList = Positionable(VirtualListCore),
	SpotlightPositionableVirtualList = SpotlightContainerDecorator(Positionable(VirtualListCore)),
	SpotlightPositionableVirtualFlexList = SpotlightContainerDecorator(Positionable(VirtualFlexListCore));

const nop = () => {};

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
 * The shape for the list items. for {@link moonstone/VirtualFlexList.items}.
 *
 * @typedef {Object} itemsShape
 * @memberof moonstone/VirtualFlexList
 * @property {Number|Function} col - The number of items or the function to get it horizontally.
 * @property {Function} component - The render function for an item.
 * @property {Object} data - Any data which is passed as the render funtion.
 * @property {Number|Function} height - The item height.
 * @property {Number|Function} row - The number of items or the function to get it vertically.
 * @property {Number|Function} width - The item width.
 */
const itemsShape = PropTypes.oneOfType([
	PropTypes.shape({
		colCount: PropTypes.func.isRequired,
		component: PropTypes.func.isRequired,
		data: PropTypes.any.isRequired,
		height: PropTypes.number.isRequired,
		rowCount: PropTypes.number.isRequired,
		width: PropTypes.func.isRequired
	}),
	PropTypes.shape({
		colCount: PropTypes.number.isRequired,
		component: PropTypes.func.isRequired,
		data: PropTypes.any.isRequired,
		height: PropTypes.func.isRequired,
		rowCount: PropTypes.func.isRequired,
		width: PropTypes.number.isRequired
	})
]);

/**
 * {@link module:@enact/moonstone/VirtualFlexList~VirtualFlexList} is a VirtualFlexList with Moonstone styling
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
		 * `col` has `count` property for the number of items horizontally.
		 * `component` is the render function for an item.
		 * `data` is any data which is passed as the render funtion.
		 * `height` is the item height.
		 * `row` has `count` property for the number of items vertically.
		 * `width` is the item width.
		 * `background` is for `background` style.
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
		 * It has `component` property to render the list corner and
		 * `background` property for `background` style.
		 *
		 * @type {moonstone/VirtualFlexList.cornerShape}
		 * @public
		 */
		corner: cornerShape,

		/**
		 * Called when position updates
		 *
		 * @type {Function}
		 * @public
		 */
		doPosition: PropTypes.func,

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
		 * `background` is for `background` style.
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
	}

	static defaultProps = {
		doPosition: nop
	}

	constructor (props) {
		super(props);

		this.state = {
			x: props.x,
			y: props.y
		};
	}

	doPosition = ({x, y}) => {
		this.setState({x, y});
		this.props.doPosition({x, y});
	}

	componentWillReceiveProps (nextProps) {
		const {x, y} = this.props;

		if (x !== nextProps.x || y !== nextProps.y) {
			this.setState({x: nextProps.x, y: nextProps.y});
		}
	}

	render () {
		const
			{items, maxVariableScrollSize, variableAxis, corner, headers, ...rest} = this.props,
			cornerComponent = corner ? corner.component : null,
			colHeaderProps = (
				headers ?
				{
					data: headers.col.data,
					dataSize: headers.col.count,
					direction: 'horizontal',
					itemSize: headers.col.width,
					x: this.state.x,
					style: {background: headers.col.background, width: 'calc(100% - ' + headers.row.width + 'px)', height: headers.col.height + 'px', left: headers.row.width + 'px'},
					component: headers.col.component
				} :
				null
			),
			cornerProps = (
				headers ?
				{style: {background: corner.background, width: headers.row.width + 'px', height: headers.col.height + 'px', overflow: 'hidden'}} :
				null
			),
			itemProps = {
				data: items.data,
				dataSize: {
					row: items.rowCount,
					col: items.colCount
				},
				doPosition: this.doPosition,
				itemSize: {
					row: items.height,
					col: items.width
				},
				maxVariableScrollSize,
				navigation: true,
				x: this.state.x,
				y: this.state.y,
				variableAxis,
				style: headers ?
					{background: items.background, width: 'calc(100% - ' + headers.row.width + 'px)', height: 'calc(100% - ' + headers.col.height + 'px)', top: headers.col.height + 'px', left: headers.row.width + 'px'} :
					{background: items.background, width: '100%', height: '100%'},
				component: items.component
			},
			rowHeaderProps = (
				headers ?
				{
					data: headers.row.data,
					dataSize: headers.row.count,
					direction: 'vertical',
					doPosition: this.doPosition,
					itemSize: headers.row.height,
					navigation: true,
					pageScroll: true,
					y: this.state.y,
					style: {background: headers.row.background, width: headers.row.width + 'px', height: 'calc(100% - ' + headers.row.height + 'px)', top: headers.col.height + 'px'},
					component: headers.row.component
				} :
				null
			);

		delete rest.doPosition;

		if (headers) {
			return (
				<div {...rest} className={classNames(css.virtualFlexList, css.headers)}>
					<SpotlightPositionableVirtualList {...rowHeaderProps} />
					<PositionableVirtualList {...colHeaderProps} />
					<SpotlightPositionableVirtualFlexList {...itemProps} />
					<div {...cornerProps}>{cornerComponent}</div>
				</div>
			);
		} else {
			return (<SpotlightPositionableVirtualFlexList {...rest} {...itemProps} className={css.virtualFlexList} />);
		}
	}
}

export default VirtualFlexList;
export {VirtualFlexList, VirtualFlexList as VirtualFlexListBase};
