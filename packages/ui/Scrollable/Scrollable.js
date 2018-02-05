/*
 * Exports the {@link ui/Scroller.Scrollable} Higher-order Component (HOC) and
 * the {@link ui/Scroller.dataIndexAttribute} constant.
 * The default export is {@link ui/Scroller.Scrollable}.
 */

import clamp from 'ramda/src/clamp';
import classNames from 'classnames';
import {contextTypes as contextTypesResize} from '@enact/ui/Resizable';
import {contextTypes as contextTypesState, Publisher} from '@enact/core/internal/PubSub';
import {forward} from '@enact/core/handle';
import {is} from '@enact/core/keymap';
import {on, off} from '@enact/core/dispatcher';
import {perfNow} from '@enact/core/util';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ri from '@enact/ui/resolution';

import ScrollAnimator from './ScrollAnimator';
import Scrollbar from './Scrollbar';

import css from './Scrollable.less';

const
	forwardScroll = forward('onScroll'),
	forwardScrollStart = forward('onScrollStart'),
	forwardScrollStop = forward('onScrollStop');

const
	calcVelocity = (d, dt) => (d && dt) ? d / dt : 0,
	nop = () => {},
	holdTime = 50,
	paginationPageMultiplier = 0.8,
	epsilon = 1;

/**
 * {@link ui/Scroller.Scrollable} is a Higher-order Component
 * that applies a Scrollable behavior to its wrapped component.
 *
 * Scrollable catches `onFocus` event from its wrapped component for spotlight features,
 * and also catches `onMouseDown`, `onMouseLeave`, `onMouseMove`, `onMouseUp`, `onWheel` and `onKeyDown` events
 * from its wrapped component for scrolling behaviors.
 *
 * Scrollable calls `onScrollStart`, `onScroll`, and `onScrollStop` callback functions during scroll.
 *
 * @class Scrollable
 * @memberof ui/Scroller
 * @hoc
 * @private
 */
class Scrollable extends Component {
	static displayName = 'ui:Scrollable'

	static propTypes = /** @lends ui/Scroller.Scrollable.prototype */ {
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
		 * Called when scrollbar visibility changes
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
		verticalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden']),
		wrapped: PropTypes.func
	}

	static defaultProps = {
		cbScrollTo: nop,
		onScroll: nop,
		onScrollStart: nop,
		onScrollStop: nop,
		horizontalScrollbar: 'auto',
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
	}

	// component life cycle

	getChildContext () {
		return {
			invalidateBounds: this.enqueueForceUpdate,
			Subscriber: this.publisher.getSubscriber()
		};
	}

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
		this.updateEventListeners();
		this.updateScrollbars();

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

		this.clampScrollPosition();

		this.direction = this.childRef.props.direction;
		this.updateEventListeners();
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
		const {containerRef} = this;

		// Before call cancelAnimationFrame, you must send scrollStop Event.
		if (this.animator.isAnimating()) {
			this.doScrollStop();
			this.animator.stop();
		}

		if (containerRef && containerRef.removeEventListener) {
			// FIXME `onWheel` doesn't work on the v8 snapshot.
			containerRef.removeEventListener('wheel', this.onWheel);
		}
		off('keydown', this.onKeyDown);

		if (this.context.Subscriber) {
			this.context.Subscriber.unsubscribe('resize', this.handleSubscription);
			this.context.Subscriber.unsubscribe('i18n', this.handleSubscription);
		}
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

	// status
	direction = 'vertical'
	isScrollAnimationTargetAccumulated = false
	wheelDirection = 0
	pageDirection = 0
	isFirstDragging = false
	isDragging = false
	deferScrollTo = true
	pageDistance = 0
	isFitClientSize = false
	isUpdatedScrollThumb = false

	// constants
	animationDuration = 1000
	scrollWheelMultiplierForDeltaPixel = 1.5 // The ratio of wheel 'delta' units to pixels scrolled.
	scrollWheelPageMultiplierForMaxPixel = 0.2 // The ratio of the maximum distance scrolled by wheel to the size of the viewport.
	pixelPerLine = 39
	isPageUp = is('pageUp')
	isPageDown = is('pageDown')

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

	// scroll animator
	animator = new ScrollAnimator()

	// handle an input event

	dragStart (e) {
		const d = this.dragInfo;

		this.isDragging = true;
		this.isFirstDragging = true;
		d.t = perfNow();
		d.clientX = e.clientX;
		d.clientY = e.clientY;
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
		} else {
			d.dx = 0;
		}

		if (direction === 'vertical' || direction === 'both') {
			d.dy = e.clientY - d.clientY;
			d.clientY = e.clientY;
		} else {
			d.dy = 0;
		}

		d.t = t;

		return {dx: d.dx, dy: d.dy};
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

	clampScrollPosition () {
		const bounds = this.getScrollBounds();

		if (this.scrollTop > bounds.maxTop) {
			this.scrollTop = bounds.maxTop;
		}

		if (this.scrollLeft > bounds.maxLeft) {
			this.scrollLeft = bounds.maxLeft;
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

	// mouse event handler for JS scroller

	onMouseDown = (e) => {
		this.animator.stop();
		this.dragStart(e);
	}

	onMouseMove = (e) => {
		if (this.isDragging) {
			const
				{dx, dy} = this.drag(e),
				bounds = this.getScrollBounds();

			if (this.isFirstDragging) {
				if (!this.scrolling) {
					this.scrolling = true;
					this.doScrollStart();
				}
				this.isFirstDragging = false;
			}
			this.showThumb(bounds);
			this.scroll(this.scrollLeft - dx, this.scrollTop - dy);
		}
	}

	onMouseUp = (e) => {
		if (this.isDragging) {
			this.dragStop(e);

			if (!this.isFlicking()) {
				this.stop();
			} else {
				const
					d = this.dragInfo,
					target = this.animator.simulate(
						this.scrollLeft,
						this.scrollTop,
						calcVelocity(-d.dx, d.dt),
						calcVelocity(-d.dy, d.dt)
					);

				this.isScrollAnimationTargetAccumulated = false;
				this.start({
					targetX: target.targetX,
					targetY: target.targetY,
					animate: true,
					duration: target.duration
				});
			}
		}
	}

	onMouseLeave = (e) => {
		this.onMouseMove(e);
		this.onMouseUp();
	}

	onWheel = (e) => {
		e.preventDefault();
		if (!this.isDragging) {
			const
				bounds = this.getScrollBounds(),
				canScrollHorizontally = this.canScrollHorizontally(bounds),
				canScrollVertically = this.canScrollVertically(bounds),
				eventDeltaMode = e.deltaMode,
				eventDelta = (-e.wheelDeltaY || e.deltaY);
			let
				delta = 0,
				direction;

			if (canScrollVertically) {
				delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientHeight * this.scrollWheelPageMultiplierForMaxPixel);
			} else if (canScrollHorizontally) {
				delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientWidth * this.scrollWheelPageMultiplierForMaxPixel);
			}

			direction = Math.sign(delta);

			if (direction !== this.wheelDirection) {
				this.isScrollAnimationTargetAccumulated = false;
				this.wheelDirection = direction;
			}

			if (delta !== 0) {
				this.scrollToAccumulatedTarget(delta, canScrollVertically);
			}
		}
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
			bounds = this.getScrollBounds(),
			canScrollVertically = this.canScrollVertically(bounds),
			pageDistance = this.isPageUp(keyCode) ? (this.pageDistance * -1) : this.pageDistance;

		this.scrollToAccumulatedTarget(pageDistance, canScrollVertically);
	}

	onKeyDown = (e) => {
		if ((this.isPageUp(e.keyCode) || this.isPageDown(e.keyCode)) && !e.repeat) {
			this.scrollByPage(e.keyCode);
		}
	}

	scrollToAccumulatedTarget = (delta, vertical) => {
		if (!this.isScrollAnimationTargetAccumulated) {
			this.accumulatedTargetX = this.scrollLeft;
			this.accumulatedTargetY = this.scrollTop;
			this.isScrollAnimationTargetAccumulated = true;
		}

		if (vertical) {
			this.accumulatedTargetY = this.accumulatedTargetY + delta;
		} else {
			this.accumulatedTargetX = this.accumulatedTargetX + delta;
		}

		this.start({
			targetX: this.accumulatedTargetX,
			targetY: this.accumulatedTargetY,
			animate: true
		});
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

	// scroll start/stop

	start ({targetX, targetY, animate = true, duration = this.animationDuration}) {
		const {scrollLeft, scrollTop} = this;
		const bounds = this.getScrollBounds();

		this.animator.stop();
		if (!this.scrolling) {
			this.scrolling = true;
			this.doScrollStart();
		}

		if (Math.abs(bounds.maxLeft - targetX) < epsilon) {
			targetX = bounds.maxLeft;
		}
		if (Math.abs(bounds.maxTop - targetY) < epsilon) {
			targetY = bounds.maxTop;
		}

		this.showThumb(bounds);

		if (animate) {
			this.animator.animate(this.scrollAnimation({
				sourceX: scrollLeft,
				sourceY: scrollTop,
				targetX,
				targetY,
				duration
			}));
		} else {
			targetX = clamp(0, bounds.maxLeft, targetX);
			targetY = clamp(0, bounds.maxTop, targetY);

			this.scroll(targetX, targetY);
			this.stop();
		}
	}

	scrollAnimation = (animationInfo) => (curTime) => {
		const
			{sourceX, sourceY, targetX, targetY, duration} = animationInfo,
			bounds = this.getScrollBounds();

		if (curTime < duration) {
			this.scroll(
				this.canScrollHorizontally(bounds) ? clamp(0, bounds.maxLeft, this.animator.timingFunction(sourceX, targetX, duration, curTime)) : sourceX,
				this.canScrollVertically(bounds) ? clamp(0, bounds.maxTop, this.animator.timingFunction(sourceY, targetY, duration, curTime)) : sourceY
			);
		} else {
			this.scroll(
				clamp(0, bounds.maxLeft, targetX),
				clamp(0, bounds.maxTop, targetY)
			);
			this.stop();
		}
	}

	scroll = (left, top) => {
		let
			dirX = 0,
			dirY = 0;

		if (left !== this.scrollLeft) {
			dirX = Math.sign(left - this.scrollLeft);
			this.setScrollLeft(left);
		}
		if (top !== this.scrollTop) {
			dirY = Math.sign(top - this.scrollTop);
			this.setScrollTop(top);
		}

		this.childRef.setScrollPosition(this.scrollLeft, this.scrollTop, dirX, dirY);
		this.doScrolling();
	}

	stop () {
		this.animator.stop();
		this.isScrollAnimationTargetAccumulated = false;
		this.startHidingThumb();
		if (this.scrolling) {
			this.scrolling = false;
			this.doScrollStop();
		}
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
			this.start({
				targetX: (left !== null) ? left : this.scrollLeft,
				targetY: (top !== null) ? top : this.scrollTop,
				animate: opt.animate
			});
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

	updateEventListeners = () => {
		const
			{containerRef} = this,
			childContainerRef = this.childRef.containerRef;

		if (containerRef && containerRef.addEventListener) {
			// FIXME `onWheel` doesn't work on the v8 snapshot.
			containerRef.addEventListener('wheel', this.onWheel);
		}
		if (childContainerRef && childContainerRef.addEventListener) {
			// FIXME `onFocus` doesn't work on the v8 snapshot.
			childContainerRef.addEventListener('focusin', this.onFocus);
		}
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

	handleScroll = () => {
		if (!this.animator.isAnimating() && this.childRef && this.childRef.containerRef) {
			this.childRef.containerRef.scrollTop = this.scrollTop;
			this.childRef.containerRef.scrollLeft = this.scrollLeft;
		}
	}

	render () {
		const
			{className, wrapped: Wrapped, style, ...rest} = this.props,
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
						onScroll={this.handleScroll}
						ref={this.initChildRef}
					/>
					{isVerticalScrollbarVisible ? <Scrollbar {...this.verticalScrollbarProps} disabled={!isVerticalScrollbarVisible} /> : null}
				</div>
				{isHorizontalScrollbarVisible ? <Scrollbar {...this.horizontalScrollbarProps} corner={isVerticalScrollbarVisible} disabled={!isHorizontalScrollbarVisible} /> : null}
			</div>
		);
	}
}

export default Scrollable;
export {Scrollable};
