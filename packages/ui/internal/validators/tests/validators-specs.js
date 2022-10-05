import {warn, validateRange, validateStepped, validateRangeOnce, validateSteppedOnce} from '../validators';

describe('validators', () => {
	test('should throw a console warning', () => {
		const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
		warn('Warning!');

		expect(consoleSpy).toHaveBeenCalled();
	});

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

	test('should throw a console warning when \'value\' is evenly divisible by \'step\'', () => {
		const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
		validateStepped(10, 1, 2, 'component', 'value', 'step');

		expect(consoleSpy).toHaveBeenCalled();
	});

	describe('validateRangeOnce', () => {
		let thingSpy;

		beforeEach(() => {
			thingSpy = jest.fn().mockReturnValue("ANY_THING_SPY_VALUE");
		});

		test('should throw a console warning when \'value\' is lower than \'min\'', () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
			const validateFn = validateRangeOnce(thingSpy, {
				component: "ANY_COMPONENT"
			});

			const normalizedValues = validateFn({
				value: 1,
				min: 2,
				max: 10
			});

			expect(consoleSpy).toHaveBeenCalled();
			expect(thingSpy).toHaveBeenCalled();
			expect(consoleSpy.mock.calls).toMatchSnapshot(`
				Array [
					Array [
						'Warning: ANY_COMPONENT value (1) less than min (2)'
					],
				]
			`);
			expect(thingSpy.mock.calls).toMatchSnapshot(`
				Array [
					Array [
						Object {
							"max": 10,
							"min": 2,
							"value": 1,
						},
					],
				]
      		`);
			expect(normalizedValues).toMatchInlineSnapshot(`"ANY_THING_SPY_VALUE"`);
		});
	});

	describe('validateSteppedOnce', () => {
		let thingSpy;

		beforeEach(() => {
			thingSpy = jest.fn().mockReturnValue("ANY_THING_SPY_VALUE");
		});

		test('validateSteppedOnce test', () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
			const validateFn = validateSteppedOnce(thingSpy, {
				component: "ANY_COMPONENT"
			});

			const normalizedValues = validateFn({
				value: 10,
				min: 1,
				step: 2
			});

			expect(consoleSpy).toHaveBeenCalled();
			expect(thingSpy).toHaveBeenCalled();
			expect(consoleSpy.mock.calls).toMatchSnapshot(`
				Array [
					Array [
						'Warning: ANY_COMPONENT value (10) must be evenly divisible by step (2)'
					],
				]
			`);
			expect(thingSpy.mock.calls).toMatchSnapshot(`
				Array [
					Array [
						Object {
							"value": 10,
							"min": 1,
							"step": 2,
						},
					],
				]
      		`);
			expect(normalizedValues).toMatchInlineSnapshot(`"ANY_THING_SPY_VALUE"`);
		});
	});
});
