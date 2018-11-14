import Pause, {isPaused, pause, resume} from '../Pause';

const PAUSED = 'Paused';
const NOT_PAUSED = 'Not Paused';

describe('Pause', () => {
	test('should pause spotlight', () => {
		const subject = new Pause();

		subject.pause();

		const expected = PAUSED;
		const actual = isPaused() ? PAUSED : NOT_PAUSED;

		subject.resume();

		expect(actual).toBe(expected);
	});

	test('should resume spotlight', () => {
		const subject = new Pause();

		subject.pause();
		subject.resume();

		const expected = NOT_PAUSED;
		const actual = isPaused() ? PAUSED : NOT_PAUSED;

		expect(actual).toBe(expected);
	});

	test(
        'should not resume spotlight when another Paused instance is in control',
        () => {
            const subject = new Pause();
            const another = new Pause();

            another.pause();
            subject.pause();

            const expected = PAUSED;
            const actual = isPaused() ? PAUSED : NOT_PAUSED;

            another.resume();

            expect(actual).toBe(expected);
        }
    );

	test(
        'should not report paused when another Paused instance is in control',
        () => {
            const subject = new Pause();
            const another = new Pause();

            another.pause();
            subject.pause();

            const expected = NOT_PAUSED;
            const actual = subject.isPaused() ? PAUSED : NOT_PAUSED;

            another.resume();

            expect(actual).toBe(expected);
        }
    );

	test(
        'should not report paused when the global Spotlight is paused',
        () => {
            const subject = new Pause();

            pause();
            subject.pause();

            const expected = NOT_PAUSED;
            const actual = subject.isPaused() ? PAUSED : NOT_PAUSED;

            resume();

            expect(actual).toBe(expected);
        }
    );

	test('should allow the global Spotlight to resume', () => {
		const subject = new Pause();

		subject.pause();
		resume();

		const expected = NOT_PAUSED;
		const actual = isPaused() ? PAUSED : NOT_PAUSED;

		expect(actual).toBe(expected);
	});

});
