/**
 * Provides Moonstone-themed scrollable components and behaviors.
 *
 * @module moonstone/Scrollable
 * @exports Scrollable
 * @private
 */

import {forward} from '@enact/core/handle';
import platform from '@enact/core/platform';
import Spotlight from '@enact/spotlight';
import {spottableClass} from '@enact/spotlight/Spottable';
import {getTargetByDirectionFromPosition} from '@enact/spotlight/src/target';
import {getRect, intersects} from '@enact/spotlight/src/utils';
import {useScrollable} from '@enact/ui/Scrollable';
import {useChildAdapter as useUiChildAdapter} from '@enact/ui/Scrollable/useChild';
import {utilDecorateChildProps} from '@enact/ui/Scrollable';
import utilDOM from '@enact/ui/Scrollable/utilDOM';
import utilEvent from '@enact/ui/Scrollable/utilEvent';
import PropTypes from 'prop-types';
import React, {Component, useContext, useRef} from 'react';

import $L from '../internal/$L';
import {SharedState} from '../internal/SharedStateDecorator';

import useChildAdapter from './useChildAdapter';
import {
	useEventFocus, useEventKey, useEventMonitor, useEventMouse,
	useEventTouch, useEventVoice, useEventWheel
} from './useEvent';
import useOverscrollEffect from './useOverscrollEffect';
import useScrollbar from './useScrollbar';
import {useSpotlightConfig, useSpotlightRestore} from './useSpotlight';

import overscrollCss from './OverscrollEffect.module.less';

const
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

const isIntersecting = (elem, container) => elem && intersects(getRect(container), getRect(elem));
const getIntersectingElement = (elem, container) => isIntersecting(elem, container) && elem;
const getTargetInViewByDirectionFromPosition = (direction, position, container) => {
	const target = getTargetByDirectionFromPosition(direction, position, Spotlight.getActiveContainer());
	return getIntersectingElement(target, container);
};

/**
 * A Moonstone-styled component that provides horizontal and vertical scrollbars.
 *
 * @class ScrollableBase
 * @memberof moonstone/Scrollable
 * @extends ui/Scrollable.ScrollableBase
 * @ui
 * @public
 */
class ScrollableBase extends Component { // ScrollableBase is now only used in storybook.
	static displayName = 'Scrollable'

	static propTypes = /** @lends moonstone/Scrollable.Scrollable.prototype */ {
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
	}

	static defaultProps = {
		'data-spotlight-container-disabled': false,
		focusableScrollbar: false,
		overscrollEffectOn: {
			arrowKey: false,
			drag: false,
			pageKey: false,
			scrollbarButton: false,
			wheel: true
		},
		preventBubblingOnKeyDown: 'none',
		type: 'JS'
	}
}

/*
// Move to useSpotlightRestore

	// Only intended to be used within componentDidMount, this method will fetch the last stored
	// scroll position from SharedState and scroll (without animation) to that position
	function restoreScrollPosition () {
		const {id} = props;
		if (id && context && context.get) {
			const scrollPosition = context.get(`${id}.scrollPosition`);

			if (scrollPosition) {
				uiScrollableAdapter.current.scrollTo({
					position: scrollPosition,
					animate: false
				});
			}
		}
	}

// Move to useScrollbar

	function isScrollButtonFocused () {
		return (
			horizontalScrollbarRef.current && horizontalScrollbarRef.current.isOneOfScrollButtonsFocused() ||
			verticalScrollbarRef.current && verticalScrollbarRef.current.isOneOfScrollButtonsFocused()
		);
	}

// Move to useEventMouse

	function handleFlick ({direction}) {
		const
			{canScrollHorizontally, canScrollVertically} = uiScrollableAdapter.current,
			bounds = uiScrollableAdapter.current.getScrollBounds(),
			focusedItem = Spotlight.getCurrent();

		if (focusedItem) {
			focusedItem.blur();
		}

		if ((
			direction === 'vertical' && canScrollVertically(bounds) ||
			direction === 'horizontal' && canScrollHorizontally(bounds)
		) && !props['data-spotlight-container-disabled']) {
			childAdapter.current.setContainerDisabled(true);
		}
	}

	function handleMouseDown (ev) {
		if (isScrollButtonFocused()) {
			ev.preventDefault();
		}

		if (props['data-spotlight-container-disabled']) {
			ev.preventDefault();
		} else if (type === 'Native') {
			childAdapter.current.setContainerDisabled(false);
		}
	}

// Move to useEventTouch

	function handleTouchStart () {
		const focusedItem = Spotlight.getCurrent();

		if (!Spotlight.isPaused() && focusedItem && !isScrollButtonFocused()) {
			focusedItem.blur();
		}
	}

// Move to useEventWheel

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

// Move to useEventFocus

	const startScrollOnFocus = (pos) => {
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
					overscrollEffect: props.overscrollEffectOn[uiScrollableAdapter.current.lastInputType] &&
						(!childAdapter.current.shouldPreventOverscrollEffect || !childAdapter.current.shouldPreventOverscrollEffect())
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
					overscrollEffect: props.overscrollEffectOn[uiScrollableAdapter.current.lastInputType] &&
						(!childAdapter.current.shouldPreventOverscrollEffect || !childAdapter.current.shouldPreventOverscrollEffect())
				});
				spottable.current.lastScrollPositionOnFocus = pos;
			}
		}
		}
	};

// Move to useEventFocus

	function calculateAndScrollTo () {
		const
			positionFn = childAdapter.current.calculatePositionOnFocus,
			childContainerNode = uiChildContainerRef.current,
			spotItem = Spotlight.getCurrent();

		if (spotItem && positionFn && utilDOM.containsDangerously(childContainerNode, spotItem)) {
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
					itemRect = getRect(spotItem);
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

// Move to useEventFocus

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

		if (!(shouldPreventScrollByFocus || Spotlight.getPointerMode() || uiScrollableAdapter.current.isDragging)) {
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

// Move to useEventKey

	function scrollByPage (direction) {
		const
			{scrollTop} = uiScrollableAdapter.current,
			focusedItem = Spotlight.getCurrent(),
			bounds = uiScrollableAdapter.current.getScrollBounds(),
			isUp = direction === 'up',
			directionFactor = isUp ? -1 : 1,
			pageDistance = directionFactor * bounds.clientHeight * paginationPageMultiplier;
		let scrollPossible = false;

		if (type === 'JS') {
			scrollPossible = isUp ? scrollTop > 0 : bounds.maxTop > scrollTop;
		} else {
			scrollPossible = isUp ? scrollTop > 0 : bounds.maxTop - scrollTop > epsilon;
		}

		uiScrollableAdapter.current.lastInputType = 'pageKey';

		if (directionFactor !== uiScrollableAdapter.current.wheelDirection) {
			uiScrollableAdapter.current.isScrollAnimationTargetAccumulated = false;
			uiScrollableAdapter.current.wheelDirection = directionFactor;
		}

		if (scrollPossible) {
			if (focusedItem) {
				const contentNode = uiChildContainerRef.current;

				// Should do nothing when focusedItem is paging control button of Scrollbar
				if (utilDOM.containsDangerously(contentNode, focusedItem)) {
					const
						contentRect = contentNode.getBoundingClientRect(),
						clientRect = focusedItem.getBoundingClientRect(),
						yAdjust = isUp ? 1 : -1,
						x = clamp(contentRect.left, contentRect.right, (clientRect.right + clientRect.left) / 2);
					let y = 0;

					if (type === 'JS') {
						y = bounds.maxTop <= scrollTop + pageDistance || 0 >= scrollTop + pageDistance ?
							contentRect[isUp ? 'top' : 'bottom'] + yAdjust :
							clamp(contentRect.top, contentRect.bottom, (clientRect.bottom + clientRect.top) / 2);
					} else {
						y = bounds.maxTop - epsilon < scrollTop + pageDistance || epsilon > scrollTop + pageDistance ?
							contentNode.getBoundingClientRect()[isUp ? 'top' : 'bottom'] + yAdjust :
							clamp(contentRect.top, contentRect.bottom, (clientRect.bottom + clientRect.top) / 2);
					}

					focusedItem.blur();

					if (!props['data-spotlight-container-disabled']) {
						childAdapter.current.setContainerDisabled(true);
					}

					spottable.current.pointToFocus = {direction, x, y};
				}
			} else {
				spottable.current.pointToFocus = {direction, x: lastPointer.x, y: lastPointer.y};
			}

			uiScrollableAdapter.current.scrollToAccumulatedTarget(pageDistance, true, props.overscrollEffectOn.pageKey);
		}
	}

// Move to useEventFocus

	function hasFocus () {
		let current = Spotlight.getCurrent();

		if (!current) {
			const spotlightId = Spotlight.getActiveContainer();
			current = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);
		}

		return utilDOM.containsDangerously(scrollableContainerRef, current);
	}

// Move to useOverscrollEffect

	function checkAndApplyOverscrollEffectByDirection (direction) {
		const
			orientation = (direction === 'up' || direction === 'down') ? 'vertical' : 'horizontal',
			bounds = uiScrollableAdapter.current.getScrollBounds(),
			scrollability = orientation === 'vertical' ? uiScrollableAdapter.current.canScrollVertically(bounds) : uiScrollableAdapter.current.canScrollHorizontally(bounds);

		if (scrollability) {
			const
				isRtl = uiScrollableAdapter.current.rtl,
				edge = (direction === 'up' || !isRtl && direction === 'left' || isRtl && direction === 'right') ? 'before' : 'after';

			uiScrollableAdapter.current.checkAndApplyOverscrollEffect(orientation, edge, overscrollTypeOnce);
		}
	}

// Move to useEventKey

	function scrollByPageOnPointerMode (ev) {
		const {keyCode, repeat} = ev;

		forward('onKeyDown', ev, props);
		ev.preventDefault();

		spottable.current.animateOnFocus = true;

		if (!repeat && (props.direction === 'vertical' || props.direction === 'both')) {
			const direction = isPageUp(keyCode) ? 'up' : 'down';

			scrollByPage(direction);

			if (props.overscrollEffectOn.pageKey) {
				checkAndApplyOverscrollEffectByDirection(direction);
			}

			return true; // means consumed
		}

		return false; // means to be propagated
	}

// Move to useEventKey

	function handleKeyDown (ev) {
		const {keyCode, repeat, target} = ev;

		forward('onKeyDown', ev, props);

		if (isPageUp(keyCode) || isPageDown(keyCode)) {
			ev.preventDefault();
		}

		spottable.current.animateOnFocus = true;

		if (!repeat && hasFocus()) {
			let direction = null;

			if (isPageUp(keyCode) || isPageDown(keyCode)) {
				if (props.direction === 'vertical' || props.direction === 'both') {
					direction = isPageUp(keyCode) ? 'up' : 'down';

					if (isContent(target)) {
						ev.stopPropagation();
						scrollByPage(direction);
					}
					if (props.overscrollEffectOn.pageKey) {
						checkAndApplyOverscrollEffectByDirection(direction);
					}
				}
			} else if (getDirection(keyCode) && (type === 'JS' || type === 'Native' && !Spotlight.getPointerMode())) {
				const element = Spotlight.getCurrent();

				uiScrollableAdapter.current.lastInputType = 'arrowKey';
				direction = getDirection(keyCode);

				if (props.overscrollEffectOn.arrowKey && !(element ? getTargetByDirectionFromElement(direction, element) : null)) {
					if (
						!(horizontalScrollbarRef.current && utilDOM.containsDangerously(horizontalScrollbarRef.current.uiScrollbarContainer, element)) &&
						!(verticalScrollbarRef.current && utilDOM.containsDangerously(verticalScrollbarRef.current.uiScrollbarContainer, element))
					) {
						checkAndApplyOverscrollEffectByDirection(direction);
					}
				}
			}
		}
	}

// Move to useScrollbar

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

		uiScrollableAdapter.current.scrollToAccumulatedTarget(pageDistance, isVerticalScrollBar, props.overscrollEffectOn.scrollbarButton);
	}

	function focusOnScrollButton (scrollbarRef, isPreviousScrollButton) {
		if (scrollbarRef.current) {
			scrollbarRef.current.focusOnButton(isPreviousScrollButton);
		}
	}

	function scrollAndFocusScrollbarButton (direction) {
		if (uiScrollableAdapter.current) {
			const
				{hRef, rtl, vRef} = uiScrollableAdapter.current,
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
						canScrollingVertically ? vRef : hRef,
						isPreviousScrollButton
					);
				}
			}
		}
	}

// Move to Scrollable below

	function stop () {
		if (!props['data-spotlight-container-disabled']) {
			childAdapter.current.setContainerDisabled(false);
		}

		focusOnItem();
		variables.current.lastScrollPositionOnFocus = null;
		variables.current.isWheeling = false;
		stopVoice();
	}

	function focusOnItem () {
		if (variables.current.indexToFocus !== null && typeof childAdapter.current.focusByIndex === 'function') {
			childAdapter.current.focusByIndex(variables.current.indexToFocus);
			variables.current.indexToFocus = null;
		}

		if (variables.current.nodeToFocus !== null && typeof childAdapter.current.focusOnNode === 'function') {
			childAdapter.current.focusOnNode(variables.current.nodeToFocus);
			variables.current.nodeToFocus = null;
		}

		if (variables.current.pointToFocus !== null) {
			// no need to focus on pointer mode
			if (!Spotlight.getPointerMode()) {
				const
					{direction, x, y} = variables.current.pointToFocus,
					position = {x, y},
					elemFromPoint = document.elementFromPoint(x, y),
					target =
						elemFromPoint && elemFromPoint.closest && getIntersectingElement(elemFromPoint.closest(`.${spottableClass}`), scrollableContainerRef.current) ||
						getTargetInViewByDirectionFromPosition(direction, position, scrollableContainerRef.current) ||
						getTargetInViewByDirectionFromPosition(reverseDirections[direction], position, scrollableContainerRef.current);

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

// Move to useScrollbar

	function alertThumb () {
		const bounds = uiScrollableAdapter.current.getScrollBounds();

		uiScrollableAdapter.current.showThumb(bounds);
		uiScrollableAdapter.current.startHidingThumb();
	}

	function alertThumbAfterRendered () {
		const spotItem = Spotlight.getCurrent();

		if (!Spotlight.getPointerMode() && isContent(spotItem) && uiScrollableAdapter.current.isUpdatedScrollThumb) {
			alertThumb();
		}
	}

// Move to Scrollable below

	function handleResizeWindow () {
		const focusedItem = Spotlight.getCurrent();

		if (focusedItem) {
			focusedItem.blur();
		}
	}

	function handleScrollerUpdate () {
		if (uiScrollableAdapter.current.scrollToInfo === null) {
			const scrollHeight = uiScrollableAdapter.current.getScrollBounds().scrollHeight;

			if (scrollHeight !== uiScrollableAdapter.current.bounds.scrollHeight) {
				calculateAndScrollTo();
			}
		}

		// oddly, Scroller manages uiScrollableAdapter.current.bounds so if we don't update it here (it is also
		// updated in calculateAndScrollTo but we might not have made it to that point), it will be
		// out of date when we land back in this method next time.
		uiScrollableAdapter.current.bounds.scrollHeight = uiScrollableAdapter.current.getScrollBounds().scrollHeight;
	}

// Move to useOverscrollEffect

	function clearOverscrollEffect (orientation, edge) {
		variables.current.overscrollJobs[orientation][edge].startAfter(overscrollTimeout, orientation, edge, overscrollTypeNone, 0);
		uiScrollableAdapter.current.setOverscrollStatus(orientation, edge, overscrollTypeNone, 0);
	}

	const applyOverscrollEffect = useCallback((orientation, edge, type, ratio) => {
		const nodeRef = overscrollRefs[orientation].current;

		if (nodeRef) {
			nodeRef.style.setProperty(overscrollRatioPrefix + orientation + edge, ratio);

			if (type === overscrollTypeOnce) {
				variables.current.overscrollJobs[orientation][edge].start(orientation, edge, overscrollTypeDone, 0);
			}
		}
	}, [overscrollRefs]);

	function createOverscrollJob (orientation, edge) {
		if (!variables.current.overscrollJobs[orientation][edge]) {
			variables.current.overscrollJobs[orientation][edge] = new Job(applyOverscrollEffect, overscrollTimeout);
		}
	}

	function stopOverscrollJob (orientation, edge) {
		const job = variables.current.overscrollJobs[orientation][edge];

		if (job) {
			job.stop();
		}
	}

// Move to Scrollable below

	// FIXME setting event handlers directly to work on the V8 snapshot.
	function addEventListeners (ref) { // `ref` is always `uiChildContainerRef`.
		utilEvent('focusin').addEventListener(ref, handleFocus);

		if (ref.current) {
			addVoiceEventListener(ref);
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	function removeEventListeners (ref) { // `ref` is always `uiChildContainerRef`.
		utilEvent('focusin').removeEventListener(ref, handleFocus);

		if (ref.current) {
			removeVoiceEventListener(ref);
		}
	}

// Move to useEventVoice

	const updateFocusAfterVoiceControl = () => {
		const
			spotItem = Spotlight.getCurrent(),
			scrollableContainerNode = scrollableContainerRef.current;

		if (utilDOM.containsDangerously(scrollableContainerNode, spotItem)) {
			const
				viewportBounds = scrollableContainerNode.getBoundingClientRect(),
				spotItemBounds = spotItem.getBoundingClientRect(),
				nodes = Spotlight.getSpottableDescendants(scrollableContainerNode.dataset.spotlightId),
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
	};

	const isReachedEdge = (scrollPos, ltrBound, rtlBound, isRtl = false) => {
		const bound = isRtl ? rtlBound : ltrBound;
		return (bound === 0 && scrollPos === 0) || (bound > 0 && scrollPos >= bound - 1);
	};


	const handleVoice = (e) => {
		const
			isHorizontal = (props.direction === 'horizontal'),
			isRtl = uiScrollableAdapter.current.rtl,
			{scrollTop, scrollLeft} = uiScrollableAdapter.current,
			{maxLeft, maxTop} = uiScrollableAdapter.current.getScrollBounds(),
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
				uiScrollableAdapter.current.scrollTo({align: verticalDirection.includes(scroll) && scroll || (scroll === 'leftmost' && isRtl || scroll === 'rightmost' && !isRtl) && 'right' || 'left'});
			}

			e.preventDefault();
		}
	};

// Move to Scrollable below

	function handleScroll (ev) {
		const
			{scrollLeft: x, scrollTop: y} = ev,
			{id} = props;

		forward('onScroll', ev, props);

		if (id && contextSharedState && contextSharedState.set) {
			contextSharedState.set(ev, props);
			contextSharedState.set(`${id}.scrollPosition`, {x, y});
		}
	}
*/

const useSpottableScrollable = (props, instances, context) => {
	const {childAdapter, scrollableContainerRef, uiChildContainerRef, uiScrollableAdapter} = instances;
	const {type} = context;
	const contextSharedState = useContext(SharedState);

	// Mutable value

	const variables = useRef({
		animateOnFocus: false,
		indexToFocus: null,
		lastScrollPositionOnFocus: null,
		nodeToFocus: null,
		pointToFocus: null
	});

	// Hooks

	const {
		alertThumb,
		isScrollButtonFocused,
		onScrollbarButtonClick,
		scrollAndFocusScrollbarButton,
		scrollbarProps
	} = useScrollbar(props, instances, {isContent});

	useSpotlightConfig(props);

	useSpotlightRestore(props, instances);

	const {
		applyOverscrollEffect,
		checkAndApplyOverscrollEffectByDirection,
		clearOverscrollEffect
	} = useOverscrollEffect({}, instances);

	const {handleWheel, isWheeling} = useEventWheel(props, instances, {isScrollButtonFocused, type});

	const {calculateAndScrollTo, handleFocus, hasFocus} = useEventFocus(props, {...instances, spottable: variables}, {alertThumb, isWheeling, type});

	const {handleKeyDown, lastPointer, scrollByPageOnPointerMode} = useEventKey(props, {...instances, spottable: variables}, {checkAndApplyOverscrollEffectByDirection, hasFocus, isContent, type});

	useEventMonitor({}, instances, {lastPointer, scrollByPageOnPointerMode});

	const {handleFlick, handleMouseDown} = useEventMouse({}, instances, {isScrollButtonFocused, type});

	const {handleTouchStart} = useEventTouch({}, instances, {isScrollButtonFocused});

	const {
		addVoiceEventListener,
		removeVoiceEventListener,
		stopVoice
	} = useEventVoice(props, instances, {onScrollbarButtonClick});

	// Functions

	function isContent (element) {
		return (element && utilDOM.containsDangerously(uiChildContainerRef, element));
	}

	function scrollTo (opt) {
		variables.current.indexToFocus = (opt.focus && typeof opt.index === 'number') ? opt.index : null;
		variables.current.nodeToFocus = (opt.focus && opt.node instanceof Object && opt.node.nodeType === 1) ? opt.node : null;
	}

	function start (animate) {
		if (type === 'Native' && !animate) {
			focusOnItem();
		}
	}

	function stop () {
		if (!props['data-spotlight-container-disabled']) {
			childAdapter.current.setContainerDisabled(false);
		}

		focusOnItem();
		variables.current.lastScrollPositionOnFocus = null;
		variables.current.isWheeling = false;
		stopVoice();
	}

	function scrollStopOnScroll () {
		stop();
	}

	function focusOnItem () {
		if (variables.current.indexToFocus !== null && typeof childAdapter.current.focusByIndex === 'function') {
			childAdapter.current.focusByIndex(variables.current.indexToFocus);
			variables.current.indexToFocus = null;
		}

		if (variables.current.nodeToFocus !== null && typeof childAdapter.current.focusOnNode === 'function') {
			childAdapter.current.focusOnNode(variables.current.nodeToFocus);
			variables.current.nodeToFocus = null;
		}

		if (variables.current.pointToFocus !== null) {
			// no need to focus on pointer mode
			if (!Spotlight.getPointerMode()) {
				const
					{direction, x, y} = variables.current.pointToFocus,
					position = {x, y},
					elemFromPoint = document.elementFromPoint(x, y),
					target =
						elemFromPoint && elemFromPoint.closest && getIntersectingElement(elemFromPoint.closest(`.${spottableClass}`), scrollableContainerRef.current) ||
						getTargetInViewByDirectionFromPosition(direction, position, scrollableContainerRef.current) ||
						getTargetInViewByDirectionFromPosition(reverseDirections[direction], position, scrollableContainerRef.current);

				if (target) {
					Spotlight.focus(target);
				}
			}

			variables.current.pointToFocus = null;
		}
	}

	function handleScroll (ev) {
		const
			{scrollLeft: x, scrollTop: y} = ev,
			{id} = props;

		forward('onScroll', ev, props);

		if (id && contextSharedState && contextSharedState.set) {
			contextSharedState.set(ev, props);
			contextSharedState.set(`${id}.scrollPosition`, {x, y});
		}
	}

	// Callback for scroller updates; calculate and, if needed, scroll to new position based on focused item.
	function handleScrollerUpdate () {
		if (uiScrollableAdapter.current.scrollToInfo === null) {
			const scrollHeight = uiScrollableAdapter.current.getScrollBounds().scrollHeight;

			if (scrollHeight !== uiScrollableAdapter.current.bounds.scrollHeight) {
				calculateAndScrollTo();
			}
		}

		// oddly, Scroller manages uiScrollableAdapter.current.bounds so if we don't update it here (it is also
		// updated in calculateAndScrollTo but we might not have made it to that point), it will be
		// out of date when we land back in this method next time.
		uiScrollableAdapter.current.bounds.scrollHeight = uiScrollableAdapter.current.getScrollBounds().scrollHeight;
	}

	function handleResizeWindow () {
		const focusedItem = Spotlight.getCurrent();

		if (focusedItem) {
			focusedItem.blur();
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	function addEventListeners (ref) { // `ref` is always `uiChildContainerRef`.
		utilEvent('focusin').addEventListener(ref, handleFocus);

		if (ref.current) {
			addVoiceEventListener(ref);
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	function removeEventListeners (ref) { // `ref` is always `uiChildContainerRef`.
		utilEvent('focusin').removeEventListener(ref, handleFocus);

		if (ref.current) {
			removeVoiceEventListener(ref);
		}
	}

	// Return

	return {
		addEventListeners,
		applyOverscrollEffect,
		clearOverscrollEffect,
		handleFlick,
		handleFocus,
		handleKeyDown,
		handleMouseDown,
		handleResizeWindow,
		handleScroll,
		handleScrollerUpdate,
		handleTouchStart,
		handleWheel,
		removeEventListeners,
		scrollAndFocusScrollbarButton,
		scrollbarProps,
		scrollByPageOnPointerMode,
		scrollStopOnScroll,
		scrollTo,
		start,
		stop
	};
};

const useScroll = (props) => {
			// TBD: indentation is broken intentionally to help comparing
			const {
				'data-spotlight-container': spotlightContainer,
				'data-spotlight-container-disabled': spotlightContainerDisabled,
				'data-spotlight-id': spotlightId,
				focusableScrollbar,
				preventBubblingOnKeyDown,
				scrollDownAriaLabel,
				scrollLeftAriaLabel,
				scrollRightAriaLabel,
				scrollUpAriaLabel,
				type,
				...rest
			} = props,
			downButtonAriaLabel = scrollDownAriaLabel == null ? $L('scroll down') : scrollDownAriaLabel,
			upButtonAriaLabel = scrollUpAriaLabel == null ? $L('scroll up') : scrollUpAriaLabel,
			rightButtonAriaLabel = scrollRightAriaLabel == null ? $L('scroll right') : scrollRightAriaLabel,
			leftButtonAriaLabel = scrollLeftAriaLabel == null ? $L('scroll left') : scrollLeftAriaLabel;

	// Mutable value

	const scrollableContainerRef = useRef();
	const uiChildContainerRef = useRef();

	const overscrollRefs = {
		horizontal: React.useRef(),
		vertical: React.useRef()
	};

	const horizontalScrollbarRef = useRef();
	const verticalScrollbarRef = useRef();

	// Adapters

	const [childAdapter, setChildAdapter] = useChildAdapter();

	const uiScrollableAdapter = useRef({
		animator: null,
		applyOverscrollEffect: null,
		bounds: null,
		calculateDistanceByWheel: null,
		canScrollHorizontally: null,
		canScrollVertically: null,
		checkAndApplyOverscrollEffect: null,
		getScrollBounds: null,
		isDragging: null,
		isScrollAnimationTargetAccumulated: null,
		isUpdatedScrollThumb: null,
		lastInputType: null,
		rtl: null,
		scrollBounds: null,
		scrollHeight: null,
		scrolling: null,
		scrollLeft: null,
		scrollPos: null,
		scrollTo: null,
		scrollToAccumulatedTarget: null,
		scrollToInfo: null,
		scrollTop: null,
		setOverscrollStatus: null,
		showThumb: null,
		start: null,
		startHidingThumb: null,
		stop: null,
		wheelDirection: null
	});

	const setUiScrollableAdapter = (adapter) => {
		uiScrollableAdapter.current = adapter;
	};

	const [uiChildAdapter, setUiChildAdapter] = useUiChildAdapter();

	// Hooks

	const instance = {
		// Ref
		scrollableContainerRef,
		overscrollRefs,
		uiChildContainerRef,
		horizontalScrollbarRef,
		verticalScrollbarRef,

		// Adapter
		childAdapter,
		uiScrollableAdapter,
		uiChildAdapter
	};

	const
		decoratedChildProps = {},
		decorateChildProps = utilDecorateChildProps(decoratedChildProps);

	const {
		addEventListeners,
		applyOverscrollEffect,
		clearOverscrollEffect,
		handleFlick,
		handleKeyDown,
		handleMouseDown,
		handleResizeWindow,
		handleScroll,
		handleScrollerUpdate,
		handleTouchStart,
		handleWheel,
		removeEventListeners,
		scrollAndFocusScrollbarButton,
		scrollbarProps,
		scrollStopOnScroll, // Native
		scrollTo,
		start, // Native
		stop // JS
	} = useSpottableScrollable(props, instance, {type});

	// Render

	if (type === 'JS') {
		scrollableBaseProp.stop = stop;
	} else {
		scrollableBaseProp.scrollStopOnScroll = scrollStopOnScroll;
		scrollableBaseProp.start = start;
	}

	decorateChildProps('scrollableContainerProps', {
		className: [overscrollCss.scrollable],
		'data-spotlight-container': spotlightContainer,
		'data-spotlight-container-disabled': spotlightContainerDisabled,
		'data-spotlight-id': spotlightId,
		onTouchStart: handleTouchStart
	});

	decorateChildProps('flexLayoutProps', {
		className: [overscrollCss.overscrollFrame, overscrollCss.vertical]
	});

	decorateChildProps('childWrapperProps', {
		className: [overscrollCss.overscrollFrame, overscrollCss.horizontal]
	});

	decorateChildProps('childProps', {
		onUpdate: handleScrollerUpdate,
		scrollAndFocusScrollbarButton,
		setChildAdapter,
		spotlightId,
		uiScrollableAdapter
	});

	decorateChildProps('verticalScrollbarProps', {
		...scrollbarProps,
		focusableScrollButtons: focusableScrollbar,
		nextButtonAriaLabel: downButtonAriaLabel,
		onKeyDownButton: handleKeyDown,
		preventBubblingOnKeyDown,
		previousButtonAriaLabel: upButtonAriaLabel
	});

	decorateChildProps('horizontalScrollbarProps', {
		...scrollbarProps,
		focusableScrollButtons: focusableScrollbar,
		nextButtonAriaLabel: rightButtonAriaLabel,
		onKeyDownButton: handleKeyDown,
		preventBubblingOnKeyDown,
		previousButtonAriaLabel: leftButtonAriaLabel
	});

	const {
		childWrapper,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible
	} = useScrollable({
		...rest,
		...scrollableBaseProp,
		decorateChildProps,
		noScrollByDrag: !platform.touchscreen,
		addEventListeners,
		applyOverscrollEffect,
		clearOverscrollEffect,
		handleResizeWindow,
		horizontalScrollbarRef,
		onFlick: handleFlick,
		onKeyDown: handleKeyDown,
		onMouseDown: handleMouseDown,
		onScroll: handleScroll,
		onWheel: handleWheel,
		removeEventListeners,
		scrollableContainerRef,
		scrollTo: scrollTo,
		setUiChildAdapter,
		setUiScrollableAdapter,
		type,
		uiChildAdapter,
		uiChildContainerRef,
		verticalScrollbarRef
	});

	decorateChildProps('flexLayoutProps', {
		className: [...(isHorizontalScrollbarVisible ? overscrollCss.horizontalScrollbarVisible : [])]
	});

	decorateChildProps('scrollableContainerProps', {ref: scrollableContainerRef});
	decorateChildProps('flexLayoutProps', {ref: overscrollRefs.vertical});
	decorateChildProps('childWrapperProps', {ref: overscrollRefs.horizontal});
	decorateChildProps('childProps', {uiChildAdapter, uiChildContainerRef});
	decorateChildProps('verticalScrollbarProps', {ref: verticalScrollbarRef});
	decorateChildProps('horizontalScrollbarProps', {ref: horizontalScrollbarRef});

	return {
		...decoratedChildProps,
		childWrapper,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible
	};
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

export default useScroll;
export {
	dataIndexAttribute,
	ScrollableBase as Scrollable,
	ScrollableBase,
	useScroll
};
