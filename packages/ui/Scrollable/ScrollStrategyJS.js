import clamp from 'ramda/src/clamp';
import hoc from '@enact/core/hoc';
import React, {Component} from 'react';

import ri from '../resolution';

import constants from './constants';

const
	{
		isPageDown,
		isPageUp,
		scrollWheelPageMultiplierForMaxPixel
	} = constants;

const ScrollStrategyJS = hoc((config, Wrapped) => {
	return class extends Component {
		static displayName = 'ScrollStrategyJS'

		wheelDirection = 0

		scrollToAccumulatedTarget = (delta, vertical) => {
			if (!this.isScrollAnimationTargetAccumulated) {
				this.accumulatedTargetX = this.scrollLeft;
				this.accumulatedTargetY = this.scrollTop;
				this.isScrollAnimationTargetAccumulated = true;
			}

			if (vertical) {
				this.accumulatedTargetY = this.accumulatedTargetY + delta;
			} else {
				this.accumulatedTargetX = this.accumulatedTargetX + delta;
			}

			this.start({
				targetX: this.accumulatedTargetX,
				targetY: this.accumulatedTargetY,
				animate: true
			});
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

		onWheel = (e) => {
			e.preventDefault();
			if (!this.props.dragging) {
				const
					bounds = this.getScrollBounds(),
					canScrollHorizontally = this.canScrollHorizontally(bounds),
					canScrollVertically = this.canScrollVertically(bounds),
					eventDeltaMode = e.deltaMode,
					eventDelta = (-e.wheelDeltaY || e.deltaY);
				let
					delta = 0,
					direction;

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

				if (delta !== 0) {
					this.scrollToAccumulatedTarget(delta, canScrollVertically);
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
				pageDistance = isPageUp(keyCode) ? (this.pageDistance * -1) : this.pageDistance;

			this.scrollToAccumulatedTarget(pageDistance, canScrollVertically);
		}

		onKeyDown = (e) => {
			if ((isPageUp(e.keyCode) || isPageDown(e.keyCode)) && !e.repeat) {
				this.scrollByPage(e.keyCode);
			}
		}

		render () {
			return <Wrapped {...this.props} />;
		}
	};
});

export default ScrollStrategyJS;
export {
	ScrollStrategyJS
};
