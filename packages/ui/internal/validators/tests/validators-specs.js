import {warn, validateRange, validateStepped} from '../validators.js';

describe('validators', () => {
	test('should throw a console warning', () => {
		warn('Warning!');

		const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

		expect(consoleSpy).toHaveBeenCalled();
	});

	test('should throw a console warning when \'value\' is less than \'min\'', () => {
		validateRange(10, 11, 20, 'component', 'value', 'min', 'max');

		const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

		expect(consoleSpy).toHaveBeenCalled();
	});

	test('should throw a console warning when \'value\' is greater than \'max\'', () => {
		validateRange(21, 1, 20, 'component', 'value', 'min', 'max');

		const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

		expect(consoleSpy).toHaveBeenCalled();
	});

	test('should throw a console warning when \'min\' is greater than \'max\'', () => {
		validateRange(10, 21, 20, 'component', 'value', 'min', 'max');

		const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

		expect(consoleSpy).toHaveBeenCalled();
	});

	test('should throw a console warning when \'value\' is evenly divisible by \'step\'', () => {
		validateStepped(10, 1, 2, 'component', 'value', 'step');

		const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

		expect(consoleSpy).toHaveBeenCalled();
	});
});
