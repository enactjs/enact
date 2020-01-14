import Spotlight from '@enact/spotlight';
import {useEffect, useRef} from 'react';

const useScrollbar = (instance, props ,{
	isContent,
	uiRef
}) => {
	// const {

	// } = instance.current;
	// const {
	// 	focusableScrollbar
	// } = props;

	const variables = useRef({
		scrollbarProps: {
			cbAlertThumb: alertThumbAfterRendered,
			onNextScroll: onScrollbarButtonClick,
			onPrevScroll: onScrollbarButtonClick
		},
	});

	// useEffects

	useEffect(() => {

	}, []);

	// functions

	function isScrollButtonFocused () {
		const {horizontalScrollbarRef: h, verticalScrollbarRef: v} = uiRef.current;

		return (
			h.current && h.current.isOneOfScrollButtonsFocused() ||
			v.current && v.current.isOneOfScrollButtonsFocused()
		);
	}

	function onScrollbarButtonClick ({isPreviousScrollButton, isVerticalScrollBar}) {
		const
			bounds = uiRef.current.getScrollBounds(),
			direction = isPreviousScrollButton ? -1 : 1,
			pageDistance = direction * (isVerticalScrollBar ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier;

		uiRef.current.lastInputType = 'scrollbarButton';

		if (direction !== uiRef.current.wheelDirection) {
			uiRef.current.isScrollAnimationTargetAccumulated = false;
			uiRef.current.wheelDirection = direction;
		}

		uiRef.current.scrollToAccumulatedTarget(pageDistance, isVerticalScrollBar, props.overscrollEffectOn.scrollbarButton);
	}

	function focusOnScrollButton (scrollbarRef, isPreviousScrollButton) {
		if (scrollbarRef.current) {
			scrollbarRef.current.focusOnButton(isPreviousScrollButton);
		}
	}

	function scrollAndFocusScrollbarButton (direction) {
		if (uiRef.current) {
			const
				{direction: directionProp} = props,
				uiRefCurrent = uiRef.current,
				isRtl = uiRefCurrent.props.rtl,
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
						canScrollingVertically ? uiRefCurrent.verticalScrollbarRef : uiRefCurrent.horizontalScrollbarRef,
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

		if (!Spotlight.getPointerMode() && isContent(spotItem) && uiRef.current.isUpdatedScrollThumb) {
			alertThumb();
		}
	}

	return {
		isScrollButtonFocused,
		onScrollbarButtonClick,
		scrollAndFocusScrollbarButton,
		scrollbarProps: variables.current.scrollbarProps
	};
}

export {
	useScrollbar
};
