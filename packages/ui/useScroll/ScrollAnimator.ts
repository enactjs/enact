import {perfNow} from '@enact/core/util';
import clamp from 'ramda/src/clamp';

import utilAnimation from './utilAnimation';
import {Callback} from '../types';

export type TimingFunctionType = 'linear' | 'ease-in' | 'ease-out' | 'ease-out-cubic' | 'ease-in-out';
export type TimingFunction = Record<TimingFunctionType, Callback<number, number>>

const
	// Use eases library
	timingFunctions: TimingFunction = {
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
		'ease-out-cubic': function (source, target, duration, curTime, keyPressed) {
			if (keyPressed) {
				curTime /= duration;
				return (target - source) * curTime + source;
			}

			curTime /= duration;
			return (target - source) * utilAnimation(0.1, 0.6, 0.15, 1).cubicBezier(curTime) + source;
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
	clampVelocity = clamp(-maxVelocity, maxVelocity);

/**
 * The class to scroll a list or a scroller with animation.
 *
 * @class ScrollAnimator
 * @memberof ui/useScroll
 * @private
 */
class ScrollAnimator {
	rAFId: number | null = null;
	type: TimingFunctionType = 'ease-out-cubic';
	timingFunction: Callback<number, number>;

	/**
	 * @param {String|null} type - Timing function type for list scroll animation.  Must be one of
	 *	`'linear'`, `'ease-in'`, `'ease-out'`, `'ease-out-cubic'`, or `'ease-in-out'`, or null. If `null`, defaults to
	 *	`'ease-out'`.
	 * @constructor
	 * @memberof ui/useScroll.ScrollAnimator
	 */
	constructor (type?: TimingFunctionType) {
		this.timingFunction = timingFunctions[type || this.type];
	}

	simulate (sourceX: number, sourceY: number, velocityX: number, velocityY: number) {
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

	animate (rAFCallbackFunction: Callback) {
		const
			rAF = window.requestAnimationFrame,
			startTimeStamp = perfNow(),
			fn = () => {
				const
					// schedule next frame
					rAFId = rAF(fn),
					// current timestamp
					curTimeStamp = perfNow(),
					// current time if 0 at starting position
					curTime = curTimeStamp - startTimeStamp;

				this.rAFId = rAFId;
				rAFCallbackFunction(curTime);
			};

		this.rAFId = rAF(fn);
	}

	isAnimating () {
		return this.rAFId !== null;
	}

	stop () {
		const cAF = window.cancelAnimationFrame;

		if (this.rAFId !== null ) {
			cAF(this.rAFId);
			this.rAFId = null;
		}
	}
}

export default ScrollAnimator;
export {
	ScrollAnimator
};
