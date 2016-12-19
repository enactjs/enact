/**
 * Exports the {@link moonstone/VirtualFlexList/VirtualFlexListCore.VirtualFlexListCore} component.
 *
 * @module moonstone/VirtualFlexList/VirtualFlexListCore
 */

import React, {Component, PropTypes} from 'react';

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
		 * Direction specific options of the list; valid values are `'row'` and `'col'`.
		 *
		 * @type {String}
		 * @public
		 */
		flexAxis: PropTypes.oneOf(['row', 'col']),

		/**
		 * For flex list width or flex list height, we need to define max list width or max list height
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
		flexAxis: 'row',
		data: [],
		dataSize: 0,
		overhang: 3,
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

	containerRef = null

	constructor (props) {
		super(props);

		this.state = {numOfItems: 0, primaryFirstIndex: 0};
		this.initContainerRef = this.initRef('containerRef');

		this.fixedAxis = (props.flexAxis === 'row') ? 'col' : 'row';
	}

	getScrollBounds = () => this.scrollBounds

	getContainerNode = () => this.containerRef

	getClientSize = (node) => {
		return {
			clientWidth: node.clientWidth,
			clientHeight: node.clientHeight
		};
	}

	calculateMetrics (props) {
		const
			{flexAxis, itemSize} = props,
			node = this.getContainerNode();

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

	calculateScrollBounds (props) {
		const node = this.getContainerNode();

		if (!node) {
			return;
		}

		const
			{flexAxis, maxFlexScrollSize} = props,
			{scrollBounds} = this,
			{clientWidth, clientHeight} = this.getClientSize(node);
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

		for (let i = 0; i < numOfItems; i++) {
			this.updateSecondaryScrollInfo(i, 0);
		}
	}

	updateSecondaryScrollInfo (primaryIndex, secondaryPosition) {
		const
			{data, flexAxis, maxFlexScrollSize} = this.props,
			{fixedAxis, secondary} = this,
			i = primaryIndex,
			secondaryDataSize = secondary.dataSize({data, index:{[flexAxis]: i}});
		let
			accumulatedSize = 0,
			size, // width or height
			j;

		secondary.positionOffsets[i] = [];
		secondary.thresholds[i] = {};

		for (j = 0; j < secondaryDataSize; j++) {
			size = secondary.itemSize({data, index: {[flexAxis]: i, [fixedAxis]: j}});
			secondary.positionOffsets[i][j] = accumulatedSize;
			if (accumulatedSize <= secondaryPosition && secondaryPosition < accumulatedSize + size) {
				secondary.firstIndices[i] = j;
				secondary.thresholds[i].min = accumulatedSize;
			}
			if (accumulatedSize + size >= secondaryPosition + secondary.clientSize) {
				secondary.lastIndices[i] = j;
				secondary.thresholds[i].max = accumulatedSize + size;
				break;
			}
			accumulatedSize += size;
		}
		if (j === secondaryDataSize || !secondary.thresholds[i].max) {
			secondary.lastIndices[i] = secondaryDataSize - 1;
			secondary.thresholds[i].max = maxFlexScrollSize;
		}
	}

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
			{flexAxis} = this.props,
			{numOfItems, primaryFirstIndex} = this.state,
			isAariableAxisRow = (flexAxis === 'row');
		let
			dir = {primary: 0},
			pos,
			newPrimaryFirstIndex,
			shouldUpdateState = false;

		if (isAariableAxisRow) {
			pos = {primary: y, secondary: x};
			dir = {primary: dirY, secondary: dirX};
		} else if (flexAxis === 'col') {
			pos = {primary: x, secondary: y};
			dir = {primary: dirX, secondary: dirY};
		} else {
			pos = {primary: (isAariableAxisRow) ? y : x};
			dir = {primary: (isAariableAxisRow) ? dirY : dirX};
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

	applyStyleToExistingNode = (i, j, key, ...rest) => {
		const node = this.containerRef.children[key];

		if (node) {
			this.composeStyle(node.style, ...rest);
		}
	}

	applyStyleToNewNode = (i, j, key, ...rest) => {
		const
			{component, data, flexAxis} = this.props,
			{fixedAxis} = this,
			itemElement = component({
				data,
				index: {[flexAxis]: i, [fixedAxis]: j},
				key
			}),
			style = {};

		this.composeStyle(style, ...rest);

		this.cc[key] = React.cloneElement(
			itemElement, {
				style: {...itemElement.props.style, ...style}
			}
		);
	}

	positionItems (applyStyle, {updateFrom, updateTo}) {
		const
			{data, flexAxis} = this.props,
			{fixedAxis, primary, secondary} = this;
		let
			primaryPosition = primary.itemSize * updateFrom,
			secondaryPosition = 0,
			width,
			height,
			key = 0,
			position,
			size;

		primaryPosition -= primary.scrollPosition;
		if (flexAxis === 'row') {
			secondaryPosition -= secondary.scrollPosition;
			height = primary.itemSize;
		} else if (flexAxis === 'col') {
			secondaryPosition -= secondary.scrollPosition;
			width = primary.itemSize;
		}

		// positioning items
		for (let i = updateFrom; i < updateTo; i++) {
			position = secondaryPosition + this.secondary.positionOffsets[i][secondary.firstIndices[i]];

			for (let j = secondary.firstIndices[i]; j <= secondary.lastIndices[i]; j++) {
				size = secondary.itemSize({data, index: {[flexAxis]: i, [fixedAxis]: j}});

				// clip items if they are located in the list edge
				if (position < 0) {
					size += position;
					position = 0;
				}
				if (position + size > secondary.clientSize) {
					size = secondary.clientSize - position;
				}

				if (flexAxis === 'row') {
					applyStyle(i, j, key, size, height, primaryPosition, position);
				} else if (flexAxis === 'col') {
					applyStyle(i, j, key, width, size, primaryPosition, position);
				}

				position += size;
				key++;
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

	getScrollHeight = () => ((this.props.flexAxis === 'row') ? this.getVirtualScrollDimension() : this.scrollBounds.clientHeight)

	getScrollWidth = () => ((this.props.flexAxis === 'row') ? this.scrollBounds.clientWidth : this.getVirtualScrollDimension())

	getVirtualScrollDimension = () => (this.primary.dataSize * this.primary.itemSize)

	// Calculate metrics for VirtualFlexList after the 1st render to know client W/H.
	// We separate code related with data due to re use it when data changed.
	componentDidMount () {
		this.calculateMetrics(this.props);
		this.updateStatesAndBounds(this.props);
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

	// render

	initRef (prop) {
		return (ref) => {
			this[prop] = ref;
		};
	}

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
			<div {...props} ref={this.initContainerRef}>
				{cc}
			</div>
		);
	}
}

export default VirtualFlexListCore;
export {VirtualFlexListCore};
