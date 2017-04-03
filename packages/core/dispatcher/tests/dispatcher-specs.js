/* global CustomEvent */

import sinon from 'sinon';
import {restoreErrorAndWarnings, watchErrorAndWarnings} from 'console-snoop';

import {off, on, once} from '../dispatcher';

describe('dispatcher', () => {

	it('should register handlers on target', function () {
		const handler = sinon.spy();
		on('localechange', handler, window);

		const ev = new CustomEvent('localechange', {});
		window.dispatchEvent(ev);

		const expected = true;
		const actual = handler.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should unregister handlers on target', function () {
		const handler = sinon.spy();
		on('localechange', handler, window);

		const ev = new CustomEvent('localechange', {});
		window.dispatchEvent(ev);

		off('localechange', handler, window);
		window.dispatchEvent(ev);

		const expected = false;
		const actual = handler.calledTwice;

		expect(actual).to.equal(expected);
	});

	it('should only call a "once" handler once', function () {
		const handler = sinon.spy();
		once('localechange', handler, window);

		const ev = new CustomEvent('localechange', {});
		window.dispatchEvent(ev);
		window.dispatchEvent(ev);

		const expected = true;
		const actual = handler.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should allow unregistering a "once" before it is called', function () {
		const handler = sinon.spy();
		const onceHandler = once('localechange', handler, window);
		off('localechange', onceHandler, window);

		const ev = new CustomEvent('localechange', {});
		window.dispatchEvent(ev);

		const expected = false;
		const actual = handler.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should not block subsequent handlers when a handler throws', function () {
		// clear enyo-console-spy so we can stub it to suppress the console.error
		restoreErrorAndWarnings();
		sinon.stub(console, 'error');

		const throws = function () {
			throw new Error('Thrown from handler');
		};
		const handler = sinon.spy();
		on('localechange', throws, window);
		on('localechange', handler, window);

		const ev = new CustomEvent('localechange', {});
		window.dispatchEvent(ev);

		// restore console.error and set up enyo-console-spy again so it can complete successfully
		// eslint-disable-next-line no-console
		console.error.restore();
		watchErrorAndWarnings();

		const expected = true;
		const actual = handler.calledOnce;

		expect(actual).to.equal(expected);
	});
});
