/*
 * Exports the {@link moonstone/Scroller.ScrollableNative} Higher-order Component (HOC) and
 * the {@link moonstone/Scroller.dataIndexAttribute} constant.
 * The default export is {@link moonstone/Scroller.ScrollableNative}.
 */

import clamp from 'ramda/src/clamp';
import classNames from 'classnames';
import {contextTypes as contextTypesResize} from '@enact/ui/Resizable';
import {contextTypes as contextTypesRtl} from '@enact/i18n/I18nDecorator';
import deprecate from '@enact/core/internal/deprecate';
import {forward} from '@enact/core/handle';
import {getTargetByDirectionFromPosition} from '@enact/spotlight/src/target';
import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import {Job} from '@enact/core/util';
import {on, off} from '@enact/core/dispatcher';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ri from '@enact/ui/resolution';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

import css from './Scrollable.less';
import Scrollbar from './Scrollbar';
import scrollbarCss from './Scrollbar.less';

const
	forwardScroll = forward('onScroll'),
	forwardScrollStart = forward('onScrollStart'),
	forwardScrollStop = forward('onScrollStop');

const
	nop = () => {},
	paginationPageMultiplier = 0.8,
	epsilon = 1,
	scrollWheelMultiplierForDeltaPixel = 1.5, // The ratio of wheel 'delta' units to pixels scrolled.
	scrollWheelPageMultiplierForMaxPixel = 0.2, // The ratio of the maximum distance scrolled by wheel to the size of the viewport.
	pixelPerLine = 39,
	// spotlight
	scrollStopWaiting = 500,
	isPageUp = is('pageUp'),
	isPageDown = is('pageDown'),
	reverseDirections = {
		'left': 'right',
		'up': 'down',
		'right': 'left',
		'down': 'up'
	};

/**
 * {@link moonstone/Scroller.dataIndexAttribute} is the name of a custom attribute
 * which indicates the index of an item in {@link moonstone/VirtualList.VirtualList}
 * or {@link moonstone/VirtualList.VirtualGridList}.
 *
 * @constant dataIndexAttribute
 * @memberof moonstone/Scroller
 * @type {String}
 * @private
 */
const dataIndexAttribute = 'data-index';

const ScrollableSpotlightContainer = SpotlightContainerDecorator(
	{
		navigableFilter: (elem, {focusableScrollbar}) => {
			if (
				!focusableScrollbar &&
				!Spotlight.getPointerMode() &&
				// ignore containers passed as their id
				typeof elem !== 'string' &&
				elem.classList.contains(scrollbarCss.scrollButton)
			) {
				return false;
			}
		},
		overflow: true
	},
	({containerRef, ...rest}) => {
		delete rest.focusableScrollbar;

		return (
			<div ref={containerRef} {...rest} />
		);
	}
);

/**
 * {@link moonstone/Scroller.ScrollableNative} is a Higher-order Component
 * that applies a Scrollable behavior to its wrapped component.
 *
 * Scrollable catches `onFocus` event from its wrapped component for spotlight features,
 * and also catches `onWheel`, `onScroll` and `onKeyDown` events from its wrapped component for scrolling behaviors.
 *
 * Scrollable calls `onScrollStart`, `onScroll`, and `onScrollStop` callback functions during scroll.
 *
 * @class ScrollableNative
 * @memberof moonstone/Scroller
 * @hoc
 * @private
 */
const ScrollableHoC = hoc((config, Wrapped) => {
	return class Scrollable extends Component {
		static displayName = 'ScrollableNative'

		static propTypes = /** @lends moonstone/Scroller.ScrollableNative.prototype */ {
			/**
			 * The callback function which is called for linking scrollTo function.
			 * You should specify a callback function as the value of this prop
			 * to use scrollTo feature.
			 *
			 * The scrollTo function passed to the parent component requires below as an argument.
			 * - {position: {x, y}} - You can set a pixel value for x and/or y position
			 * - {align} - You can set one of values below for align
			 *   `'left'`, `'right'`, `'top'`, `'bottom'`,
			 *   `'topleft'`, `'topright'`, `'bottomleft'`, and `'bottomright'`.
			 * - {index} - You can set an index of specific item. (`0` or positive integer)
			 *   This option is available for only VirtualList kind.
			 * - {node} - You can set a node to scroll
			 * - {animate} - When `true`, scroll occurs with animation.
			 *   Set it to `false`, if you want scrolling without animation.
			 * - {indexToFocus} - Deprecated: Use `focus` insead.
			 * - {focus} - Set it `true`, if you want the item to be focused after scroll.
			 *   This option is only valid when you scroll by `index` or `node`.
			 *
			 * Example:
			 * ```
			 *	// If you set cbScrollTo prop like below;
			 *	cbScrollTo: (fn) => {this.scrollTo = fn;}
			 *	// You can simply call like below;
			 *	this.scrollTo({align: 'top'}); // scroll to the top
			 * ```
			 * @type {Function}
			 * @public
			 */
			cbScrollTo: PropTypes.func,

			/**
			 * When `true`, allows 5-way navigation to the scrollbar controls. By default, 5-way will
			 * not move focus to the scrollbar controls.
			 *
			 * @type {Boolean}
			 * @public
			 */
			focusableScrollbar: PropTypes.bool,

			/**
			 * Specifies how to show horizontal scrollbar. Acceptable values are `'auto'`,
			 * `'visible'`, and `'hidden'`.
			 *
			 * @type {String}
			 * @default 'auto'
			 * @public
			 */
			horizontalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden']),

			/**
			 * Called when scrolling
			 *
			 * @type {Function}
			 * @public
			 */
			onScroll: PropTypes.func,

			/**
			 * Called when scrollbar visability changes
			 *
			 * @type {Function}
			 * @public
			 */
			onScrollbarVisibilityChange: PropTypes.func,

			/**
			 * Called when scroll starts
			 *
			 * @type {Function}
			 * @public
			 */
			onScrollStart: PropTypes.func,

			/**
			 * Called when scroll stops
			 *
			 * @type {Function}
			 * @public
			 */
			onScrollStop: PropTypes.func,

			/**
			 * Scrollable CSS style.
			 * Should be defined because we manuplate style prop in render().
			 *
			 * @type {Object}
			 * @public
			 */
			style: PropTypes.object,

			/**
			 * Specifies how to show vertical scrollbar. Acceptable values are `'auto'`,
			 * `'visible'`, and `'hidden'`.
			 *
			 * @type {String}
			 * @default 'auto'
			 * @public
			 */
			verticalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden'])
		}

		static defaultProps = {
			cbScrollTo: nop,
			onScroll: nop,
			onScrollStart: nop,
			onScrollStop: nop,
			horizontalScrollbar: 'auto',
			verticalScrollbar: 'auto'
		}

		static childContextTypes = contextTypesResize
		static contextTypes = contextTypesRtl

		constructor (props) {
			super(props);

			this.state = {
				isHorizontalScrollbarVisible: props.horizontalScrollbar === 'visible',
				isVerticalScrollbarVisible: props.verticalScrollbar === 'visible'
			};

			this.initChildRef = this.initRef('childRef');
			this.initContainerRef = this.initRef('containerRef');

			this.verticalScrollbarProps = {
				ref: this.initRef('verticalScrollbarRef'),
				vertical: true,
				cbAlertThumb: this.alertThumbAfterRendered,
				onPrevScroll: this.onScrollbarButtonClick,
				onNextScroll: this.onScrollbarButtonClick
			};

			this.horizontalScrollbarProps = {
				ref: this.initRef('horizontalScrollbarRef'),
				vertical: false,
				cbAlertThumb: this.alertThumbAfterRendered,
				onPrevScroll: this.onScrollbarButtonClick,
				onNextScroll: this.onScrollbarButtonClick
			};

			props.cbScrollTo(this.scrollTo);
		}

		// component life cycle

		getChildContext () {
			return {
				invalidateBounds: this.enqueueForceUpdate
			};
		}

		componentDidMount () {
			const bounds = this.getScrollBounds();

			this.pageDistance = (this.canScrollVertically(bounds) ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier;
			this.direction = this.childRef.props.direction;
			this.updateEventListeners();
			this.updateScrollbars();

			on('keydown', this.onKeyDown);
		}

		componentWillUpdate () {
			this.deferScrollTo = true;
		}

		componentDidUpdate () {
			// Need to sync calculated client size if it is different from the real size
			if (this.childRef.syncClientSize) {
				this.childRef.syncClientSize();
			}

			this.direction = this.childRef.props.direction;
			this.updateEventListeners();
			this.updateScrollbars();

			if (this.scrollToInfo !== null) {
				if (!this.deferScrollTo) {
					this.scrollTo(this.scrollToInfo);
				}
			} else {
				this.updateScrollOnFocus();
			}
		}

		componentWillUnmount () {
			const
				{containerRef} = this,
				childContainerRef = this.childRef.containerRef;

			// Before call cancelAnimationFrame, you must send scrollStop Event.
			if (this.scrolling) {
				this.doScrollStop();
			}
			this.scrollStopJob.stop();
			this.hideThumbJob.stop();

			if (containerRef && containerRef.removeEventListener) {
				// FIXME `onWheel` doesn't work on the v8 snapshot.
				containerRef.removeEventListener('wheel', this.onWheel);
			}
			if (childContainerRef && childContainerRef.removeEventListener) {
				// FIXME `onScroll` doesn't work on the v8 snapshot.
				childContainerRef.removeEventListener('scroll', this.onScroll, {capture: true});
				// FIXME `onFocus` doesn't work on the v8 snapshot.
				childContainerRef.removeEventListener('focusin', this.onFocus);
				// FIXME `onMouseOver` doesn't work on the v8 snapshot.
				childContainerRef.removeEventListener('mouseover', this.onMouseOver, {capture: true});
				// FIXME `onMouseMove` doesn't work on the v8 snapshot.
				childContainerRef.removeEventListener('mousemove', this.onMouseMove, {capture: true});
			}

			off('keydown', this.onKeyDown);
		}

		// status
		direction = 'vertical'
		isScrollAnimationTargetAccumulated = false
		deferScrollTo = true
		pageDistance = 0
		animateOnFocus = false
		pageDirection = 0
		isWheeling = false
		isUpdatedScrollThumb = false

		// event handlers
		eventHandlers = {}

		// bounds info
		bounds = {
			clientWidth: 0,
			clientHeight: 0,
			scrollWidth: 0,
			scrollHeight: 0,
			maxTop: 0,
			maxLeft: 0
		}

		// scroll info
		scrolling = false
		scrollLeft = 0
		scrollTop = 0
		scrollToInfo = null

		// spotlight
		lastFocusedItem = null
		lastScrollPositionOnFocus = null
		indexToFocus = null
		nodeToFocus = null

		// component info
		childRef = null
		containerRef = null

		// browser native scrolling
		resetPosition = null // prevent auto-scroll on focus by Spotlight

		calculateDistanceByWheel (deltaMode, delta, maxPixel) {
			if (deltaMode === 0) {
				delta = clamp(-maxPixel, maxPixel, ri.scale(delta * scrollWheelMultiplierForDeltaPixel));
			} else if (deltaMode === 1) { // line; firefox
				delta = clamp(-maxPixel, maxPixel, ri.scale(delta * pixelPerLine * scrollWheelMultiplierForDeltaPixel));
			} else if (deltaMode === 2) { // page
				delta = delta < 0 ? -maxPixel : maxPixel;
			}

			return delta;
		}

		// event handler for browser native scroll

		onMouseDown = () => {
			this.isScrollAnimationTargetAccumulated = false;
			this.lastFocusedItem = null;
			this.childRef.setContainerDisabled(false);
		}

		onMouseOver = () => {
			this.resetPosition = this.childRef.containerRef.scrollTop;
		}

		onMouseMove = () => {
			if (this.resetPosition !== null) {
				const childContainerRef = this.childRef.containerRef;
				childContainerRef.style.scrollBehavior = null;
				childContainerRef.scrollTop = this.resetPosition;
				childContainerRef.style.scrollBehavior = 'smooth';
				this.resetPosition = null;
			}
		}

		/*
		 * wheel event handler;
		 * - for horizontal scroll, supports wheel action on any children nodes since web engine cannot suppor this
		 * - for vertical scroll, supports wheel action on scrollbars only
		 */
		onWheel = (e) => {
			const
				bounds = this.getScrollBounds(),
				canScrollHorizontally = this.canScrollHorizontally(bounds),
				canScrollVertically = this.canScrollVertically(bounds),
				eventDeltaMode = e.deltaMode,
				eventDelta = (-e.wheelDeltaY || e.deltaY);
			let
				delta = 0,
				needToHideThumb = false;

			this.lastFocusedItem = null;
			if (typeof window !== 'undefined') {
				window.document.activeElement.blur();
			}
			this.showThumb(bounds);
			// FIXME This routine is a temporary support for horizontal wheel scroll.
			// FIXME If web engine supports horizontal wheel, this routine should be refined or removed.
			if (canScrollVertically) { // This routine handles wheel events on scrollbars for vertical scroll.
				if (eventDelta < 0 && this.scrollTop > 0 || eventDelta > 0 && this.scrollTop < bounds.maxTop) {
					const {horizontalScrollbarRef, verticalScrollbarRef} = this;

					if (!this.isWheeling) {
						this.childRef.setContainerDisabled(true);
						this.isWheeling = true;
					}

					// Not to check if e.target is a descendant of a wrapped component which may have a lot of nodes in it.
					if ((horizontalScrollbarRef && horizontalScrollbarRef.containerRef.contains(e.target)) ||
						(verticalScrollbarRef && verticalScrollbarRef.containerRef.contains(e.target))) {
						delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientHeight * scrollWheelPageMultiplierForMaxPixel);
						needToHideThumb = !delta;
					}
				} else {
					needToHideThumb = true;
				}
			} else if (canScrollHorizontally) { // this routine handles wheel events on any children for horizontal scroll.
				if (eventDelta < 0 && this.scrollLeft > 0 || eventDelta > 0 && this.scrollLeft < bounds.maxLeft) {
					if (!this.isWheeling) {
						this.childRef.setContainerDisabled(true);
						this.isWheeling = true;
					}
					delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientWidth * scrollWheelPageMultiplierForMaxPixel);
					needToHideThumb = !delta;
				} else {
					needToHideThumb = true;
				}
			}

			if (delta !== 0) {
				/* prevent native scrolling feature for vertical direction */
				e.preventDefault();
				const direction = Math.sign(delta);
				// Not to accumulate scroll position if wheel direction is different from hold direction
				if (direction !== this.pageDirection) {
					this.isScrollAnimationTargetAccumulated = false;
					this.pageDirection = direction;
				}
				this.scrollToAccumulatedTarget(delta, canScrollVertically);
			}

			if (needToHideThumb) {
				this.hideThumbJob.start();
			}
		}

		onScroll = (e) => {
			const
				bounds = this.getScrollBounds(),
				canScrollHorizontally = this.canScrollHorizontally(bounds);
			let
				{scrollLeft, scrollTop} = e.target;

			if (!this.scrolling) {
				this.scrollStartOnScroll();
			}

			if (this.context.rtl && canScrollHorizontally) {
				/* FIXME: RTL / this calculation only works for Chrome */
				scrollLeft = bounds.maxLeft - scrollLeft;
			}

			this.scroll(scrollLeft, scrollTop);

			this.scrollStopJob.start();
		}

		// event handlers for Spotlight support

		startScrollOnFocus = (pos, item) => {
			if (pos) {
				const bounds = this.getScrollBounds();

				if (bounds.maxTop > 0 || bounds.maxLeft > 0) {
					this.start(pos.left, pos.top, this.animateOnFocus);
				}
				this.lastFocusedItem = item;
				this.lastScrollPositionOnFocus = pos;
			}
		}

		onFocus = (e) => {
			const shouldPreventScrollByFocus = this.childRef.shouldPreventScrollByFocus ?
				this.childRef.shouldPreventScrollByFocus() :
				false;

			if (!Spotlight.getPointerMode()) {
				this.alertThumb();
			}

			if (!(shouldPreventScrollByFocus || Spotlight.getPointerMode())) {
				const
					item = e.target,
					positionFn = this.childRef.calculatePositionOnFocus,
					spotItem = Spotlight.getCurrent();

				if (item && item === spotItem && positionFn) {
					const lastPos = this.lastScrollPositionOnFocus;
					let pos;

					// If scroll animation is ongoing, we need to pass last target position to
					// determine correct scroll position.
					if (this.scrolling && lastPos) {
						pos = positionFn({item, scrollPosition: (this.direction !== 'horizontal') ? lastPos.top : lastPos.left});
					} else {
						pos = positionFn({item});
					}

					this.startScrollOnFocus(pos, item);
				}
			} else if (this.childRef.setLastFocusedIndex) {
				this.childRef.setLastFocusedIndex(e.target);
			}
		}

		getPageDirection = (keyCode) => {
			const
				isRtl = this.context.rtl,
				{direction} = this,
				isVertical = (direction === 'vertical' || direction === 'both');

			return isPageUp(keyCode) ?
				(isVertical && 'up' || isRtl && 'right' || 'left') :
				(isVertical && 'down' || isRtl && 'left' || 'right');
		}

		getEndPoint = (direction, oSpotBounds, viewportBounds) => {
			let oPoint = {};

			switch (direction) {
				case 'up':
					oPoint.x = oSpotBounds.left + oSpotBounds.width / 2;
					oPoint.y = viewportBounds.top;
					break;
				case 'left':
					oPoint.x = viewportBounds.left;
					oPoint.y = oSpotBounds.top;
					break;
				case 'down':
					oPoint.x = oSpotBounds.left + oSpotBounds.width / 2;
					oPoint.y = viewportBounds.top + viewportBounds.height;
					break;
				case 'right':
					oPoint.x = viewportBounds.left + viewportBounds.width;
					oPoint.y = oSpotBounds.top;
					break;
			}
			return oPoint;
		}

		scrollByPage = (keyCode) => {
			// Only scroll by page when the vertical scrollbar is visible. Otherwise, treat the
			// scroller as a plain container
			if (!this.state.isVerticalScrollbarVisible) return;

			const
				{getEndPoint, scrollToAccumulatedTarget} = this,
				bounds = this.getScrollBounds(),
				canScrollVertically = this.canScrollVertically(bounds),
				childRef = this.childRef,
				pageDistance = isPageUp(keyCode) ? (this.pageDistance * -1) : this.pageDistance,
				spotItem = Spotlight.getCurrent();

			if (!Spotlight.getPointerMode() && spotItem) {
				// Should skip scroll by page when spotItem is paging control button of Scrollbar
				if (!childRef.containerRef.contains(spotItem)) {
					return;
				}
				const
					containerId = (
						// ScrollerNative has a containerId on containerRef
						childRef.containerRef.dataset.containerId ||
						// VirtualListNative has a containerId on contentRef
						childRef.contentRef.dataset.containerId
					),
					direction = this.getPageDirection(keyCode),
					rDirection = reverseDirections[direction],
					viewportBounds = this.containerRef.getBoundingClientRect(),
					spotItemBounds = spotItem.getBoundingClientRect(),
					endPoint = getEndPoint(direction, spotItemBounds, viewportBounds),
					next = getTargetByDirectionFromPosition(rDirection, endPoint, containerId),
					scrollFn = childRef.scrollToNextPage || childRef.scrollToNextItem;

				// If there is no next spottable DOM elements, scroll one page with animation
				if (!next) {
					scrollToAccumulatedTarget(pageDistance, canScrollVertically);
				// If there is a next spottable DOM element vertically or horizontally, focus it without animation
				} else if (next !== spotItem && childRef.scrollToNextPage) {
					this.animateOnFocus = false;
					Spotlight.focus(next);
				// If a next spottable DOM element is equals to the current spottable item, we need to find a next item
				} else {
					const nextPage = scrollFn({direction, reverseDirection: rDirection, focusedItem: spotItem, containerId});

					// If finding a next spottable item in a Scroller, focus it
					if (typeof nextPage === 'object') {
						this.animateOnFocus = false;
						Spotlight.focus(nextPage);
					// Scroll one page with animation if nextPage is equals to `false`
					} else if (!nextPage) {
						scrollToAccumulatedTarget(pageDistance, canScrollVertically);
					}
				}
			} else {
				scrollToAccumulatedTarget(pageDistance, canScrollVertically);
			}
		}

		hasFocus () {
			let current = Spotlight.getCurrent();

			if (!current || Spotlight.getPointerMode()) {
				const containerId = Spotlight.getActiveContainer();
				current = document.querySelector(`[data-container-id="${containerId}"]`);
			}

			return current && this.containerRef.contains(current);
		}

		onKeyDown = (e) => {
			this.animateOnFocus = true;
			if (isPageUp(e.keyCode) || isPageDown(e.keyCode)) {
				e.preventDefault();
				if (!e.repeat && this.hasFocus()) {
					this.scrollByPage(e.keyCode);
				}
			}
		}

		onScrollbarButtonClick = ({isPreviousScrollButton, isVerticalScrollBar}) => {
			const
				bounds = this.getScrollBounds(),
				pageDistance = (isVerticalScrollBar ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier,
				delta = isPreviousScrollButton ? -pageDistance : pageDistance,
				direction = Math.sign(delta);

			if (direction !== this.pageDirection) {
				this.isScrollAnimationTargetAccumulated = false;
				this.pageDirection = direction;
			}

			this.scrollToAccumulatedTarget(delta, isVerticalScrollBar);
		}

		scrollToAccumulatedTarget = (delta, vertical) => {
			if (!this.isScrollAnimationTargetAccumulated) {
				this.accumulatedTargetX = this.scrollLeft;
				this.accumulatedTargetY = this.scrollTop;
				this.isScrollAnimationTargetAccumulated = true;
			}

			if (vertical) {
				this.accumulatedTargetY += delta;
			} else {
				this.accumulatedTargetX += delta;
			}

			this.start(this.accumulatedTargetX, this.accumulatedTargetY);
		}

		// call scroll callbacks

		doScrollStart () {
			forwardScrollStart({scrollLeft: this.scrollLeft, scrollTop: this.scrollTop, moreInfo: this.getMoreInfo()}, this.props);
		}

		doScrolling () {
			forwardScroll({scrollLeft: this.scrollLeft, scrollTop: this.scrollTop, moreInfo: this.getMoreInfo()}, this.props);
		}

		doScrollStop () {
			forwardScrollStop({scrollLeft: this.scrollLeft, scrollTop: this.scrollTop, moreInfo: this.getMoreInfo()}, this.props);
		}

		// call scroll callbacks and update scrollbars for native scroll

		scrollStartOnScroll = () => {
			this.scrolling = true;
			this.showThumb(this.getScrollBounds());
			this.doScrollStart();
		}

		scrollStopOnScroll = () => {
			this.isScrollAnimationTargetAccumulated = false;
			this.childRef.setContainerDisabled(false);
			this.focusOnItem();
			this.lastFocusedItem = null;
			this.lastScrollPositionOnFocus = null;

			this.hideThumb();
			this.scrolling = false;
			this.doScrollStop();
			this.isWheeling = false;
		}

		scrollStopJob = new Job(this.scrollStopOnScroll.bind(this), scrollStopWaiting);

		// update scroll position

		setScrollLeft (value) {
			const bounds = this.getScrollBounds();

			this.scrollLeft = clamp(0, bounds.maxLeft, value);
			if (this.state.isHorizontalScrollbarVisible) {
				this.updateThumb(this.horizontalScrollbarRef, bounds);
			}
		}

		setScrollTop (value) {
			const bounds = this.getScrollBounds();

			this.scrollTop = clamp(0, bounds.maxTop, value);
			if (this.state.isVerticalScrollbarVisible) {
				this.updateThumb(this.verticalScrollbarRef, bounds);
			}
		}

		// scroll start

		start (targetX, targetY, animate = true) {
			const
				bounds = this.getScrollBounds(),
				childContainerRef = this.childRef.containerRef;

			targetX = clamp(0, bounds.maxLeft, targetX);
			targetY = clamp(0, bounds.maxTop, targetY);

			if ((bounds.maxLeft - targetX) < epsilon) {
				targetX = bounds.maxLeft;
			}
			if ((bounds.maxTop - targetY) < epsilon) {
				targetY = bounds.maxTop;
			}

			if (animate) {
				this.childRef.scrollToPosition(targetX, targetY);
			} else {
				childContainerRef.style.scrollBehavior = null;
				this.childRef.scrollToPosition(targetX, targetY);
				childContainerRef.style.scrollBehavior = 'smooth';
				this.focusOnItem();
			}
		}

		focusOnItem () {
			if (this.indexToFocus !== null && typeof this.childRef.focusByIndex === 'function') {
				this.childRef.focusByIndex(this.indexToFocus);
				this.indexToFocus = null;
			}
			if (this.nodeToFocus !== null && typeof this.childRef.focusOnNode === 'function') {
				this.childRef.focusOnNode(this.nodeToFocus);
				this.nodeToFocus = null;
			}
		}

		scroll = (left, top) => {
			let
				dirHorizontal = 0,
				dirVertical = 0;

			if (left !== this.scrollLeft) {
				dirHorizontal = Math.sign(left - this.scrollLeft);
				this.setScrollLeft(left);
			}
			if (top !== this.scrollTop) {
				dirVertical = Math.sign(top - this.scrollTop);
				this.setScrollTop(top);
			}

			if (this.childRef.didScroll) {
				this.childRef.didScroll(this.scrollLeft, this.scrollTop, dirHorizontal, dirVertical);
			}
			this.doScrolling();
		}

		// scrollTo API

		getPositionForScrollTo = (opt) => {
			const
				bounds = this.getScrollBounds(),
				canScrollHorizontally = this.canScrollHorizontally(bounds),
				canScrollVertically = this.canScrollVertically(bounds);
			let
				itemPos,
				left = null,
				top = null;

			if (opt instanceof Object) {
				if (opt.position instanceof Object) {
					if (canScrollHorizontally) {
						// We need '!=' to check if opt.potision.x is null or undefined
						left = opt.position.x != null ? opt.position.x : this.scrollLeft;
					} else {
						left = 0;
					}
					if (canScrollVertically) {
						// We need '!=' to check if opt.potision.y is null or undefined
						top = opt.position.y != null ? opt.position.y : this.scrollTop;
					} else {
						top = 0;
					}
				} else if (typeof opt.align === 'string') {
					if (canScrollHorizontally) {
						if (opt.align.includes('left')) {
							left = 0;
						} else if (opt.align.includes('right')) {
							left = bounds.maxLeft;
						}
					}
					if (canScrollVertically) {
						if (opt.align.includes('top')) {
							top = 0;
						} else if (opt.align.includes('bottom')) {
							top = bounds.maxTop;
						}
					}
				} else {
					if (typeof opt.index === 'number' && typeof this.childRef.getItemPosition === 'function') {
						itemPos = this.childRef.getItemPosition(opt.index, opt.stickTo);
					} else if (opt.node instanceof Object) {
						if (opt.node.nodeType === 1 && typeof this.childRef.getNodePosition === 'function') {
							itemPos = this.childRef.getNodePosition(opt.node);
						}
					}
					if (itemPos) {
						if (canScrollHorizontally) {
							left = itemPos.left;
						}
						if (canScrollVertically) {
							top = itemPos.top;
						}
					}
				}
			}

			return {left, top};
		}

		scrollTo = (opt) => {
			if (!this.deferScrollTo) {
				const {left, top} = this.getPositionForScrollTo(opt);
				this.indexToFocus = null;
				this.nodeToFocus = null;
				this.scrollToInfo = null;

				if (typeof opt.indexToFocus === 'number') {
					this.indexToFocus = opt.indexToFocus;
					deprecate({name: 'indexToFocus', since: '1.2.0', message: 'Use `focus` instead', until: '2.0.0'});
				}

				this.indexToFocus = (opt.focus && typeof opt.index === 'number') ? opt.index : this.indexToFocus;
				this.nodeToFocus = (opt.focus && opt.node instanceof Object && opt.node.nodeType === 1) ? opt.node : null;

				this.start(
					(left !== null) ? left : this.scrollLeft,
					(top !== null) ? top : this.scrollTop,
					opt.animate
				);
			} else {
				this.scrollToInfo = opt;
			}
		}

		canScrollHorizontally = (bounds) => {
			const {direction} = this;

			return (direction === 'horizontal' || direction === 'both') && (bounds.scrollWidth > bounds.clientWidth) && !isNaN(bounds.scrollWidth);
		}

		canScrollVertically = (bounds) => {
			const {direction} = this;

			return (direction === 'vertical' || direction === 'both') && (bounds.scrollHeight > bounds.clientHeight) && !isNaN(bounds.scrollHeight);
		}

		// scroll bar

		showThumb (bounds) {
			if (this.state.isHorizontalScrollbarVisible && this.canScrollHorizontally(bounds) && this.horizontalScrollbarRef) {
				this.horizontalScrollbarRef.showThumb();
			}
			if (this.state.isVerticalScrollbarVisible && this.canScrollVertically(bounds) && this.verticalScrollbarRef) {
				this.verticalScrollbarRef.showThumb();
			}
		}

		updateThumb (scrollbarRef, bounds) {
			scrollbarRef.update({
				...bounds,
				scrollLeft: this.scrollLeft,
				scrollTop: this.scrollTop
			});
		}

		hideThumb = () => {
			if (this.state.isHorizontalScrollbarVisible && this.horizontalScrollbarRef) {
				this.horizontalScrollbarRef.startHidingThumb();
			}
			if (this.state.isVerticalScrollbarVisible && this.verticalScrollbarRef) {
				this.verticalScrollbarRef.startHidingThumb();
			}
		}

		hideThumbJob = new Job(this.hideThumb, 200);

		alertThumb () {
			const bounds = this.getScrollBounds();
			this.showThumb(bounds);
			this.hideThumbJob.start();
		}

		updateScrollbars = () => {
			const
				{horizontalScrollbar, verticalScrollbar} = this.props,
				{isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state,
				bounds = this.getScrollBounds(),
				canScrollHorizontally = this.canScrollHorizontally(bounds),
				canScrollVertically = this.canScrollVertically(bounds),
				curHorizontalScrollbarVisible = (horizontalScrollbar === 'auto') ? canScrollHorizontally : horizontalScrollbar === 'visible',
				curVerticalScrollbarVisible = (verticalScrollbar === 'auto') ? canScrollVertically : verticalScrollbar === 'visible';

			// determine if we should hide or show any scrollbars
			const
				isVisibilityChanged = (
					isHorizontalScrollbarVisible !== curHorizontalScrollbarVisible ||
					isVerticalScrollbarVisible !== curVerticalScrollbarVisible
				);

			if (isVisibilityChanged) {
				if (this.props.onScrollbarVisibilityChange) {
					this.props.onScrollbarVisibilityChange();
				}
				// one or both scrollbars have changed visibility
				this.setState({
					isHorizontalScrollbarVisible: curHorizontalScrollbarVisible,
					isVerticalScrollbarVisible: curVerticalScrollbarVisible
				});
			} else {
				this.deferScrollTo = false;
				this.isUpdatedScrollThumb = this.updateScrollThumbSize();
			}
		}

		updateScrollThumbSize = () => {
			const
				{horizontalScrollbar, verticalScrollbar} = this.props,
				bounds = this.getScrollBounds(),
				canScrollHorizontally = this.canScrollHorizontally(bounds),
				canScrollVertically = this.canScrollVertically(bounds),
				curHorizontalScrollbarVisible = (horizontalScrollbar === 'auto') ? canScrollHorizontally : horizontalScrollbar === 'visible',
				curVerticalScrollbarVisible = (verticalScrollbar === 'auto') ? canScrollVertically : verticalScrollbar === 'visible';

			if (curHorizontalScrollbarVisible || curVerticalScrollbarVisible) {
				// no visibility change but need to notify whichever scrollbars are visible of the
				// updated bounds and scroll position
				const
					updatedBounds = {
						...bounds,
						scrollLeft: this.scrollLeft,
						scrollTop: this.scrollTop
					};

				if (curHorizontalScrollbarVisible) {
					this.horizontalScrollbarRef.update(updatedBounds);
				}
				if (curVerticalScrollbarVisible) {
					this.verticalScrollbarRef.update(updatedBounds);
				}
				return true;
			}
			return false;
		}

		alertThumbAfterRendered = () => {
			const spotItem = Spotlight.getCurrent();

			if (!Spotlight.getPointerMode() && spotItem && this.childRef.containerRef.contains(spotItem) && this.isUpdatedScrollThumb) {
				this.alertThumb();
			}
		}

		// ref

		getScrollBounds () {
			if (typeof this.childRef.getScrollBounds === 'function') {
				return this.childRef.getScrollBounds();
			}
		}

		getMoreInfo () {
			if (typeof this.childRef.getMoreInfo === 'function') {
				return this.childRef.getMoreInfo();
			}
		}

		updateEventListeners = () => {
			const
				{containerRef} = this,
				childContainerRef = this.childRef.containerRef;

			if (containerRef && containerRef.addEventListener) {
				// FIXME `onWheel` doesn't work on the v8 snapshot.
				containerRef.addEventListener('wheel', this.onWheel);
			}
			if (childContainerRef && childContainerRef.addEventListener) {
				// FIXME `onScroll` doesn't work on the v8 snapshot.
				childContainerRef.addEventListener('scroll', this.onScroll, {capture: true});
				// FIXME `onFocus` doesn't work on the v8 snapshot.
				childContainerRef.addEventListener('focusin', this.onFocus);
				// FIXME `onMouseOver` doesn't work on the v8 snapshot.
				childContainerRef.addEventListener('mouseover', this.onMouseOver, {capture: true});
				// FIXME `onMouseMove` doesn't work on the v8 snapshot.
				childContainerRef.addEventListener('mousemove', this.onMouseMove, {capture: true});
			}

			childContainerRef.style.scrollBehavior = 'smooth';
		}

		updateScrollOnFocus () {
			const
				focusedItem = Spotlight.getCurrent(),
				{containerRef, calculatePositionOnFocus} = this.childRef;

			if (focusedItem && containerRef && containerRef.contains(focusedItem)) {
				const
					scrollInfo = {
						previousScrollHeight: this.bounds.scrollHeight,
						scrollTop: this.scrollTop
					},
					pos = calculatePositionOnFocus({item: focusedItem, scrollInfo});

				if (pos && (pos.left !== this.scrollLeft || pos.top !== this.scrollTop)) {
					this.start(pos.left, pos.top, false);
				}
			}

			// update `scrollHeight`
			this.bounds.scrollHeight = this.getScrollBounds().scrollHeight;
		}

		// TODO: consider replacing forceUpdate() by storing bounds in state rather than a non-
		// state member.
		enqueueForceUpdate = () => {
			this.childRef.calculateMetrics();
			this.forceUpdate();
		}

		// render

		initRef (prop) {
			return (ref) => {
				this[prop] = ref;
			};
		}

		render () {
			const
				props = Object.assign({}, this.props),
				{className, focusableScrollbar, style} = this.props,
				{isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state,
				scrollableClasses = classNames(css.scrollable, className);

			delete props.cbScrollTo;
			delete props.className;
			delete props.focusableScrollbar;
			delete props.horizontalScrollbar;
			delete props.onScroll;
			delete props.onScrollbarVisibilityChange;
			delete props.onScrollStart;
			delete props.onScrollStop;
			delete props.style;
			delete props.verticalScrollbar;

			return (
				<ScrollableSpotlightContainer
					className={scrollableClasses}
					containerRef={this.initContainerRef}
					focusableScrollbar={focusableScrollbar}
					style={style}
				>
					<div className={css.container}>
						<Wrapped
							{...props}
							cbScrollTo={this.scrollTo}
							className={css.content}
							ref={this.initChildRef}
						/>
						{isVerticalScrollbarVisible ? <Scrollbar {...this.verticalScrollbarProps} disabled={!isVerticalScrollbarVisible} /> : null}
					</div>
					{isHorizontalScrollbarVisible ? <Scrollbar {...this.horizontalScrollbarProps} corner={isVerticalScrollbarVisible} disabled={!isHorizontalScrollbarVisible} /> : null}
				</ScrollableSpotlightContainer>
			);
		}
	};
});

export default ScrollableHoC;
export {dataIndexAttribute, ScrollableHoC as ScrollableNative};
