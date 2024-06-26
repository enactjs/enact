import {act} from '@testing-library/react';

import Job from '../Job';

describe('Job', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});
	afterEach(() => {
		jest.useRealTimers();
	});
	describe('#start', () => {
		test('should start job', done => {
			const j = new Job(done, 10);
			j.start();
			jest.runAllTimers();
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
			jest.runAllTimers();
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

			act(() => jest.advanceTimersByTime(30));

			if (!ran) done();
		});

		test('should stop requestAnimationFrame job', done => {
			let ran = false;
			const j = new Job(function () {
				ran = true;
				done(new Error('job wasn\'t stopped'));
			}, 10);

			j.startRaf();
			j.stop();

			act(() => jest.advanceTimersByTime(30));

			if (!ran) done();
		});
	});

	describe('#throttle', () => {
		test('should throttle job', done => {
			let number = 0;
			const j = new Job(function () {
				number++;
			}, 20);

			j.throttle();

			act(() => jest.advanceTimersByTime(5));
			j.throttle();

			act(() => jest.advanceTimersByTime(10));
			j.throttle();

			act(() => jest.advanceTimersByTime(10));
			j.throttle();

			act(() => jest.advanceTimersByTime(5));
			if (number === 2) {
				done();
			} else {
				done(new Error('too many or too few calls' + number));
			}
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
			jest.runAllTimers();
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
			jest.runAllTimers();
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
			jest.runAllTimers();
		});

		test('should start job when it cannot request idle callback', done => {
			const backup = window.requestIdleCallback;
			window.requestIdleCallback = null;

			const j = new Job(done, 0);
			j.idle();
			jest.runAllTimers();

			window.requestIdleCallback = backup;
		});
	});

	describe('#startRaf', () => {
		test('should start job', done => {
			const j = new Job(done, 10);
			j.startRaf();
			jest.runAllTimers();
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
			j.startRaf(value);
			jest.runAllTimers();
		});

		test('should start job immediately when window is not defined', done => {
			function returnsUndefined () {}
			const windowSpy = jest.spyOn(window, 'window', 'get').mockImplementation(returnsUndefined);

			const j = new Job(done, 0);
			j.startRaf();

			windowSpy.mockRestore();
		});
	});

	describe('#promise', function () {
		test('should throw when passed a non-thenable argument', done => {
			const j = new Job(() => done(new Error('Unexpected job execution')));
			try {
				j.promise({});
			} catch (msg) {
				done();
			}
		});

		test('should support a non-Promise, thenable argument', done => {
			const j = new Job(() => done());
			try {
				j.promise({
					then: (fn) => fn(true)
				});
			} catch (msg) {
				done(msg);
			}
		});

		test('should start job for a resolved promise', done => {
			const j = new Job(() => done());
			j.promise(Promise.resolve(true));
		});

		test('should not start job for a rejected promise', done => {
			const j = new Job(() => {
				done(new Error('Job ran for rejected promise'));
			});
			j.promise(Promise.reject(true)).catch(() => {});

			act(() => jest.advanceTimersByTime(10));
			done();
		});

		test('should not start job when stopped before promise resolves', done => {
			const j = new Job(() => {
				done(new Error('Job ran for stopped promise'));
			});
			j.promise(new Promise(resolve => setTimeout(resolve, 20)));

			act(() => jest.advanceTimersByTime(10));
			j.stop();

			act(() => jest.advanceTimersByTime(20));
			done();
		});

		test('should not start job when another is started', done => {
			const j = new Job((value) => {
				expect(value).toBe(2);
				done();
			});
			j.promise(new Promise(resolve => resolve(1)));
			j.promise(new Promise(resolve => resolve(2)));
		});

		test('should return the value from the job to the resolved promise', done => {
			const j = new Job(() => 'job value');
			j.promise(Promise.resolve(true)).then(value => {
				expect(value).toBe('job value');
				done();
			});
		});

		test('should not return the value from the job to the replaced promise', done => {
			const j = new Job(() => 'job value');
			j.promise(Promise.resolve(true)).then(value => {
				expect(value).toBeUndefined();
			});
			j.promise(Promise.resolve(true)).then(() => done());
		});
	});
});
