import {platform} from '@enact/core/platform';

const useScrollPosition = (props, instances, context) => {
	const {type} = props;
	const {contentRef, uiChildContainerRef, virtualListBase} = instances;
	const {firstIndex} = virtualListBase;
	const {getScrollBounds, setFirstIndex, syncThreshold, updateMoreInfo} = context;

	// Functions

	function updateScrollPosition ({x, y}, rtl = props.rtl) {
		if (type === 'Native') {
			scrollToPosition(x, y, rtl);
		} else {
			setScrollPosition(x, y, rtl, x, y);
		}
	}

	// Native only
	function scrollToPosition (x, y, rtl = props.rtl) {
		if (uiChildContainerRef.current) {
			if (virtualListBase.current.isPrimaryDirectionVertical) {
				virtualListBase.current.scrollPositionTarget = y;
			} else {
				virtualListBase.current.scrollPositionTarget = x;
			}

			if (rtl) {
				x = (platform.ios || platform.safari) ? -x : virtualListBase.current.scrollBounds.maxLeft - x;
			}

			uiChildContainerRef.current.scrollTo(x, y);
		}
	}

	// JS only
	function setScrollPosition (x, y, rtl = props.rtl, targetX = 0, targetY = 0) {
		if (contentRef.current) {
			contentRef.current.style.transform = `translate3d(${rtl ? x : -x}px, -${y}px, 0)`;

			// The `x`, `y` as parameters in scrollToPosition() are the position when stopping scrolling.
			// But the `x`, `y` as parameters in setScrollPosition() are the position between current position and the position stopping scrolling.
			// To know the position when stopping scrolling here, `targetX` and `targetY` are passed and cached in `this.scrollPositionTarget`.
			if (virtualListBase.current.isPrimaryDirectionVertical) {
				virtualListBase.current.scrollPositionTarget = targetY;
			} else {
				virtualListBase.current.scrollPositionTarget = targetX;
			}

			didScroll(x, y);
		}
	}

	function didScroll (x, y) {
		const
			{dataSize, spacing, itemSizes} = props,
			{isPrimaryDirectionVertical, threshold, dimensionToExtent, maxFirstIndex, itemPositions} = virtualListBase.current,
			{clientSize, gridSize} = virtualListBase.current.primary,
			scrollBounds = getScrollBounds(),
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
		virtualListBase.current.scrollPosition = pos;
		updateMoreInfo(dataSize, pos);

		if (virtualListBase.current.shouldUpdateBounds || firstIndex !== newFirstIndex) {
			setFirstIndex(newFirstIndex);
		}
	}

	// Return

	return {
		didScroll,
		scrollToPosition,
		setScrollPosition,
		updateScrollPosition
	};
};

export default useScrollPosition;
export {
	useScrollPosition
};
