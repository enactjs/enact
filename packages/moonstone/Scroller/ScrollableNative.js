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
import {getDirection} from '@enact/spotlight';
import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ri from '@enact/ui/resolution';
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

const ScrollableSpotlightContainer = SpotlightContainerDecorator(
	{
		navigableFilter: (elem, {focusableScrollbar}) => {
			if (!focusableScrollbar && elem.classList.contains(scrollbarCss.scrollButton)) {
				return false;
			}
		}
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
 * Scrollable catches `onFocus`, `onKeyUp`, and `onKeyDown` events from its wrapped component for spotlight features,
 * and also catches `onWheel` and `onScroll` events from its wrapped component for scrolling behaviors.
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

		static childContextTypes = contextTypesResize
		static contextTypes = contextTypesRtl

		constructor (props) {
			super(props);

			this.state = {
				isHorizontalScrollbarVisible: this.isHorizontalScrollbarVisible(),
				isVerticalScrollbarVisible: this.isVerticalScrollbarVisible()
			};

			this.initChildRef = this.initRef('childRef');
			this.initContainerRef = this.initRef('containerRef');

			// wheel, scroll, and focus event handlers will be added after mounting
			this.eventHandlers = {
				onKeyDown: this.onKeyDown,
				onKeyUp: this.onKeyUp
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
		scrolling = false
		resetPosition = null // prevent auto-scroll on focus by Spotlight

		// event handler for browser native scroll

		onMouseDown = () => {
			this.isScrollAnimationTargetAccumulated = false;
			this.lastFocusedItem = null;
			this.childRef.setContainerDisabled(false);
		}

		onMouseOver = () => {
			this.resetPosition = this.childRef.getContainerNode().scrollTop;
		}

		onMouseMove = () => {
			if (this.resetPosition) {
				const containerNode = this.childRef.getContainerNode();
				containerNode.style.scrollBehavior = null;
				containerNode.scrollTop = this.resetPosition;
				containerNode.style.scrollBehavior = 'smooth';
				this.resetPosition = null;
			}
		}

		onWheel = (e) => {
			this.childRef.setContainerDisabled(true);
			this.lastFocusedItem = null;
			if (typeof window !== 'undefined') {
				window.document.activeElement.blur();
			}

			// FIXME This routine is a temporary support for horizontal wheel scroll.
			// FIXME If web engine supports horizontal wheel, this routine should be refined or removed.
			if (this.horizontalScrollability && !this.verticalScrollability) {
				const
					bounds = this.getScrollBounds(),
					deltaMode = e.deltaMode,
					wheelDeltaY = e.nativeEvent ? -e.nativeEvent.wheelDeltaY : -e.wheelDeltaY,
					scrollWheelMultiplierForDeltaPixel = 2,
					pixelPerLine = scrollWheelMultiplierForDeltaPixel * ri.scale(39);

				let delta = (wheelDeltaY || e.deltaY);

				if (deltaMode === 0) {
					delta = ri.scale(delta) * scrollWheelMultiplierForDeltaPixel;
				} else if (deltaMode === 1) { // line; firefox
					delta = ri.scale(delta) * pixelPerLine;
				} else if (deltaMode === 2) { // page
					delta = delta > 0 ? bounds.clientWidth : -bounds.clientWidth;
				}

				/* prevent native scrolling feature for vertical direction */
				e.preventDefault();

				this.scrollToAccumulatedTarget(delta, true, false);
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
			this.lastFocusedItem = null;

			this.hideThumb(this.getScrollBounds());
			this.scrolling = false;
			this.doScrollStop();
		}

		scrollStopJob = new Job(this.scrollStopOnScroll.bind(this), scrollStopWaiting);

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

		// scroll start

		start (targetX, targetY, animate = true, indexToFocus, nodeToFocus) {
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
				this.focusOnItem({indexToFocus, nodeToFocus});
			}
		}

		focusOnItem ({indexToFocus, nodeToFocus}) {
			if (indexToFocus !== null && typeof this.childRef.focusByIndex === 'function') {
				this.childRef.focusByIndex(indexToFocus);
			}
			if (nodeToFocus !== null && typeof this.childRef.focusOnNode === 'function') {
				this.childRef.focusOnNode(nodeToFocus);
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
						itemPos = this.childRef.getItemPosition(opt.index);
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
			if (!this.isInitializing) {
				const {left, top} = this.getPositionForScrollTo(opt);
				let indexToFocus = null;
				this.scrollToInfo = null;

				if (typeof opt.indexToFocus === 'number') {
					indexToFocus = opt.indexToFocus;
					deprecate({name: 'indexToFocus', since: '1.2.0', message: 'Use `focus` instead', until: '2.0.0'});
				}

				if (left !== null || top !== null) {
					this.start(
						(left !== null) ? left : this.scrollLeft,
						(top !== null) ? top : this.scrollTop,
						opt.animate,
						(opt.focus && typeof opt.index === 'number') ? opt.index : indexToFocus,
						(opt.focus && opt.node instanceof Object && opt.node.nodeType === 1) ? opt.node : null
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
			containerNode.addEventListener('scroll', this.onScroll, {capture: true});
			// FIXME `onFocus` doesn't work on the v8 snapshot.
			containerNode.addEventListener('focus', this.onFocus, {capture: true});
			// FIXME `onMouseOver` doesn't work on the v8 snapshot.
			containerNode.addEventListener('mouseover', this.onMouseOver, {capture: true});
			// FIXME `onMouseMove` doesn't work on the v8 snapshot.
			containerNode.addEventListener('mousemove', this.onMouseMove, {capture: true});

			containerNode.style.scrollBehavior = 'smooth';

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
			this.forceUpdateJob.stop();
		}

		// forceUpdate is a bit jarring and may interrupt other actions like animation so we'll
		// queue it up in case we get multiple calls (e.g. when grouped expandables toggle).
		//
		// TODO: consider replacing forceUpdate() by storing bounds in state rather than a non-
		// state member.
		enqueueForceUpdate = () => {
			this.forceUpdateJob.start();
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

		render () {
			const
				props = Object.assign({}, this.props),
				{className, focusableScrollbar, style} = this.props,
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
			delete props.focusableScrollbar;
			delete props.style;
			delete props.verticalScrollbar;

			return (
				<ScrollableSpotlightContainer
					className={scrollableClasses}
					containerRef={this.initContainerRef}
					focusableScrollbar={focusableScrollbar}
					style={style}
				>
					{vscrollbar}
					{hscrollbar}
					<Wrapped {...props} {...this.eventHandlers} ref={this.initChildRef} cbScrollTo={this.scrollTo} className={css.container} />
				</ScrollableSpotlightContainer>
			);
		}
	};
});

export default ScrollableHoC;
export {dataIndexAttribute, ScrollableHoC as ScrollableNative};
