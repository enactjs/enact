import Spotlight from '@enact/spotlight';
import {getRect} from '@enact/spotlight/src/utils';
import {constants} from '@enact/ui/Scrollable/Scrollable';
import useDOM from '@enact/ui/Scrollable/useDOM';

const {animationDuration, epsilon} = constants;

const useEventFocus = (props, instances, dependencies) => {
	/*
	 * Dependencies
	 */

	const {'data-spotlight-id': spotlightId, direction, overscrollEffectOn} = props;
	const {childAdapter, spottable, scrollableContainerRef, uiScrollableAdapter} = instances;
	const {alertThumb, isWheeling, type} = dependencies;

	/*
	 * Functions
	 */

	function startScrollOnFocus (pos) {
		if (pos) {
			const
				{top, left} = pos,
				bounds = uiScrollableAdapter.current.getScrollBounds();

			if (type === 'JS') {
				const
					scrollHorizontally = bounds.maxLeft > 0 && left !== uiScrollableAdapter.current.scrollLeft,
					scrollVertically = bounds.maxTop > 0 && top !== uiScrollableAdapter.current.scrollTop;

				if (scrollHorizontally || scrollVertically) {
					uiScrollableAdapter.current.start({
						targetX: left,
						targetY: top,
						animate: (animationDuration > 0) && spottable.current.animateOnFocus,
						overscrollEffect: overscrollEffectOn[uiScrollableAdapter.current.lastInputType] && (!childAdapter.current.shouldPreventOverscrollEffect || !childAdapter.current.shouldPreventOverscrollEffect())
					});
					spottable.current.lastScrollPositionOnFocus = pos;
				}
			} else {
				const
					scrollHorizontally = bounds.maxLeft > 0 && Math.abs(left - uiScrollableAdapter.current.scrollLeft) > epsilon,
					scrollVertically = bounds.maxTop > 0 && Math.abs(top - uiScrollableAdapter.current.scrollTop) > epsilon;

				if (scrollHorizontally || scrollVertically) {
					uiScrollableAdapter.current.start({
						targetX: left,
						targetY: top,
						animate: spottable.current.animateOnFocus,
						overscrollEffect: props.overscrollEffectOn[uiScrollableAdapter.current.lastInputType] && (!childAdapter.current.shouldPreventOverscrollEffect || !childAdapter.current.shouldPreventOverscrollEffect())
					});
					spottable.current.lastScrollPositionOnFocus = pos;
				}
			}
		}
	}

	function calculateAndScrollTo () {
		const
			spotItem = Spotlight.getCurrent(),
			positionFn = childAdapter.current.calculatePositionOnFocus,
			childContainerNode = uiScrollableAdapter.current.uiChildAdapter.current.childContainerRef.current;

		if (spotItem && positionFn && useDOM().containsDangerously(childContainerNode, spotItem)) {
			const lastPos = spottable.current.lastScrollPositionOnFocus;
			let pos;

			// If scroll animation is ongoing, we need to pass last target position to
			// determine correct scroll position.
			if (lastPos & (
				type === 'JS' && uiScrollableAdapter.current.animator.isAnimating() ||
				type === 'Native' && uiScrollableAdapter.current.scrolling
			)) {
				const
					containerRect = getRect(childContainerNode),
					const itemRect = getRect(spotItem);
				let scrollPosition;

				if (direction === 'horizontal' || direction === 'both' && !(itemRect.left >= containerRect.left && itemRect.right <= containerRect.right)) {
					scrollPosition = lastPos.left;
				} else if (direction === 'vertical' || direction === 'both' && !(itemRect.top >= containerRect.top && itemRect.bottom <= containerRect.bottom)) {
					scrollPosition = lastPos.top;
				}

				pos = positionFn({item: spotItem, scrollPosition});
			} else {
				// scrollInfo passes in current `scrollHeight` and `scrollTop` before calculations
				const
					scrollInfo = {
						previousScrollHeight: uiScrollableAdapter.current.bounds.scrollHeight,
						scrollTop: uiScrollableAdapter.current.scrollTop
					};

				pos = positionFn({item: spotItem, scrollInfo});
			}

			if (pos && (pos.left !== uiScrollableAdapter.current.scrollLeft || pos.top !== uiScrollableAdapter.current.scrollTop)) {
				startScrollOnFocus(pos);
			}

			// update `scrollHeight`
			uiScrollableAdapter.current.bounds.scrollHeight = uiScrollableAdapter.current.getScrollBounds().scrollHeight;
		}
	}

	function handleFocus (ev) {

		const shouldPreventScrollByFocus = childAdapter.current.shouldPreventScrollByFocus ?
			childAdapter.current.shouldPreventScrollByFocus() :
			false;

		if (type === 'JS' && isWheeling) {
			uiScrollableAdapter.current.stop();
			spottable.current.animateOnFocus = false;
		}

		if (!Spotlight.getPointerMode()) {
			alertThumb();
		}

		if (!(shouldPreventScrollByFocus || Spotlight.getPointerMode() || uiScrollableAdapter.current)) {
			const
				item = ev.target,
				spotItem = Spotlight.getCurrent();

			if (item && item === spotItem) {
				calculateAndScrollTo();
			}
		} else if (childAdapter.current.setLastFocusedNode) {
			childAdapter.current.setLastFocusedNode(ev.target);
		}
	}

	function hasFocus () {
		let current = Spotlight.getCurrent();

		if (!current) {
			// TODO : Remove.
			// const spotlightId = Spotlight.getActiveContainer();
			current = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);
		}

		return useDOM().containsDangerously(scrollableContainerRef, current);
	}

	/*
	 * Return
	 */

	return {
		calculateAndScrollTo,
		handleFocus,
		hasFocus
	};
};

export default useEventFocus;
export {
	useEventFocus
};
