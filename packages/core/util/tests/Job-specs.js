import Job from '../Job';

describe('Job', function () {
	describe('#start', function () {
		it('should start job', function (done) {
			const j = new Job(done, 10);
			j.start();
		});

		it('should pass args to fn', function (done) {
			const value = 'argument';
			const fn = function (arg) {
				if (arg === value) {
					done();
				} else {
					done(new Error('fn did not receive argument'));
				}
			};

			const j = new Job(fn, 10);
			j.start(value);
		});
	});

	describe('#stop', function () {
		it('should stop job', function (done) {
			let ran = false;
			const j = new Job(function () {
				ran = true;
				done(new Error('job wasn\'t stopped'));
			}, 10);

			j.start();
			j.stop();

			window.setTimeout(function () {
				if (!ran) done();
			}, 30);
		});
	});

	describe('#throttle', function () {
		it('should throttle job', function (done) {
			let number = 0;
			const j = new Job(function () {
				number++;
			}, 20);

			j.throttle();
			window.setTimeout(function () {
				j.throttle();
			}, 5);
			window.setTimeout(function () {
				j.throttle();
			}, 15);
			window.setTimeout(function () {
				j.throttle();
			}, 25);
			window.setTimeout(function () {
				if (number === 2) {
					done();
				} else {
					done(new Error('too many or too few calls' + number));
				}
			}, 30);
		});

		it('should pass args to fn', function (done) {
			const value = 'argument';
			const fn = function (arg) {
				if (arg === value) {
					done();
				} else {
					done(new Error('fn did not receive argument'));
				}
			};

			const j = new Job(fn, 10);
			j.throttle(value);
		});
	});

	describe('#idle', function () {
		// polyfill for PhantomJS to verify expected idle behavior as much as possible
		const windowRequest = window.requestIdleCallback;
		const windowCancel = window.cancelIdleCallback;

		before(() => {
			window.requestIdleCallback = windowRequest || function (fn) {
				return setTimeout(fn, 0);
			};
			window.cancelIdleCallback = windowCancel || function (id) {
				clearTimeout(id);
			};
		});

		after(() => {
			window.requestIdleCallback = windowRequest;
			window.cancelIdleCallback = windowCancel;
		});

		it('should start job', function (done) {
			const j = new Job(done, 10);
			j.idle();
		});

		it('should pass args to fn', function (done) {
			const value = 'argument';
			const fn = function (arg) {
				if (arg === value) {
					done();
				} else {
					done(new Error('fn did not receive argument'));
				}
			};

			const j = new Job(fn, 10);
			j.idle(value);
		});

		it('should clear an existing job id before starting job', function (done) {
			const fn = function (arg) {
				if (arg === 'first') {
					done(new Error('First job ran'));
				} else {
					done();
				}
			};
			const j = new Job(fn);
			j.idle('first');
			j.idle('second');
		});
	});
});
