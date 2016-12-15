/**
 * Exports the {@link moonstone/Scroller/ScrollAnimator.ScrollAnimator} component.
 *
 * @module moonstone/Scroller/ScrollAnimator
 * @private
 */

import clamp from 'ramda/src/clamp';

const
	// Use eases library
	timingFunctions = {
		'linear': function (source, target, duration, curTime) {
			curTime /= duration;
			return (target - source) * curTime + source;
		},
		'ease-in': function (source, target, duration, curTime) {
			curTime /= duration;
			return (target - source) * curTime * curTime * curTime * curTime + source;
		},
		'ease-out': function (source, target, duration, curTime) {
			curTime /= duration;
			curTime--;
			return (target - source) * (curTime * curTime * curTime * curTime * curTime + 1) + source;
		},
		'ease-in-out': function (source, target, duration, curTime) {
			curTime /= duration / 2;
			if (curTime < 1) {
				return (target - source) / 2 * curTime * curTime * curTime * curTime + source;
			} else {
				curTime -= 2;
			}
			return (source - target) / 2 * (curTime * curTime * curTime * curTime - 2) + source;
		}
	},

	// for simulate()
	frameTime = 16.0,         // time for one frame
	maxVelocity = 100,        // speed cap
	stopVelocity = 0.04,      // velocity to stop
	velocityFriction = 0.95,  // velocity decreasing factor
	clampVelocity = clamp(-maxVelocity, maxVelocity),

	// These guards probably aren't necessary because there shouldn't be any scrolling occurring
	// in isomorphic mode.
	rAF = (typeof window === 'object') ? window.requestAnimationFrame : function () {},
	cAF = (typeof window === 'object') ? window.cancelAnimationFrame : function () {},
	perf = (typeof window === 'object') ? window.performance : {now: Date.now};

/**
 * {@link moonstone/Scroller/ScrollAnimator.ScrollAnimator} is the class
 * to scroll a list or a scroller with animation.
 *
 * @class ScrollAnimator
 * @memberof moonstone/Scroller/ScrollAnimator
 * @public
 */
class ScrollAnimator {
	rAFId = null
	type = 'ease-out'

	/**
	 * @param {String|null} type - Timing function type for list scroll animation.  Must be one of
	 *	`'linear'`, `'ease-in'`, `'ease-out'`, or `'ease-in-out'`, or null. If `null`, defaults to
	 *	`'ease-out'`.
	 * @constructor
	 * @memberof moonstone/Scroller/ScrollAnimator.ScrollAnimator
	 */
	constructor (type) {
		this.timingFunction = timingFunctions[type || this.type];
	}

	simulate (sourceX, sourceY, velocityX, velocityY) {
		let
			stepX = clampVelocity(velocityX * frameTime),
			stepY = clampVelocity(velocityY * frameTime),
			deltaX = 0,
			deltaY = 0,
			duration = 0;

		do {
			stepX *= velocityFriction;
			stepY *= velocityFriction;
			deltaX += stepX;
			deltaY += stepY;
			duration += frameTime;
		} while ((stepX * stepX + stepY * stepY) > stopVelocity);

		return {
			targetX: sourceX + deltaX,
			targetY: sourceY + deltaY,
			duration
		};
	}

	animate (rAFCallbackFuntion) {
		const
			startTimeStamp = perf.now(),
			fn = () => {
				const
					// schedule next frame
					rAFId = rAF(fn),
					// current timestamp
					curTimeStamp = perf.now(),
					// current time if 0 at starting position
					curTime = curTimeStamp - startTimeStamp;

				this.rAFId = rAFId;
				rAFCallbackFuntion(curTime);
			};

		this.rAFId = rAF(fn);
	}

	stop () {
		if (this.rAFId !== null ) {
			cAF(this.rAFId);
			this.rAFId = null;
		}
	}
}

export default ScrollAnimator;
export {ScrollAnimator};
