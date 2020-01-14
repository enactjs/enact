import {useMonitorEvents} from './useMonitorEvents';

const useKey = ({}, {} ,{
	checkAndApplyOverscrollEffectByDirection,
	hasFocus,
	isContent,
	uiRef
}) => {
	useMonitorEvents({}, {} ,{uiRef});

	function handleKeyDown (ev) {
		const {keyCode, repeat, target} = ev;

		forward('onKeyDown', ev, props);

		if (isPageUp(keyCode) || isPageDown(keyCode)) {
			ev.preventDefault();
		}

		variables.current.animateOnFocus = true;

		if (!repeat && hasFocus()) {
			const {overscrollEffectOn} = props;
			let direction = null;

			if (isPageUp(keyCode) || isPageDown(keyCode)) {
				if (props.direction === 'vertical' || props.direction === 'both') {
					direction = isPageUp(keyCode) ? 'up' : 'down';

					if (isContent(target)) {
						ev.stopPropagation();
						scrollByPage(direction);
					}
					if (overscrollEffectOn.pageKey) {
						checkAndApplyOverscrollEffectByDirection(direction);
					}
				}
			} else if (getDirection(keyCode)) {
				const element = Spotlight.getCurrent();

				uiRef.current.lastInputType = 'arrowKey';

				direction = getDirection(keyCode);
				if (overscrollEffectOn.arrowKey && !(element ? getTargetByDirectionFromElement(direction, element) : null)) {
					const {horizontalScrollbarRef, verticalScrollbarRef} = uiRef.current;

					if (!(horizontalScrollbarRef.current && horizontalScrollbarRef.current.getContainerRef().current.contains(element)) &&
						!(verticalScrollbarRef.current && verticalScrollbarRef.current.getContainerRef().current.contains(element))) {
						checkAndApplyOverscrollEffectByDirection(direction);
					}
				}
			}
		}
	}

	function scrollByPage (direction) {
		const
			{childRefCurrent, scrollTop} = uiRef.current,
			focusedItem = Spotlight.getCurrent(),
			bounds = uiRef.current.getScrollBounds(),
			isUp = direction === 'up',
			directionFactor = isUp ? -1 : 1,
			pageDistance = directionFactor * bounds.clientHeight * paginationPageMultiplier,
			scrollPossible = isUp ? scrollTop > 0 : bounds.maxTop > scrollTop;

		uiRef.current.lastInputType = 'pageKey';

		if (directionFactor !== uiRef.current.wheelDirection) {
			uiRef.current.isScrollAnimationTargetAccumulated = false;
			uiRef.current.wheelDirection = directionFactor;
		}

		if (scrollPossible) {
			if (focusedItem) {
				const contentNode = childRefCurrent.containerRef.current;
				// Should do nothing when focusedItem is paging control button of Scrollbar
				if (contentNode.contains(focusedItem)) {
					const
						contentRect = contentNode.getBoundingClientRect(),
						clientRect = focusedItem.getBoundingClientRect(),
						yAdjust = isUp ? 1 : -1,
						x = clamp(contentRect.left, contentRect.right, (clientRect.right + clientRect.left) / 2),
						y = bounds.maxTop <= scrollTop + pageDistance || 0 >= scrollTop + pageDistance ?
							contentRect[isUp ? 'top' : 'bottom'] + yAdjust :
							clamp(contentRect.top, contentRect.bottom, (clientRect.bottom + clientRect.top) / 2);

					focusedItem.blur();
					if (!props['data-spotlight-container-disabled']) {
						childRef.current.setContainerDisabled(true);
					}
					variables.current.pointToFocus = {direction, x, y};
				}
			} else {
				variables.current.pointToFocus = {direction, x: lastPointer.x, y: lastPointer.y};
			}

			uiRef.current.scrollToAccumulatedTarget(pageDistance, true, props.overscrollEffectOn.pageKey);
		}
	}

	function scrollByPageOnPointerMode (ev) {
		const {keyCode, repeat} = ev;
		forward('onKeyDown', ev, props);
		ev.preventDefault();

		variables.current.animateOnFocus = true;

		if (!repeat && (props.direction === 'vertical' || props.direction === 'both')) {
			const direction = isPageUp(keyCode) ? 'up' : 'down';

			scrollByPage(direction);
			if (props.overscrollEffectOn.pageKey) { /* if the spotlight focus will not move */
				checkAndApplyOverscrollEffectByDirection(direction);
			}

			return true; // means consumed
		}

		return false; // means to be propagated
	}

	return {
		handleKeyDown,
		scrollByPageOnPointerMode
	};
}

export {
	useKey
};
