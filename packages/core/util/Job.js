/**
 * @class Job
 * @memberof core/util
 * @public
 */
class Job {
	id = null
	fn = null
	timeout = null
	type = null

	/**
	 * @constructor
	 * @memberof core/util.Job
	 * @param {Function}    fn       Function to execute as the requested job.
	 * @param {Number}      timeout  The number of milliseconds to wait before starting the job.
	 */
	constructor (fn, timeout) {
		this.fn = fn;
		this.timeout = timeout;
	}

	run (args) {
		// don't want to inadvertently apply Job's context on `fn`
		this.fn.apply(null, args);
	}

	/**
	 * Starts the job.
	 *
	 * @method
	 * @memberof core/util.Job
	 * @param   {...*}       [args]  Any args passed are forwarded to the callback
	 * @returns {undefined}
	 */
	start = (...args) => {
		this.startAfter(this.timeout, ...args);
	}

	/**
	 * Starts the job in `timeout` milliseconds
	 *
	 * @method
	 * @memberof core/util.Job
	 * @param   {Number}     timeout  The number of milliseconds to wait before starting the job.
	 *                                This supersedes the timeout set at construction or by
	 *                                `setTimeout`.
	 * @param   {...*}       [args]   Any args passed are forwarded to the callback
	 * @returns {undefined}
	 */
	startAfter = (timeout, ...args) => {
		this.stop();
		this.type = 'timeout';
		this.id = setTimeout(() => this.run(args), timeout);
	}

	/**
	 * Stops the job.
	 *
	 * @method
	 * @memberof core/util.Job
	 * @returns {undefined}
	 */
	stop = () => {
		if (this.id) {
			if (this.type === 'idle') {
				window.cancelIdleCallback(this.id);
			} else if (this.type === 'raf') {
				window.cancelAnimationFrame(this.id);
			} else {
				clearTimeout(this.id);
			}
			this.id = null;
		}
	}

	/**
	 * Executes the job immediately, then prevents any other calls to `throttle()` from running
	 * until the `timeout` configured at construction or via `setTimeout` passes.
	 *
	 * @method
	 * @memberof core/util.Job
	 * @param   {...*}       args  Any args passed are forwarded to the callback
	 * @returns {undefined}
	 * @public
	 */
	throttle = (...args) => {
		this.throttleUntil(this.timeout, ...args);
	}

	/**
	 * Executes the job immediately, then prevents any other calls to `throttle()` from running for
	 * `timeout` milliseconds.
	 *
	 * @method
	 * @memberof core/util.Job
	 * @param   {Number}     timeout  The number of milliseconds to wait before allowing the job to
	 *                                be ran again. This supersedes the timeout set at construction
	 *                                or by `setTimeout`.
	 * @param   {...*}       [args]   Any args passed are forwarded to the callback
	 * @returns {undefined}
	 * @public
	 */
	throttleUntil = (timeout, ...args) => {
		if (!this.id) {
			this.run(args);
			this.id = setTimeout(this.stop, timeout);
		}
	}

	/**
	 * Executes job when the CPU is idle.
	 *
	 * @method
	 * @memberof core/util.Job
	 * @param   {...*}       [args]   Any args passed are forwarded to the callback
	 * @returns {undefined}
	 * @public
	 */
	idle = (...args) => {
		this.idleUntil(null, ...args);
	}

	/**
	 * Executes job when the CPU is idle, or when the timeout is reached, whichever occurs first.
	 *
	 * @method
	 * @memberof core/util.Job
	 * @param   {Number}     timeout  The number of milliseconds to wait before executing the
	 *                                job. This guarantees that the job is run, if a positive value
	 *                                is specified.
	 * @param   {...*}       [args]   Any args passed are forwarded to the callback
	 * @returns {undefined}
	 * @public
	 */
	idleUntil = (timeout, ...args) => {
		if (typeof window !== 'undefined') {
			if (window.requestIdleCallback) {
				this.type = 'idle';
				this.id = window.requestIdleCallback(() => this.run(args), {timeout});
			} else {
				// If requestIdleCallback is not supported just run the function immediately
				this.fn(...args);
			}
		}
	}

	/**
	 * Executes job before the next repaint.
	 *
	 * @method
	 * @memberof core/util.Job
	 * @param   {...*}       [args]   Any args passed are forwarded to the callback
	 * @returns {undefined}
	 * @public
	 */
	startRaf = (...args) => {
		this.startRafAfter(this.timeout, ...args);
	}

	/**
	 * Executes job before the next repaint after a given amount of timeout.
	 *
	 * @method
	 * @memberof core/util.Job
	 * @param   {Number}     timeout  The number of milliseconds to wait before running `requestAnimationFrame`.
	 * @param   {...*}       [args]   Any args passed are forwarded to the callback
	 * @returns {undefined}
	 * @public
	 */
	startRafAfter = (timeout, ...args) => {
		this.type = 'raf';
		if (typeof window !== 'undefined') {
			let time = null;
			const callback = (timestamp) => {
				if (time === null) {
					time = timestamp;
				}
				if (timeout && timestamp - time < timeout) {
					this.id = window.requestAnimationFrame(callback);
				} else {
					time = null;
					this.run(args);
					window.cancelAnimationFrame(this.id);
					this.id = null;
				}
			};
			this.id = window.requestAnimationFrame(callback);
		} else {
			// If requestAnimationFrame is not supported just run the function immediately
			this.fn(...args);
		}
	}
}

export default Job;
export {Job};
