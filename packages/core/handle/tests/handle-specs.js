import sinon from 'sinon';
import {
	handle,
	callOnEvent,
	forEventProp,
	forKeyCode,
	forward,
	preventDefault,
	stop
} from '../handle';

describe('handle', () => {

	const makeEvent = (payload) => ({
		preventDefault: sinon.spy(),
		stopPropagation: sinon.spy(),
		...payload
	});

	it('should call only handler', function () {
		const handler = sinon.spy();
		const callback = handle(handler);

		callback(makeEvent());

		const expected = true;
		const actual = handler.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should call multiple handlers', function () {
		const handler1 = sinon.spy();
		const handler2 = sinon.spy();

		const callback = handle(handler1, handler2);

		callback(makeEvent());

		const expected = true;
		const actual = handler1.calledOnce && handler2.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should skip non-function handlers', function () {
		const handler = sinon.spy();
		const callback = handle(null, void 0, 0, 'purple', handler);

		callback(makeEvent());

		const expected = true;
		const actual = handler.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should not call handlers after one that returns true', function () {
		const handler1 = sinon.spy();
		const handler2 = sinon.spy();

		const callback = handle(handler1, () => true, handler2);

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

	it('should only call handler for specified prop', function () {
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

});
