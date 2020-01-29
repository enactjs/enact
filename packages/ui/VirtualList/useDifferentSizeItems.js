const useDifferentSizeItems = (props, instances, context) => {
	const {itemContainerRef, virtualListBase} = instances;
	const {firstIndex} = virtualListBase;
	const {getItemBottomPosition, getItemTopPositionFromPreviousItemBottomPosition, numOfItems, setContainerSize, updateMoreInfo, updateScrollBoundsWithItemPositions} = context;

	// Functions

	// For individually sized item
	function applyItemPositionToDOMElement (index) {
		const
			{direction, rtl} = props,
			{itemPositions} = virtualListBase.current,
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
			{maxFirstIndex} = virtualListBase.current,
			numOfUpperLine = Math.floor(overhang / 2);

		virtualListBase.current.threshold.min = firstIndex === 0 ? -Infinity : getItemBottomPosition(firstIndex + numOfUpperLine);
		virtualListBase.current.threshold.max = firstIndex === maxFirstIndex ? Infinity : getItemBottomPosition(firstIndex + (numOfUpperLine + 1));
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
			updateMoreInfo(dataSize, virtualListBase.current.scrollPosition);
		}
	}

	// For individually sized item
	function calculateAndCacheItemPosition (index) {
		const {itemSizes} = props;

		if (!virtualListBase.current.itemPositions[index] && itemSizes[index]) {
			const
				{spacing} = props,
				position = getItemTopPositionFromPreviousItemBottomPosition(index, spacing);

			virtualListBase.current.itemPositions[index] = {position};
		}
	}

	// Return

	return {
		adjustItemPositionWithItemSize,
		calculateAndCacheItemPosition
	};
};

export default useDifferentSizeItems;
export {
	useDifferentSizeItems
};
