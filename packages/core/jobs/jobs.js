const _jobs = {};

/**
 * Stops a job.
 * @param {String} nom - The name of the job to be stopped.
 * @returns {undefined}
 */
export const stopJob = (nom) => {
	const jobs = _jobs;
	if (jobs[nom]) {
		window.clearTimeout(jobs[nom]);
		delete jobs[nom];
	}
};

/**
 * Creates a new job. If you start a job with the same name as a pending job,
 * the original job will be stopped; this can be useful for resetting timeouts.
 *
 * @param {String} nom - The name of the job to start.
 * @param {Function} job - function to execute as the requested job.
 * @param {Number} wait - The number of milliseconds to wait before starting
 * the job.
 * @returns {undefined}
 */
export const startJob = (nom, job, wait) => {
	const jobs = _jobs;
	// stop any existing jobs with same name
	stopJob(nom);
	jobs[nom] = window.setTimeout(
		job
	, wait);
};

/**
 * Executes the specified job immediately, then prevents any other calls to
 * `throttleJob()` with the same job name from running for the specified amount
 * of time.
 *
 * @param {String} nom - The name of the job to throttle.
 * @param {Function} job - function to execute as the requested job.
 * @param {Number} wait - The number of milliseconds to wait before executing the
 * job again.
 * @returns {undefined}
 * @public
 */
export const throttleJob = (nom, job, wait) => {
	const jobs = _jobs;
	// if we still have a job with this name pending, return immediately
	if (!jobs[nom]) {
		job();
		jobs[nom] = window.setTimeout(() => stopJob(nom), wait);
	}
};
