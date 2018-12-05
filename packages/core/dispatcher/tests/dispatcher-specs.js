import sinon from 'sinon';
import {restoreErrorAndWarnings, watchErrorAndWarnings} from 'console-snoop';

import {off, on, once} from '../dispatcher';

describe('dispatcher', () => {

	test('should register handlers on target', () => {
		const handler = sinon.spy();
		on('localechange', handler, window);

		const ev = new window.CustomEvent('localechange', {});
		window.dispatchEvent(ev);

		const expected = true;
		const actual = handler.calledOnce;

		expect(actual).toBe(expected);
	});

	test('should not register duplicate handlers on target', () => {
		const handler = sinon.spy();
		on('localechange', handler, window);
		on('localechange', handler, window);

		const ev = new window.CustomEvent('localechange', {});
		window.dispatchEvent(ev);

		const expected = true;
		const actual = handler.calledOnce;

		expect(actual).toBe(expected);
	});

	test('should unregister handlers on target', () => {
		const handler = sinon.spy();
		on('localechange', handler, window);

		const ev = new window.CustomEvent('localechange', {});
		window.dispatchEvent(ev);

		off('localechange', handler, window);
		window.dispatchEvent(ev);

		const expected = false;
		const actual = handler.calledTwice;

		expect(actual).toBe(expected);
	});

	test('should only call a "once" handler once', () => {
		const handler = sinon.spy();
		once('localechange', handler, window);

		const ev = new window.CustomEvent('localechange', {});
		window.dispatchEvent(ev);
		window.dispatchEvent(ev);

		const expected = true;
		const actual = handler.calledOnce;

		expect(actual).toBe(expected);
	});

	test('should allow unregistering a "once" before it is called', () => {
		const handler = sinon.spy();
		const onceHandler = once('localechange', handler, window);
		off('localechange', onceHandler, window);

		const ev = new window.CustomEvent('localechange', {});
		window.dispatchEvent(ev);

		const expected = false;
		const actual = handler.calledOnce;

		expect(actual).toBe(expected);
	});

	test(
		'should not block subsequent handlers when a handler throws',
		() => {
			// clear enyo-console-spy so we can stub it to suppress the console.error
			restoreErrorAndWarnings();
			sinon.stub(console, 'error');

			const throws = function () {
				throw new Error('Thrown from handler');
			};
			const handler = sinon.spy();
			on('localechange', throws, window);
			on('localechange', handler, window);

			const ev = new window.CustomEvent('localechange', {});
			window.dispatchEvent(ev);

			// restore console.error and set up enyo-console-spy again so it can complete successfully
			// eslint-disable-next-line no-console
			console.error.mockRestore();
			watchErrorAndWarnings();

			const expected = true;
			const actual = handler.calledOnce;

			expect(actual).toBe(expected);
		}
	);
});
