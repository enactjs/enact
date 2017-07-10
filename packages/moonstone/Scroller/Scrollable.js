/*
 * Exports the {@link moonstone/Scroller.Scrollable} Higher-order Component (HOC) and
 * the {@link moonstone/Scroller.dataIndexAttribute} constant.
 * The default export is {@link moonstone/Scroller.Scrollable}.
 */

import clamp from 'ramda/src/clamp';
import classNames from 'classnames';
import {contextTypes} from '@enact/ui/Resizable';
import deprecate from '@enact/core/internal/deprecate';
import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ri from '@enact/ui/resolution';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

import ScrollAnimator from './ScrollAnimator';
import Scrollbar from './Scrollbar';

import css from './Scrollable.less';
import scrollbarCss from './Scrollbar.less';

const
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
	paginationPageMultiplier = 0.8,
	epsilon = 1,
	animationDuration = 1000;

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
			if (!focusableScrollbar && elem.classList.contains(scrollbarCss.scrollButton) && !Spotlight.getPointerMode()) {
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
 * {@link moonstone/Scroller.Scrollable} is a Higher-order Component
 * that applies a Scrollable behavior to its wrapped component.
 *
 * Scrollable catches `onFocus` event from its wrapped component for spotlight features,
 * and also catches `onMouseDown`, `onMouseLeave`, `onMouseMove`, `onMouseUp`, and `onWheel` events
 * from its wrapped component for scrolling behaviors.
 *
 * Scrollable calls `onScrollStart`, `onScroll`, and `onScrollStop` callback functions during scroll.
 *
 * @class Scrollable
 * @memberof moonstone/Scroller
 * @hoc
 * @private
 */
const ScrollableHoC = hoc((config, Wrapped) => {
	return class Scrollable extends Component {
		static displayName = 'Scrollable'

		static propTypes = /** @lends moonstone/Scroller.Scrollable.prototype */ {
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

		static childContextTypes = contextTypes

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
				onPrevScroll: this.onScrollbarBtnHandler,
				onNextScroll: this.onScrollbarBtnHandler
			};

			this.horizontalScrollbarProps = {
				ref: this.initRef('horizontalScrollbarRef'),
				vertical: false,
				onPrevScroll: this.onScrollbarBtnHandler,
				onNextScroll: this.onScrollbarBtnHandler
			};

			props.cbScrollTo(this.scrollTo);
		}

		componentDidMount () {
			this.updateEventListeners();
		}

		componentDidUpdate () {
			this.isInitializing = false;

			// Need to sync calculated client size if it is different from the real size
			if (this.childRef.syncClientSize) {
				this.childRef.syncClientSize();
			}

			this.updateEventListeners();

			if (this.scrollToInfo !== null) {
				this.scrollTo(this.scrollToInfo);
			} else {
				this.updateScrollOnFocus();
			}
		}

		componentWillUnmount () {
			const
				{containerRef} = this,
				childContainerRef = this.childRef.containerRef;

			// Before call cancelAnimationFrame, you must send scrollStop Event.
			if (this.animator.isAnimating()) {
				this.doScrollStop();
				this.animator.stop();
			}
			this.forceUpdateJob.stop();

			if (containerRef && containerRef.removeEventListener) {
				// FIXME `onWheel` doesn't work on the v8 snapshot.
				containerRef.removeEventListener('wheel', this.onWheel);
			}
			if (childContainerRef && childContainerRef.removeEventListener) {
				// FIXME `onFocus` doesn't work on the v8 snapshot.
				childContainerRef.removeEventListener('focus', this.onFocus, true);
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

		getChildContext () {
			return {
				invalidateBounds: this.enqueueForceUpdate
			};
		}

		// status
		isScrollAnimationTargetAccumulated = false
		wheelDirection = 0
		isFirstDragging = false
		isDragging = false
		isKeyDown = false
		isInitializing = true

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

		// spotlight
		lastFocusedItem = null

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
				t = perf.now(),
				d = this.dragInfo,
				bounds = this.getScrollBounds();

			if (this.isHorizontallyScrollable(bounds)) {
				d.dx = e.clientX - d.clientX;
				d.clientX = e.clientX;
			} else {
				d.dx = 0;
			}

			if (this.isVerticallyScrollable(bounds)) {
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

		wheel (e, isHorizontallyScrollable, isVerticallyScrollable) {
			const
				bounds = this.getScrollBounds(),
				deltaMode = e.deltaMode,
				wheelDeltaY = -e.wheelDeltaY;
			let
				delta = (wheelDeltaY || e.deltaY),
				maxPixel;

			if (isVerticallyScrollable) {
				maxPixel = bounds.clientHeight * scrollWheelPageMultiplierForMaxPixel;
			} else if (isHorizontallyScrollable) {
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
						),
						focusedItem = Spotlight.getCurrent();

					if (focusedItem) {
						focusedItem.blur();
					}
					this.childRef.setContainerDisabled(true);
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
		}

		onMouseLeave = (e) => {
			this.onMouseMove(e);
			this.onMouseUp();
		}

		startScrollOnFocus = (pos, item) => {
			if (pos) {
				if (pos.left !== this.scrollLeft || pos.top !== this.scrollTop) {
					this.start({
						targetX: pos.left,
						targetY: pos.top,
						animate: (animationDuration > 0),
						silent: false,
						duration: animationDuration
					});
				}
				this.lastFocusedItem = item;
			}
		}

		onFocus = (e) => {
			if (!(Spotlight.getPointerMode() || this.isDragging)) {
				const
					item = e.target,
					positionFn = this.childRef.calculatePositionOnFocus,
					spotItem = Spotlight.getCurrent();

				if (item && item !== this.lastFocusedItem && item === spotItem && positionFn) {
					const pos = positionFn(item);
					this.startScrollOnFocus(pos, item);
				}
			}
		}

		onWheel = (e) => {
			e.preventDefault();
			if (!this.isDragging) {
				const
					bounds = this.getScrollBounds(),
					isHorizontallyScrollable = this.isHorizontallyScrollable(bounds),
					isVerticallyScrollable = this.isVerticallyScrollable(bounds),
					delta = this.wheel(e, isHorizontallyScrollable, isVerticallyScrollable),
					direction = Math.sign(delta),
					focusedItem = Spotlight.getCurrent();

				Spotlight.setPointerMode(false);
				if (focusedItem) {
					focusedItem.blur();
				}

				this.childRef.setContainerDisabled(true);

				if (direction !== this.wheelDirection) {
					this.isScrollAnimationTargetAccumulated = false;
					this.wheelDirection = direction;
				}
				this.scrollToAccumulatedTarget(delta, isVerticallyScrollable);
			}
		}

		onScrollbarBtnHandler = (ev) => {
			const
				{vertical: isVerticalScrollBar} = ev.scrollbar,
				{previous: isPreviousScrollButton} = ev.scrollButton,
				bounds = this.getScrollBounds(),
				isScrollingHorizontally = this.isHorizontallyScrollable(bounds) && !isVerticalScrollBar,
				isScrollingVertically = this.isVerticallyScrollable(bounds) && isVerticalScrollBar,
				pageDistance = (isScrollingVertically ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier;

			if (isScrollingHorizontally || isScrollingVertically) {
				this.scrollToAccumulatedTarget(isPreviousScrollButton ? -pageDistance : pageDistance, isScrollingVertically);
			}
		}

		scrollToAccumulatedTarget = (delta, isScrollingVertically) => {
			const silent = this.isScrollAnimationTargetAccumulated;

			if (!this.isScrollAnimationTargetAccumulated) {
				this.accumulatedTargetX = this.scrollLeft;
				this.accumulatedTargetY = this.scrollTop;
				this.isScrollAnimationTargetAccumulated = true;
			}

			if (isScrollingVertically) {
				this.accumulatedTargetY = this.accumulatedTargetY + delta;
			} else { // isScrollingHorizontally
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

		setScrollLeft (v) {
			const bounds = this.getScrollBounds();

			this.scrollLeft = clamp(0, bounds.maxLeft, v);
			if (this.isHorizontalScrollbarScrollable(bounds)) {
				this.updateThumb(this.horizontalScrollbarRef, bounds);
			}
		}

		setScrollTop (v) {
			const bounds = this.getScrollBounds();

			this.scrollTop = clamp(0, bounds.maxTop, v);
			if (this.isVerticalScrollbarScrollable(bounds)) {
				this.updateThumb(this.verticalScrollbarRef, bounds);
			}
		}

		// scroll start/stop

		start ({targetX, targetY, animate = true, silent = false, duration = animationDuration, indexToFocus, nodeToFocus}) {
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
					duration,
					indexToFocus,
					nodeToFocus
				}));
			} else {
				targetX = clamp(0, bounds.maxLeft, targetX);
				targetY = clamp(0, bounds.maxTop, targetY);

				this.scroll(targetX, targetY);
				this.stop({indexToFocus, nodeToFocus});
			}
		}

		scrollAnimation = (animationInfo) => (curTime) => {
			const
				{sourceX, sourceY, targetX, targetY, duration, indexToFocus, nodeToFocus} = animationInfo,
				bounds = this.getScrollBounds();

			if (curTime < duration) {
				this.scroll(
					this.isHorizontallyScrollable(bounds) ? clamp(0, bounds.maxLeft, this.animator.timingFunction(sourceX, targetX, duration, curTime)) : sourceX,
					this.isVerticallyScrollable(bounds) ? clamp(0, bounds.maxTop, this.animator.timingFunction(sourceY, targetY, duration, curTime)) : sourceY
				);
			} else {
				this.scroll(
					clamp(0, bounds.maxLeft, targetX),
					clamp(0, bounds.maxTop, targetY)
				);
				this.stop({indexToFocus, nodeToFocus});
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

		stop ({indexToFocus, nodeToFocus}) {
			const bounds = this.getScrollBounds();

			this.animator.stop();
			this.isScrollAnimationTargetAccumulated = false;
			this.childRef.setContainerDisabled(false);
			this.lastFocusedItem = null;
			this.hideThumb(bounds);
			if (indexToFocus !== null && typeof this.childRef.focusByIndex === 'function') {
				this.childRef.focusByIndex(indexToFocus);
			}
			if (nodeToFocus !== null && typeof this.childRef.focusOnNode === 'function') {
				this.childRef.focusOnNode(nodeToFocus);
			}
			this.doScrollStop();
		}

		// scrollTo API

		getPositionForScrollTo = (opt) => {
			const
				bounds = this.getScrollBounds(),
				isHorizontallyScrollable = this.isHorizontallyScrollable(bounds),
				isVerticallyScrollable = this.isVerticallyScrollable(bounds);
			let
				itemPos,
				left = null,
				top = null;

			if (opt instanceof Object) {
				if (opt.position instanceof Object) {
					if (isHorizontallyScrollable) {
						// We need '!=' to check if opt.potision.x is null or undefined
						left = opt.position.x != null ? opt.position.x : this.scrollLeft;
					} else {
						left = 0;
					}
					if (isVerticallyScrollable) {
						// We need '!=' to check if opt.potision.y is null or undefined
						top = opt.position.y != null ? opt.position.y : this.scrollTop;
					} else {
						top = 0;
					}
				} else if (typeof opt.align === 'string') {
					if (isHorizontallyScrollable) {
						if (opt.align.includes('left')) {
							left = 0;
						} else if (opt.align.includes('right')) {
							left = bounds.maxLeft;
						}
					}
					if (isVerticallyScrollable) {
						if (opt.align.includes('top')) {
							top = 0;
						} else if (opt.align.includes('bottom')) {
							top = bounds.maxTop;
						}
					}
				} else {
					if (typeof opt.index === 'number' && typeof this.childRef.getItemPosition === 'function') {
						itemPos = this.childRef.getItemPosition(opt.index);
					} else if (opt.node instanceof Object) {
						if (opt.node.nodeType === 1 && typeof this.childRef.getNodePosition === 'function') {
							itemPos = this.childRef.getNodePosition(opt.node);
						}
					}
					if (itemPos) {
						if (isHorizontallyScrollable) {
							left = itemPos.left;
						}
						if (isVerticallyScrollable) {
							top = itemPos.top;
						}
					}
				}
			}

			return {left, top};
		}

		scrollTo = (opt) => {
			if (!this.isInitializing) {
				const {left, top} = this.getPositionForScrollTo(opt);
				let indexToFocus = null;
				this.scrollToInfo = null;

				if (typeof opt.indexToFocus === 'number') {
					indexToFocus = opt.indexToFocus;
					deprecate({name: 'indexToFocus', since: '1.2.0', message: 'Use `focus` instead', until: '2.0.0'});
				}

				this.start({
					targetX: (left !== null) ? left : this.scrollLeft,
					targetY: (top !== null) ? top : this.scrollTop,
					animate: opt.animate,
					indexToFocus: (opt.focus && typeof opt.index === 'number') ? opt.index : indexToFocus,
					nodeToFocus:  (opt.focus && opt.node instanceof Object && opt.node.nodeType === 1) ? opt.node : null
				});
			} else {
				this.scrollToInfo = opt;
			}
		}

		isHorizontallyScrollable = (bounds) => {
			return this.childRef.isHorizontal() && (bounds.scrollWidth > bounds.clientWidth) && !isNaN(bounds.scrollWidth);
		}

		isVerticallyScrollable = (bounds) => {
			return this.childRef.isVertical() && (bounds.scrollHeight > bounds.clientHeight) && !isNaN(bounds.scrollHeight);
		}

		// scroll bar

		isHorizontalScrollbarScrollable = (bounds) => this.state.isHorizontalScrollbarVisible && this.isHorizontallyScrollable(bounds)

		isVerticalScrollbarScrollable = (bounds) => this.state.isVerticalScrollbarVisible && this.isVerticallyScrollable(bounds)

		getHorizontalScrollbarVisible () {
			const
				{horizontalScrollbar} = this.props,
				bounds = this.getScrollBounds();

			return (horizontalScrollbar === 'auto') ? this.isHorizontallyScrollable(bounds) : horizontalScrollbar === 'visible';
		}

		getVerticalScrollbarVisible () {
			const
				{verticalScrollbar} = this.props,
				bounds = this.getScrollBounds();

			return (verticalScrollbar === 'auto') ? this.isVerticallyScrollable(bounds) : verticalScrollbar === 'visible';
		}

		showThumb (bounds) {
			if (this.isHorizontalScrollbarScrollable(bounds)) {
				this.horizontalScrollbarRef.showThumb();
			}
			if (this.isVerticalScrollbarScrollable(bounds)) {
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

		hideThumb (bounds) {
			if (this.isHorizontalScrollbarScrollable(bounds)) {
				this.horizontalScrollbarRef.startHidingThumb();
			}
			if (this.isVerticalScrollbarScrollable(bounds)) {
				this.verticalScrollbarRef.startHidingThumb();
			}
		}

		updateScrollbars = () => {
			const
				{isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state,
				bounds = this.getScrollBounds(),
				curHorizontalScrollbarVisible = this.getHorizontalScrollbarVisible(),
				curVerticalScrollbarVisible = this.getVerticalScrollbarVisible();

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
				this.isInitializing = false;
				if (curHorizontalScrollbarVisible || curVerticalScrollbarVisible) {
					// no visibility change but need to notify whichever scrollbars are visible of the
					// updated bounds and scroll position
					const updatedBounds = {
						...bounds,
						scrollLeft: this.scrollLeft,
						scrollTop: this.scrollTop
					};

					if (this.isHorizontalScrollbarScrollable(bounds)) {
						this.horizontalScrollbarRef.update(updatedBounds);
					}
					if (this.isVerticalScrollbarScrollable(bounds)) {
						this.verticalScrollbarRef.update(updatedBounds);
					}
				}
			}
		}

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
				childContainerRef.addEventListener('focus', this.onFocus, true);
			}

			this.updateScrollbars();
		}

		updateScrollOnFocus () {
			const
				focusedItem = Spotlight.getCurrent(),
				{containerRef, calculatePositionOnFocus, getScrollBounds} = this.childRef,
				{scrollHeight: previousScrollHeight} = this.bounds,
				{scrollHeight: currentScrollHeight} = getScrollBounds(),
				scrollInfo = {previousScrollHeight, scrollTop: this.scrollTop};

			if (focusedItem && containerRef && containerRef.contains(focusedItem)) {
				const position = calculatePositionOnFocus(focusedItem, scrollInfo);
				this.startScrollOnFocus(position, focusedItem);
			}

			// update `scrollHeight`
			this.bounds.scrollHeight = currentScrollHeight;
		}

		// render

		initRef (prop) {
			return (ref) => {
				this[prop] = ref;
			};
		}

		getHorizontalScrollbar = (isHorizontalScrollbarVisible, isVerticalScrollbarVisible) => (
			isHorizontalScrollbarVisible ? (
				<Scrollbar
					{...this.horizontalScrollbarProps}
					corner={isVerticalScrollbarVisible}
					disabled={!isHorizontalScrollbarVisible}
				/>
			) : null
		)

		getVerticalScrollbar = (isHorizontalScrollbarVisible, isVerticalScrollbarVisible) => (
			isVerticalScrollbarVisible ? (
				<Scrollbar
					{...this.verticalScrollbarProps}
					disabled={!isVerticalScrollbarVisible}
				/>
			) : null
		)

		handleScroll = () => {
			if (!this.animator.isAnimating() && this.childRef && this.childRef.containerRef) {
				this.childRef.containerRef.scrollTop = this.scrollTop;
				this.childRef.containerRef.scrollLeft = this.scrollLeft;
			}
		}

		render () {
			const
				props = Object.assign({}, this.props),
				{className, focusableScrollbar, style} = this.props,
				{isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state,
				vscrollbar = this.getVerticalScrollbar(isHorizontalScrollbarVisible, isVerticalScrollbarVisible),
				hscrollbar = this.getHorizontalScrollbar(isHorizontalScrollbarVisible, isVerticalScrollbarVisible),
				scrollableClasses = classNames(css.scrollable, className);

			delete props.cbScrollTo;
			delete props.className;
			delete props.focusableScrollbar;
			delete props.horizontalScrollbar;
			delete props.onScroll;
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
							onScroll={this.handleScroll}
							ref={this.initChildRef}
						/>
						{vscrollbar}
					</div>
					{hscrollbar}
				</ScrollableSpotlightContainer>
			);
		}
	};
});

export default ScrollableHoC;
export {dataIndexAttribute, ScrollableHoC as Scrollable};
