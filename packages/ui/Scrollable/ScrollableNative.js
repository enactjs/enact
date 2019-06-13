import clamp from '@enact/core/internal/fp/clamp';
import classNames from 'classnames';
import {forward} from '@enact/core/handle';
import {is} from '@enact/core/keymap';
import {Job} from '@enact/core/util';
import {platform} from '@enact/core/platform';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Registry from '@enact/core/internal/Registry';

import {ResizeContext} from '../Resizable';
import ri from '../resolution';
import Touchable from '../Touchable';

import ScrollAnimator from './ScrollAnimator';
import Scrollbar from './Scrollbar';

import css from './Scrollable.module.less';

const
	constants = {
		epsilon: 1,
		isPageDown: is('pageDown'),
		isPageUp: is('pageUp'),
		nop: () => {},
		overscrollTypeNone: 0,
		overscrollTypeHold: 1,
		overscrollTypeOnce: 2,
		overscrollTypeDone: 9,
		overscrollVelocityFactor: 300,
		scrollStopWaiting: 200,
		scrollWheelPageMultiplierForMaxPixel: 0.2 // The ratio of the maximum distance scrolled by wheel to the size of the viewport.
	},
	{
		epsilon,
		nop,
		overscrollTypeDone,
		overscrollTypeHold,
		overscrollTypeNone,
		overscrollTypeOnce,
		overscrollVelocityFactor,
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
		 * A callback function that receives a reference to the `scrollTo` feature.
		 *
		 * Once received, the `scrollTo` method can be called as an imperative interface.
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
		clearOverscrollEffect: PropTypes.func,

		/**
		 * Client size of the container; valid values are an object that has `clientWidth` and `clientHeight`.
		 *
		 * @type {Object}
		 * @property {Number}    clientHeight    The client height of the list.
		 * @property {Number}    clientWidth    The client width of the list.
		 * @public
		 */
		clientSize: PropTypes.shape({
			clientHeight: PropTypes.number.isRequired,
			clientWidth: PropTypes.number.isRequired
		}),

		/**
		 * Direction of the list or the scroller.
		 *
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
		 * Prevents scroll by dragging or flicking on the list or the scroller.
		 *
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		noScrollByDrag: PropTypes.bool,

		/**
		 * Prevents scroll by wheeling on the list or the scroller.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noScrollByWheel: PropTypes.bool,

		/**
		 * Called when flicking with a mouse or a touch screen.
		 *
		 * @type {Function}
		 * @private
		 */
		onFlick: PropTypes.func,

		/**
		 * Called when trigerring a mousedown event.
		 *
		 * @type {Function}
		 * @private
		 */
		onMouseDown: PropTypes.func,

		/**
		 * Called when scrolling.
		 *
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
		 *
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
		 *
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
		 * Specifies overscroll effects shows on which type of inputs.
		 *
		 * @type {Object}
		 * @default {drag: false, pageKey: false, wheel: false}
		 * @private
		 */
		overscrollEffectOn: PropTypes.shape({
			drag: PropTypes.bool,
			pageKey: PropTypes.bool,
			wheel: PropTypes.bool
		}),

		/**
		 * Called when removing additional event listeners in a themed component.
		 *
		 * @type {Function}
		 * @private
		 */
		removeEventListeners: PropTypes.func,

		/**
		 * Indicates the content's text direction is right-to-left.
		 *
		 * @type {Boolean}
		 * @private
		 */
		rtl: PropTypes.bool,

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
		 *
		 * Should be defined because we manipulate style prop in render().
		 *
		 * @type {Object}
		 * @public
		 */
		style: PropTypes.object,

		/**
		 * Specifies how to show vertical scrollbar.
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
		verticalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden'])
	}

	static defaultProps = {
		cbScrollTo: nop,
		horizontalScrollbar: 'auto',
		noScrollByDrag: false,
		noScrollByWheel: false,
		onScroll: nop,
		onScrollStart: nop,
		onScrollStop: nop,
		overscrollEffectOn: {drag: false, pageKey: false, wheel: false},
		verticalScrollbar: 'auto'
	}

	static contextType = ResizeContext

	constructor (props) {
		super(props);

		this.state = {
			remeasure: false,
			isHorizontalScrollbarVisible: props.horizontalScrollbar === 'visible',
			isVerticalScrollbarVisible: props.verticalScrollbar === 'visible'
		};

		this.containerRef = React.createRef();
		this.horizontalScrollbarRef = React.createRef();
		this.verticalScrollbarRef = React.createRef();

		this.horizontalScrollbarProps = {
			ref: this.horizontalScrollbarRef,
			vertical: false,
			clientSize: props.clientSize
		};

		this.verticalScrollbarProps = {
			ref: this.verticalScrollbarRef,
			vertical: true,
			clientSize: props.clientSize
		};

		this.overscrollEnabled = !!(props.applyOverscrollEffect);

		// Enable the early bail out of repeated scrolling to the same position
		this.animationInfo = null;

		this.resizeRegistry = Registry.create(this.handleResize.bind(this));

		props.cbScrollTo(this.scrollTo);
	}

	componentDidMount () {
		this.resizeRegistry.parent = this.context;
		this.addEventListeners();
		this.updateScrollbars();
	}

	componentDidUpdate (prevProps, prevState) {
		const
			{isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state,
			{hasDataSizeChanged} = this.childRefCurrent;

		// Need to sync calculated client size if it is different from the real size
		if (this.childRefCurrent.syncClientSize) {
			// If we actually synced, we need to reset scroll position.
			if (this.childRefCurrent.syncClientSize()) {
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
			this.resizeRegistry.notify({});
		}
	}

	componentWillUnmount () {
		this.resizeRegistry.parent = null;
		// Before call cancelAnimationFrame, you must send scrollStop Event.
		if (this.scrolling) {
			this.forwardScrollEvent('onScrollStop', this.getReachedEdgeInfo());
		}
		this.scrollStopJob.stop();

		this.removeEventListeners();
	}

	handleResize (ev) {
		if (ev.action === 'invalidateBounds') {
			this.enqueueForceUpdate();
		}
	}

	// TODO: consider replacing forceUpdate() by storing bounds in state rather than a non-
	// state member.
	enqueueForceUpdate () {
		this.childRefCurrent.calculateMetrics();
		this.forceUpdate();
	}

	// constants
	pixelPerLine = 39
	scrollWheelMultiplierForDeltaPixel = 1.5 // The ratio of wheel 'delta' units to pixels scrolled.

	// status
	deferScrollTo = true
	isScrollAnimationTargetAccumulated = false
	isUpdatedScrollThumb = false

	// overscroll
	lastInputType = null
	overscrollEnabled = false
	overscrollStatus = {
		horizontal: {
			before: {type: overscrollTypeNone, ratio: 0},
			after: {type: overscrollTypeNone, ratio: 0}
		},
		vertical: {
			before: {type: overscrollTypeNone, ratio: 0},
			after: {type: overscrollTypeNone, ratio: 0}
		}
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
	childRefCurrent = null

	// scroll animator
	animator = new ScrollAnimator()

	// event handler for browser native scroll

	getRtlX = (x) => (this.props.rtl ? -x : x)

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
			{direction, overscrollEffectOn} = this.props,
			targetX = (direction === 'vertical') ? 0 : this.dragStartX - this.getRtlX(ev.x), // 'horizontal' or 'both'
			targetY = (direction === 'horizontal') ? 0 : this.dragStartY - ev.y; // 'vertical' or 'both'

		this.lastInputType = 'drag';

		if (!this.isTouching) {
			this.start({targetX, targetY, animate: false, overscrollEffect: overscrollEffectOn.drag});
		} else if (this.overscrollEnabled && overscrollEffectOn.drag) {
			this.checkAndApplyOverscrollEffectOnDrag(targetX, targetY, overscrollTypeHold);
		}
	}

	onDragEnd = () => {
		this.isDragging = false;

		this.lastInputType = 'drag';

		if (this.flickTarget) {
			const
				{overscrollEffectOn} = this.props,
				{targetX, targetY} = this.flickTarget;

			if (!this.isTouching) {
				this.isScrollAnimationTargetAccumulated = false;
				this.start({targetX, targetY, overscrollEffect: overscrollEffectOn.drag});
			} else if (this.overscrollEnabled && overscrollEffectOn.drag) {
				this.checkAndApplyOverscrollEffectOnDrag(targetX, targetY, overscrollTypeOnce);
			}
		} else if (!this.isTouching) {
			this.stop();
		}

		if (this.overscrollEnabled) { // not check this.props.overscrollEffectOn.drag for safety
			this.clearAllOverscrollEffects();
		}
		this.isTouching = false;
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
		} else if (this.overscrollEnabled && this.props.overscrollEffectOn.drag) {
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
			ev.preventDefault();
			ev.stopPropagation();
		} else {
			const
				{overscrollEffectOn} = this.props,
				overscrollEffectRequired = this.overscrollEnabled && overscrollEffectOn.wheel,
				bounds = this.getScrollBounds(),
				canScrollHorizontally = this.canScrollHorizontally(bounds),
				canScrollVertically = this.canScrollVertically(bounds),
				eventDeltaMode = ev.deltaMode,
				eventDelta = (-ev.wheelDeltaY || ev.deltaY);
			let
				delta = 0,
				needToHideThumb = false;

			this.lastInputType = 'wheel';

			if (this.props.noScrollByWheel) {
				if (canScrollVertically) {
					ev.preventDefault();
				}

				return;
			}

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
					if ((horizontalScrollbarRef.current && horizontalScrollbarRef.current.getContainerRef().current.contains(ev.target)) ||
						(verticalScrollbarRef.current && verticalScrollbarRef.current.getContainerRef().current.contains(ev.target))) {
						delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientHeight * scrollWheelPageMultiplierForMaxPixel);
						needToHideThumb = !delta;

						ev.preventDefault();
					} else if (overscrollEffectRequired) {
						this.checkAndApplyOverscrollEffect('vertical', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce);
					}

					ev.stopPropagation();
				} else {
					if (overscrollEffectRequired && (eventDelta < 0 && this.scrollTop <= 0 || eventDelta > 0 && this.scrollTop >= bounds.maxTop)) {
						this.applyOverscrollEffect('vertical', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce, 1);
					}
					needToHideThumb = true;
				}
			} else if (canScrollHorizontally) { // this routine handles wheel events on any children for horizontal scroll.
				if (eventDelta < 0 && this.scrollLeft > 0 || eventDelta > 0 && this.scrollLeft < bounds.maxLeft) {
					delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientWidth * scrollWheelPageMultiplierForMaxPixel);
					needToHideThumb = !delta;

					ev.preventDefault();
					ev.stopPropagation();
				} else {
					if (overscrollEffectRequired && (eventDelta < 0 && this.scrollLeft <= 0 || eventDelta > 0 && this.scrollLeft >= bounds.maxLeft)) {
						this.applyOverscrollEffect('horizontal', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce, 1);
					}
					needToHideThumb = true;
				}
			}

			if (delta !== 0) {
				const direction = Math.sign(delta);
				// Not to accumulate scroll position if wheel direction is different from hold direction
				if (direction !== this.wheelDirection) {
					this.isScrollAnimationTargetAccumulated = false;
					this.wheelDirection = direction;
				}
				this.scrollToAccumulatedTarget(delta, canScrollVertically, overscrollEffectOn.wheel);
			}

			if (needToHideThumb) {
				this.startHidingThumb();
			}
		}
	}

	onScroll = (ev) => {
		let {scrollLeft, scrollTop} = ev.target;

		const
			bounds = this.getScrollBounds(),
			canScrollHorizontally = this.canScrollHorizontally(bounds);

		if (!this.scrolling) {
			this.scrollStartOnScroll();
		}

		if (this.props.rtl && canScrollHorizontally) {
			scrollLeft = (platform.ios || platform.safari) ? -scrollLeft : bounds.maxLeft - scrollLeft;
		}

		if (scrollLeft !== this.scrollLeft) {
			this.setScrollLeft(scrollLeft);
		}
		if (scrollTop !== this.scrollTop) {
			this.setScrollTop(scrollTop);
		}

		if (this.childRefCurrent.didScroll) {
			this.childRefCurrent.didScroll(this.scrollLeft, this.scrollTop);
		}
		this.forwardScrollEvent('onScroll');
		this.scrollStopJob.start();
	}

	scrollToAccumulatedTarget = (delta, vertical, overscrollEffect) => {
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

		this.start({targetX: this.accumulatedTargetX, targetY: this.accumulatedTargetY, overscrollEffect});
	}

	// overscroll effect

	getEdgeFromPosition = (position, maxPosition) => {
		if (position <= 0) {
			return 'before';
		/* If a scroll size or a client size is not integer,
			 browsers's max scroll position could be smaller than maxPos by 1 pixel.*/
		} else if (position >= maxPosition - 1) {
			return 'after';
		} else {
			return null;
		}
	}

	setOverscrollStatus = (orientation, edge, type, ratio) => {
		const status = this.overscrollStatus[orientation][edge];
		status.type = type;
		status.ratio = ratio;
	}

	getOverscrollStatus = (orientation, edge) => (this.overscrollStatus[orientation][edge])

	calculateOverscrollRatio = (orientation, position) => {
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
		} else {
			return 0;
		}

		return Math.min(1, 2 * overDistance / baseSize);
	}

	applyOverscrollEffect = (orientation, edge, type, ratio) => {
		this.props.applyOverscrollEffect(orientation, edge, type, ratio);
		this.setOverscrollStatus(orientation, edge, type === overscrollTypeOnce ? overscrollTypeDone : type, ratio);
	}

	checkAndApplyOverscrollEffect = (orientation, edge, type, ratio = 1) => {
		const
			isVertical = (orientation === 'vertical'),
			curPos = isVertical ? this.scrollTop : this.scrollLeft,
			maxPos = this.getScrollBounds()[isVertical ? 'maxTop' : 'maxLeft'];

		/* If a scroll size or a client size is not integer,
			 browsers's max scroll position could be smaller than maxPos by 1 pixel.*/
		if ((edge === 'before' && curPos <= 0) || (edge === 'after' && curPos >= maxPos - 1)) { // Already on the edge
			this.applyOverscrollEffect(orientation, edge, type, ratio);
		} else {
			this.setOverscrollStatus(orientation, edge, type, ratio);
		}
	}

	clearOverscrollEffect = (orientation, edge) => {
		if (this.getOverscrollStatus(orientation, edge).type !== overscrollTypeNone) {
			if (this.props.clearOverscrollEffect) {
				this.props.clearOverscrollEffect(orientation, edge);
			} else {
				this.applyOverscrollEffect(orientation, edge, overscrollTypeNone, 0);
			}
		}
	}

	clearAllOverscrollEffects = () => {
		['horizontal', 'vertical'].forEach((orientation) => {
			['before', 'after'].forEach((edge) => {
				this.clearOverscrollEffect(orientation, edge);
			});
		});
	}

	applyOverscrollEffectOnDrag = (orientation, edge, targetPosition, type) => {
		if (edge) {
			const
				oppositeEdge = edge === 'before' ? 'after' : 'before',
				ratio = this.calculateOverscrollRatio(orientation, targetPosition);

			this.applyOverscrollEffect(orientation, edge, type, ratio);
			this.clearOverscrollEffect(orientation, oppositeEdge);
		} else {
			this.clearOverscrollEffect(orientation, 'before');
			this.clearOverscrollEffect(orientation, 'after');
		}
	}

	checkAndApplyOverscrollEffectOnDrag = (targetX, targetY, type) => {
		const bounds = this.getScrollBounds();

		if (this.canScrollHorizontally(bounds)) {
			this.applyOverscrollEffectOnDrag('horizontal', this.getEdgeFromPosition(targetX, bounds.maxLeft), targetX, type);
		}

		if (this.canScrollVertically(bounds)) {
			this.applyOverscrollEffectOnDrag('vertical', this.getEdgeFromPosition(targetY, bounds.maxTop), targetY, type);
		}
	}

	checkAndApplyOverscrollEffectOnScroll = (orientation) => {
		['before', 'after'].forEach((edge) => {
			const {ratio, type} = this.getOverscrollStatus(orientation, edge);

			if (type === overscrollTypeOnce) {
				this.checkAndApplyOverscrollEffect(orientation, edge, type, ratio);
			}
		});
	}

	checkAndApplyOverscrollEffectOnStart = (orientation, edge, targetPosition) => {
		if (this.isDragging) {
			this.applyOverscrollEffectOnDrag(orientation, edge, targetPosition, overscrollTypeHold);
		} else if (edge) {
			this.checkAndApplyOverscrollEffect(orientation, edge, overscrollTypeOnce);
		}
	}

	// call scroll callbacks

	forwardScrollEvent (type, reachedEdgeInfo) {
		forward(type, {scrollLeft: this.scrollLeft, scrollTop: this.scrollTop, moreInfo: this.getMoreInfo(), reachedEdgeInfo}, this.props);
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
		if (this.overscrollEnabled && !this.isDragging) { // not check this.props.overscrollEffectOn for safty
			this.clearAllOverscrollEffects();
		}
		this.lastInputType = null;
		this.isScrollAnimationTargetAccumulated = false;
		this.scrolling = false;
		this.forwardScrollEvent('onScrollStop', this.getReachedEdgeInfo());
		this.startHidingThumb();
	}

	scrollStopJob = new Job(this.scrollStopOnScroll, scrollStopWaiting);

	// update scroll position

	setScrollLeft (value) {
		const bounds = this.getScrollBounds();

		this.scrollLeft = clamp(0, bounds.maxLeft, value);

		if (this.overscrollEnabled && this.props.overscrollEffectOn[this.lastInputType]) {
			this.checkAndApplyOverscrollEffectOnScroll('horizontal');
		}

		if (this.state.isHorizontalScrollbarVisible) {
			this.updateThumb(this.horizontalScrollbarRef, bounds);
		}
	}

	setScrollTop (value) {
		const bounds = this.getScrollBounds();

		this.scrollTop = clamp(0, bounds.maxTop, value);

		if (this.overscrollEnabled && this.props.overscrollEffectOn[this.lastInputType]) {
			this.checkAndApplyOverscrollEffectOnScroll('vertical');
		}

		if (this.state.isVerticalScrollbarVisible) {
			this.updateThumb(this.verticalScrollbarRef, bounds);
		}
	}

	getReachedEdgeInfo = () => {
		const
			bounds = this.getScrollBounds(),
			reachedEdgeInfo = {bottom: false, left: false, right: false, top: false};

		if (this.canScrollHorizontally(bounds)) {
			const
				rtl = this.props.rtl,
				edge = this.getEdgeFromPosition(this.scrollLeft, bounds.maxLeft);

			if (edge) { // if edge is null, no need to check which edge is reached.
				if ((edge === 'before' && !rtl) || (edge === 'after' && rtl)) {
					reachedEdgeInfo.left = true;
				} else {
					reachedEdgeInfo.right = true;
				}
			}
		}

		if (this.canScrollVertically(bounds)) {
			const edge = this.getEdgeFromPosition(this.scrollTop, bounds.maxTop);

			if (edge === 'before') {
				reachedEdgeInfo.top = true;
			} else if (edge === 'after') {
				reachedEdgeInfo.bottom = true;
			}
		}

		return reachedEdgeInfo;
	}

	// scroll start

	start ({targetX, targetY, animate = true, overscrollEffect = false}) {
		const
			{scrollLeft, scrollTop} = this,
			childRefCurrent = this.childRefCurrent,
			childContainerRef = childRefCurrent.containerRef,
			bounds = this.getScrollBounds(),
			{maxLeft, maxTop} = bounds;

		const updatedAnimationInfo = {
			targetX,
			targetY
		};

		// bail early when scrolling to the same position
		if (this.scrolling && this.animationInfo && this.animationInfo.targetX === targetX && this.animationInfo.targetY === targetY) {
			return;
		}

		this.animationInfo = updatedAnimationInfo;

		if (Math.abs(maxLeft - targetX) < epsilon) {
			targetX = maxLeft;
		}
		if (Math.abs(maxTop - targetY) < epsilon) {
			targetY = maxTop;
		}

		if (this.overscrollEnabled && overscrollEffect) {
			if (scrollLeft !== targetX && this.canScrollHorizontally(bounds)) {
				this.checkAndApplyOverscrollEffectOnStart('horizontal', this.getEdgeFromPosition(targetX, maxLeft), targetX);
			}
			if (scrollTop !== targetY && this.canScrollVertically(bounds)) {
				this.checkAndApplyOverscrollEffectOnStart('vertical', this.getEdgeFromPosition(targetY, maxTop), targetY);
			}
		}

		if (animate) {
			childRefCurrent.scrollToPosition(targetX, targetY);
		} else {
			childContainerRef.current.style.scrollBehavior = null;
			childRefCurrent.scrollToPosition(targetX, targetY);
			childContainerRef.current.style.scrollBehavior = 'smooth';
		}
		this.scrollStopJob.start();

		if (this.props.start) {
			this.props.start(animate);
		}
	}

	stop () {
		const
			childRefCurrent = this.childRefCurrent,
			childContainerRef = childRefCurrent.containerRef;

		childContainerRef.current.style.scrollBehavior = null;
		childRefCurrent.scrollToPosition(this.scrollLeft + 0.1, this.scrollTop + 0.1);
		childContainerRef.current.style.scrollBehavior = 'smooth';
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
				if (typeof opt.index === 'number' && typeof this.childRefCurrent.getItemPosition === 'function') {
					itemPos = this.childRefCurrent.getItemPosition(opt.index, opt.stickTo);
				} else if (opt.node instanceof Object) {
					if (opt.node.nodeType === 1 && typeof this.childRefCurrent.getNodePosition === 'function') {
						itemPos = this.childRefCurrent.getNodePosition(opt.node);
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
		const {direction} = this.props;
		return (direction === 'horizontal' || direction === 'both') && (bounds.scrollWidth > bounds.clientWidth) && !isNaN(bounds.scrollWidth);
	}

	canScrollVertically = (bounds) => {
		const {direction} = this.props;
		return (direction === 'vertical' || direction === 'both') && (bounds.scrollHeight > bounds.clientHeight) && !isNaN(bounds.scrollHeight);
	}

	// scroll bar

	showThumb (bounds) {
		if (this.state.isHorizontalScrollbarVisible && this.canScrollHorizontally(bounds) && this.horizontalScrollbarRef.current) {
			this.horizontalScrollbarRef.current.showThumb();
		}
		if (this.state.isVerticalScrollbarVisible && this.canScrollVertically(bounds) && this.verticalScrollbarRef.current) {
			this.verticalScrollbarRef.current.showThumb();
		}
	}

	updateThumb (scrollbarRef, bounds) {
		scrollbarRef.current.update({
			...bounds,
			scrollLeft: this.scrollLeft,
			scrollTop: this.scrollTop
		});
	}

	startHidingThumb = () => {
		if (this.state.isHorizontalScrollbarVisible && this.horizontalScrollbarRef.current) {
			this.horizontalScrollbarRef.current.startHidingThumb();
		}
		if (this.state.isVerticalScrollbarVisible && this.verticalScrollbarRef.current) {
			this.verticalScrollbarRef.current.startHidingThumb();
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

			if (curHorizontalScrollbarVisible && this.horizontalScrollbarRef.current) {
				this.horizontalScrollbarRef.current.update(updatedBounds);
			}
			if (curVerticalScrollbarVisible && this.verticalScrollbarRef.current) {
				this.verticalScrollbarRef.current.update(updatedBounds);
			}
			return true;
		}
		return false;
	}

	// ref

	getScrollBounds () {
		if (typeof this.childRefCurrent.getScrollBounds === 'function') {
			return this.childRefCurrent.getScrollBounds();
		}
	}

	getMoreInfo () {
		if (typeof this.childRefCurrent.getMoreInfo === 'function') {
			return this.childRefCurrent.getMoreInfo();
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	addEventListeners () {
		const {childRefCurrent, containerRef} = this;

		if (containerRef.current && containerRef.current.addEventListener) {
			containerRef.current.addEventListener('wheel', this.onWheel);
		}

		if (childRefCurrent.containerRef.current) {
			if (childRefCurrent.containerRef.current.addEventListener) {
				childRefCurrent.containerRef.current.addEventListener('scroll', this.onScroll, {capture: true, passive: true});
				childRefCurrent.containerRef.current.addEventListener('mousedown', this.onMouseDown);
			}
			this.childRefCurrent.containerRef.current.style.scrollBehavior = 'smooth';
		}

		if (this.props.addEventListeners) {
			this.props.addEventListeners(childRefCurrent.containerRef);
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	removeEventListeners () {
		const {childRefCurrent, containerRef} = this;

		if (containerRef.current && containerRef.current.removeEventListener) {
			containerRef.current.removeEventListener('wheel', this.onWheel);
		}

		if (childRefCurrent.containerRef.current && childRefCurrent.containerRef.current.removeEventListener) {
			childRefCurrent.containerRef.current.removeEventListener('scroll', this.onScroll, {capture: true, passive: true});
			childRefCurrent.containerRef.current.removeEventListener('mousedown', this.onMouseDown);
		}

		if (this.props.removeEventListeners) {
			this.props.removeEventListeners(childRefCurrent.containerRef);
		}
	}

	// render

	initChildRef = (ref) => {
		if (ref) {
			this.childRefCurrent = ref.current || ref;
		}
	}

	render () {
		const
			{className, containerRenderer, noScrollByDrag, rtl, style, ...rest} = this.props,
			{isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state,
			scrollableClasses = classNames(css.scrollable, className),
			contentClasses = classNames(css.content, css.contentNative),
			childWrapper = noScrollByDrag ? 'div' : TouchableDiv,
			childWrapperProps = {
				className: contentClasses,
				...(!noScrollByDrag && {
					onDrag: this.onDrag,
					onDragEnd: this.onDragEnd,
					onDragStart: this.onDragStart,
					onFlick: this.onFlick,
					onTouchStart: this.onTouchStart
				})
			};

		delete rest.addEventListeners;
		delete rest.applyOverscrollEffect;
		delete rest.cbScrollTo;
		delete rest.clearOverscrollEffect;
		delete rest.horizontalScrollbar;
		delete rest.noScrollByWheel;
		delete rest.onFlick;
		delete rest.onMouseDown;
		delete rest.onScroll;
		delete rest.onScrollStart;
		delete rest.onScrollStop;
		delete rest.onWheel;
		delete rest.overscrollEffectOn;
		delete rest.removeEventListeners;
		delete rest.scrollStopOnScroll;
		delete rest.scrollTo;
		delete rest.start;
		delete rest.verticalScrollbar;

		this.deferScrollTo = true;

		return (
			<ResizeContext.Provider value={this.resizeRegistry.register}>
				{containerRenderer({
					childComponentProps: rest,
					childWrapper,
					childWrapperProps,
					className: scrollableClasses,
					componentCss: css,
					containerRef: this.containerRef,
					horizontalScrollbarProps: this.horizontalScrollbarProps,
					initChildRef: this.initChildRef,
					isHorizontalScrollbarVisible,
					isVerticalScrollbarVisible,
					rtl,
					scrollTo: this.scrollTo,
					style,
					verticalScrollbarProps: this.verticalScrollbarProps
				})}
			</ResizeContext.Provider>
		);
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
					childWrapper: ChildWrapper,
					childWrapperProps,
					className,
					componentCss,
					containerRef,
					horizontalScrollbarProps,
					initChildRef,
					isHorizontalScrollbarVisible,
					isVerticalScrollbarVisible,
					rtl,
					scrollTo,
					style,
					verticalScrollbarProps
				}) => (
					<div
						className={className}
						ref={containerRef}
						style={style}
					>
						<div className={componentCss.container}>
							<ChildWrapper {...childWrapperProps}>
								{childRenderer({
									...childComponentProps,
									cbScrollTo: scrollTo,
									className: componentCss.scrollableFill,
									initChildRef,
									rtl
								})}
							</ChildWrapper>
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
