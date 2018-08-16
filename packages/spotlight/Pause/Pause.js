/**
 * Provides the {@link spotlight/Pause.Pause} class which allows consumers to pause spotlight and
 * then only resume spotlight if another caller had not also paused Spotlight.
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
 * // spotlight is still paused and controlling Pause is
 * // updated to paused2
 * paused2.pause();
 *
 * // has no effect because paused2 is in control
 * paused1.resume();
 *
 * // resumes spotlight
 * paused2.resume();
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
	 * @memberof spotlight/Pause.Pause
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
	 * @memberof spotlight/Pause.Pause
	 * @public
	 */
	isPaused () {
		return paused === this;
	}

	/**
	 * Pauses spotlight if not currently paused
	 *
	 * @returns {undefined}
	 * @memberof spotlight/Pause.Pause
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
	 * @memberof spotlight/Pause.Pause
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
