import sinon from 'sinon';
import {
	handle,
	callOnEvent,
	forEventProp,
	forKeyCode,
	forProp,
	forward,
	oneOf,
	preventDefault,
	stop
} from '../handle';

describe('handle', () => {

	const makeEvent = (payload) => ({
		preventDefault: sinon.spy(),
		stopPropagation: sinon.spy(),
		...payload
	});

	const returnsTrue = () => true;
	const returnsFalse = () => false;

	it('should call only handler', function () {
		const handler = sinon.spy(returnsTrue);
		const callback = handle(handler);

		callback(makeEvent());

		const expected = true;
		const actual = handler.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should call multiple handlers', function () {
		const handler1 = sinon.spy(returnsTrue);
		const handler2 = sinon.spy(returnsTrue);

		const callback = handle(handler1, handler2);

		callback(makeEvent());

		const expected = true;
		const actual = handler1.calledOnce && handler2.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should skip non-function handlers', function () {
		const handler = sinon.spy(returnsTrue);
		const callback = handle(null, void 0, 0, 'purple', handler);

		callback(makeEvent());

		const expected = true;
		const actual = handler.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should not call handlers after one that returns false', function () {
		const handler1 = sinon.spy(returnsTrue);
		const handler2 = sinon.spy(returnsTrue);

		const callback = handle(handler1, returnsFalse, handler2);

		callback(makeEvent());

		const expected = false;
		const actual = handler2.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should call stopPropagation on event', function () {
		const callback = handle(stop);
		const ev = makeEvent();
		callback(ev);

		const expected = true;
		const actual = ev.stopPropagation.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should call preventDefault on event', function () {
		const callback = handle(preventDefault);
		const ev = makeEvent();
		callback(ev);

		const expected = true;
		const actual = ev.preventDefault.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should call any method on event', function () {
		const callback = handle(callOnEvent('customMethod'));
		const ev = makeEvent({
			customMethod: sinon.spy()
		});
		callback(ev);

		const expected = true;
		const actual = ev.customMethod.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should only call handler for specified keyCode', function () {
		const keyCode = 13;
		const handler = sinon.spy();
		const callback = handle(forKeyCode(keyCode), handler);

		callback(makeEvent());
		expect(handler.calledOnce).to.equal(false);

		callback(makeEvent({keyCode}));
		expect(handler.calledOnce).to.equal(true);
	});

	it('should only call handler for specified event prop', function () {
		const prop = 'index';
		const value = 0;
		const handler = sinon.spy();
		const callback = handle(forEventProp(prop, value), handler);

		// undefined shouldn't pass
		callback(makeEvent());
		expect(handler.calledOnce).to.equal(false);

		// == check shouldn't pass
		callback(makeEvent({
			[prop]: false
		}));
		expect(handler.calledOnce).to.equal(false);

		// === should pass
		callback(makeEvent({
			[prop]: value
		}));
		expect(handler.calledOnce).to.equal(true);
	});

	it('should only call handler for specified prop', function () {
		const handler = sinon.spy();
		const callback = handle(forProp('checked', true), handler);

		// undefined shouldn't pass
		callback({}, {});
		expect(handler.calledOnce).to.equal(false);

		// == check shouldn't pass
		callback({}, {checked: 1});
		expect(handler.calledOnce).to.equal(false);

		// === should pass
		callback({}, {checked: true});
		expect(handler.calledOnce).to.equal(true);
	});

	it('should forward events to function specified in provided props', function () {
		const event = 'onMyClick';
		const prop = 'index';
		const propValue = 0;
		const spy = sinon.spy();

		const props = {
			[event]: spy
		};
		const payload = {
			[prop]: propValue
		};

		handle(forward(event))(payload, props);

		const expected = true;
		const actual = spy.args[0][0][prop] === propValue;

		expect(actual).to.equal(expected);
	});

	it('should include object props as second arg when bound', function () {
		const componentInstance = {
			props: {
				value: 1
			}
		};
		const handler = sinon.spy();
		const h = handle.bind(componentInstance);
		const callback = h(handler);
		callback();

		const expected = 1;
		const actual = handler.firstCall.args[1].value;

		expect(actual).to.equal(expected);
	});

	it('should include object context as third arg when bound', function () {
		const componentInstance = {
			context: {
				value: 1
			}
		};
		const handler = sinon.spy();
		const h = handle.bind(componentInstance);
		const callback = h(handler);
		callback();

		const expected = 1;
		const actual = handler.firstCall.args[2].value;

		expect(actual).to.equal(expected);
	});

	describe('#oneOf', () => {
		it('should call each handler until one passes', () => {
			const handler = sinon.spy(returnsTrue);
			const h1 = [
				returnsFalse,
				handler
			];
			const h2 = [
				returnsTrue,
				handler
			];
			const callback = oneOf(h1, h1, h2);
			callback();

			const expected = 1;
			const actual = handler.callCount;

			expect(actual).to.equal(expected);
		});

		it('should stop if the first handler passes', () => {
			const handler = sinon.spy(returnsTrue);
			const callback = oneOf(
				[returnsTrue, handler],
				[returnsTrue, handler],
				[returnsTrue, handler]
			);
			callback();

			const expected = 1;
			const actual = handler.callCount;

			expect(actual).to.equal(expected);
		});

		it('should pass args to condition', () => {
			const handler = sinon.spy(returnsTrue);
			const callback = oneOf(
				[handler, returnsTrue]
			);
			const ev = {value: 1};
			callback(ev);

			const expected = ev;
			const actual = handler.firstCall.args[0];

			expect(actual).to.equal(expected);
		});

		it('should pass args to handlers', () => {
			const handler = sinon.spy(returnsTrue);
			const callback = oneOf(
				[returnsTrue, handler]
			);
			const ev = {value: 1};
			callback(ev);

			const expected = ev;
			const actual = handler.firstCall.args[0];

			expect(actual).to.equal(expected);
		});

		it('should return the value from the passed condition branch', () => {
			const handler = sinon.spy(() => 'ok');
			const callback = oneOf(
				[returnsTrue, handler]
			);

			const expected = callback();
			const actual = 'ok';

			expect(actual).to.equal(expected);
		});

		it('should support bound handlers', () => {
			const componentInstance = {
				context: {
					value: 1
				}
			};
			const handler = sinon.spy();
			const h = handle.bind(componentInstance);
			const callback = oneOf(
				[returnsTrue, h(handler)]
			);
			callback();

			const expected = 1;
			const actual = handler.firstCall.args[2].value;

			expect(actual).to.equal(expected);
		});
	});
});
