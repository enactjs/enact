/**
 * Exports the {@link moonstone/VirtualList/VirtualListBase.VirtualListBase} component.
 *
 * @module moonstone/VirtualList/VirtualListBase
 * @private
 */

import React, {Component, PropTypes} from 'react';

import {Spotlight, SpotlightContainerDecorator} from '@enact/spotlight';

import {dataIndexAttribute, Scrollable} from '../Scroller/Scrollable';

const
	dataContainerDisabledAttribute = 'data-container-disabled',
	dataContainerIdAttribute = 'data-container-id',
	keyLeft	 = 37,
	keyUp	 = 38,
	keyRight = 39,
	keyDown	 = 40,
	nop = () => {};

/**
 * {@link moonstone/VirtualList/VirtualListBase.VirtualListBase} is a base component for
 * {@link moonstone/VirtualList.VirtualList} and
 * {@link moonstone/VirtualList.VirtualGridList} with Scrollable and SpotlightContainerDecorator applied.
 *
 * @class VirtualListCore
 * @memberof moonstone/VirtualList/VirtualListBase
 * @ui
 * @private
 */
class VirtualListCore extends Component {
	static propTypes = /** @lends moonstone/VirtualList/VirtualListBase.VirtualListCore.prototype */ {
		/**
		 * Size of an item for the list; valid values are either a number for `VirtualList`
		 * or an object that has `minWidth` and `minHeight` for `VirtualGridList`.
		 *
		 * @type {Number|Object}
		 * @public
		 */
		itemSize: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.object
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
		 * Callback method of updateScrollbars.
		 * Normally, `Scrollable` should set this value.
		 *
		 * @type {Function}
		 * @private
		 */
		cbUpdateScrollbars: PropTypes.func,

		/**
		 * clientHeight for VirtualList.
		 * Normally, `Scrollable` should set this value.
		 *
		 * @type {Number}
		 * @private
		 */
		clientHeight: PropTypes.number,

		/**
		 * clientWidth for VirtualList.
		 * Normally, `Scrollable` should set this value.
		 *
		 * @type {Number}
		 * @private
		 */
		clientWidth: PropTypes.number,

		/**
		 * The render function for an item of the list.
		 * `index` is for accessing the index of the item.
		 * `key` MUST be passed as a prop for DOM recycling.
		 * Data manipulation can be done in this function.
		 *
		 * @type {Function}
		 * @default ({index, key}) => (<div key={key}>{index}</div>)
		 * @public
		 */
		component: PropTypes.func,

		/**
		 * Data for the list.
		 * Check mutation of this and determine whether the list should update or not.
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

		/**
		 * Called when onScroll [events]{@glossary event} occurs.
		 *
		 * @type {Function}
		 * @private
		 */
		onScroll: PropTypes.func,

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
		 * Option for positioning the items; valid values are `'byItem'`, `'byContainer'`,
		 * and `'byBrowser'`.
		 * If `'byItem'`, the list moves each item.
		 * If `'byContainer'`, the list moves the container that contains rendered items.
		 * If `'byBrowser'`, the list scrolls by browser.
		 *
		 * @type {String}
		 * @default 'byItem'
		 * @private
		 */
		positioningOption: PropTypes.oneOf(['byItem', 'byContainer', 'byBrowser']),

		/**
		 * Pre-calculated client sizes with/without vertical/horizontal scrollbars.
		 * It is used internally for setting client size when direction prop changed.
		 *
		 * @type {Object}
		 * @private
		 */
		precalculatedClientSize: PropTypes.object,

		/**
		 * Spacing between items.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		spacing: PropTypes.number
	}

	static defaultProps = {
		cbScrollTo: nop,
		cbUpdateScrollbars: nop,
		component: ({index, key}) => (<div key={key}>{index}</div>),
		data: [],
		dataSize: 0,
		direction: 'vertical',
		onScroll: nop,
		overhang: 3,
		positioningOption: 'byItem',
		precalculatedClientSize: {},
		spacing: 0,
		style: {}
	}

	scrollBounds = {
		clientWidth: 0,
		clientHeight: 0,
		scrollWidth: 0,
		scrollHeight: 0,
		maxLeft: 0,
		maxTop: 0
	}

	isListComponent = true

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

	containerRef = null
	wrapperRef = null
	composeItemPosition = null
	positionContainer = null
	job = null

	// spotlight
	nodeIndexToBeBlurred = null
	lastFocusedIndex = null

	constructor (props) {
		const {positioningOption} = props;

		super(props);

		this.state = {firstIndex: 0, numOfItems: 0};
		this.initContainerRef = this.initRef('containerRef');
		this.initWrapperRef = this.initRef('wrapperRef');

		switch (positioningOption) {
			case 'byItem':
				this.composeItemPosition = this.composeTransform;
				this.positionContainer = nop;
				break;
			case 'byContainer':
				this.composeItemPosition = this.composeLeftTop;
				this.positionContainer = this.applyTransformToContainerNode;
				break;
			case 'byBrowser':
				this.composeItemPosition = this.composeLeftTop;
				this.positionContainer = this.applyScrollLeftTopToWrapperNode;
				break;
		}
	}

	isVertical = () => this.isPrimaryDirectionVertical

	isHorizontal = () => !this.isPrimaryDirectionVertical

	canScrollHorizontally = () => (
		!this.isPrimaryDirectionVertical && (this.scrollBounds.scrollWidth > this.scrollBounds.clientWidth) && !isNaN(this.scrollBounds.scrollWidth)
	)

	canScrollVertically = () => (
		this.isPrimaryDirectionVertical && (this.scrollBounds.scrollHeight > this.scrollBounds.clientHeight) && !isNaN(this.scrollBounds.scrollHeight)
	)

	getScrollBounds = () => this.scrollBounds

	getGridPosition (index) {
		const
			{dimensionToExtent, primary, secondary} = this,
			primaryPosition = Math.floor(index / dimensionToExtent) * primary.gridSize,
			secondaryPosition = (index % dimensionToExtent) * secondary.gridSize;

		return {primaryPosition, secondaryPosition};
	}

	getItemPosition = (index) => this.gridPositionToItemPosition(this.getGridPosition(index))

	gridPositionToItemPosition = ({primaryPosition, secondaryPosition}) =>
		(this.isPrimaryDirectionVertical ? {left: secondaryPosition, top: primaryPosition} : {left: primaryPosition, top: secondaryPosition})

	getContainerNode = (positioningOption) => {
		if (positioningOption === 'byItem') {
			return this.containerRef;
		} else {
			return this.wrapperRef;
		}
	}

	calculateMetrics (props, shouldScrollbarChange) {
		const
			{clientWidth, clientHeight, direction, itemSize, positioningOption, spacing} = props,
			heightInfo = {
				clientSize: clientHeight,
				minItemSize: (itemSize.minHeight) ? itemSize.minHeight : null,
				itemSize: itemSize
			},
			widthInfo = {
				clientSize: clientWidth,
				minItemSize: (itemSize.minWidth) ? itemSize.minWidth : null,
				itemSize: itemSize
			};
		let
			primary, secondary, dimensionToExtent, thresholdBase;

		this.isPrimaryDirectionVertical = (direction === 'vertical');

		if (positioningOption !== 'byBrowser' && shouldScrollbarChange) {
			const {hideScrollbars, precalculatedClientSize} = props;

			if (!hideScrollbars) {
				widthInfo.clientSize = this.isPrimaryDirectionVertical ? precalculatedClientSize.widthWithoutScrollbars : precalculatedClientSize.widthWithScrollbars;
				heightInfo.clientSize = this.isPrimaryDirectionVertical ? precalculatedClientSize.heightWithoutScrollbars : precalculatedClientSize.heightWithScrollbars;
			} else {
				widthInfo.clientSize = precalculatedClientSize.widthWithoutScrollbars;
				heightInfo.clientSize = precalculatedClientSize.heightWithoutScrollbars;
			}
		}

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
			secondary.itemSize = Math.round((secondary.clientSize - (spacing * (dimensionToExtent - 1))) / dimensionToExtent);
			// the actual item height is related to the item width
			primary.itemSize = Math.round(primary.minItemSize * (secondary.itemSize / secondary.minItemSize));
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
			{dataSize, overhang} = props,
			{dimensionToExtent, primary} = this,
			numOfItems = Math.min(dataSize, dimensionToExtent * (Math.ceil(primary.clientSize / primary.gridSize) + overhang));

		this.maxFirstIndex = dataSize - numOfItems;
		this.curDataSize = dataSize;

		this.setState({firstIndex: Math.min(this.state.firstIndex, this.maxFirstIndex), numOfItems});
		this.calculateScrollBounds(props);
	}

	calculateScrollBounds (props) {
		const
			{positioningOption} = props,
			{scrollBounds, isPrimaryDirectionVertical, primary, secondary} = this;
		let maxPos;

		scrollBounds.clientWidth = isPrimaryDirectionVertical ? secondary.clientSize : primary.clientSize;
		scrollBounds.clientHeight = isPrimaryDirectionVertical ? primary.clientSize : secondary.clientSize;
		scrollBounds.scrollWidth = this.getScrollWidth();
		scrollBounds.scrollHeight = this.getScrollHeight();
		scrollBounds.maxLeft = Math.max(0, scrollBounds.scrollWidth - scrollBounds.clientWidth);
		scrollBounds.maxTop = Math.max(0, scrollBounds.scrollHeight - scrollBounds.clientHeight);

		// correct position
		maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft;

		this.syncThreshold(maxPos);

		if (this.scrollPosition > maxPos) {
			this.props.cbScrollTo({position: (isPrimaryDirectionVertical) ? {y: maxPos} : {x: maxPos}});
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

	setScrollPosition (x, y, dirX, dirY, skipPositionContainer = false) {
		const
			{firstIndex} = this.state,
			{isPrimaryDirectionVertical, threshold, dimensionToExtent, maxFirstIndex, scrollBounds} = this,
			{gridSize} = this.primary,
			maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft,
			minOfMax = threshold.base,
			maxOfMin = maxPos - minOfMax;
		let
			delta, numOfGridLines, newFirstIndex = firstIndex, pos, dir = 0;

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
			newFirstIndex = Math.min(maxFirstIndex, (dimensionToExtent * Math.ceil(firstIndex / dimensionToExtent)) + (numOfGridLines * dimensionToExtent));
		} else if (dir === -1 && pos < threshold.min) {
			delta = threshold.min - pos;
			numOfGridLines = Math.ceil(delta / gridSize);
			threshold.max = Math.max(minOfMax, threshold.min - (numOfGridLines * gridSize - gridSize));
			threshold.min = (threshold.max > minOfMax) ? threshold.max - gridSize : -Infinity;
			newFirstIndex = Math.max(0, (dimensionToExtent * Math.ceil(firstIndex / dimensionToExtent)) - (numOfGridLines * dimensionToExtent));
		}

		this.syncThreshold(maxPos);
		this.scrollPosition = pos;

		if (!skipPositionContainer) {
			this.positionContainer();
		}

		if (firstIndex !== newFirstIndex) {
			this.setState({firstIndex: newFirstIndex});
		} else {
			this.positionItems(this.applyStyleToExistingNode, this.determineUpdatedNeededIndices(firstIndex));
		}
	}

	determineUpdatedNeededIndices (oldFirstIndex) {
		const
			{positioningOption} = this.props,
			{firstIndex, numOfItems} = this.state;

		if (positioningOption === 'byItem') {
			return {
				updateFrom: firstIndex,
				updateTo: firstIndex + numOfItems
			};
		} else {
			let diff = firstIndex - oldFirstIndex;
			return {
				updateFrom: (0 < diff && diff < numOfItems ) ? oldFirstIndex + numOfItems : firstIndex,
				updateTo: (-numOfItems < diff && diff <= 0 ) ? oldFirstIndex : firstIndex + numOfItems
			};
		}
	}

	applyStyleToExistingNode = (i, ...rest) => {
		const
			{numOfItems} = this.state,
			node = this.containerRef.children[i % numOfItems];

		if (node) {
			// spotlight
			node.setAttribute(dataIndexAttribute, i);
			if ((i % numOfItems) === this.nodeIndexToBeBlurred && i !== this.lastFocusedIndex) {
				node.blur();
				this.nodeIndexToBeBlurred = null;
			}
			this.composeStyle(node.style, ...rest);
		}
	}

	applyStyleToNewNode = (i, ...rest) => {
		const
			{component, data} = this.props,
			{numOfItems} = this.state,
			itemElement = component({
				data,
				index: i,
				key: i % numOfItems
			}),
			style = {};

		this.composeStyle(style, ...rest);

		this.cc[i % numOfItems] = React.cloneElement(
			itemElement, {
				style: {...itemElement.props.style, ...style},
				[dataIndexAttribute]: i
			}
		);
	}

	positionItems (applyStyle, {updateFrom, updateTo}) {
		const
			{positioningOption} = this.props,
			{isPrimaryDirectionVertical, dimensionToExtent, primary, secondary, scrollPosition} = this;

		// we only calculate position of the first child
		let
			{primaryPosition, secondaryPosition} = this.getGridPosition(updateFrom),
			width, height;

		primaryPosition -= (positioningOption === 'byItem') ? scrollPosition : 0;
		width = (isPrimaryDirectionVertical ? secondary.itemSize : primary.itemSize) + 'px';
		height = (isPrimaryDirectionVertical ? primary.itemSize : secondary.itemSize) + 'px';

		// positioning items
		for (let i = updateFrom, j = updateFrom % dimensionToExtent; i < updateTo; i++) {

			applyStyle(i, width, height, primaryPosition, secondaryPosition);

			if (++j === dimensionToExtent) {
				secondaryPosition = 0;
				primaryPosition += primary.gridSize;
				j = 0;
			} else {
				secondaryPosition += secondary.gridSize;
			}
		}
	}

	composeStyle (style, w, h, ...rest) {
		if (this.isItemSized) {
			style.width = w;
			style.height = h;
		}
		this.composeItemPosition(style, ...rest);
	}

	getXY = (primary, secondary) => ((this.isPrimaryDirectionVertical) ? {x: secondary, y: primary} : {x: primary, y: secondary})

	composeTransform (style, primary, secondary = 0) {
		const {x, y} = this.getXY(primary, secondary);
		style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
	}

	composeLeftTop (style, primary, secondary = 0) {
		const {x, y} = this.getXY(primary, secondary);
		style.left = x + 'px';
		style.top = y + 'px';
	}

	applyTransformToContainerNode () {
		this.composeTransform(this.containerRef.style, -this.scrollPosition, 0);
	}

	applyScrollLeftTopToWrapperNode () {
		const
			node = this.wrapperRef,
			{x, y} = this.getXY(this.scrollPosition, 0);
		node.scrollLeft = x;
		node.scrollTop = y;
	}

	composeOverflow (style) {
		style[this.isPrimaryDirectionVertical ? 'overflowY' : 'overflowX'] = 'scroll';
	}

	getScrollHeight = () => (this.isPrimaryDirectionVertical ? this.getVirtualScrollDimension() : this.scrollBounds.clientHeight)

	getScrollWidth = () => (this.isPrimaryDirectionVertical ? this.scrollBounds.clientWidth : this.getVirtualScrollDimension())

	getVirtualScrollDimension = () => {
		const
			{dimensionToExtent, primary, curDataSize} = this,
			{spacing} = this.props;

		return (Math.ceil(curDataSize / dimensionToExtent) * primary.gridSize) - spacing;
	}

	calculatePositionOnFocus = (focusedIndex) => {
		const
			{primary, numOfItems, scrollPosition} = this,
			offsetToClientEnd = primary.clientSize - primary.itemSize;
		let
			gridPosition = this.getGridPosition(focusedIndex);

		this.nodeIndexToBeBlurred = this.lastFocusedIndex % numOfItems;
		this.lastFocusedIndex = focusedIndex;

		if (primary.clientSize >= primary.itemSize) {
			if (gridPosition.primaryPosition > scrollPosition + offsetToClientEnd) {
				gridPosition.primaryPosition -= offsetToClientEnd;
			} else if (gridPosition.primaryPosition > scrollPosition) {
				gridPosition.primaryPosition = scrollPosition;
			}
		}

		// Since the result is used as a target position to be scrolled,
		// scrondaryPosition should be 0 here.
		gridPosition.secondaryPosition = 0;
		return this.gridPositionToItemPosition(gridPosition);
	}

	setRestrict = (bool) => {
		Spotlight.set(this.props[dataContainerIdAttribute], {restrict: (bool) ? 'self-only' : 'self-first'});
	}

	setSpotlightContainerRestrict = (keyCode, index) => {
		const
			{dataSize} = this.props,
			{isPrimaryDirectionVertical, dimensionToExtent} = this,
			canMoveBackward = index >= dimensionToExtent,
			canMoveForward = index < (dataSize - (((dataSize - 1) % dimensionToExtent) + 1));
		let isSelfOnly = false;

		if (isPrimaryDirectionVertical) {
			if (keyCode === keyUp && canMoveBackward || keyCode === keyDown && canMoveForward) {
				isSelfOnly = true;
			}
		} else if (keyCode === keyLeft && canMoveBackward || keyCode === keyRight && canMoveForward) {
			isSelfOnly = true;
		}

		this.setRestrict(isSelfOnly);
	}

	setContainerDisabled = (bool) => {
		const containerNode = this.getContainerNode(this.props.positioningOption);

		if (containerNode) {
			containerNode.setAttribute(dataContainerDisabledAttribute, bool);
		}
	}

	// Calculate metrics for VirtualList after the 1st render to know client W/H.
	// We separate code related with data due to re use it when data changed.
	componentDidMount () {
		const {positioningOption} = this.props;

		this.calculateMetrics(this.props, false);
		this.updateStatesAndBounds(this.props);

		if (positioningOption !== 'byBrowser') {
			const containerNode = this.getContainerNode(positioningOption);

			// prevent native scrolling by Spotlight
			this.preventScroll = function () {
				containerNode.scrollTop = 0;
				containerNode.scrollLeft = 0;
			};

			if (containerNode && containerNode.addEventListener) {
				containerNode.addEventListener('scroll', this.preventScroll);
			}
		}
	}

	// Call updateStatesAndBounds here when dataSize has been changed to update nomOfItems state.
	// Calling setState within componentWillReceivePropswill not trigger an additional render.
	componentWillReceiveProps (nextProps) {
		const
			{clientWidth, clientHeight, direction, itemSize, dataSize, overhang, spacing} = this.props,
			hasMetricsChanged = (
				clientWidth !== nextProps.clientWidth ||
				clientHeight !== nextProps.clientHeight ||
				direction !== nextProps.direction ||
				((itemSize instanceof Object) ? (itemSize.minWidth !== nextProps.itemSize.minWidth || itemSize.minHeight !== nextProps.itemSize.minHeight) : itemSize !== nextProps.itemSize) ||
				overhang !== nextProps.overhang ||
				spacing !== nextProps.spacing
			),
			shouldScrollbarChange = (
				direction !== nextProps.direction
			),
			hasDataChanged = (dataSize !== nextProps.dataSize);

		if (hasMetricsChanged) {
			this.calculateMetrics(nextProps, shouldScrollbarChange);
			this.updateStatesAndBounds(nextProps);
			this.props.cbUpdateScrollbars(this.canScrollHorizontally(), this.canScrollVertically());
		} else if (hasDataChanged) {
			this.updateStatesAndBounds(nextProps);
		}
	}

	componentWillUnmount () {
		const containerNode = this.getContainerNode(this.props.positioningOption);

		// remove a function for preventing native scrolling by Spotlight
		if (containerNode && containerNode.removeEventListener) {
			containerNode.removeEventListener('scroll', this.preventScroll);
		}
	}

	// render

	initRef (prop) {
		return (ref) => {
			this[prop] = ref;
		};
	}

	renderCalculate () {
		const
			{dataSize} = this.props,
			{firstIndex, numOfItems} = this.state,
			max = Math.min(dataSize, firstIndex + numOfItems);

		this.cc.length = 0;
		this.positionItems(this.applyStyleToNewNode, {updateFrom: firstIndex, updateTo: max});
		this.positionContainer();
	}

	render () {
		const
			props = Object.assign({}, this.props),
			{positioningOption, onScroll} = this.props,
			{primary, cc} = this;

		delete props.cbScrollTo;
		delete props.cbUpdateScrollbars;
		delete props.clientWidth;
		delete props.clientHeight;
		delete props.component;
		delete props.data;
		delete props.dataSize;
		delete props.direction;
		delete props.hideScrollbars;
		delete props.itemSize;
		delete props.onScroll;
		delete props.onScrolling;
		delete props.onScrollStart;
		delete props.onScrollStop;
		delete props.overhang;
		delete props.positioningOption;
		delete props.precalculatedClientSize;
		delete props.spacing;

		if (primary) {
			this.renderCalculate();
		}

		if (positioningOption === 'byItem') {
			return (
				<div {...props} ref={this.initContainerRef}>
					{cc}
				</div>
			);
		} else {
			const {className, style, ...rest} = props;

			if (positioningOption === 'byBrowser') {
				this.composeOverflow(style);
			}

			return (
				<div ref={this.initWrapperRef} className={className} style={style} onScroll={onScroll}>
					<div {...rest} ref={this.initContainerRef}>
						{cc}
					</div>
				</div>
			);
		}
	}
}

/**
 * {@link moonstone/VirtualList/VirtualListBase.VirtualListBase} is a base component for
 * {@link moonstone/VirtualList.VirtualList} and
 * {@link moonstone/VirtualList.VirtualGridList} with Scrollable and SpotlightContainerDecorator applied.
 *
 * @class VirtualListBase
 * @memberof moonstone/VirtualList/VirtualListBase
 * @mixes moonstone/Scrollable
 * @mixes spotlight/SpotlightContainerDecorator
 * @ui
 * @private
 */
const VirtualListBase = SpotlightContainerDecorator({restrict: 'self-first'}, Scrollable(VirtualListCore));

export default VirtualListBase;
export {VirtualListCore, VirtualListBase};
