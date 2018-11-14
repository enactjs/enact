import Job from '../Job';

describe('Job', () => {
	describe('#start', () => {
		test('should start job', done => {
			const j = new Job(done, 10);
			j.start();
		});

		test('should pass args to fn', done => {
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

	describe('#stop', () => {
		test('should stop job', done => {
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

	describe('#throttle', () => {
		test('should throttle job', done => {
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

		test('should pass args to fn', done => {
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

	describe('#idle', () => {
		// polyfill for PhantomJS to verify expected idle behavior as much as possible
		const windowRequest = window.requestIdleCallback;
		const windowCancel = window.cancelIdleCallback;

		beforeAll(() => {
			window.requestIdleCallback = windowRequest || function (fn) {
				return setTimeout(fn, 0);
			};
			window.cancelIdleCallback = windowCancel || function (id) {
				clearTimeout(id);
			};
		});

		afterAll(() => {
			window.requestIdleCallback = windowRequest;
			window.cancelIdleCallback = windowCancel;
		});

		test('should start job', done => {
			const j = new Job(done, 10);
			j.idle();
		});

		test('should pass args to fn', done => {
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

		test('should clear an existing job id before starting job', done => {
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
