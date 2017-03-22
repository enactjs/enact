/*
 * Exports the {@link moonstone/Scroller.Scrollable} Higher-order Component (HOC) and
 * the {@link moonstone/Scroller.dataIndexAttribute} constant.
 * The default export is {@link moonstone/Scroller.Scrollable}.
 */

import clamp from 'ramda/src/clamp';
import classNames from 'classnames';
import {contextTypes as contextTypesResize} from '@enact/ui/Resizable';
import {contextTypes as contextTypesRtl} from '@enact/i18n/I18nDecorator';
import {getDirection} from '@enact/spotlight';
import hoc from '@enact/core/hoc';
import React, {Component, PropTypes} from 'react';
import {startJob} from '@enact/core/jobs';

import css from './Scrollable.less';
import Scrollbar from './Scrollbar';

const
	nop = () => {},
	paginationPageMultiplier = 0.8,
	epsilon = 1,
	// spotlight
	scrollStopWaiting = 500;

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
 * Scrollable catches `onFocus`, `onKeyUp`, and `onKeyDown` events from its wrapped component for spotlight features,
 * and also catches `onWheel` and `onScroll` events from its wrapped component for scrolling behaviors.
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

			style: PropTypes.object
		}

		static defaultProps = {
			cbScrollTo: nop,
			hideScrollbars: false,
			onScroll: nop,
			onScrollStart: nop,
			onScrollStop: nop
		}

		static childContextTypes = contextTypesResize
		static contextTypes = contextTypesRtl

		// status
		horizontalScrollability = false
		verticalScrollability = false
		isScrollAnimationTargetAccumulated = false
		isKeyDown = false
		isInitializing = true

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
		scrollLeft = 0
		scrollTop = 0
		scrollToInfo = null

		// spotlight
		lastFocusedItem = null

		// component info
		childRef = null
		containerRef = null

		// browser native scrolling
		jobName = ''
		scrolling = false

		constructor (props) {
			super(props);

			this.state = {
				isHorizontalScrollbarVisible: false,
				isVerticalScrollbarVisible: false
			};

			this.initChildRef = this.initRef('childRef');
			this.initContainerRef = this.initRef('containerRef');

			const
				{onKeyDown, onKeyUp} = this,
				perf = (typeof window === 'object') ? window.performance : {now: Date.now};
			// wheel, scroll, and focus event handlers will be added after mounting
			this.eventHandlers = {
				onKeyDown,
				onKeyUp
			};
			this.jobName = perf.now();

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

		// event handler for browser native scroll

		onMouseDown = () => {
			this.isScrollAnimationTargetAccumulated = false;
			this.lastFocusedItem = null;
			this.childRef.setContainerDisabled(false);
		}

		onWheel = (e) => {
			this.childRef.setContainerDisabled(true);
			this.lastFocusedItem = null;
			if (typeof window !== 'undefined') {
				window.document.activeElement.blur();
			}

			// FIXME This routine is a temporary support for horizontal wheel scroll.
			// FIXME If web engine supports horizontal wheel, this routine should be refined or removed.
			if (this.horizontalScrollability) {
				const
					bounds = this.getScrollBounds(),
					deltaMode = e.deltaMode,
					wheelDeltaY = e.nativeEvent ? -e.nativeEvent.wheelDeltaY : -e.wheelDeltaY,
					scrollWheelMultiplierForDeltaPixel = 2,
					pixelPerLine = scrollWheelMultiplierForDeltaPixel * 39;

				let delta = (wheelDeltaY || e.deltaY);

				if (deltaMode === 0) {
					delta *= scrollWheelMultiplierForDeltaPixel;
				} else if (deltaMode === 1) { // line; firefox
					delta = delta * pixelPerLine;
				} else if (deltaMode === 2) { // page
					delta = delta > 0 ? bounds.clientWidth : -bounds.clientWidth;
				}

				/* prevent native scrolling feature for vertical direction */
				e.preventDefault();

				this.scrollToAccumulatedTarget(delta, true, false);
			}
		}

		onScroll = (e) => {
			let {scrollLeft, scrollTop} = e.target;

			if (!this.scrolling) {
				this.scrollStartOnScroll();
			}

			this.scroll(scrollLeft, scrollTop, false);

			startJob(this.jobName, this.scrollStopOnScroll, scrollStopWaiting);
		}

		// event handlers for Spotlight support

		onFocus = (e) => {
			if (this.isKeyDown) {
				const
					item = e.target,
					positionFn = this.childRef.calculatePositionOnFocus,
					spotItem = (typeof window === 'object') ? window.document.activeElement : null;

				if (item && item !== this.lastFocusedItem && item === spotItem && positionFn) {
					const pos = positionFn(item);
					if (pos) {
						if (pos.left !== this.scrollLeft || pos.top !== this.scrollTop) {
							this.start(pos.left, pos.top);
						}
						this.lastFocusedItem = item;
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
				this.isKeyDown = true;
			}
		}

		onKeyUp = ({keyCode}) => {
			if (getDirection(keyCode)) {
				this.isKeyDown = false;
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
				bounds = this.getScrollBounds();

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

			this.start(this.accumulatedTargetX, this.accumulatedTargetY);
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

		// call scroll callbacks and update scrollbars for native scroll

		scrollStartOnScroll = () => {
			this.scrolling = true;
			this.showThumb();
			this.doScrollStart();
		}

		scrollStopOnScroll = () => {
			this.isScrollAnimationTargetAccumulated = false;
			this.childRef.setContainerDisabled(false);
			this.lastFocusedItem = null;

			this.hideThumb();
			this.scrolling = false;
			this.doScrollStop();
		}

		// update scroll position

		setScrollLeft (v) {
			const bounds = this.getScrollBounds();

			this.scrollLeft = clamp(0, bounds.maxLeft, v);
			if (this.state.isHorizontalScrollbarVisible) {
				this.updateThumb(this.scrollbarHorizontalRef, bounds);
			}
		}

		setScrollTop (v) {
			const bounds = this.getScrollBounds();

			this.scrollTop = clamp(0, bounds.maxTop, v);
			if (this.state.isVerticalScrollbarVisible) {
				this.updateThumb(this.scrollbarVerticalRef, bounds);
			}
		}

		// scroll start

		start (targetX, targetY, animate = true, indexToFocus) {
			const
				bounds = this.getScrollBounds(),
				containerNode = this.childRef.getContainerNode();

			targetX = clamp(0, bounds.maxLeft, targetX);
			targetY = clamp(0, bounds.maxTop, targetY);

			if ((bounds.maxLeft - targetX) < epsilon) {
				targetX = bounds.maxLeft;
			}
			if ((bounds.maxTop - targetY) < epsilon) {
				targetY = bounds.maxTop;
			}

			if (animate) {
				this.childRef.scrollTo(targetX, targetY);
			} else {
				containerNode.style.scrollBehavior = null;
				this.childRef.scrollTo(targetX, targetY);
				containerNode.style.scrollBehavior = 'smooth';
				this.focusOnItem({indexToFocus});
			}
		}

		focusOnItem ({indexToFocus}) {
			if (indexToFocus !== null && typeof this.childRef.focusOnItem === 'function') {
				this.childRef.focusOnItem(indexToFocus);
			}
		}

		scroll = (left, top) => {
			const
				bounds = this.getScrollBounds(),
				canScrollHorizontally = this.canScrollHorizontally(bounds);
			let dirHorizontal, dirVertical;

			if (this.context.rtl && canScrollHorizontally) {
				/* FIXME: RTL / this calculation only works for Chrome */
				left = bounds.maxLeft - left;
			}

			dirHorizontal = Math.sign(left - this.scrollLeft);
			dirVertical = Math.sign(top - this.scrollTop);

			if (left !== this.scrollLeft) {
				this.setScrollLeft(left);
			}
			if (top !== this.scrollTop) {
				this.setScrollTop(top);
			}

			this.childRef.setScrollPosition(this.scrollLeft, this.scrollTop, dirHorizontal, dirVertical);
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
				let {left, top} = this.getPositionForScrollTo(opt);
				this.scrollToInfo = null;

				if (left !== null || top !== null) {
					this.start(
						(left !== null) ? left : this.scrollLeft,
						(top !== null) ? top : this.scrollTop,
						opt.animate,
						!isNaN(opt.indexToFocus) ? opt.indexToFocus : null
					);
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

		showThumb () {
			if (!this.props.hideScrollbars) {
				if (this.state.isHorizontalScrollbarVisible) {
					this.scrollbarHorizontalRef.showThumb();
				}
				if (this.state.isVerticalScrollbarVisible) {
					this.scrollbarVerticalRef.showThumb();
				}
			}
		}

		updateThumb (scrollbarRef, bounds) {
			if (!this.props.hideScrollbars) {
				scrollbarRef.update({
					...bounds,
					scrollLeft: this.scrollLeft,
					scrollTop: this.scrollTop
				});
			}
		}

		hideThumb () {
			if (!this.props.hideScrollbars) {
				if (this.state.isHorizontalScrollbarVisible) {
					this.scrollbarHorizontalRef.startHidingThumb();
				}
				if (this.state.isVerticalScrollbarVisible) {
					this.scrollbarVerticalRef.startHidingThumb();
				}
			}
		}

		updateScrollbars = () => {
			const
				{isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state,
				bounds = this.getScrollBounds();

			// determine if we should hide or show any scrollbars
			const
				canScrollHorizontally = this.canScrollHorizontally(bounds),
				canScrollVertically = this.canScrollVertically(bounds),
				isVisibilityChanged = (
					isHorizontalScrollbarVisible !== canScrollHorizontally ||
					isVerticalScrollbarVisible !== canScrollVertically
				);

			if (isVisibilityChanged) {
				// one or both scrollbars have changed visibility
				this.setState({
					isHorizontalScrollbarVisible: canScrollHorizontally,
					isVerticalScrollbarVisible: canScrollVertically
				});
			} else if (canScrollVertically || canScrollHorizontally) {
				// no visibility change but need to notify whichever scrollbars are visible of the
				// updated bounds and scroll position
				const updatedBounds = {
					...bounds,
					scrollLeft: this.scrollLeft,
					scrollTop: this.scrollTop
				};

				if (canScrollHorizontally) this.scrollbarHorizontalRef.update(updatedBounds);
				if (canScrollVertically) this.scrollbarVerticalRef.update(updatedBounds);
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
				containerNode = this.childRef.getContainerNode();

			this.horizontalScrollability = this.childRef.isHorizontal();
			this.verticalScrollability = this.childRef.isVertical();

			// FIXME `onWheel` doesn't work on the v8 snapshot.
			if (isVerticalScrollbarVisible || isHorizontalScrollbarVisible) {
				this.containerRef.addEventListener('wheel', this.onWheel);
			} else {
				containerNode.addEventListener('wheel', this.onWheel);
			}
			// FIXME `onScroll` doesn't work on the v8 snapshot.
			containerNode.addEventListener('scroll', this.onScroll, true);
			// FIXME `onFocus` doesn't work on the v8 snapshot.
			containerNode.addEventListener('focus', this.onFocus, true);

			containerNode.style.scrollBehavior = 'smooth';
			if (!this.props.hideScrollbars) {
				this.updateScrollbars();
			}
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
				{className, hideScrollbars, style} = this.props,
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

			delete props.cbScrollTo;
			delete props.className;
			delete props.hideScrollbars;
			delete props.onScroll;
			delete props.onScrollStart;
			delete props.onScrollStop;
			delete props.style;

			return (
				(!hideScrollbars) ? (
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
