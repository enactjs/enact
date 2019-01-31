const defaultMetrics = {
	containerRef: null,
	dimensionToExtent: 0,
	isItemSized: false,
	isPrimaryDirectionVertical: true,
	maxFirstIndex: 0,
	moreInfo: {
		firstVisibleIndex: null,
		lastVisibleIndex: null
	},
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
	threshold: null
};

const getClientSize = function (node) {
	return {
		clientWidth: node.clientWidth,
		clientHeight: node.clientHeight
	};
};

const getVirtualScrollDimension = function (props, state) {
	const
		{dataSize} = state.prevProps,
		{dimensionToExtent, primary} = state.metrics,
		{spacing} = props;

	return (Math.ceil(dataSize / dimensionToExtent) * primary.gridSize) - spacing;
};

const getScrollHeight = function (props, state) {
	return state.metrics.isPrimaryDirectionVertical ? getVirtualScrollDimension(props, state) : state.metrics.scrollBounds.clientHeight;
};

const getScrollWidth = function (props, state) {
	return state.metrics.isPrimaryDirectionVertical ? state.metrics.scrollBounds.clientWidth : getVirtualScrollDimension(props, state);
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

const calculateMaxFirstIndex = function (props, state, numOfItems) {
	const
		{dataSize} = props,
		{dimensionToExtent} = state.metrics;
	return Math.ceil((dataSize - numOfItems) / dimensionToExtent) * dimensionToExtent;
};

const calculateMoreInfo = function (props, state, primaryPosition) {
	const
		{dataSize} = props,
		{dimensionToExtent, primary} = state.metrics,
		{itemSize, gridSize, clientSize} = primary;

	if (dataSize <= 0) {
		return {
			firstVisibleIndex: null,
			lastVisibleIndex: null
		};
	} else {
		return {
			firstVisibleIndex: (Math.floor((primaryPosition - itemSize) / gridSize) + 1) * dimensionToExtent,
			lastVisibleIndex: Math.min(dataSize - 1, Math.ceil((primaryPosition + clientSize) / gridSize) * dimensionToExtent - 1)
		};
	}
};

const calculateScrollBounds = function (props, state) {
	const
		{clientSize} = props,
		{containerRef} = state.metrics;

	if (!clientSize && !containerRef) {
		return defaultMetrics.scrollBounds;
	}

	const {clientWidth, clientHeight} = clientSize || getClientSize(containerRef);

	const nextScrollBounds = {
		clientWidth,
		clientHeight,
		scrollWidth: getScrollWidth(props, state),
		scrollHeight: getScrollHeight(props, state)
	};

	return {
		...nextScrollBounds,
		maxLeft: Math.max(0, nextScrollBounds.scrollWidth - clientWidth),
		maxTop: Math.max(0, nextScrollBounds.scrollHeight - clientHeight)
	};
};

const calculateThreshold = function (state, nextScrollBounds) {
	const
		{isPrimaryDirectionVertical, threshold} = state.metrics,
		maxPos = isPrimaryDirectionVertical ? nextScrollBounds.maxTop : nextScrollBounds.maxLeft;

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

const calculateMetrics = function (props, state) {
	const
		{clientSize, direction, itemSize, spacing} = props,
		{containerRef} = state.metrics || {};

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
		moreInfo: {
			firstVisibleIndex: null,
			lastVisibleIndex: null
		},
		primary,
		scrollBounds: defaultMetrics.scrollBounds,
		secondary,
		threshold: {base: thresholdBase, max: thresholdBase, min: -Infinity}
	};
};

const updateMatrics = function (props, state, initialization = false, updateState = true) {
	if (initialization) {
		const nextMatrics = calculateMetrics(props, state);

		if (nextMatrics) {
			state.metrics = nextMatrics;
		}
		state.firstIndex = 0;
		state.numOfItems = 0;
		state.scrollPosition = 0;
	}

	if (updateState) {
		const
			{dataSize, overhang, updateStatesAndBounds: propUpdateStatesAndBounds} = props,
			{firstIndex, scrollPosition, prevProps: {dataSize: prevDataSize}} = state,
			{dimensionToExtent, maxFirstIndex, moreInfo, isPrimaryDirectionVertical, primary, threshold} = state.metrics;

		const
			numOfItems = Math.min(dataSize, dimensionToExtent * (Math.ceil(primary.clientSize / primary.gridSize) + overhang)),
			wasFirstIndexMax = ((maxFirstIndex < moreInfo.firstVisibleIndex - dimensionToExtent) && (firstIndex === maxFirstIndex)),
			dataSizeDiff = dataSize - prevDataSize;

		const isRestoredLastFocused = (propUpdateStatesAndBounds && propUpdateStatesAndBounds({
			cbScrollTo: props.cbScrollTo,
			numOfItems,
			dataSize,
			moreInfo
		}));

		const nextMoreInfo = calculateMoreInfo(props, state);
		const nextScrollBounds = calculateScrollBounds(props, state);

		let
			nextFirstIndex = state.firstIndex,
			nextThreshold = state.metrics.threshold;

		if (!isRestoredLastFocused) {
			const {gridSize} = primary;

			if (wasFirstIndexMax && dataSizeDiff > 0) { // If dataSize increased from bottom, we need adjust firstIndex
				// If this is a gridlist and dataSizeDiff is smaller than 1 line, we are adjusting firstIndex without threshold change.
				if (dimensionToExtent > 1 && dataSizeDiff < dimensionToExtent) {
					nextFirstIndex = maxFirstIndex;
				} else { // For other bottom adding case, we need to update firstIndex and threshold.
					const
						maxPos = isPrimaryDirectionVertical ? nextScrollBounds.maxTop : nextScrollBounds.maxLeft,
						maxOfMin = maxPos - threshold.base,
						numOfUpperLine = Math.floor(overhang / 2),
						firstIndexFromPosition = Math.floor(scrollPosition / gridSize),
						expectedFirstIndex = Math.max(0, firstIndexFromPosition - numOfUpperLine);

					// To navigate with 5way, we need to adjust firstIndex to the next line
					// since at the bottom we have num of overhang lines for upper side but none for bottom side
					// So we add numOfUpperLine at the top and rest lines at the bottom
					nextFirstIndex = Math.min(maxFirstIndex, expectedFirstIndex * dimensionToExtent);
					nextThreshold = {
						// We need to update threshold also since we moved the firstIndex
						...threshold,
						max: Math.min(maxPos, threshold.max + gridSize),
						min: Math.min(maxOfMin, threshold.max - gridSize)
					};
				}
			} else { // Other cases, we can keep the min value between firstIndex and maxFirstIndex. No need to change threshold
				nextFirstIndex = Math.min(firstIndex, maxFirstIndex);
			}
		} else {
			nextThreshold = calculateThreshold(state, nextScrollBounds);
		}

		state.metrics.scrollBounds = nextScrollBounds;
		state.metrics.moreInfo = nextMoreInfo;
		state.metrics.maxFirstIndex = calculateMaxFirstIndex(props, state, numOfItems);
		state.metrics.threshold = nextThreshold;

		state.cc = [];
		state.firstIndex = nextFirstIndex;
		state.numOfItems = numOfItems;
	}
};

const updateScrollPosition = function (props, state, x, y, dirX, dirY) {
	const
		{firstIndex} = state,
		{dimensionToExtent, isPrimaryDirectionVertical, maxFirstIndex, scrollBounds, threshold} = state.metrics,
		{gridSize} = state.metrics.primary,
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

	const
		newThreshold = calculateThreshold(state, maxPos),
		newMoreInfo = calculateMoreInfo(props, state, pos);

	if (firstIndex !== newFirstIndex) {
		return {
			firstIndex: newFirstIndex,
			moreInfo: newMoreInfo,
			scrollPosition: pos,
			threshold: newThreshold
		};
	} else {
		// For scroll performance, we update moreInfo, scrollPosition, and threshold in state directly
		state.metrics.moreInfo = newMoreInfo; // eslint-disable-line react/no-direct-mutation-state
		state.metrics.threshold = newThreshold; // eslint-disable-line react/no-direct-mutation-state
		state.scrollPosition = pos; // eslint-disable-line react/no-direct-mutation-state

		return null;
	}
};

export default defaultMetrics;
export {
	defaultMetrics,
	hasDataSizeChanged,
	hasMetricsChanged,
	updateMatrics,
	updateScrollPosition
};
