import clamp from 'ramda/src/clamp';
import classNames from 'classnames';
import {contextTypes as contextTypesState, Publisher} from '@enact/core/internal/PubSub';
import {forward} from '@enact/core/handle';
import {is} from '@enact/core/keymap';
import {Job} from '@enact/core/util';
import {on, off} from '@enact/core/dispatcher';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {contextTypes as contextTypesResize} from '../Resizable';
import ri from '../resolution';
import Touchable from '../Touchable';

import ScrollAnimator from './ScrollAnimator';
import Scrollbar from './Scrollbar';

import css from './Scrollable.less';

const
	constants = {
		epsilon: 1,
		isPageDown: is('pageDown'),
		isPageUp: is('pageUp'),
		nop: () => {},
		overscrollTypes: {
			none: 0,
			scrolling: 1,
			sticking: 2
		},
		overscrollVelocityFactor: 300,
		paginationPageMultiplier: 0.8,
		scrollStopWaiting: 200,
		scrollWheelPageMultiplierForMaxPixel: 0.2 // The ratio of the maximum distance scrolled by wheel to the size of the viewport.
	},
	{
		epsilon,
		isPageDown,
		isPageUp,
		nop,
		overscrollTypes,
		overscrollVelocityFactor,
		paginationPageMultiplier,
		scrollStopWaiting,
		scrollWheelPageMultiplierForMaxPixel
	} = constants;

const TouchableDiv = Touchable('div');

/**
 * An unstyled native component that passes scrollable behavior information as its render prop's arguments.
 *
 * @class ScrollableBaseNative
 * @memberof ui/ScrollableNative
 * @ui
 * @private
 */
class ScrollableBaseNative extends Component {
	static displayName = 'ui:ScrollableNative'

	static propTypes = /** @lends ui/ScrollableNative.ScrollableNative.prototype */ {
		/**
		 * Render function.
		 *
		 * @type {Function}
		 * @required
		 * @private
		 */
		containerRenderer: PropTypes.func.isRequired,

		/**
		 * Called when adding additional event listeners in a themed component.
		 *
		 * @type {Function}
		 * @private
		 */
		addEventListeners: PropTypes.func,

		/**
		 * Called to execute additional logic in a themed component to show overscroll effect.
		 *
		 * @type {Function}
		 * @private
		 */
		applyOverscrollEffect: PropTypes.func,

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
		 *
		 * @type {Function}
		 * @public
		 */
		cbScrollTo: PropTypes.func,

		/**
		 * Called to execute additional logic in a themed component to clear overscroll effect.
		 *
		 * @type {Function}
		 * @private
		 */
		clearAllOverscrollEffects: PropTypes.func,

		/**
		 * Direction of the list or the scroller.
		 * `'both'` could be only used for[Scroller]{@link ui/Scroller.Scroller}.
		 *
		 * Valid values are:
		 * * `'both'`,
		 * * `'horizontal'`, and
		 * * `'vertical'`.
		 *
		 * @type {String}
		 * @private
		 */
		direction: PropTypes.oneOf(['both', 'horizontal', 'vertical']),

		/**
		 * Specifies how to show horizontal scrollbar.
		 *
		 * Valid values are:
		 * * `'auto'`,
		 * * `'visible'`, and
		 * * `'hidden'`.
		 *
		 * @type {String}
		 * @default 'auto'
		 * @public
		 */
		horizontalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden']),

		/**
		 * Called when flicking with a mouse or a touch screen.
		 *
		 * @type {Function}
		 * @private
		 */
		onFlick: PropTypes.func,

		/**
		 * Called when pressing a key.
		 *
		 * @type {Function}
		 * @private
		 */
		onKeyDown: PropTypes.func,

		/**
		 * Called when trigerring a mousedown event.
		 *
		 * @type {Function}
		 * @private
		 */
		onMouseDown: PropTypes.func,

		/**
		 * Called when scrolling.
		 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`.
		 * It is not recommended to set this prop since it can cause performance degradation.
		 * Use `onScrollStart` or `onScrollStop` instead.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {Number} event.scrollLeft Scroll left value.
		 * @param {Number} event.scrollTop Scroll top value.
		 * @param {Object} event.moreInfo The object including `firstVisibleIndex` and `lastVisibleIndex` properties.
		 * @public
		 */
		onScroll: PropTypes.func,

		/**
		 * Called when scroll starts.
		 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`.
		 * You can get firstVisibleIndex and lastVisibleIndex from VirtualList with `moreInfo`.
		 *
		 * Example:
		 * ```
		 * onScrollStart = ({scrollLeft, scrollTop, moreInfo}) => {
		 *     const {firstVisibleIndex, lastVisibleIndex} = moreInfo;
		 *     // do something with firstVisibleIndex and lastVisibleIndex
		 * }
		 *
		 * render = () => (
		 *     <VirtualList
		 *         ...
		 *         onScrollStart={this.onScrollStart}
		 *         ...
		 *     />
		 * )
		 * ```
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {Number} event.scrollLeft Scroll left value.
		 * @param {Number} event.scrollTop Scroll top value.
		 * @param {Object} event.moreInfo The object including `firstVisibleIndex` and `lastVisibleIndex` properties.
		 * @public
		 */
		onScrollStart: PropTypes.func,

		/**
		 * Called when scroll stops.
		 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`.
		 * You can get firstVisibleIndex and lastVisibleIndex from VirtualList with `moreInfo`.
		 *
		 * Example:
		 * ```
		 * onScrollStop = ({scrollLeft, scrollTop, moreInfo}) => {
		 *     const {firstVisibleIndex, lastVisibleIndex} = moreInfo;
		 *     // do something with firstVisibleIndex and lastVisibleIndex
		 * }
		 *
		 * render = () => (
		 *     <VirtualList
		 *         ...
		 *         onScrollStop={this.onScrollStop}
		 *         ...
		 *     />
		 * )
		 * ```
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {Number} event.scrollLeft Scroll left value.
		 * @param {Number} event.scrollTop Scroll top value.
		 * @param {Object} event.moreInfo The object including `firstVisibleIndex` and `lastVisibleIndex` properties.
		 * @public
		 */
		onScrollStop: PropTypes.func,

		/**
		 * Called when wheeling.
		 *
		 * @type {Function}
		 * @private
		 */
		onWheel: PropTypes.func,

		/**
		 * Called when removing additional event listeners in a themed component.
		 *
		 * @type {Function}
		 * @private
		 */
		removeEventListeners: PropTypes.func,

		/**
		 * Called to execute additional logic in a themed component after scrolling.
		 *
		 * @type {Function}
		 * @private
		 */
		scrollStopOnScroll: PropTypes.func,

		/**
		 * Called to execute additional logic in a themed component when scrollTo is called.
		 *
		 * @type {Function}
		 * @private
		 */
		scrollTo: PropTypes.func,

		/**
		 * Called to execute additional logic in a themed component when scroll starts.
		 *
		 * @type {Function}
		 * @private
		 */
		start: PropTypes.func,

		/**
		 * ScrollableNative CSS style.
		 * Should be defined because we manipulate style prop in render().
		 *
		 * @type {Object}
		 * @public
		 */
		style: PropTypes.object,

		/**
		 * Specifies how to show vertical scrollbar.
		 * Valid values are:
		 * * `'auto'`,
		 * * `'visible'`, and
		 * * `'hidden'`.
		 *
		 * @type {String}
		 * @default 'auto'
		 * @public
		 */
		verticalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden'])
	}

	static contextTypes = contextTypesState

	static childContextTypes = {
		...contextTypesResize,
		...contextTypesState
	}

	static defaultProps = {
		cbScrollTo: nop,
		horizontalScrollbar: 'auto',
		onScroll: nop,
		onScrollStart: nop,
		onScrollStop: nop,
		verticalScrollbar: 'auto'
	}

	constructor (props) {
		super(props);

		this.state = {
			rtl: false,
			remeasure: false,
			isHorizontalScrollbarVisible: props.horizontalScrollbar === 'visible',
			isVerticalScrollbarVisible: props.verticalScrollbar === 'visible'
		};

		this.horizontalScrollbarProps = {
			ref: this.initHorizontalScrollbarRef,
			vertical: false
		};

		this.verticalScrollbarProps = {
			ref: this.initVerticalScrollbarRef,
			vertical: true
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
		this.addEventListeners();
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

		this.addEventListeners();
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
		if (this.scrolling) {
			this.forwardScrollEvent('onScrollStop');
		}
		this.scrollStopJob.stop();

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

	// constants
	pixelPerLine = 39
	scrollWheelMultiplierForDeltaPixel = 1.5 // The ratio of wheel 'delta' units to pixels scrolled.

	// status
	deferScrollTo = true
	isScrollAnimationTargetAccumulated = false
	isUpdatedScrollThumb = false

	// overscroll
	overscrollStatus = {
		horizontal: {type: overscrollTypes.none, ratio: 0},
		vertical: {type: overscrollTypes.none, ratio: 0}
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

	// wheel/drag/flick info
	wheelDirection = 0
	isDragging = false
	isTouching = false

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

	// event handler for browser native scroll

	getRtlX = (x) => (this.state.rtl ? -x : x)

	onMouseDown = (ev) => {
		this.isScrollAnimationTargetAccumulated = false;
		this.stop();
		forward('onMouseDown', ev, this.props);
	}

	onTouchStart = () => {
		this.isTouching = true;
	}

	onDragStart = (ev) => {
		if (!this.isTouching) {
			this.stop();
			this.isDragging = true;
		}

		// these values are used also for touch inputs
		this.dragStartX = this.scrollLeft + this.getRtlX(ev.x);
		this.dragStartY = this.scrollTop + ev.y;
	}

	onDrag = (ev) => {
		const
			{direction} = this.props,
			targetX = (direction === 'vertical') ? 0 : this.dragStartX - this.getRtlX(ev.x), // 'horizontal' or 'both'
			targetY = (direction === 'horizontal') ? 0 : this.dragStartY - ev.y; // 'vertical' or 'both'

		if (!this.isTouching) {
			this.updateOverscrollEffectOnPosition(targetX, targetY, overscrollTypes.sticking);
			this.start(targetX, targetY, false);
		} else {
			this.updateOverscrollEffectOnPosition(targetX, targetY, overscrollTypes.sticking);
		}
	}

	onDragEnd = () => {
		if (this.flickTarget) {
			const {targetX, targetY} = this.flickTarget;

			this.updateOverscrollEffectOnPosition(targetX, targetY, overscrollTypes.scrolling);

			if (!this.isTouching) {
				this.isScrollAnimationTargetAccumulated = false;
				this.start(targetX, targetY);
			}
		} else if (!this.isTouching) {
			this.stop();
		}

		this.clearAllOverscrollEffects();
		this.isTouching = false;
		this.isDragging = false;
		this.flickTarget = null;
	}

	onFlick = (ev) => {
		const {direction} = this.props;

		if (!this.isTouching) {
			this.flickTarget = this.animator.simulate(
				this.scrollLeft,
				this.scrollTop,
				(direction !== 'vertical') ? this.getRtlX(-ev.velocityX) : 0,
				(direction !== 'horizontal') ? -ev.velocityY : 0
			);
		} else {
			this.flickTarget = {
				targetX: this.scrollLeft + this.getRtlX(-ev.velocityX) * overscrollVelocityFactor, // 'horizontal' or 'both'
				targetY: this.scrollTop + -ev.velocityY * overscrollVelocityFactor // 'vertical' or 'both'
			};
		}

		if (this.props.onFlick) {
			forward('onFlick', ev, this.props);
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
	 * - for horizontal scroll, supports wheel action on any children nodes since web engine cannot support this
	 * - for vertical scroll, supports wheel action on scrollbars only
	 */
	onWheel = (ev) => {
		if (this.isDragging) {
			/* prevent native scrolling feature during dragging */
			ev.preventDefault();
		} else {
			const
				bounds = this.getScrollBounds(),
				canScrollHorizontally = this.canScrollHorizontally(bounds),
				canScrollVertically = this.canScrollVertically(bounds),
				eventDeltaMode = ev.deltaMode,
				eventDelta = (-ev.wheelDeltaY || ev.deltaY);
			let
				delta = 0,
				needToHideThumb = false;

			if (this.props.onWheel) {
				forward('onWheel', ev, this.props);
				return;
			}

			this.showThumb(bounds);

			// FIXME This routine is a temporary support for horizontal wheel scroll.
			// FIXME If web engine supports horizontal wheel, this routine should be refined or removed.
			if (canScrollVertically) { // This routine handles wheel events on scrollbars for vertical scroll.
				if (eventDelta < 0 && this.scrollTop > 0 || eventDelta > 0 && this.scrollTop < bounds.maxTop) {
					const {horizontalScrollbarRef, verticalScrollbarRef} = this;

					// Not to check if ev.target is a descendant of a wrapped component which may have a lot of nodes in it.
					if ((horizontalScrollbarRef && horizontalScrollbarRef.getContainerRef().contains(ev.target)) ||
						(verticalScrollbarRef && verticalScrollbarRef.getContainerRef().contains(ev.target))) {
						delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientHeight * scrollWheelPageMultiplierForMaxPixel);
						needToHideThumb = !delta;
					}
				} else {
					this.updateOverscrollEffect('vertical', this.scrollTop + delta, overscrollTypes.scrolling, 1);
					needToHideThumb = true;
				}
			} else if (canScrollHorizontally) { // this routine handles wheel events on any children for horizontal scroll.
				if (eventDelta < 0 && this.scrollLeft > 0 || eventDelta > 0 && this.scrollLeft < bounds.maxLeft) {
					delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientWidth * scrollWheelPageMultiplierForMaxPixel);
					needToHideThumb = !delta;
				} else {
					this.updateOverscrollEffect('horizontal', this.scrollLeft + delta, overscrollTypes.scrolling, 1);
					needToHideThumb = true;
				}
			}

			if (delta !== 0) {
				/* prevent native scrolling feature for vertical direction */
				ev.preventDefault();
				const direction = Math.sign(delta);
				// Not to accumulate scroll position if wheel direction is different from hold direction
				if (direction !== this.wheelDirection) {
					this.isScrollAnimationTargetAccumulated = false;
					this.wheelDirection = direction;
				}
				this.scrollToAccumulatedTarget(delta, canScrollVertically);
			}

			if (needToHideThumb) {
				this.startHidingThumb();
			}
		}
	}

	onScroll = (ev) => {
		const
			bounds = this.getScrollBounds(),
			canScrollHorizontally = this.canScrollHorizontally(bounds);
		let
			{scrollLeft, scrollTop} = ev.target;

		if (!this.scrolling) {
			this.scrollStartOnScroll();
		}

		if (this.state.rtl && canScrollHorizontally) {
			/* FIXME: RTL / this calculation only works for Chrome */
			scrollLeft = bounds.maxLeft - scrollLeft;
		}

		this.scrollOnScroll(scrollLeft, scrollTop);

		this.startHidingThumb();
		this.scrollStopJob.start();
	}

	scrollByPage = (keyCode) => {
		// Only scroll by page when the vertical scrollbar is visible. Otherwise, treat the
		// scroller as a plain container
		if (!this.state.isVerticalScrollbarVisible) return;

		const
			bounds = this.getScrollBounds(),
			canScrollVertically = this.canScrollVertically(bounds),
			pageDistance = (isPageUp(keyCode) ? -1 : 1) * (canScrollVertically ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier;

		this.scrollToAccumulatedTarget(pageDistance, canScrollVertically);
	}

	onKeyDown = (ev) => {
		if (this.props.onKeyDown) {
			forward('onKeyDown', ev, this.props);
		} else if (isPageUp(ev.keyCode) || isPageDown(ev.keyCode)) {
			ev.preventDefault();
			if (!ev.repeat) {
				this.scrollByPage(ev.keyCode);
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
			this.updateOverscrollEffect('vertical', this.accumulatedTargetY, overscrollTypes.scrolling, 1);
		} else {
			this.accumulatedTargetX += delta;
			this.updateOverscrollEffect('horizontal', this.accumulatedTargetX, overscrollTypes.scrolling, 1);
		}

		this.start(this.accumulatedTargetX, this.accumulatedTargetY);
	}

	// overscroll effect

	getScrollabilities = (orientation) => {
		const bounds = this.getScrollBounds();
		return (orientation === 'vertical') ? this.canScrollVertically(bounds) : this.canScrollHorizontally(bounds);
	}

	setOverscrollStatus = (orientation, type, ratio) => {
		const status = this.overscrollStatus[orientation];
		status.type = type;
		status.ratio = ratio;
	}

	getOverscrollStatus = (orientation) => (this.overscrollStatus[orientation])

	getOverscrollRatio = (orientation, position) => {
		const
			bounds = this.getScrollBounds(),
			isVertical = (orientation === 'vertical'),
			baseSize = isVertical ? bounds.clientHeight : bounds.clientWidth,
			maxPos = bounds[isVertical ? 'maxTop' : 'maxLeft'];
		let overDistance = 0;

		if (position < 0) {
			overDistance = -position;
		} else if (position > maxPos) {
			overDistance = position - maxPos;
		}

		return clamp(0, 1, 2 * overDistance / baseSize);
	}

	updateOverscrollEffectOnPosition = (targetX, targetY, type, ratio) => {
		this.updateOverscrollEffect('horizontal', targetX, type, ratio);
		this.updateOverscrollEffect('vertical', targetY, type, ratio);
	}

	updateOverscrollEffectByDirection = (orientation, position, type, ratio = null) => {
		const applyOverscrollEffect = this.props.applyOverscrollEffect;

		if (applyOverscrollEffect && this.getScrollabilities(orientation)) {
			const
				isVertical = (orientation === 'vertical'),
				curPos = isVertical ? this.scrollTop : this.scrollLeft,
				maxPos = this.getScrollBounds()[isVertical ? 'maxTop' : 'maxLeft'];
			let
				newType = type,
				newRatio = (ratio === null) ? 1 : ratio;

			if (newRatio > 0) {
				if (type === overscrollTypes.scrolling) {
					if (position === 'before' && curPos <= 0) { // Already on the beginning egde
						applyOverscrollEffect(orientation, 'before', type, ratio);
						newType = overscrollTypes.none;
						newRatio = 0;
					} else if (position >= 'after' && curPos >= maxPos) { // Already on the ending egde
						applyOverscrollEffect(orientation, 'after', type, ratio);
						newType = overscrollTypes.none;
						newRatio = 0;
					}
				} else if (type === overscrollTypes.sticking) {
					if (position === 'before' && curPos <= 0) { // Already on the beginning egde
						applyOverscrollEffect(orientation, 'before', type, ratio);
					} else if (position === 'after' && curPos >= maxPos) { // Already on the ending egde
						applyOverscrollEffect(orientation, 'after', type, ratio);
					}
				}

				this.setOverscrollStatus(orientation, newType, newRatio);
			}
		}
	}

	updateOverscrollEffect = (orientation, position, type, ratio = null) => {
		const applyOverscrollEffect = this.props.applyOverscrollEffect;

		if (applyOverscrollEffect && this.getScrollabilities(orientation)) {
			const
				isVertical = (orientation === 'vertical'),
				curPos = isVertical ? this.scrollTop : this.scrollLeft,
				maxPos = this.getScrollBounds()[isVertical ? 'maxTop' : 'maxLeft'];
			let
				newType = type,
				newRatio = (ratio === null) ? this.getOverscrollRatio(orientation, position) : ratio;

			if (newRatio > 0) {
				if (type === overscrollTypes.scrolling) {
					if (position <= 0 && curPos <= 0) { // Already on the beginning egde
						applyOverscrollEffect(orientation, 'before', type, newRatio);
						newType = overscrollTypes.none;
						newRatio = 0;
					} else if (position >= maxPos && curPos >= maxPos) { // Already on the ending egde
						applyOverscrollEffect(orientation, 'after', type, newRatio);
						newType = overscrollTypes.none;
						newRatio = 0;
					}
				} else if (type === overscrollTypes.sticking) {
					if (position <= 0 && curPos <= 0) { // Already on the beginning egde
						applyOverscrollEffect(orientation, 'before', type, newRatio);
					} else if (position >= maxPos && curPos >= maxPos) { // Already on the ending egde
						applyOverscrollEffect(orientation, 'after', type, newRatio);
					}
				}

				this.setOverscrollStatus(orientation, newType, newRatio);
			}
		}
	}

	clearAllOverscrollEffects = () => {
		if (this.props.clearAllOverscrollEffects) {
			this.props.clearAllOverscrollEffects();
		}

		this.setOverscrollStatus('horizontal', overscrollTypes.none);
		this.setOverscrollStatus('vertical', overscrollTypes.none);
	}

	// call scroll callbacks

	forwardScrollEvent (type) {
		forward(type, {scrollLeft: this.scrollLeft, scrollTop: this.scrollTop, moreInfo: this.getMoreInfo()}, this.props);
	}

	// call scroll callbacks and update scrollbars for native scroll

	scrollStartOnScroll = () => {
		this.scrolling = true;
		this.showThumb(this.getScrollBounds());
		this.forwardScrollEvent('onScrollStart');
	}

	scrollStopOnScroll = () => {
		if (this.props.scrollStopOnScroll) {
			this.props.scrollStopOnScroll();
		}
		if (!this.isDragging) {
			this.clearAllOverscrollEffects();
		}
		this.isScrollAnimationTargetAccumulated = false;
		this.scrolling = false;
		this.forwardScrollEvent('onScrollStop');
	}

	scrollOnScroll = (left, top) => {
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
		this.forwardScrollEvent('onScroll');
	}

	scrollStopJob = new Job(this.scrollStopOnScroll.bind(this), scrollStopWaiting);

	// update scroll position

	setScrollLeft (value) {
		const
			bounds = this.getScrollBounds(),
			maxValue = bounds.maxLeft,
			{type, ratio} = this.getOverscrollStatus('horizontal');

		this.scrollLeft = clamp(0, maxValue, value);

		if (type === overscrollTypes.scrolling) {
			this.updateOverscrollEffect('horizontal', this.scrollLeft, type, ratio);
		}

		if (this.state.isHorizontalScrollbarVisible) {
			this.updateThumb(this.horizontalScrollbarRef, bounds);
		}
	}

	setScrollTop (value) {
		const
			bounds = this.getScrollBounds(),
			maxValue = bounds.maxTop,
			{type, ratio} = this.getOverscrollStatus('vertical');

		this.scrollTop = clamp(0, maxValue, value);

		if (type === overscrollTypes.scrolling) {
			this.updateOverscrollEffect('vertical', this.scrollTop, type, ratio);
		}

		if (this.state.isVerticalScrollbarVisible) {
			this.updateThumb(this.verticalScrollbarRef, bounds);
		}
	}

	// scroll start

	start (targetX, targetY, animate = true) {
		const
			bounds = this.getScrollBounds(),
			childRef = this.childRef,
			childContainerRef = childRef.containerRef;

		if ((bounds.maxLeft - targetX) < epsilon) {
			targetX = bounds.maxLeft;
		}
		if ((bounds.maxTop - targetY) < epsilon) {
			targetY = bounds.maxTop;
		}

		if (animate) {
			childRef.scrollToPosition(targetX, targetY);
		} else {
			childContainerRef.style.scrollBehavior = null;
			childRef.scrollToPosition(targetX, targetY);
			childContainerRef.style.scrollBehavior = 'smooth';
		}

		if (this.props.start) {
			this.props.start(animate);
		}
	}

	stop () {
		const
			childRef = this.childRef,
			childContainerRef = childRef.containerRef;

		childContainerRef.style.scrollBehavior = null;
		childRef.scrollToPosition(this.scrollLeft + 0.1, this.scrollTop + 0.1);
		childContainerRef.style.scrollBehavior = 'smooth';
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

			if (this.props.scrollTo) {
				this.props.scrollTo(opt);
			}
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
		const {direction} = this.props;
		return (direction === 'horizontal' || direction === 'both') && (bounds.scrollWidth > bounds.clientWidth) && !isNaN(bounds.scrollWidth);
	}

	canScrollVertically = (bounds) => {
		const {direction} = this.props;
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

	// FIXME setting event handlers directly to work on the V8 snapshot.
	addEventListeners () {
		const {childRef, containerRef} = this;

		if (containerRef && containerRef.addEventListener) {
			containerRef.addEventListener('wheel', this.onWheel);
		}

		if (childRef && childRef.containerRef) {
			if (childRef.containerRef.addEventListener) {
				childRef.containerRef.addEventListener('scroll', this.onScroll, {capture: true});
				childRef.containerRef.addEventListener('mousedown', this.onMouseDown);
			}
			this.childRef.containerRef.style.scrollBehavior = 'smooth';
		}

		if (this.props.addEventListeners) {
			this.props.addEventListeners(childRef.containerRef);
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	removeEventListeners () {
		const {childRef, containerRef} = this;

		if (containerRef && containerRef.removeEventListener) {
			containerRef.removeEventListener('wheel', this.onWheel);
		}

		if (childRef && childRef.containerRef && childRef.containerRef.removeEventListener) {
			childRef.containerRef.removeEventListener('scroll', this.onScroll, {capture: true});
			childRef.containerRef.removeEventListener('mousedown', this.onMouseDown);
		}

		if (this.props.removeEventListeners) {
			this.props.removeEventListeners(childRef.containerRef);
		}
	}

	// render

	initChildRef = (ref) => {
		if (ref) {
			this.childRef = ref;
		}
	}

	initContainerRef = (ref) => {
		if (ref) {
			this.containerRef = ref;
		}
	}

	initHorizontalScrollbarRef = (ref) => {
		if (ref) {
			this.horizontalScrollbarRef = ref;
		}
	}

	initVerticalScrollbarRef = (ref) => {
		if (ref) {
			this.verticalScrollbarRef = ref;
		}
	}

	render () {
		const
			{className, containerRenderer, style, ...rest} = this.props,
			{isHorizontalScrollbarVisible, isVerticalScrollbarVisible, rtl} = this.state,
			scrollableClasses = classNames(css.scrollable, className);

		delete rest.addEventListeners;
		delete rest.applyOverscrollEffect;
		delete rest.cbScrollTo;
		delete rest.clearAllOverscrollEffects;
		delete rest.horizontalScrollbar;
		delete rest.onFlick;
		delete rest.onKeyDown;
		delete rest.onMouseDown;
		delete rest.onScroll;
		delete rest.onScrollStart;
		delete rest.onScrollStop;
		delete rest.onWheel;
		delete rest.removeEventListeners;
		delete rest.scrollStopOnScroll;
		delete rest.scrollTo;
		delete rest.start;
		delete rest.verticalScrollbar;

		return containerRenderer({
			childComponentProps: rest,
			className: scrollableClasses,
			componentCss: css,
			horizontalScrollbarProps: this.horizontalScrollbarProps,
			initChildRef: this.initChildRef,
			initContainerRef: this.initContainerRef,
			isHorizontalScrollbarVisible,
			isVerticalScrollbarVisible,
			rtl,
			scrollTo: this.scrollTo,
			style,
			touchableProps: {
				className: css.content,
				onDrag: this.onDrag,
				onDragEnd: this.onDragEnd,
				onDragStart: this.onDragStart,
				onFlick: this.onFlick,
				onTouchStart: this.onTouchStart
			},
			verticalScrollbarProps: this.verticalScrollbarProps
		});
	}
}

/**
 * An unstyled native component that provides horizontal and vertical scrollbars and makes a render prop element scrollable.
 *
 * @class ScrollableNative
 * @memberof ui/ScrollableNative
 * @extends ui/Scrollable.ScrollableBaseNative
 * @ui
 * @private
 */
class ScrollableNative extends Component {
	static displayName = 'ui:ScrollableNative'

	static propTypes = /** @lends ui/ScrollableNative.ScrollableNative.prototype */ {
		/**
		 * Render function.
		 *
		 * @type {Function}
		 * @private
		 */
		childRenderer: PropTypes.func
	}

	render () {
		const {childRenderer, ...rest} = this.props;

		return (
			<ScrollableBaseNative
				{...rest}
				containerRenderer={({ // eslint-disable-line react/jsx-no-bind
					childComponentProps,
					className,
					componentCss,
					horizontalScrollbarProps,
					initContainerRef,
					initChildRef,
					isHorizontalScrollbarVisible,
					isVerticalScrollbarVisible,
					rtl,
					scrollTo,
					style,
					touchableProps,
					verticalScrollbarProps
				}) => (
					<div
						className={className}
						ref={initContainerRef}
						style={style}
					>
						<div className={componentCss.container}>
							<TouchableDiv {...touchableProps}>
								{childRenderer({
									...childComponentProps,
									cbScrollTo: scrollTo,
									className: componentCss.scrollableFill,
									initChildRef,
									rtl
								})}
							</TouchableDiv>
							{isVerticalScrollbarVisible ? <Scrollbar {...verticalScrollbarProps} disabled={!isVerticalScrollbarVisible} /> : null}
						</div>
						{isHorizontalScrollbarVisible ? <Scrollbar {...horizontalScrollbarProps} corner={isVerticalScrollbarVisible} disabled={!isHorizontalScrollbarVisible} /> : null}
					</div>
				)}
			/>
		);
	}
}

export default ScrollableNative;
export {
	constants,
	ScrollableBaseNative,
	ScrollableNative
};
