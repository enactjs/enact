/*
 * Exports the {@link moonstone/Scroller.Scrollable} Higher-order Component (HOC) and
 * the {@link moonstone/Scroller.dataIndexAttribute} constant.
 * The default export is {@link moonstone/Scroller.Scrollable}.
 */

import clamp from 'ramda/src/clamp';
import classNames from 'classnames';
import {contextTypes} from '@enact/ui/Resizable';
import {forward} from '@enact/core/handle';
import Spotlight, {getDirection} from '@enact/spotlight';
import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import React, {Component, PropTypes} from 'react';
import ri from '@enact/ui/resolution';

import css from './Scrollable.less';
import ScrollAnimator from './ScrollAnimator';
import Scrollbar from './Scrollbar';

const
	forwardScroll = forward('onScroll'),
	forwardScrollStart = forward('onScrollStart'),
	forwardScrollStop = forward('onScrollStop');

const
	calcVelocity = (d, dt) => (d && dt) ? d / dt : 0,
	nop = () => {},
	perf = (typeof window === 'object') ? window.performance : {now: Date.now},
	holdTime = 50,
	scrollWheelMultiplierForDeltaPixel = 2,
	pixelPerLine = ri.scale(39) * scrollWheelMultiplierForDeltaPixel,
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

/**
 * {@link moonstone/Scroller.Scrollable} is a Higher-order Component
 * that applies a Scrollable behavior to its wrapped component.
 *
 * Scrollable catches `onFocus` and `onKeyDown` events from its wrapped component for spotlight features,
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
			 *
			 * @example
			 *	// If you set cbScrollTo prop like below;
			 *	cbScrollTo: (fn) => {this.scrollTo = fn;}
			 *	// You can simply call like below;
			 *	this.scrollTo({align: 'top'}); // scroll to the top
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
				isHorizontalScrollbarVisible: this.isHorizontalScrollbarVisible(),
				isVerticalScrollbarVisible: this.isVerticalScrollbarVisible()
			};

			this.initChildRef = this.initRef('childRef');
			this.initContainerRef = this.initRef('containerRef');

			const {onKeyDown} = this;
			// We have removed all mouse event handlers for now.
			// Revisit later for touch usage.
			this.eventHandlers = {
				onKeyDown
			};

			this.verticalScrollbarProps = {
				ref: this.initRef('scrollbarVerticalRef'),
				vertical: true,
				onPrevScroll: this.initScrollbarBtnHandler('vertical', -1),
				onNextScroll: this.initScrollbarBtnHandler('vertical', 1)
			};

			this.horizontalScrollbarProps = {
				ref: this.initRef('scrollbarHorizontalRef'),
				vertical: false,
				onPrevScroll: this.initScrollbarBtnHandler('horizontal', -1),
				onNextScroll: this.initScrollbarBtnHandler('horizontal', 1)
			};

			props.cbScrollTo(this.scrollTo);
		}

		getChildContext () {
			return {
				invalidateBounds: this.enqueueForceUpdate
			};
		}

		// status
		horizontalScrollability = false
		verticalScrollability = false
		isScrollAnimationTargetAccumulated = false
		isFirstDragging = false
		isDragging = false
		isKeyDown = false
		isInitializing = true

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
				d = this.dragInfo;

			if (this.horizontalScrollability) {
				d.dx = e.clientX - d.clientX;
				d.clientX = e.clientX;
			} else {
				d.dx = 0;
			}

			if (this.verticalScrollability) {
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

		wheel (e, isHorizontal, isVertical) {
			const
				bounds = this.getScrollBounds(),
				deltaMode = e.deltaMode,
				wheelDeltaY = e.nativeEvent ? -e.nativeEvent.wheelDeltaY : -e.wheelDeltaY;
			let delta = (wheelDeltaY || e.deltaY);

			if (deltaMode === 0) {
				delta = ri.scale(delta) * scrollWheelMultiplierForDeltaPixel;
			} else if (deltaMode === 1) { // line; firefox
				delta = ri.scale(delta) * pixelPerLine;
			} else if (deltaMode === 2) { // page
				if (isVertical) {
					delta = delta > 0 ? bounds.clientHeight : -bounds.clientHeight;
				} else if (isHorizontal) {
					delta = delta > 0 ? bounds.clientWidth : -bounds.clientWidth;
				} else {
					delta = 0;
				}
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
						);

					if (typeof window !== 'undefined') {
						window.document.activeElement.blur();
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
					spotItem = window.document.activeElement;

				if (item && item !== this.lastFocusedItem && item === spotItem && positionFn) {
					const pos = positionFn(item);
					if (pos) {
						this.startScrollOnFocus(pos, item);
					}
				}
			}
		}

		onKeyDown = ({keyCode, target}) => {
			if (getDirection(keyCode)) {
				if (this.childRef.setSpotlightContainerRestrict) {
					const index = Number.parseInt(target.getAttribute(dataIndexAttribute));
					this.childRef.setSpotlightContainerRestrict(keyCode, index);
				}
			}
		}

		onWheel = (e) => {
			e.preventDefault();
			if (!this.isDragging) {
				const
					bounds = this.getScrollBounds(),
					isHorizontal = this.canScrollHorizontally(bounds),
					isVertical = this.canScrollVertically(bounds),
					delta = this.wheel(e, isHorizontal, isVertical);

				Spotlight.setPointerMode(false);
				window.document.activeElement.blur();
				this.childRef.setContainerDisabled(true);
				this.scrollToAccumulatedTarget(delta, isHorizontal, isVertical);
			}
		}

		onScrollbarBtnHandler = (orientation, direction) => {
			const
				bounds = this.getScrollBounds(),
				isHorizontal = this.canScrollHorizontally(bounds) && orientation === 'horizontal',
				isVertical = this.canScrollVertically(bounds) && orientation === 'vertical',
				pageDistance = (isVertical ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier;

			this.scrollToAccumulatedTarget(pageDistance * direction, isHorizontal, isVertical);
		}

		scrollToAccumulatedTarget = (delta, isHorizontal, isVertical) => {
			const
				bounds = this.getScrollBounds(),
				silent = this.isScrollAnimationTargetAccumulated;

			if (!this.isScrollAnimationTargetAccumulated) {
				this.accumulatedTargetX = this.scrollLeft;
				this.accumulatedTargetY = this.scrollTop;
				this.isScrollAnimationTargetAccumulated = true;
			}

			if (isVertical) {
				this.accumulatedTargetY = clamp(0, bounds.maxTop, this.accumulatedTargetY + delta);
			} else if (isHorizontal) {
				this.accumulatedTargetX = clamp(0, bounds.maxLeft, this.accumulatedTargetX + delta);
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
			if (this.state.isHorizontalScrollbarVisible && this.canScrollHorizontally(bounds)) {
				this.updateThumb(this.scrollbarHorizontalRef, bounds);
			}
		}

		setScrollTop (v) {
			const bounds = this.getScrollBounds();

			this.scrollTop = clamp(0, bounds.maxTop, v);
			if (this.state.isVerticalScrollbarVisible && this.canScrollVertically(bounds)) {
				this.updateThumb(this.scrollbarVerticalRef, bounds);
			}
		}

		// scroll start/stop

		start ({targetX, targetY, animate = true, silent = false, duration = animationDuration, indexToFocus}) {
			const {scrollLeft, scrollTop} = this;
			const bounds = this.getScrollBounds();

			this.animator.stop();
			if (!silent) {
				this.doScrollStart();
			}

			targetX = clamp(0, bounds.maxLeft, targetX);
			targetY = clamp(0, bounds.maxTop, targetY);

			if ((bounds.maxLeft - targetX) < epsilon) {
				targetX = bounds.maxLeft;
			}
			if ((bounds.maxTop - targetY) < epsilon) {
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
					indexToFocus
				}));
			} else {
				this.scroll(targetX, targetY);
				this.stop({indexToFocus});
			}
		}

		scrollAnimation = (animationInfo) => (curTime) => {
			const {sourceX, sourceY, targetX, targetY, duration, indexToFocus} = animationInfo;
			if (curTime < duration) {
				this.scroll(
					this.horizontalScrollability ? this.animator.timingFunction(sourceX, targetX, duration, curTime) : sourceX,
					this.verticalScrollability ? this.animator.timingFunction(sourceY, targetY, duration, curTime) : sourceY
				);
			} else {
				this.scroll(targetX, targetY);
				this.stop({indexToFocus});
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

			this.childRef.setScrollPosition(this.scrollLeft, this.scrollTop, dirHorizontal, dirVertical);
			this.doScrolling();
		}

		stop ({indexToFocus}) {
			const bounds = this.getScrollBounds();

			this.animator.stop();
			this.isScrollAnimationTargetAccumulated = false;
			this.childRef.setContainerDisabled(false);
			this.lastFocusedItem = null;
			this.hideThumb(bounds);
			if (indexToFocus !== null && typeof this.childRef.focusOnItem === 'function') {
				this.childRef.focusOnItem(indexToFocus);
			}
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
					if (typeof opt.index === 'number') {
						itemPos = this.childRef.getItemPosition(opt.index);
					} else if (opt.node instanceof Object) {
						if (opt.node.nodeType === 1) {
							itemPos = this.childRef.getScrollPos(opt.node);
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
			if (!this.isInitializing) {
				const {left, top} = this.getPositionForScrollTo(opt);
				this.scrollToInfo = null;

				if (left !== null || top !== null) {
					this.start({
						targetX: (left !== null) ? left : this.scrollLeft,
						targetY: (top !== null) ? top : this.scrollTop,
						animate: opt.animate,
						indexToFocus: !isNaN(opt.indexToFocus) ? opt.indexToFocus : null
					});
				}
			} else {
				this.scrollToInfo = opt;
			}
		}

		// scroll bar

		canScrollHorizontally = (bounds) => {
			return this.horizontalScrollability && (bounds.scrollWidth > bounds.clientWidth) && !isNaN(bounds.scrollWidth);
		}

		canScrollVertically = (bounds) => {
			return this.verticalScrollability && (bounds.scrollHeight > bounds.clientHeight) && !isNaN(bounds.scrollHeight);
		}

		isHorizontalScrollbarVisible = () => (this.props.horizontalScrollbar === 'visible')

		isVerticalScrollbarVisible = () => (this.props.verticalScrollbar === 'visible')

		showThumb (bounds) {
			if (this.state.isHorizontalScrollbarVisible && this.canScrollHorizontally(bounds)) {
				this.scrollbarHorizontalRef.showThumb();
			}
			if (this.state.isVerticalScrollbarVisible && this.canScrollVertically(bounds)) {
				this.scrollbarVerticalRef.showThumb();
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
			if (this.state.isHorizontalScrollbarVisible && this.canScrollHorizontally(bounds)) {
				this.scrollbarHorizontalRef.startHidingThumb();
			}
			if (this.state.isVerticalScrollbarVisible && this.canScrollVertically(bounds)) {
				this.scrollbarVerticalRef.startHidingThumb();
			}
		}

		updateScrollbars = () => {
			const
				{isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state,
				{horizontalScrollbar, verticalScrollbar} = this.props,
				bounds = this.getScrollBounds(),
				canScrollHorizontally = this.canScrollHorizontally(bounds),
				canScrollVertically = this.canScrollVertically(bounds),
				curHorizontalScrollbarVisible = (horizontalScrollbar !== 'auto') ? this.isHorizontalScrollbarVisible() : canScrollHorizontally,
				curVerticalScrollbarVisible = (verticalScrollbar !== 'auto') ? this.isVerticalScrollbarVisible() : canScrollVertically;

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
			} else if (curHorizontalScrollbarVisible || curVerticalScrollbarVisible) {
				// no visibility change but need to notify whichever scrollbars are visible of the
				// updated bounds and scroll position
				const updatedBounds = {
					...bounds,
					scrollLeft: this.scrollLeft,
					scrollTop: this.scrollTop
				};

				if (canScrollHorizontally && curHorizontalScrollbarVisible) this.scrollbarHorizontalRef.update(updatedBounds);
				if (canScrollVertically && curVerticalScrollbarVisible) this.scrollbarVerticalRef.update(updatedBounds);
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

		updateScrollabilityAndEventListeners = () => {
			const
				{isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state,
				containerNode = this.childRef.containerRef;

			this.horizontalScrollability = this.childRef.isHorizontal();
			this.verticalScrollability = this.childRef.isVertical();

			// FIXME `onWheel` doesn't work on the v8 snapshot.
			if (isVerticalScrollbarVisible || isHorizontalScrollbarVisible) {
				this.containerRef.addEventListener('wheel', this.onWheel);
			} else {
				containerNode.addEventListener('wheel', this.onWheel);
			}
			// FIXME `onFocus` doesn't work on the v8 snapshot.
			containerNode.addEventListener('focus', this.onFocus, true);
			this.updateScrollbars();
		}

		// component life cycle

		componentDidMount () {
			this.updateScrollabilityAndEventListeners();
		}

		componentDidUpdate () {
			this.isInitializing = false;

			// Need to sync calculated client size if it is different from the real size
			if (this.childRef.syncClientSize) {
				this.childRef.syncClientSize();
			}

			this.updateScrollabilityAndEventListeners();

			if (this.scrollToInfo !== null) {
				this.scrollTo(this.scrollToInfo);
			}
		}

		componentWillUnmount () {
			// Before call cancelAnimationFrame, you must send scrollStop Event.
			this.animator.stop();
			this.forceUpdateJob.stop();
		}

		// forceUpdate is a bit jarring and may interrupt other actions like animation so we'll
		// queue it up in case we get multiple calls (e.g. when grouped expandables toggle).
		//
		// TODO: consider replacing forceUpdate() by storing bounds in state rather than a non-
		// state member.
		enqueueForceUpdate = () => {
			this.updateTopScrollPosition();
			this.forceUpdateJob.start();
		}

		// updateTopScrollPosition checks if scroll is needed if scrollHeight changes.
		updateTopScrollPosition () {
			const {scrollHeight: previousScrollHeight} = this.childRef.scrollBounds,
				{top: containerTop} = this.containerRef.getBoundingClientRect(),
				focusedItem = Spotlight.getCurrent(),
				{top: focusedItemTop} = focusedItem.getBoundingClientRect(),
				itemTop = this.scrollTop + (focusedItemTop - containerTop);

			this.childRef.calculateMetrics();

			const {scrollHeight: currentScrollHeight, clientHeight} = this.childRef.scrollBounds,
				heightDifference = Math.max(0, currentScrollHeight - previousScrollHeight);

			// calculate scroll based on focusedItem and the scrollHeight difference.
			if (previousScrollHeight !== currentScrollHeight && itemTop - this.scrollTop + heightDifference > clientHeight) {
				const newScrollTop = this.scrollTop + heightDifference;

				this.setScrollTop(newScrollTop);
				this.scroll(this.scrollLeft, this.scrollTop);
			}
		}

		forceUpdateJob = new Job(this.forceUpdate.bind(this), 32)

		// render

		initRef (prop) {
			return (ref) => {
				this[prop] = ref;
			};
		}

		initScrollbarBtnHandler = (orientation, direction) => () => {
			return this.onScrollbarBtnHandler(orientation, direction);
		}

		getHorizontalScrollbar = (isHorizontalScrollbarVisible, isVerticalScrollbarVisible) => (
			isHorizontalScrollbarVisible ? (
				<Scrollbar
					className={!isVerticalScrollbarVisible ? css.onlyHorizontalScrollbarNeeded : null}
					disabled={!isHorizontalScrollbarVisible}
					{...this.horizontalScrollbarProps}
				/>
			) : null
		)

		getVerticalScrollbar = (isHorizontalScrollbarVisible, isVerticalScrollbarVisible) => (
			isVerticalScrollbarVisible ? (
				<Scrollbar
					className={!isHorizontalScrollbarVisible ? css.onlyVerticalScrollbarNeeded : null}
					disabled={!isVerticalScrollbarVisible}
					{...this.verticalScrollbarProps}
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
				{className, style} = this.props,
				{isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state,
				vscrollbar = this.getVerticalScrollbar(isHorizontalScrollbarVisible, isVerticalScrollbarVisible),
				hscrollbar = this.getHorizontalScrollbar(isHorizontalScrollbarVisible, isVerticalScrollbarVisible),
				scrollableClasses = classNames(
					css.scrollable,
					!(isHorizontalScrollbarVisible || isVerticalScrollbarVisible) ? css.scrollableHiddenScrollbars : null,
					isHorizontalScrollbarVisible ? null : css.takeAvailableSpaceForVertical,
					isVerticalScrollbarVisible ? null : css.takeAvailableSpaceForHorizontal,
					className
				);

			delete props.cbScrollTo;
			delete props.className;
			delete props.horizontalScrollbar;
			delete props.onScroll;
			delete props.onScrollStart;
			delete props.onScrollStop;
			delete props.style;
			delete props.verticalScrollbar;

			return (
				<div ref={this.initContainerRef} className={scrollableClasses} style={style}>
					{vscrollbar}
					{hscrollbar}
					<Wrapped
						{...props}
						{...this.eventHandlers}
						cbScrollTo={this.scrollTo}
						className={css.container}
						onScroll={this.handleScroll}
						ref={this.initChildRef}
					/>
				</div>
			);
		}
	};
});

export default ScrollableHoC;
export {dataIndexAttribute, ScrollableHoC as Scrollable};
