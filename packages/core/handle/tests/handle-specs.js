import sinon from 'sinon';
import {
	handle,
	adaptEvent,
	call,
	callOnEvent,
	forEventProp,
	forKeyCode,
	forProp,
	forward,
	forwardWithPrevent,
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

	test('should call only handler', () => {
		const handler = sinon.spy(returnsTrue);
		const callback = handle(handler);

		callback(makeEvent());

		const expected = true;
		const actual = handler.calledOnce;

		expect(actual).toBe(expected);
	});

	test('should call multiple handlers', () => {
		const handler1 = sinon.spy(returnsTrue);
		const handler2 = sinon.spy(returnsTrue);

		const callback = handle(handler1, handler2);

		callback(makeEvent());

		const expected = true;
		const actual = handler1.calledOnce && handler2.calledOnce;

		expect(actual).toBe(expected);
	});

	test('should skip non-function handlers', () => {
		const handler = sinon.spy(returnsTrue);
		const callback = handle(null, void 0, 0, 'purple', handler);

		callback(makeEvent());

		const expected = true;
		const actual = handler.calledOnce;

		expect(actual).toBe(expected);
	});

	test('should not call handlers after one that returns false', () => {
		const handler1 = sinon.spy(returnsTrue);
		const handler2 = sinon.spy(returnsTrue);

		const callback = handle(handler1, returnsFalse, handler2);

		callback(makeEvent());

		const expected = false;
		const actual = handler2.calledOnce;

		expect(actual).toBe(expected);
	});

	test('should call stopPropagation on event', () => {
		const callback = handle(stop);
		const ev = makeEvent();
		callback(ev);

		const expected = true;
		const actual = ev.stopPropagation.calledOnce;

		expect(actual).toBe(expected);
	});

	test('should call preventDefault on event', () => {
		const callback = handle(preventDefault);
		const ev = makeEvent();
		callback(ev);

		const expected = true;
		const actual = ev.preventDefault.calledOnce;

		expect(actual).toBe(expected);
	});

	test('should call any method on event', () => {
		const callback = handle(callOnEvent('customMethod'));
		const ev = makeEvent({
			customMethod: sinon.spy()
		});
		callback(ev);

		const expected = true;
		const actual = ev.customMethod.calledOnce;

		expect(actual).toBe(expected);
	});

	test('should only call handler for specified keyCode', () => {
		const keyCode = 13;
		const handler = sinon.spy();
		const callback = handle(forKeyCode(keyCode), handler);

		callback(makeEvent());
		expect(handler.calledOnce).toBe(false);

		callback(makeEvent({keyCode}));
		expect(handler.calledOnce).toBe(true);
	});

	test('should only call handler for specified event prop', () => {
		const prop = 'index';
		const value = 0;
		const handler = sinon.spy();
		const callback = handle(forEventProp(prop, value), handler);

		// undefined shouldn't pass
		callback(makeEvent());
		expect(handler.calledOnce).toBe(false);

		// == check shouldn't pass
		callback(makeEvent({
			[prop]: false
		}));
		expect(handler.calledOnce).toBe(false);

		// === should pass
		callback(makeEvent({
			[prop]: value
		}));
		expect(handler.calledOnce).toBe(true);
	});

	test('should only call handler for specified prop', () => {
		const handler = sinon.spy();
		const callback = handle(forProp('checked', true), handler);

		// undefined shouldn't pass
		callback({}, {});
		expect(handler.calledOnce).toBe(false);

		// == check shouldn't pass
		callback({}, {checked: 1});
		expect(handler.calledOnce).toBe(false);

		// === should pass
		callback({}, {checked: true});
		expect(handler.calledOnce).toBe(true);
	});

	test(
		'should forward events to function specified in provided props',
		() => {
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

			expect(actual).toBe(expected);
		}
	);

	test(
		'should forwardWithPrevent events to function specified in provided props when preventDefault() hasn\'t been called',
		() => {
			const event = 'onMyClick';
			const handler = sinon.spy();

			const callback = handle(forwardWithPrevent(event), handler);

			callback();
			expect(handler.calledOnce).toBe(true);
		}
	);

	test(
		'should not forwardWithPrevent events to function specified in provided props when preventDefault() has been called',
		() => {
			const event = 'onMyClick';
			const handler = sinon.spy();

			const callback = handle(forwardWithPrevent(event), handler);

			// should stop chain when `preventDefault()` has been called
			callback({}, {
				'onMyClick': (ev) => ev.preventDefault()
			});
			expect(handler.calledOnce).toBe(false);
		}
	);

	test('should include object props as second arg when bound', () => {
		const componentInstance = {
			context: {},
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

		expect(actual).toBe(expected);
	});

	test('should include object context as third arg when bound', () => {
		const componentInstance = {
			context: {
				value: 1
			},
			props: {}
		};
		const handler = sinon.spy();
		const h = handle.bind(componentInstance);
		const callback = h(handler);
		callback();

		const expected = 1;
		const actual = handler.firstCall.args[2].value;

		expect(actual).toBe(expected);
	});

	describe('finally', () => {
		test('should call the finally callback when handle returns true', () => {
			const finallyCallback = sinon.spy();
			const callback = handle(returnsTrue).finally(finallyCallback);

			callback(makeEvent());

			const expected = true;
			const actual = finallyCallback.calledOnce;

			expect(actual).toBe(expected);
		});

		test(
			'should call the finally callback when handle returns false',
			() => {
				const finallyCallback = sinon.spy();
				const callback = handle(returnsFalse).finally(finallyCallback);

				callback(makeEvent());

				const expected = true;
				const actual = finallyCallback.calledOnce;

				expect(actual).toBe(expected);
			}
		);

		test(
			'should call the finally callback when handle throws an error',
			() => {
				const finallyCallback = sinon.spy();
				const callback = handle(() => {
					throw new Error('Something has gone awry ...');
				}).finally(finallyCallback);

				try {
					callback(makeEvent());
				} catch (e) {
					// we don't want the error to interrupt the test
				}

				const expected = true;
				const actual = finallyCallback.calledOnce;

				expect(actual).toBe(expected);
			}
		);
	});

	describe('#oneOf', () => {
		test('should call each handler until one passes', () => {
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

			expect(actual).toBe(expected);
		});

		test('should stop if the first handler passes', () => {
			const handler = sinon.spy(returnsTrue);
			const callback = oneOf(
				[returnsTrue, handler],
				[returnsTrue, handler],
				[returnsTrue, handler]
			);
			callback();

			const expected = 1;
			const actual = handler.callCount;

			expect(actual).toBe(expected);
		});

		test('should pass args to condition', () => {
			const handler = sinon.spy(returnsTrue);
			const callback = oneOf(
				[handler, returnsTrue]
			);
			const ev = {value: 1};
			callback(ev);

			const expected = ev;
			const actual = handler.firstCall.args[0];

			expect(actual).toBe(expected);
		});

		test('should pass args to handlers', () => {
			const handler = sinon.spy(returnsTrue);
			const callback = oneOf(
				[returnsTrue, handler]
			);
			const ev = {value: 1};
			callback(ev);

			const expected = ev;
			const actual = handler.firstCall.args[0];

			expect(actual).toBe(expected);
		});

		test(
			'should return true when the passed condition branch returns a truthy value',
			() => {
				const callback = oneOf(
					[returnsTrue, () => 'ok']
				);

				const expected = true;
				const actual = callback();

				expect(actual).toBe(expected);
			}
		);

		test(
			'should return false when the passed condition branch returns a falsy value',
			() => {
				const callback = oneOf(
					[returnsTrue, () => null]
				);

				const expected = false;
				const actual = callback();

				expect(actual).toBe(expected);
			}
		);

		test('should return false when no conditions pass', () => {
			const callback = oneOf(
				[returnsFalse, returnsTrue],
				[returnsFalse, returnsTrue]
			);

			const expected = false;
			const actual = callback();

			expect(actual).toBe(expected);
		});

		test('should support bound handlers', () => {
			const componentInstance = {
				props: {},
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

			expect(actual).toBe(expected);
		});

		test('should include object props as second arg when bound', () => {
			const componentInstance = {
				props: {
					value: 1
				},
				context: {}
			};
			const handler = sinon.spy();
			const o = oneOf.bind(componentInstance);
			const callback = o(
				[returnsTrue, handler]
			);
			callback();

			const expected = 1;
			const actual = handler.firstCall.args[1].value;

			expect(actual).toBe(expected);
		});

		test('should include object context as third arg when bound', () => {
			const componentInstance = {
				props: {},
				context: {
					value: 1
				}
			};
			const handler = sinon.spy();
			const o = oneOf.bind(componentInstance);
			const callback = o(
				[returnsTrue, handler]
			);
			callback();

			const expected = 1;
			const actual = handler.firstCall.args[2].value;

			expect(actual).toBe(expected);
		});

		test('should support finally callback', () => {
			const handler = sinon.spy();
			const callback = oneOf(
				[returnsFalse, returnsTrue],
				[returnsFalse, returnsTrue]
			).finally(handler);

			callback();

			const expected = true;
			const actual = handler.calledOnce;

			expect(actual).toBe(expected);
		});
	});

	describe('#adaptEvent', () => {
		test('should pass the adapted event payload to the provided handler', () => {
			const handler = sinon.spy();
			const onlyValue = ({value}) => ({value});
			const ev = {
				value: 1,
				message: 'ok'
			};

			adaptEvent(onlyValue, handler)(ev);

			const expected = {value: 1};
			const actual = handler.firstCall.args[0];

			expect(actual).toEqual(expected);
		});

		test('should pass additional arguments to the provided handler', () => {
			const handler = sinon.spy();
			const returnOne = () => 1;
			adaptEvent(returnOne, handler)(0, 2, 3);

			const expected = [1, 2, 3];
			const actual = handler.firstCall.args;

			expect(actual).toEqual(expected);
		});

		test('should support bound adapter function', () => {
			const obj = {
				adapt: () => 1
			};
			const handler = sinon.spy();
			const fn = adaptEvent(call('adapt'), handler).bind(obj);

			fn(0, 2, 3);

			const expected = [1, 2, 3];
			const actual = handler.firstCall.args;

			expect(actual).toEqual(expected);
		});

		test('should support bound handler function', () => {
			const obj = {
				handler: sinon.spy()
			};
			const returnOne = () => 1;
			const fn = adaptEvent(returnOne, call('handler')).bind(obj);

			fn(0, 2, 3);

			const expected = [1, 2, 3];
			const actual = obj.handler.firstCall.args;

			expect(actual).toEqual(expected);
		});
	});
});
