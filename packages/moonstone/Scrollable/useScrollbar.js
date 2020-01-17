import Spotlight from '@enact/spotlight';

const paginationPageMultiplier = 0.66;

const useScrollbar = (props, instances, dependencies) => {
	/*
	 * Dependencies
	 */

	const {direction: directionProp, focusableScrollbar, overscrollEffectOn} = props;
	const {uiRef} = instances;
	const {isContent} = dependencies;
	const {
		horizontalScrollbarRef: hRef,
		isUpdatedScrollThumb,
		scrollToAccumulatedTarget,
		verticalScrollbarRef: vRef,
		wheelDirection
	} = (uiRef && uiRef.current || {});
	const isRtl = uiRef.current ? uiRef.current.props.rtl : false;

	const scrollbarProps = {
		cbAlertThumb: alertThumbAfterRendered,
		onNextScroll: onScrollbarButtonClick,
		onPrevScroll: onScrollbarButtonClick
	};

	/*
	 * Functions
	 */

	function isScrollButtonFocused () {
		return (
			hRef.current && hRef.current.isOneOfScrollButtonsFocused() ||
			vRef.current && vRef.current.isOneOfScrollButtonsFocused()
		);
	}

	function onScrollbarButtonClick ({isPreviousScrollButton, isVerticalScrollBar}) {
		const
			bounds = uiRef.current.getScrollBounds(),
			direction = isPreviousScrollButton ? -1 : 1,
			pageDistance = direction * (isVerticalScrollBar ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier;

		uiRef.current.lastInputType = 'scrollbarButton';

		if (direction !== wheelDirection) {
			uiRef.current.isScrollAnimationTargetAccumulated = false;
			uiRef.current.wheelDirection = direction;
		}

		scrollToAccumulatedTarget(pageDistance, isVerticalScrollBar, overscrollEffectOn.scrollbarButton);
	}

	function focusOnScrollButton (scrollbarRef, isPreviousScrollButton) {
		if (scrollbarRef.current) {
			scrollbarRef.current.focusOnButton(isPreviousScrollButton);
		}
	}

	function scrollAndFocusScrollbarButton (direction) {
		if (uiRef.current) {
			const
				isPreviousScrollButton = direction === 'up' || (isRtl ? direction === 'right' : direction === 'left'),
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
		}
	}

	function alertThumb () {
		const bounds = uiRef.current.getScrollBounds();

		uiRef.current.showThumb(bounds);
		uiRef.current.startHidingThumb();
	}

	function alertThumbAfterRendered () {
		const spotItem = Spotlight.getCurrent();

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
