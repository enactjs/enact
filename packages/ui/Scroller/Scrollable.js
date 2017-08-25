/*
 * Exports the {@link ui/Scroller.Scrollable} Higher-order Component (HOC) and
 * the {@link ui/Scroller.dataIndexAttribute} constant.
 * The default export is {@link ui/Scroller.Scrollable}.
 */

import clamp from 'ramda/src/clamp';
import classNames from 'classnames';
import {contextTypes as contextTypesRtl} from '@enact/i18n/I18nDecorator';
import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {contextTypes as contextTypesResize} from '../Resizable';
import ri from '../resolution';

import ScrollAnimator from './ScrollAnimator';
import Scrollbar from './Scrollbar';

import css from './Scrollable.less';

const
	forwardMouseDown = forward('onMouseDown'),
	forwardMouseLeave = forward('onMouseLeave'),
	forwardMouseMove = forward('onMouseMove'),
	forwardMouseUp = forward('onMouseUp'),
	forwardTouchStart = forward('onTouchStart'),
	forwardTouchMove = forward('onTouchMove'),
	forwardTouchEnd = forward('onTouchEnd'),
	forwardScroll = forward('onScroll'),
	forwardScrollStart = forward('onScrollStart'),
	forwardScrollStop = forward('onScrollStop');

const
	calcVelocity = (d, dt) => (d && dt) ? d / dt : 0,
	nop = () => {},
	perf = (typeof window === 'object') ? window.performance : {now: Date.now},
	holdTime = 50,
	scrollWheelMultiplierForDeltaPixel = 1.5, // The ratio of wheel 'delta' units to pixels scrolled.
	scrollWheelPageMultiplierForMaxPixel = 0.2, // The ratio of the maximum distance scrolled by wheel to the size of the viewport.
	pixelPerLine = 39,
	epsilon = 1,
	animationDuration = 1000;

/**
 * {@link ui/Scroller.dataIndexAttribute} is the name of a custom attribute
 * which indicates the index of an item in {@link ui/VirtualList.VirtualList}
 * or {@link ui/VirtualList.VirtualGridList}.
 *
 * @constant dataIndexAttribute
 * @memberof ui/Scroller
 * @type {String}
 * @private
 */
const dataIndexAttribute = 'data-index';

/**
 * {@link ui/Scroller.Scrollable} is a Higher-order Component
 * that applies a Scrollable behavior to its wrapped component.
 *
 * Scrollable catches `onMouseDown`, `onMouseLeave`, `onMouseMove`, `onMouseUp`, `onTouchStart`,
 * `onTouchMove` and `onTouchEnd` events
 * from its wrapped component for scrolling behaviors.
 *
 * Scrollable calls `onScrollStart`, `onScroll`, and `onScrollStop` callback functions during scroll.
 *
 * @class Scrollable
 * @memberof ui/Scroller
 * @hoc
 * @private
 */
const ScrollableHoC = hoc((config, Wrapped) => {
	return class Scrollable extends Component {
		static displayName = 'Scrollable'

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
			horizontalScrollbar: 'hidden',
			verticalScrollbar: 'hidden'
		}

		static childContextTypes = contextTypesResize
		static contextTypes = contextTypesRtl

		constructor (props) {
			super(props);

			this.state = {
				isHorizontalScrollbarVisible: props.horizontalScrollbar === 'visible',
				isVerticalScrollbarVisible: props.verticalScrollbar === 'visible'
			};

			const {onMouseDown, onMouseLeave, onMouseMove, onMouseUp, onTouchStart, onTouchMove, onTouchEnd, onWheel} = this;
			this.eventHandlers = {
				onMouseDown,
				onMouseLeave,
				onMouseMove,
				onMouseUp,
				onTouchStart,
				onTouchMove,
				onTouchEnd,
				onWheel
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
				invalidateBounds: this.enqueueForceUpdate
			};
		}

		componentDidMount () {
			this.direction = this.childRef.props.direction;
			this.updateScrollbars();
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
			this.updateScrollbars();

			if (this.scrollToInfo !== null) {
				if (!this.deferScrollTo) {
					this.scrollTo(this.scrollToInfo);
				}
			}
		}

		componentWillUnmount () {
			// Before call cancelAnimationFrame, you must send scrollStop Event.
			if (this.animator.isAnimating()) {
				this.doScrollStop();
				this.animator.stop();
			}
			this.forceUpdateJob.stop();
		}

		// status
		direction = 'vertical'
		isScrollAnimationTargetAccumulated = false
		wheelDirection = 0
		isFirstDragging = false
		isDragging = false
		deferScrollTo = true

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
			d.t = perf.now();
			d.clientX = e.clientX;
			d.clientY = e.clientY;
			d.dx = d.dy = 0;
		}

		drag (e) {
			const
				{direction} = this,
				t = perf.now(),
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
				t = perf.now();

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

		wheel (e, canScrollHorizontally, canScrollVertically) {
			const
				bounds = this.getScrollBounds(),
				deltaMode = e.deltaMode,
				wheelDeltaY = -e.wheelDeltaY;
			let
				delta = (wheelDeltaY || e.deltaY),
				maxPixel;

			if (canScrollVertically) {
				maxPixel = bounds.clientHeight * scrollWheelPageMultiplierForMaxPixel;
			} else if (canScrollHorizontally) {
				maxPixel = bounds.clientWidth * scrollWheelPageMultiplierForMaxPixel;
			} else {
				return 0;
			}

			if (deltaMode === 0) {
				delta = clamp(-maxPixel, maxPixel, ri.scale(delta * scrollWheelMultiplierForDeltaPixel));
			} else if (deltaMode === 1) { // line; firefox
				delta = clamp(-maxPixel, maxPixel, ri.scale(delta * pixelPerLine * scrollWheelMultiplierForDeltaPixel));
			} else if (deltaMode === 2) { // page
				delta = delta < 0 ? -maxPixel : maxPixel;
			}

			return delta;
		}

		// mouse event handler for JS scroller

		onMouseDown = (e) => {
			this.animator.stop();
			this.dragStart(e);
			forwardMouseDown(e);
		}

		onMouseMove = (e) => {
			if (this.isDragging) {
				const
					{dx, dy} = this.drag(e),
					bounds = this.getScrollBounds();

				if (this.isFirstDragging) {
					this.doScrollStart();
					this.isFirstDragging = false;
				}
				this.showThumb(bounds);
				this.scroll(this.scrollLeft - dx, this.scrollTop - dy);
			}
			forwardMouseMove(e);
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
						silent: true,
						duration: target.duration
					});
				}
			}
			forwardMouseUp(e);
		}

		onMouseLeave = (e) => {
			this.onMouseMove(e);
			this.onMouseUp(e);
			forwardMouseLeave(e);
		}

		// touch event handler for JS scroller

		onTouchStart = (e) => {
			this.onMouseDown(e.changedTouches[0]);
			forwardTouchStart(e);
		}

		onTouchMove = (e) => {
			this.onMouseMove(e.changedTouches[0]);
			forwardTouchMove(e);
		}

		onTouchEnd = (e) => {
			this.onMouseUp(e.changedTouches[0]);
			forwardTouchEnd(e);
		}

		onWheel = (e) => {
			e.preventDefault();
			if (!this.isDragging) {
				const
					bounds = this.getScrollBounds(),
					canScrollHorizontally = this.canScrollHorizontally(bounds),
					canScrollVertically = this.canScrollVertically(bounds),
					delta = this.wheel(e, canScrollHorizontally, canScrollVertically),
					direction = Math.sign(delta);

				if (direction !== this.wheelDirection) {
					this.isScrollAnimationTargetAccumulated = false;
					this.wheelDirection = direction;
				}
				this.scrollToAccumulatedTarget(delta, canScrollVertically);
			}
		}

		scrollToAccumulatedTarget = (delta, vertical) => {
			const silent = this.isScrollAnimationTargetAccumulated;

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
				animate: true,
				silent
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

		start ({targetX, targetY, animate = true, silent = false, duration = animationDuration}) {
			const {scrollLeft, scrollTop} = this;
			const bounds = this.getScrollBounds();

			this.animator.stop();
			if (!silent) {
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
			this.hideThumb();
			this.doScrollStop();
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
			if (this.state.isHorizontalScrollbarVisible && this.canScrollHorizontally(bounds)) {
				this.horizontalScrollbarRef.showThumb();
			}
			if (this.state.isVerticalScrollbarVisible && this.canScrollVertically(bounds)) {
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

		hideThumb () {
			if (this.state.isHorizontalScrollbarVisible) {
				this.horizontalScrollbarRef.startHidingThumb();
			}
			if (this.state.isVerticalScrollbarVisible) {
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
				// one or both scrollbars have changed visibility
				this.setState({
					isHorizontalScrollbarVisible: curHorizontalScrollbarVisible,
					isVerticalScrollbarVisible: curVerticalScrollbarVisible
				});
			} else {
				this.deferScrollTo = false;
				if (curHorizontalScrollbarVisible || curVerticalScrollbarVisible) {
					// no visibility change but need to notify whichever scrollbars are visible of the
					// updated bounds and scroll position
					const updatedBounds = {
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
				}
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

		// forceUpdate is a bit jarring and may interrupt other actions like animation so we'll
		// queue it up in case we get multiple calls (e.g. when grouped expandables toggle).
		//
		// TODO: consider replacing forceUpdate() by storing bounds in state rather than a non-
		// state member.
		enqueueForceUpdate = () => {
			this.childRef.calculateMetrics();
			this.forceUpdateJob.start();
		}

		forceUpdateJob = new Job(this.forceUpdate.bind(this), 32)

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
				props = Object.assign({}, this.props),
				{className, style} = this.props,
				{isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state,
				scrollableClasses = classNames(css.scrollable, className);

			delete props.cbScrollTo;
			delete props.className;
			delete props.horizontalScrollbar;
			delete props.onScroll;
			delete props.onScrollStart;
			delete props.onScrollStop;
			delete props.style;
			delete props.verticalScrollbar;

			return (
				<div
					className={scrollableClasses}
					ref={this.initContainerRef}
					style={style}
				>
					<div className={css.container}>
						<Wrapped
							{...props}
							{...this.eventHandlers}
							cbScrollTo={this.scrollTo}
							className={css.content}
							onScroll={this.handleScroll}
							ref={this.initChildRef}
						/>
						{isVerticalScrollbarVisible ? <Scrollbar {...this.verticalScrollbarProps} disabled={!isVerticalScrollbarVisible} /> : null}
					</div>
					{isHorizontalScrollbarVisible ? <Scrollbar {...this.horizontalScrollbarProps} disabled={!isHorizontalScrollbarVisible} /> : null}
				</div>
			);
		}
	};
});

export default ScrollableHoC;
export {dataIndexAttribute, ScrollableHoC as Scrollable};
