import * as jobs from '../jobs';

describe('jobs Specs', function () {
	describe('Start job', function () {
		it('should start job', function (done) {
			jobs.startJob('testStartJob', function () {
				done();
			}, 10);
		});
	});

	describe('Stop job', function () {
		it('should stop job', function (done) {
			let ran = false;

			jobs.startJob('testStopJob', function () {
				ran = true;
				done(new Error('job wasn\'t stopped'));
			}, 10);

			jobs.stopJob('testStopJob');

			window.setTimeout(function () {
				if (!ran) done();
			}, 30);
		});
	});

	describe('Throttle job', function () {
		it('should throttle job', function (done) {
			let number = 0;
			const increment = function () {
				number++;
			};

			jobs.throttleJob('testThrottleJob', increment, 20);
			window.setTimeout(function () {
				jobs.throttleJob('testThrottleJob', increment, 20);
			}, 5);
			window.setTimeout(function () {
				jobs.throttleJob('testThrottleJob', increment, 20);
			}, 15);
			window.setTimeout(function () {
				jobs.throttleJob('testThrottleJob', increment, 20);
			}, 25);
			window.setTimeout(function () {
				if (number === 2) {
					done();
				} else {
					done(new Error('too many or too few calls'));
				}
			}, 30);
		});
	});
});
