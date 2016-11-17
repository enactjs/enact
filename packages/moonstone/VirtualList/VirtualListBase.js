/**
 * Exports the {@link moonstone/VirtualList/VirtualListBase.VirtualListBase} component.
 *
 * @module moonstone/VirtualList/VirtualListBase
 * @private
 */

import React, {Component, PropTypes} from 'react';

import {Spotlight, SpotlightContainerDecorator} from '@enact/spotlight';
import {contextTypes} from '@enact/i18n/I18nDecorator';

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
		 * The render function for an item of the list.
		 * `index` is for accessing the index of the item.
		 * `key` MUST be passed as a prop for DOM recycling.
		 * Data manipulation can be done in this function.
		 *
		 * @type {Function}
		 * @default ({index, key}) => (<div key={key}>{index}</div>)
		 * @public
		 */
		component: PropTypes.func.isRequired,

		/**
		 * Data for the list.
		 * Check mutation of this and determine whether the list should update or not.
		 *
		 * @type {Any}
		 * @default []
		 * @public
		 */
		data: PropTypes.any.isRequired,

		/**
		 * Size of data for the list; valid values are either a number
		 * or an object that has `fixed` and `variable`.
		 *
		 * @type {Number|Object}
		 * @public
		 */
		dataSize: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.object
		]).isRequired,

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
		 * Spacing between items.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		spacing: PropTypes.number
	}

	static contextTypes = contextTypes

	static defaultProps = {
		cbScrollTo: nop,
		component: nop,
		data: [],
		direction: 'vertical',
		onScroll: nop,
		overhang: 3,
		positioningOption: 'byItem',
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

	primary = null
	secondary = null
	dimensionToExtent = 0
	isPrimaryDirectionVertical = true
	isVirtualGridList = false
	isVirtualVariableList = false

	cc = []

	containerRef = null
	wrapperRef = null

	composeItemPosition = null
	positionContainer = null

	// spotlight
	nodeIndexToBeBlurred = null
	lastFocusedIndex = null

	constructor (props) {
		const {positioningOption} = props;

		super(props);

		this.state = {
			primaryFirstIndex: 0,
			numOfItems: 0
		};

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

	isVertical = () => (this.isVirtualVariableList || this.isPrimaryDirectionVertical)

	isHorizontal = () => (this.isVirtualVariableList || !this.isPrimaryDirectionVertical)

	getScrollBounds = () => (this.scrollBounds)

	getGridPosition (index) {
		const
			{dimensionToExtent, primary, secondary} = this,
			primaryPosition = Math.floor(index / dimensionToExtent) * primary.gridSize,
			secondaryPosition = (index % dimensionToExtent) * secondary.gridSize;

		return {primaryPosition, secondaryPosition};
	}

	getVariableGridPosition (i, j) {
		const
			{dimensionToExtent, primary, secondary} = this,
			primaryPosition = Math.floor(i / dimensionToExtent) * primary.gridSize,
			secondaryPosition = secondary.positionOffsets[i][j];

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

	getClientSize = (node) => {
		return {
			clientWidth: node.clientWidth,
			clientHeight: node.clientHeight
		};
	}

	calculateMetrics (props) {
		const
			{dataSize, direction, itemSize, positioningOption, spacing, variableDimension} = props,
			node = this.getContainerNode(positioningOption);

		if (!node) {
			return;
		}

		const
			{clientWidth, clientHeight} = this.getClientSize(node),
			heightInfo = {
				clientSize: clientHeight,
				itemSize,
				minItemSize: itemSize.minHeight || null,
				scrollPosition: 0
			},
			widthInfo = {
				clientSize: clientWidth,
				itemSize,
				minItemSize: itemSize.minWidth || null,
				scrollPosition: 0
			};
		let primary, secondary, dimensionToExtent, primaryThresholdBase;

		this.isPrimaryDirectionVertical = (direction === 'vertical');
		this.isVirtualVariableList = ((variableDimension === 'width') || (variableDimension === 'height'));
		this.isVirtualGridList = (itemSize.minWidth && itemSize.minHeight);

		if (this.isPrimaryDirectionVertical) {
			primary = heightInfo;
			secondary = widthInfo;
		} else {
			primary = widthInfo;
			secondary = heightInfo;
		}
		dimensionToExtent = 1;

		if (this.isVirtualGridList) {
			// the number of columns is the ratio of the available width plus the spacing
			// by the minimum item width plus the spacing
			dimensionToExtent = Math.max(Math.floor((secondary.clientSize + spacing) / (secondary.minItemSize + spacing)), 1);
			// the actual item width is a ratio of the remaining width after all columns
			// and spacing are accounted for and the number of columns that we know we should have
			secondary.itemSize = Math.round((secondary.clientSize - (spacing * (dimensionToExtent - 1))) / dimensionToExtent);
			// the actual item height is related to the item width
			primary.itemSize = Math.round(primary.minItemSize * (secondary.itemSize / secondary.minItemSize));
		}

		if (this.isVirtualVariableList) {
			primary.itemSize = itemSize.fixed;
			primary.gridSize = primary.itemSize + spacing;
			secondary.itemSize = itemSize.variable;
			secondary.gridSize = itemSize.fixed + spacing;
		} else {
			primary.gridSize = primary.itemSize + spacing;
			secondary.gridSize = secondary.itemSize + spacing;
		}

		primary.maxFirstIndex = 0
		primaryThresholdBase = primary.gridSize * 2;
		primary.threshold = {min: -Infinity, max: primaryThresholdBase, base: primaryThresholdBase};

		this.dimensionToExtent = dimensionToExtent;

		this.primary = primary;
		this.secondary = secondary;

		// eslint-disable-next-line react/no-direct-mutation-state
		this.state.primaryFirstIndex = 0;
		// eslint-disable-next-line react/no-direct-mutation-state
		this.state.numOfItems = 0;
	}

	updateStatesAndBounds (props) {
		const
			{dataSize, overhang} = props,
			{primaryFirstIndex} = this.state,
			{dimensionToExtent, primary, secondary, isVirtualVariableList} = this;
		let numOfItems = dimensionToExtent * (Math.ceil(primary.clientSize / primary.gridSize) + overhang);

		if (isVirtualVariableList) {
			numOfItems = Math.min(dataSize.fixed, numOfItems);
			primary.dataSize = dataSize.fixed;
			secondary.dataSize = dataSize.variable;
		} else {
			numOfItems = Math.min(dataSize, numOfItems);
			primary.dataSize = dataSize;
		}

		primary.maxFirstIndex = primary.dataSize - numOfItems;

		this.setState({primaryFirstIndex: Math.min(primaryFirstIndex, primary.maxFirstIndex), numOfItems});
		this.calculateScrollBounds(props);
		if (isVirtualVariableList) {
			this.initSecondaryScrollInfo(primary.dataSize, numOfItems);
		}
	}

	calculateScrollBounds (props) {
		const
			node = this.getContainerNode(props.positioningOption);

		if (!node) {
			return;
		}

		const
			{clientWidth, clientHeight} = this.getClientSize(node),
			{cbScrollTo, variableDimension, variableMaxScrollSize} = this.props,
			{scrollBounds, isPrimaryDirectionVertical, primary} = this;
		let maxPos;

		scrollBounds.clientWidth = clientWidth;
		scrollBounds.clientHeight = clientHeight;
		scrollBounds.scrollWidth = (variableDimension === 'width') ? variableMaxScrollSize : this.getScrollWidth();
		scrollBounds.scrollHeight = (variableDimension === 'height') ? variableMaxScrollSize : this.getScrollHeight();
		scrollBounds.maxLeft = Math.max(0, scrollBounds.scrollWidth - clientWidth);
		scrollBounds.maxTop = Math.max(0, scrollBounds.scrollHeight - clientHeight);

		// correct position
		maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft;

		this.syncPrimaryThreshold(maxPos);

		if (primary.scrollPosition > maxPos) {
			cbScrollTo({position: (isPrimaryDirectionVertical) ? {y: maxPos} : {x: maxPos}});
		}
	}

	syncPrimaryThreshold (maxPos) {
		const {threshold} = this.primary;

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

	initSecondaryScrollInfo (primaryDataSize, numOfItems) {
		const {secondary} = this;

		secondary.firstIndices = Array(primaryDataSize);
		secondary.lastIndices = Array(primaryDataSize);
		secondary.positionOffsets = Array(primaryDataSize);
		secondary.thresholds = Array.from({length: primaryDataSize}, () => ({}));

		for (let i = 0; i < numOfItems; i++) {
			this.updateSecondaryScrollInfo(i, 0);
		}
	}

	updateSecondaryScrollInfo (primaryIndex, secondaryPosition) {
		const
			{data, lockHeaders, variableMaxScrollSize} = this.props,
			{secondary} = this,
			i = primaryIndex,
			secondaryDataSize = secondary.dataSize({data, fixedIndex: i});
		let
			accumulatedSize = 0,
			size, // width or height
			j;

		secondary.positionOffsets[i] = [];
		secondary.thresholds[i] = {};

		if (lockHeaders) {
			accumulatedSize = (-1) * secondary.itemSize({data, index: {fixed: i, variable: 0}});
		}

		for (j = 0; j < secondaryDataSize; j++) {
			size = secondary.itemSize({data, index: {fixed: i, variable: j}});
			secondary.positionOffsets[i][j] = accumulatedSize;
			if (accumulatedSize <= secondaryPosition && secondaryPosition < accumulatedSize + size) {
				secondary.firstIndices[i] = j;
				secondary.thresholds[i].min = accumulatedSize;
			}
			if (accumulatedSize + size > secondaryPosition + secondary.clientSize) {
				secondary.lastIndices[i] = j;
				secondary.thresholds[i].max = accumulatedSize + size;
				break;
			}
			accumulatedSize += size;
		}
		if (j === secondaryDataSize || !secondary.thresholds[i].max) {
			secondary.lastIndices[i] = secondaryDataSize - 1;
			secondary.thresholds[i].max = variableMaxScrollSize;
		}
	}

	setPrimaryScrollPosition (pos, dir) {
		const
			{dimensionToExtent, primary, scrollBounds, isPrimaryDirectionVertical} = this,
			{primaryFirstIndex} = this.state,
			{gridSize, maxFirstIndex, threshold} = primary,
			maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft,
			minOfMax = threshold.base,
			maxOfMin = maxPos - minOfMax;
		let
			delta,
			newPrimaryFirstIndex = primaryFirstIndex,
			numOfGridLines;

		if (dir === 1 && pos > threshold.max) {
			delta = pos - threshold.max;
			numOfGridLines = Math.ceil(delta / gridSize); // how many lines should we add
			threshold.max = Math.min(maxPos, threshold.max + numOfGridLines * gridSize);
			threshold.min = Math.min(maxOfMin, threshold.max - gridSize);
			newPrimaryFirstIndex = Math.min(maxFirstIndex, (dimensionToExtent * Math.ceil(primaryFirstIndex / dimensionToExtent)) + (numOfGridLines * dimensionToExtent));
		} else if (dir === -1 && pos < threshold.min) {
			delta = threshold.min - pos;
			numOfGridLines = Math.ceil(delta / gridSize);
			threshold.max = Math.max(minOfMax, threshold.min - (numOfGridLines * gridSize - gridSize));
			threshold.min = (threshold.max > minOfMax) ? threshold.max - gridSize : -Infinity;
			newPrimaryFirstIndex = Math.max(0, (dimensionToExtent * Math.ceil(primaryFirstIndex / dimensionToExtent)) - (numOfGridLines * dimensionToExtent));
		}
		this.syncPrimaryThreshold(maxPos);
		primary.scrollPosition = pos;

		return newPrimaryFirstIndex;
	}

	setSecondaryScrollPosition (newPrimaryFirstIndex, pos, dir) {
		const
			{lockHeaders} = this.props,
			{primaryFirstIndex, numOfItems} = this.state,
			{clientSize, thresholds: secondaryThresholds} = this.secondary;
		let	shouldUpdateState = false;

		if (lockHeaders && newPrimaryFirstIndex > 0) {
			if ((dir === 1 && pos + clientSize > secondaryThresholds[0].max) ||
				(dir === -1 && pos < secondaryThresholds[0].min)) {
				this.updateSecondaryScrollInfo(0, pos);
				shouldUpdateState = true;
			}
		}
		for (let i = newPrimaryFirstIndex; i < newPrimaryFirstIndex + numOfItems; i++) {
			if (
				// primary boundary
				(primaryFirstIndex < newPrimaryFirstIndex && i >= primaryFirstIndex + numOfItems) ||
				(primaryFirstIndex > newPrimaryFirstIndex && i < primaryFirstIndex) ||
				// secondary boundary
				(dir === 1 && pos + clientSize > secondaryThresholds[i].max) ||
				(dir === -1 && pos < secondaryThresholds[i].min) ||
				// threshold was not defined yet
				(!(secondaryThresholds[i].max || secondaryThresholds[i].min))
			) {
				this.updateSecondaryScrollInfo(i, pos);
				shouldUpdateState = true;
			}
		}
		this.secondary.scrollPosition = pos;

		return shouldUpdateState;
	}

	setScrollPosition (x, y, dirX, dirY, skipPositionContainer = false) {
		const
			{variableDimension} = this.props,
			{primaryFirstIndex} = this.state,
			{isPrimaryDirectionVertical} = this;
		let
			dir = {primary: 0},
			pos,
			newPrimaryFirstIndex,
			shouldUpdateState = false;

		if (variableDimension === 'width') {
			pos = {primary: y, secondary: x};
			dir = {primary: dirY, secondary: dirX};
		} else if (variableDimension === 'height') {
			pos = {primary: x, secondary: y};
			dir = {primary: dirX, secondary: dirY};
		} else {
			pos = {primary: isPrimaryDirectionVertical ? y : x};
			dir = {primary: isPrimaryDirectionVertical ? dirY : dirX};
		}

		// for primary direction
		newPrimaryFirstIndex = this.setPrimaryScrollPosition(pos.primary, dir.primary);

		// for secondary direction
		if (this.isVirtualVariableList) {
			shouldUpdateState = this.setSecondaryScrollPosition(newPrimaryFirstIndex, pos.secondary, dir.secondary);
		}

		if (!skipPositionContainer) {
			this.positionContainer();
		}

		if ((primaryFirstIndex !== newPrimaryFirstIndex) ||
			(this.isVirtualVariableList && shouldUpdateState === true)) {
			this.setState({primaryFirstIndex: newPrimaryFirstIndex});
		} else {
			this.positionItems(this.applyStyleToExistingNode, this.determineUpdatedNeededIndices(primaryFirstIndex));
		}
	}

	determineUpdatedNeededIndices (oldPrimaryFirstIndex) {
		const
			{positioningOption} = this.props,
			{primaryFirstIndex, numOfItems} = this.state;

		if (positioningOption === 'byItem') {
			return {
				updateFrom: primaryFirstIndex,
				updateTo: primaryFirstIndex + numOfItems
			};
		} else {
			const diff = primaryFirstIndex - oldPrimaryFirstIndex;
			return {
				updateFrom: (0 < diff && diff < numOfItems ) ? oldPrimaryFirstIndex + numOfItems : primaryFirstIndex,
				updateTo: (-numOfItems < diff && diff <= 0 ) ? oldPrimaryFirstIndex : primaryFirstIndex + numOfItems
			};
		}
	}

	applyStyleToExistingNode = (i, j, key, ...rest) => {
		const
			node = this.containerRef.children[key],
			id = this.isVirtualVariableList ? (i + '-' + j) : i;

		if (node) {
			// spotlight
			node.setAttribute(dataIndexAttribute, id);
			if (key === this.nodeIndexToBeBlurred && id !== this.lastFocusedIndex) {
				node.blur();
				this.nodeIndexToBeBlurred = null;
			}
			this.composeStyle(node.style, ...rest);
		}
	}

	applyStyleToNewNode = (i, j, key, ...rest) => {
		const
			{component, data} = this.props,
			{isVirtualVariableList} = this,
			id = isVirtualVariableList ? (i + '-' + j) : i,
			itemElement = isVirtualVariableList ?
				component({
					data,
					index: {
						fixed: i,
						variable: j
					},
					key: id
				}) :
				component({
					data,
					index: i,
					key
				}),
			style = {};

		this.composeStyle(style, ...rest);

		this.cc[key] = React.cloneElement(
			itemElement, {
				style: {...itemElement.props.style, ...style},
				[dataIndexAttribute]: id
			}
		);
	}

	calculateZIndex(primaryIndex, secondaryIndex) {
		return (primaryIndex === 0 ? 1 : 0) + (secondaryIndex === 0 ? 10 : 0);
	}

	positionVariableItems (i, key, width, height, primaryPosition, secondaryPosition, applyStyle) {
		const
			{variableDimension, data, lockHeaders} = this.props,
			{secondary} = this;
		let
			j = secondary.firstIndices[i],
			size;

		// First column
		if (lockHeaders) {
			size = secondary.itemSize({data, index: {fixed: i, variable: 0}});
			applyStyle(i, 0, key++, size, height, this.calculateZIndex(i, 0), i === 0 ? 0 : primaryPosition, 0);
			secondaryPosition += size;
			j = j || 1;
		}

		for (; j <= secondary.lastIndices[i]; j++) {
			size = secondary.itemSize({data, index: {fixed: i, variable: j}});
			if (variableDimension === 'width') {
				if (lockHeaders) {
					applyStyle(
						i, j, key, size, height,
						i === 0 ? this.calculateZIndex(i, j) : 0,
						i === 0 ? 0 : primaryPosition,
						secondaryPosition
					);
				} else {
					applyStyle(i, j, key, size, height, 0, primaryPosition, secondaryPosition);
				}
			} else if (variableDimension === 'height') {
				if (lockHeaders) {
					applyStyle(
						i, j, key, width, size,
						i === 0 ? this.calculateZIndex(i, j) : 0,
						i === 0 ? 0 : primaryPosition,
						secondaryPosition
					);
				} else {
					applyStyle(i, j, key, width, size, 0, primaryPosition, secondaryPosition);
				}
			}

			secondaryPosition += size;
			key++;
		}
		return key;
	}

	positionItems (applyStyle, {updateFrom, updateTo}) {
		const
			{data, lockHeaders, positioningOption, variableDimension} = this.props,
			{numOfItems} = this.state,
			{dimensionToExtent, isPrimaryDirectionVertical, isVirtualVariableList, primary, secondary} = this;
		let
			{primaryPosition, secondaryPosition} = this.getGridPosition(updateFrom),
			width,
			height,
			key = 0,
			position,
			j;

		primaryPosition -= (positioningOption === 'byItem') ? primary.scrollPosition : 0;
		if (variableDimension === 'width') {
			secondaryPosition -= (positioningOption === 'byItem') ? secondary.scrollPosition : 0;
			height = primary.itemSize;
		} else if (variableDimension === 'height') {
			secondaryPosition -= (positioningOption === 'byItem') ? secondary.scrollPosition : 0;
			width = primary.itemSize;
		} else {
			width = (isPrimaryDirectionVertical ? secondary.itemSize : primary.itemSize) + 'px';
			height = (isPrimaryDirectionVertical ? primary.itemSize : secondary.itemSize) + 'px';
			j = updateFrom % dimensionToExtent
		}

		// First row
		if (isVirtualVariableList && lockHeaders && updateFrom > 0) {
			position = secondaryPosition + this.secondary.positionOffsets[0][secondary.firstIndices[0]];
			key = this.positionVariableItems(0, key, width, height, 0, position, applyStyle);
		}

		// positioning items
		for (let i = updateFrom; i < updateTo; i++) {
			if (isVirtualVariableList) {
				position = secondaryPosition + this.secondary.positionOffsets[i][secondary.firstIndices[i]];
				key = this.positionVariableItems(i, key, width, height, primaryPosition, position, applyStyle);

				primaryPosition += primary.gridSize;
			} else {
				key = i % numOfItems;

				applyStyle(i, null, key, width, height, 0, primaryPosition, secondaryPosition);

				if (++j === dimensionToExtent) {
					secondaryPosition = 0;
					primaryPosition += primary.gridSize;
					j = 0;
				} else {
					secondaryPosition += secondary.gridSize;
				}
			}
		}
	}

	composeStyle (style, width, height, zIndex, ...rest) {
		if (this.isVirtualGridList || this.isVirtualVariableList) {
			style.width = width;
			style.height = height;

			if (this.isVirtualVariableList && this.props.lockHeaders) {
				this.composeZIndex(style, zIndex);
			}
		}
		this.composeItemPosition(style, ...rest);
	}

	composeZIndex (style, zIndex) {
		if (zIndex) {
			style.zIndex = zIndex;
		}
	}

	getXY = (primaryPosition, secondaryPosition) => (
		(this.isPrimaryDirectionVertical) ? {x: secondaryPosition, y: primaryPosition} : {x: primaryPosition, y: secondaryPosition}
	)

	composeTransform (style, primaryPosition, secondaryPosition = 0) {
		const {x, y} = this.getXY(primaryPosition, secondaryPosition);
		style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
	}

	composeLeftTop (style, primaryPosition, secondaryPosition = 0) {
		const {x, y} = this.getXY(primaryPosition, secondaryPosition);
		style.left = x + 'px';
		style.top = y + 'px';
	}

	applyTransformToContainerNode () {
		this.composeTransform(this.containerRef.style, -this.primary.scrollPosition, 0);
	}

	applyScrollLeftTopToWrapperNode () {
		const
			node = this.wrapperRef,
			{x, y} = this.getXY(this.primary.scrollPosition, 0);
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
			{dimensionToExtent, primary} = this,
			{spacing} = this.props;

		return (Math.ceil(primary.dataSize / dimensionToExtent) * primary.gridSize) - spacing;
	}

	adjustPositionOnFocus = (info, pos, itemSize, offsetHeader) => {
		const offsetToClientEnd = info.clientSize - itemSize;

		if (info.clientSize - offsetHeader >= itemSize) {
			if (pos > info.scrollPosition + offsetToClientEnd) {
				pos -= offsetToClientEnd;
			} else if (pos > info.scrollPosition + offsetHeader) {
				pos = info.scrollPosition;
			} else {
				pos -= offsetHeader;
			}
		}

		return pos;
	}

	calculatePositionOnFocus = (focusedIndex, key) => {
		const
			{data, lockHeaders} = this.props,
			{primary, secondary, isVirtualVariableList} = this;
		let gridPosition;
		if (isVirtualVariableList) {
			const
				indices = focusedIndex.split('-'),
				i = Number.parseInt(indices[0]),
				j = Number.parseInt(indices[1]);

			gridPosition = this.getVariableGridPosition(i, j);
			gridPosition.primaryPosition = this.adjustPositionOnFocus(primary, gridPosition.primaryPosition, primary.itemSize, (lockHeaders) ? primary.itemSize : 0);
			gridPosition.secondaryPosition = this.adjustPositionOnFocus(secondary, gridPosition.secondaryPosition, secondary.itemSize({data, index: {fixed: i, variable: j}}));
		} else {
			const index = Number.parseInt(focusedIndex);
		 	gridPosition = this.getGridPosition(index);
		 	gridPosition.primaryPosition = this.adjustPositionOnFocus(primary, gridPosition.primaryPosition, primary.itemSize);
		 	gridPosition.secondaryPosition = 0;
		}

		this.nodeIndexToBeBlurred = key;
		this.lastFocusedIndex = focusedIndex;

		return this.gridPositionToItemPosition(gridPosition);
	}

	setRestrict = (bool) => {
		Spotlight.set(this.props[dataContainerIdAttribute], {restrict: (bool) ? 'self-only' : 'self-first'});
	}

	setSpotlightContainerRestrict = (keyCode, index) => {
		const
			{isPrimaryDirectionVertical, dimensionToExtent, primary} = this,
			canMoveBackward = index >= dimensionToExtent,
			canMoveForward = index < (primary.dataSize - (((primary.dataSize - 1) % dimensionToExtent) + 1));
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

	updateClientSize = () => {
		const
			{positioningOption} = this.props,
			node = this.getContainerNode(positioningOption);

		if (!node) {
			return;
		}

		const
			{isPrimaryDirectionVertical, primary} = this,
			{clientWidth, clientHeight} = this.getClientSize(node);

		if (isPrimaryDirectionVertical) {
			primary.clientSize = clientHeight;
		} else {
			primary.clientSize = clientWidth;
		}

		this.updateStatesAndBounds(this.props);
	}

	// Calculate metrics for VirtualList after the 1st render to know client W/H.
	// We separate code related with data due to re use it when data changed.
	componentDidMount () {
		const {positioningOption} = this.props;

		this.calculateMetrics(this.props);
		this.updateStatesAndBounds(this.props);

		if (positioningOption !== 'byBrowser') {
			const containerNode = this.getContainerNode(positioningOption);

			// prevent native scrolling by Spotlight
			this.preventScroll = () => {
				containerNode.scrollTop = 0;
				containerNode.scrollLeft = this.context.rtl ? containerNode.scrollWidth : 0;
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
			{direction, itemSize, dataSize, overhang, spacing} = this.props,
			hasMetricsChanged = (
				direction !== nextProps.direction ||
				((itemSize instanceof Object) ? (itemSize.minWidth !== nextProps.itemSize.minWidth || itemSize.minHeight !== nextProps.itemSize.minHeight || itemSize.fixed !== nextProps.itemSize.fixed || itemSize.variable !== nextProps.itemSize.variable) : itemSize !== nextProps.itemSize) ||
				overhang !== nextProps.overhang ||
				spacing !== nextProps.spacing
			),
			hasDataChanged = (
				(dataSize instanceof Object) ?
				(dataSize.fixed !== nextProps.dataSize.fixed || dataSize.variable !== nextProps.dataSize.variable) :
				(dataSize !== nextProps.dataSize)
			);

		if (hasMetricsChanged) {
			this.calculateMetrics(nextProps);
			this.updateStatesAndBounds(nextProps);
		} else if (hasDataChanged) {
			this.updateStatesAndBounds(nextProps);
		}
	}

	componentWillUnmount () {
		const
			{positioningOption} = this.props,
			containerNode = this.getContainerNode(positioningOption);

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
			{primaryFirstIndex, numOfItems} = this.state,
			{primary} = this,
			max = Math.min(primary.dataSize, primaryFirstIndex + numOfItems);

		this.cc.length = 0;

		this.positionItems(this.applyStyleToNewNode, {updateFrom: primaryFirstIndex, updateTo: max});
		this.positionContainer();
	}

	render () {
		const
			props = Object.assign({}, this.props),
			{positioningOption, onScroll} = this.props,
			{primary, cc} = this;

		delete props.cbScrollTo;
		delete props.component;
		delete props.data;
		delete props.dataSize;
		delete props.direction;
		delete props.variableDimension;
		delete props.lockHeaders;
		delete props.hideScrollbars;
		delete props.itemSize;
		delete props.onScroll;
		delete props.onScrolling;
		delete props.onScrollStart;
		delete props.onScrollStop;
		delete props.overhang;
		delete props.positioningOption;
		delete props.variableMaxScrollSize;
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
