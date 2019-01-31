const defaultMatrics = {
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
	threshold: 0
};

const getClientSize = function (node) {
	return {
		clientWidth: node.clientWidth,
		clientHeight: node.clientHeight
	};
};

const calculateFirstIndexAndThreshold = function (props, state, wasFirstIndexMax, dataSizeDiff) {
	const
		{overhang} = props,
		{firstIndex, scrollPosition} = state,
		{dimensionToExtent, isPrimaryDirectionVertical, maxFirstIndex, primary, scrollBounds, threshold} = state.metrics,
		{gridSize} = primary;

	if (wasFirstIndexMax && dataSizeDiff > 0) { // If dataSize increased from bottom, we need adjust firstIndex
		// If this is a gridlist and dataSizeDiff is smaller than 1 line, we are adjusting firstIndex without threshold change.
		if (dimensionToExtent > 1 && dataSizeDiff < dimensionToExtent) {
			state.firstIndex = maxFirstIndex;
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
			state.firstIndex = Math.min(maxFirstIndex, expectedFirstIndex * dimensionToExtent);
			state.metrics = {
				...state.metrics,
				// We need to update threshold also since we moved the firstIndex
				threshold: {
					max: Math.min(maxPos, threshold.max + gridSize),
					min: Math.min(maxOfMin, threshold.max - gridSize)
				}
			};
		}
	} else { // Other cases, we can keep the min value between firstIndex and maxFirstIndex. No need to change threshold
		state.firstIndex = Math.min(firstIndex, maxFirstIndex);
	}
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

const calculateScrollBounds = function (props, state) {
	const
		{clientSize} = props,
		{containerRef} = state.metrics;

	if (!clientSize && !containerRef) {
		return {};
	}

	const {clientWidth, clientHeight} = clientSize || getClientSize(containerRef);

	state.metrics.scrollBounds = {
		clientWidth,
		clientHeight,
		scrollWidth: getScrollWidth(props, state),
		scrollHeight: getScrollHeight(props, state),
		maxLeft: Math.max(0, state.metrics.scrollBounds.scrollWidth - clientWidth),
		maxTop: Math.max(0, state.metrics.scrollBounds.scrollHeight - clientHeight)
	};
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

const calculateMetrics = function (props, state) {
	const
		{clientSize, direction, itemSize, spacing} = props,
		{containerRef} = state.metrics || {};

	if (!clientSize && !containerRef) {
		return;
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

	state.metrics = {
		...state.metrics,
		dimensionToExtent,
		isItemSized,
		isPrimaryDirectionVertical,
		maxFirstIndex: 0,
		moreInfo: {
			firstVisibleIndex: null,
			lastVisibleIndex: null
		},
		primary,
		secondary,
		threshold: {base: thresholdBase, max: thresholdBase, min: -Infinity}
	};

	state.firstIndex = 0;
	state.scrollPosition = 0;
	state.numOfItems = 0;
};

const calculateMoreInfo = function (props, state, primaryPosition) {
	const
		{dataSize} = props,
		{dimensionToExtent, primary} = state.metrics,
		{itemSize, gridSize, clientSize} = primary;

	if (dataSize <= 0) {
		state.metrics.moreInfo = {
			firstVisibleIndex: null,
			lastVisibleIndex: null
		};
	} else {
		state.metrics.moreInfo = {
			firstVisibleIndex: (Math.floor((primaryPosition - itemSize) / gridSize) + 1) * dimensionToExtent,
			lastVisibleIndex: Math.min(dataSize - 1, Math.ceil((primaryPosition + clientSize) / gridSize) * dimensionToExtent - 1)
		};
	}
};

const calculateThreshold = function (state) {
	const
		{isPrimaryDirectionVertical, scrollBounds, threshold} = state.metrics,
		maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft;

	if (threshold.max > maxPos) {
		if (maxPos < threshold.base) {
			state.metrics.threshold = {
				max: threshold.base,
				min: -Infinity
			};
		} else {
			state.metrics.threshold = {
				max: threshold.max = maxPos,
				min: threshold.min = maxPos - threshold.base
			};
		}
	}
};

const updateStatesAndBounds = function (props, state) {
	const
		{dataSize, overhang, updateStatesAndBounds: propUpdateStatesAndBounds} = props,
		{firstIndex, prevProps: {dataSize: prevDataSize}} = state,
		{dimensionToExtent, maxFirstIndex, primary, moreInfo} = state.metrics,
		numOfItems = Math.min(dataSize, dimensionToExtent * (Math.ceil(primary.clientSize / primary.gridSize) + overhang)),
		wasFirstIndexMax = ((maxFirstIndex < moreInfo.firstVisibleIndex - dimensionToExtent) && (firstIndex === maxFirstIndex)),
		dataSizeDiff = dataSize - prevDataSize;

	calculateScrollBounds(props, state);
	calculateMoreInfo(props, state);

	if (!(propUpdateStatesAndBounds && propUpdateStatesAndBounds({
		cbScrollTo: props.cbScrollTo,
		numOfItems,
		dataSize,
		moreInfo
	}))) {
		calculateFirstIndexAndThreshold(props, state, wasFirstIndexMax, dataSizeDiff);
	} else {
		state.firstIndex = firstIndex;
		calculateThreshold(state);
	}

	state.cc = [];
	state.metrics = {
		...state.metrics,
		maxFirstIndex: Math.ceil((dataSize - numOfItems) / dimensionToExtent) * dimensionToExtent
	};
	state.numOfItems = numOfItems;
};

export default defaultMatrics;
export {
	calculateMetrics,
	calculateMoreInfo,
	calculateThreshold,
	defaultMatrics,
	hasDataSizeChanged,
	hasMetricsChanged,
	updateStatesAndBounds
};
