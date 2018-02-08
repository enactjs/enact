/**
 * Provides unstyled virtual list components and behaviors to be customized by a theme or application.
 *
 * @module ui/VirtualList
 * @exports VirtualList,
 * @exports gridListItemSizeShape,
 * @exports VirtualGridList,
 * @exports VirtualGridListNative,
 * @exports VirtualListBase,
 * @exports VirtualListBaseNative,
 * @exports VirtualListNative
 */

import classNames from 'classnames';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Scrollable, {ScrollableNative} from '../Scrollable';

import css from './VirtualListNative.less';
import cssItem from './ListItem.less';

const nop = () => {};

/**
 * [gridListItemSizeShape]{@link ui/VirtualList.gridListItemSizeShape} is the shape for the grid list item size
 * in a list for [VirtualGridList]{@link ui/VirtualList.VirtualGridList}.
 *
 * @typedef {Object} gridListItemSizeShape
 * @memberof ui/VirtualList
 * @property {Number} minWidth - The minimum width of the grid list item.
 * @property {Number} minHeight - The minimum height of the grid list item.
 */
const gridListItemSizeShape = PropTypes.shape({
	minWidth: PropTypes.number.isRequired,
	minHeight: PropTypes.number.isRequired
});

/**
 * [VirtualListBase]{@link ui/VirtualList.VirtualListBase} is a base component for
 * [VirtualList]{@link ui/VirtualList.VirtualList} and
 * [VirtualGridList]{@link ui/VirtualList.VirtualGridList}.
 *
 * @class VirtualListBase
 * @memberof ui/VirtualList
 * @ui
 * @public
 */
class VirtualListBase extends Component {
	static displayName = 'ui:VirtualListBase'

	static propTypes = /** @lends ui/VirtualList.VirtualListBase.prototype */ {
		/**
		 * The `render` function for an item of the list receives the following parameters:
		 * - `data` is for accessing the supplied `data` property of the list.
		 * > NOTE: In most cases, it is recommended to use data from redux store instead of using
		 * is parameters due to performance optimizations
		 * - `data-index` is required for Spotlight 5-way navigation.  Pass to the root element in
		 *   the component.
		 * - `index` is the index number of the componet to render
		 * - `key` MUST be passed as a prop to the root element in the component for DOM recycling.
		 *
		 * Data manipulation can be done in this function.
		 *
		 * > NOTE: The list does NOT always render a component whenever its render function is called
		 * due to performance optimization.
		 *
		 * Usage:
		 * ```
		 * renderItem = ({index, ...rest}) => {
		 *		delete rest.data;
		 *
		 *		return (
		 *			<MyComponent index={index} {...rest} />
		 *		);
		 * }
		 * ```
		 *
		 * @type {Function}
		 * @public
		 */
		component: PropTypes.func.isRequired,

		/**
		 * Size of an item for the list; valid values are either a number for `VirtualList`
		 * or an object that has `minWidth` and `minHeight` for `VirtualGridList`.
		 *
		 * @type {Number|ui/VirtualList.gridListItemSizeShape}
		 * @public
		 */
		itemSize: PropTypes.oneOfType([
			PropTypes.number,
			gridListItemSizeShape
		]).isRequired,

		/**
		 * Callback method of scrollTo.
		 * Normally, `Scrollable` should set this value.
		 *
		 * @type {Function}
		 * @private
		 */
		cbScrollTo: PropTypes.func,

		/**
		 * Client size of the list; valid values are an object that has `clientWidth` and `clientHeight`.
		 *
		 * @type {Object}
		 * @property {Number} clientWidth - The client width of the list.
		 * @property {Number} clientHeight - The client height of the list.
		 * @public
		 */
		clientSize: PropTypes.shape({
			clientWidth: PropTypes.number.isRequired,
			clientHeight:  PropTypes.number.isRequired
		}),

		/**
		 * Data for passing through to the `component` prop.
		 * NOTICE: For performance reason, changing this prop does NOT always cause the list to
		 * redraw its items.
		 *
		 * @type {Any}
		 * @default []
		 * @public
		 */
		data: PropTypes.any,

		/**
		 * Spotlight container Id for VirtualListNative
		 *
		 * @type {String}
		 * @private
		 */
		'data-container-id': PropTypes.string, // eslint-disable-line react/sort-prop-types

		/**
		 * Size of the data.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		dataSize: PropTypes.number,

		/**
		 * Direction of the list; valid values are `'horizontal'` and `'vertical'`.
		 *
		 * @type {String}
		 * @default 'vertical'
		 * @public
		 */
		direction: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * Number of spare DOM node.
		 * `3` is good for the default value experimentally and
		 * this value is highly recommended not to be changed by developers.
		 *
		 * @type {Number}
		 * @default 3
		 * @private
		 */
		overhang: PropTypes.number,

		/**
		 * It scrolls by page when 'true', by item when 'false'
		 *
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		pageScroll: PropTypes.bool,

		/**
		 * Spacing between items.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		spacing: PropTypes.number,

		/**
		 * Specifies how to scroll depending on JavaScript or Native
		 *
		 * @type {String}
		 * @public
		 */
		type: PropTypes.oneOf(['JS', 'Native'])
	}

	static contextTypes = contextTypes

	static defaultProps = {
		cbScrollTo: nop,
		data: [],
		dataSize: 0,
		direction: 'vertical',
		overhang: 3,
		pageScroll: false,
		spacing: 0
	}

	constructor (props) {
		super(props);

		this.state = {firstIndex: 0, numOfItems: 0};
		this.initContainerRef = this.initRef('containerRef');

		this.didScroll = this.setScrollPosition;
	}

	componentWillMount () {
		if (this.props.clientSize) {
			this.calculateMetrics(this.props);
			this.updateStatesAndBounds(this.props);
		}
	}

	// Calculate metrics for VirtualList after the 1st render to know client W/H.
	// We separate code related with data due to re use it when data changed.
	componentDidMount () {
		const {type} = this.props;

		if (!this.props.clientSize) {
			this.calculateMetrics(this.props);
			this.updateStatesAndBounds(this.props);
		}

		if (type === 'JS') {
			const containerNode = this.containerRef;

			// prevent native scrolling by Spotlight
			this.preventScroll = () => {
				containerNode.scrollTop = 0;
				containerNode.scrollLeft = this.context.rtl ? containerNode.scrollWidth : 0;
			};

			if (containerNode && containerNode.addEventListener) {
				containerNode.addEventListener('scroll', this.preventScroll);
			}
		} else if (type === 'Native') {
			this.setContainerSize();
		}
	}

	// Call updateStatesAndBounds here when dataSize has been changed to update nomOfItems state.
	// Calling setState within componentWillReceivePropswill not trigger an additional render.
	componentWillReceiveProps (nextProps) {
		const
			{dataSize, direction, itemSize, overhang, spacing, type} = this.props,
			hasMetricsChanged = (
				direction !== nextProps.direction ||
				((itemSize instanceof Object) ? (itemSize.minWidth !== nextProps.itemSize.minWidth || itemSize.minHeight !== nextProps.itemSize.minHeight) : itemSize !== nextProps.itemSize) ||
				overhang !== nextProps.overhang ||
				spacing !== nextProps.spacing
			),
			hasDataChanged = (dataSize !== nextProps.dataSize);

		if (hasMetricsChanged) {
			this.calculateMetrics(nextProps);
			this.updateStatesAndBounds(nextProps);
			if (type === 'Native') {
				this.setContainerSize();
			}
		} else if (hasDataChanged) {
			this.updateStatesAndBounds(nextProps);
			if (type === 'Native') {
				this.setContainerSize();
			}
		}
	}

	componentWillUnmount () {
		const {type} = this.props;

		if (type === 'JS') {
			const containerNode = this.containerRef;

			// remove a function for preventing native scrolling by Spotlight
			if (containerNode && containerNode.removeEventListener) {
				containerNode.removeEventListener('scroll', this.preventScroll);
			}
		}
	}

	scrollBounds = {
		clientWidth: 0,
		clientHeight: 0,
		scrollWidth: 0,
		scrollHeight: 0,
		maxLeft: 0,
		maxTop: 0
	}

	moreInfo = {
		firstVisibleIndex: null,
		lastVisibleIndex: null
	}

	primary = null
	secondary = null

	isPrimaryDirectionVertical = true
	isItemSized = false

	dimensionToExtent = 0
	threshold = 0
	maxFirstIndex = 0
	curDataSize = 0
	cc = []
	scrollPosition = 0

	// JS
	updateFrom = null
	updateTo = null

	// Native
	lastFirstIndex = 0
	isScrolledByJump = false
	containerClass = null
	contentRef = null

	containerRef = null

	isVertical = () => this.isPrimaryDirectionVertical

	isHorizontal = () => !this.isPrimaryDirectionVertical

	getScrollBounds = () => this.scrollBounds

	getMoreInfo = () => this.moreInfo

	getGridPosition (index) {
		const
			{dimensionToExtent, primary, secondary} = this,
			primaryPosition = Math.floor(index / dimensionToExtent) * primary.gridSize,
			secondaryPosition = (index % dimensionToExtent) * secondary.gridSize;

		return {primaryPosition, secondaryPosition};
	}

	getItemPosition = (index, stickTo = 'start') => {
		const
			{primary} = this,
			position = this.getGridPosition(index),
			offset = (stickTo === 'start') ? 0 : primary.clientSize - primary.itemSize;

		position.primaryPosition -= offset;

		return this.gridPositionToItemPosition(position);
	}

	gridPositionToItemPosition = ({primaryPosition, secondaryPosition}) =>
		(this.isPrimaryDirectionVertical ? {left: secondaryPosition, top: primaryPosition} : {left: primaryPosition, top: secondaryPosition})

	getClientSize = (node) => ({
		clientWidth: node.clientWidth,
		clientHeight: node.clientHeight
	})

	calculateMetrics (props) {
		const
			{clientSize, direction, itemSize, spacing} = props,
			node = this.containerRef;

		if (!clientSize && !node) {
			return;
		}

		const
			{clientWidth, clientHeight} = (clientSize || this.getClientSize(node)),
			heightInfo = {
				clientSize: clientHeight,
				minItemSize: itemSize.minHeight || null,
				itemSize: itemSize
			},
			widthInfo = {
				clientSize: clientWidth,
				minItemSize: itemSize.minWidth || null,
				itemSize: itemSize
			};
		let primary, secondary, dimensionToExtent, thresholdBase;

		this.isPrimaryDirectionVertical = (direction === 'vertical');

		if (this.isPrimaryDirectionVertical) {
			primary = heightInfo;
			secondary = widthInfo;
		} else {
			primary = widthInfo;
			secondary = heightInfo;
		}
		dimensionToExtent = 1;

		this.isItemSized = (primary.minItemSize && secondary.minItemSize);

		if (this.isItemSized) {
			// the number of columns is the ratio of the available width plus the spacing
			// by the minimum item width plus the spacing
			dimensionToExtent = Math.max(Math.floor((secondary.clientSize + spacing) / (secondary.minItemSize + spacing)), 1);
			// the actual item width is a ratio of the remaining width after all columns
			// and spacing are accounted for and the number of columns that we know we should have
			secondary.itemSize = Math.floor((secondary.clientSize - (spacing * (dimensionToExtent - 1))) / dimensionToExtent);
			// the actual item height is related to the item width
			primary.itemSize = Math.floor(primary.minItemSize * (secondary.itemSize / secondary.minItemSize));
		}

		primary.gridSize = primary.itemSize + spacing;
		secondary.gridSize = secondary.itemSize + spacing;
		thresholdBase = primary.gridSize * 2;

		this.threshold = {min: -Infinity, max: thresholdBase, base: thresholdBase};
		this.dimensionToExtent = dimensionToExtent;

		this.primary = primary;
		this.secondary = secondary;

		// reset
		this.scrollPosition = 0;
		// eslint-disable-next-line react/no-direct-mutation-state
		this.state.firstIndex = 0;
		// eslint-disable-next-line react/no-direct-mutation-state
		this.state.numOfItems = 0;
	}

	updateStatesAndBounds (props) {
		const
			{dataSize, overhang, type} = props,
			{firstIndex} = this.state,
			{dimensionToExtent, primary, moreInfo, scrollPosition} = this,
			numOfItems = Math.min(dataSize, dimensionToExtent * (Math.ceil(primary.clientSize / primary.gridSize) + overhang)),
			wasFirstIndexMax = ((this.maxFirstIndex < moreInfo.firstVisibleIndex - dimensionToExtent) && (firstIndex === this.maxFirstIndex)),
			dataSizeDiff = dataSize - this.curDataSize;
		let newFirstIndex = firstIndex;

		this.maxFirstIndex = Math.ceil((dataSize - numOfItems) / dimensionToExtent) * dimensionToExtent;
		this.curDataSize = dataSize;
		if (type === 'JS') {
			this.updateFrom = null;
			this.updateTo = null;
		}

		// reset children
		this.cc = [];
		this.calculateScrollBounds(props);
		this.updateMoreInfo(dataSize, scrollPosition);

		newFirstIndex = this.calculateFirstIndex(props, wasFirstIndexMax, dataSizeDiff);

		this.setState({firstIndex: newFirstIndex, numOfItems});
	}

	calculateFirstIndex (props, wasFirstIndexMax, dataSizeDiff) {
		const
			{overhang} = props,
			{firstIndex} = this.state,
			{dimensionToExtent, isPrimaryDirectionVertical, maxFirstIndex, primary, scrollBounds, scrollPosition, threshold} = this,
			{gridSize} = primary;
		let newFirstIndex = firstIndex;

		if (wasFirstIndexMax && dataSizeDiff > 0) { // If dataSize increased from bottom, we need adjust firstIndex
			// If this is a gridlist and dataSizeDiff is smaller than 1 line, we are adjusting firstIndex without threshold change.
			if (dimensionToExtent > 1 &&  dataSizeDiff < dimensionToExtent) {
				newFirstIndex = maxFirstIndex;
			} else { // For other bottom adding case, we need to update firstIndex and threshold.
				const
					maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft,
					maxOfMin = maxPos - threshold.base,
					numOfUpperLine = Math.floor(overhang / 2),
					firstIndexFromPosition = Math.floor(scrollPosition / gridSize),
					expectedFirstIndex = Math.max(0, firstIndexFromPosition - numOfUpperLine);

				// To navigate with 5way, we need to adjust firstIndex to the next line
				// since at the bottom we have num of overhang lines for upper side but none for bottom side
				// So we add numOfUpperLine at the top and rest lines at the bottom
				newFirstIndex = Math.min(maxFirstIndex, expectedFirstIndex * dimensionToExtent);

				// We need to update threshold also since we moved the firstIndex
				threshold.max = Math.min(maxPos, threshold.max + gridSize);
				threshold.min = Math.min(maxOfMin, threshold.max - gridSize);
			}
		} else { // Other cases, we can keep the min value between firstIndex and maxFirstIndex. No need to change threshold
			newFirstIndex = Math.min(firstIndex, maxFirstIndex);
		}

		return newFirstIndex;
	}

	calculateScrollBounds (props) {
		const
			{clientSize, type} = props,
			node = this.containerRef;

		if (!clientSize && !node) {
			return;
		}

		const
			{scrollBounds, isPrimaryDirectionVertical} = this,
			{clientWidth, clientHeight} = clientSize || this.getClientSize(node);
		let maxPos;

		scrollBounds.clientWidth = clientWidth;
		scrollBounds.clientHeight = clientHeight;
		scrollBounds.scrollWidth = this.getScrollWidth();
		scrollBounds.scrollHeight = this.getScrollHeight();
		scrollBounds.maxLeft = Math.max(0, scrollBounds.scrollWidth - clientWidth);
		scrollBounds.maxTop = Math.max(0, scrollBounds.scrollHeight - clientHeight);

		// correct position
		maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft;

		this.syncThreshold(maxPos);

		if (this.scrollPosition > maxPos) {
			this.props.cbScrollTo({position: (isPrimaryDirectionVertical) ? {y: maxPos} : {x: maxPos}, animate: false});
		}

		if (type === 'Native') {
			this.containerClass = (isPrimaryDirectionVertical) ? css.vertical : css.horizontal;
		}
	}

	updateMoreInfo (dataSize, primaryPosition) {
		const
			{dimensionToExtent, moreInfo} = this,
			{itemSize, gridSize, clientSize} = this.primary;

		if (dataSize <= 0) {
			moreInfo.firstVisibleIndex = null;
			moreInfo.lastVisibleIndex = null;
		} else {
			moreInfo.firstVisibleIndex = (Math.floor((primaryPosition - itemSize) / gridSize) + 1) * dimensionToExtent;
			moreInfo.lastVisibleIndex = Math.min(dataSize - 1, Math.ceil((primaryPosition + clientSize) / gridSize) * dimensionToExtent - 1);
		}
	}

	setContainerSize = () => {
		if (this.contentRef) {
			this.contentRef.style.width = this.scrollBounds.scrollWidth + 'px';
			this.contentRef.style.height = this.scrollBounds.scrollHeight + 'px';
		}
	}

	syncThreshold (maxPos) {
		const {threshold} = this;

		if (threshold.max > maxPos) {
			if (maxPos < threshold.base) {
				threshold.max = threshold.base;
				threshold.min = -Infinity;
			} else {
				threshold.max = maxPos;
				threshold.min = maxPos - threshold.base;
			}
		}
	}

	setScrollPosition (x, y, dirX, dirY) {
		const
			{dataSize, type} = this.props,
			{firstIndex, numOfItems} = this.state,
			{isPrimaryDirectionVertical, threshold, dimensionToExtent, maxFirstIndex, scrollBounds} = this,
			{gridSize} = this.primary,
			maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft,
			minOfMax = threshold.base,
			maxOfMin = maxPos - threshold.base;
		let delta, numOfGridLines, newFirstIndex = firstIndex, pos, dir = 0;

		if (isPrimaryDirectionVertical) {
			pos = y;
			dir = dirY;
		} else {
			pos = x;
			dir = dirX;
		}

		if (dir === 1 && pos > threshold.max) {
			delta = pos - threshold.max;
			numOfGridLines = Math.ceil(delta / gridSize); // how many lines should we add
			threshold.max = Math.min(maxPos, threshold.max + numOfGridLines * gridSize);
			threshold.min = Math.min(maxOfMin, threshold.max - gridSize);
			newFirstIndex += numOfGridLines * dimensionToExtent;
		} else if (dir === -1 && pos < threshold.min) {
			delta = threshold.min - pos;
			numOfGridLines = Math.ceil(delta / gridSize);
			threshold.max = Math.max(minOfMax, threshold.min - (numOfGridLines * gridSize - gridSize));
			threshold.min = (threshold.max > minOfMax) ? threshold.max - gridSize : -Infinity;
			newFirstIndex -= numOfGridLines * dimensionToExtent;
		}

		if (threshold.min === -Infinity) {
			newFirstIndex = 0;
		} else {
			newFirstIndex = Math.min(maxFirstIndex, newFirstIndex);
			newFirstIndex = Math.max(0, newFirstIndex);
		}

		this.syncThreshold(maxPos);
		this.scrollPosition = pos;
		this.updateMoreInfo(dataSize, pos);

		if (firstIndex !== newFirstIndex) {
			this.setState({firstIndex: newFirstIndex});
		} else if (type === 'JS') {
			this.positionItems({updateFrom: firstIndex, updateTo: firstIndex + numOfItems});
		}
	}

	applyStyleToExistingNode = (index, ...rest) => {
		const
			{numOfItems} = this.state,
			node = this.containerRef.children[index % numOfItems];

		if (node) {
			this.composeStyleJS(node.style, ...rest);
		}
	}

	applyStyleToNewNode = (index, ...rest) => {
		const
			{component, data, type} = this.props,
			{numOfItems} = this.state,
			key = index % numOfItems,
			itemElement = component({
				data,
				index,
				key
			}),
			style = {};

		if (type === 'JS') {
			this.composeStyleJS(style, ...rest);
		} else if (type === 'Native') {
			this.composeStyleNative(style, ...rest);
		}

		this.cc[key] = React.cloneElement(itemElement, type === 'JS' ? {
			className: classNames(cssItem.listItem, itemElement.props.className),
			style: {...itemElement.props.style, ...style}
		} : {
			className: classNames(cssItem.listItem, itemElement.props.className),
			['data-preventscrollonfocus']: true, // Added this attribute to prevent scroll on focus by browser
			style: {...itemElement.props.style, ...style}
		});
	}

	applyStyleToHideNode = (index) => {
		const
			key = index % this.state.numOfItems,
			style = {display: 'none'},
			attributes = {key, style};

		this.cc[key] = (<div {...attributes} />);
	}

	positionItems () {
		const {type} = this.props;

		if (type === 'JS') {
			const
				{dataSize} = this.props,
				{isPrimaryDirectionVertical, dimensionToExtent, primary, secondary, scrollPosition} = this;
			let
				{updateFrom, updateTo} = Object.assign({}, arguments[0]),
				{primaryPosition, secondaryPosition} = this.getGridPosition(updateFrom),
				hideTo = 0,
				width, height;

			primaryPosition -= scrollPosition;
			width = (isPrimaryDirectionVertical ? secondary.itemSize : primary.itemSize) + 'px';
			height = (isPrimaryDirectionVertical ? primary.itemSize : secondary.itemSize) + 'px';

			if (updateTo > dataSize) {
				hideTo = updateTo;
				updateTo = dataSize;
			}

			// positioning items
			for (let i = updateFrom, j = updateFrom % dimensionToExtent; i < updateTo; i++) {
				if (this.updateFrom === null || this.updateTo === null || this.updateFrom > i || this.updateTo <= i) {
					this.applyStyleToNewNode(i, width, height, primaryPosition, secondaryPosition);
				} else {
					this.applyStyleToExistingNode(i, width, height, primaryPosition, secondaryPosition);
				}

				if (++j === dimensionToExtent) {
					secondaryPosition = 0;
					primaryPosition += primary.gridSize;
					j = 0;
				} else {
					secondaryPosition += secondary.gridSize;
				}
			}

			for (let i = updateTo; i < hideTo; i++) {
				this.applyStyleToHideNode(i);
			}

			this.updateFrom = updateFrom;
			this.updateTo = updateTo;
		} else if (type === 'Native') {
			const
				{dataSize} = this.props,
				{firstIndex, numOfItems} = this.state,
				{isPrimaryDirectionVertical, dimensionToExtent, primary, secondary, cc} = this,
				diff = firstIndex - this.lastFirstIndex,
				updateFrom = (cc.length === 0 || 0 >= diff || diff >= numOfItems) ? firstIndex : this.lastFirstIndex + numOfItems;
			let
				hideTo = 0,
				updateTo = (cc.length === 0 || -numOfItems >= diff || diff > 0) ? firstIndex + numOfItems : this.lastFirstIndex;

			if (updateFrom >= updateTo) {
				return;
			} else if (updateTo > dataSize) {
				hideTo = updateTo;
				updateTo = dataSize;
			}

			let
				{primaryPosition, secondaryPosition} = this.getGridPosition(updateFrom),
				width, height;

			width = (isPrimaryDirectionVertical ? secondary.itemSize : primary.itemSize) + 'px';
			height = (isPrimaryDirectionVertical ? primary.itemSize : secondary.itemSize) + 'px';

			// positioning items
			for (let i = updateFrom, j = updateFrom % dimensionToExtent; i < updateTo; i++) {
				this.applyStyleToNewNode(i, width, height, primaryPosition, secondaryPosition);

				if (++j === dimensionToExtent) {
					secondaryPosition = 0;
					primaryPosition += primary.gridSize;
					j = 0;
				} else {
					secondaryPosition += secondary.gridSize;
				}
			}

			for (let i = updateTo; i < hideTo; i++) {
				this.applyStyleToHideNode(i);
			}

			this.lastFirstIndex = firstIndex;
		}
	}

	scrollToPosition (x, y) {
		const node = this.containerRef;

		node.scrollTo((this.context.rtl && !this.isPrimaryDirectionVertical) ? this.scrollBounds.maxLeft - x : x, y);
	}

	getXYJS = (primaryPosition, secondaryPosition) => {
		const rtlDirection = this.context.rtl ? -1 : 1;
		return (this.isPrimaryDirectionVertical ? {x: (secondaryPosition * rtlDirection), y: primaryPosition} : {x: (primaryPosition * rtlDirection), y: secondaryPosition});
	}

	composeTransform (style, primaryPosition, secondaryPosition = 0) {
		const {x, y} = this.getXYJS(primaryPosition, secondaryPosition);

		style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
	}

	composeStyleJS (style, width, height, ...rest) {
		if (this.isItemSized) {
			style.width = width;
			style.height = height;
		}
		style.position = 'absolute';
		this.composeTransform(style, ...rest);
	}

	getXYNative = (primaryPosition, secondaryPosition) => (this.isPrimaryDirectionVertical ? {x: secondaryPosition, y: primaryPosition} : {x: primaryPosition, y: secondaryPosition})

	composeStyleNative (style, width, height, primaryPosition, secondaryPosition) {
		const {x, y} = this.getXYNative(primaryPosition, secondaryPosition);

		if (this.isItemSized) {
			style.width = width;
			style.height = height;
		}
		style.position = 'absolute';

		/* FIXME: RTL / this calculation only works for Chrome */
		style.transform = 'translate(' + (this.context.rtl ? -x : x) + 'px,' + y + 'px)';
	}

	getScrollHeight = () => (this.isPrimaryDirectionVertical ? this.getVirtualScrollDimension() : this.scrollBounds.clientHeight)

	getScrollWidth = () => (this.isPrimaryDirectionVertical ? this.scrollBounds.clientWidth : this.getVirtualScrollDimension())

	getVirtualScrollDimension = () => {
		const
			{dimensionToExtent, primary, curDataSize} = this,
			{spacing} = this.props;

		return (Math.ceil(curDataSize / dimensionToExtent) * primary.gridSize) - spacing;
	}

	isSameTotalItemSizeWithClient = () => {
		const
			node = this.containerRef,
			{clientWidth, clientHeight} = this.props.clientSize || this.getClientSize(node);

		return (this.getVirtualScrollDimension() <= (this.isPrimaryDirectionVertical ? clientHeight : clientWidth));
	}

	syncClientSize = () => {
		const
			{props} = this,
			{type} = props,
			node = this.containerRef;

		if (!props.clientSize && !node) {
			return false;
		}

		const
			{clientWidth, clientHeight} = props.clientSize || this.getClientSize(node),
			{scrollBounds} = this;

		if (clientWidth !== scrollBounds.clientWidth || clientHeight !== scrollBounds.clientHeight) {
			this.calculateMetrics(props);
			this.updateStatesAndBounds(props);
			if (type === 'Native') {
				this.setContainerSize();
			}
			return true;
		}

		return false;
	}

	// override
	onKeyDown = () => {}

	// render

	initRef (prop) {
		return (ref) => {
			this[prop] = ref;
		};
	}

	renderChildren = () => {
		const cc = this.cc;
		return cc.length ? cc : null;
	}

	render () {
		const
			{className, style, type, ...rest} = this.props,
			{firstIndex, numOfItems} = this.state,
			{primary} = this,
			mergedClasses = type === 'JS' ? className : classNames(css.list, this.containerClass, className);

		delete rest.cbScrollTo;
		delete rest.clientSize;
		delete rest.component;
		delete rest.data;
		delete rest.dataSize;
		delete rest.direction;
		delete rest.itemSize;
		delete rest.nodeIndexToBeFocused;
		delete rest.overhang;
		delete rest.pageScroll;
		delete rest.spacing;

		if (primary) {
			this.positionItems(type === 'JS' ? {updateFrom: firstIndex, updateTo: firstIndex + numOfItems} : null);
		}

		if (type === 'JS') {
			return (
				<div {...rest} className={className} onKeyDown={this.onKeyDown} ref={this.initContainerRef} style={style}>
					{this.renderChildren()}
				</div>
			);
		} else if (type === 'Native') {
			return (
				<div className={mergedClasses} ref={this.initContainerRef} style={style}>
					<div {...rest} onKeyDown={this.onKeyDown} ref={this.initContentRef}>
						{this.renderChildren()}
					</div>
				</div>
			);
		}
	}
}

/**
 * [VirtualList]{@link ui/VirtualList} is a scrollable virtual list component with touch support.
 *
 * @class VirtualList
 * @extends ui/VirtualList.VirtualListBase
 * @memberof ui/VirtualList
 * @mixes ui/Scrollable.Scrollable
 * @ui
 * @public
 */
const VirtualList = Scrollable(VirtualListBase);

/**
 * [VirtualGridList]{@link ui/VirtualList.VirtualGridList} is a scrollable virtual grid list component with touch support.
 *
 * @class VirtualGridList
 * @extends ui/VirtualList.VirtualListBase
 * @memberof ui/VirtualList
 * @mixes ui/Scrollable.Scrollable
 * @ui
 * @public
 */
const VirtualGridList = VirtualList;

/**
 * [VirtualListNative]{@link ui/VirtualList.VirtualListNative} is a scrollable virtual list component with touch support.
 *
 * @class VirtualListNative
 * @memberof ui/VirtualList
 * @mixes ui/Scrollable.ScrollableNative
 * @ui
 * @public
 */
const VirtualListNative = ScrollableNative(VirtualListBase);

/**
 * [VirtualGridListNative]{@link ui/VirtualList.VirtualGridListNative} is a scrollable virtual list component with touch support.
 *
 * @class VirtualGridListNative
 * @memberof ui/VirtualList
 * @mixes ui/Scrollable.ScrollableNative
 * @ui
 * @public
 */
const VirtualGridListNative = VirtualListNative;

export default VirtualList;
export {
	VirtualListNative,
	gridListItemSizeShape,
	VirtualGridList,
	VirtualGridListNative,
	VirtualList,
	VirtualListBase,
	VirtualListBase as VirtualListBaseNative
};
export * from './GridListImageItem';
