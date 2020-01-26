import {forward} from '@enact/core/handle';
import {clamp} from '@enact/core/util';
import Spotlight, {getDirection} from '@enact/spotlight';
import {getTargetByDirectionFromElement} from '@enact/spotlight/src/target';
import {constants} from '@enact/ui/Scrollable/Scrollable';
import useDOM from '@enact/ui/Scrollable/useDOM'
const
	{epsilon, isPageDown, isPageUp} = constants,
	paginationPageMultiplier = 0.66,
	lastPointer = {x: 0, y: 0};

const useEventKey = (props, instances, dependencies) => {
	/*
	 * Dependencies
	 */

	const {direction: directionProp, overscrollEffectOn} = props;
	const {childAdapter, horizontalScrollbarRef, spottable, uiScrollableAdapter, verticalScrollbarRef} = instances;
	const {checkAndApplyOverscrollEffectByDirection, hasFocus, isContent, type} = dependencies;

	/*
	 * Functions
	 */

	function handleKeyDown (ev) {
		const {keyCode, repeat, target} = ev;

		forward('onKeyDown', ev, props);

		if (isPageUp(keyCode) || isPageDown(keyCode)) {
			ev.preventDefault();
		}

		spottable.current.animateOnFocus = true;

		if (!repeat && hasFocus()) {
			let direction = null;

			if (isPageUp(keyCode) || isPageDown(keyCode)) {
				if (directionProp === 'vertical' || directionProp === 'both') {
					direction = isPageUp(keyCode) ? 'up' : 'down';

					if (isContent(target)) {
						ev.stopPropagation();
						scrollByPage(direction);
					}
					if (overscrollEffectOn.pageKey) {
						checkAndApplyOverscrollEffectByDirection(direction);
					}
				}
			} else if (getDirection(keyCode) && (type === 'JS' || type === 'Native' && !Spotlight.getPointerMode())) {
				const element = Spotlight.getCurrent();

				uiScrollableAdapter.current.lastInputType = 'arrowKey';

				direction = getDirection(keyCode);
				if (overscrollEffectOn.arrowKey && !(element ? getTargetByDirectionFromElement(direction, element) : null)) {
					if (!(horizontalScrollbarRef.current && useDOM().containsDangerously(horizontalScrollbarRef.current.getContainerRef, element)) &&
						!(verticalScrollbarRef.current && useDOM().containsDangerously(verticalScrollbarRef.current.getContainerRef(), element))) {
						checkAndApplyOverscrollEffectByDirection(direction);
					}
				}
			}
		}
	}

	function scrollByPage (direction) {
		const
			{uiChildAdapter, scrollTop} = uiScrollableAdapter.current,
			focusedItem = Spotlight.getCurrent(),
			bounds = uiScrollableAdapter.current.getScrollBounds(),
			isUp = direction === 'up',
			directionFactor = isUp ? -1 : 1,
			pageDistance = directionFactor * bounds.clientHeight * paginationPageMultiplier;
		let scrollPossible = false;

		if (type === 'JS') {
			scrollPossible = isUp ? scrollTop > 0 : bounds.maxTop > scrollTop;
		} else {
			scrollPossible = isUp ? scrollTop > 0 : bounds.maxTop - scrollTop > epsilon;
		}

		uiScrollableAdapter.current.lastInputType = 'pageKey';

		if (directionFactor !== uiScrollableAdapter.current.wheelDirection) {
			uiScrollableAdapter.current.isScrollAnimationTargetAccumulated = false;
			uiScrollableAdapter.current.wheelDirection = directionFactor;
		}

		if (scrollPossible) {
			if (focusedItem) {
				const contentNode = uiChildAdapter.current.childContainerRef.current;
				// Should do nothing when focusedItem is paging control button of Scrollbar
						checkAndApplyOverscrollEffectByDirection(direction);
				if (useDOM().containsDangerously(contentNode, focusedItem)) {
					const
						contentRect = contentNode.getBoundingClientRect(),
						clientRect = focusedItem.getBoundingClientRect(),
						yAdjust = isUp ? 1 : -1,
						x = clamp(contentRect.left, contentRect.right, (clientRect.right + clientRect.left) / 2);
					let y = 0;
					if (type === 'JS') {
						y = bounds.maxTop <= scrollTop + pageDistance || 0 >= scrollTop + pageDistance ?
							contentRect[isUp ? 'top' : 'bottom'] + yAdjust :
							clamp(contentRect.top, contentRect.bottom, (clientRect.bottom + clientRect.top) / 2);
					} else {
						y = bounds.maxTop - epsilon < scrollTop + pageDistance || epsilon > scrollTop + pageDistance ?
							contentNode.getBoundingClientRect()[isUp ? 'top' : 'bottom'] + yAdjust :
							clamp(contentRect.top, contentRect.bottom, (clientRect.bottom + clientRect.top) / 2);
					}

					focusedItem.blur();
					if (!props['data-spotlight-container-disabled']) {
						childAdapter.current.setContainerDisabled(true);
					}
					spottable.current.pointToFocus = {direction, x, y};
				}
			} else {
				spottable.current.pointToFocus = {direction, x: lastPointer.x, y: lastPointer.y};
			}

			uiScrollableAdapter.current.scrollToAccumulatedTarget(pageDistance, true, overscrollEffectOn.pageKey);
		}
	}

	function scrollByPageOnPointerMode (ev) {
		const {keyCode, repeat} = ev;

		forward('onKeyDown', ev, props);
		ev.preventDefault();

		spottable.current.animateOnFocus = true;

		if (!repeat && (directionProp === 'vertical' || directionProp === 'both')) {
			const direction = isPageUp(keyCode) ? 'up' : 'down';

			scrollByPage(direction);
			if (overscrollEffectOn.pageKey) { /* if the spotlight focus will not move */
				checkAndApplyOverscrollEffectByDirection(direction);
			}

			return true; // means consumed
		}

		return false; // means to be propagated
	}

	/*
	 * Return
	 */

	return {
		handleKeyDown,
		lastPointer,
		scrollByPageOnPointerMode
	};
};

export default useEventKey;
export {
	useEventKey
};
