//* @protected
/*************************************************************/
let accelerating = false,
	skipped = 0,
	time = 0,
	keyCode = 0,
	canceled = false,
	frequency = [3, 3, 3, 2, 2, 2, 1];

/**
* Accelerator provides logic for accelerating and throttling.
*
* Returns a generator function.
*
* @module enact-ui/Accelerator
* @public
*/
class Accelerator {
	constructor (inFrequency) {
		/**
		* Controls the frequency with which the acceleration will "freeze". While frozen,
		* the current target item cannot change, and all events are directed to it.
		*
		* @type {Array}
		* @default [3, 3, 3, 2, 2, 2, 1]
		* @public
		*/
		this.frequency = inFrequency || frequency;
	}

	/**
	* Called with the current keydown event and callback, which
	* will be called when the event is allowed through.
	*
	* @param  {Object} event - The current event to validate.
	* @param  {Function} callback - The callback to execute.
	* @param  {Object} context - The callback's execution context.
	* @returns {Boolean}
	* @public
	*/
	processKey = (event, callback, context) => {
		switch (event.type) {
			case 'keydown':
				if (event.keyCode != keyCode) {
					this.reset();
					time = (new Date()).getTime();
					keyCode = event.keyCode;
					return callback.apply(context, [event]);
				} else if (canceled) {

					// Prevent skipped keydown events from bubbling
					event.preventDefault();
					return true;
				} else {
					let elapsedTime = (new Date()).getTime() - time,
						seconds = Math.floor(elapsedTime / 1000),
						toSkip = 0;

					seconds = seconds > this.frequency.length - 1 ? this.frequency.length - 1 : seconds;

					toSkip = this.frequency[seconds] - 1;
					if (toSkip < 0) {
						toSkip = 0;
					}

					accelerating = !(seconds === 0 && skipped === 0);

					if (skipped >= toSkip) {
						skipped = 0;
						return callback.apply(context, [event]);
					} else {
						skipped++;
						// Prevent skipped keydown events from bubbling
						event.preventDefault();
						return true;
					}
				}
				break;
			case 'keyup':
				this.reset();
				return callback.apply(context, [event]);
		}
	}

	/**
	* Resets the Accelerator instance to the default values.
	*
	* @public
	*/
	reset = () => {
		skipped = 0;
		time = 0;
		keyCode = 0;
		canceled = false;
		accelerating = false;
	}

	/**
	* Cancels the Accelerator.
	*
	* @public
	*/
	cancel = () => {
		canceled = true;
	}

	/**
	* Verifies that the Accelerator is active.
	*
	* @returns {Boolean} `true` if the Accelerator is active; otherwise, `false`.
	* @public
	*/
	isAccelerating = () => {
		return accelerating;
	}
}

export default Accelerator;
export {Accelerator};