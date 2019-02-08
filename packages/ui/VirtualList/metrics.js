const defaultMetrics = {
	scroll: {
		cc: [],
		firstIndex: 0,
		moreInfo: {
			firstVisibleIndex: null,
			lastVisibleIndex: null
		},
		scrollPosition: 0,
		threshold: null
	},
	size: {
		containerRef: null,
		curDataSize: 0,
		dimensionToExtent: 0,
		isItemSized: false,
		isPrimaryDirectionVertical: true,
		maxFirstIndex: 0,
		numOfItems: 0,
		primary: null,
		scrollBounds: {
			clientHeight: 0,
			clientWidth: 0,
			maxLeft: 0,
			maxTop: 0,
			scrollHeight: 0,
			scrollWidth: 0
		},
		secondary: null,
		thresholdBase: null
	}
};

const getClientSize = function (node) {
	return {
		clientWidth: node.clientWidth,
		clientHeight: node.clientHeight
	};
};

const getVirtualScrollDimension = function (props, state) {
	const
		{dataSize: prevDataSize} = state.prevProps,
		{dimensionToExtent, primary} = state.metrics.size,
		{spacing} = props;

	return (Math.ceil(prevDataSize / dimensionToExtent) * primary.gridSize) - spacing;
};

const getScrollHeight = function (props, state) {
	const {isPrimaryDirectionVertical, scrollBounds: {clientHeight}} = state.metrics.size;
	return isPrimaryDirectionVertical ? getVirtualScrollDimension(props, state) : clientHeight;
};

const getScrollWidth = function (props, state) {
	const {isPrimaryDirectionVertical, scrollBounds: {clientWidth}} = state.metrics.size;
	return isPrimaryDirectionVertical ? clientWidth : getVirtualScrollDimension(props, state);
};

const hasDataSizeChanged = function (props, state) {
	const
		{dataSize} = props,
		{prevProps: {dataSize: prevDataSize}} = state;
	return prevDataSize !== dataSize;
};

const hasMetricsChanged = function (props, state) {
	const {direction, itemSize, overhang, spacing} = state.prevProps;

	return (
		direction !== props.direction ||
		((itemSize instanceof Object) ? (itemSize.minWidth !== props.itemSize.minWidth || itemSize.minHeight !== props.itemSize.minHeight) : itemSize !== props.itemSize) ||
		overhang !== props.overhang ||
		spacing !== props.spacing
	);
};

const calculateMaxFirstIndex = function (prevState, props, state, numOfItems) {
	const
		{dataSize} = props,
		{dimensionToExtent} = state.metrics.size || prevState.metrics.size;
	return Math.ceil((dataSize - numOfItems) / dimensionToExtent) * dimensionToExtent;
};

const calculateMoreInfo = function (prevState, props, state, primaryScrollPosition) {
	const
		{dataSize} = props,
		{dimensionToExtent, primary} = state.metrics.size || prevState.metrics.size,
		{itemSize, gridSize, clientSize} = primary;

	if (dataSize <= 0) {
		return {
			firstVisibleIndex: null,
			lastVisibleIndex: null
		};
	} else {
		return {
			firstVisibleIndex: (Math.floor((primaryScrollPosition - itemSize) / gridSize) + 1) * dimensionToExtent,
			lastVisibleIndex: Math.min(dataSize - 1, Math.ceil((primaryScrollPosition + clientSize) / gridSize) * dimensionToExtent - 1)
		};
	}
};

const calculateScrollBounds = function (prevState, props) {
	const
		{containerRef} = prevState.metrics.size,
		{clientSize} = props;

	if (!clientSize && !containerRef) {
		return defaultMetrics.size.scrollBounds;
	}

	const
		{clientWidth, clientHeight} = clientSize || getClientSize(containerRef),
		scrollBounds = {
			clientWidth,
			clientHeight,
			scrollWidth: getScrollWidth(props, prevState),
			scrollHeight: getScrollHeight(props, prevState)
		};

	return {
		...scrollBounds,
		maxLeft: Math.max(0, scrollBounds.scrollWidth - clientWidth),
		maxTop: Math.max(0, scrollBounds.scrollHeight - clientHeight)
	};
};

const calculateThreshold = function (prevState, state, scrollBounds) {
	const
		{threshold} = state.metrics.scroll || prevState.metrics.scroll,
		{isPrimaryDirectionVertical} = state.metrics.size || prevState.metrics.size,
		maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft;

	if (threshold.max > maxPos) {
		if (maxPos < threshold.base) {
			return {
				...threshold,
				max: threshold.base,
				min: -Infinity
			};
		} else {
			return {
				...threshold,
				max: maxPos,
				min: maxPos - threshold.base
			};
		}
	} else {
		return threshold;
	}
};

const calculateSizeMetrics = function (prevState, props) {
	const
		{clientSize, direction, itemSize, spacing} = props,
		{containerRef} = prevState.metrics.size || {};

	if (!clientSize && !containerRef) {
		return null;
	}

	const
		{clientWidth, clientHeight} = (clientSize || getClientSize(containerRef)),
		heightInfo = {
			clientSize: clientHeight,
			minItemSize: itemSize.minHeight || null,
			itemSize: itemSize
		},
		widthInfo = {
			clientSize: clientWidth,
			minItemSize: itemSize.minWidth || null,
			itemSize: itemSize
		},
		isPrimaryDirectionVertical = (direction === 'vertical');
	let primary, secondary, dimensionToExtent, thresholdBase;

	if (isPrimaryDirectionVertical) {
		primary = heightInfo;
		secondary = widthInfo;
	} else {
		primary = widthInfo;
		secondary = heightInfo;
	}
	dimensionToExtent = 1;

	const isItemSized = (primary.minItemSize && secondary.minItemSize);

	if (isItemSized) {
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

	return {
		containerRef,
		dimensionToExtent,
		isItemSized,
		isPrimaryDirectionVertical,
		maxFirstIndex: 0,
		numOfItems: 0,
		primary,
		scrollBounds: defaultMetrics.size.scrollBounds,
		secondary,
		thresholdBase
	};
};

const calculateMetrics = function (prevState, props) {
	const newSizeMetrics = calculateSizeMetrics(prevState, props);

	return {
		scroll: {
			firstIndex: 0,
			moreInfo: {
				firstVisibleIndex: null,
				lastVisibleIndex: null
			},
			scrollPosition: 0,
			threshold: {base: newSizeMetrics.thresholdBase, max: newSizeMetrics.thresholdBase, min: -Infinity}
		},
		size: newSizeMetrics ? newSizeMetrics : null
	};
};

const updateMetrics = function (prevProps, prevState, props, initialization = false) {
	const
		state = initialization ? calculateMetrics(prevState, props) : {},
		// the values from props and states
		{dataSize: prevDataSize} = prevProps,
		{dataSize, overhang, updateStatesAndBounds: propUpdateStatesAndBounds} = props,
		{firstIndex, moreInfo, scrollPosition, threshold} = (state || prevState).metrics.scroll,
		{dimensionToExtent, isPrimaryDirectionVertical, maxFirstIndex, primary} = (state || prevState).metrics.size,
		{clientSize, gridSize} = primary,
		// the values calculated
		numOfItems = Math.min(dataSize, dimensionToExtent * (Math.ceil(clientSize / gridSize) + overhang)),
		wasFirstIndexMax = ((maxFirstIndex < moreInfo.firstVisibleIndex - dimensionToExtent) && (firstIndex === maxFirstIndex)),
		dataSizeDiff = dataSize - prevDataSize,
		isRestoredLastFocused = (propUpdateStatesAndBounds && propUpdateStatesAndBounds({
			cbScrollTo: props.cbScrollTo,
			numOfItems,
			dataSize,
			moreInfo
		})),
		// the value for state
		newScrollBounds = calculateScrollBounds(prevState, props);
	let
		newFirstIndex = firstIndex,
		newThreshold = threshold;

	if (!isRestoredLastFocused) {
		if (wasFirstIndexMax && dataSizeDiff > 0) { // If dataSize increased from bottom, we need adjust firstIndex
			// If this is a gridlist and dataSizeDiff is smaller than 1 line, we are adjusting firstIndex without threshold change.
			if (dimensionToExtent > 1 && dataSizeDiff < dimensionToExtent) {
				newFirstIndex = maxFirstIndex;
			} else { // For other bottom adding case, we need to update firstIndex and threshold.
				const
					maxPos = isPrimaryDirectionVertical ? newScrollBounds.maxTop : newScrollBounds.maxLeft,
					maxOfMin = maxPos - threshold.base,
					numOfUpperLine = Math.floor(overhang / 2),
					firstIndexFromPosition = Math.floor(scrollPosition / gridSize),
					expectedFirstIndex = Math.max(0, firstIndexFromPosition - numOfUpperLine);

				// To navigate with 5way, we need to adjust firstIndex to the next line
				// since at the bottom we have num of overhang lines for upper side but none for bottom side
				// So we add numOfUpperLine at the top and rest lines at the bottom
				newFirstIndex = Math.min(maxFirstIndex, expectedFirstIndex * dimensionToExtent);
				newThreshold = {
					// We need to update threshold also since we moved the firstIndex
					...threshold,
					max: Math.min(maxPos, threshold.max + gridSize),
					min: Math.min(maxOfMin, threshold.max - gridSize)
				};
			}
		} else { // Other cases, we can keep the min value between firstIndex and maxFirstIndex. No need to change threshold
			newFirstIndex = Math.min(firstIndex, maxFirstIndex);
		}
	} else {
		newThreshold = calculateThreshold(prevState, state, newScrollBounds);
	}

	return {
		scroll: {
			cc: [],
			firstIndex: newFirstIndex,
			moreInfo: calculateMoreInfo(prevState, props, state, newScrollBounds),
			scrollBounds: newScrollBounds,
			threshold: newThreshold
		},
		size: {
			...state.metrics.size,
			maxFirstIndex: calculateMaxFirstIndex(props, state, numOfItems),
			numOfItems
		}
	};
};

const initializeMetrics = function (props, state) {
	return updateMetrics(props, state, props, true);
};

const updateScrollPosition = function (props, state, x, y, dirX, dirY) {
	const
		{
			scroll: {firstIndex, threshold},
			size: {dimensionToExtent, isPrimaryDirectionVertical, maxFirstIndex, primary: {gridSize}, scrollBounds}
		} = state.metrics,
		maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft,
		minOfMax = threshold.base,
		maxOfMin = maxPos - threshold.base;
	let
		delta,
		numOfGridLines,
		newFirstIndex = firstIndex,
		pos,
		dir = 0;

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

	const
		newThreshold = calculateThreshold(null, state, scrollBounds),
		newMoreInfo = calculateMoreInfo({}, props, state, pos);

	if (firstIndex !== newFirstIndex) {
		return {
			metrics: {
				scroll: {
					firstIndex: newFirstIndex,
					moreInfo: newMoreInfo,
					scrollPosition: pos,
					threshold: newThreshold
				},
				size: this.state.metrics.size
			}
		};
	} else {
		// For scroll performance, we update moreInfo, scrollPosition, and threshold in state directly
		state.metrics.scroll = { // eslint-disable-line react/no-direct-mutation-state
			firstIndex,
			moreInfo: newMoreInfo,
			threshold: newThreshold,
			scrollPosition: pos
		};

		return null;
	}
};

export default defaultMetrics;
export {
	calculateMetrics,
	defaultMetrics,
	hasDataSizeChanged,
	hasMetricsChanged,
	initializeMetrics,
	updateMetrics,
	updateScrollPosition
};
