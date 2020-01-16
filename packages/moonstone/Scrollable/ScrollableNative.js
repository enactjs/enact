import classNames from 'classnames';
import {forward} from '@enact/core/handle';
import platform from '@enact/core/platform';
import {onWindowReady} from '@enact/core/snapshot';
import {clamp, Job} from '@enact/core/util';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import {constants, ScrollableBaseNative as UiScrollableBaseNative} from '@enact/ui/Scrollable/ScrollableNative';
import Spotlight, {getDirection} from '@enact/spotlight';
import {spottableClass} from '@enact/spotlight/Spottable';
import {getTargetByDirectionFromElement, getTargetByDirectionFromPosition} from '@enact/spotlight/src/target';
import {getRect, intersects} from '@enact/spotlight/src/utils';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import PropTypes from 'prop-types';
import React, {useContext, useEffect, useRef} from 'react';

import $L from '../internal/$L';
import {SharedState} from '../internal/SharedStateDecorator';

import Scrollbar from './Scrollbar';
import Skinnable from '../Skinnable';

import overscrollCss from './OverscrollEffect.module.less';
import scrollbarCss from './Scrollbar.module.less';

const
	{
		epsilon,
		isPageDown,
		isPageUp,
		overscrollTypeDone,
		overscrollTypeNone,
		overscrollTypeOnce,
		scrollWheelPageMultiplierForMaxPixel
	} = constants,
	overscrollRatioPrefix = '--scrollable-overscroll-ratio-',
	overscrollTimeout = 300,
	paginationPageMultiplier = 0.66,
	reverseDirections = {
		down: 'up',
		up: 'down'
	};

const navigableFilter = (elem) => {
	if (
		!Spotlight.getPointerMode() &&
		// ignore containers passed as their id
		typeof elem !== 'string' &&
		elem.classList.contains(scrollbarCss.scrollButton)
	) {
		return false;
	}
};

const configureSpotlightContainer = ({'data-spotlight-id': spotlightId, focusableScrollbar}) => {
	Spotlight.set(spotlightId, {
		navigableFilter: focusableScrollbar ? null : navigableFilter
	});
};

/*
 * Track the last position of the pointer to check if a list should scroll by
 * page up/down keys when the pointer is on a list without any focused node.
 * `keydown` event does not occur if there is no focus on the node and
 * its descendants, we add `keydown` handler to `document` also.
 */
const
	lastPointer = {x: 0, y: 0},
	pointerTracker = (ev) => {
		lastPointer.x = ev.clientX;
		lastPointer.y = ev.clientY;
	};

const
	// An app could have lists and/or scrollers more than one,
	// so we should test all of them when page up/down key is pressed.
	scrollables = new Map(),
	pageKeyHandler = (ev) => {
		const {keyCode} = ev;
		if (Spotlight.getPointerMode() && !Spotlight.getCurrent() && (isPageUp(keyCode) || isPageDown(keyCode))) {
			const
				{x, y} = lastPointer,
				elem = document.elementFromPoint(x, y);

			if (elem) {
				for (const [key, value] of scrollables) {
					if (value.contains(elem)) {
						/* To handle page keys in nested scrollable components,
						 * break the loop only when `scrollByPageOnPointerMode` returns `true`.
						 * This approach assumes that an inner scrollable component is
						 * mounted earlier than an outer scrollable component.
						 */
						if (key.scrollByPageOnPointerMode(ev)) {
							break;
						}
					}
				}
			}
		}
	};

onWindowReady(() => {
	document.addEventListener('mousemove', pointerTracker);
	document.addEventListener('keydown', pageKeyHandler);
});

const isIntersecting = (elem, container) => elem && intersects(getRect(container), getRect(elem));
const getIntersectingElement = (elem, container) => isIntersecting(elem, container) && elem;
const getTargetInViewByDirectionFromPosition = (direction, position, container) => {
	const target = getTargetByDirectionFromPosition(direction, position, Spotlight.getActiveContainer());
	return getIntersectingElement(target, container);
};

/**
 * A Moonstone-styled native component that provides horizontal and vertical scrollbars.
 *
 * @function ScrollableBaseNative
 * @memberof moonstone/ScrollableNative
 * @extends ui/Scrollable.ScrollableBaseNative
 * @ui
 * @private
 */
const ScrollableBaseNative = (props) => {
	const context = useContext(SharedState);

	// constructor (props)
	// Instance variables
	const variables = useRef({
		scrollbarProps: {
			cbAlertThumb: alertThumbAfterRendered,
			onNextScroll: onScrollbarButtonClick,
			onPrevScroll: onScrollbarButtonClick
		},
		animateOnFocus: false,

		// status
		isWheeling: false,

		// spotlight
		lastScrollPositionOnFocus: null,
		indexToFocus: null,
		nodeToFocus: null,
		pointToFocus: null,

		// voice control
		isVoiceControl: false,
		voiceControlDirection: 'vertical',
		overscrollJobs: {
			horizontal: {before: null, after: null},
			vertical: {before: null, after: null}
		}
	});

	const overscrollRefs = {
		horizontal: React.useRef(),
		vertical: React.useRef()
	};
	const childRef = React.useRef();
	const uiRef = React.useRef();

	const {
			childRenderer,
			'data-spotlight-container': spotlightContainer,
			'data-spotlight-container-disabled': spotlightContainerDisabled,
			'data-spotlight-id': spotlightId,
			focusableScrollbar,
			preventBubblingOnKeyDown,
			scrollDownAriaLabel,
			scrollLeftAriaLabel,
			scrollRightAriaLabel,
			scrollUpAriaLabel,
			...rest
		} = props,
		downButtonAriaLabel = scrollDownAriaLabel == null ? $L('scroll down') : scrollDownAriaLabel,
		upButtonAriaLabel = scrollUpAriaLabel == null ? $L('scroll up') : scrollUpAriaLabel,
		rightButtonAriaLabel = scrollRightAriaLabel == null ? $L('scroll right') : scrollRightAriaLabel,
		leftButtonAriaLabel = scrollLeftAriaLabel == null ? $L('scroll left') : scrollLeftAriaLabel;

	useEffect(() => {
		const pageKeyHandlerObj = {scrollByPageOnPointerMode};

		function createOverscrollJob (orientation, edge) {
			if (!variables.current.overscrollJobs[orientation][edge]) {
				// TODO : check side-effect about this binding
				// origin-code : `applyOverscrollEffect.bind(this)`
				variables.current.overscrollJobs[orientation][edge] = new Job(applyOverscrollEffect, overscrollTimeout);
			}
		}

		// Only intended to be used within componentDidMount, this method will fetch the last stored
		// scroll position from SharedState and scroll (without animation) to that position
		function restoreScrollPosition () {
			const {id} = props;
			if (id && context && context.get) {
				const scrollPosition = context.get(`${id}.scrollPosition`);
				if (scrollPosition) {
					uiRef.current.scrollTo({
						position: scrollPosition,
						animate: false
					});
				}
			}
		}

		// componentDidMount
		createOverscrollJob('horizontal', 'before');
		createOverscrollJob('horizontal', 'after');

		createOverscrollJob('vertical', 'before');
		createOverscrollJob('vertical', 'after');

		scrollables.set(pageKeyHandlerObj, uiRef.current.containerRef.current);

		restoreScrollPosition();

		// componentWillUnmount
		return () => {
			scrollables.delete(pageKeyHandlerObj);

			stopOverscrollJob('horizontal', 'before');
			stopOverscrollJob('horizontal', 'after');
			stopOverscrollJob('vertical', 'before');
			stopOverscrollJob('vertical', 'after');
		};
	}, []);	// TODO : Handle exhaustive-deps ESLint rule.

	useEffect(() => {
		// componentDidUpdate
		configureSpotlightContainer(props);
	}, [props['data-spotlight-id'], props.focusableScrollbar]);	// TODO : Handle exhaustive-deps ESLint rule.

	function isScrollButtonFocused () {
		const {horizontalScrollbarRef: h, verticalScrollbarRef: v} = uiRef.current;

		return (
			h.current && h.current.isOneOfScrollButtonsFocused() ||
			v.current && v.current.isOneOfScrollButtonsFocused()
		);
	}

	function onFlick ({direction}) {
		const bounds = uiRef.current.getScrollBounds();
		const focusedItem = Spotlight.getCurrent();

		if (focusedItem) {
			focusedItem.blur();
		}

		if ((
			direction === 'vertical' && uiRef.current.canScrollVertically(bounds) ||
			direction === 'horizontal' && uiRef.current.canScrollHorizontally(bounds)
		) && !props['data-spotlight-container-disabled']) {
			childRef.current.setContainerDisabled(true);
		}
	}

	function onMouseDown (ev) {
		if (isScrollButtonFocused()) {
			ev.preventDefault();
		}

		if (props['data-spotlight-container-disabled']) {
			ev.preventDefault();
		} else {
			childRef.current.setContainerDisabled(false);
		}
	}

	function onTouchStart () {
		const focusedItem = Spotlight.getCurrent();

		if (!Spotlight.isPaused() && focusedItem && !isScrollButtonFocused()) {
			focusedItem.blur();
		}
	}

	/*
	 * wheel event handler;
	 * - for horizontal scroll, supports wheel action on any children nodes since web engine cannot support this
	 * - for vertical scroll, supports wheel action on scrollbars only
	 */
	function onWheel (ev) {
		const
			overscrollEffectRequired = props.overscrollEffectOn.wheel,
			bounds = uiRef.current.getScrollBounds(),
			canScrollHorizontally = uiRef.current.canScrollHorizontally(bounds),
			canScrollVertically = uiRef.current.canScrollVertically(bounds),
			eventDeltaMode = ev.deltaMode,
			eventDelta = (-ev.wheelDeltaY || ev.deltaY);
		let
			delta = 0,
			needToHideThumb = false;

		if (typeof window !== 'undefined') {
			window.document.activeElement.blur();
		}

		uiRef.current.showThumb(bounds);

		// FIXME This routine is a temporary support for horizontal wheel scroll.
		// FIXME If web engine supports horizontal wheel, this routine should be refined or removed.
		if (canScrollVertically) { // This routine handles wheel events on scrollbars for vertical scroll.
			if (eventDelta < 0 && uiRef.current.scrollTop > 0 || eventDelta > 0 && uiRef.current.scrollTop < bounds.maxTop) {
				const {horizontalScrollbarRef, verticalScrollbarRef} = uiRef.current;

				if (!variables.current.isWheeling) {
					if (!props['data-spotlight-container-disabled']) {
						childRef.current.setContainerDisabled(true);
					}
					variables.current.isWheeling = true;
				}

				// Not to check if ev.target is a descendant of a wrapped component which may have a lot of nodes in it.
				if ((horizontalScrollbarRef.current && horizontalScrollbarRef.current.getContainerRef().current.contains(ev.target)) ||
					(verticalScrollbarRef.current && verticalScrollbarRef.current.getContainerRef().current.contains(ev.target))) {
					delta = uiRef.current.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientHeight * scrollWheelPageMultiplierForMaxPixel);
					needToHideThumb = !delta;

					ev.preventDefault();
				} else if (overscrollEffectRequired) {
					uiRef.current.checkAndApplyOverscrollEffect('vertical', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce);
				}

				ev.stopPropagation();
			} else {
				if (overscrollEffectRequired && (eventDelta < 0 && uiRef.current.scrollTop <= 0 || eventDelta > 0 && uiRef.current.scrollTop >= bounds.maxTop)) {
					uiRef.current.applyOverscrollEffect('vertical', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce, 1);
				}
				needToHideThumb = true;
			}
		} else if (canScrollHorizontally) { // this routine handles wheel events on any children for horizontal scroll.
			if (eventDelta < 0 && uiRef.current.scrollLeft > 0 || eventDelta > 0 && uiRef.current.scrollLeft < bounds.maxLeft) {
				if (!variables.current.isWheeling) {
					if (!props['data-spotlight-container-disabled']) {
						childRef.current.setContainerDisabled(true);
					}
					variables.current.isWheeling = true;
				}
				delta = uiRef.current.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientWidth * scrollWheelPageMultiplierForMaxPixel);
				needToHideThumb = !delta;

				ev.preventDefault();
				ev.stopPropagation();
			} else {
				if (overscrollEffectRequired && (eventDelta < 0 && uiRef.current.scrollLeft <= 0 || eventDelta > 0 && uiRef.current.scrollLeft >= bounds.maxLeft)) {
					uiRef.current.applyOverscrollEffect('horizontal', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce, 1);
				}
				needToHideThumb = true;
			}
		}

		if (delta !== 0) {
			/* prevent native scrolling feature for vertical direction */
			ev.preventDefault();
			const direction = Math.sign(delta);
			// Not to accumulate scroll position if wheel direction is different from hold direction
			if (direction !== uiRef.current.wheelDirection) {
				uiRef.current.isScrollAnimationTargetAccumulated = false;
				uiRef.current.wheelDirection = direction;
			}
			uiRef.current.scrollToAccumulatedTarget(delta, canScrollVertically, overscrollEffectRequired);
		}

		if (needToHideThumb) {
			uiRef.current.startHidingThumb();
		}
	}

	function start (animate) {
		if (!animate) {
			focusOnItem();
		}
	}

	function isContent (element) {
		return (element && uiRef.current && uiRef.current.childRefCurrent.containerRef.current.contains(element));
	}

	// event handlers for Spotlight support

	function startScrollOnFocus (pos) {
		if (pos) {
			const
				{top, left} = pos,
				bounds = uiRef.current.getScrollBounds(),
				scrollHorizontally = bounds.maxLeft > 0 && Math.abs(left - uiRef.current.scrollLeft) > epsilon,
				scrollVertically = bounds.maxTop > 0 && Math.abs(top - uiRef.current.scrollTop) > epsilon;

			if (scrollHorizontally || scrollVertically) {
				uiRef.current.start({
					targetX: left,
					targetY: top,
					animate: variables.current.animateOnFocus,
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
			if (uiRef.current.scrolling && lastPos) {
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

	function onFocus (ev) {
		if (!childRef.current) {
			// TODO : On initial load, `childRef.current` is null
			return;
		}

		const
			{isDragging} = uiRef.current,
			shouldPreventScrollByFocus = childRef.current.shouldPreventScrollByFocus ?
				childRef.current.shouldPreventScrollByFocus() :
				false;

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

	function scrollByPage (direction) {
		const
			{childRefCurrent, scrollTop} = uiRef.current,
			focusedItem = Spotlight.getCurrent(),
			bounds = uiRef.current.getScrollBounds(),
			isUp = direction === 'up',
			directionFactor = isUp ? -1 : 1,
			pageDistance = directionFactor * bounds.clientHeight * paginationPageMultiplier,
			scrollPossible = isUp ? scrollTop > 0 : bounds.maxTop - scrollTop > epsilon;

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
						y = bounds.maxTop - epsilon < scrollTop + pageDistance || epsilon > scrollTop + pageDistance ?
							contentNode.getBoundingClientRect()[isUp ? 'top' : 'bottom'] + yAdjust :
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

	function hasFocus () {
		let current = Spotlight.getCurrent();

		if (!current) {
			const activeContainerId = Spotlight.getActiveContainer();
			current = document.querySelector(`[data-spotlight-id="${activeContainerId}"]`);
		}

		return current && uiRef.current.containerRef.current.contains(current);
	}

	function checkAndApplyOverscrollEffectByDirection (direction) {
		const
			orientation = (direction === 'up' || direction === 'down') ? 'vertical' : 'horizontal',
			bounds = uiRef.current.getScrollBounds(),
			scrollability = orientation === 'vertical' ? uiRef.current.canScrollVertically(bounds) : uiRef.current.canScrollHorizontally(bounds);

		if (scrollability) {
			const
				isRtl = uiRef.current.props.rtl,
				edge = (direction === 'up' || !isRtl && direction === 'left' || isRtl && direction === 'right') ? 'before' : 'after';
			uiRef.current.checkAndApplyOverscrollEffect(orientation, edge, overscrollTypeOnce);
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

	function onKeyDown (ev) {
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
			} else if (!Spotlight.getPointerMode() && getDirection(keyCode)) {
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

	function scrollStopOnScroll () {
		if (!props['data-spotlight-container-disabled']) {
			childRef.current.setContainerDisabled(false);
		}
		focusOnItem();
		variables.current.lastScrollPositionOnFocus = null;
		variables.current.isWheeling = false;
		if (variables.current.isVoiceControl) {
			variables.current.isVoiceControl = false;
			updateFocusAfterVoiceControl();
		}
	}

	function focusOnItem () {
		if (variables.current.indexToFocus !== null && typeof childRef.current.focusByIndex === 'function') {
			childRef.current.focusByIndex(variables.current.indexToFocus);
			variables.current.indexToFocus = null;
		}
		if (variables.current.nodeToFocus !== null && typeof childRef.current.focusOnNode === 'function') {
			childRef.current.focusOnNode(variables.current.nodeToFocus);
			variables.current.nodeToFocus = null;
		}
		if (variables.current.pointToFocus !== null) {
			// no need to focus on pointer mode
			if (!Spotlight.getPointerMode()) {
				const {direction, x, y} = variables.current.pointToFocus;
				const position = {x, y};
				const {current: {containerRef: {current}}} = uiRef;
				const elemFromPoint = document.elementFromPoint(x, y);
				const target =
					elemFromPoint && elemFromPoint.closest && getIntersectingElement(elemFromPoint.closest(`.${spottableClass}`), current) ||
					getTargetInViewByDirectionFromPosition(direction, position, current) ||
					getTargetInViewByDirectionFromPosition(reverseDirections[direction], position, current);

				if (target) {
					Spotlight.focus(target);
				}
			}
			variables.current.pointToFocus = null;
		}
	}

	function scrollTo (opt) {
		variables.current.indexToFocus = (opt.focus && typeof opt.index === 'number') ? opt.index : null;
		variables.current.nodeToFocus = (opt.focus && opt.node instanceof Object && opt.node.nodeType === 1) ? opt.node : null;
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

	function handleResizeWindow () {
		const focusedItem = Spotlight.getCurrent();

		if (focusedItem) {
			focusedItem.blur();
		}
	}

	// Callback for scroller updates; calculate and, if needed, scroll to new position based on focused item.
	function handleScrollerUpdate () {
		if (uiRef.current.scrollToInfo === null) {
			const scrollHeight = uiRef.current.getScrollBounds().scrollHeight;
			if (scrollHeight !== uiRef.current.bounds.scrollHeight) {
				calculateAndScrollTo();
			}
		}

		// oddly, Scroller manages uiRef.current.bounds so if we don't update it here (it is also
		// updated in calculateAndScrollTo but we might not have made it to that point), it will be
		// out of date when we land back in this method next time.
		uiRef.current.bounds.scrollHeight = uiRef.current.getScrollBounds().scrollHeight;
	}

	function clearOverscrollEffect (orientation, edge) {
		variables.current.overscrollJobs[orientation][edge].startAfter(overscrollTimeout, orientation, edge, overscrollTypeNone, 0);
		uiRef.current.setOverscrollStatus(orientation, edge, overscrollTypeNone, 0);
	}

	function applyOverscrollEffect (orientation, edge, type, ratio) {
		const nodeRef = overscrollRefs[orientation].current;

		if (nodeRef) {
			nodeRef.style.setProperty(overscrollRatioPrefix + orientation + edge, ratio);

			if (type === overscrollTypeOnce) {
				variables.current.overscrollJobs[orientation][edge].start(orientation, edge, overscrollTypeDone, 0);
			}
		}
	}

	function stopOverscrollJob (orientation, edge) {
		const job = variables.current.overscrollJobs[orientation][edge];

		if (job) {
			job.stop();
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	function addEventListeners (childContainerRef) {
		if (childContainerRef.current && childContainerRef.current.addEventListener) {
			childContainerRef.current.addEventListener('focusin', onFocus);
			if (platform.webos) {
				childContainerRef.current.addEventListener('webOSVoice', onVoice);
				childContainerRef.current.setAttribute('data-webos-voice-intent', 'Scroll');
			}
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	function removeEventListeners (childContainerRef) {
		if (childContainerRef.current && childContainerRef.current.removeEventListener) {
			childContainerRef.current.removeEventListener('focusin', onFocus);
			if (platform.webos) {
				childContainerRef.current.removeEventListener('webOSVoice', onVoice);
				childContainerRef.current.removeAttribute('data-webos-voice-intent');
			}
		}
	}

	function updateFocusAfterVoiceControl () {
		const spotItem = Spotlight.getCurrent();
		if (spotItem && uiRef.current.containerRef.current.contains(spotItem)) {
			const
				viewportBounds = uiRef.current.containerRef.current.getBoundingClientRect(),
				spotItemBounds = spotItem.getBoundingClientRect(),
				nodes = Spotlight.getSpottableDescendants(uiRef.current.containerRef.current.dataset.spotlightId),
				first = variables.current.voiceControlDirection === 'vertical' ? 'top' : 'left',
				last = variables.current.voiceControlDirection === 'vertical' ? 'bottom' : 'right';

			if (spotItemBounds[last] < viewportBounds[first] || spotItemBounds[first] > viewportBounds[last]) {
				for (let i = 0; i < nodes.length; i++) {
					const nodeBounds = nodes[i].getBoundingClientRect();
					if (nodeBounds[first] > viewportBounds[first] && nodeBounds[last] < viewportBounds[last]) {
						Spotlight.focus(nodes[i]);
						break;
					}
				}
			}
		}
	}

	function isReachedEdge (scrollPos, ltrBound, rtlBound, isRtl = false) {
		const bound = isRtl ? rtlBound : ltrBound;
		return (bound === 0 && scrollPos === 0) || (bound > 0 && scrollPos >= bound - 1);
	}

	function onVoice (e) {
		const
			isHorizontal = props.direction === 'horizontal',
			isRtl = uiRef.current.props.rtl,
			{scrollTop, scrollLeft} = uiRef.current,
			{maxLeft, maxTop} = uiRef.current.getScrollBounds(),
			verticalDirection = ['up', 'down', 'top', 'bottom'],
			horizontalDirection = isRtl ? ['right', 'left', 'rightmost', 'leftmost'] : ['left', 'right', 'leftmost', 'rightmost'],
			movement = ['previous', 'next', 'first', 'last'];

		let
			scroll = e && e.detail && e.detail.scroll,
			index = movement.indexOf(scroll);

		if (index > -1) {
			scroll = isHorizontal ? horizontalDirection[index] : verticalDirection[index];
		}

		variables.current.voiceControlDirection = verticalDirection.includes(scroll) && 'vertical' || horizontalDirection.includes(scroll) && 'horizontal' || null;

		// Case 1. Invalid direction
		if (variables.current.voiceControlDirection === null) {
			variables.current.isVoiceControl = false;
		// Case 2. Cannot scroll
		} else if (
			(['up', 'top'].includes(scroll) && isReachedEdge(scrollTop, 0)) ||
			(['down', 'bottom'].includes(scroll) && isReachedEdge(scrollTop, maxTop)) ||
			(['left', 'leftmost'].includes(scroll) && isReachedEdge(scrollLeft, 0, maxLeft, isRtl)) ||
			(['right', 'rightmost'].includes(scroll) && isReachedEdge(scrollLeft, maxLeft, 0, isRtl))
		) {
			if (window.webOSVoiceReportActionResult) {
				window.webOSVoiceReportActionResult({voiceUi: {exception: 'alreadyCompleted'}});
				e.preventDefault();
			}
		// Case 3. Can scroll
		} else {
			variables.current.isVoiceControl = true;
			if (['up', 'down', 'left', 'right'].includes(scroll)) {
				const isPreviousScrollButton = (scroll === 'up') || (scroll === 'left' && !isRtl) || (scroll === 'right' && isRtl);
				onScrollbarButtonClick({isPreviousScrollButton, isVerticalScrollBar: verticalDirection.includes(scroll)});
			} else { // ['top', 'bottom', 'leftmost', 'rightmost'].includes(scroll)
				uiRef.current.scrollTo({align: verticalDirection.includes(scroll) && scroll || (scroll === 'leftmost' && isRtl || scroll === 'rightmost' && !isRtl) && 'right' || 'left'});
			}
			e.preventDefault();
		}
	}

	function handleScroll (ev) {
		const {scrollLeft: x, scrollTop: y} = ev;
		const {id} = props;
		forward('onScroll', ev, props);
		if (id && context && context.set) {
			context.set(ev, props);
			context.set(`${id}.scrollPosition`, {x, y});
		}
	}

	// render
	return (
		<UiScrollableBaseNative
			noScrollByDrag={!platform.touchscreen}
			{...rest}
			addEventListeners={addEventListeners}
			applyOverscrollEffect={applyOverscrollEffect}
			clearOverscrollEffect={clearOverscrollEffect}
			handleResizeWindow={handleResizeWindow}
			onFlick={onFlick}
			onKeyDown={onKeyDown}
			onMouseDown={onMouseDown}
			onScroll={handleScroll}
			onWheel={onWheel}
			ref={uiRef}
			removeEventListeners={removeEventListeners}
			scrollStopOnScroll={scrollStopOnScroll}
			scrollTo={scrollTo}
			start={start}
			containerRenderer={({ // eslint-disable-line react/jsx-no-bind
				childComponentProps,
				childWrapper: ChildWrapper,
				childWrapperProps: {className: contentClassName, ...restChildWrapperProps},
				className,
				componentCss,
				containerRef: uiContainerRef,
				horizontalScrollbarProps,
				initChildRef: initUiChildRef,
				isHorizontalScrollbarVisible,
				isVerticalScrollbarVisible,
				rtl,
				// TODO : change name "scrollToInContainer"
				scrollTo: scrollToInContainer,
				style,
				verticalScrollbarProps
			}) => (
				<div
					className={classNames(className, overscrollCss.scrollable)}
					data-spotlight-container={spotlightContainer}
					data-spotlight-container-disabled={spotlightContainerDisabled}
					data-spotlight-id={spotlightId}
					onTouchStart={onTouchStart}
					ref={uiContainerRef}
					style={style}
				>
					<div className={classNames(componentCss.container, overscrollCss.overscrollFrame, overscrollCss.vertical, isHorizontalScrollbarVisible ? overscrollCss.horizontalScrollbarVisible : null)} ref={overscrollRefs.vertical}>
						<ChildWrapper className={classNames(contentClassName, overscrollCss.overscrollFrame, overscrollCss.horizontal)} ref={overscrollRefs.horizontal} {...restChildWrapperProps}>
							{childRenderer({
								...childComponentProps,
								cbScrollTo: scrollToInContainer,
								className: componentCss.scrollableFill,
								initUiChildRef,
								isHorizontalScrollbarVisible,
								isVerticalScrollbarVisible,
								onUpdate: handleScrollerUpdate,
								ref: childRef,
								rtl,
								scrollAndFocusScrollbarButton: scrollAndFocusScrollbarButton,
								spotlightId
							})}
						</ChildWrapper>
						{isVerticalScrollbarVisible ?
							<Scrollbar
								{...verticalScrollbarProps}
								{...variables.current.scrollbarProps}
								disabled={!isVerticalScrollbarVisible}
								focusableScrollButtons={focusableScrollbar}
								nextButtonAriaLabel={downButtonAriaLabel}
								onKeyDownButton={onKeyDown}
								preventBubblingOnKeyDown={preventBubblingOnKeyDown}
								previousButtonAriaLabel={upButtonAriaLabel}
								rtl={rtl}
							/> :
							null
						}
					</div>
					{isHorizontalScrollbarVisible ?
						<Scrollbar
							{...horizontalScrollbarProps}
							{...variables.current.scrollbarProps}
							corner={isVerticalScrollbarVisible}
							disabled={!isHorizontalScrollbarVisible}
							focusableScrollButtons={focusableScrollbar}
							nextButtonAriaLabel={rightButtonAriaLabel}
							onKeyDownButton={onKeyDown}
							preventBubblingOnKeyDown={preventBubblingOnKeyDown}
							previousButtonAriaLabel={leftButtonAriaLabel}
							rtl={rtl}
						/> :
						null
					}
				</div>
			)}
		/>
	);
};

ScrollableBaseNative.displayName = 'ScrollableNative';
ScrollableBaseNative.propTypes = /** @lends moonstone/ScrollableNative.ScrollableNative.prototype */ {
	/**
	 * Render function.
	 *
	 * @type {Function}
	 * @required
	 * @private
	 */
	childRenderer: PropTypes.func.isRequired,

	/**
	 * This is set to `true` by SpotlightContainerDecorator
	 *
	 * @type {Boolean}
	 * @private
	 */
	'data-spotlight-container': PropTypes.bool,

	/**
	 * `false` if the content of the list or the scroller could get focus
	 *
	 * @type {Boolean}
	 * @default false
	 * @private
	 */
	'data-spotlight-container-disabled': PropTypes.bool,

	/**
	 * This is passed onto the wrapped component to allow
	 * it to customize the spotlight container for its use case.
	 *
	 * @type {String}
	 * @private
	 */
	'data-spotlight-id': PropTypes.string,

	/**
	 * Direction of the list or the scroller.
	 * `'both'` could be only used for[Scroller]{@link moonstone/Scroller.Scroller}.
	 *
	 * Valid values are:
	 * * `'both'`,
	 * * `'horizontal'`, and
	 * * `'vertical'`.
	 *
	 * @type {String}
	 * @private
	 */
	direction: PropTypes.oneOf(['both', 'horizontal', 'vertical']),

	/**
	 * Allows 5-way navigation to the scrollbar controls. By default, 5-way will
	 * not move focus to the scrollbar controls.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	focusableScrollbar: PropTypes.bool,

	/**
	 * A unique identifier for the scrollable component.
	 *
	 * When specified and when the scrollable is within a SharedStateDecorator, the scroll
	 * position will be shared and restored on mount if the component is destroyed and
	 * recreated.
	 *
	 * @type {String}
	 * @public
	 */
	id: PropTypes.string,

	/**
	 * Specifies overscroll effects shows on which type of inputs.
	 *
	 * @type {Object}
	 * @default {
	 *	arrowKey: false,
	 *	drag: false,
	 *	pageKey: false,
	 *	scrollbarButton: false,
	 *	wheel: true
	 * }
	 * @private
	 */
	overscrollEffectOn: PropTypes.shape({
		arrowKey: PropTypes.bool,
		drag: PropTypes.bool,
		pageKey: PropTypes.bool,
		scrollbarButton: PropTypes.bool,
		wheel: PropTypes.bool
	}),

	/**
	 * Specifies preventing keydown events from bubbling up to applications.
	 * Valid values are `'none'`, and `'programmatic'`.
	 *
	 * When it is `'none'`, every keydown event is bubbled.
	 * When it is `'programmatic'`, an event bubbling is not allowed for a keydown input
	 * which invokes programmatic spotlight moving.
	 *
	 * @type {String}
	 * @default 'none'
	 * @private
	 */
	preventBubblingOnKeyDown: PropTypes.oneOf(['none', 'programmatic']),

	/**
	 * Sets the hint string read when focusing the next button in the vertical scroll bar.
	 *
	 * @type {String}
	 * @default $L('scroll down')
	 * @public
	 */
	scrollDownAriaLabel: PropTypes.string,

	/**
	 * Sets the hint string read when focusing the previous button in the horizontal scroll bar.
	 *
	 * @type {String}
	 * @default $L('scroll left')
	 * @public
	 */
	scrollLeftAriaLabel: PropTypes.string,

	/**
	 * Sets the hint string read when focusing the next button in the horizontal scroll bar.
	 *
	 * @type {String}
	 * @default $L('scroll right')
	 * @public
	 */
	scrollRightAriaLabel: PropTypes.string,

	/**
	 * Sets the hint string read when focusing the previous button in the vertical scroll bar.
	 *
	 * @type {String}
	 * @default $L('scroll up')
	 * @public
	 */
	scrollUpAriaLabel: PropTypes.string
};

ScrollableBaseNative.defaultProps = {
	'data-spotlight-container-disabled': false,
	focusableScrollbar: false,
	overscrollEffectOn: {
		arrowKey: false,
		drag: false,
		pageKey: false,
		scrollbarButton: false,
		wheel: true
	},
	preventBubblingOnKeyDown: 'none'
};

/**
 * A Moonstone-styled component that provides horizontal and vertical scrollbars.
 *
 * @class ScrollableNative
 * @memberof moonstone/ScrollableNative
 * @mixes spotlight/SpotlightContainerDecorator
 * @extends moonstone/Scrollable.ScrollableBaseNative
 * @ui
 * @private
 */
const ScrollableNative = Skinnable(
	SpotlightContainerDecorator(
		{
			overflow: true,
			preserveId: true,
			restrict: 'self-first'
		},
		I18nContextDecorator(
			{rtlProp: 'rtl'},
			ScrollableBaseNative
		)
	)
);

export default ScrollableNative;
export {
	ScrollableBaseNative,
	ScrollableNative
};
