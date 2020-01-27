import {useRef} from 'react';

const useCalculateMetrics = (props, instances, dependencies) => {
	const {type} = props;
	const {contentRef, uiChildContainerRef, virtualListBase} = instances;
	const {firstIndex} = virtualListBase;
	const {getMoreInfo, numOfItems, setFirstIndex, setNumOfItems, updateMoreInfo} = dependencies;

	// Instance variables

	const variables = useRef({
		scrollBounds: {
			clientHeight: 0,
			clientWidth: 0,
			maxLeft: 0,
			maxTop: 0,
			scrollHeight: 0,
			scrollWidth: 0
		}
	});

	// Functions

	function calculateMetrics () {
		const
			{clientSize, direction, itemSize, overhang, spacing} = props,
			node = uiChildContainerRef.current;

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

		virtualListBase.current.isPrimaryDirectionVertical = (direction === 'vertical');

		if (virtualListBase.current.isPrimaryDirectionVertical) {
			primaryInfo = heightInfo;
			secondary = widthInfo;
		} else {
			primaryInfo = widthInfo;
			secondary = heightInfo;
		}
		dimensionToExtent = 1;

		virtualListBase.current.isItemSized = (primaryInfo.minItemSize && secondary.minItemSize);

		if (virtualListBase.current.isItemSized) {
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

		virtualListBase.current.threshold = {min: -Infinity, max: thresholdBase, base: thresholdBase};
		virtualListBase.current.dimensionToExtent = dimensionToExtent;

		virtualListBase.current.primary = primaryInfo;
		virtualListBase.current.secondary = secondary;

		// reset
		virtualListBase.current.scrollPosition = 0;
		if (type === 'JS' && contentRef.current) {
			contentRef.current.style.transform = null;
		}
	}

	function setStatesAndUpdateBounds () {
		const
			{dataSize, overhang, updateStatesAndBounds} = props,
			{dimensionToExtent, primary, scrollPosition} = virtualListBase.current,
			newNumOfItems = Math.min(dataSize, dimensionToExtent * (Math.ceil(primary.clientSize / primary.gridSize) + overhang)),
			wasFirstIndexMax = ((virtualListBase.current.maxFirstIndex < getMoreInfo().firstVisibleIndex - dimensionToExtent) && (firstIndex === virtualListBase.current.maxFirstIndex)),
			dataSizeDiff = dataSize - virtualListBase.current.curDataSize;
		let newFirstIndex = firstIndex;

		// When calling setState() except in didScroll(), `shouldUpdateBounds` should be `true`
		// so that setState() in didScroll() could be called to override state.
		// Before calling setState() except in didScroll(), getStatesAndUpdateBounds() is always called.
		// So `shouldUpdateBounds` is true here.
		virtualListBase.current.shouldUpdateBounds = true;

		virtualListBase.current.maxFirstIndex = Math.ceil((dataSize - newNumOfItems) / dimensionToExtent) * dimensionToExtent;
		virtualListBase.current.curDataSize = dataSize;

		// reset children
		virtualListBase.current.cc = [];
		virtualListBase.current.itemPositions = []; // For individually sized item
		calculateScrollBounds();
		updateMoreInfo(dataSize, scrollPosition);

		if (!(updateStatesAndBounds && updateStatesAndBounds({
			cbScrollTo: props.cbScrollTo,
			dataSize,
			moreInfo: getMoreInfo(),
			newNumOfItems
		}))) {
			newFirstIndex = calculateFirstIndex(wasFirstIndexMax, dataSizeDiff);
		}

		setFirstIndex(newFirstIndex);
		setNumOfItems(newNumOfItems);
	}

	function calculateFirstIndex (wasFirstIndexMax, dataSizeDiff) {
		const
			{overhang} = props,
			{scrollBounds} = variables.current,
			{dimensionToExtent, isPrimaryDirectionVertical, maxFirstIndex, primary, scrollPosition, threshold} = virtualListBase.current,
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

	function getVirtualScrollDimension () {
		if (props.itemSizes) {
			return props.itemSizes.reduce((total, size, index) => (total + size + (index > 0 ? props.spacing : 0)), 0);
		} else {
			const
				{dimensionToExtent, curDataSize, primary} = virtualListBase.current,
				{spacing} = props;

			return (Math.ceil(curDataSize / dimensionToExtent) * primary.gridSize) - spacing;
		}
	}

	function getScrollHeight () {
		return (virtualListBase.current.isPrimaryDirectionVertical ? getVirtualScrollDimension() : variables.current.scrollBounds.clientHeight);
	}

	function getScrollWidth () {
		return (virtualListBase.current.isPrimaryDirectionVertical ? variables.current.scrollBounds.clientWidth : getVirtualScrollDimension());
	}

	function calculateScrollBounds () {
		const
			{clientSize} = props,
			node = uiChildContainerRef.current;

		if (!clientSize && !node) {
			return;
		}

		const
			{scrollBounds} = variables.current,
			{isPrimaryDirectionVertical} = virtualListBase.current,
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

	function getScrollBounds () {
		return variables.current.scrollBounds;
	}

	// For individually sized item
	function updateScrollBoundsWithItemPositions () {
		const
			{dataSize, itemSizes, spacing} = props,
			{isPrimaryDirectionVertical, itemPositions} = virtualListBase.current,
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

	function setContainerSize () {
		if (contentRef.current) {
			contentRef.current.style.width = variables.current.scrollBounds.scrollWidth + (virtualListBase.current.isPrimaryDirectionVertical ? -1 : 0) + 'px';
			contentRef.current.style.height = variables.current.scrollBounds.scrollHeight + (virtualListBase.current.isPrimaryDirectionVertical ? 0 : -1) + 'px';
		}
	}

	function syncThreshold (maxPos) {
		const {threshold} = virtualListBase.current;

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

	function getClientSize (node) {
		return {
			clientWidth: node.clientWidth,
			clientHeight: node.clientHeight
		};
	}

	function syncClientSize () {
		const node = uiChildContainerRef.current;

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

	// Return

	return {
		calculateMetrics,
		getScrollBounds,
		setContainerSize,
		setStatesAndUpdateBounds,
		syncClientSize,
		syncThreshold,
		updateScrollBoundsWithItemPositions
	};
};

export default useCalculateMetrics;
export {
	useCalculateMetrics
};
