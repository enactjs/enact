/**
 * Exports the {@link moonstone/VirtualFlexList/VirtualFlexListCore.VirtualFlexListCore} component.
 *
 * @module moonstone/VirtualFlexList/VirtualFlexListCore
 */

import React, {Component, PropTypes} from 'react';

import {Spotlight} from '@enact/spotlight';

const
	dataContainerDisabledAttribute = 'data-container-disabled',
	dataContainerIdAttribute = 'data-container-id',
	dataIndexAttribute = 'data-index',
	keyLeft	 = 37,
	keyUp	 = 38,
	keyRight = 39,
	keyDown	 = 40;

const
	rowNumberColFuncShape = PropTypes.shape({row: PropTypes.number.isRequired, col: PropTypes.func.isRequired}),
	rowFuncColNumberShape = PropTypes.shape({row: PropTypes.func.isRequired, col: PropTypes.number.isRequired});

class VirtualFlexListCore extends Component {
	static propTypes = /** @lends moonstone/VirtualFlexList.VirtualFlexListCore.prototype */ {
		/**
		 * The render function for an item of the list.
		 * `index` is for accessing the index of the item.
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
		 * @type {Any}
		 * @default []
		 * @public
		 */
		data: PropTypes.any.isRequired,

		/**
		 * Size of data for the list.
		 *
		 * @type {Object}
		 * @public
		 */
		dataSize: PropTypes.oneOfType([rowNumberColFuncShape, rowFuncColNumberShape]).isRequired,

		/**
		 * Size of an item for the list.
		 *.
		 * @type {Object}
		 * @public
		 */
		itemSize: PropTypes.oneOfType([rowNumberColFuncShape, rowFuncColNumberShape]).isRequired,

		/**
		 * For variable width or variable height, we need to define max scroll width or max scroll height
		 * instead of calculating them from all items.
		 *
		 * @type {Number}
		 * @public
		 */
		maxVariableScrollSize: PropTypes.number,

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
		 * Direction specific options of the list; valid values are `'row'` and `'col'`.
		 *
		 * @type {String}
		 * @public
		 */
		variableAxis: PropTypes.oneOf(['row', 'col'])
	}

	static defaultProps = {
		component: null,
		data: [],
		dataSize: 0,
		overhang: 3,
		variableAxis: 'row',
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

	cc = []

	childRef = null

	// spotlight
	nodeIndexToBeBlurred = null
	lastFocusedIndex = null

	constructor (props) {
		super(props);

		this.state = {numOfItems: 0, primaryFirstIndex: 0};

		this.fixedAxis = (props.variableAxis === 'row') ? 'col' : 'row';
	}

	getScrollBounds = () => this.scrollBounds

	getClientSize = (node) => {
		return {
			clientWidth: node.clientWidth,
			clientHeight: node.clientHeight
		};
	}

	calculateMetrics (props) {
		const
			{itemSize, variableAxis} = props,
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

		if (variableAxis === 'row') {
			primary = heightInfo;
			secondary = widthInfo;
		} else {
			primary = widthInfo;
			secondary = heightInfo;
		}

		primary.itemSize = itemSize[variableAxis];
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
			{dataSize, overhang, variableAxis} = props,
			{primaryFirstIndex} = this.state,
			{fixedAxis, primary, secondary} = this;
		let numOfItems = Math.ceil(primary.clientSize / primary.itemSize) + overhang;

		numOfItems = Math.min(dataSize[variableAxis], numOfItems);

		primary.dataSize = dataSize[variableAxis];
		primary.maxFirstIndex = primary.dataSize - numOfItems;

		secondary.dataSize = dataSize[fixedAxis];

		this.setState({numOfItems, primaryFirstIndex: Math.min(primaryFirstIndex, primary.maxFirstIndex)});
		this.calculateScrollBounds(props);
		this.initSecondaryScrollInfo(primary.dataSize, numOfItems);
	}

	calculateScrollBounds (props) {
		const childRef = this.childRef;

		if (!childRef) {
			return;
		}

		const
			{maxVariableScrollSize, variableAxis} = props,
			{scrollBounds} = this,
			{clientWidth, clientHeight} = this.getClientSize(childRef);
		let maxPos;

		scrollBounds.clientWidth = clientWidth;
		scrollBounds.clientHeight = clientHeight;
		scrollBounds.scrollWidth = (variableAxis === 'row') ? maxVariableScrollSize : this.getScrollWidth();
		scrollBounds.scrollHeight = (variableAxis === 'col') ? maxVariableScrollSize : this.getScrollHeight();
		scrollBounds.maxLeft = Math.max(0, scrollBounds.scrollWidth - clientWidth);
		scrollBounds.maxTop = Math.max(0, scrollBounds.scrollHeight - clientHeight);

		// correct position
		maxPos = (variableAxis === 'row') ? scrollBounds.maxTop : scrollBounds.maxLeft;

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

		for (let i = 0; i < numOfItems; i++) {
			this.updateSecondaryScrollInfo(i, 0);
		}
	}

	updateSecondaryScrollInfo (primaryIndex, secondaryPosition) {
		const
			{data, maxVariableScrollSize, variableAxis} = this.props,
			{fixedAxis, secondary} = this,
			i = primaryIndex,
			secondaryDataSize = secondary.dataSize({data, index:{[variableAxis]: i}});
		let
			accumulatedSize = 0,
			size, // width or height
			j;

		secondary.positionOffsets[i] = [];
		secondary.thresholds[i] = {};

		for (j = 0; j < secondaryDataSize; j++) {
			size = secondary.itemSize({data, index: {[variableAxis]: i, [fixedAxis]: j}});
			secondary.positionOffsets[i][j] = accumulatedSize;
			if (accumulatedSize <= secondaryPosition && secondaryPosition < accumulatedSize + size) {
				if (j > 0) {
					secondary.firstIndices[i] =  j - 1;
				} else {
					secondary.firstIndices[i] =  j;
				}
				secondary.thresholds[i].min = accumulatedSize;
			}
			if (accumulatedSize + size >= secondaryPosition + secondary.clientSize) {
				if (j < secondaryDataSize - 1 && accumulatedSize + size < maxVariableScrollSize) {
					secondary.lastIndices[i] =  j + 1;
				} else {
					secondary.lastIndices[i] =  j;
				}
				secondary.thresholds[i].max = accumulatedSize + size;
				break;
			}
			accumulatedSize += size;
		}
		if (j === secondaryDataSize || !secondary.thresholds[i].max) {
			secondary.lastIndices[i] = secondaryDataSize - 1;
			secondary.thresholds[i].max = maxVariableScrollSize;
		}
	}

	setPrimaryScrollPosition (pos, dir) {
		const
			{variableAxis} = this.props,
			{primaryFirstIndex} = this.state,
			{primary, scrollBounds} = this,
			{itemSize, maxFirstIndex, threshold} = primary,
			maxPos = (variableAxis === 'row') ? scrollBounds.maxTop : scrollBounds.maxLeft,
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

	setScrollPosition (x, y, dirX, dirY) {
		const
			{variableAxis} = this.props,
			{numOfItems, primaryFirstIndex} = this.state,
			isVariableAxisRow = (variableAxis === 'row');
		let
			dir = {primary: 0},
			pos,
			newPrimaryFirstIndex,
			shouldUpdateState = false;

		if (isVariableAxisRow) {
			pos = {primary: y, secondary: x};
			dir = {primary: dirY, secondary: dirX};
		} else if (variableAxis === 'col') {
			pos = {primary: x, secondary: y};
			dir = {primary: dirX, secondary: dirY};
		} else {
			pos = {primary: (isVariableAxisRow) ? y : x};
			dir = {primary: (isVariableAxisRow) ? dirY : dirX};
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

	applyStyleToExistingNode = (i, j, cnt, partition, scrollDirection, ...rest) => {
		const
			node = this.childRef.children[cnt],
			id = scrollDirection === null ? (i + '-' + j) : (i + '-' + j + '-' + scrollDirection);

		if (node) {
			node.setAttribute(dataIndexAttribute, id);
			if (cnt === this.nodeIndexToBeBlurred && id !== this.lastFocusedIndex) {
				node.blur();
				this.nodeIndexToBeBlurred = null;
			}
			this.composeStyle(node.style, ...rest);
		}
	}

	applyStyleToNewNode = (i, j, cnt, partition, scrollDirection, ...rest) => {
		const
			{component, data, variableAxis} = this.props,
			{fixedAxis} = this,
			id = scrollDirection === null ? (i + '-' + j) : (i + '-' + j + '-' + scrollDirection),
			key = i + '-' + j + '-' + partition,
			itemElement = component({
				data,
				index: {[variableAxis]: i, [fixedAxis]: j},
				key
			}),
			style = {};

		this.composeStyle(style, ...rest);

		this.cc[cnt] = React.cloneElement(
			itemElement, {
				style: {...itemElement.props.style, ...style},
				[dataIndexAttribute]: id
			}
		);
	}

	positionItems (applyStyle, {updateFrom, updateTo}) {
		const
			{data, maxVariableScrollSize, variableAxis} = this.props,
			{fixedAxis, primary, secondary} = this;
		let
			primaryPosition = primary.itemSize * updateFrom,
			secondaryPosition = 0,
			width,
			height,
			cnt = 0,
			position,
			size;

		primaryPosition -= primary.scrollPosition;
		if (variableAxis === 'row') {
			secondaryPosition -= secondary.scrollPosition;
			height = primary.itemSize;
		} else if (variableAxis === 'col') {
			secondaryPosition -= secondary.scrollPosition;
			width = primary.itemSize;
		}

		// positioning items
		for (let i = updateFrom; i < updateTo; i++) {
			position = secondaryPosition + this.secondary.positionOffsets[i][secondary.firstIndices[i]];

			for (let j = secondary.firstIndices[i]; j <= secondary.lastIndices[i]; j++) {
				size = secondary.itemSize({data, index: {[variableAxis]: i, [fixedAxis]: j}});

				// clip items if they are located in the list edge
				// There are 3 sections. Section 1 for less than 0, Section 2 between 0 and less than client size, and Section 3 equal to or over client size
				// 1) If a list item is located between Section 1 and Section 3
				if (position < 0 && position + size > secondary.clientSize) {
					const
						partitionIndex = Math.floor((-position - 1) / secondary.clientSize, 10),
						key = {
							left: partitionIndex,
							middle: partitionIndex + 1,
							right: partitionIndex + 2
						};

					applyStyle(i, j, cnt++, key.left, 'left', (variableAxis === 'row') ? -position : width, (variableAxis === 'row') ? height : -position, primaryPosition, position);
					applyStyle(i, j, cnt++, key.middle, null, (variableAxis === 'row') ? secondary.clientSize : width, (variableAxis === 'row') ? height : secondary.clientSize, primaryPosition, 0);
					if (secondary.clientSize + secondary.scrollPosition < maxVariableScrollSize) {
						applyStyle(i, j, cnt++, key.right, 'right', (variableAxis === 'row') ? position + size - secondary.clientSize : width, (variableAxis === 'row') ? height : position + size - secondary.clientSize, primaryPosition, secondary.clientSize);
					}
					break;
				// 2) If a list item is located at Section 1
				} else if (position + size <= 0) {
					const
						partitionIndex = Math.floor((-position - 1) / secondary.clientSize, 10),
						key = partitionIndex;

					applyStyle(i, j, cnt++, key, 'left', (variableAxis === 'row') ? size : width, (variableAxis === 'row') ? height : size, primaryPosition, position);
					position += size;
				// 3) If a list item is located between Section 1 and Section 2
				} else if (position < 0 && position + size > 0) {
					const
						partitionIndex = Math.floor((-position - 1) / secondary.clientSize, 10),
						key = {
							left: partitionIndex,
							middle: partitionIndex + 1
						};

					applyStyle(i, j, cnt++, key.left, 'left', (variableAxis === 'row') ? -position : width, (variableAxis === 'row') ? height : -position, primaryPosition, position);
					applyStyle(i, j, cnt++, key.middle, null, (variableAxis === 'row') ? size + position : width, (variableAxis === 'row') ? height : size + position, primaryPosition, 0);
					position += size;
				// 4) If a list item is located between Section 2 and Section 3
				} else if (position >= 0 && position < secondary.clientSize && position + size > secondary.clientSize) {
					const
						partitionIndex = Math.floor(position / secondary.clientSize, 10),
						key = {
							middle: partitionIndex,
							right: partitionIndex + 1
						};

					applyStyle(i, j, cnt++, key.middle, null, (variableAxis === 'row') ? secondary.clientSize - position : width, (variableAxis === 'row') ? height : secondary.clientSize - position, primaryPosition, position);
					if (secondary.clientSize + secondary.scrollPosition < maxVariableScrollSize) {
						applyStyle(i, j, cnt++, key.right, 'right', (variableAxis === 'row') ? position + size - secondary.clientSize : width, (variableAxis === 'row') ? height : position + size - secondary.clientSize, primaryPosition, secondary.clientSize);
					}
					break;
				// 5) If a list item is located at Section 2 or at Section 3
				} else {
					const key = 0;
					let scrollDirection = null;

					if (position + size > secondary.clientSize) {
						scrollDirection = 'right';
					} else if (position < 0) {
						scrollDirection = 'left';
					}

					// eslint-disabled-next-line no-nested-ternary
					applyStyle(i, j, cnt++, key, scrollDirection, (variableAxis === 'row') ? size : width, (variableAxis === 'row') ? height : size, primaryPosition, position);
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
		return ((this.props.variableAxis === 'row') ? {x: (secondaryPosition * rtlDirection), y: primaryPosition} : {x: (primaryPosition * rtlDirection), y: secondaryPosition});
	}

	composeTransform (style, primaryPosition, secondaryPosition = 0) {
		const {x, y} = this.getXY(primaryPosition, secondaryPosition);
		style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
	}

	getScrollHeight = () => ((this.props.variableAxis === 'row') ? this.getVirtualScrollDimension() : this.scrollBounds.clientHeight)

	getScrollWidth = () => ((this.props.variableAxis === 'row') ? this.scrollBounds.clientWidth : this.getVirtualScrollDimension())

	getVirtualScrollDimension = () => (this.primary.dataSize * this.primary.itemSize)

	// Spotlight

	getVariableGridPosition (primaryIndex, secondaryIndex) {
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

	gridPositionToItemPosition = ({primaryPosition, secondaryPosition}) => ( (this.props.variableAxis === 'row') ? {left: secondaryPosition, top: primaryPosition} : {left: primaryPosition, top: secondaryPosition})

	calculateFlexPositionOnFocus = (focusedIndex, key) => {
		const
			{primary, secondary} = this,
			indices = focusedIndex.split('-'),
			i = Number.parseInt(indices[0]),
			j = Number.parseInt(indices[1]),
			direction = indices[2];
		let gridPosition;

		// To move along the secondary axis

		if (direction === 'right') {
			return this.gridPositionToItemPosition({primaryPosition: primary.scrollPosition, secondaryPosition: secondary.scrollPosition + secondary.clientSize});
		} else if (direction === 'left') {
			return this.gridPositionToItemPosition({primaryPosition: primary.scrollPosition, secondaryPosition: secondary.scrollPosition - secondary.clientSize});
		}

		// To move along the primary axis

		gridPosition = this.getVariableGridPosition(i, j);

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

	setSpotlightContainerRestrict = (keyCode, index) => {
		const {primary} = this;
		let
			isSelfOnly = false,
			i = 0,
			canMoveBackward,
			canMoveForward;

		const indices = index.split('-');
		i = Number.parseInt(indices[0]);
		canMoveBackward = i > 1;
		canMoveForward = i < (primary.dataSize - 1);

		if (this.props.variableAxis === 'row') {
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
			{dataSize, itemSize, overhang, variableAxis} = this.props,
			hasMetricsChanged = (
				((itemSize instanceof Object) ? (itemSize.minWidth !== nextProps.itemSize.minWidth || itemSize.minHeight !== nextProps.itemSize.minHeight || itemSize.row !== nextProps.itemSize.row || itemSize.col !== nextProps.itemSize.col) : itemSize !== nextProps.itemSize) ||
				overhang !== nextProps.overhang ||
				variableAxis !== nextProps.variableAxis
			),
			hasDataChanged = (
				(dataSize instanceof Object) ?
				(dataSize.row !== nextProps.dataSize.row || dataSize.col !== nextProps.dataSize.col) :
				(dataSize !== nextProps.dataSize)
			);

		this.fixedAxis = (nextProps.variableAxis === 'row') ? 'col' : 'row';

		if (hasMetricsChanged) {
			this.calculateMetrics(nextProps);
			this.updateStatesAndBounds(nextProps);
		} else if (hasDataChanged) {
			this.updateStatesAndBounds(nextProps);
		}
	}

	// render

	// eslint-disabled-next-line no-return-assign
	initchildRef = (ref) => (this.childRef = ref)

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
		delete props.itemSize;
		delete props.maxVariableScrollSize;
		delete props.overhang;
		delete props.variableAxis;

		if (primary) {
			this.renderCalculate();
		}

		return (
			<div {...props} ref={this.initchildRef}>
				{cc}
			</div>
		);
	}
}

export default VirtualFlexListCore;
export {VirtualFlexListCore};
