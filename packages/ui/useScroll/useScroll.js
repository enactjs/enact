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
import useClass from '@enact/core/useClass';
import {Job} from '@enact/core/util';
import clamp from 'ramda/src/clamp';
import React, {useCallback, useContext, useEffect, useLayoutEffect, useReducer, useRef, useState} from 'react';
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

const TouchableDiv = ForwardRef({prop: 'componentRef'}, Touchable(
	({componentRef, ...rest}) => (<div {...rest} ref={componentRef} />)
));

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
	const {
		horizontalScrollbar,
		rtl,
		setScrollContainerHandle,
		verticalScrollbar,
	} = props;

	// Mutable value and Hooks

	const scrollBase = useClass(ScrollBase);

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
		isUpdatedScrollbarTrack: false,

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

	scrollBase.setPropsAndContext(props, {
		forceUpdate,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible,
		mutableRef,
		setIsHorizontalScrollbarVisible,
		setIsVerticalScrollbarVisible
	});

	if (mutableRef.current.animator == null) {
		mutableRef.current.animator = new ScrollAnimator();
	}

	useLayoutEffect(() => {
		if (setScrollContainerHandle) {
			setScrollContainerHandle({
				animator: mutableRef.current.animator,
				applyOverscrollEffect: scrollBase.applyOverscrollEffect,
				bounds: mutableRef.current.bounds,
				calculateDistanceByWheel: scrollBase.calculateDistanceByWheel,
				canScrollHorizontally: scrollBase.canScrollHorizontally,
				canScrollVertically: scrollBase.canScrollVertically,
				checkAndApplyOverscrollEffect: scrollBase.checkAndApplyOverscrollEffect,
				getScrollBounds: scrollBase.getScrollBounds,
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
				get isUpdatedScrollbarTrack () {
					return mutableRef.current.isUpdatedScrollbarTrack;
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
					return scrollBase.getScrollBounds();
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
				scrollTo: scrollBase.scrollTo,
				scrollToAccumulatedTarget: scrollBase.scrollToAccumulatedTarget,
				get scrollToInfo () {
					return mutableRef.current.scrollToInfo;
				},
				get scrollTop () {
					return mutableRef.current.scrollTop;
				},
				setOverscrollStatus: scrollBase.setOverscrollStatus,
				showScrollbarTrack: scrollBase.showScrollbarTrack,
				start: scrollBase.start,
				startHidingScrollbarTrack: scrollBase.startHidingScrollbarTrack,
				stop: scrollBase.stop,
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
				scrollBase.forwardScrollEvent('onScrollStop', scrollBase.getReachedEdgeInfo());
			}

			// FIXME: scrollStopJob.stop();

			// scrollMode 'translate' [
			if (animator.isAnimating()) {
				animator.stop();
			}
			// scrollMode 'translate' ]
		};

	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		scrollBase.addEventListeners();
		return () => {
			scrollBase.removeEventListeners();
		};
	});

	if (mutableRef.current.resizeRegistry == null) {
		mutableRef.current.resizeRegistry = Registry.create(scrollBase.handleResize);
	}

	useEffect(scrollBase.didUpdate); // esline-disable-next-line react-hooks/exhaustive-deps

	return scrollBase.render();
};

class ScrollBase {
	setPropsAndContext (props, context) {
		this.props = props;
		this.context = context;
	}

	// scrollMode 'translate' [[
	// TODO: consider replacing forceUpdate() by storing bounds in state rather than a non-
	// state member.
	enqueueForceUpdate () {
		const {scrollContentHandle} = this.props;

		scrollContentHandle.current.calculateMetrics(scrollContentHandle.current.props);
		this.context.forceUpdate();
	}

	handleResizeWindow = () => {
		const {propsHandleResizeWindow, scrollContentRef} = this.props;

		// `handleSize` in `ui/resolution.ResolutionDecorator` should be executed first.
		setTimeout(() => {
			if (propsHandleResizeWindow) {
				propsHandleResizeWindow();
			}
			if (this.props.scrollMode === 'translate') {
				this.scrollTo({position: {x: 0, y: 0}, animate: false});
			} else {
				scrollContentRef.current.style.scrollBehavior = null;
				this.props.scrollContentHandle.current.scrollToPosition(0, 0);
				scrollContentRef.current.style.scrollBehavior = 'smooth';
			}

			this.enqueueForceUpdate();
		});
	} // esline-disable-line react-hooks/exhaustive-deps

	handleResize = (ev) => {
		if (ev.action === 'invalidateBounds') {
			this.enqueueForceUpdate();
		}
	}
	// scrollMode 'translate' ]]

	// FIXME:
	// if (mutableRef.current.resizeRegistry == null) {
	// 	mutableRef.current.resizeRegistry = Registry.create(this.handleResize);
	// }

	didUpdate = () => {
		const ref = this.context.mutableRef.current;

		if (this.props.scrollMode === 'translate') {
			ref.scrollStopJob = new Job(this.doScrollStop, scrollStopWaiting);
		} else {
			ref.scrollStopJob = new Job(this.scrollStopOnScroll, scrollStopWaiting);
		}

		// return () => {
		// 	ref.scrollStopJob.stop();
		// };

		const
			{scrollContentHandle} = this.props,
			{hasDataSizeChanged} = scrollContentHandle.current,
			{prevState, resizeRegistry, scrollToInfo} = this.context.mutableRef.current;

		// Need to sync calculated client size if it is different from the real size
		if (scrollContentHandle.current.syncClientSize) {
			// If we actually synced, we need to reset scroll position.
			if (scrollContentHandle.current.syncClientSize()) {
				this.setScrollLeft(0);
				this.setScrollTop(0);
			}
		}

		this.clampScrollPosition(); // scrollMode 'translate'

		if (
			hasDataSizeChanged === false &&
			(this.context.isHorizontalScrollbarVisible && !prevState.isHorizontalScrollbarVisible || this.context.isVerticalScrollbarVisible && !prevState.isVerticalScrollbarVisible)
		) {
			this.context.mutableRef.current.deferScrollTo = false;
			this.context.mutableRef.current.isUpdatedScrollbarTrack = this.updateScrollbarTrackSize();
		} else {
			this.updateScrollbars();
		}

		if (scrollToInfo !== null) {
			if (!this.context.mutableRef.current.deferScrollTo) {
				this.scrollTo(scrollToInfo);
			}
		}

		// publish container resize changes
		const horizontal = this.context.isHorizontalScrollbarVisible !== prevState.isHorizontalScrollbarVisible;
		const vertical = this.context.isVerticalScrollbarVisible !== prevState.isVerticalScrollbarVisible;
		if (horizontal || vertical) {
			resizeRegistry.notify({});
		}

		return () => {
			ref.scrollStopJob.stop();
		};
	}

	// scrollMode 'translate' [[
	clampScrollPosition () {
		const bounds = this.getScrollBounds();

		if (this.context.mutableRef.current.scrollTop > bounds.maxTop) {
			this.context.mutableRef.current.scrollTop = bounds.maxTop;
		}

		if (this.context.mutableRef.current.scrollLeft > bounds.maxLeft) {
			this.context.mutableRef.current.scrollLeft = bounds.maxLeft;
		}
	}
	// scrollMode 'translate' ]]

	// drag/flick event handlers

	getRtlX (x) {
		return (this.props.rtl ? -x : x);
	}

	onMouseDown = (ev) => {
		if (forwardWithPrevent('onMouseDown', ev, this.props)) {
			this.stop();
		}
	} // esline-disable-next-line react-hooks/exhaustive-deps

	// scrollMode 'native' [[
	onTouchStart = () =>{
		this.context.mutableRef.current.isTouching = true;
	}
	// scrollMode 'native' ]]

	onDragStart = (ev) => {
		if (this.props.scrollMode === 'translate' ) {
			if (ev.type === 'dragstart') return;

			forward('onDragStart', ev, this.props);
			this.stop();
			this.context.mutableRef.current.isDragging = true;
			this.context.mutableRef.current.dragStartX = this.context.mutableRef.current.scrollLeft + this.getRtlX(ev.x);
			this.context.mutableRef.current.dragStartY = this.context.mutableRef.current.scrollTop + ev.y;
		} else {
			if (!this.context.mutableRef.current.isTouching) {
				this.stop();
				this.context.mutableRef.current.isDragging = true;
			}

			// these values are used also for touch inputs
			this.context.mutableRef.current.dragStartX = this.context.mutableRef.current.scrollLeft + this.getRtlX(ev.x);
			this.context.mutableRef.current.dragStartY = this.context.mutableRef.current.scrollTop + ev.y;
		}
	}

	onDrag = (ev) => {
		const {direction, overscrollEffectOn} = this.props;

		if (this.props.scrollMode === 'translate') {
			if (ev.type === 'drag') {
				return;
			}

			this.context.mutableRef.current.lastInputType = 'drag';

			forward('onDrag', ev, this.props);
			this.start({
				targetX: (direction === 'vertical') ? 0 : this.context.mutableRef.current.dragStartX - this.getRtlX(ev.x), // 'horizontal' or 'both'
				targetY: (direction === 'horizontal') ? 0 : this.context.mutableRef.current.dragStartY - ev.y, // 'vertical' or 'both'
				animate: false,
				overscrollEffect: overscrollEffectOn && overscrollEffectOn.drag
			});
		} else {
			const
				targetX = (direction === 'vertical') ? 0 : this.context.mutableRef.current.dragStartX - this.getRtlX(ev.x), // 'horizontal' or 'both'
				targetY = (direction === 'horizontal') ? 0 : this.context.mutableRef.current.dragStartY - ev.y; // 'vertical' or 'both'

			this.context.mutableRef.current.lastInputType = 'drag';

			if (!this.context.mutableRef.current.isTouching) {
				this.start({targetX, targetY, animate: false, overscrollEffect: overscrollEffectOn && overscrollEffectOn.drag});
			} else if (this.context.mutableRef.current.overscrollEnabled && overscrollEffectOn && overscrollEffectOn.drag) {
				this.checkAndApplyOverscrollEffectOnDrag(targetX, targetY, overscrollTypeHold);
			}
		}
	}

	onDragEnd = (ev) => {
		const {overscrollEffectOn} = this.props;

		if (this.props.scrollMode === 'translate') {
			if (ev.type === 'dragend') {
				return;
			}

			this.context.mutableRef.current.isDragging = false;

			forward('onDragEnd', ev, this.props);
			if (this.context.mutableRef.current.flickTarget) {
				const {targetX, targetY, duration} = this.context.mutableRef.current.flickTarget;

				this.context.mutableRef.current.lastInputType = 'drag';

				this.context.mutableRef.current.isScrollAnimationTargetAccumulated = false;
				this.start({targetX, targetY, duration, overscrollEffect: overscrollEffectOn && overscrollEffectOn.drag});
			} else {
				this.stop();
			}

			if (this.context.mutableRef.current.overscrollEnabled) { // not check overscrollEffectOn && overscrollEffectOn.drag for safety
				this.clearAllOverscrollEffects();
			}

			this.context.mutableRef.current.flickTarget = null;
		} else {
			this.context.mutableRef.current.isDragging = false;

			this.context.mutableRef.current.lastInputType = 'drag';

			if (this.context.mutableRef.current.flickTarget) {
				const {targetX, targetY} = this.context.mutableRef.current.flickTarget;

				if (!this.context.mutableRef.current.isTouching) {
					this.context.mutableRef.current.isScrollAnimationTargetAccumulated = false;
					this.start({targetX, targetY, overscrollEffect: overscrollEffectOn && overscrollEffectOn.drag});
				} else if (this.context.mutableRef.current.overscrollEnabled && overscrollEffectOn && overscrollEffectOn.drag) {
					this.checkAndApplyOverscrollEffectOnDrag(targetX, targetY, overscrollTypeOnce);
				}
			} else if (!this.context.mutableRef.current.isTouching) {
				this.stop();
			}

			if (this.context.mutableRef.current.overscrollEnabled) { // not check overscrollEffectOn && overscrollEffectOn.drag for safety
				this.clearAllOverscrollEffects();
			}

			this.context.mutableRef.current.isTouching = false;
			this.context.mutableRef.current.flickTarget = null;
		}
	}

	onFlick = (ev) => {
		const {direction, overscrollEffectOn, scrollMode} = this.props;

		if (scrollMode === 'translate') {
			this.context.mutableRef.current.flickTarget = this.context.mutableRef.current.animator.simulate(
				this.context.mutableRef.current.scrollLeft,
				this.context.mutableRef.current.scrollTop,
				(direction !== 'vertical') ? this.getRtlX(-ev.velocityX) : 0,
				(direction !== 'horizontal') ? -ev.velocityY : 0
			);
		} else if (scrollMode === 'native') {
			if (!this.context.mutableRef.current.isTouching) {
				this.context.mutableRef.current.flickTarget = this.context.mutableRef.current.animator.simulate(
					this.context.mutableRef.current.scrollLeft,
					this.context.mutableRef.current.scrollTop,
					(direction !== 'vertical') ? this.getRtlX(-ev.velocityX) : 0,
					(direction !== 'horizontal') ? -ev.velocityY : 0
				);
			} else if (this.context.mutableRef.current.overscrollEnabled && overscrollEffectOn && overscrollEffectOn.drag) {
				this.context.mutableRef.current.flickTarget = {
					targetX: this.context.mutableRef.current.scrollLeft + this.getRtlX(-ev.velocityX) * overscrollVelocityFactor, // 'horizontal' or 'both'
					targetY: this.context.mutableRef.current.scrollTop + -ev.velocityY * overscrollVelocityFactor // 'vertical' or 'both'
				};
			}
		}

		if (this.props.onFlick) {
			forward('onFlick', ev, this.props);
		}
	}

	calculateDistanceByWheel = (deltaMode, delta, maxPixel) => {
		if (deltaMode === 0) {
			delta = clamp(-maxPixel, maxPixel, ri.scale(delta * this.context.mutableRef.current.scrollWheelMultiplierForDeltaPixel));
		} else if (deltaMode === 1) { // line; firefox
			delta = clamp(-maxPixel, maxPixel, ri.scale(delta * this.context.mutableRef.current.pixelPerLine * this.context.mutableRef.current.scrollWheelMultiplierForDeltaPixel));
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
	onWheel = (ev) => {
		if (this.context.mutableRef.current.isDragging) {
			ev.preventDefault();
			ev.stopPropagation();
		} else {
			const
				{horizontalScrollbarHandle, overscrollEffectOn, scrollMode, verticalScrollbarHandle} = this.props,
				bounds = this.getScrollBounds(),
				canScrollH = this.canScrollHorizontally(bounds),
				canScrollV = this.canScrollVertically(bounds),
				eventDeltaMode = ev.deltaMode,
				eventDelta = (-ev.wheelDeltaY || ev.deltaY);
			let delta = 0;

			this.context.mutableRef.current.lastInputType = 'wheel';

			if (this.props.noScrollByWheel) {
				if (scrollMode === 'native' && canScrollV) {
					ev.preventDefault();
				}

				return;
			}

			if (scrollMode === 'translate') {
				if (canScrollV) {
					delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientHeight * scrollWheelPageMultiplierForMaxPixel);
				} else if (canScrollH) {
					delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientWidth * scrollWheelPageMultiplierForMaxPixel);
				}

				const dir = Math.sign(delta);

				if (dir !== this.context.mutableRef.current.wheelDirection) {
					this.context.mutableRef.current.isScrollAnimationTargetAccumulated = false;
					this.context.mutableRef.current.wheelDirection = dir;
				}

				forward('onWheel', {delta, horizontalScrollbarHandle, verticalScrollbarHandle}, this.props);

				if (delta !== 0) {
					this.scrollToAccumulatedTarget(delta, canScrollV, overscrollEffectOn && overscrollEffectOn.wheel);
					ev.preventDefault();
					ev.stopPropagation();
				}
			} else { // scrollMode 'native'
				const overscrollEffectRequired = this.context.mutableRef.current.overscrollEnabled && overscrollEffectOn && overscrollEffectOn.wheel;
				let needToHideScrollbarTrack = false;

				if (this.props.onWheel) {
					forward('onWheel', ev, this.props);
					return;
				}

				this.canScrollVertically(bounds);

				// FIXME This routine is a temporary support for horizontal wheel scroll.
				// FIXME If web engine supports horizontal wheel, this routine should be refined or removed.
				if (canScrollV) { // This routine handles wheel events on scrollbars for vertical scroll.
					if (eventDelta < 0 && this.context.mutableRef.current.scrollTop > 0 || eventDelta > 0 && this.context.mutableRef.current.scrollTop < bounds.maxTop) {
						// Not to check if ev.target is a descendant of a wrapped component which may have a lot of nodes in it.
						if (
							horizontalScrollbarHandle.current && horizontalScrollbarHandle.current.getContainerRef && utilDOM.containsDangerously(horizontalScrollbarHandle.current.getContainerRef(), ev.target) ||
							verticalScrollbarHandle.current && verticalScrollbarHandle.current.getContainerRef && utilDOM.containsDangerously(verticalScrollbarHandle.current.getContainerRef(), ev.target)
						) {
							delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientHeight * scrollWheelPageMultiplierForMaxPixel);
							needToHideScrollbarTrack = !delta;

							ev.preventDefault();
						} else if (overscrollEffectRequired) {
							this.checkAndApplyOverscrollEffect('vertical', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce);
						}

						ev.stopPropagation();
					} else {
						if (overscrollEffectRequired && (eventDelta < 0 && this.context.mutableRef.current.scrollTop <= 0 || eventDelta > 0 && this.context.mutableRef.current.scrollTop >= bounds.maxTop)) {
							this.applyOverscrollEffect('vertical', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce, 1);
						}

						needToHideScrollbarTrack = true;
					}
				} else if (canScrollH) { // this routine handles wheel events on any children for horizontal scroll.
					if (eventDelta < 0 && this.context.mutableRef.current.scrollLeft > 0 || eventDelta > 0 && this.context.mutableRef.current.scrollLeft < bounds.maxLeft) {
						delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientWidth * scrollWheelPageMultiplierForMaxPixel);
						needToHideScrollbarTrack = !delta;

						ev.preventDefault();
						ev.stopPropagation();
					} else {
						if (overscrollEffectRequired && (eventDelta < 0 && this.context.mutableRef.current.scrollLeft <= 0 || eventDelta > 0 && this.context.mutableRef.current.scrollLeft >= bounds.maxLeft)) {
							this.applyOverscrollEffect('horizontal', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce, 1);
						}

						needToHideScrollbarTrack = true;
					}
				}

				if (delta !== 0) {
					const dir = Math.sign(delta);

					// Not to accumulate scroll position if wheel direction is different from hold direction
					if (dir !== this.context.mutableRef.current.wheelDirection) {
						this.context.mutableRef.current.isScrollAnimationTargetAccumulated = false;
						this.context.mutableRef.current.wheelDirection = dir;
					}

					this.scrollToAccumulatedTarget(delta, canScrollV, overscrollEffectOn && overscrollEffectOn.wheel);
				}

				if (needToHideScrollbarTrack) {
					this.startHidingScrollbarTrack();
				}
			}
		}
	}

	// scrollMode 'translate' [[
	scrollByPage (keyCode) {
		const
			{overscrollEffectOn} = this.props,
			bounds = this.getScrollBounds(),
			canScrollV = this.canScrollVertically(bounds),
			pageDistance = (isPageUp(keyCode) ? -1 : 1) * (canScrollV ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier;

		this.context.mutableRef.current.lastInputType = 'pageKey';

		this.scrollToAccumulatedTarget(pageDistance, canScrollV, overscrollEffectOn && overscrollEffectOn.pageKey);
	}
	// scrollMode 'translate' ]]

	// scrollMode 'native' [[
	// esline-disable-next-line react-hooks/exhaustive-deps
	onScroll = (ev) => {
		let {scrollLeft, scrollTop} = ev.target;

		const
			{scrollContentHandle} = this.props,
			bounds = this.getScrollBounds(),
			canScrollH = this.canScrollHorizontally(bounds);

		if (!this.context.mutableRef.current.scrolling) {
			this.scrollStartOnScroll();
		}

		if (this.props.rtl && canScrollH) {
			scrollLeft = (platform.ios || platform.safari) ? -scrollLeft : bounds.maxLeft - scrollLeft;
		}

		if (scrollLeft !== this.context.mutableRef.current.scrollLeft) {
			this.setScrollLeft(scrollLeft);
		}
		if (scrollTop !== this.context.mutableRef.current.scrollTop) {
			this.setScrollTop(scrollTop);
		}

		if (scrollContentHandle.current.didScroll) {
			scrollContentHandle.current.didScroll(this.context.mutableRef.current.scrollLeft, this.context.mutableRef.current.scrollTop);
		}

		this.forwardScrollEvent('onScroll');
		this.context.mutableRef.current.scrollStopJob.start();
	}
	// scrollMode 'native' ]]

	onKeyDown = (ev) => {
		if (this.props.scrollMode === 'translate') {
			if (this.props.onKeyDown) {
				forward('onKeyDown', ev, this.props);
			} else if ((isPageUp(ev.keyCode) || isPageDown(ev.keyCode))) {
				this.scrollByPage(ev.keyCode);
			}
		} else {
			forward('onKeyDown', ev, this.props);
		}
	} // esline-disable-line react-hooks/exhaustive-deps

	scrollToAccumulatedTarget = (delta, vertical, overscrollEffect) => {
		if (!this.context.mutableRef.current.isScrollAnimationTargetAccumulated) {
			this.context.mutableRef.current.accumulatedTargetX = this.context.mutableRef.current.scrollLeft;
			this.context.mutableRef.current.accumulatedTargetY = this.context.mutableRef.current.scrollTop;
			this.context.mutableRef.current.isScrollAnimationTargetAccumulated = true;
		}

		if (vertical) {
			this.context.mutableRef.current.accumulatedTargetY += delta;
		} else {
			this.context.mutableRef.current.accumulatedTargetX += delta;
		}

		this.start({targetX: this.context.mutableRef.current.accumulatedTargetX, targetY: this.context.mutableRef.current.accumulatedTargetY, overscrollEffect});
	}

	// overscroll effect

	getEdgeFromPosition (position, maxPosition) {
		const {scrollMode} = this.props;

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

	setOverscrollStatus = (orientation, edge, overscrollEffectType, ratio) => {
		const status = this.context.mutableRef.current.overscrollStatus[orientation][edge];
		status.type = overscrollEffectType;
		status.ratio = ratio;
	}

	getOverscrollStatus (orientation, edge) {
		return (this.context.mutableRef.current.overscrollStatus[orientation][edge]);
	}

	calculateOverscrollRatio (orientation, position) {
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

	applyOverscrollEffect = (orientation, edge, overscrollEffectType, ratio) => {
		this.props.applyOverscrollEffect(orientation, edge, overscrollEffectType, ratio);
		this.setOverscrollStatus(orientation, edge, overscrollEffectType === overscrollTypeOnce ? overscrollTypeDone : overscrollEffectType, ratio);
	}

	checkAndApplyOverscrollEffect = (orientation, edge, overscrollEffectType, ratio = 1) => {
		const
			{scrollMode} = this.props,
			isVertical = (orientation === 'vertical'),
			curPos = isVertical ? this.context.mutableRef.current.scrollTop : this.context.mutableRef.current.scrollLeft,
			maxPos = this.getScrollBounds()[isVertical ? 'maxTop' : 'maxLeft'];

		if (
			scrollMode === 'translate' && (edge === 'before' && curPos <= 0) || (edge === 'after' && curPos >= maxPos) ||
			scrollMode === 'native' && (edge === 'before' && curPos <= 0) || (edge === 'after' && curPos >= maxPos - 1)
		) { // Already on the edge
			this.applyOverscrollEffect(orientation, edge, overscrollEffectType, ratio);
		} else {
			this.setOverscrollStatus(orientation, edge, overscrollEffectType, ratio);
		}
	}

	clearOverscrollEffect (orientation, edge) {
		if (this.getOverscrollStatus(orientation, edge).type !== overscrollTypeNone) {
			if (this.props.clearOverscrollEffect) {
				this.props.clearOverscrollEffect(orientation, edge);
			} else {
				this.applyOverscrollEffect(orientation, edge, overscrollTypeNone, 0);
			}
		}
	}

	clearAllOverscrollEffects () {
		['horizontal', 'vertical'].forEach((orientation) => {
			['before', 'after'].forEach((edge) => {
				this.clearOverscrollEffect(orientation, edge);
			});
		});
	}

	applyOverscrollEffectOnDrag (orientation, edge, targetPosition, overscrollEffectType) {
		if (edge) {
			const
				oppositeEdge = edge === 'before' ? 'after' : 'before',
				ratio = this.calculateOverscrollRatio(orientation, targetPosition);

			this.applyOverscrollEffect(orientation, edge, overscrollEffectType, ratio);
			this.clearOverscrollEffect(orientation, oppositeEdge);
		} else {
			this.clearOverscrollEffect(orientation, 'before');
			this.clearOverscrollEffect(orientation, 'after');
		}
	}

	// scrollMode 'native' [[
	checkAndApplyOverscrollEffectOnDrag (targetX, targetY, overscrollEffectType) {
		const bounds = this.getScrollBounds();

		if (this.canScrollHorizontally(bounds)) {
			this.applyOverscrollEffectOnDrag('horizontal', this.getEdgeFromPosition(targetX, bounds.maxLeft), targetX, overscrollEffectType);
		}

		if (this.canScrollVertically(bounds)) {
			this.applyOverscrollEffectOnDrag('vertical', this.getEdgeFromPosition(targetY, bounds.maxTop), targetY, overscrollEffectType);
		}
	}
	// scrollMode 'native' ]]

	checkAndApplyOverscrollEffectOnScroll (orientation) {
		['before', 'after'].forEach((edge) => {
			const {ratio, type: overscrollEffectType} = this.getOverscrollStatus(orientation, edge);

			if (overscrollEffectType === overscrollTypeOnce) {
				this.checkAndApplyOverscrollEffect(orientation, edge, overscrollEffectType, ratio);
			}
		});
	}

	checkAndApplyOverscrollEffectOnStart (orientation, edge, targetPosition) {
		if (this.context.mutableRef.current.isDragging) {
			this.applyOverscrollEffectOnDrag(orientation, edge, targetPosition, overscrollTypeHold);
		} else if (edge) {
			this.checkAndApplyOverscrollEffect(orientation, edge, overscrollTypeOnce);
		}
	}

	// call scroll callbacks

	// esline-disable-next-line react-hooks/exhaustive-deps
	forwardScrollEvent (overscrollEffectType, reachedEdgeInfo) {
		forward(overscrollEffectType, {scrollLeft: this.context.mutableRef.current.scrollLeft, scrollTop: this.context.mutableRef.current.scrollTop, moreInfo: this.getMoreInfo(), reachedEdgeInfo}, this.props);
	}

	// scrollMode 'native' [[
	// call scroll callbacks and update scrollbars for native scroll

	scrollStartOnScroll () {
		this.context.mutableRef.current.scrolling = true;
		this.canScrollVertically(this.getScrollBounds());
		this.forwardScrollEvent('onScrollStart');
	}

	scrollStopOnScroll = () => {
		if (this.props.scrollStopOnScroll) {
			this.props.scrollStopOnScroll();
		}
		if (this.context.mutableRef.current.overscrollEnabled && !this.context.mutableRef.current.isDragging) { // not check overscrollEffectOn && overscrollEffectOn for safety
			this.clearAllOverscrollEffects();
		}
		this.context.mutableRef.current.lastInputType = null;
		this.context.mutableRef.current.isScrollAnimationTargetAccumulated = false;
		this.context.mutableRef.current.scrolling = false;
		this.forwardScrollEvent('onScrollStop', this.getReachedEdgeInfo());
		this.startHidingScrollbarTrack();
	}
	// scrollMode 'native' ]]

	// update scroll position

	setScrollLeft (value) {
		const
			{overscrollEffectOn} = this.props,
			bounds = this.getScrollBounds();

		this.context.mutableRef.current.scrollLeft = clamp(0, bounds.maxLeft, value);

		if (this.context.mutableRef.current.overscrollEnabled && overscrollEffectOn && overscrollEffectOn[this.context.mutableRef.current.lastInputType]) {
			this.checkAndApplyOverscrollEffectOnScroll('horizontal');
		}

		if (this.context.isHorizontalScrollbarVisible) {
			this.updateScrollbarTrack(this.props.horizontalScrollbarHandle, bounds);
		}
	}

	setScrollTop (value) {
		const
			{overscrollEffectOn} = this.props,
			bounds = this.getScrollBounds();

		this.context.mutableRef.current.scrollTop = clamp(0, bounds.maxTop, value);

		if (this.context.mutableRef.current.overscrollEnabled && overscrollEffectOn && overscrollEffectOn[this.context.mutableRef.current.lastInputType]) {
			this.checkAndApplyOverscrollEffectOnScroll('vertical');
		}

		if (this.context.isVerticalScrollbarVisible) {
			this.updateScrollbarTrack(this.props.verticalScrollbarHandle, bounds);
		}
	}

	// esline-disable-next-line react-hooks/exhaustive-deps
	getReachedEdgeInfo () {
		const
			{rtl} = this.props,
			bounds = this.getScrollBounds(),
			reachedEdgeInfo = {bottom: false, left: false, right: false, top: false};

		if (this.canScrollHorizontally(bounds)) {
			const edge = this.getEdgeFromPosition(this.context.mutableRef.current.scrollLeft, bounds.maxLeft);

			if (edge) { // if edge is null, no need to check which edge is reached.
				if ((edge === 'before' && !rtl) || (edge === 'after' && rtl)) {
					reachedEdgeInfo.left = true;
				} else {
					reachedEdgeInfo.right = true;
				}
			}
		}

		if (this.canScrollVertically(bounds)) {
			const edge = this.getEdgeFromPosition(this.context.mutableRef.current.scrollTop, bounds.maxTop);

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
	doScrollStop () {
		this.context.mutableRef.current.scrolling = false;
		this.forwardScrollEvent('onScrollStop', this.getReachedEdgeInfo());
	}
	// scrollMode 'translate' ]]

	start = ({targetX, targetY, animate = true, duration = animationDuration, overscrollEffect = false}) => {
		const
			{scrollContentHandle, scrollContentRef, scrollMode} = this.props,
			{scrollLeft, scrollTop} = this.context.mutableRef.current,
			bounds = this.getScrollBounds(),
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
			(scrollMode === 'translate' && this.context.mutableRef.current.animator.isAnimating() || scrollMode === 'native' && this.context.mutableRef.current.scrolling) &&
			this.context.mutableRef.current.animationInfo &&
			this.context.mutableRef.current.animationInfo.targetX === targetX &&
			this.context.mutableRef.current.animationInfo.targetY === targetY
		) {
			return;
		}

		this.context.mutableRef.current.animationInfo = updatedAnimationInfo;

		if (scrollMode === 'translate') {
			this.context.mutableRef.current.animator.stop();

			if (!this.context.mutableRef.current.scrolling) {
				this.context.mutableRef.current.scrolling = true;
				this.forwardScrollEvent('onScrollStart');
			}

			this.context.mutableRef.current.scrollStopJob.stop();
		}

		if (Math.abs(maxLeft - targetX) < epsilon) {
			targetX = maxLeft;
		}

		if (Math.abs(maxTop - targetY) < epsilon) {
			targetY = maxTop;
		}

		if (this.context.mutableRef.current.overscrollEnabled && overscrollEffect) {
			if (scrollLeft !== targetX && this.canScrollHorizontally(bounds)) {
				this.checkAndApplyOverscrollEffectOnStart('horizontal', this.getEdgeFromPosition(targetX, maxLeft), targetX);
			}
			if (scrollTop !== targetY && this.canScrollVertically(bounds)) {
				this.checkAndApplyOverscrollEffectOnStart('vertical', this.getEdgeFromPosition(targetY, maxTop), targetY);
			}
		}

		if (scrollMode === 'translate') {
			this.canScrollVertically(bounds);
			if (scrollContentHandle.current && scrollContentHandle.current.setScrollPositionTarget) {
				scrollContentHandle.current.setScrollPositionTarget(targetX, targetY);
			}

			if (animate) {
				this.context.mutableRef.current.animator.animate(this.scrollAnimation(this.context.mutableRef.current.animationInfo));
			} else {
				this.scroll(targetX, targetY);
				this.stop();
			}
		} else { // scrollMode 'native'
			if (animate) {
				scrollContentHandle.current.scrollToPosition(targetX, targetY);
			} else {
				scrollContentRef.current.style.scrollBehavior = null;
				scrollContentHandle.current.scrollToPosition(targetX, targetY);
				scrollContentRef.current.style.scrollBehavior = 'smooth';
			}

			this.context.mutableRef.current.scrollStopJob.start();

			if (this.props.start) {
				this.props.start(animate);
			}
		}
	}

	// scrollMode 'translate' [[
	scrollAnimation (animationInfo) {
		return (curTime) => {
			const
				{sourceX, sourceY, targetX, targetY, duration} = animationInfo,
				bounds = this.getScrollBounds();

			if (curTime < duration) {
				let
					toBeContinued = false,
					curTargetX = sourceX,
					curTargetY = sourceY;

				if (this.canScrollHorizontally(bounds)) {
					curTargetX = this.context.mutableRef.current.animator.timingFunction(sourceX, targetX, duration, curTime);

					if (Math.abs(curTargetX - targetX) < epsilon) {
						curTargetX = targetX;
					} else {
						toBeContinued = true;
					}
				}

				if (this.canScrollVertically(bounds)) {
					curTargetY = this.context.mutableRef.current.animator.timingFunction(sourceY, targetY, duration, curTime);

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
		};
	}

	scroll (left, top) {
		if (left !== this.context.mutableRef.current.scrollLeft) {
			this.setScrollLeft(left);
		}

		if (top !== this.context.mutableRef.current.scrollTop) {
			this.setScrollTop(top);
		}

		this.props.scrollContentHandle.current.setScrollPosition(this.context.mutableRef.current.scrollLeft, this.context.mutableRef.current.scrollTop, this.props.rtl);
		this.forwardScrollEvent('onScroll');
	}
	// scrollMode 'translate' ]]

	stopForTranslate () {
		this.context.mutableRef.current.animator.stop();
		this.context.mutableRef.current.lastInputType = null;
		this.context.mutableRef.current.isScrollAnimationTargetAccumulated = false;
		this.startHidingScrollbarTrack();

		if (this.context.mutableRef.current.overscrollEnabled && !this.context.mutableRef.current.isDragging) { // not check overscrollEffectOn && overscrollEffectOn for safety
			this.clearAllOverscrollEffects();
		}

		if (this.props.stop) {
			this.props.stop();
		}

		if (this.context.mutableRef.current.scrolling) {
			this.context.mutableRef.current.scrollStopJob.start();
		}
	}

	stopForNative () {
		const {scrollContentRef} = this.props;

		scrollContentRef.current.style.scrollBehavior = null;
		this.props.scrollContentHandle.current.scrollToPosition(this.context.mutableRef.current.scrollLeft + 0.1, this.context.mutableRef.current.scrollTop + 0.1);
		scrollContentRef.current.style.scrollBehavior = 'smooth';
	}

	// esline-disable-next-line react-hooks/exhaustive-deps
	stop = () => {
		if (this.props.scrollMode === 'translate') {
			this.stopForTranslate();
		} else {
			this.stopForNative();
		}
	}

	// scrollTo API

	getPositionForScrollTo (opt) {
		const
			{scrollContentHandle} = this.props,
			bounds = this.getScrollBounds(),
			canScrollH = this.canScrollHorizontally(bounds),
			canScrollV = this.canScrollVertically(bounds);
		let
			itemPos,
			left = null,
			top = null;

		if (opt instanceof Object) {
			if (opt.position instanceof Object) {
				if (canScrollH) {
					// We need '!=' to check if opt.position.x is null or undefined
					left = opt.position.x != null ? opt.position.x : this.context.mutableRef.current.scrollLeft;
				} else {
					left = 0;
				}

				if (canScrollV) {
					// We need '!=' to check if opt.position.y is null or undefined
					top = opt.position.y != null ? opt.position.y : this.context.mutableRef.current.scrollTop;
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
					itemPos = scrollContentHandle.current.getItemPosition(opt.index, opt.stickTo, opt.offset);
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
	scrollTo = (opt) => {
		if (!this.context.mutableRef.current.deferScrollTo) {
			const {left, top} = this.getPositionForScrollTo(opt);

			if (this.props.scrollTo) {
				this.props.scrollTo(opt);
			}

			this.context.mutableRef.current.scrollToInfo = null;
			this.start({
				targetX: (left !== null) ? left : this.context.mutableRef.current.scrollLeft,
				targetY: (top !== null) ? top : this.context.mutableRef.current.scrollTop,
				animate: opt.animate
			});
		} else {
			this.context.mutableRef.current.scrollToInfo = opt;
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

	showScrollbarTrack = (bounds) => {
		const {horizontalScrollbarHandle, verticalScrollbarHandle} = this.props;

		if (this.context.isHorizontalScrollbarVisible && this.canScrollHorizontally(bounds) && horizontalScrollbarHandle.current) {
			horizontalScrollbarHandle.current.showScrollbarTrack();
		}

		if (this.context.isVerticalScrollbarVisible && this.canScrollVertically(bounds) && verticalScrollbarHandle.current) {
			verticalScrollbarHandle.current.showScrollbarTrack();
		}
	}

	updateScrollbarTrack (scrollbarRef, bounds) {
		scrollbarRef.current.update({
			...bounds,
			scrollLeft: this.context.mutableRef.current.scrollLeft,
			scrollTop: this.context.mutableRef.current.scrollTop
		});
	}

	startHidingScrollbarTrack = () => {
		const {horizontalScrollbarHandle, verticalScrollbarHandle} = this.props;

		if (this.context.isHorizontalScrollbarVisible && horizontalScrollbarHandle.current) {
			horizontalScrollbarHandle.current.startHidingScrollbarTrack();
		}

		if (this.context.isVerticalScrollbarVisible && verticalScrollbarHandle.current) {
			verticalScrollbarHandle.current.startHidingScrollbarTrack();
		}
	}

	// esline-disable-next-line react-hooks/exhaustive-deps
	updateScrollbars () {
		const
			{verticalScrollbar} = this.props,
			bounds = this.getScrollBounds(),
			canScrollH = this.canScrollHorizontally(bounds),
			canScrollV = this.canScrollVertically(bounds),
			curHorizontalScrollbarVisible = (this.props.horizontalScrollbar === 'auto') ? canScrollH : this.props.horizontalScrollbar === 'visible',
			curVerticalScrollbarVisible = (verticalScrollbar === 'auto') ? canScrollV : verticalScrollbar === 'visible';

		// determine if we should hide or show any scrollbars
		const
			isVisibilityChanged = (
				this.context.isHorizontalScrollbarVisible !== curHorizontalScrollbarVisible ||
				this.context.isVerticalScrollbarVisible !== curVerticalScrollbarVisible
			);

		if (isVisibilityChanged) {
			// one or both scrollbars have changed visibility
			this.context.setIsHorizontalScrollbarVisible(curHorizontalScrollbarVisible);
			this.context.setIsVerticalScrollbarVisible(curVerticalScrollbarVisible);
		} else {
			this.context.mutableRef.current.deferScrollTo = false;
			this.context.mutableRef.current.isUpdatedScrollbarTrack = this.updateScrollbarTrackSize();
		}
	}

	// esline-disable-next-line react-hooks/exhaustive-deps
	updateScrollbarTrackSize () {
		const
			{horizontalScrollbarHandle, verticalScrollbar, verticalScrollbarHandle} = this.props,
			bounds = this.getScrollBounds(),
			canScrollH = this.canScrollHorizontally(bounds),
			canScrollV = this.canScrollVertically(bounds),
			curHorizontalScrollbarVisible = (this.props.horizontalScrollbar === 'auto') ? canScrollH : this.props.horizontalScrollbar === 'visible',
			curVerticalScrollbarVisible = (verticalScrollbar === 'auto') ? canScrollV : verticalScrollbar === 'visible';

		if (curHorizontalScrollbarVisible || curVerticalScrollbarVisible) {
			// no visibility change but need to notify whichever scrollbars are visible of the
			// updated bounds and scroll position
			const updatedBounds = {
				...bounds,
				scrollLeft: this.context.mutableRef.current.scrollLeft,
				scrollTop: this.context.mutableRef.current.scrollTop
			};

			if (curHorizontalScrollbarVisible && horizontalScrollbarHandle.current) {
				horizontalScrollbarHandle.current.update(updatedBounds);
			}

			if (curVerticalScrollbarVisible && verticalScrollbarHandle.current) {
				verticalScrollbarHandle.current.update(updatedBounds);
			}

			return true;
		}

		return false;
	}

	// ref

	getScrollBounds = () => {
		const {scrollContentHandle} = this.props;
		if (scrollContentHandle.current && typeof scrollContentHandle.current.getScrollBounds === 'function') {
			return scrollContentHandle.current.getScrollBounds();
		}
	}

	getMoreInfo = () => {
		const {scrollContentHandle} = this.props;
		if (scrollContentHandle.current && typeof scrollContentHandle.current.getMoreInfo === 'function') {
			return scrollContentHandle.current.getMoreInfo();
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	addEventListeners () {
		const {scrollContainerRef, scrollContentRef} = this.props;

		utilEvent('wheel').addEventListener(scrollContainerRef, this.onWheel);
		utilEvent('keydown').addEventListener(scrollContainerRef, this.onKeyDown);
		utilEvent('mousedown').addEventListener(scrollContainerRef, this.onMouseDown);

		// scrollMode 'native' [[
		if (this.props.scrollMode === 'native' && scrollContentRef.current) {
			utilEvent('scroll').addEventListener(scrollContentRef, this.onScroll, {passive: true});
			scrollContentRef.current.style.scrollBehavior = 'smooth';
		}
		// scrollMode 'native' ]]

		if (this.props.addEventListeners) {
			this.props.addEventListeners(scrollContentRef);
		}

		if (window) {
			utilEvent('resize').addEventListener(window, this.handleResizeWindow);
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	removeEventListeners () {
		const {scrollContainerRef, scrollContentRef} = this.props;

		utilEvent('wheel').removeEventListener(scrollContainerRef, this.onWheel);
		utilEvent('keydown').removeEventListener(scrollContainerRef, this.onKeyDown);
		utilEvent('mousedown').removeEventListener(scrollContainerRef, this.onMouseDown);

		// scrollMode 'native' [[
		utilEvent('scroll').removeEventListener(scrollContentRef, this.onScroll, {passive: true});
		// scrollMode 'native' ]]

		if (this.props.removeEventListeners) {
			this.props.removeEventListeners(scrollContentRef);
		}

		utilEvent('resize').removeEventListener(window, this.handleResizeWindow);
	}

	// render

	// scrollMode 'translate' [[
	handleScroll () {
		const {scrollContentHandle, scrollContentRef} = this.props;

		// Prevent scroll by focus.
		// VirtualList and VirtualGridList DO NOT receive `onscroll` event.
		// Only Scroller could get `onscroll` event.
		if (!this.context.mutableRef.current.animator.isAnimating() && scrollContentHandle.current && scrollContentRef.current && scrollContentHandle.current.getRtlPositionX) {
			// For Scroller
			scrollContentRef.current.scrollTop = this.context.mutableRef.current.scrollTop;
			scrollContentRef.current.scrollLeft = scrollContentHandle.current.getRtlPositionX(this.context.mutableRef.current.scrollLeft);
		}
	}
	// scrollMode 'translate' ]]

	scrollContainerContainsDangerously (target) {
		return utilDOM.containsDangerously(this.props.scrollContainerRef, target);
	}

	render () {

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
			horizontalScrollbarHandle,
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
			verticalScrollbarHandle,
			wrap,
			...rest
		} = this.props,
		{
			isHorizontalScrollbarVisible,
			isVerticalScrollbarVisible
		} = this.context,
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
			onDrag: this.onDrag,
			onDragEnd: this.onDragEnd,
			onDragStart: this.onDragStart,
			onFlick: this.onFlick,
			onTouchStart: scrollMode === 'native' ? this.onTouchStart : null // scrollMode 'native'
		})
	});

	const scrollContentProps = this.props.itemRenderer ? // If the child component is a VirtualList
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
			return isHorizontalScrollbarVisible
		},
		get isVerticalScrollbarVisible () {
			return isVerticalScrollbarVisible;
		},
		onScroll: scrollMode === 'translate' ? this.handleScroll : null,
		rtl,
		scrollContainerContainsDangerously: this.scrollContainerContainsDangerously,
		scrollMode
	});

	assignProperties('verticalScrollbarProps', {
		clientSize,
		disabled: !this.context.isVerticalScrollbarVisible,
		rtl,
		vertical: true
	});

	assignProperties('horizontalScrollbarProps', {
		clientSize,
		corner: this.context.isVerticalScrollbarVisible,
		disabled: !this.context.isHorizontalScrollbarVisible,
		rtl,
		vertical: false
	});

	assignProperties('resizeContextProps', {
		value: this.context.mutableRef.current.resizeRegistry.register
	});

	this.context.mutableRef.current.deferScrollTo = true;

	this.context.mutableRef.current.prevState = {
		isHorizontalScrollbarVisible: this.context.isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible: this.context.isVerticalScrollbarVisible
	};

	return {
		scrollContentWrapper: noScrollByDrag ? 'div' : TouchableDiv,
		isHorizontalScrollbarVisible: this.context.isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible: this.context.isVerticalScrollbarVisible
	};

	}
}

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
	const horizontalScrollbarHandle = useRef({});
	const verticalScrollbarHandle = useRef({});

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
		horizontalScrollbarHandle,
		scrollContainerRef,
		scrollContentHandle,
		scrollContentRef,
		verticalScrollbarHandle
	});

	assignProperties('scrollContainerProps', {ref: scrollContainerRef});
	assignProperties('scrollContentProps', {
		...(props.itemRenderer ? {itemRefs} : {}),
		scrollContentRef
	});
	assignProperties('verticalScrollbarProps', {scrollbarHandle: verticalScrollbarHandle});
	assignProperties('horizontalScrollbarProps', {scrollbarHandle: horizontalScrollbarHandle});

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
