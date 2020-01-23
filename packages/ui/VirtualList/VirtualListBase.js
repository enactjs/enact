import classNames from 'classnames';
import {forward} from '@enact/core/handle';
import {platform} from '@enact/core/platform';
import PropTypes from 'prop-types';
import React, {forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, useCallback} from 'react';

import Scrollable from '../Scrollable';

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
 * @property {Number} minWidth The minimum width of the grid list item.
 * @property {Number} minHeight The minimum height of the grid list item.
 * @public
 */
const gridListItemSizeShape = PropTypes.shape({
	minHeight: PropTypes.number.isRequired,
	minWidth: PropTypes.number.isRequired
});

/**
 * The shape for the list different item size
 * in a list for [VirtualList]{@link ui/VirtualList.VirtualList}.
 *
 * @typedef {Object} itemSizesShape
 * @memberof ui/VirtualList
 * @property {Number} minSize The minimum size of the list item.
 * @property {Number[]} size An array of the list item size. If it is not defined, the list items will render with the `minSize` size.
 * @public
 */
const itemSizesShape = PropTypes.shape({
	minSize: PropTypes.number.isRequired,
	size: PropTypes.arrayOf(PropTypes.number)
});

/**
 * The base version of the virtual list component.
 *
 * @function VirtualListCore
 * @memberof ui/VirtualList
 * @ui
 * @private
 */
const VirtualListBase = forwardRef((props, reference) => {
	const type = props.type;
	/* No displayName here. We set displayName to returned components of this factory function. */
	const containerRef = useRef();
	const contentRef = useRef();
	const itemContainerRef = useRef();

	const [updateFromTo, setUpdateFromTo] = useState({from: 0, to: 0});
	const [firstIndex, setFirstIndex] = useState(0);
	const [numOfItems, setNumOfItems] = useState(0);

	if (props.clientSize) {
		calculateMetrics(props);
		setStatesAndUpdateBounds();
	}

	// Instance variables
	const variables = useRef({
		scrollBounds: {
			clientWidth: 0,
			clientHeight: 0,
			scrollWidth: 0,
			scrollHeight: 0,
			maxLeft: 0,
			maxTop: 0
		},

		moreInfo: {
			firstVisibleIndex: null,
			lastVisibleIndex: null
		},

		primary: null,
		secondary: null,

		isPrimaryDirectionVertical: true,
		isItemSized: false,

		shouldUpdateBounds: false,

		dimensionToExtent: 0,
		threshold: 0,
		maxFirstIndex: 0,
		curDataSize: 0,
		hasDataSizeChanged: false,
		cc: [],
		scrollPosition: 0,
		scrollPositionTarget: 0,

		// For individually sized item
		itemPositions: [],
		indexToScrollIntoView: -1,

		deferScrollTo: false,

		prevChildProps: null,
		prevFirstIndex: 0
	});

	useImperativeHandle(reference, () => ({
		calculateMetrics,
		containerRef,
		didScroll,
		get dimensionToExtent () {
			return variables.current.dimensionToExtent;
		},
		getGridPosition,
		getItemBottomPosition,
		getItemNode,
		getItemPosition,
		getMoreInfo,
		getScrollBounds,
		gridPositionToItemPosition,
		isHorizontal,
		get isPrimaryDirectionVertical () {
			return variables.current.isPrimaryDirectionVertical;
		},
		isVertical,
		get itemPositions () {
			return variables.current.itemPositions;
		},
		get primary () {
			return variables.current.primary;
		},
		props,
		get scrollPositionTarget () {
			return variables.current.scrollPositionTarget;
		},
		state: {
			numOfItems
		},
		get scrollPosition () {
			return variables.current.scrollPosition;
		},
		scrollToPosition,
		setScrollPosition,
		syncClientSize
	}));

	// getDerivedStateFromProps
	useLayoutEffect(() => {
		const
			{prevChildProps, prevFirstIndex} = variables.current,
			shouldInvalidate = (
				prevFirstIndex === firstIndex ||
				prevChildProps !== props.childProps	// TODO : Reconsider this comparison is actually meaningful.
			),
			diff = firstIndex - prevFirstIndex,
			newUpdateTo = (-numOfItems >= diff || diff > 0 || shouldInvalidate) ? firstIndex + numOfItems : prevFirstIndex,
			newUpdateFrom = (0 >= diff || diff >= numOfItems || shouldInvalidate) ? firstIndex : prevFirstIndex + numOfItems;

		if (updateFromTo.from !== newUpdateFrom || updateFromTo.to !== newUpdateTo) {
			setUpdateFromTo({from: newUpdateFrom, to: newUpdateTo});
		}
		variables.current.prevChildProps = props.childProps;
		variables.current.prevFirstIndex = firstIndex;
	}, [firstIndex, numOfItems, props.childProps, updateFromTo]);

	const emitUpdateItems = useCallback(() => {
		const {dataSize} = props;

		forward('onUpdateItems', {
			firstIndex: firstIndex,
			lastIndex: Math.min(firstIndex + numOfItems, dataSize)
		}, props);
	}, [props, firstIndex, numOfItems]);

	// Calculate metrics for VirtualList after the 1st render to know client W/H.
	useEffect(() => {
		// componentDidMount
		if (!props.clientSize) {
			calculateMetrics(props);
			setStatesAndUpdateBounds();
		} else {
			emitUpdateItems();
		}

		if (props.itemSizes) {
			adjustItemPositionWithItemSize();
		} else {
			setContainerSize();
		}
	}, []);

	useEffect(() => {
		// componentDidUpdate
		// if (prevState.firstIndex !== firstIndex || prevState.numOfItems !== numOfItems)
		emitUpdateItems();
	}, [firstIndex, numOfItems, emitUpdateItems]);

	useEffect(() => {
		// componentDidUpdate
		variables.current.deferScrollTo = false;

		variables.current.shouldUpdateBounds = false;

		// When an item expands or shrinks,
		// we need to calculate the item position again and
		// the item needs to scroll into view if the item does not show fully.
		if (props.itemSizes) {
			if (variables.current.itemPositions.length > props.itemSizes.length) {
				// The item with `props.itemSizes.length` index is not rendered yet.
				// So the item could scroll into view after it rendered.
				// To do it, `props.itemSizes.length` value is cached in `indexToScrollIntoView`.
				variables.current.indexToScrollIntoView = props.itemSizes.length;

				variables.current.itemPositions = [...variables.current.itemPositions.slice(0, props.itemSizes.length)];
				adjustItemPositionWithItemSize();
			} else {
				const {indexToScrollIntoView} = variables.current;

				adjustItemPositionWithItemSize();

				if (indexToScrollIntoView !== -1) {
					// Currently we support expandable items in only vertical VirtualList.
					// So the top and bottom of the boundaries are checked.
					const
						scrollBounds = {top: variables.current.scrollPosition, bottom: variables.current.scrollPosition + variables.current.scrollBounds.clientHeight},
						itemBounds = {top: getGridPosition(indexToScrollIntoView).primaryPosition, bottom: getItemBottomPosition(indexToScrollIntoView)};

					if (itemBounds.top < scrollBounds.top) {
						props.cbScrollTo({
							index: indexToScrollIntoView,
							stickTo: 'start',
							animate: true
						});
					} else if (itemBounds.bottom > scrollBounds.bottom) {
						props.cbScrollTo({
							index: indexToScrollIntoView,
							stickTo: 'end',
							animate: true
						});
					}
				}

				variables.current.indexToScrollIntoView = -1;
			}
		}
	});

	useEffect(() => {
		// if (
		// 	prevProps.direction !== this.props.direction ||
		// 	prevProps.overhang !== this.props.overhang ||
		// 	prevProps.spacing !== this.props.spacing ||
		// 	!equals(prevProps.itemSize, this.props.itemSize)
		// )
		const {x, y} = getXY(variables.current.scrollPosition, 0);

		calculateMetrics(props);
		setStatesAndUpdateBounds();

		setContainerSize();

		const {clientHeight, clientWidth, scrollHeight, scrollWidth} = variables.current.scrollBounds;
		const xMax = scrollWidth - clientWidth;
		const yMax = scrollHeight - clientHeight;

		updateScrollPosition({
			x: xMax > x ? x : xMax,
			y: yMax > y ? y : yMax
		});

		variables.current.deferScrollTo = true;

	});
	// TODO: Origin def = [props.direction, props.overhang, props.spacing, props.itemSize]
	// This part made bug that initial rendering is not done util scroll (ahn)

	useEffect(() => {
		// TODO: remove `hasDataSizeChanged` and fix ui/Scrollable*
		variables.current.hasDataSizeChanged = true; // (prevProps.dataSize !== this.props.dataSize);

		if (!variables.current.deferScrollTo && variables.current.hasDataSizeChanged) {
			setStatesAndUpdateBounds();

			setContainerSize();

			variables.current.deferScrollTo = true;
		}
	}, [props.dataSize]);

	useEffect(() => {
		// else if (prevProps.rtl !== this.props.rtl)
		if (!variables.current.deferScrollTo) {
			updateScrollPosition(getXY(variables.current.scrollPosition, 0));
		}
	}, [props.rtl]);

	useEffect(() => {
		const maxPos = variables.current.isPrimaryDirectionVertical ? variables.current.scrollBounds.maxTop : variables.current.scrollBounds.maxLeft;

		if (!variables.current.deferScroll && variables.current.scrollPosition > maxPos) {
			props.cbScrollTo({position: (variables.current.isPrimaryDirectionVertical) ? {y: maxPos} : {x: maxPos}, animate: false});
		}
	});

	function updateScrollPosition ({x, y}, rtl = props.rtl) {
		if (type === Native) {
			scrollToPosition(x, y, rtl);
		} else {
			setScrollPosition(x, y, rtl, x, y);
		}
	}

	function isVertical () {
		return variables.current.isPrimaryDirectionVertical;
	}

	function isHorizontal () {
		return !variables.current.isPrimaryDirectionVertical;
	}

	function getScrollBounds () {
		return variables.current.scrollBounds;
	}

	function getMoreInfo () {
		return variables.current.moreInfo;
	}

	function getGridPosition (index) {
		const
			{dataSize, itemSizes} = props,
			{dimensionToExtent, itemPositions, secondary} = variables.current,
			secondaryPosition = (index % dimensionToExtent) * secondary.gridSize,
			extent = Math.floor(index / dimensionToExtent);
		let primaryPosition;
		const primary = variables.current.primary;

		if (itemSizes && typeof itemSizes[index] !== 'undefined' && dataSize > index) {
			const firstIndexInExtent = extent * dimensionToExtent;

			if (!itemPositions[firstIndexInExtent]) {
				// Cache individually sized item positions
				for (let i = itemPositions.length; i <= index; i++) {
					calculateAndCacheItemPosition(i);
				}
			}

			if (itemPositions[firstIndexInExtent]) {
				primaryPosition = itemPositions[firstIndexInExtent].position;
			} else {
				primaryPosition = extent * primary.gridSize;
			}
		} else {
			primaryPosition = extent * primary.gridSize;
		}

		return {primaryPosition, secondaryPosition};
	}

	// For individually sized item
	function getItemBottomPosition (index) {
		const
			itemPosition = variables.current.itemPositions[index],
			itemSize = props.itemSizes[index];

		if (itemPosition && (itemSize || itemSize === 0)) {
			return itemPosition.position + itemSize;
		} else {
			return index * variables.current.primary.gridSize - props.spacing;
		}
	}

	// For individually sized item
	function getItemTopPositionFromPreviousItemBottomPosition (index, spacing) {
		return index === 0 ? 0 : getItemBottomPosition(index - 1) + spacing;
	}

	function getItemPosition (index, stickTo = 'start') {
		const
			position = getGridPosition(index);
		let  offset = 0;
		const primary = variables.current.primary;

		if (stickTo === 'start') {
			offset = 0;
		} else if (props.itemSizes) {
			offset = primary.clientSize - props.itemSizes[index];
		} else {
			offset = primary.clientSize - primary.itemSize;
		}

		position.primaryPosition -= offset;

		return gridPositionToItemPosition(position);
	}

	function gridPositionToItemPosition ({primaryPosition, secondaryPosition}) {
		return (variables.current.isPrimaryDirectionVertical ? {left: secondaryPosition, top: primaryPosition} : {left: primaryPosition, top: secondaryPosition});
	}

	function getXY (primaryPosition, secondaryPosition) {
		return (variables.current.isPrimaryDirectionVertical ? {x: secondaryPosition, y: primaryPosition} : {x: primaryPosition, y: secondaryPosition});
	}

	function getClientSize (node) {
		return {
			clientWidth: node.clientWidth,
			clientHeight: node.clientHeight
		};
	}

	function calculateMetrics () {
		const
			{clientSize, direction, itemSize, overhang, spacing} = props,
			node = containerRef.current;

		if (!clientSize && !node) {
			return;
		}

		const
			{clientWidth, clientHeight} = (clientSize || getClientSize(node)),
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
		let primaryInfo, secondary, dimensionToExtent, thresholdBase;

		variables.current.isPrimaryDirectionVertical = (direction === 'vertical');

		if (variables.current.isPrimaryDirectionVertical) {
			primaryInfo = heightInfo;
			secondary = widthInfo;
		} else {
			primaryInfo = widthInfo;
			secondary = heightInfo;
		}
		dimensionToExtent = 1;

		variables.current.isItemSized = (primaryInfo.minItemSize && secondary.minItemSize);

		if (variables.current.isItemSized) {
			// the number of columns is the ratio of the available width plus the spacing
			// by the minimum item width plus the spacing
			dimensionToExtent = Math.max(Math.floor((secondary.clientSize + spacing) / (secondary.minItemSize + spacing)), 1);
			// the actual item width is a ratio of the remaining width after all columns
			// and spacing are accounted for and the number of columns that we know we should have
			secondary.itemSize = Math.floor((secondary.clientSize - (spacing * (dimensionToExtent - 1))) / dimensionToExtent);
			// the actual item height is related to the item width
			primaryInfo.itemSize = Math.floor(primaryInfo.minItemSize * (secondary.itemSize / secondary.minItemSize));
		}

		primaryInfo.gridSize = primaryInfo.itemSize + spacing;
		secondary.gridSize = secondary.itemSize + spacing;
		thresholdBase = primaryInfo.gridSize * Math.ceil(overhang / 2);

		variables.current.threshold = {min: -Infinity, max: thresholdBase, base: thresholdBase};
		variables.current.dimensionToExtent = dimensionToExtent;

		variables.current.primary = primaryInfo;
		variables.current.secondary = secondary;

		// reset
		variables.current.scrollPosition = 0;
		if (type === JS && contentRef.current) {
			contentRef.current.style.transform = null;
		}
	}

	function setStatesAndUpdateBounds () {
		const
			{dataSize, overhang, updateStatesAndBounds} = props,
			{dimensionToExtent, primary, moreInfo, scrollPosition} = variables.current,
			newNumOfItems = Math.min(dataSize, dimensionToExtent * (Math.ceil(primary.clientSize / primary.gridSize) + overhang)),
			wasFirstIndexMax = ((variables.current.maxFirstIndex < moreInfo.firstVisibleIndex - dimensionToExtent) && (firstIndex === variables.current.maxFirstIndex)),
			dataSizeDiff = dataSize - variables.current.curDataSize;
		let newFirstIndex = firstIndex;

		// When calling setState() except in didScroll(), `shouldUpdateBounds` should be `true`
		// so that setState() in didScroll() could be called to override state.
		// Before calling setState() except in didScroll(), getStatesAndUpdateBounds() is always called.
		// So `shouldUpdateBounds` is true here.
		variables.current.shouldUpdateBounds = true;

		variables.current.maxFirstIndex = Math.ceil((dataSize - newNumOfItems) / dimensionToExtent) * dimensionToExtent;
		variables.current.curDataSize = dataSize;

		// reset children
		variables.current.cc = [];
		variables.current.itemPositions = []; // For individually sized item
		calculateScrollBounds();
		updateMoreInfo(dataSize, scrollPosition);

		if (!(updateStatesAndBounds && updateStatesAndBounds({
			cbScrollTo: props.cbScrollTo,
			newNumOfItems,
			dataSize,
			moreInfo
		}))) {
			newFirstIndex = calculateFirstIndex(wasFirstIndexMax, dataSizeDiff);
		}

		setFirstIndex(newFirstIndex);
		setNumOfItems(newNumOfItems);
	}

	function calculateFirstIndex (wasFirstIndexMax, dataSizeDiff) {
		const
			{overhang} = props,
			{dimensionToExtent, isPrimaryDirectionVertical, maxFirstIndex, primary, scrollBounds, scrollPosition, threshold} = variables.current,
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

	function calculateScrollBounds () {
		const
			{clientSize} = props,
			node = containerRef.current;

		if (!clientSize && !node) {
			return;
		}

		const
			{scrollBounds, isPrimaryDirectionVertical} = variables.current,
			{clientWidth, clientHeight} = clientSize || getClientSize(node);
		let maxPos;

		scrollBounds.clientWidth = clientWidth;
		scrollBounds.clientHeight = clientHeight;
		scrollBounds.scrollWidth = getScrollWidth();
		scrollBounds.scrollHeight = getScrollHeight();
		scrollBounds.maxLeft = Math.max(0, scrollBounds.scrollWidth - clientWidth);
		scrollBounds.maxTop = Math.max(0, scrollBounds.scrollHeight - clientHeight);

		// correct position
		maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft;

		syncThreshold(maxPos);
	}

	function setContainerSize () {
		if (contentRef.current) {
			contentRef.current.style.width = variables.current.scrollBounds.scrollWidth + (variables.current.isPrimaryDirectionVertical ? -1 : 0) + 'px';
			contentRef.current.style.height = variables.current.scrollBounds.scrollHeight + (variables.current.isPrimaryDirectionVertical ? 0 : -1) + 'px';
		}
	}

	function updateMoreInfo (dataSize, primaryPosition) {
		const
			{dimensionToExtent: dimensionToExtent, moreInfo: moreInfo} = variables.current,
			{itemSize, gridSize, clientSize} = variables.current.primary;

		if (dataSize <= 0) {
			moreInfo.firstVisibleIndex = null;
			moreInfo.lastVisibleIndex = null;
		} else if (props.itemSizes) {
			const {isPrimaryDirectionVertical, scrollBounds: {clientWidth, clientHeight}, scrollPosition} = variables.current;
			const size = isPrimaryDirectionVertical ? clientHeight : clientWidth;

			let firstVisibleIndex = null, lastVisibleIndex = null;

			for (let i = firstIndex; i < firstIndex +  numOfItems; i++) {
				if (scrollPosition <= getItemBottomPosition(i)) {
					firstVisibleIndex = i;
					break;
				}
			}

			for (let i = firstIndex + numOfItems - 1; i >= firstIndex; i--) {
				if (scrollPosition + size >= getItemBottomPosition(i) - props.itemSizes[i]) {
					lastVisibleIndex = i;
					break;
				}
			}

			if (firstVisibleIndex > lastVisibleIndex) {
				firstVisibleIndex = null;
				lastVisibleIndex = null;
			}

			moreInfo.firstVisibleIndex = firstVisibleIndex;
			moreInfo.lastVisibleIndex = lastVisibleIndex;
		} else {
			moreInfo.firstVisibleIndex = (Math.floor((primaryPosition - itemSize) / gridSize) + 1) * dimensionToExtent;
			moreInfo.lastVisibleIndex = Math.min(dataSize - 1, Math.ceil((primaryPosition + clientSize) / gridSize) * dimensionToExtent - 1);
		}
	}

	function syncThreshold (maxPos) {
		const {threshold} = variables.current;

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
	function scrollToPosition (x, y, rtl = props.rtl) {
		if (containerRef.current) {
			if (variables.current.isPrimaryDirectionVertical) {
				variables.current.scrollPositionTarget = y;
			} else {
				variables.current.scrollPositionTarget = x;
			}

			if (rtl) {
				x = (platform.ios || platform.safari) ? -x : variables.current.scrollBounds.maxLeft - x;
			}

			containerRef.current.scrollTo(x, y);
		}
	}

	// JS only
	function setScrollPosition (x, y, rtl = props.rtl, targetX = 0, targetY = 0) {
		if (contentRef.current) {
			contentRef.current.style.transform = `translate3d(${rtl ? x : -x}px, -${y}px, 0)`;

			// The `x`, `y` as parameters in scrollToPosition() are the position when stopping scrolling.
			// But the `x`, `y` as parameters in setScrollPosition() are the position between current position and the position stopping scrolling.
			// To know the position when stopping scrolling here, `targetX` and `targetY` are passed and cached in `this.scrollPositionTarget`.
			if (variables.current.isPrimaryDirectionVertical) {
				variables.current.scrollPositionTarget = targetY;
			} else {
				variables.current.scrollPositionTarget = targetX;
			}

			didScroll(x, y);
		}
	}

	function didScroll (x, y) {
		const
			{dataSize, spacing, itemSizes} = props,
			{isPrimaryDirectionVertical, threshold, dimensionToExtent, maxFirstIndex, scrollBounds, itemPositions} = variables.current,
			{clientSize, gridSize} = variables.current.primary,
			maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft;
		let newFirstIndex = firstIndex, index, pos, size, itemPosition;

		if (isPrimaryDirectionVertical) {
			pos = y;
		} else {
			pos = x;
		}

		if (pos > threshold.max || pos < threshold.min) {
			let newThresholdMin = -Infinity, newThresholdMax = Infinity;

			if (props.itemSizes) {
				const overhangBefore = Math.floor(props.overhang / 2);
				let firstRenderedIndex = -1;

				// find an item which is known as placed the first rendered item's position
				for (index = 0; index < dataSize; index += dimensionToExtent) {
					itemPosition = itemPositions[index];
					size = itemSizes[index];
					if (itemPosition && size && itemPosition.position + size >= pos && itemPosition.position <= pos + clientSize) {
						firstRenderedIndex = index;
						break;
					}
				}

				// found an item which is visible within a current viewport
				if (index < dataSize) {
					if (itemPosition.position <= pos) {
						newFirstIndex = firstRenderedIndex - overhangBefore * dimensionToExtent;
						newThresholdMin = itemPosition.position;
						newThresholdMax = newThresholdMin + size + spacing;
					} else {
						const diffToFirstIndex = Math.ceil((itemPosition.position - pos) / gridSize);
						newFirstIndex = firstRenderedIndex - (diffToFirstIndex + overhangBefore) * dimensionToExtent;
						newThresholdMin = itemPosition.position - diffToFirstIndex * gridSize;
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
			} else {
				const
					overhangBefore = Math.floor(props.overhang / 2),
					firstExtent = Math.max(
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

			threshold.min = newFirstIndex === 0 ? -Infinity : newThresholdMin;
			threshold.max = newFirstIndex === maxFirstIndex ? Infinity : newThresholdMax;
		}

		syncThreshold(maxPos);
		variables.current.scrollPosition = pos;
		updateMoreInfo(dataSize, pos);

		if (variables.current.shouldUpdateBounds || firstIndex !== newFirstIndex) {
			setFirstIndex(newFirstIndex);
		}
	}

	// For individually sized item
	function calculateAndCacheItemPosition (index) {
		const {itemSizes} = props;

		if (!variables.current.itemPositions[index] && itemSizes[index]) {
			const
				{spacing} = props,
				position = getItemTopPositionFromPreviousItemBottomPosition(index, spacing);

			variables.current.itemPositions[index] = {position};
		}
	}

	// For individually sized item
	function applyItemPositionToDOMElement (index) {
		const
			{direction, rtl} = props,
			{itemPositions} = variables.current,
			childNode = itemContainerRef.current.children[index % numOfItems];

		if (childNode && itemPositions[index]) {
			const position = itemPositions[index].position;
			if (direction === 'vertical') {
				childNode.style.transform = `translate3d(0, ${position}px, 0)`;
			} else {
				childNode.style.transform = `translate3d(${position * (rtl ? -1 : 1)}px, 0, 0)`;
			}
		}
	}

	// For individually sized item
	function updateThresholdWithItemPosition () {
		const
			{overhang} = props,
			{maxFirstIndex} = variables.current,
			numOfUpperLine = Math.floor(overhang / 2);

		variables.current.threshold.min = firstIndex === 0 ? -Infinity : getItemBottomPosition(firstIndex + numOfUpperLine);
		variables.current.threshold.max = firstIndex === maxFirstIndex ? Infinity : getItemBottomPosition(firstIndex + (numOfUpperLine + 1));
	}

	// For individually sized item
	function updateScrollBoundsWithItemPositions () {
		const
			{dataSize, itemSizes, spacing} = props,
			{isPrimaryDirectionVertical, itemPositions} = variables.current,
			scrollBoundsDimension = isPrimaryDirectionVertical ? 'scrollHeight' : 'scrollWidth';

		if (itemPositions.length === dataSize) { // all item sizes are known
			variables.current.scrollBounds[scrollBoundsDimension] =
				itemSizes.reduce((acc, cur) => acc + cur, 0) + (dataSize - 1) * spacing;
		} else {
			for (let index = firstIndex + numOfItems - 1; index < dataSize; index++) {
				const nextInfo = itemPositions[index + 1];
				if (!nextInfo) {
					const endPosition = getItemBottomPosition(index);
					if (endPosition > variables.current.scrollBounds[scrollBoundsDimension]) {
						variables.current.scrollBounds[scrollBoundsDimension] = endPosition;
					}

					break;
				}
			}
		}

		variables.current.scrollBounds.maxTop = Math.max(0, variables.current.scrollBounds.scrollHeight - variables.current.scrollBounds.clientHeight);
	}

	// For individually sized item
	function adjustItemPositionWithItemSize () {
		if (itemContainerRef.current) {
			const
				{dataSize} = props,
				lastIndex = firstIndex + numOfItems - 1;

			// Cache individually sized item positions
			// and adjust item DOM element positions
			for (let index = firstIndex; index <= lastIndex; index++) {
				calculateAndCacheItemPosition(index);
				applyItemPositionToDOMElement(index);
			}

			// Update threshold based on itemPositions
			updateThresholdWithItemPosition();

			// Update scroll bounds based on itemPositions
			updateScrollBoundsWithItemPositions();

			// Set container size based on scrollbounds
			setContainerSize();

			// Update moreInfo based on itemPositions
			updateMoreInfo(dataSize, variables.current.scrollPosition);
		}
	}

	function getItemNode (index) {
		const ref = itemContainerRef.current;

		return ref ? ref.children[index % numOfItems] : null;
	}

	function composeStyle (width, height, primaryPosition, secondaryPosition) {
		const
			{x, y} = getXY(primaryPosition, secondaryPosition),
			composedStyle = {
				position: 'absolute',
				/* FIXME: RTL / this calculation only works for Chrome */
				transform: `translate3d(${props.rtl ? -x : x}px, ${y}px, 0)`
			};

		if (variables.current.isItemSized) {
			composedStyle.width = width;
			composedStyle.height = height;
		}

		return composedStyle;
	}

	function applyStyleToNewNode (index, ...restParams) {
		const
			{itemRenderer, getComponentProps} = props,
			key = index % numOfItems,
			itemElement = itemRenderer({
				...props.childProps,
				key,
				index
			}),
			componentProps = getComponentProps && getComponentProps(index) || {};

		variables.current.cc[key] = React.cloneElement(itemElement, {
			...componentProps,
			className: classNames(css.listItem, itemElement.props.className),
			style: {...itemElement.props.style, ...(composeStyle(...restParams))}
		});
	}

	function applyStyleToHideNode (index) {
		const key = index % numOfItems;
		variables.current.cc[key] = <div key={key} style={{display: 'none'}} />;
	}

	function positionItems () {
		const
			{dataSize, itemSizes} = props,
			{cc, isPrimaryDirectionVertical, dimensionToExtent, secondary, itemPositions, primary} = variables.current;
		let hideTo = 0,
			// TODO : check whether the belows variables(newUpdateFrom, newUpdateTo) are needed or not.
			newUpdateFrom = cc.length ? updateFromTo.from : firstIndex,
			newUpdateTo = cc.length ? updateFromTo.to : firstIndex + numOfItems;

		if (newUpdateFrom >= newUpdateTo) {
			return;
		} else if (newUpdateTo > dataSize) {
			hideTo = newUpdateTo;
			newUpdateTo = dataSize;
		}

		let
			width, height,
			{primaryPosition, secondaryPosition} = getGridPosition(newUpdateFrom);

		width = (isPrimaryDirectionVertical ? secondary.itemSize : primary.itemSize) + 'px';
		height = (isPrimaryDirectionVertical ? primary.itemSize : secondary.itemSize) + 'px';

		// positioning items
		for (let i = newUpdateFrom, j = newUpdateFrom % dimensionToExtent; i < newUpdateTo; i++) {
			applyStyleToNewNode(i, width, height, primaryPosition, secondaryPosition);

			if (++j === dimensionToExtent) {
				secondaryPosition = 0;

				if (props.itemSizes) {
					if (itemPositions[i + 1] || itemPositions[i + 1] === 0) {
						primaryPosition = itemPositions[i + 1].position;
					} else if (itemSizes[i]) {
						primaryPosition += itemSizes[i] + props.spacing;
					} else {
						primaryPosition += primary.gridSize;
					}
				} else {
					primaryPosition += primary.gridSize;
				}

				j = 0;
			} else {
				secondaryPosition += secondary.gridSize;
			}
		}

		for (let i = newUpdateTo; i < hideTo; i++) {
			applyStyleToHideNode(i);
		}
	}

	function getScrollHeight () {
		return (variables.current.isPrimaryDirectionVertical ? getVirtualScrollDimension() : variables.current.scrollBounds.clientHeight);
	}

	function getScrollWidth () {
		return (variables.current.isPrimaryDirectionVertical ? variables.current.scrollBounds.clientWidth : getVirtualScrollDimension());
	}

	function getVirtualScrollDimension () {
		if (props.itemSizes) {
			return props.itemSizes.reduce((total, size, index) => (total + size + (index > 0 ? props.spacing : 0)), 0);
		} else {
			const
				{dimensionToExtent, curDataSize, primary} = variables.current,
				{spacing} = props;

			return (Math.ceil(curDataSize / dimensionToExtent) * primary.gridSize) - spacing;
		}
	}

	function syncClientSize () {
		const node = containerRef.current;

		if (!props.clientSize && !node) {
			return false;
		}

		const
			{clientWidth, clientHeight} = props.clientSize || getClientSize(node),
			{scrollBounds} = variables.current;

		if (clientWidth !== scrollBounds.clientWidth || clientHeight !== scrollBounds.clientHeight) {
			calculateMetrics(props);
			setStatesAndUpdateBounds();

			setContainerSize();
			return true;
		}

		return false;
	}

	// render
	const
		{className, 'data-webos-voice-focused': voiceFocused, 'data-webos-voice-group-label': voiceGroupLabel, 'data-webos-voice-disabled': voiceDisabled, itemsRenderer, style, ...rest} = props,
		containerClasses = getContainerClasses(),
		contentClasses = getContentClasses();

	function getContainerClasses () {
		let containerClass = null;

		if (type === Native) {
			containerClass = variables.current.isPrimaryDirectionVertical ? css.vertical : css.horizontal;
		}

		return classNames(css.virtualList, containerClass, className);
	}

	function getContentClasses () {
		return type === Native ? null : css.content;
	}

	delete rest.cbScrollTo;
	delete rest.childProps;
	delete rest.clientSize;
	delete rest.dataSize;
	delete rest.direction;
	delete rest.getComponentProps;
	delete rest.isHorizontalScrollbarVisible;
	delete rest.isVerticalScrollbarVisible;
	delete rest.itemRenderer;
	delete rest.itemSize;
	delete rest.onUpdate;
	delete rest.onUpdateItems;
	delete rest.overhang;
	delete rest.pageScroll;
	delete rest.rtl;
	delete rest.spacing;
	delete rest.updateStatesAndBounds;
	delete rest.itemSizes;

	if (variables.current.primary) {
		positionItems();
	}

	return (
		<div className={containerClasses} data-webos-voice-focused={voiceFocused} data-webos-voice-group-label={voiceGroupLabel} data-webos-voice-disabled={voiceDisabled} ref={containerRef} style={style}>
			<div {...rest} className={contentClasses} ref={contentRef}>
				{itemsRenderer({cc: variables.current.cc, itemContainerRef, primary: variables.current.primary})}
			</div>
		</div>
	);
});

/**
 * A basic base component for
 * [VirtualList]{@link ui/VirtualList.VirtualList} and [VirtualGridList]{@link ui/VirtualList.VirtualGridList}.
 *
 * @class VirtualListBase
 * @memberof ui/VirtualList
 * @ui
 * @public
 */
VirtualListBase.displayName = 'ui:VirtualListBase';

VirtualListBase.propTypes = /** @lends ui/VirtualList.VirtualListBase.prototype */ {
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
	 * Disable voice control feature of component.
	 *
	 * @type {Boolean}
	 * @public
	 */
	'data-webos-voice-disabled': PropTypes.bool,

	/**
	 * Activates the component for voice control.
	 *
	 * @type {Boolean}
	 * @public
	 */
	'data-webos-voice-focused': PropTypes.bool,

	/**
	 * The voice control group label.
	 *
	 * @type {String}
	 * @public
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
	 * The array for individually sized items.
	 *
	 * @type {Number[]}
	 * @private
	 */
	itemSizes: PropTypes.arrayOf(PropTypes.number),

	/**
	 * Called when the range of items has updated.
	 *
	 * Event payload includes the `firstIndex` and `lastIndex` of the list.
	 *
	 * @type {Function}
	 * @private
	 */
	onUpdateItems: PropTypes.func,

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
	 * TBD
	 */
	type: PropTypes.string,

	/**
	 * Called to execute additional logic in a themed component when updating states and bounds.
	 *
	 * @type {Function}
	 * @private
	 */
	updateStatesAndBounds: PropTypes.func
};

VirtualListBase.defaultProps = {
	cbScrollTo: nop,
	dataSize: 0,
	direction: 'vertical',
	overhang: 3,
	pageScroll: false,
	spacing: 0,
	type: 'JS'
};

/**
 * A callback function that receives a reference to the `scrollTo` feature.
 *
 * Once received, the `scrollTo` method can be called as an imperative interface.
 *
 * The `scrollTo` function accepts the following parameters:
 * - {position: {x, y}} - Pixel value for x and/or y position
 * - {align} - Where the scroll area should be aligned. Values are:
 *   `'left'`, `'right'`, `'top'`, `'bottom'`,
 *   `'topleft'`, `'topright'`, `'bottomleft'`, and `'bottomright'`.
 * - {index} - Index of specific item. (`0` or positive integer)
 *   This option is available for only `VirtualList` kind.
 * - {node} - Node to scroll into view
 * - {animate} - When `true`, scroll occurs with animation. When `false`, no
 *   animation occurs.
 * - {focus} - When `true`, attempts to focus item after scroll. Only valid when scrolling
 *   by `index` or `node`.
 * > Note: Only specify one of: `position`, `align`, `index` or `node`
 *
 * Example:
 * ```
 *	// If you set cbScrollTo prop like below;
 *	cbScrollTo: (fn) => {this.scrollTo = fn;}
 *	// You can simply call like below;
 *	this.scrollTo({align: 'top'}); // scroll to the top
 * ```
 *
 * @name cbScrollTo
 * @memberof ui/VirtualList.VirtualListBase.prototype
 * @type {Function}
 * @public
 */

/**
 * Specifies how to show horizontal scrollbar.
 *
 * Valid values are:
 * * `'auto'`,
 * * `'visible'`, and
 * * `'hidden'`.
 *
 * @name horizontalScrollbar
 * @memberof ui/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @default 'auto'
 * @public
 */

/**
 * Prevents scroll by wheeling on the list.
 *
 * @name noScrollByWheel
 * @memberof ui/VirtualList.VirtualListBase.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

/**
 * Called when scrolling.
 *
 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`.
 * It is not recommended to set this prop since it can cause performance degradation.
 * Use `onScrollStart` or `onScrollStop` instead.
 *
 * @name onScroll
 * @memberof ui/VirtualList.VirtualListBase.prototype
 * @type {Function}
 * @param {Object} event
 * @param {Number} event.scrollLeft Scroll left value.
 * @param {Number} event.scrollTop Scroll top value.
 * @param {Object} event.moreInfo The object including `firstVisibleIndex` and `lastVisibleIndex` properties.
 * @public
 */

/**
 * Called when scroll starts.
 *
 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`.
 * You can get firstVisibleIndex and lastVisibleIndex from VirtualList with `moreInfo`.
 *
 * Example:
 * ```
 * onScrollStart = ({scrollLeft, scrollTop, moreInfo}) => {
 *     const {firstVisibleIndex, lastVisibleIndex} = moreInfo;
 *     // do something with firstVisibleIndex and lastVisibleIndex
 * }
 *
 * render = () => (
 *     <VirtualList
 *         ...
 *         onScrollStart={this.onScrollStart}
 *         ...
 *     />
 * )
 * ```
 *
 * @name onScrollStart
 * @memberof ui/VirtualList.VirtualListBase.prototype
 * @type {Function}
 * @param {Object} event
 * @param {Number} event.scrollLeft Scroll left value.
 * @param {Number} event.scrollTop Scroll top value.
 * @param {Object} event.moreInfo The object including `firstVisibleIndex` and `lastVisibleIndex` properties.
 * @public
 */

/**
 * Called when scroll stops.
 *
 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`.
 * You can get firstVisibleIndex and lastVisibleIndex from VirtualList with `moreInfo`.
 *
 * Example:
 * ```
 * onScrollStop = ({scrollLeft, scrollTop, moreInfo}) => {
 *     const {firstVisibleIndex, lastVisibleIndex} = moreInfo;
 *     // do something with firstVisibleIndex and lastVisibleIndex
 * }
 *
 * render = () => (
 *     <VirtualList
 *         ...
 *         onScrollStop={this.onScrollStop}
 *         ...
 *     />
 * )
 * ```
 *
 * @name onScrollStop
 * @memberof ui/VirtualList.VirtualListBase.prototype
 * @type {Function}
 * @param {Object} event
 * @param {Number} event.scrollLeft Scroll left value.
 * @param {Number} event.scrollTop Scroll top value.
 * @param {Object} event.moreInfo The object including `firstVisibleIndex` and `lastVisibleIndex` properties.
 * @public
 */

/**
 * Specifies how to show vertical scrollbar.
 *
 * Valid values are:
 * * `'auto'`,
 * * `'visible'`, and
 * * `'hidden'`.
 *
 * @name verticalScrollbar
 * @memberof ui/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @default 'auto'
 * @public
 */

const ScrollableVirtualList = ({role, ...rest}) => (
	<Scrollable
		{...rest}
		childRenderer={({initChildRef, ...childRest}) => ( // eslint-disable-line react/jsx-no-bind
			<VirtualListBase
				{...childRest}
				itemsRenderer={({cc, itemContainerRef}) => ( // eslint-disable-line react/jsx-no-bind
					cc.length ? <div ref={itemContainerRef} role={role}>{cc}</div> : null
				)}
				ref={initChildRef}
			/>
		)}
	/>
);

ScrollableVirtualList.propTypes = {
	direction: PropTypes.oneOf(['horizontal', 'vertical']),
	role: PropTypes.string
};

ScrollableVirtualList.defaultProps = {
	direction: 'vertical',
	role: 'list'
};

export default VirtualListBase;
export {
	gridListItemSizeShape,
	itemSizesShape,
	ScrollableVirtualList,
	VirtualListBase
};
