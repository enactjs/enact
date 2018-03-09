/**
 * Provides unstyled scrollable components and behaviors to be customized by a theme or application.
 *
 * @module ui/Scrollable
 * @exports Scrollable
 * @exports constants
 * @exports ScrollableBase
 * @private
 */

import clamp from 'ramda/src/clamp';
import classNames from 'classnames';
import {contextTypes as contextTypesState, Publisher} from '@enact/core/internal/PubSub';
import {forward} from '@enact/core/handle';
import {is} from '@enact/core/keymap';
import {on, off} from '@enact/core/dispatcher';
import {perfNow} from '@enact/core/util';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {contextTypes as contextTypesResize} from '../Resizable';
import ri from '../resolution';

import ScrollAnimator from './ScrollAnimator';
import Scrollbar from './Scrollbar';

import css from './Scrollable.less';

const
	constants = {
		animationDuration: 1000,
		calcVelocity: (d, dt) => (d && dt) ? d / dt : 0,
		epsilon: 1,
		holdTime: 50,
		isPageDown: is('pageDown'),
		isPageUp: is('pageUp'),
		nop: () => {},
		paginationPageMultiplier: 0.8,
		scrollWheelPageMultiplierForMaxPixel: 0.2 // The ratio of the maximum distance scrolled by wheel to the size of the viewport.
	},
	{
		animationDuration,
		calcVelocity,
		epsilon,
		holdTime,
		isPageDown,
		isPageUp,
		nop,
		paginationPageMultiplier,
		scrollWheelPageMultiplierForMaxPixel
	} = constants;

/**
 * A Higher-order Component that applies a Scrollable behavior to its wrapped component.
 *
 * @class Scrollable
 * @memberof ui/Scrollable
 * @ui
 * @private
 */
class ScrollableBase extends Component {
	static displayName = 'ui:ScrollableBase'

	static propTypes = /** @lends ui/Scrollable.Scrollable.prototype */ {
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

		onKeyDown: PropTypes.func,

		onMouseUp: PropTypes.func,

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
		 * @private
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

		onWheel: PropTypes.func,

		removeEventListeners: PropTypes.func,

		/**
		 * Render function for Scrollable
		 *
		 * @type {Function}
		 * @public
		 */
		render: PropTypes.func,

		scrollTo: PropTypes.func,

		stop: PropTypes.func,

		/**
		 * Scrollable CSS style.
		 * Should be defined because we manuplate style prop in render().
		 *
		 * @type {Object}
		 * @public
		 */
		style: PropTypes.object,

		updateEventListeners: PropTypes.func,

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
		this.updateEventListeners();
		this.updateScrollbars();

		on('keydown', this.onKeyDown);
	}

	componentWillUpdate () {
		this.deferScrollTo = true;
	}

	componentDidUpdate (prevProps, prevState) {
		const
			{isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state,
			{hasDataSizeChanged} = this.childRef;

		// Need to sync calculated client size if it is different from the real size
		if (this.childRef.syncClientSize) {
			// If we actually synced, we need to reset scroll position.
			if (this.childRef.syncClientSize()) {
				this.setScrollLeft(0);
				this.setScrollTop(0);
			}
		}

		this.clampScrollPosition();

		this.direction = this.childRef.props.direction;
		this.updateEventListeners();
		if (
			hasDataSizeChanged === false &&
			(isHorizontalScrollbarVisible && !prevState.isHorizontalScrollbarVisible || isVerticalScrollbarVisible && !prevState.isVerticalScrollbarVisible)
		) {
			this.deferScrollTo = false;
			this.isUpdatedScrollThumb = this.updateScrollThumbSize();
		} else {
			this.updateScrollbars();
		}

		if (this.scrollToInfo !== null) {
			if (!this.deferScrollTo) {
				this.scrollTo(this.scrollToInfo);
			}
		}

		// publish container resize changes
		const horizontal = isHorizontalScrollbarVisible !== prevState.isHorizontalScrollbarVisible;
		const vertical = isVerticalScrollbarVisible !== prevState.isVerticalScrollbarVisible;
		if (horizontal || vertical) {
			this.publisher.publish({
				horizontal,
				vertical
			});
		}
	}

	componentWillUnmount () {
		// Before call cancelAnimationFrame, you must send scrollStop Event.
		if (this.animator.isAnimating()) {
			this.forwardScrollEvent('onScrollStop');
			this.animator.stop();
		}

		this.removeEventListeners();
		off('keydown', this.onKeyDown);

		if (this.context.Subscriber) {
			this.context.Subscriber.unsubscribe('resize', this.handleSubscription);
			this.context.Subscriber.unsubscribe('i18n', this.handleSubscription);
		}

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

	clampScrollPosition () {
		const bounds = this.getScrollBounds();

		if (this.scrollTop > bounds.maxTop) {
			this.scrollTop = bounds.maxTop;
		}

		if (this.scrollLeft > bounds.maxLeft) {
			this.scrollLeft = bounds.maxLeft;
		}
	}

	// constants
	pixelPerLine = 39
	scrollWheelMultiplierForDeltaPixel = 1.5 // The ratio of wheel 'delta' units to pixels scrolled.

	// status
	direction = 'vertical'
	isScrollAnimationTargetAccumulated = false
	wheelDirection = 0
	pageDirection = 0
	isFirstDragging = false
	isDragging = false
	deferScrollTo = true
	pageDistance = 0
	isUpdatedScrollThumb = false

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

	dragStart (ev) {
		const d = this.dragInfo;

		this.isDragging = true;
		this.isFirstDragging = true;
		d.t = perfNow();
		d.clientX = ev.clientX;
		d.clientY = ev.clientY;
		d.dx = d.dy = 0;
	}

	drag (ev) {
		const
			{direction} = this,
			t = perfNow(),
			d = this.dragInfo;

		if (direction === 'horizontal' || direction === 'both') {
			d.dx = ev.clientX - d.clientX;
			d.clientX = ev.clientX;
		} else {
			d.dx = 0;
		}

		if (direction === 'vertical' || direction === 'both') {
			d.dy = ev.clientY - d.clientY;
			d.clientY = ev.clientY;
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

	// mouse event handler for JS scroller

	onMouseDown = (ev) => {
		this.animator.stop();
		this.dragStart(ev);
	}

	onMouseMove = (ev) => {
		if (this.isDragging) {
			const
				{dx, dy} = this.drag(ev),
				bounds = this.getScrollBounds();

			if (this.isFirstDragging) {
				if (!this.scrolling) {
					this.scrolling = true;
					this.forwardScrollEvent('onScrollStart');
				}
				this.isFirstDragging = false;
			}
			this.showThumb(bounds);
			this.scroll(this.scrollLeft - dx, this.scrollTop - dy);
		}
	}

	onMouseUp = (ev) => {
		forward('onMouseUp', ev, this.props);

		if (this.isDragging) {
			this.dragStop(ev);

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

	onMouseLeave = (ev) => {
		this.onMouseMove(ev);
		this.onMouseUp();
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

	onWheel = (ev) => {
		ev.preventDefault();

		if (!this.isDragging) {
			const
				{verticalScrollbarRef, horizontalScrollbarRef} = this,
				bounds = this.getScrollBounds(),
				canScrollHorizontally = this.canScrollHorizontally(bounds),
				canScrollVertically = this.canScrollVertically(bounds),
				eventDeltaMode = ev.deltaMode,
				eventDelta = (-ev.wheelDeltaY || ev.deltaY);
			let
				delta = 0,
				direction;

			if (canScrollVertically) {
				delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientHeight * scrollWheelPageMultiplierForMaxPixel);
			} else if (canScrollHorizontally) {
				delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientWidth * scrollWheelPageMultiplierForMaxPixel);
			}

			direction = Math.sign(delta);

			if (direction !== this.wheelDirection) {
				this.isScrollAnimationTargetAccumulated = false;
				this.wheelDirection = direction;
			}

			forward('onWheel', {delta, horizontalScrollbarRef, verticalScrollbarRef}, this.props);

			if (delta !== 0) {
				this.scrollToAccumulatedTarget(delta, canScrollVertically);
			}
		}
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

	onKeyDown = (ev) => {
		if (this.props.onKeyDown) {
			forward('onKeyDown', ev, this.props);
		} else if ((isPageUp(ev.keyCode) || isPageDown(ev.keyCode)) && !ev.repeat) {
			this.scrollByPage(ev.keyCode);
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

	forwardScrollEvent (type) {
		forward(type, {scrollLeft: this.scrollLeft, scrollTop: this.scrollTop, moreInfo: this.getMoreInfo()}, this.props);
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

	start ({targetX, targetY, animate = true, duration = animationDuration}) {
		const {scrollLeft, scrollTop} = this;
		const bounds = this.getScrollBounds();

		this.animator.stop();
		if (!this.scrolling) {
			this.scrolling = true;
			this.forwardScrollEvent('onScrollStart');
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
		this.forwardScrollEvent('onScroll');
	}

	stop () {
		const {stop} = this.props;

		this.animator.stop();
		this.isScrollAnimationTargetAccumulated = false;
		this.startHidingThumb();
		if (stop) {
			stop();
		}
		if (this.scrolling) {
			this.scrolling = false;
			this.forwardScrollEvent('onScrollStop');
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
			const
				{left, top} = this.getPositionForScrollTo(opt),
				{scrollTo} = this.props;

			if (scrollTo) {
				scrollTo(opt);
			}
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

	updateEventListeners () {
		const {containerRef} = this;
		if (containerRef && containerRef.addEventListener) {
			// FIXME `onWheel` doesn't work on the v8 snapshot.
			containerRef.addEventListener('wheel', this.onWheel);
		}

		if (this.props.updateEventListeners) {
			this.props.updateEventListeners(this.childRef.containerRef);
		}
	}

	removeEventListeners () {
		const {containerRef} = this;

		if (containerRef && containerRef.removeEventListener) {
			// FIXME `onWheel` doesn't work on the v8 snapshot.
			containerRef.removeEventListener('wheel', this.onWheel);
		}

		if (this.props.removeEventListeners) {
			this.props.removeEventListeners(this.childRef.containerRef);
		}
	}

	// render

	initRef = (prop) => {
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
			{className, render, style, ...rest} = this.props,
			{isHorizontalScrollbarVisible, isVerticalScrollbarVisible, rtl} = this.state,
			scrollableClasses = classNames(css.scrollable, className);

		delete rest.cbScrollTo;
		delete rest.horizontalScrollbar;
		delete rest.onKeyDown;
		delete rest.onMouseUp;
		delete rest.onScroll;
		delete rest.onScrollbarVisibilityChange;
		delete rest.onScrollStart;
		delete rest.onScrollStop;
		delete rest.onWheel;
		delete rest.removeEventListeners;
		delete rest.scrollTo;
		delete rest.stop;
		delete rest.updateEventListeners;
		delete rest.verticalScrollbar;

		rest.rtl = rtl;

		return render({
			childComponentProps: rest,
			className: scrollableClasses,
			componentCss: css,
			handleScroll: this.handleScroll,
			horizontalScrollbarProps: this.horizontalScrollbarProps,
			initContainerRef: this.initContainerRef,
			initUiChildRef: this.initChildRef,
			isHorizontalScrollbarVisible,
			isVerticalScrollbarVisible,
			scrollTo: this.scrollTo,
			style,
			verticalScrollbarProps: this.verticalScrollbarProps
		});
	}
}

class Scrollable extends Component {
	static displayName = 'ui:Scrollable'

	static propTypes = {
		/**
		 * Component for child
		 *
		 * @type {Function}
		 * @public
		 */
		render: PropTypes.func
	}

	render () {
		const {render, ...rest} = this.props;

		return (
			<ScrollableBase
				{...rest}
				render={({ // eslint-disable-line react/jsx-no-bind
					childComponentProps,
					className,
					componentCss,
					handleScroll,
					horizontalScrollbarProps,
					initContainerRef,
					initUiChildRef,
					isHorizontalScrollbarVisible,
					isVerticalScrollbarVisible,
					scrollTo,
					style,
					verticalScrollbarProps
				}) => (
					<div
						className={className}
						ref={initContainerRef}
						style={style}
					>
						<div className={componentCss.container}>
							{render({
								...childComponentProps,
								cbScrollTo: scrollTo,
								className: componentCss.content,
								onScroll: handleScroll,
								ref: initUiChildRef
							})}
							{isVerticalScrollbarVisible ? <Scrollbar {...verticalScrollbarProps} disabled={!isVerticalScrollbarVisible} /> : null}
						</div>
						{isHorizontalScrollbarVisible ? <Scrollbar {...horizontalScrollbarProps} corner={isVerticalScrollbarVisible} disabled={!isHorizontalScrollbarVisible} /> : null}
					</div>
				)}
			/>
		);
	}
}

export default Scrollable;
export {
	Scrollable,
	ScrollableBase,
	constants
};
