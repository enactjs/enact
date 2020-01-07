/**
 * Provides Moonstone-themed scrollable components and behaviors.
 *
 * @module moonstone/Scrollable
 * @exports Scrollable
 * @private
 */

import classNames from 'classnames';
import handle, {forward} from '@enact/core/handle';
import platform from '@enact/core/platform';
import {onWindowReady} from '@enact/core/snapshot';
import {clamp, Job} from '@enact/core/util';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import {constants, ScrollableBase as UiScrollableBase} from '@enact/ui/Scrollable';
import Spotlight, {getDirection} from '@enact/spotlight';
import {spottableClass} from '@enact/spotlight/Spottable';
import {getTargetByDirectionFromElement, getTargetByDirectionFromPosition} from '@enact/spotlight/src/target';
import {getRect, intersects} from '@enact/spotlight/src/utils';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import PropTypes from 'prop-types';
import React, {useContext, useDebugValue, useRef} from 'react';

import $L from '../internal/$L';
import {SharedState} from '../internal/SharedStateDecorator';

import Scrollbar from './Scrollbar';
import Skinnable from '../Skinnable';

import overscrollCss from './OverscrollEffect.module.less';
import scrollbarCss from './Scrollbar.module.less';

const
	{
		animationDuration,
		isPageDown,
		isPageUp,
		overscrollTypeDone,
		overscrollTypeNone,
		overscrollTypeOnce,
		paginationPageMultiplier
	} = constants,
	overscrollRatioPrefix = '--scrollable-overscroll-ratio-',
	overscrollTimeout = 300,
	reverseDirections = {
		down: 'up',
		up: 'down'
	};

/**
 * The name of a custom attribute which indicates the index of an item in
 * [VirtualList]{@link moonstone/VirtualList.VirtualList} or
 * [VirtualGridList]{@link moonstone/VirtualList.VirtualGridList}.
 *
 * @constant dataIndexAttribute
 * @memberof moonstone/Scrollable
 * @type {String}
 * @private
 */
const dataIndexAttribute = 'data-index';

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
 * A Moonstone-styled component that provides horizontal and vertical scrollbars.
 *
 * @function ScrollableBase
 * @memberof moonstone/Scrollable
 * @extends ui/Scrollable.ScrollableBase
 * @ui
 * @public
 */
const ScrollableBase = (props) => {
	useDebugValue('Scrollable');
	const context = useContext(SharedState);

	// constructor
	// Instance variables
	let variables = useRef({
		scrollbarProps: {
			cbAlertThumb: alertThumbAfterRendered,
			onNextScroll: onScrollbarButtonClick,
			onPrevScroll: onScrollbarButtonClick
		},
		overscrollRefs: {
			horizontal: React.createRef(),
			vertical: React.createRef()
		},
		childRef: React.createRef(),
		uiRef: React.createRef(),
		animateOnFocus: false
	});
	configureSpotlightContainer(props);

	// Destructuring for render
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
	} = props;

	// TODO : Change to useEffect
	function componentDidMount () {
		createOverscrollJob('horizontal', 'before');
		createOverscrollJob('horizontal', 'after');

		createOverscrollJob('vertical', 'before');
		createOverscrollJob('vertical', 'after');

		restoreScrollPosition();
		scrollables.set(this, variables.current.uiRef.current.containerRef.current);
	}

	// TODO : Change to useEffect
	function componentDidUpdate (prevProps) {
		if (prevProps['data-spotlight-id'] !== props['data-spotlight-id'] ||
				prevProps.focusableScrollbar !== props.focusableScrollbar) {
			configureSpotlightContainer(props);
		}
	}

	// TODO : Change to useEffect
	function componentWillUnmount () {
		scrollables.delete(this);

		stopOverscrollJob('horizontal', 'before');
		stopOverscrollJob('horizontal', 'after');
		stopOverscrollJob('vertical', 'before');
		stopOverscrollJob('vertical', 'after');
	}

	// status
	let isWheeling = false;

	// spotlight
	let lastScrollPositionOnFocus = null;
	let indexToFocus = null;
	let nodeToFocus = null;
	let pointToFocus = null;

	// voice control
	let isVoiceControl = false;
	let voiceControlDirection = 'vertical';

	// overscroll
	let overscrollJobs = {
		horizontal: {before: null, after: null},
		vertical: {before: null, after: null}
	};

	// Only intended to be used within componentDidMount, this method will fetch the last stored
	// scroll position from SharedState and scroll (without animation) to that position
	function restoreScrollPosition () {
		const {id} = props;
		if (id && context && context.get) {
			const scrollPosition = context.get(`${id}.scrollPosition`);
			if (scrollPosition) {
				variables.current.uiRef.current.scrollTo({
					position: scrollPosition,
					animate: false
				});
			}
		}
	}

	function isScrollButtonFocused () {
		const {horizontalScrollbarRef: h, verticalScrollbarRef: v} = variables.current.uiRef.current;

		return (
			h.current && h.current.isOneOfScrollButtonsFocused() ||
			v.current && v.current.isOneOfScrollButtonsFocused()
		);
	}

	function onFlick ({direction}) {
		const bounds = variables.current.uiRef.current.getScrollBounds();
		const focusedItem = Spotlight.getCurrent();

		if (focusedItem) {
			focusedItem.blur();
		}

		if ((
			direction === 'vertical' && variables.current.uiRef.current.canScrollVertically(bounds) ||
			direction === 'horizontal' && variables.current.uiRef.current.canScrollHorizontally(bounds)
		) && !props['data-spotlight-container-disabled']) {
			variables.current.childRef.current.setContainerDisabled(true);
		}
	}

	function onMouseDown (ev) {
		if (isScrollButtonFocused()) {
			ev.preventDefault();
		}

		if (props['data-spotlight-container-disabled']) {
			ev.preventDefault();
		}
	}

	function onTouchStart () {
		const focusedItem = Spotlight.getCurrent();

		if (!Spotlight.isPaused() && focusedItem && !isScrollButtonFocused()) {
			focusedItem.blur();
		}
	}

	function onWheel ({delta}) {
		const focusedItem = Spotlight.getCurrent();

		if (focusedItem && !isScrollButtonFocused()) {
			focusedItem.blur();
		}

		if (delta !== 0) {
			isWheeling = true;
			if (!props['data-spotlight-container-disabled']) {
				variables.current.childRef.current.setContainerDisabled(true);
			}
		}
	}

	function isContent (element) {
		return (element && variables.current.uiRef.current && variables.current.uiRef.current.childRefCurrent.containerRef.current.contains(element));
	}

	function startScrollOnFocus (pos) {
		if (pos) {
			const
				{top, left} = pos,
				bounds = variables.current.uiRef.current.getScrollBounds(),
				scrollHorizontally = bounds.maxLeft > 0 && left !== variables.current.uiRef.current.scrollLeft,
				scrollVertically = bounds.maxTop > 0 && top !== variables.current.uiRef.current.scrollTop;

			if (scrollHorizontally || scrollVertically) {
				variables.current.uiRef.current.start({
					targetX: left,
					targetY: top,
					animate: (animationDuration > 0) && variables.current.animateOnFocus,
					overscrollEffect: props.overscrollEffectOn[variables.current.uiRef.current.lastInputType] && (!variables.current.childRef.current.shouldPreventOverscrollEffect || !variables.current.childRef.current.shouldPreventOverscrollEffect())
				});
				lastScrollPositionOnFocus = pos;
			}
		}
	}

	function calculateAndScrollTo () {
		const
			spotItem = Spotlight.getCurrent(),
			positionFn = variables.current.childRef.current.calculatePositionOnFocus,
			containerNode = variables.current.uiRef.current.childRefCurrent.containerRef.current;

		if (spotItem && positionFn && containerNode && containerNode.contains(spotItem)) {
			const lastPos = lastScrollPositionOnFocus;
			let pos;

			// If scroll animation is ongoing, we need to pass last target position to
			// determine correct scroll position.
			if (variables.current.uiRef.current.animator.isAnimating() && lastPos) {
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
						previousScrollHeight: variables.current.uiRef.current.bounds.scrollHeight,
						scrollTop: variables.current.uiRef.current.scrollTop
					};
				pos = positionFn({item: spotItem, scrollInfo});
			}

			if (pos && (pos.left !== variables.current.uiRef.current.scrollLeft || pos.top !== variables.current.uiRef.current.scrollTop)) {
				startScrollOnFocus(pos);
			}

			// update `scrollHeight`
			variables.current.uiRef.current.bounds.scrollHeight = variables.current.uiRef.current.getScrollBounds().scrollHeight;
		}
	}

	function onFocus (ev) {
		const
			{isDragging} = variables.current.uiRef.current,
			shouldPreventScrollByFocus = variables.current.childRef.current.shouldPreventScrollByFocus ?
				variables.current.childRef.current.shouldPreventScrollByFocus() :
				false;

		if (isWheeling) {
			variables.current.uiRef.current.stop();
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
		} else if (variables.current.childRef.current.setLastFocusedNode) {
			variables.current.childRef.current.setLastFocusedNode(ev.target);
		}
	}

	function scrollByPage (direction) {
		const
			{childRefCurrent, scrollTop} = variables.current.uiRef.current,
			focusedItem = Spotlight.getCurrent(),
			bounds = variables.current.uiRef.current.getScrollBounds(),
			isUp = direction === 'up',
			directionFactor = isUp ? -1 : 1,
			pageDistance = directionFactor * bounds.clientHeight * paginationPageMultiplier,
			scrollPossible = isUp ? scrollTop > 0 : bounds.maxTop > scrollTop;

		variables.current.uiRef.current.lastInputType = 'pageKey';

		if (directionFactor !== variables.current.uiRef.current.wheelDirection) {
			variables.current.uiRef.current.isScrollAnimationTargetAccumulated = false;
			variables.current.uiRef.current.wheelDirection = directionFactor;
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
						y = bounds.maxTop <= scrollTop + pageDistance || 0 >= scrollTop + pageDistance ?
							contentRect[isUp ? 'top' : 'bottom'] + yAdjust :
							clamp(contentRect.top, contentRect.bottom, (clientRect.bottom + clientRect.top) / 2);

					focusedItem.blur();
					if (!props['data-spotlight-container-disabled']) {
						variables.current.childRef.current.setContainerDisabled(true);
					}
					pointToFocus = {direction, x, y};
				}
			} else {
				pointToFocus = {direction, x: lastPointer.x, y: lastPointer.y};
			}

			variables.current.uiRef.current.scrollToAccumulatedTarget(pageDistance, true, props.overscrollEffectOn.pageKey);
		}
	}

	function hasFocus () {
		let current = Spotlight.getCurrent();

		if (!current) {
			// TODO : Remove.
			// const spotlightId = Spotlight.getActiveContainer();
			current = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);
		}

		return current && variables.current.uiRef.current && variables.current.uiRef.current.containerRef.current.contains(current);
	}

	function checkAndApplyOverscrollEffectByDirection (direction) {
		const
			orientation = (direction === 'up' || direction === 'down') ? 'vertical' : 'horizontal',
			bounds = variables.current.uiRef.current.getScrollBounds(),
			scrollability = orientation === 'vertical' ? variables.current.uiRef.current.canScrollVertically(bounds) : variables.current.uiRef.current.canScrollHorizontally(bounds);

		if (scrollability) {
			const
				isRtl = variables.current.uiRef.current.props.rtl,
				edge = (direction === 'up' || !isRtl && direction === 'left' || isRtl && direction === 'right') ? 'before' : 'after';
			variables.current.uiRef.current.checkAndApplyOverscrollEffect(orientation, edge, overscrollTypeOnce);
		}
	}

	// TODO PLAT-98204.
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
			} else if (getDirection(keyCode)) {
				const element = Spotlight.getCurrent();

				variables.current.uiRef.current.lastInputType = 'arrowKey';

				direction = getDirection(keyCode);
				if (overscrollEffectOn.arrowKey && !(element ? getTargetByDirectionFromElement(direction, element) : null)) {
					const {horizontalScrollbarRef, verticalScrollbarRef} = variables.current.uiRef.current;

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
			bounds = variables.current.uiRef.current.getScrollBounds(),
			direction = isPreviousScrollButton ? -1 : 1,
			pageDistance = direction * (isVerticalScrollBar ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier;

		variables.current.uiRef.current.lastInputType = 'scrollbarButton';

		if (direction !== variables.current.uiRef.current.wheelDirection) {
			variables.current.uiRef.current.isScrollAnimationTargetAccumulated = false;
			variables.current.uiRef.current.wheelDirection = direction;
		}

		variables.current.uiRef.current.scrollToAccumulatedTarget(pageDistance, isVerticalScrollBar, props.overscrollEffectOn.scrollbarButton);
	}

	function focusOnScrollButton (scrollbarRef, isPreviousScrollButton) {
		if (scrollbarRef.current) {
			scrollbarRef.current.focusOnButton(isPreviousScrollButton);
		}
	}

	function scrollAndFocusScrollbarButton (direction) {
		if (variables.current.uiRef.current) {
			const
				{direction: directionProp} = props,
				uiRefCurrent = variables.current.uiRef.current,
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

	function stop () {
		if (!props['data-spotlight-container-disabled']) {
			variables.current.childRef.current.setContainerDisabled(false);
		}
		focusOnItem();
		lastScrollPositionOnFocus = null;
		isWheeling = false;
		if (isVoiceControl) {
			isVoiceControl = false;
			updateFocusAfterVoiceControl();
		}
	}

	function focusOnItem () {
		if (indexToFocus !== null && typeof variables.current.childRef.current.focusByIndex === 'function') {
			variables.current.childRef.current.focusByIndex(indexToFocus);
			indexToFocus = null;
		}
		if (nodeToFocus !== null && typeof variables.current.childRef.current.focusOnNode === 'function') {
			variables.current.childRef.current.focusOnNode(nodeToFocus);
			nodeToFocus = null;
		}
		if (pointToFocus !== null) {
			// no need to focus on pointer mode
			if (!Spotlight.getPointerMode()) {
				const {direction, x, y} = pointToFocus;
				const position = {x, y};
				const {current: {containerRef: {current}}} = variables.current.uiRef;
				const elemFromPoint = document.elementFromPoint(x, y);
				const target =
					elemFromPoint && elemFromPoint.closest && getIntersectingElement(elemFromPoint.closest(`.${spottableClass}`), current) ||
					getTargetInViewByDirectionFromPosition(direction, position, current) ||
					getTargetInViewByDirectionFromPosition(reverseDirections[direction], position, current);

				if (target) {
					Spotlight.focus(target);
				}
			}
			pointToFocus = null;
		}
	}

	function scrollTo (opt) {
		indexToFocus = (opt.focus && typeof opt.index === 'number') ? opt.index : null;
		nodeToFocus = (opt.focus && opt.node instanceof Object && opt.node.nodeType === 1) ? opt.node : null;
	}

	function alertThumb () {
		const bounds = variables.current.uiRef.current.getScrollBounds();

		variables.current.uiRef.current.showThumb(bounds);
		variables.current.uiRef.current.startHidingThumb();
	}

	function alertThumbAfterRendered () {
		const spotItem = Spotlight.getCurrent();

		if (!Spotlight.getPointerMode() && isContent(spotItem) && variables.current.uiRef.current.isUpdatedScrollThumb) {
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
		if (variables.current.uiRef.current.scrollToInfo === null) {
			const scrollHeight = variables.current.uiRef.current.getScrollBounds().scrollHeight;
			if (scrollHeight !== variables.current.uiRef.current.bounds.scrollHeight) {
				calculateAndScrollTo();
			}
		}

		// oddly, Scroller manages uiRef.current.bounds so if we don't update it here (it is also
		// updated in calculateAndScrollTo but we might not have made it to that point), it will be
		// out of date when we land back in this method next time.
		variables.current.uiRef.current.bounds.scrollHeight = variables.current.uiRef.current.getScrollBounds().scrollHeight;
	}

	function clearOverscrollEffect (orientation, edge) {
		overscrollJobs[orientation][edge].startAfter(overscrollTimeout, orientation, edge, overscrollTypeNone, 0);
		variables.current.uiRef.current.setOverscrollStatus(orientation, edge, overscrollTypeNone, 0);
	}

	function applyOverscrollEffect (orientation, edge, type, ratio) {
		const nodeRef = variables.current.overscrollRefs[orientation].current;

		if (nodeRef) {
			nodeRef.style.setProperty(overscrollRatioPrefix + orientation + edge, ratio);

			if (type === overscrollTypeOnce) {
				overscrollJobs[orientation][edge].start(orientation, edge, overscrollTypeDone, 0);
			}
		}
	}

	function createOverscrollJob (orientation, edge) {
		if (!overscrollJobs[orientation][edge]) {
			overscrollJobs[orientation][edge] = new Job(applyOverscrollEffect.bind(this), overscrollTimeout);
		}
	}

	function stopOverscrollJob (orientation, edge) {
		const job = overscrollJobs[orientation][edge];

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
		if (spotItem && variables.current.uiRef.current.containerRef.current.contains(spotItem)) {
			const
				viewportBounds = variables.current.uiRef.current.containerRef.current.getBoundingClientRect(),
				spotItemBounds = spotItem.getBoundingClientRect(),
				nodes = Spotlight.getSpottableDescendants(variables.current.uiRef.current.containerRef.current.dataset.spotlightId),
				first = voiceControlDirection === 'vertical' ? 'top' : 'left',
				last = voiceControlDirection === 'vertical' ? 'bottom' : 'right';

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
			isRtl = variables.current.uiRef.current.props.rtl,
			{scrollTop, scrollLeft} = variables.current.uiRef.current,
			{maxLeft, maxTop} = variables.current.uiRef.current.getScrollBounds(),
			verticalDirection = ['up', 'down', 'top', 'bottom'],
			horizontalDirection = isRtl ? ['right', 'left', 'rightmost', 'leftmost'] : ['left', 'right', 'leftmost', 'rightmost'],
			movement = ['previous', 'next', 'first', 'last'];

		let
			scroll = e && e.detail && e.detail.scroll,
			index = movement.indexOf(scroll);

		if (index > -1) {
			scroll = isHorizontal ? horizontalDirection[index] : verticalDirection[index];
		}

		voiceControlDirection = verticalDirection.includes(scroll) && 'vertical' || horizontalDirection.includes(scroll) && 'horizontal' || null;

		// Case 1. Invalid direction
		if (voiceControlDirection === null) {
			isVoiceControl = false;
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
			isVoiceControl = true;
			if (['up', 'down', 'left', 'right'].includes(scroll)) {
				const isPreviousScrollButton = (scroll === 'up') || (scroll === 'left' && !isRtl) || (scroll === 'right' && isRtl);
				onScrollbarButtonClick({isPreviousScrollButton, isVerticalScrollBar: verticalDirection.includes(scroll)});
			} else { // ['top', 'bottom', 'leftmost', 'rightmost'].includes(scroll)
				variables.current.uiRef.current.scrollTo({align: verticalDirection.includes(scroll) && scroll || (scroll === 'leftmost' && isRtl || scroll === 'rightmost' && !isRtl) && 'right' || 'left'});
			}
			e.preventDefault();
		}
	}

	const handleScroll = handle(
		forward('onScroll'),
		(ev, {id}, context) => id && context && context.set,
		({scrollLeft: x, scrollTop: y}, {id}, context) => {
			context.set(`${id}.scrollPosition`, {x, y});
		}
	);

	// render
	const
		downButtonAriaLabel = scrollDownAriaLabel == null ? $L('scroll down') : scrollDownAriaLabel,
		upButtonAriaLabel = scrollUpAriaLabel == null ? $L('scroll up') : scrollUpAriaLabel,
		rightButtonAriaLabel = scrollRightAriaLabel == null ? $L('scroll right') : scrollRightAriaLabel,
		leftButtonAriaLabel = scrollLeftAriaLabel == null ? $L('scroll left') : scrollLeftAriaLabel;

	return (
		<UiScrollableBase
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
			ref={variables.current.uiRef}
			removeEventListeners={removeEventListeners}
			scrollTo={scrollTo}
			stop={stop}
			containerRenderer={({ // eslint-disable-line react/jsx-no-bind
				childComponentProps,
				childWrapper: ChildWrapper,
				childWrapperProps: {className: contentClassName, ...restChildWrapperProps},
				className,
				componentCss,
				containerRef: uiContainerRef,
				// TODO : change name "handleScrollInContainer"
				handleScroll: handleScrollInContainer,
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
					<div className={classNames(componentCss.container, overscrollCss.overscrollFrame, overscrollCss.vertical, isHorizontalScrollbarVisible ? overscrollCss.horizontalScrollbarVisible : null)} ref={variables.current.overscrollRefs.vertical}>
						<ChildWrapper className={classNames(contentClassName, overscrollCss.overscrollFrame, overscrollCss.horizontal)} ref={variables.current.overscrollRefs.horizontal} {...restChildWrapperProps}>
							{childRenderer({
								...childComponentProps,
								cbScrollTo: scrollToInContainer,
								className: componentCss.scrollableFill,
								initUiChildRef,
								isHorizontalScrollbarVisible,
								isVerticalScrollbarVisible,
								onScroll: handleScrollInContainer,
								onUpdate: handleScrollerUpdate,
								ref: variables.current.childRef,
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

ScrollableBase.propTypes = /** @lends moonstone/Scrollable.Scrollable.prototype */ {
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

ScrollableBase.defaultProps = {
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
 * @class Scrollable
 * @memberof moonstone/Scrollable
 * @mixes spotlight/SpotlightContainerDecorator
 * @extends moonstone/Scrollable.ScrollableBase
 * @ui
 * @public
 */
const Scrollable = Skinnable(
	SpotlightContainerDecorator(
		{
			overflow: true,
			preserveId: true,
			restrict: 'self-first'
		},
		I18nContextDecorator(
			{rtlProp: 'rtl'},
			ScrollableBase
		)
	)
);

export default Scrollable;
export {
	dataIndexAttribute,
	Scrollable,
	ScrollableBase
};
