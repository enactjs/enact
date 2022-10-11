import {warn, validateRange, validateStepped, validateRangeOnce, validateSteppedOnce} from '../validators';

describe('validators', () => {
	describe('warn', () => {
		test('should throw a console warning', () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
			warn('Warning!');

			expect(consoleSpy).toHaveBeenCalled();
		});
	});

	describe('validateRange', () => {
		test('should throw a console warning when \'value\' is less than \'min\'', () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
			validateRange(10, 11, 20, 'component', 'value', 'min', 'max');

			expect(consoleSpy).toHaveBeenCalled();
		});

		test('should throw a console warning when \'value\' is greater than \'max\'', () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
			validateRange(21, 1, 20, 'component', 'value', 'min', 'max');

			expect(consoleSpy).toHaveBeenCalled();
		});

		test('should throw a console warning when \'min\' is greater than \'max\'', () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
			validateRange(10, 21, 20, 'component', 'value', 'min', 'max');

			expect(consoleSpy).toHaveBeenCalled();
		});
	});

	describe('validateStepped', () => {
		test('should throw a console warning when \'value\' is not evenly divisible by \'step\'', () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
			validateStepped(11, 20, 2, 'component', 'value', 'step');

			expect(consoleSpy).toHaveBeenCalled();
		});
	});

	describe('validateRangeOnce', () => {
		let thingSpy;

		beforeEach(() => {
			thingSpy = jest.fn().mockReturnValue('ANY_THING_SPY_VALUE');
		});

		test('should throw a console warning when \'value\' is lower than \'min\'', () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
			const validateFn = validateRangeOnce(thingSpy, {
				component: 'ANY_COMPONENT'
			});

			const normalizedValues = validateFn({
				value: 1,
				min: 2,
				max: 10
			});

			const expected = 'Warning: ANY_COMPONENT value (1) less than min (2)';

			expect(consoleSpy).toHaveBeenCalled();
			expect(thingSpy).toHaveBeenCalled();
			expect(consoleSpy.mock.calls[0][0]).toBe(expected);
			expect(normalizedValues).toBe('ANY_THING_SPY_VALUE');
		});
	});

	describe('validateSteppedOnce', () => {
		let thingSpy;

		beforeEach(() => {
			thingSpy = jest.fn().mockReturnValue('ANY_THING_SPY_VALUE');
		});

		test('should throw a console warning when \'value\' is not evenly divisible by \'step\'', () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
			const validateFn = validateSteppedOnce(thingSpy, {
				component: 'ANY_COMPONENT'
			});

			const normalizedValues = validateFn({
				value: 11,
				min: 2,
				step: 2
			});

			const expected = 'Warning: ANY_COMPONENT value (11) must be evenly divisible by step (2)';

			expect(consoleSpy).toHaveBeenCalled();
			expect(thingSpy).toHaveBeenCalled();
			expect(consoleSpy.mock.calls[0][0]).toBe(expected);
			expect(normalizedValues).toBe('ANY_THING_SPY_VALUE');
		});
	});
});
