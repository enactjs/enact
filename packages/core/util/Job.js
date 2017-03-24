

/**
 * @class Job
 */
class Job {
	id = null
	fn = null
	timeout = null

	/**
	 * @constructor
	 * @param {Function} fn       function to execute as the requested job.
	 * @param {Number}   timeout  The number of milliseconds to wait before starting the job.
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
	 * @param   {...*}       [args]  Any args passed are forwarded to the callback
	 * @returns {undefined}
	 */
	start = (...args) => {
		this.startAfter(this.timeout, ...args);
	}

	/**
	 * Starts the job in `timeout` milliseconds
	 *
	 * @param   {Number}     timeout  The number of milliseconds to wait before starting the job.
	 *                                This supersedes the timeout set at construction or by
	 *                                `setTimeout`.
	 * @param   {...*}       [args]   Any args passed are forwarded to the callback
	 * @returns {undefined}
	 */
	startAfter = (timeout, ...args) => {
		this.stop();
		this.id = setTimeout(() => this.run(args), timeout);
	}

	/**
	 * Stops the job.
	 *
	 * @returns {undefined}
	 */
	stop = () => {
		if (this.id) {
			clearTimeout(this.id);
			this.id = null;
		}
	}

	/**
	 * Executes the job immediately, then prevents any other calls to `throttle()` from running
	 * until the `timeout` configured at construction or via `setTimeout` passes.
	 *
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
}

export default Job;
export {Job};
