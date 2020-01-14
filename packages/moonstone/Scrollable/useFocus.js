import Spotlight, {} from '@enact/spotlight';
import {useEffect, useRef} from 'react';

const useFocus = (instance, props ,{
	childRef,
	uiRef
}) => {
	// const {

	// } = instance.current;
	// const {

	// } = props;

	const variables = useRef({
		isWheeling: false
	});

	// useEffects

	useEffect(() => {

	}, []);

	// functions

	function startScrollOnFocus (pos) {
		if (pos) {
			const
				{top, left} = pos,
				bounds = uiRef.current.getScrollBounds(),
				scrollHorizontally = bounds.maxLeft > 0 && left !== uiRef.current.scrollLeft,
				scrollVertically = bounds.maxTop > 0 && top !== uiRef.current.scrollTop;

			if (scrollHorizontally || scrollVertically) {
				uiRef.current.start({
					targetX: left,
					targetY: top,
					animate: (animationDuration > 0) && variables.current.animateOnFocus,
					overscrollEffect: props.overscrollEffectOn[uiRef.current.lastInputType] && (!childRef.current.shouldPreventOverscrollEffect || !childRef.current.shouldPreventOverscrollEffect())
				});
				variables.current.lastScrollPositionOnFocus = pos;
			}
		}
	}

	function calculateAndScrollTo () {
		const
			spotItem = Spotlight.getCurrent(),
			positionFn = childRef.current.calculatePositionOnFocus,
			containerNode = uiRef.current.childRefCurrent.containerRef.current;

		if (spotItem && positionFn && containerNode && containerNode.contains(spotItem)) {
			const lastPos = variables.current.lastScrollPositionOnFocus;
			let pos;

			// If scroll animation is ongoing, we need to pass last target position to
			// determine correct scroll position.
			if (uiRef.current.animator.isAnimating() && lastPos) {
				const containerRect = getRect(containerNode);
				const itemRect = getRect(spotItem);
				let scrollPosition;

				if (props.direction === 'horizontal' || props.direction === 'both' && !(itemRect.left >= containerRect.left && itemRect.right <= containerRect.right)) {
					scrollPosition = lastPos.left;
				} else if (props.direction === 'vertical' || props.direction === 'both' && !(itemRect.top >= containerRect.top && itemRect.bottom <= containerRect.bottom)) {
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
		const
			{isDragging} = uiRef.current,
			shouldPreventScrollByFocus = childRef.current.shouldPreventScrollByFocus ?
				childRef.current.shouldPreventScrollByFocus() :
				false;

		if (variables.current.isWheeling) {
			uiRef.current.stop();
			variables.current.animateOnFocus = false;
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

	return {
		handleFocus,
		hasFocus
	};
}

export {
	useFocus
};
