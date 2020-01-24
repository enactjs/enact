import Spotlight from '@enact/spotlight';

const paginationPageMultiplier = 0.66;

const useScrollbar = (props, instances, dependencies) => {
	/*
	 * Dependencies
	 */

	const {direction: directionProp, focusableScrollbar, overscrollEffectOn} = props;
	const {uiScrollableAdapter} = instances;
	const {isContent} = dependencies;

	const scrollbarProps = {
		cbAlertThumb: alertThumbAfterRendered,
		onNextScroll: onScrollbarButtonClick,
		onPrevScroll: onScrollbarButtonClick
	};

	/*
	 * Functions
	 */

	function isScrollButtonFocused () {
		const {horizontalScrollbarRef: hRef, verticalScrollbarRef: vRef} = uiScrollableAdapter.current;

		return (
			hRef.current && hRef.current.isOneOfScrollButtonsFocused() ||
			vRef.current && vRef.current.isOneOfScrollButtonsFocused()
		);
	}

	function onScrollbarButtonClick ({isPreviousScrollButton, isVerticalScrollBar}) {
		const
			{wheelDirection} = uiScrollableAdapter.current,
			bounds = uiScrollableAdapter.current.getScrollBounds(),
			direction = isPreviousScrollButton ? -1 : 1,
			pageDistance = direction * (isVerticalScrollBar ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier;

		uiScrollableAdapter.current.lastInputType = 'scrollbarButton';

		if (direction !== wheelDirection) {
			uiScrollableAdapter.current.isScrollAnimationTargetAccumulated = false;
			uiScrollableAdapter.current.wheelDirection = direction;
		}

		uiScrollableAdapter.current.scrollToAccumulatedTarget(pageDistance, isVerticalScrollBar, overscrollEffectOn.scrollbarButton);
	}

	function focusOnScrollButton (scrollbarRef, isPreviousScrollButton) {
		if (scrollbarRef.current) {
			scrollbarRef.current.focusOnButton(isPreviousScrollButton);
		}
	}

	function scrollAndFocusScrollbarButton (direction) {
		// TBD
		// if (uiRef.current) {
			const
				{hRef, rtl, vRef} = uiScrollableAdapter.current,
				isPreviousScrollButton = direction === 'up' || (rtl ? direction === 'right' : direction === 'left'),
				isHorizontalDirection = direction === 'left' || direction === 'right',
				isVerticalDirection = direction === 'up' || direction === 'down',
				canScrollHorizontally = isHorizontalDirection && (directionProp === 'horizontal' || directionProp === 'both'),
				canScrollingVertically = isVerticalDirection && (directionProp === 'vertical' || directionProp === 'both');

			if (canScrollHorizontally || canScrollingVertically) {
				onScrollbarButtonClick({
					isPreviousScrollButton,
					isVerticalScrollBar: canScrollingVertically
				});

				if (focusableScrollbar) {
					focusOnScrollButton(
						canScrollingVertically ? vRef : hRef,
						isPreviousScrollButton
					);
				}
			}
		// }
	}

	function alertThumb () {
		const bounds = uiScrollableAdapter.current.getScrollBounds();

		uiScrollableAdapter.current.showThumb(bounds);
		uiScrollableAdapter.current.startHidingThumb();
	}

	function alertThumbAfterRendered () {
		const
			{isUpdatedScrollThumb} = uiScrollableAdapter.current,
			spotItem = Spotlight.getCurrent();

		if (!Spotlight.getPointerMode() && isContent(spotItem) && isUpdatedScrollThumb) {
			alertThumb();
		}
	}

	/*
	 * Return
	 */

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
