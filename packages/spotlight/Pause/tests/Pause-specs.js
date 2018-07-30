import Pause, {isPaused, pause, resume} from '../Pause';

const PAUSED = 'Paused';
const NOT_PAUSED = 'Not Paused';

describe('Pause', () => {
	it('should pause spotlight', function () {
		const subject = new Pause();

		subject.pause();

		const expected = PAUSED;
		const actual = isPaused() ? PAUSED : NOT_PAUSED;

		subject.resume();

		expect(actual).to.equal(expected);
	});

	it('should resume spotlight', function () {
		const subject = new Pause();

		subject.pause();
		subject.resume();

		const expected = NOT_PAUSED;
		const actual = isPaused() ? PAUSED : NOT_PAUSED;

		expect(actual).to.equal(expected);
	});

	it('should not resume spotlight when another Paused instance is in control', function () {
		const subject = new Pause();
		const another = new Pause();

		another.pause();
		subject.pause();

		const expected = PAUSED;
		const actual = isPaused() ? PAUSED : NOT_PAUSED;

		another.resume();

		expect(actual).to.equal(expected);
	});

	it('should not report paused when another Paused instance is in control', function () {
		const subject = new Pause();
		const another = new Pause();

		another.pause();
		subject.pause();

		const expected = NOT_PAUSED;
		const actual = subject.isPaused() ? PAUSED : NOT_PAUSED;

		another.resume();

		expect(actual).to.equal(expected);
	});

	it('should not report paused when the global Spotlight is paused', function () {
		const subject = new Pause();

		pause();
		subject.pause();

		const expected = NOT_PAUSED;
		const actual = subject.isPaused() ? PAUSED : NOT_PAUSED;

		resume();

		expect(actual).to.equal(expected);
	});

	it('should allow the global Spotlight to resume', function () {
		const subject = new Pause();

		subject.pause();
		resume();

		const expected = NOT_PAUSED;
		const actual = isPaused() ? PAUSED : NOT_PAUSED;

		expect(actual).to.equal(expected);
	});

});
