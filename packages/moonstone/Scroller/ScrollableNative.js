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

import css from '../Scroller/Scrollable.less';
import ScrollAnimator from '../Scroller/ScrollAnimator';
import Scrollbar from '../Scroller/Scrollbar';

const
	nop = () => {},
	perf = (typeof window === 'object') ? window.performance : {now: Date.now},
	paginationPageMultiplier = 0.8,
	epsilon = 1,
	// spotlight
	doc = (typeof window === 'object') ? window.document : {},
	animationDuration = 1000,
	scrollStopWaiting = 200;

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

		static childContextTypes = {...contextTypesResize, ...contextTypesRtl}

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
		dirHorizontal = 0
		dirVertical = 0
		scrollToInfo = null

		// spotlight
		lastFocusedItem = null

		// component info
		childRef = null
		containerRef = null

		// scroll animator
		animator = new ScrollAnimator()

		// Right-To-Left
		isFirstRendered = true

		// browser native scrolling
		jobName = ''
		scrolling = false

		constructor (props, context) {
			super(props, context);

			this.state = {
				isHorizontalScrollbarVisible: false,
				isVerticalScrollbarVisible: false
			};

			this.initChildRef = this.initRef('childRef');
			this.initContainerRef = this.initRef('containerRef');

			this.rtlDirection = context.rtl ? -1 : 1;

			const {onKeyDown, onKeyUp} = this;
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
			this.animator.stop();
			this.isScrollAnimationTargetAccumulated = false;
			this.lastFocusedItem = null;
			this.childRef.setContainerDisabled(false);
		}

		onWheel = () => {
			this.animator.stop();
			this.isScrollAnimationTargetAccumulated = false;
			this.childRef.setContainerDisabled(true);
			this.lastFocusedItem = null;
			doc.activeElement.blur();
		}

		onScroll = (e) => {
			let {scrollLeft, scrollTop} = e.target;

			if (!this.scrolling) {
				this.scrollStartOnScroll();
			}

			if (this.context.rtl) {
				/* NOTE: this calculation only works for Chrome */
				scrollLeft = this.bounds.maxLeft - scrollLeft;
			}
			this.scroll(scrollLeft, scrollTop, true);

			startJob(this.jobName, this.scrollStopOnScroll, scrollStopWaiting);
		}

		// event handlers for Spotlight support

		onFocus = (e) => {
			if (this.isKeyDown) {
				const
					item = e.target,
					positionFn = this.childRef.calculatePositionOnFocus,
					spotItem = doc.activeElement;

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
			if  (getDirection(keyCode)) {
				if (this.childRef.setSpotlightContainerRestrict) {
					const index = Number.parseInt(target.getAttribute(dataIndexAttribute));
					this.childRef.setSpotlightContainerRestrict(keyCode, index);
				}
				this.isKeyDown = true;
			}
		}

		onKeyUp = ({keyCode}) => {
			if  (getDirection(keyCode)) {
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
			this.animator.stop();
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

			this.dirHorizontal = Math.sign(v - this.scrollLeft);
			this.scrollLeft = clamp(0, bounds.maxLeft, v);
			if (this.state.isHorizontalScrollbarVisible) {
				this.updateThumb(this.scrollbarHorizontalRef, bounds);
			}
		}

		setScrollTop (v) {
			const bounds = this.getScrollBounds();

			this.dirVertical = Math.sign(v - this.scrollTop);
			this.scrollTop = clamp(0, bounds.maxTop, v);
			if (this.state.isVerticalScrollbarVisible) {
				this.updateThumb(this.scrollbarVerticalRef, bounds);
			}
		}

		// scroll start

		start (targetX, targetY, animate = true, indexToFocus) {
			const {scrollLeft, scrollTop} = this;
			const bounds = this.getScrollBounds();

			this.animator.stop();

			targetX = clamp(0, bounds.maxLeft, targetX);
			targetY = clamp(0, bounds.maxTop, targetY);

			if ((bounds.maxLeft - targetX) < epsilon) {
				targetX = bounds.maxLeft;
			}
			if ((bounds.maxTop - targetY) < epsilon) {
				targetY = bounds.maxTop;
			}

			if (animate) {
				this.animator.animate(this.scrollAnimation({
					sourceX: scrollLeft,
					sourceY: scrollTop,
					targetX,
					targetY,
					duration: animationDuration,
					indexToFocus
				}));
			} else {
				this.scroll(targetX, targetY);
				this.focusOnItem({indexToFocus});
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
				this.focusOnItem({indexToFocus});
			}
		}

		focusOnItem ({indexToFocus}) {
			if (indexToFocus !== null && typeof this.childRef.focusOnItem === 'function') {
				this.childRef.focusOnItem(indexToFocus);
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
			const containerNode = this.childRef.getContainerNode();
			this.horizontalScrollability = this.childRef.isHorizontal();
			this.verticalScrollability = this.childRef.isVertical();

			// FIXME `onWheel` doesn't work on the v8 snapshot.
			this.containerRef.addEventListener('wheel', this.onWheel);

			// FIXME `onScroll` doesn't work on the v8 snapshot.
			containerNode.addEventListener('scroll', this.onScroll, true);
			// FIXME `onFocus` doesn't work on the v8 snapshot.
			containerNode.addEventListener('focus', this.onFocus, true);

			if (!this.props.hideScrollbars) {
				this.updateScrollbars();
			}

			this.isFirstRendered = true;
		}

		componentDidUpdate () {
			const containerNode = this.childRef.getContainerNode();

			this.horizontalScrollability = this.childRef.isHorizontal();
			this.verticalScrollability = this.childRef.isVertical();
			this.isInitializing = false;

			// Need to sync calculated client size if it is different from the real size
			if (this.childRef.syncClientSize) {
				this.childRef.syncClientSize();
			}

			// FIXME `onWheel` doesn't work on the v8 snapshot.
			this.containerRef.addEventListener('wheel', this.onWheel);

			// FIXME `onScroll` doesn't work on the v8 snapshot.
			containerNode.addEventListener('scroll', this.onScroll, true);
			// FIXME `onFocus` doesn't work on the v8 snapshot.
			containerNode.addEventListener('focus', this.onFocus, true);

			if (!this.props.hideScrollbars) {
				this.updateScrollbars();
			}

			if (this.isFirstRendered) {
				this.isFirstRendered = false;
				if (this.childRef.readyForRtl) {
					this.childRef.readyForRtl();
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
