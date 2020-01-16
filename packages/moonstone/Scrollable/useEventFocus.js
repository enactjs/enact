import Spotlight from '@enact/spotlight';
import {constants} from '@enact/ui/Scrollable/ScrollableNative';

const {epsilon} = constants;

const useEventFocus = (props, instances, dependencies) => {
	/*
	 * Dependencies
	 */

	const {direction, overscrollEffectOn} = props;
	const {childRef, spottable, uiRef} = instances;
	const {isWheeling, type} = dependencies;

	/*
	 * Functions
	 */

	function startScrollOnFocus (pos) {
		if (pos) {
			const
				{top, left} = pos,
				bounds = uiRef.current.getScrollBounds();

			if (type === 'JS') {
				const
					scrollHorizontally = bounds.maxLeft > 0 && left !== uiRef.current.scrollLeft,
					scrollVertically = bounds.maxTop > 0 && top !== uiRef.current.scrollTop;

				if (scrollHorizontally || scrollVertically) {
					uiRef.current.start({
						targetX: left,
						targetY: top,
						animate: (animationDuration > 0) && spottable.current.animateOnFocus,
						overscrollEffect: overscrollEffectOn[uiRef.current.lastInputType] && (!childRef.current.shouldPreventOverscrollEffect || !childRef.current.shouldPreventOverscrollEffect())
					});
					spottable.current.lastScrollPositionOnFocus = pos;
				}
			} else {
				const
					scrollHorizontally = bounds.maxLeft > 0 && Math.abs(left - this.uiRef.current.scrollLeft) > epsilon,
					scrollVertically = bounds.maxTop > 0 && Math.abs(top - this.uiRef.current.scrollTop) > epsilon;

				if (scrollHorizontally || scrollVertically) {
					this.uiRef.current.start({
						targetX: left,
						targetY: top,
						animate: this.animateOnFocus,
						overscrollEffect: this.props.overscrollEffectOn[this.uiRef.current.lastInputType] && (!this.childRef.current.shouldPreventOverscrollEffect || !this.childRef.current.shouldPreventOverscrollEffect())
					});
					this.lastScrollPositionOnFocus = pos;
				}
			}
		}
	}

	function calculateAndScrollTo () {
		const
			spotItem = Spotlight.getCurrent(),
			positionFn = childRef.current.calculatePositionOnFocus,
			containerNode = uiRef.current.childRefCurrent.containerRef.current;

		if (spotItem && positionFn && containerNode && containerNode.contains(spotItem)) {
			const lastPos = spottable.current.lastScrollPositionOnFocus;
			let pos;

			// If scroll animation is ongoing, we need to pass last target position to
			// determine correct scroll position.
			if (lastPos & (
				type === 'JS' && uiRef.current.animator.isAnimating() ||
				type === 'Native' && this.uiRef.current.scrolling
			)) {
				const containerRect = getRect(containerNode);
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
						previousScrollHeight: uiRef.current.bounds.scrollHeight,
						scrollTop: uiRef.current.scrollTop
					};
				pos = positionFn({item: spotItem, scrollInfo});
			}

			if (pos && (pos.left !== uiRef.current.scrollLeft || pos.top !== uiRef.current.scrollTop)) {
				startScrollOnFocus(pos);
			}

			// update `scrollHeight`
			uiRef.current.bounds.scrollHeight = uiRef.current.getScrollBounds().scrollHeight;
		}
	}

	function handleFocus (ev) {
		if (!childRef.current) {
			// TODO : On initial load, `childRef.current` is null
			return;
		}

		const
			{isDragging} = uiRef.current,
			shouldPreventScrollByFocus = childRef.current.shouldPreventScrollByFocus ?
				childRef.current.shouldPreventScrollByFocus() :
				false;

		if (type === 'JS' && isWheeling) {
			uiRef.current.stop();
			spottable.current.animateOnFocus = false;
		}

		if (!Spotlight.getPointerMode()) {
			alertThumb();
		}

		if (!(shouldPreventScrollByFocus || Spotlight.getPointerMode() || isDragging)) {
			const
				item = ev.target,
				spotItem = Spotlight.getCurrent();

			if (item && item === spotItem) {
				calculateAndScrollTo();
			}
		} else if (childRef.current.setLastFocusedNode) {
			childRef.current.setLastFocusedNode(ev.target);
		}
	}

	function hasFocus () {
		let current = Spotlight.getCurrent();

		if (!current) {
			// TODO : Remove.
			// const spotlightId = Spotlight.getActiveContainer();
			current = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);
		}

		return current && uiRef.current && uiRef.current.containerRef.current.contains(current);
	}

	/*
	 * Return
	 */

	return {
		handleFocus,
		hasFocus
	};
};

export default useEventFocus;
export {
	useEventFocus
};
