import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Scrollable from '../Scrollable';
import ScrollableNative from '../Scrollable/ScrollableNative';

import css from './VirtualList.module.less';

const
	nop = () => {},
	JS = 'JS',
	Native = 'Native';

/**
 * The shape for the grid list item size
 * in a list for [VirtualGridList]{@link ui/VirtualList.VirtualGridList}.
 *
 * @typedef {Object} gridListItemSizeShape
 * @memberof ui/VirtualList
 * @property {Number}    minWidth    The minimum width of the grid list item.
 * @property {Number}    minHeight    The minimum height of the grid list item.
 * @public
 */
const gridListItemSizeShape = PropTypes.shape({
	minHeight: PropTypes.number.isRequired,
	minWidth: PropTypes.number.isRequired
});

/**
 * The base version of the virtual list component.
 *
 * @class VirtualListBase
 * @memberof ui/VirtualList
 * @ui
 * @public
 */
const VirtualListBaseFactory = (type) => {
	return class VirtualListCore extends Component {
		/* No displayName here. We set displayName to returned components of this factory function. */

		static propTypes = /** @lends ui/VirtualList.VirtualListBase.prototype */ {
			/**
			 * The rendering function called for each item in the list.
			 *
			 * > **Note**: The list does **not** always render a component whenever its render function is called
			 * due to performance optimization.
			 *
			 * Example:
			 * ```
			 * renderItem = ({index, ...rest}) => {
			 * 	delete rest.data;
			 *
			 * 	return (
			 * 		<MyComponent index={index} {...rest} />
			 * 	);
			 * }
			 * ```
			 *
			 * @type {Function}
			 * @param {Object}     event
			 * @param {Number}     event.data-index    It is required for `Spotlight` 5-way navigation. Pass to the root element in the component.
			 * @param {Number}     event.index    The index number of the component to render
			 * @param {Number}     event.key    It MUST be passed as a prop to the root element in the component for DOM recycling.
			 *
			 * @required
			 * @public
			 */
			itemRenderer: PropTypes.func.isRequired,

			/**
			 * The size of an item for the list; valid values are either a number for `VirtualList`
			 * or an object that has `minWidth` and `minHeight` for `VirtualGridList`.
			 *
			 * @type {Number|ui/VirtualList.gridListItemSizeShape}
			 * @required
			 * @private
			 */
			itemSize: PropTypes.oneOfType([
				PropTypes.number,
				gridListItemSizeShape
			]).isRequired,

			/**
			 * The render function for the items.
			 *
			 * @type {Function}
			 * @required
			 * @private
			 */
			itemsRenderer: PropTypes.func.isRequired,

			/**
			 * Callback method of scrollTo.
			 * Normally, [Scrollable]{@link ui/Scrollable.Scrollable} should set this value.
			 *
			 * @type {Function}
			 * @private
			 */
			cbScrollTo: PropTypes.func,

			/**
			 * Additional props included in the object passed to the `itemsRenderer` callback.
			 *
			 * @type {Object}
			 * @public
			 */
			childProps: PropTypes.object,

			/**
			 * Client size of the list; valid values are an object that has `clientWidth` and `clientHeight`.
			 *
			 * @type {Object}
			 * @property {Number}    clientHeight    The client height of the list.
			 * @property {Number}    clientWidth    The client width of the list.
			 * @public
			 */
			clientSize: PropTypes.shape({
				clientHeight: PropTypes.number.isRequired,
				clientWidth: PropTypes.number.isRequired
			}),

			/**
			 * Activates the component for voice control.
			 *
			 * @type {Boolean}
			 * @private
			 */
			'data-webos-voice-focused': PropTypes.bool,

			/**
			 * The voice control group label.
			 *
			 * @type {String}
			 * @private
			 */
			'data-webos-voice-group-label': PropTypes.string,

			/**
			 * The number of items of data the list contains.
			 *
			 * @type {Number}
			 * @default 0
			 * @public
			 */
			dataSize: PropTypes.number,

			/**
			 * The layout direction of the list.
			 *
			 * Valid values are:
			 * * `'horizontal'`, and
			 * * `'vertical'`.
			 *
			 * @type {String}
			 * @default 'vertical'
			 * @public
			 */
			direction: PropTypes.oneOf(['horizontal', 'vertical']),

			/**
			 * Called to get the props for list items.
			 *
			 * @type {Function}
			 * @private
			 */
			getComponentProps: PropTypes.func,

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
			 * When `true`, the list will scroll by page.  Otherwise the list will scroll by item.
			 *
			 * @type {Boolean}
			 * @default false
			 * @private
			 */
			pageScroll: PropTypes.bool,

			/**
			 * `true` if RTL, `false` if LTR.
			 *
			 * @type {Boolean}
			 * @private
			 */
			rtl: PropTypes.bool,

			/**
			 * The spacing between items.
			 *
			 * @type {Number}
			 * @default 0
			 * @public
			 */
			spacing: PropTypes.number,

			/**
			 * Called to execute additional logic in a themed component when updating states and bounds.
			 *
			 * @type {Function}
			 * @private
			 */
			updateStatesAndBounds: PropTypes.func
		}

		static defaultProps = {
			cbScrollTo: nop,
			dataSize: 0,
			direction: 'vertical',
			overhang: 3,
			pageScroll: false,
			spacing: 0
		}

		constructor (props) {
			super(props);

			this.state = {firstIndex: 0, numOfItems: 0};
		}

		UNSAFE_componentWillMount () {
			if (this.props.clientSize) {
				this.calculateMetrics(this.props);
				this.updateStatesAndBounds(this.props);
			}
		}

		// Calculate metrics for VirtualList after the 1st render to know client W/H.
		componentDidMount () {
			if (!this.props.clientSize) {
				this.calculateMetrics(this.props);
				this.updateStatesAndBounds(this.props);
			}

			this.syncSizeAfterRender();
		}

		// Call updateStatesAndBounds here when dataSize has been changed to update nomOfItems state.
		// Calling setState within componentWillReceivePropswill not trigger an additional render.
		UNSAFE_componentWillReceiveProps (nextProps) {
			const
				{dataSize, direction, itemSize, overhang, rtl, spacing} = this.props,
				hasMetricsChanged = (
					direction !== nextProps.direction ||
					((itemSize instanceof Object) ? (itemSize.minWidth !== nextProps.itemSize.minWidth || itemSize.minHeight !== nextProps.itemSize.minHeight) : itemSize !== nextProps.itemSize) ||
					overhang !== nextProps.overhang ||
					spacing !== nextProps.spacing
				);

			this.hasDataSizeChanged = (dataSize !== nextProps.dataSize);

			if (hasMetricsChanged) {
				this.calculateMetrics(nextProps);
				this.updateStatesAndBounds(nextProps);
				this.setContainerSize();
			} else if (this.hasDataSizeChanged) {
				this.updateStatesAndBounds(nextProps);
				this.setContainerSize();
			} else if (rtl !== nextProps.rtl) {
				const {x, y} = this.getXY(this.scrollPosition, 0);

				this.cc = [];
				if (type === Native) {
					this.scrollToPosition(x, y, nextProps.rtl);
				} else {
					this.setScrollPosition(x, y, nextProps.rtl);
				}
			}
		}

		UNSAFE_componentWillUpdate (nextProps, nextState) {
			if (this.state.firstIndex === nextState.firstIndex || this.props.childProps && this.props.childProps !== nextProps.childProps) {
				this.prevFirstIndex = -1; // force to re-render items
			}
		}

		componentDidUpdate () {
			this.syncSizeAfterRender();
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
		prevFirstIndex = 0
		curDataSize = 0
		hasDataSizeChanged = false
		cc = []
		childPositionInfo = []
		lastBaseIndex = 0
		scrollPosition = 0

		contentRef = null
		containerRef = null

		isVertical = () => this.isPrimaryDirectionVertical

		isHorizontal = () => !this.isPrimaryDirectionVertical

		getScrollBounds = () => this.scrollBounds

		getMoreInfo = () => this.moreInfo

		getGridPosition (index) {
			const
				{childPositionInfo, dimensionToExtent, primary, secondary} = this,
				extent = Math.floor(index / dimensionToExtent),
				firstIndexInExtent = extent * dimensionToExtent,
				primaryPosition = childPositionInfo[firstIndexInExtent] ? childPositionInfo[firstIndexInExtent].position : extent * primary.gridSize,
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

		getXY = (primaryPosition, secondaryPosition) => (this.isPrimaryDirectionVertical ? {x: secondaryPosition, y: primaryPosition} : {x: primaryPosition, y: secondaryPosition})

		getClientSize = (node) => ({
			clientWidth: node.clientWidth,
			clientHeight: node.clientHeight
		})

		calculateMetrics (props) {
			const
				{clientSize, direction, itemSize, overhang, spacing} = props,
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
			thresholdBase = primary.gridSize * Math.ceil(overhang / 2);

			this.threshold = {min: -Infinity, max: thresholdBase, base: thresholdBase};
			this.dimensionToExtent = dimensionToExtent;

			this.primary = primary;
			this.secondary = secondary;

			// reset
			this.scrollPosition = 0;
			if (type === JS && this.contentRef) {
				this.contentRef.style.transform = null;
			}

			// eslint-disable-next-line react/no-direct-mutation-state
			this.state.firstIndex = 0;
			// eslint-disable-next-line react/no-direct-mutation-state
			this.state.numOfItems = 0;
		}

		updateStatesAndBounds = (props) => {
			const
				{dataSize, overhang, updateStatesAndBounds} = props,
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
			this.childPositionInfo = [];
			this.calculateScrollBounds(props);
			this.updateMoreInfo(dataSize, scrollPosition);

			if (!(updateStatesAndBounds && updateStatesAndBounds({
				cbScrollTo: props.cbScrollTo,
				numOfItems,
				dataSize,
				moreInfo
			}))) {
				newFirstIndex = this.calculateFirstIndex(props, wasFirstIndexMax, dataSizeDiff);
			}

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
						numOfUpperLine = Math.floor(overhang / 2),
						firstIndexFromPosition = Math.floor(scrollPosition / gridSize),
						expectedFirstIndex = Math.max(0, firstIndexFromPosition - numOfUpperLine);

					// To navigate with 5way, we need to adjust firstIndex to the next line
					// since at the bottom we have num of overhang lines for upper side but none for bottom side
					// So we add numOfUpperLine at the top and rest lines at the bottom
					newFirstIndex = Math.min(maxFirstIndex, expectedFirstIndex * dimensionToExtent);

					// We need to update threshold also since we moved the firstIndex
					threshold.max = Math.min(maxPos, threshold.max + gridSize);
					threshold.min = Math.min(maxPos - threshold.base, threshold.max - gridSize);
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
		}

		setContainerSize = () => {
			if (this.contentRef) {
				this.contentRef.style.width = this.scrollBounds.scrollWidth + (this.isPrimaryDirectionVertical ? -1 : 0) + 'px';
				this.contentRef.style.height = this.scrollBounds.scrollHeight + (this.isPrimaryDirectionVertical ? 0 : -1) + 'px';
			}
		}

		getEndPosition = (index) => {
			const info = this.childPositionInfo[index];
			if (info) {
				const {position, size} = info;
				return position + size;
			} else {
				const {gridSize, spacing} = this.primary;
				return Math.floor(index / this.dimensionToExtent) * gridSize - spacing;
			}
		}

		syncSizeAfterRender () {
			const
				{dataSize, overhang, spacing} = this.props,
				{firstIndex, numOfItems} = this.state,
				{childPositionInfo, dimensionToExtent, itemContainerRef, maxFirstIndex} = this,
				{gridSize} = this.primary,
				lastIndex = firstIndex + numOfItems - 1,
				numOfExtent = Math.ceil(dataSize / dimensionToExtent),
				numOfUpperLine = Math.floor(overhang / 2);

			if (itemContainerRef) {
				const firstChildNode = itemContainerRef.children[firstIndex % numOfItems];
				let info, baseIndex = -1, index, childNode, size, primaryPosition, secondaryPosition;

				// find the first index which node's base index is as same as the last base index
				// this routine is to check whether we need to keep positions of items as same as previous frame or not
				for (index = firstIndex; index <= lastIndex; index += dimensionToExtent) {
					info = childPositionInfo[index];
					if (info && info.baseIndex === this.lastBaseIndex) {
						baseIndex = this.lastBaseIndex;
						break;
					}
				}

				// no item needs to keep the current position, therefore we can render all items at any position
				if (baseIndex === -1) {
					// if firstIndex is not zero, try to set positions from the starting
					let lastIndexBasedZero = -1;
					for (index = firstIndex - dimensionToExtent; index >= 0; index -= dimensionToExtent) {
						if (!childPositionInfo[index]) {
							break;
						} else if (childPositionInfo[index].baseIndex === 0) {
							lastIndexBasedZero = index;
							break;
						}
					}

					// if all position info before firstIndex exist
					if (lastIndexBasedZero > 0) {
						baseIndex = 0;
					} else {
						// create a position info for the first index
						// calculate the position based on assuming that all items have minimal size
						childPositionInfo[firstIndex] = {
							size: firstChildNode.offsetHeight,
							baseIndex: firstIndex,
							position: Math.floor(firstIndex / dimensionToExtent) * gridSize
						};
						baseIndex = firstIndex;
					}
				}

				this.lastBaseIndex = baseIndex;

				// for items before baseIndex
				for (index = baseIndex - dimensionToExtent; index >= firstIndex; index -= dimensionToExtent) {
					if (!childPositionInfo[index] || childPositionInfo[index].baseIndex !== baseIndex) {
						// TBD: offsetHeight / vertical only for now
						size = itemContainerRef.children[index % numOfItems].offsetHeight; // TBD: the node must exist in this case
						childPositionInfo[index] = {
							size,
							baseIndex,
							position: childPositionInfo[index + dimensionToExtent].position - size - spacing
						};
					}
				}

				// for items after baseIndex
				for (index = baseIndex + dimensionToExtent; index <= lastIndex; index += dimensionToExtent) {
					info = childPositionInfo[index];
					if (!info) { // need to measure and create info
						size = itemContainerRef.children[index % numOfItems].offsetHeight; // TBD: the node must exist in this case
						childPositionInfo[index] = {
							size,
							baseIndex,
							position: this.getEndPosition(index - dimensionToExtent) + spacing
						};

					} else if (info.baseIndex !== baseIndex) { // just update position if baseIndex is updated
						info.position = this.getEndPosition(index - dimensionToExtent) + spacing;
						info.baseIndex = baseIndex;
					}
				}

				for (index = firstIndex; index <= lastIndex; ++index) {
					info = childPositionInfo[Math.floor(index / dimensionToExtent) * dimensionToExtent];
					primaryPosition = info.position;
					secondaryPosition = (index % dimensionToExtent) * this.secondary.gridSize;
					childNode = itemContainerRef.children[index % numOfItems];
					// TBD vertical only for now
					childNode.style.transform = `translate3d(${this.props.rtl ? -secondaryPosition : secondaryPosition}px, ${primaryPosition}px, 0)`;
				}

				this.threshold.min = firstIndex === 0 ? -Infinity : this.getEndPosition(firstIndex + numOfUpperLine * dimensionToExtent);
				this.threshold.max = lastIndex === maxFirstIndex ? Infinity : this.getEndPosition(firstIndex + (numOfUpperLine + 1) * dimensionToExtent);

				if (childPositionInfo.filter(Boolean).length === numOfExtent) { // all item sizes are known
					this.scrollBounds.scrollHeight = childPositionInfo.reduce((acc, cur) => acc + cur.size, 0) + (numOfExtent - 1) * spacing;
				} else {
					for (index = firstIndex + numOfItems - dimensionToExtent; index < dataSize; index += dimensionToExtent) {
						const nextInfo = childPositionInfo[index + dimensionToExtent];
						if (!nextInfo || nextInfo.baseIndex !== childPositionInfo[firstIndex].baseIndex) {
							const endPosition = this.getEndPosition(index);
							if (endPosition > this.scrollBounds.scrollHeight) {
								this.scrollBounds.scrollHeight = endPosition;
							}

							break;
						}
					}
				}
				this.scrollBounds.maxTop = Math.max(0, this.scrollBounds.scrollHeight - this.scrollBounds.clientHeight);

				this.setContainerSize();
			}
		}

		syncPositionAfterStop () {
			const
				{firstIndex} = this.state,
				{dimensionToExtent, childPositionInfo} = this,
				{gridSize} = this.primary;

			// if the position for firstIndex is smaller than the minimum position by the minimum size
			if (childPositionInfo[firstIndex].position < Math.floor(firstIndex / dimensionToExtent) * gridSize) {
				const gap = this.adjustItemsPosition();

				// TBD: vertical only for now
				if (type === Native) {
					this.containerRef.style.scrollBehavior = null;
					this.scrollToPosition(0, this.scrollPosition + gap);
					this.containerRef.style.scrollBehavior = 'smooth';
				} else {
					this.setScrollPosition(0, this.scrollPosition + gap);
				}
			}
		}

		adjustItemsPosition (max = Infinity) {
			const
				{firstIndex} = this.state,
				{dimensionToExtent, childPositionInfo} = this,
				{gridSize} = this.primary,
				baseIndex = childPositionInfo[firstIndex].baseIndex;
			let
				info = null,
				firstIndexToAdjust = firstIndex,
				gap = 0,
				index;

			for (index = firstIndex - dimensionToExtent; index >= 0; index -= dimensionToExtent) {
				info = childPositionInfo[index];
				if (info) {
					if (info.baseIndex === baseIndex) {
						firstIndexToAdjust = index;
					} else {
						break;
					}
				} else {
					break;
				}
			}

			gap = Math.floor(firstIndexToAdjust / dimensionToExtent) * gridSize - childPositionInfo[firstIndexToAdjust].position;
			if (gap > 0) {
				const {numOfItems} = this.state;
				let node, primary, secondary;

				gap = Math.min(gap, max);

				for (index = firstIndexToAdjust; index < this.props.dataSize; index += dimensionToExtent) {
					info = childPositionInfo[index];
					if (info && info.baseIndex === baseIndex) {
						info.position += gap;
					} else {
						break;
					}
				}

				for (index = firstIndex; index < firstIndex + numOfItems; ++index) {
					info = childPositionInfo[Math.floor(index / dimensionToExtent) * dimensionToExtent];
					node = this.itemContainerRef.children[index % numOfItems];
					primary = info.position;
					secondary = (index % dimensionToExtent) * this.secondary.gridSize;
					// TBD vertical only for now
					node.style.transform = `translate3d(${this.props.rtl ? -secondary : secondary}px, ${primary}px, 0)`;
				}

				return gap;
			}

			return 0;
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

		// Native only
		scrollToPosition (x, y, rtl = this.props.rtl) {
			if (this.containerRef) {
				this.containerRef.scrollTo(
					(rtl && !this.isPrimaryDirectionVertical) ? this.scrollBounds.maxLeft - x : x, y
				);
			}
		}

		// JS only
		setScrollPosition (x, y, rtl = this.props.rtl) {
			if (this.contentRef) {
				this.contentRef.style.transform = `translate3d(${rtl ? x : -x}px, -${y}px, 0)`;
				this.didScroll(x, y);
			}
		}

		didScroll (x, y) {
			const
				{dataSize, spacing} = this.props,
				{firstIndex} = this.state,
				{isPrimaryDirectionVertical, threshold, dimensionToExtent, maxFirstIndex, scrollBounds, childPositionInfo} = this,
				{gridSize, clientSize} = this.primary,
				maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft;
			let newFirstIndex = firstIndex, pos, index, info;

			if (isPrimaryDirectionVertical) {
				pos = y;
			} else {
				pos = x;
			}

			this.adjustItemsPosition(Math.abs(this.scrollPosition - pos));

			if (pos > threshold.max || pos < threshold.min) {
				const overhangBefore = Math.floor(this.props.overhang / 2);
				let firstRenderedIndex = -1, newThresholdMin = -Infinity, newThresholdMax = Infinity;

				// find an item which is known as placed the first rendered item's position
				for (index = 0; index < dataSize; index += dimensionToExtent) {
					info = childPositionInfo[index];
					if (info && info.position + info.size >= pos && info.position <= pos + clientSize &&
						childPositionInfo[firstIndex].baseIndex === info.baseIndex) {
						firstRenderedIndex = index;
						break;
					}
				}

				// found an item which is visible within a current viewport
				if (index < dataSize) {
					if (info.position <= pos) {
						newFirstIndex = firstRenderedIndex - overhangBefore * dimensionToExtent;
						newThresholdMin = info.position;
						newThresholdMax = newThresholdMin + info.size + spacing;
					} else {
						const diffToFirstIndex = Math.ceil((info.position - pos) / gridSize);
						newFirstIndex = firstRenderedIndex - (diffToFirstIndex + overhangBefore) * dimensionToExtent;
						newThresholdMin = info.position - diffToFirstIndex * gridSize;
						newThresholdMax = newThresholdMin + gridSize;
					}
				} else { // calculate the first index based on assuming that all items have minimal size
					const firstExtent = Math.max(
						0,
						Math.min(
							Math.floor(maxFirstIndex / dimensionToExtent),
							Math.floor((pos - gridSize * overhangBefore) / gridSize)
						)
					);
					newFirstIndex = firstExtent * dimensionToExtent;
					newThresholdMin = (firstExtent + overhangBefore) * gridSize;
					newThresholdMax = newThresholdMin + gridSize;
				}

				newFirstIndex = Math.max(0, Math.min(maxFirstIndex, newFirstIndex));
				threshold.min = newFirstIndex === 0 ? -Infinity : newThresholdMin;
				threshold.max = newFirstIndex === maxFirstIndex ? Infinity : newThresholdMax;
			}

			this.syncThreshold(maxPos);
			this.scrollPosition = pos;
			this.updateMoreInfo(dataSize, pos);

			if (firstIndex !== newFirstIndex) {
				this.setState({firstIndex: newFirstIndex});
			}
		}

		getItemNode = (index) => {
			const ref = this.itemContainerRef;

			return ref ? ref.children[index % this.state.numOfItems] : null;
		}

		composeStyle (width, height, primaryPosition, secondaryPosition) {
			const
				{x, y} = this.getXY(primaryPosition, secondaryPosition),
				style = {
					position: 'absolute',
					/* FIXME: RTL / this calculation only works for Chrome */
					transform: `translate3d(${this.props.rtl ? -x : x}px, ${y}px, 0)`
				};

			if (this.isItemSized) {
				style.width = width;
				style.height = height;
			}

			return style;
		}

		applyStyleToNewNode = (index, ...rest) => {
			const
				{itemRenderer, getComponentProps} = this.props,
				key = index % this.state.numOfItems,
				itemElement = itemRenderer({
					...this.props.childProps,
					key,
					index
				}),
				componentProps = getComponentProps && getComponentProps(index) || {};

			this.cc[key] = React.cloneElement(itemElement, {
				...componentProps,
				className: classNames(css.listItem, itemElement.props.className),
				style: {...itemElement.props.style, ...(this.composeStyle(...rest))}
			});
		}

		applyStyleToHideNode = (index) => {
			const key = index % this.state.numOfItems;
			this.cc[key] = <div key={key} style={{display: 'none'}} />;
		}

		positionItems () {
			const
				{dataSize} = this.props,
				{firstIndex, numOfItems} = this.state,
				{isPrimaryDirectionVertical, dimensionToExtent, primary, secondary, cc, childPositionInfo} = this,
				diff = firstIndex - this.prevFirstIndex,
				updateFrom = (cc.length === 0 || 0 >= diff || diff >= numOfItems || this.prevFirstIndex === -1) ? firstIndex : this.prevFirstIndex + numOfItems;
			let
				hideTo = 0,
				updateTo = (cc.length === 0 || -numOfItems >= diff || diff > 0 || this.prevFirstIndex === -1) ? firstIndex + numOfItems : this.prevFirstIndex;

			if (updateFrom >= updateTo) {
				return;
			} else if (updateTo > dataSize) {
				hideTo = updateTo;
				updateTo = dataSize;
			}

			let
				width, height,
				{primaryPosition, secondaryPosition} = this.getGridPosition(updateFrom);

			width = (isPrimaryDirectionVertical ? secondary.itemSize : primary.itemSize) + 'px';
			height = (isPrimaryDirectionVertical ? primary.itemSize : secondary.itemSize) + 'px';

			// positioning items
			for (let i = updateFrom, j = updateFrom % dimensionToExtent; i < updateTo; i++) {
				this.applyStyleToNewNode(i, width, height, primaryPosition, secondaryPosition);

				if (++j === dimensionToExtent) {
					secondaryPosition = 0;
					if (childPositionInfo[i]) {
						primaryPosition = childPositionInfo[i].position;
					} else if (childPositionInfo[i - dimensionToExtent]) {
						primaryPosition += childPositionInfo[i - dimensionToExtent].size + this.props.spacing;
					} else {
						primaryPosition += primary.gridSize;
					}
					j = 0;
				} else {
					secondaryPosition += secondary.gridSize;
				}
			}

			for (let i = updateTo; i < hideTo; i++) {
				this.applyStyleToHideNode(i);
			}

			this.prevFirstIndex = firstIndex;
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

		initContainerRef = (ref) => {
			if (ref) {
				this.containerRef = ref;
			}
		}

		initContentRef = (ref) => {
			if (ref) {
				this.contentRef = ref;
			}
		}

		initItemContainerRef = (ref) => {
			if (ref) {
				this.itemContainerRef = ref;
			}
		}

		mergeClasses = (className) => {
			let containerClass = null;

			if (type === Native) {
				containerClass = (this.isPrimaryDirectionVertical) ? css.vertical : css.horizontal;
			}

			return classNames(css.virtualList, containerClass, className);
		}

		render () {
			const
				{className, 'data-webos-voice-focused': voiceFocused, 'data-webos-voice-group-label': voiceGroupLabel, itemsRenderer, style, ...rest} = this.props,
				{cc, initItemContainerRef, primary} = this,
				containerClasses = this.mergeClasses(className);

			delete rest.cbScrollTo;
			delete rest.childProps;
			delete rest.clientSize;
			delete rest.dataSize;
			delete rest.direction;
			delete rest.getComponentProps;
			delete rest.isVerticalScrollbarVisible;
			delete rest.itemRenderer;
			delete rest.itemSize;
			delete rest.onUpdate;
			delete rest.overhang;
			delete rest.pageScroll;
			delete rest.rtl;
			delete rest.spacing;
			delete rest.updateStatesAndBounds;

			if (primary) {
				this.positionItems();
			}

			return (
				<div className={containerClasses} data-webos-voice-focused={voiceFocused} data-webos-voice-group-label={voiceGroupLabel} ref={this.initContainerRef} style={style}>
					<div {...rest} ref={this.initContentRef}>
						{itemsRenderer({cc, initItemContainerRef, primary})}
					</div>
				</div>
			);
		}
	};
};

/**
 * A basic base component for
 * [VirtualList]{@link ui/VirtualList.VirtualList} and [VirtualGridList]{@link ui/VirtualList.VirtualGridList}.
 *
 * @class VirtualListBase
 * @memberof ui/VirtualList
 * @ui
 * @private
 */
const VirtualListBase = VirtualListBaseFactory(JS);
VirtualListBase.displayName = 'ui:VirtualListBase';

/**
 * A basic base component for
 * [VirtualListNative]{@link ui/VirtualList.VirtualListNative} and [VirtualGridListNative]{@link ui/VirtualList.VirtualGridListNative}.
 *
 * @class VirtualListBaseNative
 * @memberof ui/VirtualList
 * @ui
 * @private
 */
const VirtualListBaseNative = VirtualListBaseFactory(Native);
VirtualListBaseNative.displayName = 'ui:VirtualListBaseNative';

const ScrollableVirtualList = (props) => (
	<Scrollable
		{...props}
		childRenderer={({initChildRef, ...rest}) => ( // eslint-disable-line react/jsx-no-bind
			<VirtualListBase
				{...rest}
				itemsRenderer={({cc, initItemContainerRef}) => ( // eslint-disable-line react/jsx-no-bind
					cc.length ? <div ref={initItemContainerRef} role="list">{cc}</div> : null
				)}
				ref={initChildRef}
			/>
		)}
	/>
);

ScrollableVirtualList.propTypes = {
	direction: PropTypes.oneOf(['horizontal', 'vertical'])
};

ScrollableVirtualList.defaultProps = {
	direction: 'vertical'
};

const ScrollableVirtualListNative = (props) => (
	<ScrollableNative
		{...props}
		childRenderer={({initChildRef, ...rest}) => ( // eslint-disable-line react/jsx-no-bind
			<VirtualListBaseNative
				{...rest}
				itemsRenderer={({cc, initItemContainerRef}) => ( // eslint-disable-line react/jsx-no-bind
					cc.length ? <div ref={initItemContainerRef} role="list">{cc}</div> : null
				)}
				ref={initChildRef}
			/>
		)}
	/>
);

ScrollableVirtualListNative.propTypes = /** @lends ui/VirtualList.VirtualListBaseNative.prototype */ {
	/**
	 * The layout direction of the list.
	 *
	 * Valid values are:
	 * * `'horizontal'`, and
	 * * `'vertical'`.
	 *
	 * @type {String}
	 * @default 'vertical'
	 * @public
	 */
	direction: PropTypes.oneOf(['horizontal', 'vertical'])
};

ScrollableVirtualListNative.defaultProps = {
	direction: 'vertical'
};

export default VirtualListBase;
export {
	gridListItemSizeShape,
	ScrollableVirtualList,
	ScrollableVirtualListNative,
	VirtualListBase,
	VirtualListBaseNative
};
