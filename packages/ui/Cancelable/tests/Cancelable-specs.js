import React from 'react';
import {mount, shallow} from 'enzyme';

import {addCancelHandler, Cancelable, removeCancelHandler} from '../Cancelable';

describe('Cancelable', () => {

	// Suite-wide setup
	// eslint-disable-next-line
	const Component = ({children, className, onKeyUp}) => (
		<div onKeyUp={onKeyUp} className={className}>
			{children}
		</div>
	);

	const makeKeyEvent = (keyCode) => {
		return {
			keyCode,
			nativeEvent: {
				stopImmediatePropagation: jest.fn()
			}
		};
	};

	/* eslint-disable react/jsx-no-bind */
	const returnsTrue = () => true;
	const stop = (ev) => ev.stopPropagation();

	test('should call onCancel from prop for escape key', () => {
		const handleCancel = jest.fn(returnsTrue);
		const Comp = Cancelable(
			{onCancel: 'onCustomEvent'},
			Component
		);

		const subject = shallow(
			<Comp onCustomEvent={handleCancel} />
		);

		subject.simulate('keyup', makeKeyEvent(27));

		const expected = 1;
		const actual = handleCancel.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test('should only call onCancel for escape key by default', () => {
		const handleCancel = jest.fn(returnsTrue);
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		const subject = shallow(
			<Comp />
		);

		subject.simulate('keyup', makeKeyEvent(27));

		const expected = 1;
		const actual = handleCancel.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test('should not call onCancel for non-escape key', () => {
		const handleCancel = jest.fn(returnsTrue);
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		const subject = shallow(
			<Comp />
		);

		subject.simulate('keyup', makeKeyEvent(42));

		const expected = 0;
		const actual = handleCancel.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test('should stop propagation when handled', () => {
		const handleCancel = jest.fn(stop);
		const keyEvent = makeKeyEvent(27);
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		const subject = shallow(
			<Comp />
		);

		subject.simulate('keyup', keyEvent);

		const expected = 1;
		const actual = keyEvent.nativeEvent.stopImmediatePropagation.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test('should not stop propagation for not handled', () => {
		const handleCancel = jest.fn(returnsTrue);
		const keyEvent = makeKeyEvent(42);
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		const subject = shallow(
			<Comp />
		);

		subject.simulate('keyup', keyEvent);

		const expected = 0;
		const actual = keyEvent.nativeEvent.stopImmediatePropagation.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test('should forward to onKeyUp handler for any key', () => {
		const handleKeyUp = jest.fn();
		const keyEvent = makeKeyEvent(42);
		const Comp = Cancelable(
			{onCancel: returnsTrue},
			Component
		);

		const subject = shallow(
			<Comp onKeyUp={handleKeyUp} />
		);

		subject.simulate('keyup', keyEvent);

		const expected = 1;
		const actual = handleKeyUp.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test('should call onCancel when additional cancel handlers pass', () => {
		const customCancelHandler = (ev) => ev.keyCode === 461;
		addCancelHandler(customCancelHandler);
		const handleCancel = jest.fn(returnsTrue);
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		const subject = shallow(
			<Comp />
		);

		subject.simulate('keyup', makeKeyEvent(461));

		removeCancelHandler(customCancelHandler);

		const expected = 1;
		const actual = handleCancel.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test(
		'should bubble up the component tree when config handler does not call stopPropagation',
		() => {
			const handleCancel = jest.fn(returnsTrue);
			const Comp = Cancelable(
				{onCancel: handleCancel},
				Component
			);

			const subject = mount(
				<Comp>
					<Comp className="second" />
				</Comp>
			);

			subject.find('Component.second').simulate('keyup', makeKeyEvent(27));

			const expected = 2;
			const actual = handleCancel.mock.calls.length;

			expect(actual).toBe(expected);
		}
	);


	test(
		'should not bubble up the component tree when config handler calls stopPropagation',
		() => {
			const handleCancel = jest.fn(stop);
			const Comp = Cancelable(
				{onCancel: handleCancel},
				Component
			);

			const subject = mount(
				<Comp>
					<Comp className="second" />
				</Comp>
			);

			subject.find('Component.second').simulate('keyup', makeKeyEvent(27));

			const expected = 1;
			const actual = handleCancel.mock.calls.length;

			expect(actual).toBe(expected);
		}
	);

	test(
		'should bubble up the component tree when prop handler does not call stopPropagation',
		() => {
			const handleCancel = jest.fn();
			const Comp = Cancelable(
				{onCancel: 'onCustomEvent'},
				Component
			);

			const subject = mount(
				<Comp onCustomEvent={handleCancel}>
					<Comp className="second" onCustomEvent={returnsTrue} />
				</Comp>
			);

			subject.find('Component.second').simulate('keyup', makeKeyEvent(27));

			const expected = 1;
			const actual = handleCancel.mock.calls.length;

			expect(actual).toBe(expected);
		}
	);

	test(
		'should not bubble up the component tree when prop handler calls stopPropagation',
		() => {
			const handleCancel = jest.fn();
			const Comp = Cancelable(
				{onCancel: 'onCustomEvent'},
				Component
			);

			const subject = mount(
				<Comp onCustomEvent={handleCancel}>
					<Comp className="second" onCustomEvent={stop} />
				</Comp>
			);

			subject.find('Component.second').simulate('keyup', makeKeyEvent(27));

			const expected = 0;
			const actual = handleCancel.mock.calls.length;

			expect(actual).toBe(expected);
		}
	);

	describe('modal instances', () => {
		const customEventHandler = (ev) => {
			return ev.keyIdentifier === '27';
		};

		const makeKeyboardEvent = (keyCode) => {
			return new window.KeyboardEvent('keyup', {keyCode, code: keyCode, bubbles: true});
		};

		beforeAll(() => {
			addCancelHandler(customEventHandler);
		});

		afterAll(() => {
			removeCancelHandler(customEventHandler);
		});

		test(
			'should invoke handler for cancel events dispatch to the window',
			() => {
				const handleCancel = jest.fn(returnsTrue);
				const Comp = Cancelable(
					{modal: true, onCancel: handleCancel},
					Component
				);

				mount(<Comp />);
				document.dispatchEvent(makeKeyboardEvent(27));

				const expected = 1;
				const actual = handleCancel.mock.calls.length;

				expect(actual).toBe(expected);
			}
		);

		test('should invoke modal handlers in LIFO order', () => {
			const results = [];
			const append = str => () => {
				results.push(str);
				return false;
			};

			const First = Cancelable(
				{modal: true, onCancel: append('first')},
				Component
			);
			const Second = Cancelable(
				{modal: true, onCancel: append('second')},
				Component
			);

			mount(<First />);
			mount(<Second />);

			document.dispatchEvent(makeKeyboardEvent(27));

			const expected = ['second', 'first'];
			const actual = results;

			expect(actual).toEqual(expected);
		});

		test(
			'should not invoke modal handlers after one calls stopPropagation',
			() => {
				const handleCancel = jest.fn(returnsTrue);

				const First = Cancelable(
					{modal: true, onCancel: handleCancel},
					Component
				);
				const Second = Cancelable(
					{modal: true, onCancel: stop},
					Component
				);

				mount(<First />);
				mount(<Second />);

				document.dispatchEvent(makeKeyboardEvent(27));

				const expected = 0;
				const actual = handleCancel.mock.calls.length;

				expect(actual).toBe(expected);
			}
		);

		test('should invoke modal handlers in LIFO order', () => {
			const results = [];
			const append = str => () => {
				results.push(str);
				return false;
			};

			const First = Cancelable(
				{modal: true, onCancel: append('first')},
				Component
			);
			const Second = Cancelable(
				{modal: true, onCancel: append('second')},
				Component
			);

			mount(<First><Second /></First>);

			document.dispatchEvent(makeKeyboardEvent(27));

			const expected = ['second', 'first'];
			const actual = results;

			expect(actual).toEqual(expected);
		});
	});
});
