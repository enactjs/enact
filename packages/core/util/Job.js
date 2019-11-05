import invariant from 'invariant';

/**
 * Provides a convenient way to manage timed execution of functions.
 *
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
	 * @param {Function}    fn       Function to execute as the requested job.
	 * @param {Number}      timeout  The number of milliseconds to wait before starting the job.
	 *
	 * @memberof core/util.Job.prototype
	 */
	constructor (fn, timeout) {
		this.fn = fn;
		this.timeout = timeout;
	}

	run (args) {
		// don't want to inadvertently apply Job's context on `fn`
		return this.fn.apply(null, args);
	}

	/**
	 * Starts the job.
	 *
	 * @method
	 * @param   {...*}       [args]  Any args passed are forwarded to the callback
	 *
	 * @returns {undefined}
	 * @memberof core/util.Job.prototype
	 * @public
	 */
	start = (...args) => {
		this.startAfter(this.timeout, ...args);
	}

	/**
	 * Starts the job in `timeout` milliseconds
	 *
	 * @method
	 * @param   {Number}     timeout  The number of milliseconds to wait before starting the job.
	 *                                This supersedes the timeout set at construction.
	 * @param   {...*}       [args]   Any args passed are forwarded to the callback
	 *
	 * @returns {undefined}
	 * @memberof core/util.Job.prototype
	 * @public
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
	 *
	 * @returns {undefined}
	 * @memberof core/util.Job.prototype
	 * @public
	 */
	stop = () => {
		if (this.id) {
			if (this.type === 'idle') {
				window.cancelIdleCallback(this.id);
			} else if (this.type === 'raf') {
				window.cancelAnimationFrame(this.id);
			} else if (this.type === 'timeout') {
				clearTimeout(this.id);
			}
			this.id = this.type = null;
		}
	}

	/**
	 * Executes the job immediately, then prevents any other calls to `throttle()` from running
	 * until the `timeout` configured at construction passes.
	 *
	 * @method
	 * @param   {...*}       args  Any args passed are forwarded to the callback
	 *
	 * @returns {undefined}
	 * @memberof core/util.Job.prototype
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
	 * @param   {Number}     timeout  The number of milliseconds to wait before allowing the job to
	 *                                be ran again. This supersedes the timeout set at construction.
	 * @param   {...*}       [args]   Any args passed are forwarded to the callback
	 *
	 * @returns {undefined}
	 * @memberof core/util.Job.prototype
	 * @public
	 */
	throttleUntil = (timeout, ...args) => {
		if (!this.id) {
			this.type = 'timeout';
			this.run(args);
			this.id = setTimeout(this.stop, timeout);
		}
	}

	/**
	 * Executes job when the CPU is idle.
	 *
	 * @method
	 * @param   {...*}       [args]   Any args passed are forwarded to the callback
	 *
	 * @returns {undefined}
	 * @memberof core/util.Job.prototype
	 * @public
	 */
	idle = (...args) => {
		this.idleUntil(null, ...args);
	}

	/**
	 * Executes job when the CPU is idle, or when the timeout is reached, whichever occurs first.
	 *
	 * @method
	 * @param   {Number}     timeout  The number of milliseconds to wait before executing the
	 *                                job. This guarantees that the job is run, if a positive value
	 *                                is specified.
	 * @param   {...*}       [args]   Any args passed are forwarded to the callback
	 *
	 * @returns {undefined}
	 * @memberof core/util.Job.prototype
	 * @public
	 */
	idleUntil = (timeout, ...args) => {
		if (typeof window !== 'undefined' && window.requestIdleCallback) {
			this.stop();
			this.type = 'idle';
			this.id = window.requestIdleCallback(() => this.run(args), {timeout});
		} else {
			// since we can't request an idle callback, just pass to startAfter()
			this.startAfter(timeout, ...args);
		}
	}

	/**
	 * Executes job before the next repaint.
	 *
	 * @method
	 * @param   {...*}       [args]   Any args passed are forwarded to the callback
	 *
	 * @returns {undefined}
	 * @memberof core/util.Job.prototype
	 * @public
	 */
	startRaf = (...args) => {
		this.startRafAfter(this.timeout, ...args);
	}

	/**
	 * Executes job before the next repaint after a given amount of timeout.
	 *
	 * @method
	 * @param   {Number}     timeout  The number of milliseconds to wait before running `requestAnimationFrame`.
	 * @param   {...*}       [args]   Any args passed are forwarded to the callback
	 *
	 * @returns {undefined}
	 * @memberof core/util.Job.prototype
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
			this.run(args);
		}
	}

	/**
	 * Starts the job when `promise` resolves.
	 *
	 * The job execution is tied to the resolution of the last `Promise` passed. Like other methods
	 * on `Job`, calling `promise()` again with a new `Promise` will block execution of the job
	 * until that new `Promise` resolves. Any previous `Promise`s will still resolve normally but
	 * will not trigger job execution.
	 *
	 * Unlike other methods on `Job`, `promise()` returns a `Promise` which is the result of calling
	 * `then()` on the passed `promise`. That `Promise` resolves with either the result of job
	 * execution or `undefined` if `Promise` was superseded by a subsequent `Promise` passed as
	 * described above.
	 *
	 * @method
	 * @param   {Promise}  promise  The promise that must resolve before the job is executed
	 *
	 * @returns {Promise}
	 * @memberof core/util.Job.prototype
	 * @public
	 */
	promise = (promise) => {
		invariant(
			promise && typeof promise.then === 'function',
			'promise expects a thenable'
		);

		this.type = 'promise';
		this.id = promise;

		return promise.then(result => {
			if (this.id === promise) {
				this.stop();
				return this.run([result]);
			}
		});
	}
}

export default Job;
export {Job};
