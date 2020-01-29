const useVirtualMetrics = (props, instances, context) => {
	const {virtualListBase} = instances;
	const {cbCalculateAndCacheItemPosition} = context;

	// Functions

	function getGridPosition (index) {
		const
			{dataSize, itemSizes} = props,
			{dimensionToExtent, itemPositions, secondary} = virtualListBase.current,
			secondaryPosition = (index % dimensionToExtent) * secondary.gridSize,
			extent = Math.floor(index / dimensionToExtent);
		let primaryPosition;
		const primary = virtualListBase.current.primary;

		if (itemSizes && typeof itemSizes[index] !== 'undefined' && dataSize > index) {
			const firstIndexInExtent = extent * dimensionToExtent;

			if (!itemPositions[firstIndexInExtent]) {
				// Cache individually sized item positions
				for (let i = itemPositions.length; i <= index; i++) {
					cbCalculateAndCacheItemPosition.fn(i);
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
			itemPosition = virtualListBase.current.itemPositions[index],
			itemSize = props.itemSizes[index];

		if (itemPosition && (itemSize || itemSize === 0)) {
			return itemPosition.position + itemSize;
		} else {
			return index * virtualListBase.current.primary.gridSize - props.spacing;
		}
	}

	// For individually sized item
	function getItemTopPositionFromPreviousItemBottomPosition (index, spacing) {
		return index === 0 ? 0 : getItemBottomPosition(index - 1) + spacing;
	}

	function getItemPosition (index, stickTo = 'start') {
		const
			position = getGridPosition(index);
		let offset = 0;
		const primary = virtualListBase.current.primary;

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
		return (virtualListBase.current.isPrimaryDirectionVertical ? {left: secondaryPosition, top: primaryPosition} : {left: primaryPosition, top: secondaryPosition});
	}

	function getXY (primaryPosition, secondaryPosition) {
		return (virtualListBase.current.isPrimaryDirectionVertical ? {x: secondaryPosition, y: primaryPosition} : {x: primaryPosition, y: secondaryPosition});
	}

	// Return

	return {
		getGridPosition,
		getItemBottomPosition,
		getItemPosition,
		getXY,
		gridPositionToItemPosition,
		getItemTopPositionFromPreviousItemBottomPosition
	};
};

export default useVirtualMetrics;
export {
	useVirtualMetrics
};
