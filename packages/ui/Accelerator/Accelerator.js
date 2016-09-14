//* @protected
/*************************************************************/
let _isAccelerating = false,
	_nSkipped = 0,
	_nTime = 0,
	_nKey = 0,
	_bCanceled = false,
	_frequency = [3, 3, 3, 2, 2, 2, 1];

/**
* Accelerator provides logic for accelerating and throttling.
*
* Returns a generator function.
*
* @module enact-ui/Accelerator
* @public
*/
class Accelerator {
	constructor (frequency) {
		/**
		* Controls the frequency with which the acceleration will "freeze". While frozen,
		* the current target item cannot change, and all events are directed to it.
		*
		* @type {Array}
		* @default [3, 3, 3, 2, 2, 2, 1]
		* @public
		*/
		this.frequency = frequency || _frequency;
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
				if (event.keyCode != _nKey) {
					this.reset();
					_nTime = (new Date()).getTime();
					_nKey = event.keyCode;
					return callback.apply(context, [event]);
				} else if (_bCanceled) {

					// Prevent skipped keydown events from bubbling
					event.preventDefault();
					return true;
				} else {
					let nElapsedTime = (new Date()).getTime() - _nTime,
						nSeconds = Math.floor(nElapsedTime / 1000),
						nToSkip = 0;

					nSeconds = nSeconds > this.frequency.length - 1 ? this.frequency.length - 1 : nSeconds;

					nToSkip = this.frequency[nSeconds] - 1;
					if (nToSkip < 0) {
						nToSkip = 0;
					}

					_isAccelerating = !(nSeconds === 0 && _nSkipped === 0);

					if (_nSkipped >= nToSkip) {
						_nSkipped = 0;
						return callback.apply(context, [event]);
					} else {
						_nSkipped++;
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
		_nSkipped = 0;
		_nTime = 0;
		_nKey = 0;
		_bCanceled = false;
		_isAccelerating = false;
	}

	/**
	* Cancels the Accelerator.
	*
	* @public
	*/
	cancel = () => {
		_bCanceled = true;
	}

	/**
	* Verifies that the Accelerator is active.
	*
	* @returns {Boolean} `true` if the Accelerator is active; otherwise, `false`.
	* @public
	*/
	isAccelerating = () => {
		return _isAccelerating;
	}
}

export default Accelerator;
export {Accelerator};