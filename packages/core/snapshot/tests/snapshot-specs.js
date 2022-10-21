import {isWindowReady, onWindowReady, windowReady} from '../snapshot';

function returnsUndefined () {}

describe('snapshot', () => {
	describe('isWindowReady', () => {
		test('should return `true` if window is ready', () => {
			const expected = true;
			const actual = isWindowReady();

			expect(actual).toBe(expected);
		});

		test('should return `false` if window is not ready', () => {
			const windowSpy = jest.spyOn(window, 'window', 'get').mockImplementation(returnsUndefined);

			const expected = false;
			const actual = isWindowReady();

			expect(actual).toBe(expected);

			windowSpy.mockRestore();
		});
	});

	describe('onWindowReady', () => {
		test('should call a given callback function immediately if window is ready', () => {
			const spy = jest.fn();

			onWindowReady(spy);

			expect(spy).toHaveBeenCalled();
		});

		test('should not call a given callback function if window is not ready', () => {
			const windowSpy = jest.spyOn(window, 'window', 'get').mockImplementation(returnsUndefined);

			const spy = jest.fn();

			onWindowReady(spy);

			expect(spy).not.toHaveBeenCalled();

			windowSpy.mockRestore();
		});
	});

	describe('windowReady', () => {
		test('should call queued callbacks if window is ready', () => {
			const windowSpy = jest.spyOn(window, 'window', 'get').mockImplementation(returnsUndefined);
			const spy = jest.fn();

			onWindowReady(spy);
			onWindowReady(spy);

			expect(spy).not.toHaveBeenCalled();

			windowSpy.mockRestore();

			windowReady();

			expect(spy).toHaveBeenCalledTimes(2);
		});

		test('should throw an error if window is not ready', () => {
			const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
			const windowSpy = jest.spyOn(window, 'window', 'get').mockImplementation(returnsUndefined);
			const spy = jest.fn();

			onWindowReady(spy);

			expect(windowReady).toThrow('windowReady cannot be run until the window is available');
			expect(spy).not.toHaveBeenCalled();

			consoleErrorMock.mockRestore();
			windowSpy.mockRestore();
		});
	});
});
