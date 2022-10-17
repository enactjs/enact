import deprecate from '../deprecate';

describe('deprecate', () => {
	const Thing = () => ('return');
	const config = {
		name: 'DeprecatedThing',
		message: 'No more information',
		since: '0.0.0',
		until: '0.0.1',
		replacedBy: 'ValidThing',
		alwaysWarn: true
	};
	const expectedMessage = 'DEPRECATED: DeprecatedThing since 0.0.0. Will be removed in 0.0.1. Replaced by ValidThing. No more information.';

	test('should call console.warn with a warning message for deprecated function', () => {
		const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
		const WarningThing = deprecate(Thing, config);

		const expected = Thing();
		const actual = WarningThing();

		expect(actual).toBe(expected);
		// eslint-disable-next-line no-console
		expect(console.warn).toHaveBeenCalledWith(expect.stringContaining(expectedMessage));

		consoleWarnMock.mockRestore();
	});

	test('should call console.warn with a warning message for stand-alone usage', () => {
		const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();

		const expected = config;
		const actual = deprecate(config);

		expect(actual).toBe(expected);
		// eslint-disable-next-line no-console
		expect(console.warn).toHaveBeenCalledWith(expect.stringContaining(expectedMessage));

		consoleWarnMock.mockRestore();
	});

});
