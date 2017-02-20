/*
 * Exports the {@link moonstone/Scroller.Scrollable} Higher-order Component (HOC) and
 * the {@link moonstone/Scroller.dataIndexAttribute} constant.
 * The default export is {@link moonstone/Scroller.Scrollable}.
 */

import clamp from 'ramda/src/clamp';
import classNames from 'classnames';
import hoc from '@enact/core/hoc';
import React, {Component, PropTypes} from 'react';
import {contextTypes} from '@enact/ui/Resizable';
import ri from '@enact/ui/resolution';

import css from './Scrollable.less';
import ScrollAnimator from './ScrollAnimator';
import Scrollbar from './Scrollbar';

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
 * Scrollable calls `onScrollStart`, `onScrolling`, and `onScrollStop` callback functions during scroll.
 *
 * @class Scrollable
 * @memberof moonstone/Scroller
 * @hoc
 * @private
 */
const ScrollableHoC = hoc((config, Wrapped) => {
	return class Scrollable extends Component {
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

			className: PropTypes.string,

			/**
			 * Hides the scrollbars when `true`
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			hideScrollbars: PropTypes.bool,

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
			 * Options for positioning the items; valid values are `'byItem'`, `'byContainer'`,
			 * and `'byBrowser'`.
			 * If `'byItem'`, the list moves each item.
			 * If `'byContainer'`, the list moves the container that contains rendered items.
			 * If `'byBrowser'`, the list scrolls by browser.
			 *
			 * @type {String}
			 * @default 'byItem'
			 * @private
			 */
			positioningOption: PropTypes.oneOf(['byItem', 'byContainer', 'byBrowser']),

			style: PropTypes.object
		}

		static defaultProps = {
			cbScrollTo: nop,
			hideScrollbars: false,
			onScroll: nop,
			onScrollStart: nop,
			onScrollStop: nop,
			positioningOption: 'byItem'
		}

		static childContextTypes = contextTypes

		// status
		horizontalScrollability = false
		verticalScrollability = false
		isScrollAnimationTargetAccumulated = false
		isFirstDragging = false
		isDragging = false
		isKeyDown = false

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
		dirHorizontal = 0
		dirVertical = 0

		// spotlight
		lastFocusedItem = null

		// component info
		childRef = null
		containerRef = null

		// scroll animator
		animator = new ScrollAnimator()

		constructor (props) {
			super(props);

			this.state = {
				isHorizontalScrollbarVisible: false,
				isVerticalScrollbarVisible: false
			};

			this.initChildRef = this.initRef('childRef');
			this.initContainerRef = this.initRef('containerRef');

			if (this.props.positioningOption === 'byBrowser') {
				const {onKeyDown} = this;
				this.eventHandlers = {
					onKeyDown
				};
			} else {
				const {onKeyDown, onKeyUp} = this;
				// We have removed all mouse event handlers for now.
				// Revisit later for touch usage.
				this.eventHandlers = {
					onKeyDown,
					onKeyUp
				};
			}

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
			let t = perf.now();
			const d = this.dragInfo;

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
				const {dx, dy} = this.drag(e);

				if (this.isFirstDragging) {
					this.doScrollStart();
					this.isFirstDragging = false;
				}
				this.showThumb();
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
					this.start(target.targetX, target.targetY, true, true, target.duration);
				}
			}
		}

		onMouseLeave = (e) => {
			this.onMouseMove(e);
			this.onMouseUp();
		}

		onScroll = (e) => {
			this.scroll(e.target.scrollLeft, e.target.scrollTop, true);
		}

		startScrollOnFocus = (pos, item) => {
			if (pos) {
				if (pos.left !== this.scrollLeft || pos.top !== this.scrollTop) {
					this.start(pos.left, pos.top, (animationDuration > 0), false, animationDuration);
				}
				this.lastFocusedItem = item;
			}
		}

		onFocus = (e) => {
			if (this.isKeyDown && !this.isDragging) {
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

		onKeyDown = (e) => {
			if (this.childRef.setSpotlightContainerRestrict) {
				const index = Number.parseInt(e.target.getAttribute(dataIndexAttribute));
				this.childRef.setSpotlightContainerRestrict(e.keyCode, index);
			}
			this.isKeyDown = true;
		}

		onKeyUp = () => {
			this.isKeyDown = false;
		}

		onWheel = (e) => {
			e.preventDefault();
			if (!this.isDragging) {
				const
					isHorizontal = this.canScrollHorizontally(),
					isVertical = this.canScrollVertically(),
					delta = this.wheel(e, isHorizontal, isVertical);

				window.document.activeElement.blur();
				this.childRef.setContainerDisabled(true);
				this.scrollToAccumulatedTarget(delta, isHorizontal, isVertical);
			}
		}

		onScrollbarBtnHandler = (orientation, direction) => {
			const
				bounds = this.getScrollBounds(),
				isHorizontal = this.canScrollHorizontally() && orientation === 'horizontal',
				isVertical = this.canScrollVertically() && orientation === 'vertical',
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

			this.start(this.accumulatedTargetX, this.accumulatedTargetY, true, silent);
		}

		// call scroll callbacks

		doScrollStart () {
			this.props.onScrollStart({scrollLeft: this.scrollLeft, scrollTop: this.scrollTop, moreInfo: this.getMoreInfo()});
		}

		doScrolling () {
			this.props.onScroll({scrollLeft: this.scrollLeft, scrollTop: this.scrollTop, moreInfo: this.getMoreInfo()});
		}

		doScrollStop () {
			this.props.onScrollStop({scrollLeft: this.scrollLeft, scrollTop: this.scrollTop, moreInfo: this.getMoreInfo()});
		}

		// update scroll position

		setScrollLeft (v) {
			const bounds = this.getScrollBounds();

			this.dirHorizontal = Math.sign(v - this.scrollLeft);
			this.scrollLeft = clamp(0, bounds.maxLeft, v);
			if (this.state.isHorizontalScrollbarVisible) {
				this.updateThumb(this.scrollbarHorizontalRef);
			}
		}

		setScrollTop (v) {
			const bounds = this.getScrollBounds();

			this.dirVertical = Math.sign(v - this.scrollTop);
			this.scrollTop = clamp(0, bounds.maxTop, v);
			if (this.state.isVerticalScrollbarVisible) {
				this.updateThumb(this.scrollbarVerticalRef);
			}
		}

		// scroll start/stop

		start (targetX, targetY, animate = true, silent = false, duration = animationDuration) {
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

			this.showThumb();

			if (animate) {
				this.animator.animate(this.scrollAnimation({
					sourceX: scrollLeft,
					sourceY: scrollTop,
					targetX,
					targetY,
					duration
				}));
			} else {
				this.scroll(targetX, targetY);
				this.stop();
			}
		}

		scrollAnimation = (animationInfo) => (curTime) => {
			const {sourceX, sourceY, targetX, targetY, duration} = animationInfo;
			if (curTime < duration) {
				this.scroll(
					this.horizontalScrollability ? this.animator.timingFunction(sourceX, targetX, duration, curTime) : sourceX,
					this.verticalScrollability ? this.animator.timingFunction(sourceY, targetY, duration, curTime) : sourceY
				);
			} else {
				this.scroll(targetX, targetY);
				this.stop();
			}
		}

		scroll = (left, top, skipPositionContainer = false) => {
			if (left !== this.scrollLeft) {
				this.setScrollLeft(left);
			}
			if (top !== this.scrollTop) {
				this.setScrollTop(top);
			}

			this.childRef.setScrollPosition(this.scrollLeft, this.scrollTop, this.dirHorizontal, this.dirVertical, skipPositionContainer);
			this.doScrolling();
		}

		stop () {
			this.animator.stop();
			this.isScrollAnimationTargetAccumulated = false;
			this.childRef.setContainerDisabled(false);
			this.lastFocusedItem = null;
			this.hideThumb();
			this.doScrollStop();
		}

		// scrollTo API

		getPositionForScrollTo = (opt) => {
			const
				bounds = this.getScrollBounds(),
				canScrollHorizontally = this.canScrollHorizontally(),
				canScrollVertically = this.canScrollVertically();
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
			let {left, top} = this.getPositionForScrollTo(opt);

			if (left !== null || top !== null) {
				this.start((left !== null) ? left : this.scrollLeft, (top !== null) ? top : this.scrollTop, opt.animate);
			}
		}

		// scroll bar

		canScrollHorizontally = () => {
			const bounds = this.getScrollBounds();
			return this.horizontalScrollability && (bounds.scrollWidth > bounds.clientWidth) && !isNaN(bounds.scrollWidth);
		}

		canScrollVertically = () => {
			const bounds = this.getScrollBounds();
			return this.verticalScrollability && (bounds.scrollHeight > bounds.clientHeight) && !isNaN(bounds.scrollHeight);
		}

		showThumb () {
			if (this.props.positioningOption !== 'byBrowser' && !this.props.hideScrollbars) {
				if (this.state.isHorizontalScrollbarVisible) {
					this.scrollbarHorizontalRef.showThumb();
				}
				if (this.state.isVerticalScrollbarVisible) {
					this.scrollbarVerticalRef.showThumb();
				}
			}
		}

		updateThumb (scrollbarRef) {
			if (this.props.positioningOption !== 'byBrowser' && !this.props.hideScrollbars) {
				const bounds = this.getScrollBounds();
				scrollbarRef.update({
					...bounds,
					scrollLeft: this.scrollLeft,
					scrollTop: this.scrollTop
				});
			}
		}

		hideThumb () {
			if (this.props.positioningOption !== 'byBrowser' && !this.props.hideScrollbars) {
				if (this.state.isHorizontalScrollbarVisible) {
					this.scrollbarHorizontalRef.startHidingThumb();
				}
				if (this.state.isVerticalScrollbarVisible) {
					this.scrollbarVerticalRef.startHidingThumb();
				}
			}
		}

		getScrollBounds () {
			if (typeof this.childRef.getScrollBounds === 'function')  {
				return this.childRef.getScrollBounds();
			}
		}

		getMoreInfo () {
			if (typeof this.childRef.getMoreInfo === 'function') {
				return this.childRef.getMoreInfo();
			}
		}

		// component life cycle

		componentDidMount () {
			this.horizontalScrollability = this.childRef.isHorizontal();
			this.verticalScrollability = this.childRef.isVertical();

			if (this.props.positioningOption !== 'byBrowser' && !this.props.hideScrollbars) {
				const bounds = this.getScrollBounds();

				// FIXME `onWheel` don't work on the v8 snapshot.
				this.containerRef.addEventListener('wheel', this.onWheel);
				// eslint-disable-next-line react/no-did-mount-set-state
				this.setState({
					isHorizontalScrollbarVisible: this.canScrollHorizontally(),
					isVerticalScrollbarVisible: this.canScrollVertically()
				});

				if (this.canScrollHorizontally()) {
					this.scrollbarHorizontalRef.update({
						...bounds,
						scrollLeft: this.scrollLeft,
						scrollTop: this.scrollTop
					});
				}

				if (this.canScrollVertically()) {
					this.scrollbarVerticalRef.update({
						...bounds,
						scrollLeft: this.scrollLeft,
						scrollTop: this.scrollTop
					});
				}
			} else {
				// FIXME `onScroll` don't work on the v8 snapshot.
				this.childRef.containerRef.addEventListener('scroll', this.onScroll);
			}
			// FIXME `onFocus` don't work on the v8 snapshot.
			this.childRef.containerRef.addEventListener('focus', this.onFocus, true);
		}

		componentDidUpdate () {
			const {isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state;
			let curHorizontalScrollbarVisible, curVerticalScrollbarVisible;

			this.horizontalScrollability = this.childRef.isHorizontal();
			this.verticalScrollability = this.childRef.isVertical();

			// Need to sync calculated client size if it is different from the real size
			if (this.childRef.syncClientSize) {
				this.childRef.syncClientSize();
			}

			if (!this.props.hideScrollbars) {
				// NOTE: After rendering, we check scrollbar visibility using current bounds info.
				// You don't need to set bounds with current bounds info again, because bounds is
				// being re-retrieved when necessary, to retrieve the current bounds info.
				curHorizontalScrollbarVisible = this.canScrollHorizontally();
				curVerticalScrollbarVisible = this.canScrollVertically();
				if (isHorizontalScrollbarVisible !== curHorizontalScrollbarVisible || isVerticalScrollbarVisible !== curVerticalScrollbarVisible) {
					// eslint-disable-next-line react/no-did-update-set-state
					this.setState({
						isHorizontalScrollbarVisible: curHorizontalScrollbarVisible,
						isVerticalScrollbarVisible: curVerticalScrollbarVisible
					});
				}
			}
		}

		componentWillUnmount () {
			// Before call cancelAnimationFrame, you must send scrollStop Event.
			this.animator.stop();
			if (this.timerForceUpdate) clearTimeout(this.timerForceUpdate);
		}

		enqueueForceUpdate = () => {
			// forceUpdate is a bit jarring and may interrupt other actions like animation so we'll
			// queue it up in case we get multiple calls (e.g. when grouped expandables toggle).
			//
			// TODO: consider replacing forceUpdate() by storing bounds in state rather than a non-
			// state member.
			this.timerForceUpdate = setTimeout(() => {
				this.timerForceUpdate = null;
				this.forceUpdate();
			}, 32);
		}

		// render

		initRef (prop) {
			return (ref) => {
				this[prop] = ref;
			};
		}

		initScrollbarBtnHandler = (orientation, direction) => () => {
			return this.onScrollbarBtnHandler(orientation, direction);
		}

		render () {
			const
				props = Object.assign({}, this.props),
				{className, hideScrollbars, positioningOption, style} = this.props,
				{isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state,
				scrollableClasses = classNames(
					css.scrollable,
					hideScrollbars ? css.scrollableHiddenScrollbars : null,
					isHorizontalScrollbarVisible ? null : css.takeAvailableSpaceForVertical,
					isVerticalScrollbarVisible ? null : css.takeAvailableSpaceForHorizontal,
					className
				),
				isBothScrollable = isHorizontalScrollbarVisible && isVerticalScrollbarVisible,
				verticalScrollbarClassnames = isVerticalScrollbarVisible ? (!isBothScrollable && css.onlyVerticalScrollbarNeeded) : css.verticalScrollbarDisabled,
				horizontalScrollbarClassnames = isHorizontalScrollbarVisible ? (!isBothScrollable && css.onlyHorizontalScrollbarNeeded) : css.horizontalScrollbarDisabled;

			delete props.className;
			delete props.cbScrollTo;
			delete props.style;
			delete props.hideScrollbars;

			return (
				(positioningOption !== 'byBrowser' && !hideScrollbars) ? (
					<div ref={this.initContainerRef} className={scrollableClasses} style={style}>
						<Scrollbar
							className={verticalScrollbarClassnames}
							disabled={!isVerticalScrollbarVisible}
							{...this.verticalScrollbarProps}
						/>
						<Scrollbar
							className={horizontalScrollbarClassnames}
							disabled={!isHorizontalScrollbarVisible}
							{...this.horizontalScrollbarProps}
						/>
						<Wrapped {...props} {...this.eventHandlers} ref={this.initChildRef} cbScrollTo={this.scrollTo} className={css.container} />
					</div>
				) : <Wrapped {...props} {...this.eventHandlers} ref={this.initChildRef} cbScrollTo={this.scrollTo} className={scrollableClasses} style={style} />
			);
		}
	};
});

export default ScrollableHoC;
export {dataIndexAttribute, ScrollableHoC as Scrollable};
