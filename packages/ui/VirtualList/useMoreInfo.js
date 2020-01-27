import {useEffect, useRef} from 'react';

const useMoreInfo = (props, instances, context) => {
	const {virtualListBase} = instances;
	const {firstIndex} = virtualListBase;
	const {numOfItems} = context;

	// Instance variables

	const variables = useRef({
		moreInfo: {
			firstVisibleIndex: null,
			lastVisibleIndex: null
		}
	});

	// Functions

	function getMoreInfo () {
		return variables.current.moreInfo;
	}

	function updateMoreInfo (dataSize, primaryPosition) {
		const
			{moreInfo} = variables.current,
			{dimensionToExtent} = virtualListBase.current,
			{itemSize, gridSize, clientSize} = virtualListBase.current.primary;

		if (dataSize <= 0) {
			moreInfo.firstVisibleIndex = null;
			moreInfo.lastVisibleIndex = null;
		} else if (props.itemSizes) {
			const {isPrimaryDirectionVertical, scrollBounds: {clientWidth, clientHeight}, scrollPosition} = virtualListBase.current;
			const size = isPrimaryDirectionVertical ? clientHeight : clientWidth;

			let firstVisibleIndex = null, lastVisibleIndex = null;

			for (let i = firstIndex; i < firstIndex + numOfItems; i++) {
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

	// Return

	return {
		getMoreInfo,
		updateMoreInfo
	};
};

export default useMoreInfo;
export {
	useMoreInfo
};
