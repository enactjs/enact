/**
 * Unstyled scrollable components and behaviors to be customized by a theme or application.
 *
 * @module ui/Scrollable
 * @exports constants
 * @exports Scrollable
 * @exports ScrollableBase
 * @private
 */

import clamp from 'ramda/src/clamp';
import classNames from 'classnames';
import {forward} from '@enact/core/handle';
import {is} from '@enact/core/keymap';
import Registry from '@enact/core/internal/Registry';
import {Job} from '@enact/core/util';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {ResizeContext} from '../Resizable';
import ri from '../resolution';
import Touchable from '../Touchable';

import ScrollAnimator from './ScrollAnimator';
import Scrollbar from './Scrollbar';

import css from './Scrollable.module.less';

const
	constants = {
		animationDuration: 1000,
		epsilon: 1,
		isPageDown: is('pageDown'),
		isPageUp: is('pageUp'),
		nop: () => {},
		overscrollTypeNone: 0,
		overscrollTypeHold: 1,
		overscrollTypeOnce: 2,
		overscrollTypeDone: 9,
		paginationPageMultiplier: 0.8,
		scrollStopWaiting: 200,
		scrollWheelPageMultiplierForMaxPixel: 0.2 // The ratio of the maximum distance scrolled by wheel to the size of the viewport.
	},
	{
		animationDuration,
		epsilon,
		isPageDown,
		isPageUp,
		nop,
		overscrollTypeDone,
		overscrollTypeHold,
		overscrollTypeNone,
		overscrollTypeOnce,
		paginationPageMultiplier,
		scrollStopWaiting,
		scrollWheelPageMultiplierForMaxPixel
	} = constants;

const TouchableDiv = React.forwardRef((props, ref) => {
	const Wrapper = Touchable('div');
	return <Wrapper {...props} ref={ref} />;
});

/**
 * An unstyled component that passes scrollable behavior information as its render prop's arguments.
 *
 * @class ScrollableBase
 * @memberof ui/Scrollable
 * @ui
 * @private
 */
class ScrollableBase extends Component {
	static displayName = 'ui:ScrollableBase'

	static propTypes = /** @lends ui/Scrollable.Scrollable.prototype */ {
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
		 * Prevents animated scrolling.
		 *
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		noAnimation: PropTypes.bool,

		/**
		 * Prevents scroll by dragging or flicking on the list or the scroller.
		 *
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		noScrollByDrag: PropTypes.bool,

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
		 * Called to execute additional logic in a themed component when scrollTo is called.
		 *
		 * @type {Function}
		 * @private
		 */
		scrollTo: PropTypes.func,

		/**
		 * Called to execute additional logic in a themed component when scroll stops.
		 *
		 * @type {Function}
		 * @private
		 */
		stop: PropTypes.func,

		/**
		 * Scrollable CSS style.
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
		noAnimation: false,
		noScrollByDrag: false,
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
			vertical: false
		};

		this.verticalScrollbarProps = {
			ref: this.verticalScrollbarRef,
			vertical: true
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
			{hasDataSizeChanged} = this.childRef.current;

		// Need to sync calculated client size if it is different from the real size
		if (this.childRef.current.syncClientSize) {
			// If we actually synced, we need to reset scroll position.
			if (this.childRef.current.syncClientSize()) {
				this.setScrollLeft(0);
				this.setScrollTop(0);
			}
		}

		this.deferScrollTo = true;

		this.clampScrollPosition();

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

		if (this.animator.isAnimating()) {
			this.animator.stop();
		}

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
		this.childRef.current.calculateMetrics();
		this.forceUpdate();
	}

	clampScrollPosition () {
		const bounds = this.getScrollBounds();

		if (this.scrollTop > bounds.maxTop) {
			this.scrollTop = bounds.maxTop;
		}

		if (this.scrollLeft > bounds.maxLeft) {
			this.scrollLeft = bounds.maxLeft;
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

	// scroll info
	scrolling = false
	scrollLeft = 0
	scrollTop = 0
	scrollToInfo = null

	// component info
	childRef = null

	// scroll animator
	animator = new ScrollAnimator()

	// drag/flick event handlers

	getRtlX = (x) => (this.props.rtl ? -x : x)

	onMouseDown = (ev) => {
		this.stop();
		forward('onMouseDown', ev, this.props);
	}

	onDragStart = (ev) => {
		if (ev.type === 'dragstart') return;

		this.stop();
		this.isDragging = true;
		this.dragStartX = this.scrollLeft + this.getRtlX(ev.x);
		this.dragStartY = this.scrollTop + ev.y;
	}

	onDrag = (ev) => {
		if (ev.type === 'drag') return;

		const {direction} = this.props;

		this.lastInputType = 'drag';

		this.start({
			targetX: (direction === 'vertical') ? 0 : this.dragStartX - this.getRtlX(ev.x), // 'horizontal' or 'both'
			targetY: (direction === 'horizontal') ? 0 : this.dragStartY - ev.y, // 'vertical' or 'both'
			animate: false,
			overscrollEffect: this.props.overscrollEffectOn.drag
		});
	}

	onDragEnd = (ev) => {
		if (ev.type === 'dragend') return;

		this.isDragging = false;

		if (this.flickTarget) {
			const {targetX, targetY, duration} = this.flickTarget;

			this.lastInputType = 'drag';

			this.isScrollAnimationTargetAccumulated = false;
			this.start({targetX, targetY, duration, overscrollEffect: this.props.overscrollEffectOn.drag});
		} else {
			this.stop();
		}

		if (this.overscrollEnabled) { // not check this.props.overscrollEffectOn.drag for safety
			this.clearAllOverscrollEffects();
		}

		this.flickTarget = null;
	}

	onFlick = (ev) => {
		const {direction} = this.props;

		this.flickTarget = this.animator.simulate(
			this.scrollLeft,
			this.scrollTop,
			(direction !== 'vertical') ? this.getRtlX(-ev.velocityX) : 0,
			(direction !== 'horizontal') ? -ev.velocityY : 0
		);

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

	onWheel = (ev) => {
		ev.preventDefault();

		if (!this.isDragging) {
			const
				{verticalScrollbarRef, horizontalScrollbarRef} = this,
				bounds = this.getScrollBounds(),
				canScrollHorizontally = this.canScrollHorizontally(bounds),
				canScrollVertically = this.canScrollVertically(bounds),
				eventDeltaMode = ev.deltaMode,
				eventDelta = (-ev.wheelDeltaY || ev.deltaY);
			let
				delta = 0,
				direction;

			this.lastInputType = 'wheel';

			if (canScrollVertically) {
				delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientHeight * scrollWheelPageMultiplierForMaxPixel);
			} else if (canScrollHorizontally) {
				delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientWidth * scrollWheelPageMultiplierForMaxPixel);
			}

			direction = Math.sign(delta);

			if (direction !== this.wheelDirection) {
				this.isScrollAnimationTargetAccumulated = false;
				this.wheelDirection = direction;
			}

			forward('onWheel', {delta, horizontalScrollbarRef, verticalScrollbarRef}, this.props);

			if (delta !== 0) {
				this.scrollToAccumulatedTarget(delta, canScrollVertically, this.props.overscrollEffectOn.wheel);
			}
		}
	}

	scrollByPage = (keyCode) => {
		// Only scroll by page when the vertical scrollbar is visible. Otherwise, treat the
		// scroller as a plain container
		if (!this.state.isVerticalScrollbarVisible) return;

		const
			bounds = this.getScrollBounds(),
			canScrollVertically = this.canScrollVertically(bounds),
			pageDistance = (isPageUp(keyCode) ? -1 : 1) * (canScrollVertically ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier;

		this.lastInputType = 'pageKey';

		this.scrollToAccumulatedTarget(pageDistance, canScrollVertically, this.props.overscrollEffectOn.pageKey, !this.props.noAnimation);
	}

	onKeyDown = (ev) => {
		if (this.props.onKeyDown) {
			forward('onKeyDown', ev, this.props);
		} else if ((isPageUp(ev.keyCode) || isPageDown(ev.keyCode))) {
			this.scrollByPage(ev.keyCode);
		}
	}

	scrollToAccumulatedTarget = (delta, vertical, overscrollEffect, animate) => {
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

		this.start({targetX: this.accumulatedTargetX, targetY: this.accumulatedTargetY, overscrollEffect, animate});
	}

	// overscroll effect

	getEdgeFromPosition = (position, maxPosition) => {
		if (position <= 0) {
			return 'before';
		} else if (position >= maxPosition) {
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

		if ((edge === 'before' && curPos <= 0) || (edge === 'after' && curPos >= maxPos)) { // Already on the edge
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

	// scroll start/stop

	doScrollStop = () => {
		this.scrolling = false;
		this.forwardScrollEvent('onScrollStop', this.getReachedEdgeInfo());
	}

	scrollStopJob = new Job(this.doScrollStop, scrollStopWaiting);

	start ({targetX, targetY, animate = true, duration = animationDuration, overscrollEffect = false}) {
		const
			{scrollLeft, scrollTop} = this,
			bounds = this.getScrollBounds(),
			{maxLeft, maxTop} = bounds;

		const updatedAnimationInfo = {
			sourceX: scrollLeft,
			sourceY: scrollTop,
			targetX,
			targetY,
			duration
		};

		// bail early when scrolling to the same position
		if (this.animator.isAnimating() && this.animationInfo && this.animationInfo.targetX === targetX && this.animationInfo.targetY === targetY) {
			return;
		}

		this.animationInfo = updatedAnimationInfo;

		this.animator.stop();
		if (!this.scrolling) {
			this.scrolling = true;
			this.forwardScrollEvent('onScrollStart');
		}
		this.scrollStopJob.stop();

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

		this.showThumb(bounds);

		if (animate) {
			this.animator.animate(this.scrollAnimation(this.animationInfo));
		} else {
			this.scroll(targetX, targetY);
			this.stop();
		}
	}

	scrollAnimation = (animationInfo) => (curTime) => {
		const
			{sourceX, sourceY, targetX, targetY, duration} = animationInfo,
			bounds = this.getScrollBounds();

		if (curTime < duration) {
			let
				toBeContinued = false,
				curTargetX = sourceX,
				curTargetY = sourceY;

			if (this.canScrollHorizontally(bounds)) {
				curTargetX = this.animator.timingFunction(sourceX, targetX, duration, curTime);
				if (Math.abs(curTargetX - targetX) < epsilon) {
					curTargetX = targetX;
				} else {
					toBeContinued = true;
				}
			}

			if (this.canScrollVertically(bounds)) {
				curTargetY = this.animator.timingFunction(sourceY, targetY, duration, curTime);
				if (Math.abs(curTargetY - targetY) < epsilon) {
					curTargetY = targetY;
				} else {
					toBeContinued = true;
				}
			}

			this.scroll(curTargetX, curTargetY);
			if (!toBeContinued) {
				this.stop();
			}
		} else {
			this.scroll(targetX, targetY);
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

		this.childRef.current.setScrollPosition(this.scrollLeft, this.scrollTop, dirX, dirY);
		this.forwardScrollEvent('onScroll');
	}

	stop () {
		this.animator.stop();
		this.lastInputType = null;
		this.isScrollAnimationTargetAccumulated = false;
		this.startHidingThumb();
		if (this.overscrollEnabled && !this.isDragging) { // not check this.props.overscrollEffectOn for safty
			this.clearAllOverscrollEffects();
		}
		if (this.props.stop) {
			this.props.stop();
		}
		if (this.scrolling) {
			this.scrollStopJob.start();
		}
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
				if (typeof opt.index === 'number' && typeof this.childRef.current.getItemPosition === 'function') {
					itemPos = this.childRef.current.getItemPosition(opt.index, opt.stickTo);
				} else if (opt.node instanceof Object) {
					if (opt.node.nodeType === 1 && typeof this.childRef.current.getNodePosition === 'function') {
						itemPos = this.childRef.current.getNodePosition(opt.node);
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

			if (curHorizontalScrollbarVisible && this.horizontalScrollbarRef) {
				this.horizontalScrollbarRef.current.update(updatedBounds);
			}
			if (curVerticalScrollbarVisible && this.verticalScrollbarRef) {
				this.verticalScrollbarRef.current.update(updatedBounds);
			}
			return true;
		}
		return false;
	}

	// ref

	getScrollBounds () {
		if (this.childRef && this.childRef.current && typeof this.childRef.current.getScrollBounds === 'function') {
			return this.childRef.current.getScrollBounds();
		}
	}

	getMoreInfo () {
		if (this.childRef && this.childRef.current && typeof this.childRef.current.getMoreInfo === 'function') {
			return this.childRef.current.getMoreInfo();
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	addEventListeners () {
		const {childRef, containerRef} = this;

		if (containerRef.current && containerRef.current.addEventListener) {
			containerRef.current.addEventListener('wheel', this.onWheel);
			containerRef.current.addEventListener('keydown', this.onKeyDown);
		}

		if (childRef.current && childRef.current.containerRef.current) {
			if (childRef.current.containerRef.current.addEventListener) {
				childRef.current.containerRef.current.addEventListener('mousedown', this.onMouseDown);
			}
		}

		if (this.props.addEventListeners) {
			this.props.addEventListeners(childRef.current.containerRef);
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	removeEventListeners () {
		const {childRef, containerRef} = this;

		if (containerRef.current && containerRef.current.removeEventListener) {
			containerRef.current.removeEventListener('wheel', this.onWheel);
			containerRef.current.removeEventListener('keydown', this.onKeyDown);
		}

		if (childRef.current && childRef.current.containerRef.current && childRef.current.containerRef.current.removeEventListener) {
			childRef.current.containerRef.current.removeEventListener('mousedown', this.onMouseDown);
		}

		if (this.props.removeEventListeners) {
			this.props.removeEventListeners(childRef.current.containerRef.current);
		}
	}

	// render

	initChildRef = (ref) => {
		if (ref) {
			this.childRef = {current: ref};
		}
	}

	handleScroll = () => {
		const childRef = this.childRef;

		// Prevent scroll by focus.
		// VirtualList and VirtualGridList DO NOT receive `onscroll` event.
		// Only Scroller could get `onscroll` event.
		if (!this.animator.isAnimating() && childRef.current && childRef.current.containerRef.current && childRef.current.getRtlPositionX) {
			// For Scroller
			childRef.current.containerRef.current.scrollTop = this.scrollTop;
			childRef.current.containerRef.current.scrollLeft = childRef.current.getRtlPositionX(this.scrollLeft);
		}
	}

	render () {
		const
			{className, containerRenderer, noScrollByDrag, rtl, style, ...rest} = this.props,
			{isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state,
			scrollableClasses = classNames(css.scrollable, className),
			childWrapper = noScrollByDrag ? 'div' : TouchableDiv,
			childWrapperProps = {
				className: css.content,
				...(!noScrollByDrag && {
					className: css.content,
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
		delete rest.noAnimation;
		delete rest.onFlick;
		delete rest.onKeyDown;
		delete rest.onMouseDown;
		delete rest.onScroll;
		delete rest.onScrollStart;
		delete rest.onScrollStop;
		delete rest.onWheel;
		delete rest.overscrollEffectOn;
		delete rest.removeEventListeners;
		delete rest.scrollTo;
		delete rest.stop;
		delete rest.verticalScrollbar;

		return (
			<ResizeContext.Provider value={this.resizeRegistry.register}>
				{containerRenderer({
					childComponentProps: rest,
					childWrapper,
					childWrapperProps,
					className: scrollableClasses,
					componentCss: css,
					containerRef: this.containerRef,
					handleScroll: this.handleScroll,
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
 * An unstyled component that provides horizontal and vertical scrollbars and makes a render prop element scrollable.
 *
 * @class Scrollable
 * @memberof ui/Scrollable
 * @extends ui/Scrollable.ScrollableBase
 * @ui
 * @private
 */
class Scrollable extends Component {
	static displayName = 'ui:Scrollable'

	static propTypes = /** @lends ui/Scrollable.Scrollable.prototype */ {
		/**
		 * Render function.
		 *
		 * @type {Function}
		 * @required
		 * @private
		 */
		childRenderer: PropTypes.func.isRequired
	}

	render () {
		const {childRenderer, ...rest} = this.props;

		return (
			<ScrollableBase
				{...rest}
				containerRenderer={({ // eslint-disable-line react/jsx-no-bind
					childComponentProps,
					childWrapper: ChildWrapper,
					childWrapperProps,
					containerRef,
					className,
					componentCss,
					handleScroll,
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
									onScroll: handleScroll,
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

export default Scrollable;
export {
	constants,
	Scrollable,
	ScrollableBase
};
