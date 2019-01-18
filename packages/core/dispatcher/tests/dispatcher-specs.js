import {off, on, once} from '../dispatcher';

describe('dispatcher', () => {

	test('should register handlers on target', () => {
		const handler = jest.fn();
		on('localechange', handler, window);

		const ev = new window.CustomEvent('localechange', {});
		window.dispatchEvent(ev);

		const expected = 1;
		const actual = handler.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test('should not register duplicate handlers on target', () => {
		const handler = jest.fn();
		on('localechange', handler, window);
		on('localechange', handler, window);

		const ev = new window.CustomEvent('localechange', {});
		window.dispatchEvent(ev);

		const expected = 1;
		const actual = handler.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test('should unregister handlers on target', () => {
		const handler = jest.fn();
		on('localechange', handler, window);

		const ev = new window.CustomEvent('localechange', {});
		window.dispatchEvent(ev);

		off('localechange', handler, window);
		window.dispatchEvent(ev);

		const expected = 1;
		const actual = handler.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test('should only call a "once" handler once', () => {
		const handler = jest.fn();
		once('localechange', handler, window);

		const ev = new window.CustomEvent('localechange', {});
		window.dispatchEvent(ev);
		window.dispatchEvent(ev);

		const expected = 1;
		const actual = handler.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test('should allow unregistering a "once" before it is called', () => {
		const handler = jest.fn();
		const onceHandler = once('localechange', handler, window);
		off('localechange', onceHandler, window);

		const ev = new window.CustomEvent('localechange', {});
		window.dispatchEvent(ev);

		const expected = 0;
		const actual = handler.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test(
		'should not block subsequent handlers when a handler throws',
		() => {
			// Modify the console spy to silence error output with
			// an empty mock implementation
			// eslint-disable-next-line no-console
			console.error.mockImplementation();

			const throws = function () {
				throw new Error('Thrown from handler');
			};
			const handler = jest.fn();
			on('localechange', throws, window);
			on('localechange', handler, window);

			const ev = new window.CustomEvent('localechange', {});
			window.dispatchEvent(ev);

			const expected = 1;
			const actual = handler.mock.calls.length;

			expect(actual).toBe(expected);
		}
	);
});
