import Spotlight from '@enact/spotlight';
import {constants} from '@enact/ui/Scrollable/Scrollable';
import utilDOM from '@enact/ui/Scrollable/utilDOM';
import {useRef} from 'react';

const {overscrollTypeOnce, scrollWheelPageMultiplierForMaxPixel} = constants;

const useEventWheel = (props, instances, context) => {
	const {childAdapter, horizontalScrollbarRef, uiScrollableAdapter, verticalScrollbarRef} = instances;
	const {isScrollButtonFocused, type} = context;

	// Mutable value

	const variables = useRef({isWheeling: false});

	// Functions

	function handleWheel ({delta}) {
		const focusedItem = Spotlight.getCurrent();

		if (focusedItem && !isScrollButtonFocused()) {
			focusedItem.blur();
		}

		if (delta !== 0) {
			variables.current.isWheeling = true;
			if (!props['data-spotlight-container-disabled']) {
				childAdapter.current.setContainerDisabled(true);
			}
		}
	}

	/*
	 * wheel event handler;
	 * - for horizontal scroll, supports wheel action on any children nodes since web engine cannot support this
	 * - for vertical scroll, supports wheel action on scrollbars only
	 */
	function handleWheelNative (ev) {
		const
			overscrollEffectRequired = props.overscrollEffectOn.wheel,
			bounds = uiScrollableAdapter.current.getScrollBounds(),
			canScrollHorizontally = uiScrollableAdapter.current.canScrollHorizontally(bounds),
			canScrollVertically = uiScrollableAdapter.current.canScrollVertically(bounds),
			eventDeltaMode = ev.deltaMode,
			eventDelta = (-ev.wheelDeltaY || ev.deltaY);
		let
			delta = 0,
			needToHideThumb = false;

		if (typeof window !== 'undefined') {
			window.document.activeElement.blur();
		}

		uiScrollableAdapter.current.showThumb(bounds);

		// FIXME This routine is a temporary support for horizontal wheel scroll.
		// FIXME If web engine supports horizontal wheel, this routine should be refined or removed.
		if (canScrollVertically) { // This routine handles wheel events on scrollbars for vertical scroll.
			if (eventDelta < 0 && uiScrollableAdapter.current.scrollTop > 0 || eventDelta > 0 && uiScrollableAdapter.current.scrollTop < bounds.maxTop) {
				if (!variables.current.isWheeling) {
					if (!props['data-spotlight-container-disabled']) {
						childAdapter.current.setContainerDisabled(true);
					}
					variables.current.isWheeling = true;
				}

				// Not to check if ev.target is a descendant of a wrapped component which may have a lot of nodes in it.
				if ((horizontalScrollbarRef.current && utilDOM.containsDangerously(horizontalScrollbarRef.current.uiScrollbarContainer, ev.target)) ||
					(verticalScrollbarRef.current && utilDOM.containsDangerously(verticalScrollbarRef.current.uiScrollbarContainer, ev.target))) {
					delta = uiScrollableAdapter.current.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientHeight * scrollWheelPageMultiplierForMaxPixel);
					needToHideThumb = !delta;

					ev.preventDefault();
				} else if (overscrollEffectRequired) {
					uiScrollableAdapter.current.checkAndApplyOverscrollEffect('vertical', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce);
				}

				ev.stopPropagation();
			} else {
				if (overscrollEffectRequired && (eventDelta < 0 && uiScrollableAdapter.current.scrollTop <= 0 || eventDelta > 0 && uiScrollableAdapter.current.scrollTop >= bounds.maxTop)) {
					uiScrollableAdapter.current.applyOverscrollEffect('vertical', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce, 1);
				}

				needToHideThumb = true;
			}
		} else if (canScrollHorizontally) { // this routine handles wheel events on any children for horizontal scroll.
			if (eventDelta < 0 && uiScrollableAdapter.current.scrollLeft > 0 || eventDelta > 0 && uiScrollableAdapter.current.scrollLeft < bounds.maxLeft) {
				if (!variables.current.isWheeling) {
					if (!props['data-spotlight-container-disabled']) {
						childAdapter.current.setContainerDisabled(true);
					}

					variables.current.isWheeling = true;
				}

				delta = uiScrollableAdapter.current.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientWidth * scrollWheelPageMultiplierForMaxPixel);
				needToHideThumb = !delta;

				ev.preventDefault();
				ev.stopPropagation();
			} else {
				if (overscrollEffectRequired && (eventDelta < 0 && uiScrollableAdapter.current.scrollLeft <= 0 || eventDelta > 0 && uiScrollableAdapter.current.scrollLeft >= bounds.maxLeft)) {
					uiScrollableAdapter.current.applyOverscrollEffect('horizontal', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce, 1);
				}

				needToHideThumb = true;
			}
		}

		if (delta !== 0) {
			/* prevent native scrolling feature for vertical direction */
			ev.preventDefault();

			const direction = Math.sign(delta);

			// Not to accumulate scroll position if wheel direction is different from hold direction
			if (direction !== uiScrollableAdapter.current.wheelDirection) {
				uiScrollableAdapter.current.isScrollAnimationTargetAccumulated = false;
				uiScrollableAdapter.current.wheelDirection = direction;
			}

			uiScrollableAdapter.current.scrollToAccumulatedTarget(delta, canScrollVertically, overscrollEffectRequired);
		}

		if (needToHideThumb) {
			uiScrollableAdapter.current.startHidingThumb();
		}
	}

	// Return

	return {
		handleWheel: type === 'JS' ? handleWheel : handleWheelNative,
		isWheeling: variables.current.isWheeling
	};
};

export default useEventWheel;
export {
	useEventWheel
};
