/**
 * Provides unstyled virtual list native components and behaviors to be customized by a theme or application.
 *
 * @module ui/VirtualList
 * @exports VirtualListNative
 * @exports VirtualGridListNative
 * @exports VirtualListBaseNative
 * @exports gridListItemSizeShape
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ScrollableNative from '../Scrollable/ScrollableNative';

import css from './VirtualListNative.less';
import cssItem from './ListItem.less';

const nop = () => {};

/**
 * The shape for the grid list item size
 * in a list for [VirtualGridListNative]{@link ui/VirtualList.VirtualGridListNative}.
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
 * A basic base component for
 * {@link ui/VirtualList.VirtualListNative} and {@link ui/VirtualList.VirtualGridListNative}.
 *
 * @class VirtualListBaseNative
 * @memberof ui/VirtualList
 * @ui
 * @private
 */
class VirtualListBaseNative extends Component {
	static displayName = 'ui:VirtualListBaseNative'

	static propTypes = /** @lends ui/VirtualList.VirtualListBaseNative.prototype */ {
		/**
		 * The `render` function for an item of the list receives the following parameters:
		 * - `data` is for accessing the supplied `data` property of the list.
		 * > NOTE: In most cases, it is recommended to use data from redux store instead of using
		 * is parameters due to performance optimizations
		 * - `data-index` is required for Spotlight 5-way navigation. Pass to the root element in
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

		componentHidden: PropTypes.func.isRequired,

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
			clientHeight: PropTypes.number.isRequired
		}),

		/**
		 * Data for passing it through `component` prop.
		 * NOTICE: For performance reason, changing this prop does NOT always cause the list to
		 * redraw its items.
		 *
		 * @type {Any}
		 * @default []
		 * @public
		 */
		data: PropTypes.any,

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

		getXY: PropTypes.func,

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

		render: PropTypes.func,

		/**
		 * Spacing between items.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		spacing: PropTypes.number,

		updateStatesAndBounds: PropTypes.func
	}

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
		this.initContentRef = this.initRef('contentRef');
		this.initContainerRef = this.initRef('containerRef');
	}

	componentWillMount () {
		if (this.props.clientSize) {
			const updateStatesAndBounds = this.props.updateStatesAndBounds || this.updateStatesAndBounds;

			this.calculateMetrics(this.props);
			updateStatesAndBounds(this.props);
		}
	}

	// Calculate metrics for VirtualList after the 1st render to know client W/H.
	// We separate code related with data due to re use it when data changed.
	componentDidMount () {
		if (!this.props.clientSize) {
			const updateStatesAndBounds = this.props.updateStatesAndBounds || this.updateStatesAndBounds;

			this.calculateMetrics(this.props);
			updateStatesAndBounds(this.props);
		}
		this.setContainerSize();
	}

	// Call updateStatesAndBounds here when dataSize has been changed to update nomOfItems state.
	// Calling setState within componentWillReceivePropswill not trigger an additional render.
	componentWillReceiveProps (nextProps) {
		const
			{dataSize, direction, itemSize, overhang, spacing} = this.props,
			hasMetricsChanged = (
				direction !== nextProps.direction ||
				((itemSize instanceof Object) ? (itemSize.minWidth !== nextProps.itemSize.minWidth || itemSize.minHeight !== nextProps.itemSize.minHeight) : itemSize !== nextProps.itemSize) ||
				overhang !== nextProps.overhang ||
				spacing !== nextProps.spacing
			),
			updateStatesAndBounds = this.props.updateStatesAndBounds || this.updateStatesAndBounds;

		this.hasDataSizeChanged = (dataSize !== nextProps.dataSize);

		if (hasMetricsChanged) {
			this.calculateMetrics(nextProps);
			updateStatesAndBounds(nextProps);
			this.setContainerSize();
		} else if (this.hasDataSizeChanged) {
			updateStatesAndBounds(nextProps);
			this.setContainerSize();
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
	lastFirstIndex = 0
	curDataSize = 0
	hasDataSizeChanged = false
	cc = []
	scrollPosition = 0
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

	updateStatesAndBounds = (props) => {
		const
			{dataSize, overhang} = props,
			{firstIndex} = this.state,
			{dimensionToExtent, primary, moreInfo, scrollPosition} = this,
			numOfItems = Math.min(dataSize, dimensionToExtent * (Math.ceil(primary.clientSize / primary.gridSize) + overhang)),
			wasFirstIndexMax = ((this.maxFirstIndex < moreInfo.firstVisibleIndex - dimensionToExtent) && (firstIndex === this.maxFirstIndex)),
			dataSizeDiff = dataSize - this.curDataSize;
		let newFirstIndex = firstIndex;

		this.maxFirstIndex = Math.ceil((dataSize - numOfItems) / dimensionToExtent) * dimensionToExtent;
		this.curDataSize = dataSize;

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
			if (dimensionToExtent > 1 && dataSizeDiff < dimensionToExtent) {
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
			{clientSize} = props,
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

		this.containerClass = (isPrimaryDirectionVertical) ? css.vertical : css.horizontal;
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

	didScroll (x, y, dirX, dirY) {
		const
			{dataSize} = this.props,
			{firstIndex} = this.state,
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
		}
	}

	getItemNode = (index) => {
		const
			{numOfItems} = this.state,
			ref = this.itemContainerRef;

		return ref ? ref.children[index % numOfItems] : null;
	}

	applyStyleToNewNode = (index, ...rest) => {
		const
			{component, data} = this.props,
			{numOfItems} = this.state,
			key = index % numOfItems,
			itemElement = component({
				data,
				index,
				key
			}),
			style = {};

		this.composeStyle(style, ...rest);

		this.cc[key] = React.cloneElement(itemElement, {
			className: classNames(cssItem.listItem, itemElement.props.className),
			['data-preventscrollonfocus']: true, // Added this attribute to prevent scroll on focus by browser
			style: {...itemElement.props.style, ...style}
		});
	}

	applyStyleToHideNode = (index) => {
		const
			{componentHidden} = this.props,
			key = index % this.state.numOfItems,
			style = {display: 'none'},
			itemElement = componentHidden({
				key,
				style
			});

		this.cc[key] = itemElement;
	}

	positionItems () {
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

	scrollToPosition (x, y) {
		this.containerRef.scrollTo(x, y);
	}

	composeStyle (style, width, height, primaryPosition, secondaryPosition) {
		const
			getXY = this.props.getXY || this.getXY,
			{x, y} = getXY(primaryPosition, secondaryPosition);

		if (this.isItemSized) {
			style.width = width;
			style.height = height;
		}
		style.position = 'absolute';

		/* FIXME: RTL / this calculation only works for Chrome */
		style.transform = 'translate(' + x + 'px,' + y + 'px)';
	}

	getXY = (primaryPosition, secondaryPosition) => (this.isPrimaryDirectionVertical ? {x: secondaryPosition, y: primaryPosition} : {x: primaryPosition, y: secondaryPosition})

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

	getScrollHeight = () => (this.isPrimaryDirectionVertical ? this.getVirtualScrollDimension() : this.scrollBounds.clientHeight)

	getScrollWidth = () => (this.isPrimaryDirectionVertical ? this.scrollBounds.clientWidth : this.getVirtualScrollDimension())

	getVirtualScrollDimension = () => {
		const
			{dimensionToExtent, primary, curDataSize} = this,
			{spacing} = this.props;

		return (Math.ceil(curDataSize / dimensionToExtent) * primary.gridSize) - spacing;
	}

	syncClientSize = () => {
		const
			{props} = this,
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
			this.setContainerSize();
			return true;
		}

		return false;
	}

	// render

	initRef (prop) {
		return (ref) => {
			this[prop] = ref;
		};
	}

	render () {
		const
			{className, render, style, ...rest} = this.props,
			{cc, primary} = this,
			mergedClasses = classNames(css.list, this.containerClass, className);

		delete rest.cbScrollTo;
		delete rest.clientSize;
		delete rest.component;
		delete rest.componentHidden;
		delete rest.data;
		delete rest.dataSize;
		delete rest.direction;
		delete rest.getXY;
		delete rest.itemSize;
		delete rest.overhang;
		delete rest.pageScroll;
		delete rest.spacing;
		delete rest.updateStatesAndBounds;

		if (primary) {
			this.positionItems();
		}

		return (
			<div className={mergedClasses} ref={this.initContainerRef} style={style}>
				<div {...rest} ref={this.initContentRef}>
					{render({cc, primary})}
				</div>
			</div>
		);
	}
}

/**
 * A basic scrollable virtual native list component with touch support.
 * For smooth native scrolling, web engine with below Chromium 61, should be launched
 * with the flag '--enable-blink-features=CSSOMSmoothScroll' to support it.
 * The one with Chromium 61 or above, is launched to support it by default.
 *
 * @class VirtualListNative
 * @memberof ui/VirtualList
 * @mixes ui/Scrollable.ScrollableNative
 * @ui
 * @public
 */
const VirtualListNative = (props) => (
	<ScrollableNative
		{...props}
		render={(virtualListProps) => (// eslint-disable-line react/jsx-no-bind
			<VirtualListBaseNative
				{...virtualListProps}
				componentHidden={(componentProps) => (<div {...componentProps} />)} // eslint-disable-line react/jsx-no-bind
				render={({cc}) => (cc.length ? cc : null)} // eslint-disable-line react/jsx-no-bind
			/>
		)}
	/>
);

/**
 * A basic scrollable virtual grid native list component with touch support.
 * For smooth native scrolling, web engine with below Chromium 61, should be launched
 * with the flag '--enable-blink-features=CSSOMSmoothScroll' to support it.
 * The one with Chromium 61 or above, is launched to support it by default.
 *
 * @class VirtualGridListNative
 * @memberof ui/VirtualList
 * @mixes ui/Scrollable.ScrollableNative
 * @ui
 * @public
 */
const VirtualGridListNative = VirtualListNative;

export default VirtualListNative;
export {
	VirtualListNative,
	VirtualGridListNative,
	VirtualListBaseNative,
	gridListItemSizeShape
};
