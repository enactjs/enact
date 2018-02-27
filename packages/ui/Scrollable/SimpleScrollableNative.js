import clamp from 'ramda/src/clamp';
import classNames from 'classnames';
import {contextTypes as contextTypesState, Publisher} from '@enact/core/internal/PubSub';
import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import {Job} from '@enact/core/util';
import {on, off} from '@enact/core/dispatcher';
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
		epsilon: 1,
		isPageDown: is('pageDown'),
		isPageUp: is('pageUp'),
		nop: () => {},
		paginationPageMultiplier: 0.8,
		scrollStopWaiting: 200,
		scrollWheelPageMultiplierForMaxPixel: 0.2 // The ratio of the maximum distance scrolled by wheel to the size of the viewport.
	},
	{
		epsilon,
		isPageDown,
		isPageUp,
		nop,
		paginationPageMultiplier,
		scrollStopWaiting,
		scrollWheelPageMultiplierForMaxPixel
	} = constants;

/**
 * The context propTypes required by ScrollableNative. This should be set as the `childContextTypes` of a
 * themed component so that the methods from themed component can be called.
 *
 * @private
 */
const contextTypes = {
	initialize: PropTypes.func,
	onKeyDown: PropTypes.func,
	onMouseDown: PropTypes.func,
	onWheel: PropTypes.func,
	removeEventListeners: PropTypes.func,
	scrollTo: PropTypes.func,
	scrollStopOnScroll: PropTypes.func,
	start: PropTypes.func,
	updateEventListeners: PropTypes.func
};

/**
 * A Higher-order Component that applies a ScrollableNative behavior to its wrapped component.
 *
 * @class ScrollableNative
 * @memberof ui/Scrollable
 * @ui
 * @private
 */
const ScrollableNative = hoc((config, Wrapped) => (
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
			 * Render function for Scrollable
			 *
			 * @type {Function}
			 * @public
			 */
			render: PropTypes.func,

			/**
			 * Scrollable CSS style.
			 * Should be defined because we manuplate style prop in render().
			 *
			 * @type {Object}
			 * @public
			 */
			style: PropTypes.object
		}

		static defaultProps = {
			cbScrollTo: nop,
			onScroll: nop,
			onScrollStart: nop,
			onScrollStop: nop,
		}

		static childContextTypes = {
			...contextTypesResize,
			...contextTypesState
		}

		static contextTypes = {
			...contextTypesState,
			...contextTypes
		}

		constructor (props, context) {
			super(props, context);

			this.state = {
				rtl: false,
				remeasure: false
			};

			this.initChildRef = this.initRef('childRef');
			this.initContainerRef = this.initRef('containerRef');

			props.cbScrollTo(context.scrollTo || this.scrollTo);

			if (context.initialize) {
				context.initialize(this);
			}
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
			on('keydown', this.context.onKeyDown || this.onKeyDown);
		}

		componentWillUpdate () {
			this.deferScrollTo = true;
		}

		componentDidUpdate (prevProps, prevState) {
			// Need to sync calculated client size if it is different from the real size
			if (this.childRef.syncClientSize) {
				// If we actually synced, we need to reset scroll position.
				if (this.childRef.syncClientSize()) {
					this.setScrollLeft(0);
					this.setScrollTop(0);
				}
			}

			this.direction = this.childRef.props.direction;
			this.updateEventListeners();

			if (this.scrollToInfo !== null) {
				if (!this.deferScrollTo) {
					this.scrollTo(this.scrollToInfo);
				}
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
			off('keydown', this.context.onKeyDown || this.onKeyDown);
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
		deferScrollTo = true
		pageDistance = 0
		pageDirection = 0

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
		scrolling = false
		scrollLeft = 0
		scrollTop = 0
		scrollToInfo = null

		// component info
		childRef = null
		containerRef = null

		// event handler for browser native scroll

		onMouseDown = () => {
			this.isScrollAnimationTargetAccumulated = false;

			if (this.context.onMouseDown) {
				this.context.onMouseDown();
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
		onWheel = (e) => {
			const
				bounds = this.getScrollBounds(),
				canScrollHorizontally = this.canScrollHorizontally(bounds),
				canScrollVertically = this.canScrollVertically(bounds),
				eventDeltaMode = e.deltaMode,
				eventDelta = (-e.wheelDeltaY || e.deltaY);
			let
				delta = 0;


			if (canScrollHorizontally) { // this routine handles wheel events on any children for horizontal scroll.
				if (eventDelta < 0 && this.scrollLeft > 0 || eventDelta > 0 && this.scrollLeft < bounds.maxLeft) {
					delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientWidth * scrollWheelPageMultiplierForMaxPixel);
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

		scrollByPage = (keyCode) => {
			const
				bounds = this.getsBounds(),
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
		}

		setScrollTop (value) {
			const bounds = this.getScrollBounds();

			this.scrollTop = clamp(0, bounds.maxTop, value);
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

			if (this.context.start) {
				this.context.start(animate);
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
			const
				{containerRef} = this,
				childContainerRef = this.childRef.containerRef;

			if (containerRef && containerRef.addEventListener) {
				// FIXME `onWheel` doesn't work on the v8 snapshot.
				containerRef.addEventListener('wheel', this.context.onWheel || this.onWheel);
			}
			if (childContainerRef && childContainerRef.addEventListener) {
				// FIXME `onScroll` doesn't work on the v8 snapshot.
				childContainerRef.addEventListener('scroll', this.onScroll, {capture: true});
			}

			childContainerRef.style.scrollBehavior = 'smooth';

			if (this.context.updateEventListeners) {
				this.context.updateEventListeners();
			}
		}

		removeEventListeners () {
			const
				{containerRef} = this,
				childContainerRef = this.childRef.containerRef;

			if (containerRef && containerRef.removeEventListener) {
				// FIXME `onWheel` doesn't work on the v8 snapshot.
				containerRef.removeEventListener('wheel', this.context.onWheel || this.onWheel);
			}
			if (childContainerRef && childContainerRef.removeEventListener) {
				// FIXME `onScroll` doesn't work on the v8 snapshot.
				childContainerRef.removeEventListener('scroll', this.onScroll, {capture: true});
			}

			if (this.context.removeEventListeners) {
				this.context.removeEventListeners();
			}
		}

		// render

		initRef (prop) {
			return (ref) => {
				this[prop] = ref;
			};
		}

		renderChildren = (rest) => {

			delete rest.cbScrollTo;
			delete rest.onScroll;
			delete rest.onScrollStart;
			delete rest.onScrollStop;

			return (
				<div className={css.container}>
					<Wrapped
						{...rest}
						cbScrollTo={this.context.scrollTo || this.scrollTo}
						className={css.content}
						onScroll={this.handleScroll}
						ref={this.initChildRef}
					/>
				</div>
			);
		}

		render () {
			const
				{className, render, style, ...rest} = this.props,
				scrollableClasses = classNames(css.scrollable, className),
				children = this.renderChildren(rest);

			return (
				render ?
					render({
						initContainerRef: this.initContainerRef,
						children,
						className: scrollableClasses,
						style
					}) :
					<div
						className={scrollableClasses}
						ref={this.initContainerRef}
						style={style}
					>
						{children}
					</div>
			);
		}
	}
));

export default ScrollableNative;
export {
	ScrollableNative,
	constants,
	contextTypes
};
