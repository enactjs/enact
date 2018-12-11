/**
 * Provides the {@link spotlight/Accelerator.Accelerator} class.
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
	 *	"freeze". While frozen, the current target item cannot change, and all events are directed
	 *	to it.
	 * @memberof spotlight/Accelerator.Accelerator.prototype
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
		 * The current count of skipped events.
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
		 * Whether the instance is in a state of being canceled.
		 *
		 * @type {Boolean}
		 * @default false
		 */
		this.canceled = false;

		/*
		 * Controls the frequency with which the acceleration will "freeze". While frozen,
		 * the current target item cannot change, and all events are directed to it.
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
	 * @memberof spotlight/Accelerator.Accelerator.prototype
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
					let elapsedTime = Date.now() - this.time,
						seconds = Math.floor(elapsedTime / 1000),
						toSkip = 0;

					seconds = seconds > this.frequency.length - 1 ? this.frequency.length - 1 : seconds;

					toSkip = this.frequency[seconds] - 1;
					if (toSkip < 0) {
						toSkip = 0;
					}

					this.accelerating = !(seconds === 0 && this.skipped === 0);

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
	 * Resets the Accelerator instance to the default values.
	 *
	 * @function
	 * @returns {undefined}
	 * @public
	 * @memberof spotlight/Accelerator.Accelerator.prototype
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
	 * @memberof spotlight/Accelerator.Accelerator.prototype
	 */
	cancel = () => {
		this.canceled = true;
	}

	/**
	 * Verifies that the Accelerator is active.
	 *
	 * @function
	 * @returns {Boolean} `true` if the Accelerator is active; otherwise, `false`.
	 * @public
	 * @memberof spotlight/Accelerator.Accelerator.prototype
	 */
	isAccelerating = () => {
		return this.accelerating;
	}
}

export default Accelerator;
export {Accelerator};
