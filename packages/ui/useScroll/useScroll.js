/**
 * Unstyled scrollable hook and behaviors to be customized by a theme or application.
 *
 * @module ui/useScroll
 * @exports assignPropertiesOf
 * @exports constants
 * @exports useScroll
 * @exports useScrollBase
 * @private
 */

import classNames from 'classnames';
import {forward, forwardWithPrevent} from '@enact/core/handle';
import {is} from '@enact/core/keymap';
import {platform} from '@enact/core/platform'; // scrollMode 'native'
import Registry from '@enact/core/internal/Registry';
import {Job} from '@enact/core/util';
import clamp from 'ramda/src/clamp';
import {useCallback, useContext, useEffect, useLayoutEffect, useReducer, useRef, useState} from 'react';
import warning from 'warning';

import ForwardRef from '../ForwardRef';
import {ResizeContext} from '../Resizable';
import ri from '../resolution';
import Touchable from '../Touchable';

import ScrollAnimator from './ScrollAnimator';
import utilDOM from './utilDOM';
import utilEvent from './utilEvent';

import css from './useScroll.module.less';

const
	constants = {
		animationDuration: 1000,
		epsilon: 1,
		flickConfig: {maxDuration: null},
		isPageDown: is('pageDown'),
		isPageUp: is('pageUp'),
		nop: () => {},
		overscrollTypeNone: 0,
		overscrollTypeHold: 1,
		overscrollTypeOnce: 2,
		overscrollTypeDone: 9,
		overscrollVelocityFactor: 300, // scrollMode 'native'
		paginationPageMultiplier: 0.66,
		scrollStopWaiting: 200,
		scrollWheelPageMultiplierForMaxPixel: 0.2 // The ratio of the maximum distance scrolled by wheel to the size of the viewport.
	},
	{
		animationDuration,
		epsilon,
		flickConfig,
		isPageDown,
		isPageUp,
		overscrollTypeDone,
		overscrollTypeHold,
		overscrollTypeNone,
		overscrollTypeOnce,
		overscrollVelocityFactor,
		paginationPageMultiplier,
		scrollStopWaiting,
		scrollWheelPageMultiplierForMaxPixel
	} = constants;

const TouchableDiv = ForwardRef({prop: 'ref'}, Touchable('div'));

const useForceUpdate = () => (useReducer(x => x + 1, 0));

/**
 * A custom hook that passes scrollable behavior information as its render prop.
 *
 * @class
 * @memberof ui/useScroll
 * @ui
 * @private
 */
const useScrollBase = (props) => {
	const
		{
			childProps,
			children,
			className,
			clientSize,
			'data-webos-voice-disabled': voiceDisabled,
			'data-webos-voice-focused': voiceFocused,
			'data-webos-voice-group-label': voiceGroupLabel,
			assignProperties,
			dataSize,
			direction,
			horizontalScrollbar,
			horizontalScrollbarRef,
			itemRenderer,
			itemSize,
			itemSizes,
			noScrollByDrag,
			noScrollByWheel,
			overhang,
			overscrollEffectOn,
			pageScroll,
			rtl,
			scrollContainerRef,
			scrollContentHandle,
			scrollContentRef,
			scrollMode,
			setScrollContainerHandle,
			spacing,
			verticalScrollbar,
			verticalScrollbarRef,
			wrap,
			...rest
		} = props,
		scrollClasses = classNames(css.scroll, className);

	// The following props are the one having the same naming function in this scope.
	// So it is better to use props[propName]
	// instead of extracting it from the `props` and renaming it
	delete rest.addEventListeners;
	delete rest.applyOverscrollEffect;
	delete rest.cbScrollTo;
	delete rest.clearOverscrollEffect;
	delete rest.handleResizeWindow;
	delete rest.onFlick;
	delete rest.onKeyDown;
	delete rest.onMouseDown;
	delete rest.onScroll;
	delete rest.onScrollStart;
	delete rest.onScrollStop;
	delete rest.onWheel;
	delete rest.removeEventListeners;
	delete rest.scrollStopOnScroll; // scrollMode 'native'
	delete rest.scrollTo;
	delete rest.start; // scrollMode 'native'
	delete rest.stop; // scrollMode 'translate'

	// Mutable value and Hooks

	const [, forceUpdate] = useForceUpdate();

	const context = useContext(ResizeContext);

	const [isHorizontalScrollbarVisible, setIsHorizontalScrollbarVisible] = useState(horizontalScrollbar === 'visible');
	const [isVerticalScrollbarVisible, setIsVerticalScrollbarVisible] = useState(verticalScrollbar === 'visible');

	const mutableRef = useRef({
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
		isTouching: false, // scrollMode 'native'

		// scroll info
		scrolling: false,
		scrollLeft: 0,
		scrollTop: 0,
		scrollToInfo: null,

		// scroll animator
		animator: null,

		// non-declared-variable.
		accumulatedTargetX: null,
		accumulatedTargetY: null,
		flickTarget: null,
		dragStartX: null,
		dragStartY: null,
		scrollStopJob: null,

		prevState: {isHorizontalScrollbarVisible, isVerticalScrollbarVisible}
	});

	if (mutableRef.current.animator == null) {
		mutableRef.current.animator = new ScrollAnimator();
	}

	useLayoutEffect(() => {
		if (setScrollContainerHandle) {
			setScrollContainerHandle({
				animator: mutableRef.current.animator,
				applyOverscrollEffect,
				bounds: mutableRef.current.bounds,
				calculateDistanceByWheel,
				canScrollHorizontally,
				canScrollVertically,
				checkAndApplyOverscrollEffect,
				getScrollBounds,
				get isDragging () {
					return mutableRef.current.isDragging;
				},
				set isDragging (val) {
					mutableRef.current.isDragging = val;
				},
				get isScrollAnimationTargetAccumulated () {
					return mutableRef.current.isScrollAnimationTargetAccumulated;
				},
				set isScrollAnimationTargetAccumulated (val) {
					mutableRef.current.isScrollAnimationTargetAccumulated = val;
				},
				get isUpdatedScrollThumb () {
					return mutableRef.current.isUpdatedScrollThumb;
				},
				get lastInputType () {
					return mutableRef.current.lastInputType;
				},
				set lastInputType (val) {
					mutableRef.current.lastInputType = val;
				},
				get rtl () {
					return rtl;
				},
				get scrollBounds () {
					return getScrollBounds();
				},
				get scrollHeight () {
					return mutableRef.current.bounds.scrollHeight;
				},
				get scrolling () {
					return mutableRef.current.scrolling;
				},
				get scrollLeft () {
					return mutableRef.current.scrollLeft;
				},
				scrollTo,
				scrollToAccumulatedTarget,
				get scrollToInfo () {
					return mutableRef.current.scrollToInfo;
				},
				get scrollTop () {
					return mutableRef.current.scrollTop;
				},
				setOverscrollStatus,
				showThumb,
				start,
				startHidingThumb,
				stop,
				get wheelDirection () {
					return mutableRef.current.wheelDirection;
				},
				set wheelDirection (val) {
					mutableRef.current.wheelDirection = val;
				}
			});
		}
	});

	useLayoutEffect(() => {
		if (props.cbScrollTo) {
			props.cbScrollTo(scrollTo);
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		mutableRef.current.resizeRegistry.parent = context;

		// componentWillUnmount
		return () => {
			const {animator, resizeRegistry, scrolling, scrollStopJob} = mutableRef.current; // eslint-disable-line react-hooks/exhaustive-deps

			resizeRegistry.parent = null;

			// Before call cancelAnimationFrame, you must send scrollStop Event.
			if (scrolling) {
				forwardScrollEvent('onScrollStop', getReachedEdgeInfo());
			}

			scrollStopJob.stop();

			// scrollMode 'translate' [
			if (animator.isAnimating()) {
				animator.stop();
			}
			// scrollMode 'translate' ]
		};

	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		addEventListeners();
		return () => {
			removeEventListeners();
		};
	});

	// scrollMode 'translate' [[
	// TODO: consider replacing forceUpdate() by storing bounds in state rather than a non-
	// state member.
	const enqueueForceUpdate = useCallback(() => {
		scrollContentHandle.current.calculateMetrics(scrollContentHandle.current.props);
		forceUpdate();
	}, [forceUpdate, scrollContentHandle]);

	function handleResizeWindow () {
		const propsHandleResizeWindow = props.handleResizeWindow;

		// `handleSize` in `ui/resolution.ResolutionDecorator` should be executed first.
		setTimeout(() => {
			if (propsHandleResizeWindow) {
				propsHandleResizeWindow();
			}
			if (scrollMode === 'translate') {
				scrollTo({position: {x: 0, y: 0}, animate: false});
			} else {
				scrollContentRef.current.style.scrollBehavior = null;
				scrollContentHandle.current.scrollToPosition(0, 0);
				scrollContentRef.current.style.scrollBehavior = 'smooth';
			}

			enqueueForceUpdate();
		});
	} // esline-disable-line react-hooks/exhaustive-deps

	const handleResize = useCallback((ev) => {
		if (ev.action === 'invalidateBounds') {
			enqueueForceUpdate();
		}
	}, [enqueueForceUpdate]);
	// scrollMode 'translate' ]]

	if (mutableRef.current.resizeRegistry == null) {
		mutableRef.current.resizeRegistry = Registry.create(handleResize);
	}

	useEffect(() => {
		const ref = mutableRef.current;

		if (scrollMode === 'translate') {
			ref.scrollStopJob = new Job(doScrollStop, scrollStopWaiting);
		} else {
			ref.scrollStopJob = new Job(scrollStopOnScroll, scrollStopWaiting);
		}

		return () => {
			ref.scrollStopJob.stop();
		};
	}); // esline-disable-next-line react-hooks/exhaustive-deps

	useEffect(() => {
		const
			{hasDataSizeChanged} = scrollContentHandle.current,
			{prevState, resizeRegistry, scrollToInfo} = mutableRef.current;

		// Need to sync calculated client size if it is different from the real size
		if (scrollContentHandle.current.syncClientSize) {
			// If we actually synced, we need to reset scroll position.
			if (scrollContentHandle.current.syncClientSize()) {
				setScrollLeft(0);
				setScrollTop(0);
			}
		}

		clampScrollPosition(); // scrollMode 'translate'

		if (
			hasDataSizeChanged === false &&
			(isHorizontalScrollbarVisible && !prevState.isHorizontalScrollbarVisible || isVerticalScrollbarVisible && !prevState.isVerticalScrollbarVisible)
		) {
			mutableRef.current.deferScrollTo = false;
			mutableRef.current.isUpdatedScrollThumb = updateScrollThumbSize();
		} else {
			updateScrollbars();
		}

		if (scrollToInfo !== null) {
			if (!mutableRef.current.deferScrollTo) {
				scrollTo(scrollToInfo);
			}
		}

		// publish container resize changes
		const horizontal = isHorizontalScrollbarVisible !== prevState.isHorizontalScrollbarVisible;
		const vertical = isVerticalScrollbarVisible !== prevState.isVerticalScrollbarVisible;
		if (horizontal || vertical) {
			resizeRegistry.notify({});
		}
	}); // esline-disable-next-line react-hooks/exhaustive-deps

	// scrollMode 'translate' [[
	function clampScrollPosition () {
		const bounds = getScrollBounds();

		if (mutableRef.current.scrollTop > bounds.maxTop) {
			mutableRef.current.scrollTop = bounds.maxTop;
		}

		if (mutableRef.current.scrollLeft > bounds.maxLeft) {
			mutableRef.current.scrollLeft = bounds.maxLeft;
		}
	}
	// scrollMode 'translate' ]]

	// drag/flick event handlers

	function getRtlX (x) {
		return (rtl ? -x : x);
	}

	function onMouseDown (ev) {
		if (forwardWithPrevent('onMouseDown', ev, props)) {
			stop();
		}
	} // esline-disable-next-line react-hooks/exhaustive-deps

	// scrollMode 'native' [[
	function onTouchStart () {
		mutableRef.current.isTouching = true;
	}
	// scrollMode 'native' ]]

	function onDragStart (ev) {
		if (scrollMode === 'translate' ) {
			if (ev.type === 'dragstart') return;

			forward('onDragStart', ev, props);
			stop();
			mutableRef.current.isDragging = true;
			mutableRef.current.dragStartX = mutableRef.current.scrollLeft + getRtlX(ev.x);
			mutableRef.current.dragStartY = mutableRef.current.scrollTop + ev.y;
		} else {
			if (!mutableRef.current.isTouching) {
				stop();
				mutableRef.current.isDragging = true;
			}

			// these values are used also for touch inputs
			mutableRef.current.dragStartX = mutableRef.current.scrollLeft + getRtlX(ev.x);
			mutableRef.current.dragStartY = mutableRef.current.scrollTop + ev.y;
		}
	}

	function onDrag (ev) {
		if (scrollMode === 'translate') {
			if (ev.type === 'drag') {
				return;
			}

			mutableRef.current.lastInputType = 'drag';

			forward('onDrag', ev, props);
			start({
				targetX: (direction === 'vertical') ? 0 : mutableRef.current.dragStartX - getRtlX(ev.x), // 'horizontal' or 'both'
				targetY: (direction === 'horizontal') ? 0 : mutableRef.current.dragStartY - ev.y, // 'vertical' or 'both'
				animate: false,
				overscrollEffect: overscrollEffectOn.drag
			});
		} else {
			const
				targetX = (direction === 'vertical') ? 0 : mutableRef.current.dragStartX - getRtlX(ev.x), // 'horizontal' or 'both'
				targetY = (direction === 'horizontal') ? 0 : mutableRef.current.dragStartY - ev.y; // 'vertical' or 'both'

			mutableRef.current.lastInputType = 'drag';

			if (!mutableRef.current.isTouching) {
				start({targetX, targetY, animate: false, overscrollEffect: overscrollEffectOn.drag});
			} else if (mutableRef.current.overscrollEnabled && overscrollEffectOn.drag) {
				checkAndApplyOverscrollEffectOnDrag(targetX, targetY, overscrollTypeHold);
			}
		}
	}

	function onDragEnd (ev) {
		if (scrollMode === 'translate') {
			if (ev.type === 'dragend') {
				return;
			}

			mutableRef.current.isDragging = false;

			forward('onDragEnd', ev, props);
			if (mutableRef.current.flickTarget) {
				const {targetX, targetY, duration} = mutableRef.current.flickTarget;

				mutableRef.current.lastInputType = 'drag';

				mutableRef.current.isScrollAnimationTargetAccumulated = false;
				start({targetX, targetY, duration, overscrollEffect: overscrollEffectOn.drag});
			} else {
				stop();
			}

			if (mutableRef.current.overscrollEnabled) { // not check overscrollEffectOn.drag for safety
				clearAllOverscrollEffects();
			}

			mutableRef.current.flickTarget = null;
		} else {
			mutableRef.current.isDragging = false;

			mutableRef.current.lastInputType = 'drag';

			if (mutableRef.current.flickTarget) {
				const {targetX, targetY} = mutableRef.current.flickTarget;

				if (!mutableRef.current.isTouching) {
					mutableRef.current.isScrollAnimationTargetAccumulated = false;
					start({targetX, targetY, overscrollEffect: overscrollEffectOn.drag});
				} else if (mutableRef.current.overscrollEnabled && overscrollEffectOn.drag) {
					checkAndApplyOverscrollEffectOnDrag(targetX, targetY, overscrollTypeOnce);
				}
			} else if (!mutableRef.current.isTouching) {
				stop();
			}

			if (mutableRef.current.overscrollEnabled) { // not check overscrollEffectOn.drag for safety
				clearAllOverscrollEffects();
			}

			mutableRef.current.isTouching = false;
			mutableRef.current.flickTarget = null;
		}
	}

	function onFlick (ev) {
		if (scrollMode === 'translate') {
			mutableRef.current.flickTarget = mutableRef.current.animator.simulate(
				mutableRef.current.scrollLeft,
				mutableRef.current.scrollTop,
				(direction !== 'vertical') ? getRtlX(-ev.velocityX) : 0,
				(direction !== 'horizontal') ? -ev.velocityY : 0
			);
		} else if (scrollMode === 'native') {
			if (!mutableRef.current.isTouching) {
				mutableRef.current.flickTarget = mutableRef.current.animator.simulate(
					mutableRef.current.scrollLeft,
					mutableRef.current.scrollTop,
					(direction !== 'vertical') ? getRtlX(-ev.velocityX) : 0,
					(direction !== 'horizontal') ? -ev.velocityY : 0
				);
			} else if (mutableRef.current.overscrollEnabled && overscrollEffectOn.drag) {
				mutableRef.current.flickTarget = {
					targetX: mutableRef.current.scrollLeft + getRtlX(-ev.velocityX) * overscrollVelocityFactor, // 'horizontal' or 'both'
					targetY: mutableRef.current.scrollTop + -ev.velocityY * overscrollVelocityFactor // 'vertical' or 'both'
				};
			}
		}

		if (props.onFlick) {
			forward('onFlick', ev, props);
		}
	}

	function calculateDistanceByWheel (deltaMode, delta, maxPixel) {
		if (deltaMode === 0) {
			delta = clamp(-maxPixel, maxPixel, ri.scale(delta * mutableRef.current.scrollWheelMultiplierForDeltaPixel));
		} else if (deltaMode === 1) { // line; firefox
			delta = clamp(-maxPixel, maxPixel, ri.scale(delta * mutableRef.current.pixelPerLine * mutableRef.current.scrollWheelMultiplierForDeltaPixel));
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
	// esline-disable-next-line react-hooks/exhaustive-deps
	function onWheel (ev) {
		if (mutableRef.current.isDragging) {
			ev.preventDefault();
			ev.stopPropagation();
		} else {
			const
				bounds = getScrollBounds(),
				canScrollH = canScrollHorizontally(bounds),
				canScrollV = canScrollVertically(bounds),
				eventDeltaMode = ev.deltaMode,
				eventDelta = (-ev.wheelDeltaY || ev.deltaY);
			let delta = 0;

			mutableRef.current.lastInputType = 'wheel';

			if (noScrollByWheel) {
				if (scrollMode === 'native' && canScrollV) {
					ev.preventDefault();
				}

				return;
			}

			if (scrollMode === 'translate') {
				if (canScrollV) {
					delta = calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientHeight * scrollWheelPageMultiplierForMaxPixel);
				} else if (canScrollH) {
					delta = calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientWidth * scrollWheelPageMultiplierForMaxPixel);
				}

				const dir = Math.sign(delta);

				if (dir !== mutableRef.current.wheelDirection) {
					mutableRef.current.isScrollAnimationTargetAccumulated = false;
					mutableRef.current.wheelDirection = dir;
				}

				forward('onWheel', {delta, horizontalScrollbarRef, verticalScrollbarRef}, props);

				if (delta !== 0) {
					scrollToAccumulatedTarget(delta, canScrollV, overscrollEffectOn.wheel);
					ev.preventDefault();
					ev.stopPropagation();
				}
			} else { // scrollMode 'native'
				const overscrollEffectRequired = mutableRef.current.overscrollEnabled && overscrollEffectOn.wheel;
				let needToHideThumb = false;

				if (props.onWheel) {
					forward('onWheel', ev, props);
					return;
				}

				showThumb(bounds);

				// FIXME This routine is a temporary support for horizontal wheel scroll.
				// FIXME If web engine supports horizontal wheel, this routine should be refined or removed.
				if (canScrollV) { // This routine handles wheel events on scrollbars for vertical scroll.
					if (eventDelta < 0 && mutableRef.current.scrollTop > 0 || eventDelta > 0 && mutableRef.current.scrollTop < bounds.maxTop) {
						// Not to check if ev.target is a descendant of a wrapped component which may have a lot of nodes in it.
						if (
							horizontalScrollbarRef.current && horizontalScrollbarRef.current.getContainerRef && utilDOM.containsDangerously(horizontalScrollbarRef.current.getContainerRef(), ev.target) ||
							verticalScrollbarRef.current && verticalScrollbarRef.current.getContainerRef && utilDOM.containsDangerously(verticalScrollbarRef.current.getContainerRef(), ev.target)
						) {
							delta = calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientHeight * scrollWheelPageMultiplierForMaxPixel);
							needToHideThumb = !delta;

							ev.preventDefault();
						} else if (overscrollEffectRequired) {
							checkAndApplyOverscrollEffect('vertical', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce);
						}

						ev.stopPropagation();
					} else {
						if (overscrollEffectRequired && (eventDelta < 0 && mutableRef.current.scrollTop <= 0 || eventDelta > 0 && mutableRef.current.scrollTop >= bounds.maxTop)) {
							applyOverscrollEffect('vertical', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce, 1);
						}

						needToHideThumb = true;
					}
				} else if (canScrollH) { // this routine handles wheel events on any children for horizontal scroll.
					if (eventDelta < 0 && mutableRef.current.scrollLeft > 0 || eventDelta > 0 && mutableRef.current.scrollLeft < bounds.maxLeft) {
						delta = calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientWidth * scrollWheelPageMultiplierForMaxPixel);
						needToHideThumb = !delta;

						ev.preventDefault();
						ev.stopPropagation();
					} else {
						if (overscrollEffectRequired && (eventDelta < 0 && mutableRef.current.scrollLeft <= 0 || eventDelta > 0 && mutableRef.current.scrollLeft >= bounds.maxLeft)) {
							applyOverscrollEffect('horizontal', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce, 1);
						}

						needToHideThumb = true;
					}
				}

				if (delta !== 0) {
					const dir = Math.sign(delta);

					// Not to accumulate scroll position if wheel direction is different from hold direction
					if (dir !== mutableRef.current.wheelDirection) {
						mutableRef.current.isScrollAnimationTargetAccumulated = false;
						mutableRef.current.wheelDirection = dir;
					}

					scrollToAccumulatedTarget(delta, canScrollV, overscrollEffectOn.wheel);
				}

				if (needToHideThumb) {
					startHidingThumb();
				}
			}
		}
	}

	// scrollMode 'translate' [[
	function scrollByPage (keyCode) {
		const
			bounds = getScrollBounds(),
			canScrollV = canScrollVertically(bounds),
			pageDistance = (isPageUp(keyCode) ? -1 : 1) * (canScrollV ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier;

		mutableRef.current.lastInputType = 'pageKey';

		scrollToAccumulatedTarget(pageDistance, canScrollV, overscrollEffectOn.pageKey);
	}
	// scrollMode 'translate' ]]

	// scrollMode 'native' [[
	// esline-disable-next-line react-hooks/exhaustive-deps
	function onScroll (ev) {
		let {scrollLeft, scrollTop} = ev.target;

		const
			bounds = getScrollBounds(),
			canScrollH = canScrollHorizontally(bounds);

		if (!mutableRef.current.scrolling) {
			scrollStartOnScroll();
		}

		if (rtl && canScrollH) {
			scrollLeft = (platform.ios || platform.safari) ? -scrollLeft : bounds.maxLeft - scrollLeft;
		}

		if (scrollLeft !== mutableRef.current.scrollLeft) {
			setScrollLeft(scrollLeft);
		}
		if (scrollTop !== mutableRef.current.scrollTop) {
			setScrollTop(scrollTop);
		}

		if (scrollContentHandle.current.didScroll) {
			scrollContentHandle.current.didScroll(mutableRef.current.scrollLeft, mutableRef.current.scrollTop);
		}

		forwardScrollEvent('onScroll');
		mutableRef.current.scrollStopJob.start();
	}
	// scrollMode 'native' ]]

	function onKeyDown (ev) {
		if (scrollMode === 'translate') {
			if (props.onKeyDown) {
				forward('onKeyDown', ev, props);
			} else if ((isPageUp(ev.keyCode) || isPageDown(ev.keyCode))) {
				scrollByPage(ev.keyCode);
			}
		} else {
			forward('onKeyDown', ev, props);
		}
	} // esline-disable-line react-hooks/exhaustive-deps

	function scrollToAccumulatedTarget (delta, vertical, overscrollEffect) {
		if (!mutableRef.current.isScrollAnimationTargetAccumulated) {
			mutableRef.current.accumulatedTargetX = mutableRef.current.scrollLeft;
			mutableRef.current.accumulatedTargetY = mutableRef.current.scrollTop;
			mutableRef.current.isScrollAnimationTargetAccumulated = true;
		}

		if (vertical) {
			mutableRef.current.accumulatedTargetY += delta;
		} else {
			mutableRef.current.accumulatedTargetX += delta;
		}

		start({targetX: mutableRef.current.accumulatedTargetX, targetY: mutableRef.current.accumulatedTargetY, overscrollEffect});
	}

	// overscroll effect

	function getEdgeFromPosition (position, maxPosition) {
		if (position <= 0) {
			return 'before';
		/* If a scroll size or a client size is not integer,
			browser's max scroll position could be smaller than maxPos by 1 pixel.*/
		} else if (scrollMode === 'translate' && position >= maxPosition || scrollMode === 'native' && position >= maxPosition - 1) {
			return 'after';
		} else {
			return null;
		}
	}

	function setOverscrollStatus (orientation, edge, overscrollEffectType, ratio) {
		const status = mutableRef.current.overscrollStatus[orientation][edge];
		status.type = overscrollEffectType;
		status.ratio = ratio;
	}

	function getOverscrollStatus (orientation, edge) {
		return (mutableRef.current.overscrollStatus[orientation][edge]);
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

	function applyOverscrollEffect (orientation, edge, overscrollEffectType, ratio) {
		props.applyOverscrollEffect(orientation, edge, overscrollEffectType, ratio);
		setOverscrollStatus(orientation, edge, overscrollEffectType === overscrollTypeOnce ? overscrollTypeDone : overscrollEffectType, ratio);
	}

	function checkAndApplyOverscrollEffect (orientation, edge, overscrollEffectType, ratio = 1) {
		const
			isVertical = (orientation === 'vertical'),
			curPos = isVertical ? mutableRef.current.scrollTop : mutableRef.current.scrollLeft,
			maxPos = getScrollBounds()[isVertical ? 'maxTop' : 'maxLeft'];

		if (
			scrollMode === 'translate' && (edge === 'before' && curPos <= 0) || (edge === 'after' && curPos >= maxPos) ||
			scrollMode === 'native' && (edge === 'before' && curPos <= 0) || (edge === 'after' && curPos >= maxPos - 1)
		) { // Already on the edge
			applyOverscrollEffect(orientation, edge, overscrollEffectType, ratio);
		} else {
			setOverscrollStatus(orientation, edge, overscrollEffectType, ratio);
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

	function applyOverscrollEffectOnDrag (orientation, edge, targetPosition, overscrollEffectType) {
		if (edge) {
			const
				oppositeEdge = edge === 'before' ? 'after' : 'before',
				ratio = calculateOverscrollRatio(orientation, targetPosition);

			applyOverscrollEffect(orientation, edge, overscrollEffectType, ratio);
			clearOverscrollEffect(orientation, oppositeEdge);
		} else {
			clearOverscrollEffect(orientation, 'before');
			clearOverscrollEffect(orientation, 'after');
		}
	}

	// scrollMode 'native' [[
	function checkAndApplyOverscrollEffectOnDrag (targetX, targetY, overscrollEffectType) {
		const bounds = getScrollBounds();

		if (canScrollHorizontally(bounds)) {
			applyOverscrollEffectOnDrag('horizontal', getEdgeFromPosition(targetX, bounds.maxLeft), targetX, overscrollEffectType);
		}

		if (canScrollVertically(bounds)) {
			applyOverscrollEffectOnDrag('vertical', getEdgeFromPosition(targetY, bounds.maxTop), targetY, overscrollEffectType);
		}
	}
	// scrollMode 'native' ]]

	function checkAndApplyOverscrollEffectOnScroll (orientation) {
		['before', 'after'].forEach((edge) => {
			const {ratio, type: overscrollEffectType} = getOverscrollStatus(orientation, edge);

			if (overscrollEffectType === overscrollTypeOnce) {
				checkAndApplyOverscrollEffect(orientation, edge, overscrollEffectType, ratio);
			}
		});
	}

	function checkAndApplyOverscrollEffectOnStart (orientation, edge, targetPosition) {
		if (mutableRef.current.isDragging) {
			applyOverscrollEffectOnDrag(orientation, edge, targetPosition, overscrollTypeHold);
		} else if (edge) {
			checkAndApplyOverscrollEffect(orientation, edge, overscrollTypeOnce);
		}
	}

	// call scroll callbacks

	// esline-disable-next-line react-hooks/exhaustive-deps
	function forwardScrollEvent (overscrollEffectType, reachedEdgeInfo) {
		forward(overscrollEffectType, {scrollLeft: mutableRef.current.scrollLeft, scrollTop: mutableRef.current.scrollTop, moreInfo: getMoreInfo(), reachedEdgeInfo}, props);
	}

	// scrollMode 'native' [[
	// call scroll callbacks and update scrollbars for native scroll

	function scrollStartOnScroll () {
		mutableRef.current.scrolling = true;
		showThumb(getScrollBounds());
		forwardScrollEvent('onScrollStart');
	}

	function scrollStopOnScroll () {
		if (props.scrollStopOnScroll) {
			props.scrollStopOnScroll();
		}
		if (mutableRef.current.overscrollEnabled && !mutableRef.current.isDragging) { // not check overscrollEffectOn for safety
			clearAllOverscrollEffects();
		}
		mutableRef.current.lastInputType = null;
		mutableRef.current.isScrollAnimationTargetAccumulated = false;
		mutableRef.current.scrolling = false;
		forwardScrollEvent('onScrollStop', getReachedEdgeInfo());
		startHidingThumb();
	}
	// scrollMode 'native' ]]

	// update scroll position

	function setScrollLeft (value) {
		const bounds = getScrollBounds();

		mutableRef.current.scrollLeft = clamp(0, bounds.maxLeft, value);

		if (mutableRef.current.overscrollEnabled && overscrollEffectOn[mutableRef.current.lastInputType]) {
			checkAndApplyOverscrollEffectOnScroll('horizontal');
		}

		if (isHorizontalScrollbarVisible) {
			updateThumb(horizontalScrollbarRef, bounds);
		}
	}

	function setScrollTop (value) {
		const bounds = getScrollBounds();

		mutableRef.current.scrollTop = clamp(0, bounds.maxTop, value);

		if (mutableRef.current.overscrollEnabled && overscrollEffectOn[mutableRef.current.lastInputType]) {
			checkAndApplyOverscrollEffectOnScroll('vertical');
		}

		if (isVerticalScrollbarVisible) {
			updateThumb(verticalScrollbarRef, bounds);
		}
	}

	// esline-disable-next-line react-hooks/exhaustive-deps
	function getReachedEdgeInfo () {
		const
			bounds = getScrollBounds(),
			reachedEdgeInfo = {bottom: false, left: false, right: false, top: false};

		if (canScrollHorizontally(bounds)) {
			const edge = getEdgeFromPosition(mutableRef.current.scrollLeft, bounds.maxLeft);

			if (edge) { // if edge is null, no need to check which edge is reached.
				if ((edge === 'before' && !rtl) || (edge === 'after' && rtl)) {
					reachedEdgeInfo.left = true;
				} else {
					reachedEdgeInfo.right = true;
				}
			}
		}

		if (canScrollVertically(bounds)) {
			const edge = getEdgeFromPosition(mutableRef.current.scrollTop, bounds.maxTop);

			if (edge === 'before') {
				reachedEdgeInfo.top = true;
			} else if (edge === 'after') {
				reachedEdgeInfo.bottom = true;
			}
		}

		return reachedEdgeInfo;
	}

	// scroll start/stop

	// scrollMode 'translate' [[
	function doScrollStop () {
		mutableRef.current.scrolling = false;
		forwardScrollEvent('onScrollStop', getReachedEdgeInfo());
	}
	// scrollMode 'translate' ]]

	function start ({targetX, targetY, animate = true, duration = animationDuration, overscrollEffect = false}) {
		const
			{scrollLeft, scrollTop} = mutableRef.current,
			bounds = getScrollBounds(),
			{maxLeft, maxTop} = bounds;

		const updatedAnimationInfo = scrollMode === 'translate' ?
			{
				sourceX: scrollLeft,
				sourceY: scrollTop,
				targetX,
				targetY,
				duration
			} :
			{
				targetX,
				targetY
			};

		// bail early when scrolling to the same position
		if (
			(scrollMode === 'translate' && mutableRef.current.animator.isAnimating() || scrollMode === 'native' && mutableRef.current.scrolling) &&
			mutableRef.current.animationInfo &&
			mutableRef.current.animationInfo.targetX === targetX &&
			mutableRef.current.animationInfo.targetY === targetY
		) {
			return;
		}

		mutableRef.current.animationInfo = updatedAnimationInfo;

		if (scrollMode === 'translate') {
			mutableRef.current.animator.stop();

			if (!mutableRef.current.scrolling) {
				mutableRef.current.scrolling = true;
				forwardScrollEvent('onScrollStart');
			}

			mutableRef.current.scrollStopJob.stop();
		}

		if (Math.abs(maxLeft - targetX) < epsilon) {
			targetX = maxLeft;
		}

		if (Math.abs(maxTop - targetY) < epsilon) {
			targetY = maxTop;
		}

		if (mutableRef.current.overscrollEnabled && overscrollEffect) {
			if (scrollLeft !== targetX && canScrollHorizontally(bounds)) {
				checkAndApplyOverscrollEffectOnStart('horizontal', getEdgeFromPosition(targetX, maxLeft), targetX);
			}
			if (scrollTop !== targetY && canScrollVertically(bounds)) {
				checkAndApplyOverscrollEffectOnStart('vertical', getEdgeFromPosition(targetY, maxTop), targetY);
			}
		}

		if (scrollMode === 'translate') {
			showThumb(bounds);
			if (scrollContentHandle.current && scrollContentHandle.current.setScrollPositionTarget) {
				scrollContentHandle.current.setScrollPositionTarget(targetX, targetY);
			}

			if (animate) {
				mutableRef.current.animator.animate(scrollAnimation(mutableRef.current.animationInfo));
			} else {
				scroll(targetX, targetY);
				stop();
			}
		} else { // scrollMode 'native'
			if (animate) {
				scrollContentHandle.current.scrollToPosition(targetX, targetY);
			} else {
				scrollContentRef.current.style.scrollBehavior = null;
				scrollContentHandle.current.scrollToPosition(targetX, targetY);
				scrollContentRef.current.style.scrollBehavior = 'smooth';
			}

			mutableRef.current.scrollStopJob.start();

			if (props.start) {
				props.start(animate);
			}
		}
	}

	// scrollMode 'translate' [[
	function scrollAnimation (animationInfo) {
		return (curTime) => {
			const
				{sourceX, sourceY, targetX, targetY, duration} = animationInfo,
				bounds = getScrollBounds();

			if (curTime < duration) {
				let
					toBeContinued = false,
					curTargetX = sourceX,
					curTargetY = sourceY;

				if (canScrollHorizontally(bounds)) {
					curTargetX = mutableRef.current.animator.timingFunction(sourceX, targetX, duration, curTime);

					if (Math.abs(curTargetX - targetX) < epsilon) {
						curTargetX = targetX;
					} else {
						toBeContinued = true;
					}
				}

				if (canScrollVertically(bounds)) {
					curTargetY = mutableRef.current.animator.timingFunction(sourceY, targetY, duration, curTime);

					if (Math.abs(curTargetY - targetY) < epsilon) {
						curTargetY = targetY;
					} else {
						toBeContinued = true;
					}
				}

				scroll(curTargetX, curTargetY);

				if (!toBeContinued) {
					stop();
				}
			} else {
				scroll(targetX, targetY);
				stop();
			}
		};
	}

	function scroll (left, top) {
		if (left !== mutableRef.current.scrollLeft) {
			setScrollLeft(left);
		}

		if (top !== mutableRef.current.scrollTop) {
			setScrollTop(top);
		}

		scrollContentHandle.current.setScrollPosition(mutableRef.current.scrollLeft, mutableRef.current.scrollTop, rtl);
		forwardScrollEvent('onScroll');
	}
	// scrollMode 'translate' ]]

	function stopForTranslate () {
		mutableRef.current.animator.stop();
		mutableRef.current.lastInputType = null;
		mutableRef.current.isScrollAnimationTargetAccumulated = false;
		startHidingThumb();

		if (mutableRef.current.overscrollEnabled && !mutableRef.current.isDragging) { // not check overscrollEffectOn for safety
			clearAllOverscrollEffects();
		}

		if (props.stop) {
			props.stop();
		}

		if (mutableRef.current.scrolling) {
			mutableRef.current.scrollStopJob.start();
		}
	}

	function stopForNative () {
		scrollContentRef.current.style.scrollBehavior = null;
		scrollContentHandle.current.scrollToPosition(mutableRef.current.scrollLeft + 0.1, mutableRef.current.scrollTop + 0.1);
		scrollContentRef.current.style.scrollBehavior = 'smooth';
	}

	// esline-disable-next-line react-hooks/exhaustive-deps
	function stop () {
		if (scrollMode === 'translate') {
			stopForTranslate();
		} else {
			stopForNative();
		}
	}

	// scrollTo API

	function getPositionForScrollTo (opt) {
		const
			bounds = getScrollBounds(),
			canScrollH = canScrollHorizontally(bounds),
			canScrollV = canScrollVertically(bounds);
		let
			itemPos,
			left = null,
			top = null;

		if (opt instanceof Object) {
			if (opt.position instanceof Object) {
				if (canScrollH) {
					// We need '!=' to check if opt.position.x is null or undefined
					left = opt.position.x != null ? opt.position.x : mutableRef.current.scrollLeft;
				} else {
					left = 0;
				}

				if (canScrollV) {
					// We need '!=' to check if opt.position.y is null or undefined
					top = opt.position.y != null ? opt.position.y : mutableRef.current.scrollTop;
				} else {
					top = 0;
				}
			} else if (typeof opt.align === 'string') {
				if (canScrollH) {
					if (opt.align.includes('left')) {
						left = 0;
					} else if (opt.align.includes('right')) {
						left = bounds.maxLeft;
					}
				}

				if (canScrollV) {
					if (opt.align.includes('top')) {
						top = 0;
					} else if (opt.align.includes('bottom')) {
						top = bounds.maxTop;
					}
				}
			} else {
				if (typeof opt.index === 'number' && typeof scrollContentHandle.current.getItemPosition === 'function') {
					itemPos = scrollContentHandle.current.getItemPosition(opt.index, opt.stickTo);
				} else if (opt.node instanceof Object) {
					if (opt.node.nodeType === 1 && typeof scrollContentHandle.current.getNodePosition === 'function') {
						itemPos = scrollContentHandle.current.getNodePosition(opt.node);
					}
				}

				if (itemPos) {
					if (canScrollH) {
						left = itemPos.left;
					}
					if (canScrollV) {
						top = itemPos.top;
					}
				}
			}
		}

		return {left, top};
	}

	// esline-disable-next-line react-hooks/exhaustive-deps
	function scrollTo (opt) {
		if (!mutableRef.current.deferScrollTo) {
			const {left, top} = getPositionForScrollTo(opt);

			if (props.scrollTo) {
				props.scrollTo(opt);
			}

			mutableRef.current.scrollToInfo = null;
			start({
				targetX: (left !== null) ? left : mutableRef.current.scrollLeft,
				targetY: (top !== null) ? top : mutableRef.current.scrollTop,
				animate: opt.animate
			});
		} else {
			mutableRef.current.scrollToInfo = opt;
		}
	}

	function canScrollHorizontally (bounds) {
		return (direction === 'horizontal' || direction === 'both') && (bounds.scrollWidth > bounds.clientWidth) && !isNaN(bounds.scrollWidth);
	}

	function canScrollVertically (bounds) {
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
			scrollLeft: mutableRef.current.scrollLeft,
			scrollTop: mutableRef.current.scrollTop
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

	// esline-disable-next-line react-hooks/exhaustive-deps
	function updateScrollbars () {
		const
			bounds = getScrollBounds(),
			canScrollH = canScrollHorizontally(bounds),
			canScrollV = canScrollVertically(bounds),
			curHorizontalScrollbarVisible = (horizontalScrollbar === 'auto') ? canScrollH : horizontalScrollbar === 'visible',
			curVerticalScrollbarVisible = (verticalScrollbar === 'auto') ? canScrollV : verticalScrollbar === 'visible';

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
			mutableRef.current.deferScrollTo = false;
			mutableRef.current.isUpdatedScrollThumb = updateScrollThumbSize();
		}
	}

	// esline-disable-next-line react-hooks/exhaustive-deps
	function updateScrollThumbSize () {
		const
			bounds = getScrollBounds(),
			canScrollH = canScrollHorizontally(bounds),
			canScrollV = canScrollVertically(bounds),
			curHorizontalScrollbarVisible = (horizontalScrollbar === 'auto') ? canScrollH : horizontalScrollbar === 'visible',
			curVerticalScrollbarVisible = (verticalScrollbar === 'auto') ? canScrollV : verticalScrollbar === 'visible';

		if (curHorizontalScrollbarVisible || curVerticalScrollbarVisible) {
			// no visibility change but need to notify whichever scrollbars are visible of the
			// updated bounds and scroll position
			const updatedBounds = {
				...bounds,
				scrollLeft: mutableRef.current.scrollLeft,
				scrollTop: mutableRef.current.scrollTop
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
		if (scrollContentHandle.current && typeof scrollContentHandle.current.getScrollBounds === 'function') {
			return scrollContentHandle.current.getScrollBounds();
		}
	}

	function getMoreInfo () {
		if (scrollContentHandle.current && typeof scrollContentHandle.current.getMoreInfo === 'function') {
			return scrollContentHandle.current.getMoreInfo();
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	function addEventListeners () {
		utilEvent('wheel').addEventListener(scrollContainerRef, onWheel);
		utilEvent('keydown').addEventListener(scrollContainerRef, onKeyDown);
		utilEvent('mousedown').addEventListener(scrollContainerRef, onMouseDown);

		// scrollMode 'native' [[
		if (scrollMode === 'native' && scrollContentRef.current) {
			utilEvent('scroll').addEventListener(scrollContentRef, onScroll, {passive: true});
			scrollContentRef.current.style.scrollBehavior = 'smooth';
		}
		// scrollMode 'native' ]]

		if (props.addEventListeners) {
			props.addEventListeners(scrollContentRef);
		}

		if (window) {
			utilEvent('resize').addEventListener(window, handleResizeWindow);
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	function removeEventListeners () {
		utilEvent('wheel').removeEventListener(scrollContainerRef, onWheel);
		utilEvent('keydown').removeEventListener(scrollContainerRef, onKeyDown);
		utilEvent('mousedown').removeEventListener(scrollContainerRef, onMouseDown);

		// scrollMode 'native' [[
		utilEvent('scroll').removeEventListener(scrollContentRef, onScroll, {passive: true});
		// scrollMode 'native' ]]

		if (props.removeEventListeners) {
			props.removeEventListeners(scrollContentRef);
		}

		utilEvent('resize').removeEventListener(window, handleResizeWindow);
	}

	// render

	// scrollMode 'translate' [[
	function handleScroll () {
		// Prevent scroll by focus.
		// VirtualList and VirtualGridList DO NOT receive `onscroll` event.
		// Only Scroller could get `onscroll` event.
		if (!mutableRef.current.animator.isAnimating() && scrollContentHandle.current && scrollContentRef.current && scrollContentHandle.current.getRtlPositionX) {
			// For Scroller
			scrollContentRef.current.scrollTop = mutableRef.current.scrollTop;
			scrollContentRef.current.scrollLeft = scrollContentHandle.current.getRtlPositionX(mutableRef.current.scrollLeft);
		}
	}
	// scrollMode 'translate' ]]

	function scrollContainerContainsDangerously (target) {
		return utilDOM.containsDangerously(scrollContainerRef, target);
	}

	assignProperties('scrollContainerProps', {
		...rest,
		className: [scrollClasses]
	});

	assignProperties('scrollInnerContainerProps', {
		className: [css.scrollInnerContainer]
	});

	assignProperties('scrollContentWrapperProps', {
		className: scrollMode === 'translate' ? [css.scrollContentWrapper] : [css.scrollContentWrapper, css.scrollContentWrapperNative], // scrollMode 'native'
		...(!noScrollByDrag && {
			flickConfig,
			onDrag: onDrag,
			onDragEnd: onDragEnd,
			onDragStart: onDragStart,
			onFlick: onFlick,
			onTouchStart: scrollMode === 'native' ? onTouchStart : null // scrollMode 'native'
		})
	});

	const scrollContentProps = props.itemRenderer ? // If the child component is a VirtualList
		{
			childProps,
			clientSize,
			'data-webos-voice-disabled': voiceDisabled,
			'data-webos-voice-focused': voiceFocused,
			'data-webos-voice-group-label': voiceGroupLabel,
			dataSize,
			itemRenderer,
			itemSize,
			itemSizes,
			overhang,
			pageScroll,
			spacing,
			wrap
		} :
		{children};

	assignProperties('scrollContentProps', {
		...scrollContentProps,
		cbScrollTo: scrollTo,
		className: [css.scrollFill],
		direction,
		get isHorizontalScrollbarVisible () {
			return isHorizontalScrollbarVisible;
		},
		get isVerticalScrollbarVisible () {
			return isVerticalScrollbarVisible;
		},
		onScroll: scrollMode === 'translate' ? handleScroll : null,
		rtl,
		scrollContainerContainsDangerously,
		scrollMode
	});

	assignProperties('verticalScrollbarProps', {
		clientSize,
		disabled: !isVerticalScrollbarVisible,
		rtl,
		vertical: true
	});

	assignProperties('horizontalScrollbarProps', {
		clientSize,
		corner: isVerticalScrollbarVisible,
		disabled: !isHorizontalScrollbarVisible,
		rtl,
		vertical: false
	});

	assignProperties('resizeContextProps', {
		value: mutableRef.current.resizeRegistry.register
	});

	mutableRef.current.deferScrollTo = true;

	mutableRef.current.prevState = {
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible
	};

	return {
		scrollContentWrapper: noScrollByDrag ? 'div' : TouchableDiv,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible
	};
};

const assignPropertiesOf = (instance) => (name, properties) => {
	if (!instance[name]) {
		instance[name] = {};
	}

	if (typeof properties === 'object') {
		for (const property in properties) {
			if (property === 'className') {
				warning(
					Array.isArray(properties.className),
					'Unsupported other types for `className` prop except Array'
				);

				instance[name].className = classNames(instance[name].className, properties.className);
			} else {
				warning(
					!instance[name][property],
					'Unsupported to push value in the same ' + property + ' prop.'
				);

				// Override the previous value.
				instance[name][property] = properties[property];
			}
		}
	}
};

const useScroll = (props) => {
	// Mutable value

	const scrollContainerRef = useRef({});
	const scrollContentHandle = useRef({});
	const scrollContentRef = useRef({});
	const itemRefs = useRef([]);
	const horizontalScrollbarRef = useRef({});
	const verticalScrollbarRef = useRef({});

	// Hooks

	const
		collectionOfProperties = {},
		assignProperties = assignPropertiesOf(collectionOfProperties);

	const {
		scrollContentWrapper,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible
	} = useScrollBase({
		...props,
		assignProperties,
		horizontalScrollbarRef,
		scrollContainerRef,
		scrollContentHandle,
		scrollContentRef,
		verticalScrollbarRef
	});

	assignProperties('scrollContainerProps', {ref: scrollContainerRef});
	assignProperties('scrollContentProps', {
		...(props.itemRenderer ? {itemRefs} : {}),
		scrollContentRef
	});
	assignProperties('verticalScrollbarProps', {ref: verticalScrollbarRef});
	assignProperties('horizontalScrollbarProps', {ref: horizontalScrollbarRef});

	// Return

	return {
		...collectionOfProperties,
		scrollContentWrapper,
		scrollContentHandle,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible
	};
};

export default useScroll;
export {
	assignPropertiesOf,
	constants,
	useScroll,
	useScrollBase
};
