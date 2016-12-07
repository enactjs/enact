/**
 * Exports the {@link moonstone/Scroller/ScrollAnimator.ScrollAnimator} component.
 *
 * @module moonstone/Scroller/ScrollAnimator
 * @private
 */

import clamp from 'ramda/src/clamp';
import curry from 'ramda/src/curry';

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
	timingFunction = 'ease-out'

	/**
	 * @param {String|null} timingFunction - Timing function to use for animation.  Must be one of
	 *	`'linear'`, `'ease-in'`, `'ease-out'`, or `'ease-in-out'`, or null. If `null`, defaults to
	 *	`'ease-out'`.
	 * @constructor
	 */
	constructor (timingFunction) {
		this.timingFunction = timingFunction || this.timingFunction;
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

	animate (cbScrollAnimationRaf) {
		const
			// start timestamp
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
				cbScrollAnimationRaf(curTime);
			};

		this.rAFId = rAF(fn);
	}

	/**
	 * Start an animation
	 *
	 * ```
	 * let animator = new ScrollAnimator();
	 *
	 * animator.start({
	 * 	sourceX: this.scrollLeft,
	 * 	sourceY: this.scrollTop,
	 * 	targetX: this.scrollLeft + 100,
	 * 	targetY: this.scrollTop + 100,
	 * 	duration: 500
	 * });
	 * ```
	 *
	 * @param {Object} options - Animation options
	 * @param {Number} options.sourceX - source absolute position x
	 * @param {Number} options.sourceY - source absolute position y
	 * @param {Number} options.targetX - target absolute position x
	 * @param {Number} options.targetY - target absolute position y
	 * @param {Number} options.duration - the duration to move to the target
	 * @param {Function} options.cbScrollAnimationHandler - A method to call for each animation
	 * @returns {undefined}
	 * @public
	 */
	start ({
		sourceX, sourceY,
		targetX, targetY,
		duration = 500,
		cbScrollAnimationHandler
	}) {
		// Rather than calling back to cbScrollAnimationHandler so it can call this.animate, start
		// should probably make the first animate call. Also, seems odd to take an object,
		// deconstruct it only to create new objects to pass to the callback which it immediately
		// deconstructs again. In general, I'm not sure it's necessary for the animator to know
		// start/end values. It is simpler to let it only be concerned with managing the rAF and
		// the easing functions over a duration. The Scrollable can then calculate its scroll
		// position based on its internal start/end data.
		cbScrollAnimationHandler(
			{sourceX, sourceY},
			{targetX, targetY, duration},
			{
				// Curry these at create time. Alternatively, since you have a known usage, you can
				// create your own pseudo-curried versions and skip the ramda dependency.
				// (sourceX, targetX, duration) => (currentTime) => { /* function body */ }
				calcPosX: curry(timingFunctions[this.timingFunction])(sourceX, targetX, duration),
				calcPosY: curry(timingFunctions[this.timingFunction])(sourceY, targetY, duration)
			}
		);
	}

	/**
	 * Stop an animation
	 * @returns {undefined}
	 * @public
	 */
	stop () {
		if (this.rAFId !== null ) {
			cAF(this.rAFId);
			this.rAFId = null;
		}
	}
}

export default ScrollAnimator;
export {ScrollAnimator};
