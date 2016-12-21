/**
 * Exports the {@link moonstone/VirtualFlexList.VirtualFlexListCore} component.
 *
 * @module moonstone/VirtualFlexListCore
 */

import React, {Component, PropTypes} from 'react';

import {Spotlight, SpotlightContainerDecorator} from '@enact/spotlight';

import Positionable from './Positionable';

const
	dataContainerDisabledAttribute = 'data-container-disabled',
	dataContainerIdAttribute = 'data-container-id',
	dataIndexAttribute = 'data-index',
	keyLeft	 = 37,
	keyUp	 = 38,
	keyRight = 39,
	keyDown	 = 40;

/**
 * The shape for the list item data size or item size for {@link moonstone/VirtualFlexList.dataSize}
 * or {@link moonstone/VirtualFlexList.itemSize}.
 *
 * @typedef {Object} sizeShape
 * @memberof moonstone/VirtualFlexListCore
 * @property {Number|Function} col - The data size or item size or the function to get them for column items.
 * @property {Number|Function} row - The data size or item size or the function to get them for row items.
 */
const sizeShape = PropTypes.oneOfType([
	PropTypes.shape({
		row: PropTypes.number.isRequired,
		col: PropTypes.func.isRequired
	}),
	PropTypes.shape({
		row: PropTypes.func.isRequired,
		col: PropTypes.number.isRequired
	})
]);

/**
 * {@link moonstone/VirtualFlexList.VirtualFlexListCore} is a base component for VirtualFlexList.
 *
 * @class VirtualFlexListCore
 * @memberof moonstone/VirtualFlexList
 * @ui
 * @private
 */
class VirtualFlexListCore extends Component {
	static propTypes = /** @lends moonstone/VirtualFlexList.VirtualFlexList.prototype */ {
		/**
		 * The render function for an item of the list.
		 * `data` is same with the `data` prop in the list.
		 * `index` is for accessing the index of the item and is the object
		 * which has `row` property for a row index and `col` property for a column index.
		 * `key` MUST be passed as a prop for DOM recycling.
		 * Data manipulation can be done in this function.
		 *
		 * @type {Function}
		 * @public
		 */
		component: PropTypes.func.isRequired,

		/**
		 * Data for the list.
		 * Check mutation of this and determine whether the list should update or not.
		 *
		 * @type {Object}
		 * @public
		 */
		data: PropTypes.any.isRequired,

		/**
		 * Size of data for the list.
		 *
		 * @type {moonstone/VirtualFlexList.sizeShape}
		 * @public
		 */
		dataSize: sizeShape.isRequired,

		/**
		 * Size of an item for the list.
		 *.
		 * @type {moonstone/VirtualFlexList.sizeShape}
		 * @public
		 */
		itemSize: sizeShape.isRequired,

		/**
		 * Direction specific options of the list; valid values are `'row'` and `'col'`.
		 *
		 * @type {String}
		 * default `'row'`
		 * @public
		 */
		flexAxis: PropTypes.oneOf(['row', 'col']),

		/**
		 * For flex width or variable height, we need to define max scroll width or max scroll height
		 * instead of calculating them from all items.
		 *
		 * @type {Number}
		 * @public
		 */
		maxFlexScrollSize: PropTypes.number,

		/**
		 * Number of spare DOM node.
		 * `3` is good for the default value experimentally and
		 * this value is highly recommended not to be changed by developers.
		 *
		 * @type {Number}
		 * @default 3
		 * @private
		 */
		overhang: PropTypes.number
	}

	static defaultProps = {
		component: null,
		data: [],
		dataSize: 0,
		flexAxis: 'row',
		overhang: 3,
		style: {}
	}

	/*
	 * Class private variables
	 */

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

	cc = []

	childRef = null

	// spotlight
	nodeIndexToBeBlurred = null
	lastFocusedIndex = null

	constructor (props) {
		super(props);

		this.state = {numOfItems: 0, primaryFirstIndex: 0};

		this.fixedAxis = (props.flexAxis === 'row') ? 'col' : 'row';
	}

	/*
	 * Metrics and scroll bounds
	 */

	getScrollBounds = () => this.scrollBounds

	getClientSize = (node) => {
		return {
			clientWidth: node.clientWidth,
			clientHeight: node.clientHeight
		};
	}

	calculateMetrics (props) {
		const
			{flexAxis, itemSize} = props,
			childRef = this.childRef;

		if (!childRef) {
			return;
		}

		const
			{clientWidth, clientHeight} = this.getClientSize(childRef),
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
		let primary, secondary, primaryThresholdBase;

		if (flexAxis === 'row') {
			primary = heightInfo;
			secondary = widthInfo;
		} else {
			primary = widthInfo;
			secondary = heightInfo;
		}

		primary.itemSize = itemSize[flexAxis];
		secondary.itemSize = itemSize[this.fixedAxis];

		primary.maxFirstIndex = 0;
		primaryThresholdBase = primary.itemSize * 2;
		primary.threshold = {min: -Infinity, max: primaryThresholdBase, base: primaryThresholdBase};

		this.primary = primary;
		this.secondary = secondary;

		// eslint-disable-next-line react/no-direct-mutation-state
		this.state.primaryFirstIndex = 0;
		// eslint-disable-next-line react/no-direct-mutation-state
		this.state.numOfItems = 0;
	}

	updateStatesAndBounds (props) {
		const
			{dataSize, flexAxis, overhang} = props,
			{primaryFirstIndex} = this.state,
			{fixedAxis, primary, secondary} = this;
		let numOfItems = Math.ceil(primary.clientSize / primary.itemSize) + overhang;

		numOfItems = Math.min(dataSize[flexAxis], numOfItems);

		primary.dataSize = dataSize[flexAxis];
		primary.maxFirstIndex = primary.dataSize - numOfItems;

		secondary.dataSize = dataSize[fixedAxis];

		this.setState({numOfItems, primaryFirstIndex: Math.min(primaryFirstIndex, primary.maxFirstIndex)});
		this.calculateScrollBounds(props);
		this.initSecondaryScrollInfo(primary.dataSize, numOfItems);
	}

	getScrollHeight = () => ((this.props.flexAxis === 'row') ? this.getVirtualScrollDimension() : this.scrollBounds.clientHeight)

	getScrollWidth = () => ((this.props.flexAxis === 'row') ? this.scrollBounds.clientWidth : this.getVirtualScrollDimension())

	getVirtualScrollDimension = () => (this.primary.dataSize * this.primary.itemSize)

	calculateScrollBounds (props) {
		const childRef = this.childRef;

		if (!childRef) {
			return;
		}

		const
			{flexAxis, maxFlexScrollSize} = props,
			{scrollBounds} = this,
			{clientWidth, clientHeight} = this.getClientSize(childRef);
		let maxPos;

		scrollBounds.clientWidth = clientWidth;
		scrollBounds.clientHeight = clientHeight;
		scrollBounds.scrollWidth = (flexAxis === 'row') ? maxFlexScrollSize : this.getScrollWidth();
		scrollBounds.scrollHeight = (flexAxis === 'col') ? maxFlexScrollSize : this.getScrollHeight();
		scrollBounds.maxLeft = Math.max(0, scrollBounds.scrollWidth - clientWidth);
		scrollBounds.maxTop = Math.max(0, scrollBounds.scrollHeight - clientHeight);

		// correct position
		maxPos = (flexAxis === 'row') ? scrollBounds.maxTop : scrollBounds.maxLeft;

		this.syncPrimaryThreshold(maxPos);
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
		secondary.thresholds = Array(primaryDataSize);

		for (let primaryIndex = 0; primaryIndex < numOfItems; primaryIndex++) {
			this.updateSecondaryScrollInfo(primaryIndex, 0);
		}
	}

	updateSecondaryScrollInfo (primaryIndex, secondaryPosition) {
		const
			{data, flexAxis, maxFlexScrollSize} = this.props,
			{fixedAxis, secondary} = this,
			secondaryDataSize = secondary.dataSize({data, index:{[flexAxis]: primaryIndex}});
		let
			accumulatedSize = 0,
			size, // width or height
			secondaryIndex;

		secondary.positionOffsets[primaryIndex] = [];
		secondary.thresholds[primaryIndex] = {};

		for (secondaryIndex = 0; secondaryIndex < secondaryDataSize; secondaryIndex++) {
			size = secondary.itemSize({data, index: {[flexAxis]: primaryIndex, [fixedAxis]: secondaryIndex}});
			secondary.positionOffsets[primaryIndex][secondaryIndex] = accumulatedSize;
			if (accumulatedSize <= secondaryPosition && secondaryPosition < accumulatedSize + size) {
				if (secondaryIndex > 0) {
					secondary.firstIndices[primaryIndex] = secondaryIndex - 1;
				} else {
					secondary.firstIndices[primaryIndex] = secondaryIndex;
				}
				secondary.thresholds[primaryIndex].min = accumulatedSize;
			}
			if (accumulatedSize + size >= secondaryPosition + secondary.clientSize) {
				if (secondaryIndex < secondaryDataSize - 1 && accumulatedSize + size < maxFlexScrollSize) {
					secondary.lastIndices[primaryIndex] = secondaryIndex + 1;
				} else {
					secondary.lastIndices[primaryIndex] = secondaryIndex;
				}
				secondary.thresholds[primaryIndex].max = accumulatedSize + size;
				break;
			}
			accumulatedSize += size;
		}
		if (secondaryIndex === secondaryDataSize || !secondary.thresholds[primaryIndex].max) {
			secondary.lastIndices[primaryIndex] = secondaryDataSize - 1;
			secondary.thresholds[primaryIndex].max = maxFlexScrollSize;
		}
	}

	/*
	 * Scroll
	 */

	setPrimaryScrollPosition (pos, dir) {
		const
			{flexAxis} = this.props,
			{primaryFirstIndex} = this.state,
			{primary, scrollBounds} = this,
			{itemSize, maxFirstIndex, threshold} = primary,
			maxPos = (flexAxis === 'row') ? scrollBounds.maxTop : scrollBounds.maxLeft,
			minOfMax = threshold.base,
			maxOfMin = maxPos - minOfMax;
		let
			delta,
			newPrimaryFirstIndex = primaryFirstIndex,
			numOfGridLines;

		if (dir === 1 && pos > threshold.max) {
			delta = pos - threshold.max;
			numOfGridLines = Math.ceil(delta / itemSize); // how many lines should we add
			threshold.max = Math.min(maxPos, threshold.max + numOfGridLines * itemSize);
			threshold.min = Math.min(maxOfMin, threshold.max - itemSize);
			newPrimaryFirstIndex = Math.min(maxFirstIndex, primaryFirstIndex + numOfGridLines);
		} else if (dir === -1 && pos < threshold.min) {
			delta = threshold.min - pos;
			numOfGridLines = Math.ceil(delta / itemSize);
			threshold.max = Math.max(minOfMax, threshold.min - (numOfGridLines * itemSize - itemSize));
			threshold.min = (threshold.max > minOfMax) ? threshold.max - itemSize : -Infinity;
			newPrimaryFirstIndex = Math.max(0, primaryFirstIndex - numOfGridLines);
		}
		this.syncPrimaryThreshold(maxPos);
		primary.scrollPosition = pos;

		return newPrimaryFirstIndex;
	}

	setSecondaryScrollPosition (newPrimaryFirstIndex, pos, dir) {
		const
			{numOfItems, primaryFirstIndex} = this.state,
			{clientSize, thresholds: secondaryThresholds} = this.secondary;
		let	shouldUpdateState = false;

		for (let primaryIndex = newPrimaryFirstIndex; primaryIndex < newPrimaryFirstIndex + numOfItems; primaryIndex++) {
			if (
				// primary boundary
				(primaryFirstIndex < newPrimaryFirstIndex && primaryIndex >= primaryFirstIndex + numOfItems) ||
				(primaryFirstIndex > newPrimaryFirstIndex && primaryIndex < primaryFirstIndex) ||
				// secondary boundary
				(dir === 1 && pos + clientSize > secondaryThresholds[primaryIndex].max) ||
				(dir === -1 && pos < secondaryThresholds[primaryIndex].min) ||
				// threshold was not defined yet
				(!(secondaryThresholds[primaryIndex].max || secondaryThresholds[primaryIndex].min))
			) {
				this.updateSecondaryScrollInfo(primaryIndex, pos);
				shouldUpdateState = true;
			}
		}
		this.secondary.scrollPosition = pos;

		return shouldUpdateState;
	}

	setScrollPosition (x, y, dirX, dirY) {
		const
			{flexAxis} = this.props,
			{numOfItems, primaryFirstIndex} = this.state,
			isFlexAxisRow = (flexAxis === 'row');
		let
			dir = {primary: 0},
			pos,
			newPrimaryFirstIndex,
			shouldUpdateState = false;

		if (isFlexAxisRow) {
			pos = {primary: y, secondary: x};
			dir = {primary: dirY, secondary: dirX};
		} else if (flexAxis === 'col') {
			pos = {primary: x, secondary: y};
			dir = {primary: dirX, secondary: dirY};
		} else {
			pos = {primary: (isFlexAxisRow) ? y : x};
			dir = {primary: (isFlexAxisRow) ? dirY : dirX};
		}

		// for primary direction
		newPrimaryFirstIndex = this.setPrimaryScrollPosition(pos.primary, dir.primary);

		// for secondary direction
		shouldUpdateState = this.setSecondaryScrollPosition(newPrimaryFirstIndex, pos.secondary, dir.secondary);

		if ((primaryFirstIndex !== newPrimaryFirstIndex) || shouldUpdateState === true) {
			this.setState({primaryFirstIndex: newPrimaryFirstIndex});
		} else {
			this.positionItems(this.applyStyleToExistingNode, {
				updateFrom: primaryFirstIndex,
				updateTo: primaryFirstIndex + numOfItems
			});
		}
	}

	/*
	 * Render items
	 */

	applyStyleToExistingNode = (primaryIndex, secondaryIndex, count, partitionIndex, scrollDirection, ...rest) => {
		const
			node = this.childRef.children[count],
			id = scrollDirection === null ? (primaryIndex + '-' + secondaryIndex) : (primaryIndex + '-' + secondaryIndex + '-' + scrollDirection);

		if (node) {
			node.setAttribute(dataIndexAttribute, id);
			if (count === this.nodeIndexToBeBlurred && id !== this.lastFocusedIndex) {
				node.blur();
				this.nodeIndexToBeBlurred = null;
			}
			this.composeStyle(node.style, ...rest);
		}
	}

	applyStyleToNewNode = (primaryIndex, secondaryIndex, count, partitionIndex, scrollDirection, ...rest) => {
		const
			{component, data, flexAxis} = this.props,
			{fixedAxis} = this,
			id = scrollDirection === null ? (primaryIndex + '-' + secondaryIndex) : (primaryIndex + '-' + secondaryIndex + '-' + scrollDirection),
			key = primaryIndex + '-' + secondaryIndex + '-' + partitionIndex,
			itemElement = component({
				data,
				index: {[flexAxis]: primaryIndex, [fixedAxis]: secondaryIndex},
				key
			}),
			style = {};

		this.composeStyle(style, ...rest);

		this.cc[count] = React.cloneElement(
			itemElement, {
				style: {...itemElement.props.style, ...style},
				[dataIndexAttribute]: id
			}
		);
	}

	applyStyleToSplitNode = (applyStyle, primaryIndex, secondaryIndex, primaryPosition, width, height) => (secondaryPosition, size, count, partitionIndex, scrollDirection) => {
		const {flexAxis} = this.props;
		return applyStyle(primaryIndex, secondaryIndex, count, partitionIndex, scrollDirection, (flexAxis === 'row') ? size : width, (flexAxis === 'row') ? height : size, primaryPosition, secondaryPosition);
	}

	getPartitionIndex (position) {
		if (position < 0) {
			return Math.floor((-position - 1) / this.secondary.clientSize, 10);
		} else {
			return Math.floor(position / this.secondary.clientSize, 10);
		}
	}

	positionItems (applyStyle, {updateFrom, updateTo}) {
		const
			{data, flexAxis, maxFlexScrollSize} = this.props,
			{fixedAxis, primary, secondary} = this;
		let
			primaryPosition = primary.itemSize * updateFrom,
			secondaryPosition = 0,
			width,
			height,
			count = 0,
			position,
			size,
			partitionIndex;

		primaryPosition -= primary.scrollPosition;
		if (flexAxis === 'row') {
			secondaryPosition -= secondary.scrollPosition;
			height = primary.itemSize;
		} else if (flexAxis === 'col') {
			secondaryPosition -= secondary.scrollPosition;
			width = primary.itemSize;
		}

		// positioning items
		for (let primaryIndex = updateFrom; primaryIndex < updateTo; primaryIndex++) {
			position = secondaryPosition + this.secondary.positionOffsets[primaryIndex][secondary.firstIndices[primaryIndex]];

			for (let secondaryIndex = secondary.firstIndices[primaryIndex]; secondaryIndex <= secondary.lastIndices[primaryIndex]; secondaryIndex++) {
				size = secondary.itemSize({data, index: {[flexAxis]: primaryIndex, [fixedAxis]: secondaryIndex}});
				partitionIndex = this.getPartitionIndex(position);

				// To clip items if positioned in the list edge divided into the following 3 sections
				// 1) on the left side of the list
				// 2) on the list
				// 3) on the right side of the list
				// Depending on the sections, the items could be split into two or three.

				const
					isOnLeftSide = position < 0,
					isOnRightSide = position + size > secondary.clientSize,
					isOnlyOnLeftSide = position + size <= 0,
					isFromLeftSideToList = 0 < position + size && !isOnRightSide,
					isFromListToRightSide = 0 <= position && position < secondary.clientSize,
					applyStyleToSplitNode = this.applyStyleToSplitNode(applyStyle, primaryIndex, secondaryIndex, primaryPosition, width, height);

				// 1) Positioned from the left side to the right side
				if (isOnLeftSide && isOnRightSide) {
					applyStyleToSplitNode(position, -position, count++, partitionIndex++, 'left');
					applyStyleToSplitNode(0, secondary.clientSize, count++, partitionIndex++, null);
					if (secondary.clientSize + secondary.scrollPosition < maxFlexScrollSize) {
						applyStyleToSplitNode(secondary.clientSize, position + size - secondary.clientSize, count++, partitionIndex, 'right');
					}
					break;
				// 2) Positioned only on the left side
				} else if (isOnlyOnLeftSide) {
					applyStyleToSplitNode(position, size, count++, partitionIndex, 'left');
					position += size;
				// 3) Positioned from the left side to the list
				} else if (isOnLeftSide && isFromLeftSideToList) {
					applyStyleToSplitNode(position, -position, count++, partitionIndex++, 'left');
					applyStyleToSplitNode(0, size + position, count++, partitionIndex++, null);
					position += size;
				// 4) Positioned from the list to the right side
				} else if (isFromListToRightSide && isOnRightSide) {
					applyStyleToSplitNode(position, secondary.clientSize - position, count++, partitionIndex++, null);
					if (secondary.clientSize + secondary.scrollPosition < maxFlexScrollSize) {
						applyStyleToSplitNode(secondary.clientSize, position + size - secondary.clientSize, count++, partitionIndex, 'right');
					}
					break;
				} else {
				// 5) Positioned only on the list or only on the right side
					let scrollDirection = null; // on a list by default

					if (isOnRightSide) {
						scrollDirection = 'right';
					} else if (isOnLeftSide) {
						scrollDirection = 'left';
					}

					// eslint-disabled-next-line no-nested-ternary
					applyStyleToSplitNode(position, size, count++, 0, scrollDirection);
					position += size;
				}
			}

			primaryPosition += primary.itemSize;
		}
	}

	composeStyle (style, width, height, ...rest) {
		style.width = width;
		style.height = height;
		this.composeTransform(style, ...rest);
	}

	getXY = (primaryPosition, secondaryPosition) => {
		const rtlDirection = this.context.rtl ? -1 : 1;
		return ((this.props.flexAxis === 'row') ? {x: (secondaryPosition * rtlDirection), y: primaryPosition} : {x: (primaryPosition * rtlDirection), y: secondaryPosition});
	}

	composeTransform (style, primaryPosition, secondaryPosition = 0) {
		const {x, y} = this.getXY(primaryPosition, secondaryPosition);
		style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
	}

	/*
	 * Spotlight
	 */

	getFlexGridPosition (primaryIndex, secondaryIndex) {
		const
			{primary, secondary} = this,
			primaryPosition = primaryIndex * primary.itemSize,
			secondaryPosition = secondary.positionOffsets[primaryIndex][secondaryIndex];

		return {primaryPosition, secondaryPosition};
	}

	adjustPrimaryPositionOnFocus = (info, pos, itemSize) => {
		const offsetToClientEnd = info.clientSize - itemSize;

		if (info.clientSize >= itemSize) {
			if (pos > info.scrollPosition + offsetToClientEnd) {
				pos = info.scrollPosition + info.clientSize;
			} else if (pos >= info.scrollPosition) {
				pos = info.scrollPosition;
			} else {
				pos = info.scrollPosition - info.clientSize;
			}
		}
		return pos;
	}

	gridPositionToItemPosition = ({primaryPosition, secondaryPosition}) => ( (this.props.flexAxis === 'row') ? {left: secondaryPosition, top: primaryPosition} : {left: primaryPosition, top: secondaryPosition})

	calculateFlexPositionOnFocus = (focusedIndex, key) => {
		const
			{primary, secondary} = this,
			indices = focusedIndex.split('-'),
			primaryIndex = Number.parseInt(indices[0]),
			secondaryIndex = Number.parseInt(indices[1]),
			direction = indices[2];
		let gridPosition;

		// To move along the secondary axis

		if (direction === 'right') {
			return this.gridPositionToItemPosition({primaryPosition: primary.scrollPosition, secondaryPosition: secondary.scrollPosition + secondary.clientSize});
		} else if (direction === 'left') {
			return this.gridPositionToItemPosition({primaryPosition: primary.scrollPosition, secondaryPosition: secondary.scrollPosition - secondary.clientSize});
		}

		// To move along the primary axis

		gridPosition = this.getFlexGridPosition(primaryIndex, secondaryIndex);

		if (gridPosition.primaryPosition < primary.scrollPosition || gridPosition.primaryPosition >= primary.clientSize + primary.scrollPosition) {
			gridPosition.primaryPosition = this.adjustPrimaryPositionOnFocus(primary, gridPosition.primaryPosition, primary.itemSize);
			gridPosition.secondaryPosition = this.secondary.scrollPosition;

			this.nodeIndexToBeBlurred = key;
			this.lastFocusedIndex = focusedIndex;

			return this.gridPositionToItemPosition(gridPosition);
		} else {
			return null;
		}
	}

	setSpotlightContainerRestrict = (keyCode, dataIndex) => {
		const {primary} = this;
		let
			isSelfOnly = false,
			primaryIndex = 0,
			canMoveBackward,
			canMoveForward;

		const indices = dataIndex.split('-');
		primaryIndex = Number.parseInt(indices[0]);
		canMoveBackward = primaryIndex > 1;
		canMoveForward = primaryIndex < (primary.dataSize - 1);

		if (this.props.flexAxis === 'row') {
			if (keyCode === keyUp && canMoveBackward || keyCode === keyDown && canMoveForward) {
				isSelfOnly = true;
			}
		} else if (keyCode === keyLeft && canMoveBackward || keyCode === keyRight && canMoveForward) {
			isSelfOnly = true;
		}

		this.setRestrict(isSelfOnly);
	}

	setRestrict = (bool) => {
		Spotlight.set(this.props[dataContainerIdAttribute], {restrict: (bool) ? 'self-only' : 'self-first'});
	}

	setContainerDisabled = (bool) => {
		const childRef = this.childRef;

		if (childRef) {
			childRef.setAttribute(dataContainerDisabledAttribute, bool);
		}
	}

	/*
	 * Life cycle methods
	 */

	// Calculate metrics for VirtualFlexList after the 1st render to know client W/H.
	// We separate code related with data due to re use it when data changed.
	componentDidMount () {
		this.calculateMetrics(this.props);
		this.updateStatesAndBounds(this.props);

		const childRef = this.childRef;

		// prevent native scrolling by Spotlight
		this.preventScroll = () => {
			childRef.scrollTop = 0;
			childRef.scrollLeft = this.context.rtl ? childRef.scrollWidth : 0;
		};

		if (childRef && childRef.addEventListener) {
			childRef.addEventListener('scroll', this.preventScroll);
		}
	}

	// Call updateStatesAndBounds here when dataSize has been changed to update nomOfItems state.
	// Calling setState within componentWillReceivePropswill not trigger an additional render.
	componentWillReceiveProps (nextProps) {
		const
			{dataSize, flexAxis, itemSize, overhang} = this.props,
			hasMetricsChanged = (
				((itemSize instanceof Object) ? (itemSize.minWidth !== nextProps.itemSize.minWidth || itemSize.minHeight !== nextProps.itemSize.minHeight || itemSize.row !== nextProps.itemSize.row || itemSize.col !== nextProps.itemSize.col) : itemSize !== nextProps.itemSize) ||
				overhang !== nextProps.overhang ||
				flexAxis !== nextProps.flexAxis
			),
			hasDataChanged = (
				(dataSize instanceof Object) ?
				(dataSize.row !== nextProps.dataSize.row || dataSize.col !== nextProps.dataSize.col) :
				(dataSize !== nextProps.dataSize)
			);

		this.fixedAxis = (nextProps.flexAxis === 'row') ? 'col' : 'row';

		if (hasMetricsChanged) {
			this.calculateMetrics(nextProps);
			this.updateStatesAndBounds(nextProps);
		} else if (hasDataChanged) {
			this.updateStatesAndBounds(nextProps);
		}
	}

	// eslint-disabled-next-line no-return-assign
	initChildRef = (ref) => (this.childRef = ref)

	renderCalculate () {
		const
			{numOfItems, primaryFirstIndex} = this.state,
			{primary} = this,
			max = Math.min(primary.dataSize, primaryFirstIndex + numOfItems);

		this.cc.length = 0;

		this.positionItems(this.applyStyleToNewNode, {updateFrom: primaryFirstIndex, updateTo: max});
	}

	render () {
		const
			{primary, cc} = this,
			props = Object.assign({}, this.props);

		delete props.component;
		delete props.data;
		delete props.dataSize;
		delete props.flexAxis;
		delete props.itemSize;
		delete props.maxFlexScrollSize;
		delete props.overhang;

		if (primary) {
			this.renderCalculate();
		}

		return (
			<div {...props} ref={this.initChildRef}>
				{cc}
			</div>
		);
	}
}

const VirtualFlexListBase = SpotlightContainerDecorator(Positionable(VirtualFlexListCore));

export default VirtualFlexListBase;
export {VirtualFlexListCore, VirtualFlexListBase};
