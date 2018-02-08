import hoc from '@enact/core/hoc';
import React, {Component} from 'react';

import ri from '../resolution';

import constants from './constants';

const
	{
		epsilon,
		isPageDown,
		isPageUp,
		nop,
		paginationPageMultiplier,
		scrollWheelPageMultiplierForMaxPixel
	} = constants;

const ScrollStrategyNative = hoc((config, Wrapped) => {
	return class extends Component {
		static displayName = 'ScrollStrategyNative'

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

		onMouseDown = () => {
			this.isScrollAnimationTargetAccumulated = false;
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
				delta = 0,
				needToHideThumb = false;

			if (typeof window !== 'undefined') {
				window.document.activeElement.blur();
			}

			this.showThumb(bounds);

			// FIXME This routine is a temporary support for horizontal wheel scroll.
			// FIXME If web engine supports horizontal wheel, this routine should be refined or removed.
			if (canScrollVertically) { // This routine handles wheel events on scrollbars for vertical scroll.
				if (eventDelta < 0 && this.scrollTop > 0 || eventDelta > 0 && this.scrollTop < bounds.maxTop) {
					const {horizontalScrollbarRef, verticalScrollbarRef} = this;

					// Not to check if e.target is a descendant of a wrapped component which may have a lot of nodes in it.
					if ((horizontalScrollbarRef && horizontalScrollbarRef.containerRef.contains(e.target)) ||
						(verticalScrollbarRef && verticalScrollbarRef.containerRef.contains(e.target))) {
						delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientHeight * scrollWheelPageMultiplierForMaxPixel);
						needToHideThumb = !delta;
					}
				} else {
					needToHideThumb = true;
				}
			} else if (canScrollHorizontally) { // this routine handles wheel events on any children for horizontal scroll.
				if (eventDelta < 0 && this.scrollLeft > 0 || eventDelta > 0 && this.scrollLeft < bounds.maxLeft) {
					delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientWidth * scrollWheelPageMultiplierForMaxPixel);
					needToHideThumb = !delta;
				} else {
					needToHideThumb = true;
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

			if (needToHideThumb) {
				this.startHidingThumb();
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

		render () {
			return <Wrapped {...this.props} />;
		}
	};
});

export default ScrollStrategyNative;
export {
	ScrollStrategyNative
};
