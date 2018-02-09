/**
 * Provides unstyled scrollable native components and behaviors to be customized by a theme or application.
 *
 * @module ui/Scrollable
 * @exports ScrollableNative
 * @exports constants
 * @exports ScrollableBaseNative
 */

import clamp from 'ramda/src/clamp';
import classNames from 'classnames';
import {contextTypes as contextTypesState, Publisher} from '@enact/core/internal/PubSub';
import {forward} from '@enact/core/handle';
import {is} from '@enact/core/keymap';
import {Job} from '@enact/core/util';
import kind from '@enact/core/kind';
import {on, off} from '@enact/core/dispatcher';
import {perfNow} from '@enact/core/util';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {contextTypes as contextTypesResize} from '../Resizable';
import ri from '../resolution';

import css from './Scrollable.less';
import Scrollbar from './Scrollbar';

const
	forwardScroll = forward('onScroll'),
	forwardScrollStart = forward('onScrollStart'),
	forwardScrollStop = forward('onScrollStop');

const
	constants = {
		calcVelocity: (d, dt) => (d && dt) ? d / dt : 0,
		epsilon: 1,
		flickMultiplier: 10,
		holdTime: 50,
		isPageDown: is('pageDown'),
		isPageUp: is('pageUp'),
		nop: () => {},
		paginationPageMultiplier: 0.8,
		scrollStopWaiting: 200,
		scrollWheelPageMultiplierForMaxPixel: 0.2 // The ratio of the maximum distance scrolled by wheel to the size of the viewport.
	},
	{
		calcVelocity,
		epsilon,
		flickMultiplier,
		holdTime,
		isPageDown,
		isPageUp,
		nop,
		paginationPageMultiplier,
		scrollStopWaiting,
		scrollWheelPageMultiplierForMaxPixel
	} = constants;

/**
 * [ScrollableBaseNative]{@link ui/Scrollable.ScrollableBaseNative} is a base component for
 * [ScrollableNative]{@link ui/Scrollable.ScrollableNative}.
 *
 * @class ScrollableBaseNative
 * @memberof ui/Scrollable
 * @ui
 * @private
 */
class ScrollableBaseNative extends Component {
	static displayName = 'ui:ScrollableNative'

	static propTypes = /** @lends ui/Scrollable.ScrollableBaseNative.prototype */ {
		/**
		 * A callback function that receives a reference to the `scrollTo` feature. Once received,
		 * the `scrollTo` method can be called as an imperative interface.
		 *
		 * The `scrollTo` function accepts the following paramaters:
		 * - {position: {x, y}} - Pixel value for x and/or y position
		 * - {align} - Where the scroll area should be aligned. Values are:
		 *   `'left'`, `'right'`, `'top'`, `'bottom'`,
		 *   `'topleft'`, `'topright'`, `'bottomleft'`, and `'bottomright'`.
		 * - {index} - Index of specific item. (`0` or positive integer)
		 *   This option is available for only `VirtualList` kind.
		 * - {node} - Node to scroll into view
		 * - {animate} - When `true`, scroll occurs with animation. When `false`, no
		 *   animation occurs.
		 * - {indexToFocus} - Deprecated: Use `focus` instead.
		 * - {focus} - When `true`, attempts to focus item after scroll. Only valid when scrolling
		 *   by `index` or `node`.
		 * > Note: Only specify one of: `position`, `align`, `index` or `node`
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
		 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`
		 * It is not recommended to set this prop since it can cause performance degradation. Use
		 * `onScrollStart` or `onScrollStop` instead.
		 *
		 * @type {Function}
		 * @public
		 */
		onScroll: PropTypes.func,

		/**
		 * Called when scrollbar visibility changes
		 *
		 * @type {Function}
		 * @public
		 */
		onScrollbarVisibilityChange: PropTypes.func,

		/**
		 * Called when scroll starts
		 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`
		 *
		 * @type {Function}
		 * @public
		 */
		onScrollStart: PropTypes.func,

		/**
		 * Called when scroll stops
		 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`
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
		verticalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden']),

		/**
		 * A component to make scrollable.
		 *
		 * @type {Function}
		 * @public
		 */
		wrapped: PropTypes.func
	}

	static defaultProps = {
		cbScrollTo: nop,
		horizontalScrollbar: 'auto',
		onScroll: nop,
		onScrollStart: nop,
		onScrollStop: nop,
		verticalScrollbar: 'auto'
	}

	static childContextTypes = {
		...contextTypesResize,
		...contextTypesState
	}

	static contextTypes = contextTypesState

	constructor (props) {
		super(props);

		this.state = {
			rtl: false,
			remeasure: false,
			isHorizontalScrollbarVisible: props.horizontalScrollbar === 'visible',
			isVerticalScrollbarVisible: props.verticalScrollbar === 'visible'
		};

		this.initChildRef = this.initRef('childRef');
		this.initContainerRef = this.initRef('containerRef');

		this.verticalScrollbarProps = {
			ref: this.initRef('verticalScrollbarRef'),
			vertical: true
		};

		this.horizontalScrollbarProps = {
			ref: this.initRef('horizontalScrollbarRef'),
			vertical: false
		};

		props.cbScrollTo(this.scrollTo);

		this.bindEventHandlers();
	}

	getChildContext = () => ({
		invalidateBounds: this.enqueueForceUpdate,
		Subscriber: this.publisher.getSubscriber()
	})

	componentWillMount () {
		this.publisher = Publisher.create('resize', this.context.Subscriber);
		this.publisher.publish({
			remeasure: false
		});

		if (this.context.Subscriber) {
			this.context.Subscriber.subscribe('resize', this.handleSubscription);
			this.context.Subscriber.subscribe('i18n', this.handleSubscription);
		}
	}

	componentDidMount () {
		const bounds = this.getScrollBounds();

		this.pageDistance = (this.canScrollVertically(bounds) ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier;
		this.direction = this.childRef.props.direction;
		this.updateScrollbars();

		this.addEventListeners();
		on('keydown', this.onKeyDown);
	}

	componentWillUpdate () {
		this.deferScrollTo = true;
	}

	componentDidUpdate (prevProps, prevState) {
		// Need to sync calculated client size if it is different from the real size
		if (this.childRef.syncClientSize) {
			const {isVerticalScrollbarVisible, isHorizontalScrollbarVisible} = this.state;
			// If we actually synced, we need to reset scroll position.
			if (this.childRef.syncClientSize()) {
				this.setScrollLeft(0);
				this.setScrollTop(0);
			}
			// Need to check item total size is same with client size when scrollbar is visible
			// By hiding scrollbar again, infinite function call maybe happens
			this.isFitClientSize = (isVerticalScrollbarVisible || isHorizontalScrollbarVisible) && this.childRef.isSameTotalItemSizeWithClient();
		}

		this.direction = this.childRef.props.direction;
		this.addEventListeners();
		if (!this.isFitClientSize) {
			this.updateScrollbars();
		}

		if (this.scrollToInfo !== null) {
			if (!this.deferScrollTo) {
				this.scrollTo(this.scrollToInfo);
			}
		}

		// publish container resize changes
		const horizontal = this.state.isHorizontalScrollbarVisible !== prevState.isHorizontalScrollbarVisible;
		const vertical = this.state.isVerticalScrollbarVisible !== prevState.isVerticalScrollbarVisible;
		if (horizontal || vertical) {
			this.publisher.publish({
				horizontal,
				vertical
			});
		}
	}

	componentWillUnmount () {
		// Before call cancelAnimationFrame, you must send scrollStop Event.
		if (this.scrolling) {
			this.doScrollStop();
		}
		this.scrollStopJob.stop();

		if (this.context.Subscriber) {
			this.context.Subscriber.unsubscribe('resize', this.handleSubscription);
			this.context.Subscriber.unsubscribe('i18n', this.handleSubscription);
		}

		this.removeEventListeners();
		off('keydown', this.onKeyDown);
	}

	// TODO: consider replacing forceUpdate() by storing bounds in state rather than a non-
	// state member.
	enqueueForceUpdate = () => {
		this.childRef.calculateMetrics();
		this.forceUpdate();
	}

	handleSubscription = ({channel, message}) => {
		if (channel === 'i18n') {
			const {rtl} = message;
			if (rtl !== this.state.rtl) {
				this.setState({rtl});
			}
		} else if (channel === 'resize') {
			this.publisher.publish(message);
		}
	}
	// constants
	pixelPerLine = 39
	scrollWheelMultiplierForDeltaPixel = 1.5 // The ratio of wheel 'delta' units to pixels scrolled.

	// status
	direction = 'vertical'
	isScrollAnimationTargetAccumulated = false
	isFirstDragging = false
	isDragging = false
	deferScrollTo = true
	pageDistance = 0
	pageDirection = 0
	isFitClientSize = false
	isUpdatedScrollThumb = false

	// event handlers
	eventHandlers = {}

	// drag info
	dragInfo = {
		t: 0,
		clientX: 0,
		clientY: 0,
		dx: 0,
		dy: 0,
		dt: 0
	}

	// bounds info
	bounds = {
		scrollX: 0,
		scrollY: 0,
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

	// component info
	childRef = null
	containerRef = null

	// handle an input event

	dragStart (e) {
		const
			{clientX, clientY} = e,
			d = this.dragInfo;

		this.isDragging = true;
		this.isFirstDragging = true;
		d.scrollX = this.scrollLeft;
		d.scrollY = this.scrollTop;
		d.t = perfNow();
		d.clientX = clientX;
		d.clientY = clientY;
		d.dx = d.dy = 0;
	}

	drag (e) {
		const
			{direction} = this,
			t = perfNow(),
			d = this.dragInfo;

		if (direction === 'horizontal' || direction === 'both') {
			d.dx = e.clientX - d.clientX;
			d.clientX = e.clientX;
			d.scrollX -= d.dx;
		} else {
			d.dx = 0;
		}

		if (direction === 'vertical' || direction === 'both') {
			d.dy = e.clientY - d.clientY;
			d.clientY = e.clientY;
			d.scrollY -= d.dy;
		} else {
			d.dy = 0;
		}

		d.t = t;

		return {scrollX: d.scrollX, scrollY: d.scrollY};
	}

	dragStop () {
		const
			d = this.dragInfo,
			t = perfNow();

		d.dt = t - d.t;
		this.isDragging = false;
	}

	isFlicking () {
		const d = this.dragInfo;

		if (d.dt > holdTime) {
			return false;
		} else {
			return true;
		}
	}

	calculateDistanceByFlick (delta, time) {
		const v = calcVelocity(-delta, time);
		return Math.sign(v) * flickMultiplier * v * v;
	}

	scrollByFlick () {
		const {dt, dx, dy, scrollX, scrollY} = this.dragInfo;
		this.start(
			scrollX + this.calculateDistanceByFlick(dx, dt),
			scrollY + this.calculateDistanceByFlick(dy, dt),
			true
		);
	}

	// event handler for browser native scroll

	onMouseDown (e) {
		this.stopScrolling();
		this.dragStart(e);

		// Note: this code is to stop scrolling on mouse down. NOT TO SCROLL.
		this.isScrollAnimationTargetAccumulated = false;
	}

	onMouseMove (e) {
		if (this.isDragging) {
			const {scrollX, scrollY} = this.drag(e);
			this.start(scrollX, scrollY, false);
		}
	}

	onMouseUp (e) {
		if (this.isDragging) {
			this.dragStop(e);

			if (!this.isFlicking()) {
				// Chromium ignores when target position is as same as the current position.
				this.stopScrolling();
			} else {
				this.scrollByFlick();
			}
		}
	}

	onMouseLeave (e) {
		if (e.target === this.containerRef) {
			this.onMouseUp(e);
		}
	}

	calculateDistanceByWheel (deltaMode, delta, maxPixel) {
		if (deltaMode === 0) {
			delta = clamp(-maxPixel, maxPixel, ri.scale(delta * this.scrollWheelMultiplierForDeltaPixel));
		} else if (deltaMode === 1) { // line; firefox
			delta = clamp(-maxPixel, maxPixel, ri.scale(delta * this.pixelPerLine * this.scrollWheelMultiplierForDeltaPixel));
		} else if (deltaMode === 2) { // page
			delta = delta < 0 ? -maxPixel : maxPixel;
		}

		return delta;
	}

	/*
	 * wheel event handler;
	 * - for horizontal scroll, supports wheel action on any children nodes since web engine cannot suppor this
	 * - for vertical scroll, supports wheel action on scrollbars only
	 */
	onWheel (e) {
		const
			bounds = this.getScrollBounds(),
			canScrollHorizontally = this.canScrollHorizontally(bounds),
			canScrollVertically = this.canScrollVertically(bounds),
			eventDeltaMode = e.deltaMode,
			eventDelta = (-e.wheelDeltaY || e.deltaY);
		let
			delta = 0,
			needToHideThumb = false;

		if (typeof window !== 'undefined') {
			window.document.activeElement.blur();
		}

		this.showThumb(bounds);

		// FIXME This routine is a temporary support for horizontal wheel scroll.
		// FIXME If web engine supports horizontal wheel, this routine should be refined or removed.
		if (canScrollVertically) { // This routine handles wheel events on scrollbars for vertical scroll.
			if (eventDelta < 0 && this.scrollTop > 0 || eventDelta > 0 && this.scrollTop < bounds.maxTop) {
				const {horizontalScrollbarRef, verticalScrollbarRef} = this;

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
			this.startHidingThumb();
		}
	}

	onScroll (e) {
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

		this.startHidingThumb();
		this.scrollStopJob.start();
	}

	scrollByPage = (keyCode) => {
		// Only scroll by page when the vertical scrollbar is visible. Otherwise, treat the
		// scroller as a plain container
		if (!this.state.isVerticalScrollbarVisible) return;

		const
			bounds = this.getScrollBounds(),
			canScrollVertically = this.canScrollVertically(bounds),
			pageDistance = isPageUp(keyCode) ? (this.pageDistance * -1) : this.pageDistance;

		this.scrollToAccumulatedTarget(pageDistance, canScrollVertically);
	}

	onKeyDown = (e) => {
		if (isPageUp(e.keyCode) || isPageDown(e.keyCode)) {
			e.preventDefault();
			if (!e.repeat) {
				this.scrollByPage(e.keyCode);
			}
		}
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
		this.scrolling = false;
		this.doScrollStop();
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
		}
	}

	stopScrolling () {
		this.start(this.scrollLeft + 0.1, this.scrollTop + 0.1, false);
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
			this.scrollToInfo = null;
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

	startHidingThumb = () => {
		if (this.state.isHorizontalScrollbarVisible && this.horizontalScrollbarRef) {
			this.horizontalScrollbarRef.startHidingThumb();
		}
		if (this.state.isVerticalScrollbarVisible && this.verticalScrollbarRef) {
			this.verticalScrollbarRef.startHidingThumb();
		}
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

			if (curHorizontalScrollbarVisible && this.horizontalScrollbarRef) {
				this.horizontalScrollbarRef.update(updatedBounds);
			}
			if (curVerticalScrollbarVisible && this.verticalScrollbarRef) {
				this.verticalScrollbarRef.update(updatedBounds);
			}
			return true;
		}
		return false;
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

	bindEventHandlers () {
		// FIXME event handlers don't work on the v8 snapshot.
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onWheel = this.onWheel.bind(this);
		this.onScroll = this.onScroll.bind(this);
	}

	addEventListeners () {
		const
			{containerRef} = this,
			childContainerRef = this.childRef.containerRef;

		if (containerRef && containerRef.addEventListener) {
			// FIXME event handlers don't work on the v8 snapshot.
			containerRef.addEventListener('mousedown', this.onMouseDown);
			containerRef.addEventListener('mouseleave', this.onMouseLeave);
			containerRef.addEventListener('mousemove', this.onMouseMove);
			containerRef.addEventListener('mouseup', this.onMouseUp);
			containerRef.addEventListener('wheel', this.onWheel);
		}
		if (childContainerRef && childContainerRef.addEventListener) {
			// FIXME event handlers don't work on the v8 snapshot.
			childContainerRef.addEventListener('scroll', this.onScroll, {capture: true});
		}

		childContainerRef.style.scrollBehavior = 'smooth';
	}

	removeEventListeners () {
		const
			{containerRef} = this,
			childContainerRef = this.childRef.containerRef;

		if (containerRef && containerRef.removeEventListener) {
			// FIXME `onWheel` doesn't work on the v8 snapshot.
			containerRef.removeEventListener('mousedown', this.onMouseDown);
			containerRef.removeEventListener('mouseleave', this.onMouseLeave);
			containerRef.removeEventListener('mousemove', this.onMouseMove);
			containerRef.removeEventListener('mouseup', this.onMouseUp);
			containerRef.removeEventListener('wheel', this.onWheel);
		}
		if (childContainerRef && childContainerRef.removeEventListener) {
			// FIXME event handlers don't work on the v8 snapshot.
			childContainerRef.removeEventListener('scroll', this.onScroll, {capture: true});
		}
	}

	// render

	initRef (prop) {
		return (ref) => {
			this[prop] = ref;
		};
	}

	render () {
		const
			{className, style, wrapped: Wrapped, ...rest} = this.props,
			{isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state,
			scrollableClasses = classNames(css.scrollable, className);

		delete rest.cbScrollTo;
		delete rest.horizontalScrollbar;
		delete rest.onScroll;
		delete rest.onScrollbarVisibilityChange;
		delete rest.onScrollStart;
		delete rest.onScrollStop;
		delete rest.verticalScrollbar;

		return (
			<div
				className={scrollableClasses}
				ref={this.initContainerRef}
				style={style}
			>
				<div className={css.container}>
					<Wrapped
						{...rest}
						cbScrollTo={this.scrollTo}
						className={css.content}
						ref={this.initChildRef}
					/>
					{isVerticalScrollbarVisible ? <Scrollbar {...this.verticalScrollbarProps} disabled={!isVerticalScrollbarVisible} /> : null}
				</div>
				{isHorizontalScrollbarVisible ? <Scrollbar {...this.horizontalScrollbarProps} corner={isVerticalScrollbarVisible} disabled={!isHorizontalScrollbarVisible} /> : null}
			</div>
		);
	}
}

/**
 * [ScrollableNative]{@link ui/Scrollable.ScrollableNative} is a Higher-order Component
 * that applies a Scrollable behavior to its wrapped component.
 *
 * @class ScrollableNative
 * @memberof ui/Scrollable
 * @ui
 * @private
 */
const ScrollableNative = (WrappedComponent) => (kind({
	name: 'ui:ScrollableNative',
	render: (props) => (<ScrollableBaseNative wrapped={WrappedComponent} {...props} />)
}));

export default ScrollableNative;
export {
	ScrollableNative,
	constants,
	ScrollableBaseNative
};
