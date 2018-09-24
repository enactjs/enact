/**
 * Provides the a class to manage key repeat acceleration.
 *
 * @module spotlight/Accelerator
 */

/**
 * @class Accelerator
 * @memberof spotlight/Accelerator
 */
class Accelerator {
	/**
	 * @constructor
	 * @param {Number[]} frequency - Controls the frequency with which the acceleration will
	 *	"freeze". While frozen, all events will be focused to the current target item and any attempts
	 * to change the current target will be prevented.
	 * @memberof spotlight/Accelerator.Accelerator
	 */
	constructor (frequency = [3, 3, 3, 2, 2, 2, 1]) {

		/*
		 * Whether the instance is currently in an accelerating state.
		 *
		 * @type {Boolean}
		 * @default false
		 */
		this.accelerating = false;

		/*
		 * Count of skipped events.
		 *
		 * @type {Number}
		 * @default 0
		 */
		this.skipped = 0;

		/*
		 * The timestamp of the last evaluated event.
		 *
		 * @type {Number}
		 * @default 0
		 */
		this.time = 0;

		/*
		 * The keyCode of the last evaluated event.
		 *
		 * @type {Number}
		 * @default 0
		 */
		this.keyCode = 0;

		/*
		 * Indicates acceleration is canceled.
		 *
		 * @type {Boolean}
		 * @default false
		 */
		this.canceled = false;

		/*
		 * Array of frequency rate in seconds with which the acceleration will "freeze".
		 *
		 * @type {Array}
		 * @default [3, 3, 3, 2, 2, 2, 1]
		 * @public
		 */
		this.frequency = frequency;
	}

	/**
	 * Called with the current keydown event and callback, which will be called when the event is
	 * allowed through.
	 *
	 * @function
	 * @param  {Object} event - The current event to validate.
	 * @param  {Function} callback - The callback to execute.
	 * @returns {Boolean} `true` if the event was consumed by processKey and callback was not called
	 * @public
	 * @memberof spotlight/Accelerator.Accelerator
	 */
	processKey = (event, callback) => {
		switch (event.type) {
			case 'keydown':
				if (event.keyCode !== this.keyCode) {
					this.reset();
					this.time = Date.now();
					this.keyCode = event.keyCode;
					return callback(event);
				} else if (this.canceled) {

					// Prevent skipped keydown events from bubbling
					event.preventDefault();
					return true;
				} else {
					let elapsedSeconds = Math.floor((Date.now() - this.time) / 1000),
						toSkip = 0;

					elapsedSeconds = elapsedSeconds > this.frequency.length - 1 ? this.frequency.length - 1 : elapsedSeconds;

					toSkip = this.frequency[elapsedSeconds] - 1;
					if (toSkip < 0) {
						toSkip = 0;
					}

					this.accelerating = !(elapsedSeconds === 0 && this.skipped === 0);

					if (this.skipped >= toSkip) {
						this.skipped = 0;
						return callback(event);
					} else {
						this.skipped++;
						// Prevent skipped keydown events from bubbling
						event.preventDefault();
						return true;
					}
				}
			case 'keyup':
				this.reset();
				return callback(event);
		}
	}

	/**
	 * Resets the Accelerator instance variables.
	 *
	 * @function
	 * @returns {undefined}
	 * @public
	 * @memberof spotlight/Accelerator.Accelerator
	 */
	reset = () => {
		this.skipped = 0;
		this.time = 0;
		this.keyCode = 0;
		this.canceled = false;
		this.accelerating = false;
	}

	/**
	 * Cancels the Accelerator.
	 *
	 * @function
	 * @returns {undefined}
	 * @public
	 * @memberof spotlight/Accelerator.Accelerator
	 */
	cancel = () => {
		this.canceled = true;
	}

	/**
	* Verifies that the Accelerator is active.
	*
	 * @function
	 * @returns {Boolean} `true` if the Accelerator is active;
	 * @public
	 * @memberof spotlight/Accelerator.Accelerator
	 */
	isAccelerating = () => {
		return this.accelerating;
	}
}

export default Accelerator;
export {Accelerator};
