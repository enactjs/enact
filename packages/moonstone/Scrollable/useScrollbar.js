import Spotlight from '@enact/spotlight';

const paginationPageMultiplier = 0.66;

const useScrollbar = (props, instances, context) => {
	const {horizontalScrollbarRef, uiScrollAdapter, verticalScrollbarRef} = instances;
	const {isContent} = context;

	const scrollbarProps = {
		cbAlertThumb: alertThumbAfterRendered,
		onNextScroll: onScrollbarButtonClick,
		onPrevScroll: onScrollbarButtonClick
	};

	// Functions

	function isScrollButtonFocused () {
		return (
			horizontalScrollbarRef.current && horizontalScrollbarRef.current.isOneOfScrollButtonsFocused() ||
			verticalScrollbarRef.current && verticalScrollbarRef.current.isOneOfScrollButtonsFocused()
		);
	}

	function onScrollbarButtonClick ({isPreviousScrollButton, isVerticalScrollBar}) {
		const
			{wheelDirection} = uiScrollAdapter.current,
			bounds = uiScrollAdapter.current.getScrollBounds(),
			direction = isPreviousScrollButton ? -1 : 1,
			pageDistance = direction * (isVerticalScrollBar ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier;

		uiScrollAdapter.current.lastInputType = 'scrollbarButton';

		if (direction !== wheelDirection) {
			uiScrollAdapter.current.isScrollAnimationTargetAccumulated = false;
			uiScrollAdapter.current.wheelDirection = direction;
		}

		uiScrollAdapter.current.scrollToAccumulatedTarget(pageDistance, isVerticalScrollBar, props.overscrollEffectOn.scrollbarButton);
	}

	function focusOnScrollButton (scrollbarRef, isPreviousScrollButton) {
		if (scrollbarRef.current) {
			scrollbarRef.current.focusOnButton(isPreviousScrollButton);
		}
	}

	function scrollAndFocusScrollbarButton (direction) {
		if (uiScrollAdapter.current) {
			const
				{rtl} = uiScrollAdapter.current,
				isPreviousScrollButton = direction === 'up' || (rtl ? direction === 'right' : direction === 'left'),
				isHorizontalDirection = direction === 'left' || direction === 'right',
				isVerticalDirection = direction === 'up' || direction === 'down',
				canScrollHorizontally = isHorizontalDirection && (props.direction === 'horizontal' || props.direction === 'both'),
				canScrollingVertically = isVerticalDirection && (props.direction === 'vertical' || props.direction === 'both');

			if (canScrollHorizontally || canScrollingVertically) {
				onScrollbarButtonClick({
					isPreviousScrollButton,
					isVerticalScrollBar: canScrollingVertically
				});

				if (props.focusableScrollbar) {
					focusOnScrollButton(
						canScrollingVertically ? verticalScrollbarRef : horizontalScrollbarRef,
						isPreviousScrollButton
					);
				}
			}
		}
	}

	function alertThumb () {
		const bounds = uiScrollAdapter.current.getScrollBounds();

		uiScrollAdapter.current.showThumb(bounds);
		uiScrollAdapter.current.startHidingThumb();
	}

	function alertThumbAfterRendered () {
		const spotItem = Spotlight.getCurrent();

		if (!Spotlight.getPointerMode() && isContent(spotItem) && uiScrollAdapter.current.isUpdatedScrollThumb) {
			alertThumb();
		}
	}

	// Return

	return {
		alertThumb,
		isScrollButtonFocused,
		onScrollbarButtonClick,
		scrollAndFocusScrollbarButton,
		scrollbarProps
	};
};

export default useScrollbar;
export {
	useScrollbar
};
