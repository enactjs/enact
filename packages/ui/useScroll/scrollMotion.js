/**
 * Optional scroll-motion timing for `useScroll`.
 *
 * A theme passes `getScrollMotion`, which returns `{delay, duration, ease}` from its motion
 * tokens. Every animated scroll that does not already have its own duration (a flick) or a
 * shortened repeat (a held key) uses that timing. Translate mode eases through `timingFunction`;
 * native mode interpolates and applies each frame with an instant `scrollTo`, so the browser's
 * own smooth-scroll timing is not used.
 *
 * @module ui/useScroll/scrollMotion
 * @private
 */

const clampProgress = (progress) => Math.min(Math.max(progress, 0), 1);

// Matches ScrollAnimator: a held key scrolls linearly, a single step uses the curve.
const createTimingFunction = (ease) => (source, target, duration, curTime, keyPressed) => {
	if (!duration) return target;

	const progress = keyPressed ? curTime / duration : ease(clampProgress(curTime / duration));
	return (target - source) * progress + source;
};

/**
 * Resolves the motion for one `start()`. An explicit duration, a held key, or a key repeat keeps
 * the scroller's existing timing, so flicks and key-repeat stay short.
 *
 * @param   {Object}    options
 * @param   {Number}    [options.duration]         Duration passed to `start`, when the caller set one.
 * @param   {Boolean}   [options.keyPressed]       Whether a key is being held.
 * @param   {Boolean}   [options.repeat]           Whether this scroll is a key repeat.
 * @param   {Function}  [options.getScrollMotion]  Theme getter, called at scroll start.
 * @returns {Object|null}                          `{delay, duration, ease, timingFunction}`, or `null`.
 * @private
 */
const resolveScrollMotion = ({duration, keyPressed, repeat, getScrollMotion} = {}) => {
	if (duration != null || keyPressed || repeat || typeof getScrollMotion !== 'function') return null;

	const motion = getScrollMotion();
	if (!motion || typeof motion.duration !== 'number' || typeof motion.ease !== 'function') return null;

	return {
		delay: motion.delay > 0 ? motion.delay : 0,
		duration: motion.duration,
		ease: motion.ease,
		timingFunction: createTimingFunction(motion.ease)
	};
};

/**
 * Stops a delayed or in-progress motion scroll. Safe to call when nothing is running.
 *
 * @param {Object} state  The scroller's mutable state.
 * @private
 */
const cancelScrollMotion = (state) => {
	if (!state) return;

	if (state.motionDelay) {
		clearTimeout(state.motionDelay);
		state.motionDelay = null;
	}

	if (state.motionFrame) {
		window.cancelAnimationFrame(state.motionFrame);
		state.motionFrame = null;
	}

	state.motionAnimating = false;
};

/**
 * Animates a native scroll in logical coordinates. `scrollTo` must apply RTL itself.
 * `motionAnimating` is cleared before the final position so the resulting `scrollend` is accepted.
 *
 * @param {Object}   state
 * @param {Object}   animation
 * @param {Number}   animation.fromX
 * @param {Number}   animation.fromY
 * @param {Number}   animation.toX
 * @param {Number}   animation.toY
 * @param {Number}   animation.duration
 * @param {Function} animation.ease
 * @param {Function} animation.scrollTo
 * @private
 */
const startNativeScroll = (state, {fromX, fromY, toX, toY, duration, ease, scrollTo}) => {
	cancelScrollMotion(state);

	if (fromX === toX && fromY === toY) return;

	const startTime = performance.now();
	let frameId = 0;

	const step = (now) => {
		if (state.motionFrame !== frameId) return;

		const elapsed = now - startTime;
		const t = duration > 0 ? Math.min(elapsed / duration, 1) : 1;

		if (t < 1) {
			const progress = ease(t);
			scrollTo(
				fromX + (toX - fromX) * progress,
				fromY + (toY - fromY) * progress
			);
			frameId = window.requestAnimationFrame(step);
			state.motionFrame = frameId;
			return;
		}

		state.motionFrame = null;
		state.motionAnimating = false;
		scrollTo(toX, toY);
	};

	state.motionAnimating = true;
	frameId = window.requestAnimationFrame(step);
	state.motionFrame = frameId;
};

export {
	cancelScrollMotion,
	resolveScrollMotion,
	startNativeScroll
};
