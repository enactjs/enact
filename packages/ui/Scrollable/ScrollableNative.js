import classNames from 'classnames';
import handle, {forward, forwardWithPrevent} from '@enact/core/handle';
import {is} from '@enact/core/keymap';
import {platform} from '@enact/core/platform';
import Registry from '@enact/core/internal/Registry';
import {Job} from '@enact/core/util';
import PropTypes from 'prop-types';
import clamp from 'ramda/src/clamp';
import React, {useContext, useState, useReducer, useRef, useEffect} from 'react';

import {ResizeContext} from '../Resizable';
import ri from '../resolution';
import Touchable from '../Touchable';

import ScrollAnimator from './ScrollAnimator';
import Scrollbar from './Scrollbar';

import css from './Scrollable.module.less';

const
	constants = {
		epsilon: 1,
		flickConfig: {maxDuration: null},
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
		flickConfig,
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
 * @function ScrollableBaseNative
 * @memberof ui/ScrollableNative
 * @ui
 * @private
 */
const ScrollableBaseNative = (props) => {
	const [, forceUpdate] = useReducer(x => x + 1, 0);

	const context = useContext(ResizeContext);
	const [remeasure, setRemeasure] = useState(false);
	const [isHorizontalScrollbarVisible, setIsHorizontalScrollbarVisible] = useState(props.horizontalScrollbar === 'visible');
	const [isVerticalScrollbarVisible, setIsVerticalScrollbarVisible] = useState(props.verticalScrollbar === 'visible');

	const containerRef = useRef();
	const horizontalScrollbarRef = useRef();
	const verticalScrollbarRef = useRef();

	// Instance variables
	const variables = useRef({
		horizontalScrollbarProps: {
			ref: horizontalScrollbarRef,
			vertical: false,
			clientSize: props.clientSize
		},
		verticalScrollbarProps: {
			ref: verticalScrollbarRef,
			vertical: true,
			clientSize: props.clientSize
		},

		overscrollEnabled: !!(props.applyOverscrollEffect),

		// Enable the early bail out of repeated scrolling to the same position
		animationInfo: null,

		resizeRegistry: null,


		// constants
		pixelPerLine: 39,
		scrollWheelMultiplierForDeltaPixel: 1.5, // The ratio of wheel 'delta' units to pixels scrolled.

		// status
		deferScrollTo: true,
		isScrollAnimationTargetAccumulated: false,
		isUpdatedScrollThumb: false,

		// overscroll
		lastInputType: null,
		overscrollStatus: {
			horizontal: {
				before: {type: overscrollTypeNone, ratio: 0},
				after: {type: overscrollTypeNone, ratio: 0}
			},
			vertical: {
				before: {type: overscrollTypeNone, ratio: 0},
				after: {type: overscrollTypeNone, ratio: 0}
			}
		},

		// bounds info
		bounds: {
			clientWidth: 0,
			clientHeight: 0,
			scrollWidth: 0,
			scrollHeight: 0,
			maxTop: 0,
			maxLeft: 0
		},

		// wheel/drag/flick info
		wheelDirection: 0,
		isDragging: false,
		isTouching: false,

		// scroll info
		scrolling: false,
		scrollLeft: 0,
		scrollTop: 0,
		scrollToInfo: null,

		// component info
		childRefCurrent: null,

		// scroll animator
		animator: null,

		// non-declared-variable.
		accumulatedTargetX: null,
		accumulatedTargetY: null,
		flickTarget: null,
		dragStartX: null,
		dragStartY: null,
		scrollStopJob: null
	});

	if (variables.current.resizeRegistry == null) {
		variables.current.resizeRegistry = Registry.create(handleResize);
	}

	if (variables.current.animator == null) {
		variables.current.animator = new ScrollAnimator();
	}

	if (variables.current.scrollStopJob == null) {
		variables.current.scrollStopJob = new Job(scrollStopOnScroll, scrollStopWaiting);
	}

	props.cbScrollTo(scrollTo);

	// variables for render
	const
		{className, containerRenderer, noScrollByDrag, rtl, style, ...rest} = props,
		scrollableClasses = classNames(css.scrollable, className),
		contentClasses = classNames(css.content, css.contentNative),
		childWrapper = noScrollByDrag ? 'div' : TouchableDiv,
		childWrapperProps = {
			className: contentClasses,
			...(!noScrollByDrag && {
				flickConfig,
				onDrag: onDrag,
				onDragEnd: onDragEnd,
				onDragStart: onDragStart,
				onFlick: onFlick,
				onTouchStart: onTouchStart
			})
		};

	delete rest.addEventListeners;
	delete rest.applyOverscrollEffect;
	delete rest.cbScrollTo;
	delete rest.clearOverscrollEffect;
	delete rest.handleResizeWindow;
	delete rest.horizontalScrollbar;
	delete rest.noScrollByWheel;
	delete rest.onFlick;
	delete rest.onKeyDown;
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

	useEffect(() => {
		// componentDidMount
		variables.current.resizeRegistry.parent = context;
		addEventListeners();
		updateScrollbars();

		// componentWillUnmount
		return () => {
			variables.current.resizeRegistry.parent = null;
			// Before call cancelAnimationFrame, you must send scrollStop Event.
			if (variables.current.scrolling) {
				forwardScrollEvent('onScrollStop', getReachedEdgeInfo());
			}
			variables.current.scrollStopJob.stop();

			removeEventListeners();
		};
	}, []);

	useEffect(() => {
		// componentDidUpdate

		// Need to sync calculated client size if it is different from the real size
		if (variables.current.childRefCurrent.syncClientSize) {
			// If we actually synced, we need to reset scroll position.
			if (variables.current.childRefCurrent.syncClientSize()) {
				setScrollLeft(0);
				setScrollTop(0);
			}
		}
		addEventListeners();
	});

	useEffect(() => {
		// componentDidUpdate
		const
			{hasDataSizeChanged} = variables.current.childRefCurrent;
		if (
			hasDataSizeChanged === false &&
			(isHorizontalScrollbarVisible || isVerticalScrollbarVisible)
		) {
			variables.current.deferScrollTo = false;
			variables.current.isUpdatedScrollThumb = updateScrollThumbSize();
		} else {
			updateScrollbars();
		}

		if (variables.current.scrollToInfo !== null) {
			if (!variables.current.deferScrollTo) {
				scrollTo(variables.current.scrollToInfo);
			}
		}

		// publish container resize changes
		variables.current.resizeRegistry.notify({});
	}, [isHorizontalScrollbarVisible, isVerticalScrollbarVisible]);

	function handleResize (ev) {
		if (ev.action === 'invalidateBounds') {
			enqueueForceUpdate();
		}
	}

	function handleResizeWindow () {
		// `handleSize` in `ui/resolution.ResolutionDecorator` should be executed first.
		setTimeout(() => {
			if (handleResizeWindow) {
				handleResizeWindow();
			}
			variables.current.childRefCurrent.containerRef.current.style.scrollBehavior = null;
			variables.current.childRefCurrent.scrollToPosition(0, 0);
			variables.current.childRefCurrent.containerRef.current.style.scrollBehavior = 'smooth';

			enqueueForceUpdate();
		});
	}

	// TODO: consider replacing forceUpdate() by storing bounds in state rather than a non-
	// state member.
	function enqueueForceUpdate () {
		variables.current.childRefCurrent.calculateMetrics(variables.current.childRefCurrent.props);
		forceUpdate();
	}

	// event handler for browser native scroll

	function getRtlX (x) {
		return (props.rtl ? -x : x);
	}

	// TODO : 이거 어떻게 하지? const로 하면 재선언 계속 될텐덴 괜찮나..;;
	const onMouseDown = handle(
		forwardWithPrevent('onMouseDown'),
		stop
	);
	// /*.bindAs(this, 'onMouseDown')*/

	function onTouchStart () {
		variables.current.isTouching = true;
	}

	function onDragStart (ev) {
		if (!variables.current.isTouching) {
			stop();
			variables.current.isDragging = true;
		}

		// these values are used also for touch inputs
		variables.current.dragStartX = variables.current.scrollLeft + getRtlX(ev.x);
		variables.current.dragStartY = variables.current.scrollTop + ev.y;
	}

	function onDrag (ev) {
		const
			{direction, overscrollEffectOn} = props,
			targetX = (direction === 'vertical') ? 0 : variables.current.dragStartX - getRtlX(ev.x), // 'horizontal' or 'both'
			targetY = (direction === 'horizontal') ? 0 : variables.current.dragStartY - ev.y; // 'vertical' or 'both'

		variables.current.lastInputType = 'drag';

		if (!variables.current.isTouching) {
			start({targetX, targetY, animate: false, overscrollEffect: overscrollEffectOn.drag});
		} else if (variables.current.overscrollEnabled && overscrollEffectOn.drag) {
			checkAndApplyOverscrollEffectOnDrag(targetX, targetY, overscrollTypeHold);
		}
	}

	function onDragEnd () {
		variables.current.isDragging = false;

		variables.current.lastInputType = 'drag';

		if (variables.current.flickTarget) {
			const
				{overscrollEffectOn} = props,
				{targetX, targetY} = variables.current.flickTarget;

			if (!variables.current.isTouching) {
				variables.current.isScrollAnimationTargetAccumulated = false;
				start({targetX, targetY, overscrollEffect: overscrollEffectOn.drag});
			} else if (variables.current.overscrollEnabled && overscrollEffectOn.drag) {
				checkAndApplyOverscrollEffectOnDrag(targetX, targetY, overscrollTypeOnce);
			}
		} else if (!variables.current.isTouching) {
			stop();
		}

		if (variables.current.overscrollEnabled) { // not check props.overscrollEffectOn.drag for safety
			clearAllOverscrollEffects();
		}
		variables.current.isTouching = false;
		variables.current.flickTarget = null;
	}

	function onFlick (ev) {
		const {direction} = props;

		if (!variables.current.isTouching) {
			variables.current.flickTarget = variables.current.animator.simulate(
				variables.current.scrollLeft,
				variables.current.scrollTop,
				(direction !== 'vertical') ? getRtlX(-ev.velocityX) : 0,
				(direction !== 'horizontal') ? -ev.velocityY : 0
			);
		} else if (variables.current.overscrollEnabled && props.overscrollEffectOn.drag) {
			variables.current.flickTarget = {
				targetX: variables.current.scrollLeft + getRtlX(-ev.velocityX) * overscrollVelocityFactor, // 'horizontal' or 'both'
				targetY: variables.current.scrollTop + -ev.velocityY * overscrollVelocityFactor // 'vertical' or 'both'
			};
		}

		if (props.onFlick) {
			forward('onFlick', ev, props);
		}
	}

	function calculateDistanceByWheel (deltaMode, delta, maxPixel) {
		if (deltaMode === 0) {
			delta = clamp(-maxPixel, maxPixel, ri.scale(delta * variables.current.scrollWheelMultiplierForDeltaPixel));
		} else if (deltaMode === 1) { // line; firefox
			delta = clamp(-maxPixel, maxPixel, ri.scale(delta * variables.current.pixelPerLine * variables.current.scrollWheelMultiplierForDeltaPixel));
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
	function onWheel (ev) {
		if (variables.current.isDragging) {
			ev.preventDefault();
			ev.stopPropagation();
		} else {
			const
				{overscrollEffectOn} = props,
				overscrollEffectRequired = variables.current.overscrollEnabled && overscrollEffectOn.wheel,
				bounds = getScrollBounds(),
				bCanScrollHorizontally = canScrollHorizontally(bounds),
				bCanScrollVertically = canScrollVertically(bounds),
				eventDeltaMode = ev.deltaMode,
				eventDelta = (-ev.wheelDeltaY || ev.deltaY);
			let
				delta = 0,
				needToHideThumb = false;

			variables.current.lastInputType = 'wheel';

			if (props.noScrollByWheel) {
				if (bCanScrollVertically) {
					ev.preventDefault();
				}

				return;
			}

			if (props.onWheel) {
				forward('onWheel', ev, props);
				return;
			}

			showThumb(bounds);

			// FIXME This routine is a temporary support for horizontal wheel scroll.
			// FIXME If web engine supports horizontal wheel, this routine should be refined or removed.
			if (bCanScrollVertically) { // This routine handles wheel events on scrollbars for vertical scroll.
				if (eventDelta < 0 && variables.current.scrollTop > 0 || eventDelta > 0 && variables.current.scrollTop < bounds.maxTop) {
					// Not to check if ev.target is a descendant of a wrapped component which may have a lot of nodes in it.
					if ((horizontalScrollbarRef.current && horizontalScrollbarRef.current.getContainerRef().current.contains(ev.target)) ||
						(verticalScrollbarRef.current && verticalScrollbarRef.current.getContainerRef().current.contains(ev.target))) {
						delta = calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientHeight * scrollWheelPageMultiplierForMaxPixel);
						needToHideThumb = !delta;

						ev.preventDefault();
					} else if (overscrollEffectRequired) {
						checkAndApplyOverscrollEffect('vertical', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce);
					}

					ev.stopPropagation();
				} else {
					if (overscrollEffectRequired && (eventDelta < 0 && variables.current.scrollTop <= 0 || eventDelta > 0 && variables.current.scrollTop >= bounds.maxTop)) {
						applyOverscrollEffect('vertical', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce, 1);
					}
					needToHideThumb = true;
				}
			} else if (bCanScrollHorizontally) { // this routine handles wheel events on any children for horizontal scroll.
				if (eventDelta < 0 && variables.current.scrollLeft > 0 || eventDelta > 0 && variables.current.scrollLeft < bounds.maxLeft) {
					delta = calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientWidth * scrollWheelPageMultiplierForMaxPixel);
					needToHideThumb = !delta;

					ev.preventDefault();
					ev.stopPropagation();
				} else {
					if (overscrollEffectRequired && (eventDelta < 0 && variables.current.scrollLeft <= 0 || eventDelta > 0 && variables.current.scrollLeft >= bounds.maxLeft)) {
						applyOverscrollEffect('horizontal', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce, 1);
					}
					needToHideThumb = true;
				}
			}

			if (delta !== 0) {
				const direction = Math.sign(delta);
				// Not to accumulate scroll position if wheel direction is different from hold direction
				if (direction !== variables.current.wheelDirection) {
					variables.current.isScrollAnimationTargetAccumulated = false;
					variables.current.wheelDirection = direction;
				}
				scrollToAccumulatedTarget(delta, bCanScrollVertically, overscrollEffectOn.wheel);
			}

			if (needToHideThumb) {
				startHidingThumb();
			}
		}
	}

	function onScroll (ev) {
		let {scrollLeft, scrollTop} = ev.target;

		const
			bounds = getScrollBounds(),
			bCanScrollHorizontally = canScrollHorizontally(bounds);

		if (!variables.current.scrolling) {
			scrollStartOnScroll();
		}

		if (props.rtl && bCanScrollHorizontally) {
			scrollLeft = (platform.ios || platform.safari) ? -scrollLeft : bounds.maxLeft - scrollLeft;
		}

		if (scrollLeft !== variables.current.scrollLeft) {
			setScrollLeft(scrollLeft);
		}
		if (scrollTop !== variables.current.scrollTop) {
			setScrollTop(scrollTop);
		}

		if (variables.current.childRefCurrent.didScroll) {
			variables.current.childRefCurrent.didScroll(variables.current.scrollLeft, variables.current.scrollTop);
		}
		forwardScrollEvent('onScroll');
		variables.current.scrollStopJob.start();
	}

	function onKeyDown (ev) {
		forward('onKeyDown', ev, props);
	}

	function scrollToAccumulatedTarget (delta, vertical, overscrollEffect) {
		if (!variables.current.isScrollAnimationTargetAccumulated) {
			variables.current.accumulatedTargetX = variables.current.scrollLeft;
			variables.current.accumulatedTargetY = variables.current.scrollTop;
			variables.current.isScrollAnimationTargetAccumulated = true;
		}

		if (vertical) {
			variables.current.accumulatedTargetY += delta;
		} else {
			variables.current.accumulatedTargetX += delta;
		}

		start({targetX: variables.current.accumulatedTargetX, targetY: variables.current.accumulatedTargetY, overscrollEffect});
	}

	// overscroll effect

	function getEdgeFromPosition (position, maxPosition) {
		if (position <= 0) {
			return 'before';
		/* If a scroll size or a client size is not integer,
			 browser's max scroll position could be smaller than maxPos by 1 pixel.*/
		} else if (position >= maxPosition - 1) {
			return 'after';
		} else {
			return null;
		}
	}

	function setOverscrollStatus (orientation, edge, type, ratio) {
		const status = variables.current.overscrollStatus[orientation][edge];
		status.type = type;
		status.ratio = ratio;
	}

	function getOverscrollStatus (orientation, edge) {
		return (variables.current.overscrollStatus[orientation][edge]);
	}

	function calculateOverscrollRatio (orientation, position) {
		const
			bounds = getScrollBounds(),
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

	function applyOverscrollEffect (orientation, edge, type, ratio) {
		props.applyOverscrollEffect(orientation, edge, type, ratio);
		setOverscrollStatus(orientation, edge, type === overscrollTypeOnce ? overscrollTypeDone : type, ratio);
	}

	function checkAndApplyOverscrollEffect (orientation, edge, type, ratio = 1) {
		const
			isVertical = (orientation === 'vertical'),
			curPos = isVertical ? variables.current.scrollTop : variables.current.scrollLeft,
			maxPos = getScrollBounds()[isVertical ? 'maxTop' : 'maxLeft'];

		/* If a scroll size or a client size is not integer,
			 browser's max scroll position could be smaller than maxPos by 1 pixel.*/
		if ((edge === 'before' && curPos <= 0) || (edge === 'after' && curPos >= maxPos - 1)) { // Already on the edge
			applyOverscrollEffect(orientation, edge, type, ratio);
		} else {
			setOverscrollStatus(orientation, edge, type, ratio);
		}
	}

	function clearOverscrollEffect (orientation, edge) {
		if (getOverscrollStatus(orientation, edge).type !== overscrollTypeNone) {
			if (props.clearOverscrollEffect) {
				props.clearOverscrollEffect(orientation, edge);
			} else {
				applyOverscrollEffect(orientation, edge, overscrollTypeNone, 0);
			}
		}
	}

	function clearAllOverscrollEffects () {
		['horizontal', 'vertical'].forEach((orientation) => {
			['before', 'after'].forEach((edge) => {
				clearOverscrollEffect(orientation, edge);
			});
		});
	}

	function applyOverscrollEffectOnDrag (orientation, edge, targetPosition, type) {
		if (edge) {
			const
				oppositeEdge = edge === 'before' ? 'after' : 'before',
				ratio = calculateOverscrollRatio(orientation, targetPosition);

			applyOverscrollEffect(orientation, edge, type, ratio);
			clearOverscrollEffect(orientation, oppositeEdge);
		} else {
			clearOverscrollEffect(orientation, 'before');
			clearOverscrollEffect(orientation, 'after');
		}
	}

	function checkAndApplyOverscrollEffectOnDrag (targetX, targetY, type) {
		const bounds = getScrollBounds();

		if (canScrollHorizontally(bounds)) {
			applyOverscrollEffectOnDrag('horizontal', getEdgeFromPosition(targetX, bounds.maxLeft), targetX, type);
		}

		if (canScrollVertically(bounds)) {
			applyOverscrollEffectOnDrag('vertical', getEdgeFromPosition(targetY, bounds.maxTop), targetY, type);
		}
	}

	function checkAndApplyOverscrollEffectOnScroll (orientation) {
		['before', 'after'].forEach((edge) => {
			const {ratio, type} = getOverscrollStatus(orientation, edge);

			if (type === overscrollTypeOnce) {
				checkAndApplyOverscrollEffect(orientation, edge, type, ratio);
			}
		});
	}

	function checkAndApplyOverscrollEffectOnStart (orientation, edge, targetPosition) {
		if (variables.current.isDragging) {
			applyOverscrollEffectOnDrag(orientation, edge, targetPosition, overscrollTypeHold);
		} else if (edge) {
			checkAndApplyOverscrollEffect(orientation, edge, overscrollTypeOnce);
		}
	}

	// call scroll callbacks

	function forwardScrollEvent (type, reachedEdgeInfo) {
		forward(type, {scrollLeft: variables.current.scrollLeft, scrollTop: variables.current.scrollTop, moreInfo: getMoreInfo(), reachedEdgeInfo}, props);
	}

	// call scroll callbacks and update scrollbars for native scroll

	function scrollStartOnScroll () {
		variables.current.scrolling = true;
		showThumb(getScrollBounds());
		forwardScrollEvent('onScrollStart');
	}

	function scrollStopOnScroll () {
		if (props.scrollStopOnScroll) {
			props.scrollStopOnScroll();
		}
		if (variables.current.overscrollEnabled && !variables.current.isDragging) { // not check props.overscrollEffectOn for safety
			clearAllOverscrollEffects();
		}
		variables.current.lastInputType = null;
		variables.current.isScrollAnimationTargetAccumulated = false;
		variables.current.scrolling = false;
		forwardScrollEvent('onScrollStop', getReachedEdgeInfo());
		startHidingThumb();
	}

	// update scroll position

	function setScrollLeft (value) {
		const bounds = getScrollBounds();

		variables.current.scrollLeft = clamp(0, bounds.maxLeft, value);

		if (variables.current.overscrollEnabled && props.overscrollEffectOn[variables.current.lastInputType]) {
			checkAndApplyOverscrollEffectOnScroll('horizontal');
		}

		if (isHorizontalScrollbarVisible) {
			updateThumb(horizontalScrollbarRef, bounds);
		}
	}

	function setScrollTop (value) {
		const bounds = getScrollBounds();

		variables.current.scrollTop = clamp(0, bounds.maxTop, value);

		if (variables.current.overscrollEnabled && props.overscrollEffectOn[variables.current.lastInputType]) {
			checkAndApplyOverscrollEffectOnScroll('vertical');
		}

		if (isVerticalScrollbarVisible) {
			updateThumb(verticalScrollbarRef, bounds);
		}
	}

	function getReachedEdgeInfo () {
		const
			bounds = getScrollBounds(),
			reachedEdgeInfo = {bottom: false, left: false, right: false, top: false};

		if (canScrollHorizontally(bounds)) {
			const
				edge = getEdgeFromPosition(variables.current.scrollLeft, bounds.maxLeft);

			if (edge) { // if edge is null, no need to check which edge is reached.
				if ((edge === 'before' && !rtl) || (edge === 'after' && rtl)) {
					reachedEdgeInfo.left = true;
				} else {
					reachedEdgeInfo.right = true;
				}
			}
		}

		if (canScrollVertically(bounds)) {
			const edge = getEdgeFromPosition(variables.current.scrollTop, bounds.maxTop);

			if (edge === 'before') {
				reachedEdgeInfo.top = true;
			} else if (edge === 'after') {
				reachedEdgeInfo.bottom = true;
			}
		}

		return reachedEdgeInfo;
	}

	// scroll start

	function start ({targetX, targetY, animate = true, overscrollEffect = false}) {
		const
			{scrollLeft, scrollTop} = variables.current,
			childRefCurrent = variables.current.childRefCurrent,
			childContainerRef = childRefCurrent.containerRef,
			bounds = getScrollBounds(),
			{maxLeft, maxTop} = bounds;

		const updatedAnimationInfo = {
			targetX,
			targetY
		};

		// bail early when scrolling to the same position
		if (variables.current.scrolling && variables.current.animationInfo && variables.current.animationInfo.targetX === targetX && variables.current.animationInfo.targetY === targetY) {
			return;
		}

		variables.current.animationInfo = updatedAnimationInfo;

		if (Math.abs(maxLeft - targetX) < epsilon) {
			targetX = maxLeft;
		}
		if (Math.abs(maxTop - targetY) < epsilon) {
			targetY = maxTop;
		}

		if (variables.current.overscrollEnabled && overscrollEffect) {
			if (scrollLeft !== targetX && canScrollHorizontally(bounds)) {
				checkAndApplyOverscrollEffectOnStart('horizontal', getEdgeFromPosition(targetX, maxLeft), targetX);
			}
			if (scrollTop !== targetY && canScrollVertically(bounds)) {
				checkAndApplyOverscrollEffectOnStart('vertical', getEdgeFromPosition(targetY, maxTop), targetY);
			}
		}

		if (animate) {
			childRefCurrent.scrollToPosition(targetX, targetY);
		} else {
			childContainerRef.current.style.scrollBehavior = null;
			childRefCurrent.scrollToPosition(targetX, targetY);
			childContainerRef.current.style.scrollBehavior = 'smooth';
		}
		variables.current.scrollStopJob.start();

		if (props.start) {
			props.start(animate);
		}
	}

	function stop () {
		const
			childRefCurrent = variables.current.childRefCurrent,
			childContainerRef = childRefCurrent.containerRef;

		childContainerRef.current.style.scrollBehavior = null;
		childRefCurrent.scrollToPosition(variables.current.scrollLeft + 0.1, variables.current.scrollTop + 0.1);
		childContainerRef.current.style.scrollBehavior = 'smooth';
	}

	// scrollTo API

	function getPositionForScrollTo (opt) {
		const
			bounds = getScrollBounds(),
			bCanScrollHorizontally = canScrollHorizontally(bounds),
			bCanScrollVertically = canScrollVertically(bounds);
		let
			itemPos,
			left = null,
			top = null;

		if (opt instanceof Object) {
			if (opt.position instanceof Object) {
				if (bCanScrollHorizontally) {
					// We need '!=' to check if opt.position.x is null or undefined
					left = opt.position.x != null ? opt.position.x : variables.current.scrollLeft;
				} else {
					left = 0;
				}
				if (bCanScrollVertically) {
					// We need '!=' to check if opt.position.y is null or undefined
					top = opt.position.y != null ? opt.position.y : variables.current.scrollTop;
				} else {
					top = 0;
				}
			} else if (typeof opt.align === 'string') {
				if (bCanScrollHorizontally) {
					if (opt.align.includes('left')) {
						left = 0;
					} else if (opt.align.includes('right')) {
						left = bounds.maxLeft;
					}
				}
				if (bCanScrollVertically) {
					if (opt.align.includes('top')) {
						top = 0;
					} else if (opt.align.includes('bottom')) {
						top = bounds.maxTop;
					}
				}
			} else {
				if (typeof opt.index === 'number' && typeof variables.current.childRefCurrent.getItemPosition === 'function') {
					itemPos = variables.current.childRefCurrent.getItemPosition(opt.index, opt.stickTo);
				} else if (opt.node instanceof Object) {
					if (opt.node.nodeType === 1 && typeof variables.current.childRefCurrent.getNodePosition === 'function') {
						itemPos = variables.current.childRefCurrent.getNodePosition(opt.node);
					}
				}
				if (itemPos) {
					if (bCanScrollHorizontally) {
						left = itemPos.left;
					}
					if (bCanScrollVertically) {
						top = itemPos.top;
					}
				}
			}
		}

		return {left, top};
	}

	function scrollTo (opt) {
		if (!variables.current.deferScrollTo) {
			const {left, top} = getPositionForScrollTo(opt);

			if (props.scrollTo) {
				props.scrollTo(opt);
			}
			variables.current.scrollToInfo = null;
			start({
				targetX: (left !== null) ? left : variables.current.scrollLeft,
				targetY: (top !== null) ? top : variables.current.scrollTop,
				animate: opt.animate
			});
		} else {
			variables.current.scrollToInfo = opt;
		}
	}

	function canScrollHorizontally (bounds) {
		const {direction} = props;
		return (direction === 'horizontal' || direction === 'both') && (bounds.scrollWidth > bounds.clientWidth) && !isNaN(bounds.scrollWidth);
	}

	function canScrollVertically (bounds) {
		const {direction} = props;
		return (direction === 'vertical' || direction === 'both') && (bounds.scrollHeight > bounds.clientHeight) && !isNaN(bounds.scrollHeight);
	}

	// scroll bar

	function showThumb (bounds) {
		if (isHorizontalScrollbarVisible && canScrollHorizontally(bounds) && horizontalScrollbarRef.current) {
			horizontalScrollbarRef.current.showThumb();
		}
		if (isVerticalScrollbarVisible && canScrollVertically(bounds) && verticalScrollbarRef.current) {
			verticalScrollbarRef.current.showThumb();
		}
	}

	function updateThumb (scrollbarRef, bounds) {
		scrollbarRef.current.update({
			...bounds,
			scrollLeft: variables.current.scrollLeft,
			scrollTop: variables.current.scrollTop
		});
	}

	function startHidingThumb () {
		if (isHorizontalScrollbarVisible && horizontalScrollbarRef.current) {
			horizontalScrollbarRef.current.startHidingThumb();
		}
		if (isVerticalScrollbarVisible && verticalScrollbarRef.current) {
			verticalScrollbarRef.current.startHidingThumb();
		}
	}

	function updateScrollbars () {
		const
			{horizontalScrollbar, verticalScrollbar} = props,
			bounds = getScrollBounds(),
			bCanScrollHorizontally = canScrollHorizontally(bounds),
			bCanScrollVertically = canScrollVertically(bounds),
			curHorizontalScrollbarVisible = (horizontalScrollbar === 'auto') ? bCanScrollHorizontally : horizontalScrollbar === 'visible',
			curVerticalScrollbarVisible = (verticalScrollbar === 'auto') ? bCanScrollVertically : verticalScrollbar === 'visible';

		// determine if we should hide or show any scrollbars
		const
			isVisibilityChanged = (
				isHorizontalScrollbarVisible !== curHorizontalScrollbarVisible ||
				isVerticalScrollbarVisible !== curVerticalScrollbarVisible
			);

		if (isVisibilityChanged) {
			// one or both scrollbars have changed visibility
			setIsHorizontalScrollbarVisible(curHorizontalScrollbarVisible);
			setIsVerticalScrollbarVisible(curVerticalScrollbarVisible);
		} else {
			variables.current.deferScrollTo = false;
			variables.current.isUpdatedScrollThumb = updateScrollThumbSize();
		}
	}

	function updateScrollThumbSize () {
		const
			{horizontalScrollbar, verticalScrollbar} = props,
			bounds = getScrollBounds(),
			bCanScrollHorizontally = canScrollHorizontally(bounds),
			bCanScrollVertically = canScrollVertically(bounds),
			curHorizontalScrollbarVisible = (horizontalScrollbar === 'auto') ? bCanScrollHorizontally : horizontalScrollbar === 'visible',
			curVerticalScrollbarVisible = (verticalScrollbar === 'auto') ? bCanScrollVertically : verticalScrollbar === 'visible';

		if (curHorizontalScrollbarVisible || curVerticalScrollbarVisible) {
			// no visibility change but need to notify whichever scrollbars are visible of the
			// updated bounds and scroll position
			const
				updatedBounds = {
					...bounds,
					scrollLeft: variables.current.scrollLeft,
					scrollTop: variables.current.scrollTop
				};

			if (curHorizontalScrollbarVisible && horizontalScrollbarRef.current) {
				horizontalScrollbarRef.current.update(updatedBounds);
			}
			if (curVerticalScrollbarVisible && verticalScrollbarRef.current) {
				verticalScrollbarRef.current.update(updatedBounds);
			}
			return true;
		}
		return false;
	}

	// ref

	function getScrollBounds () {
		if (variables.current.childRefCurrent && typeof variables.current.childRefCurrent.getScrollBounds === 'function') {
			return variables.current.childRefCurrent.getScrollBounds();
		}
	}

	function getMoreInfo () {
		if (variables.current.childRefCurrent && typeof variables.current.childRefCurrent.getMoreInfo === 'function') {
			return variables.current.childRefCurrent.getMoreInfo();
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	function addEventListeners () {
		const {childRefCurrent} = variables.current;

		if (containerRef.current && containerRef.current.addEventListener) {
			containerRef.current.addEventListener('wheel', onWheel);
			containerRef.current.addEventListener('keydown', onKeyDown);
			containerRef.current.addEventListener('mousedown', onMouseDown);
		}

		if (childRefCurrent.containerRef.current) {
			if (childRefCurrent.containerRef.current.addEventListener) {
				childRefCurrent.containerRef.current.addEventListener('scroll', onScroll, {capture: true, passive: true});
			}
			variables.current.childRefCurrent.containerRef.current.style.scrollBehavior = 'smooth';
		}

		if (props.addEventListeners) {
			props.addEventListeners(childRefCurrent.containerRef);
		}

		if (window) {
			window.addEventListener('resize', handleResizeWindow);
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	function removeEventListeners () {
		const {childRefCurrent} = variables.current;

		if (containerRef.current && containerRef.current.removeEventListener) {
			containerRef.current.removeEventListener('wheel', onWheel);
			containerRef.current.removeEventListener('keydown', onKeyDown);
			containerRef.current.removeEventListener('mousedown', onMouseDown);
		}

		if (childRefCurrent.containerRef.current && childRefCurrent.containerRef.current.removeEventListener) {
			childRefCurrent.containerRef.current.removeEventListener('scroll', onScroll, {capture: true, passive: true});
		}

		if (props.removeEventListeners) {
			props.removeEventListeners(childRefCurrent.containerRef);
		}

		if (window) {
			window.removeEventListener('resize', handleResizeWindow);
		}
	}

	function initChildRef (ref) {
		if (ref) {
			variables.current.childRefCurrent = ref.current || ref;
		}
	}

	// render
	variables.current.deferScrollTo = true;

	return (
		<ResizeContext.Provider value={variables.current.resizeRegistry.register}>
			{containerRenderer({
				childComponentProps: rest,
				childWrapper,
				childWrapperProps,
				className: scrollableClasses,
				componentCss: css,
				containerRef: containerRef,
				horizontalScrollbarProps: variables.current.horizontalScrollbarProps,
				initChildRef: initChildRef,
				isHorizontalScrollbarVisible,
				isVerticalScrollbarVisible,
				rtl,
				scrollTo: scrollTo,
				style,
				verticalScrollbarProps: variables.current.verticalScrollbarProps
			})}
		</ResizeContext.Provider>
	);
};

ScrollableBaseNative.displayName = 'ui:ScrollableBaseNative';

ScrollableBaseNative.propTypes = /** @lends ui/ScrollableNative.ScrollableNative.prototype */ {
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
	 * The `scrollTo` function accepts the following parameters:
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
	 *	cbScrollTo: (fn) => {scrollTo = fn;}
	 *	// You can simply call like below;
	 *	scrollTo({align: 'top'}); // scroll to the top
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
	 * Called when resizing window
	 *
	 * @type {Function}
	 * @private
	 */
	handleResizeWindow: PropTypes.func,

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
	 * Called when pressing a key.
	 *
	 * @type {Function}
	 * @private
	 */
	onKeyDown: PropTypes.func,

	/**
	 * Called when triggering a mousedown event.
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
	 *         onScrollStart={onScrollStart}
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
	 *         onScrollStop={onScrollStop}
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
};

ScrollableBaseNative.defaultProps = {
	cbScrollTo: nop,
	horizontalScrollbar: 'auto',
	noScrollByDrag: false,
	noScrollByWheel: false,
	onScroll: nop,
	onScrollStart: nop,
	onScrollStop: nop,
	overscrollEffectOn: {drag: false, pageKey: false, wheel: false},
	verticalScrollbar: 'auto'
};

/**
 * An unstyled native component that provides horizontal and vertical scrollbars and makes a render prop element scrollable.
 *
 * @function ScrollableNative
 * @memberof ui/ScrollableNative
 * @extends ui/Scrollable.ScrollableBaseNative
 * @ui
 * @private
 */
const ScrollableNative = (props) => {
	const {childRenderer, ...rest} = props;

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
};

ScrollableNative.displayName = 'ui:ScrollableNative';

ScrollableNative.propTypes = /** @lends ui/ScrollableNative.ScrollableNative.prototype */ {
	/**
	 * Render function.
	 *
	 * @type {Function}
	 * @private
	 */
	childRenderer: PropTypes.func
};

export default ScrollableNative;
export {
	constants,
	ScrollableBaseNative,
	ScrollableNative
};
