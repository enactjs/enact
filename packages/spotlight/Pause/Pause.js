/**
 * Provides a class which allows consumers to safely pause and resume spotlight without resuming
 * another consumer's pause.
 *
 * When multiple components attempt to pause and resume spotlight at overlapping times using
 * [Spotlight.pause()]{@link spotlight.Spotlight.pause} and
 * [Spotlight.resume()]{@link spotlight.Spotlight.resume}, one component might resume spotlight when
 * another expected it to still be paused.
 *
 * `Pause` helps to address this by setting a "soft lock" on the pause which informs other instances
 * that the spotlight pause state is being controlled. When pause is locked, it can only be resumed
 * by the instance that locked it. Subsequent calls to `pause` and `resume` on another instance of
 * `Pause` have no effect.
 *
 * *Note:* The top-level [Spotlight.pause()]{@link spotlight.Spotlight.pause} and
 * [Spotlight.resume()]{@link spotlight.Spotlight.resume} do not respect the pause locks and act as
 * a user-space escape hatch.
 *
 * ```
 * import Pause from '@enact/spotlight/Pause';
 *
 * const paused1 = new Pause('paused 1');
 * const paused2 = new Pause('paused 2');
 *
 * // pauses spotlight
 * paused1.pause();
 *
 * // has no effect because pause1 is in control
 * paused2.pause();
 *
 * // has no effect because pause1 is in control
 * paused2.resume();
 *
 * // resumes spotlight
 * paused1.resume();
 *
 * ```
 *
 * @module spotlight/Pause
 */

let paused = false;

// Private, exported methods used by Spotlight to set and query the pause state from its public API

function pause () {
	paused = true;
}

function resume () {
	paused = false;
}

function isPaused () {
	return paused !== false;
}

/**
 * Acts as a semaphore for Spotlight pause state ensuring that only the last Pause instance can
 * resume Spotlight.
 *
 * *Note* {@link spotlight/Spotlight.resume} will always resume spotlight regardless of what last
 * paused spotlight and can be used as an escape hatch to force resumption.
 *
 * @class Pause
 * @memberof spotlight/Pause
 * @public
 */
class Pause {

	/**
	 * Accepts a name for the instance
	 *
	 * The `name` is not used but may be useful for debugging which instance has currently paused
	 * Spotlight.
	 *
	 * @param {String} name The name of the pause instance
	 * @memberof spotlight/Pause.Pause.prototype
	 * @constructor
	 * @public
	 */
	constructor (name) {
		this.name = name;
	}

	toString () {
		return `Pause<${this.name}>`;
	}

	/**
	 * Returns `true` when Spotlight is paused by this instance
	 *
	 * @returns {Boolean}
	 * @memberof spotlight/Pause.Pause.prototype
	 * @public
	 */
	isPaused () {
		return paused === this;
	}

	/**
	 * Pauses spotlight if not currently paused
	 *
	 * @returns {undefined}
	 * @memberof spotlight/Pause.Pause.prototype
	 * @public
	 */
	pause () {
		if (!isPaused()) {
			paused = this;
		}
	}

	/**
	 * Resumes spotlight if this instance was the last to pause spotlight
	 *
	 * @returns {Boolean} `true` if spotlight was resumed
	 * @memberof spotlight/Pause.Pause.prototype
	 * @public
	 */
	resume () {
		if (this.isPaused()) {
			resume();

			return true;
		}

		return false;
	}
}

export default Pause;
export {
	Pause,
	isPaused,
	pause,
	resume
};
