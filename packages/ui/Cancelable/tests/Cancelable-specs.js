import React from 'react';
import {mount, shallow} from 'enzyme';
import sinon from 'sinon';

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
				stopImmediatePropagation: sinon.spy()
			}
		};
	};

	/* eslint-disable react/jsx-no-bind */
	const returnsTrue = () => true;
	const stop = (ev) => ev.stopPropagation();

	test('should call onCancel from prop for escape key', () => {
		const handleCancel = sinon.spy(returnsTrue);
		const Comp = Cancelable(
			{onCancel: 'onCustomEvent'},
			Component
		);

		const subject = shallow(
			<Comp onCustomEvent={handleCancel} />
		);

		subject.simulate('keyup', makeKeyEvent(27));

		const expected = true;
		const actual = handleCancel.called;

		expect(actual).toBe(expected);
	});

	test('should only call onCancel for escape key by default', () => {
		const handleCancel = sinon.spy(returnsTrue);
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		const subject = shallow(
			<Comp />
		);

		subject.simulate('keyup', makeKeyEvent(27));

		const expected = true;
		const actual = handleCancel.calledOnce;

		expect(actual).toBe(expected);
	});

	test('should not call onCancel for non-escape key', () => {
		const handleCancel = sinon.spy(returnsTrue);
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		const subject = shallow(
			<Comp />
		);

		subject.simulate('keyup', makeKeyEvent(42));

		const expected = false;
		const actual = handleCancel.calledOnce;

		expect(actual).toBe(expected);
	});

	test('should stop propagation when handled', () => {
		const handleCancel = sinon.spy(stop);
		const keyEvent = makeKeyEvent(27);
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		const subject = shallow(
			<Comp />
		);

		subject.simulate('keyup', keyEvent);

		const expected = true;
		const actual = keyEvent.nativeEvent.stopImmediatePropagation.calledOnce;

		expect(actual).toBe(expected);
	});

	test('should not stop propagation for not handled', () => {
		const handleCancel = sinon.spy(returnsTrue);
		const keyEvent = makeKeyEvent(42);
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		const subject = shallow(
			<Comp />
		);

		subject.simulate('keyup', keyEvent);

		const expected = false;
		const actual = keyEvent.nativeEvent.stopImmediatePropagation.calledOnce;

		expect(actual).toBe(expected);
	});

	test('should forward to onKeyUp handler for any key', () => {
		const handleKeyUp = sinon.spy();
		const keyEvent = makeKeyEvent(42);
		const Comp = Cancelable(
			{onCancel: returnsTrue},
			Component
		);

		const subject = shallow(
			<Comp onKeyUp={handleKeyUp} />
		);

		subject.simulate('keyup', keyEvent);

		const expected = true;
		const actual = handleKeyUp.calledOnce;

		expect(actual).toBe(expected);
	});

	test('should call onCancel when additional cancel handlers pass', () => {
		const customCancelHandler = (ev) => ev.keyCode === 461;
		addCancelHandler(customCancelHandler);
		const handleCancel = sinon.spy(returnsTrue);
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		const subject = shallow(
			<Comp />
		);

		subject.simulate('keyup', makeKeyEvent(461));

		removeCancelHandler(customCancelHandler);

		const expected = true;
		const actual = handleCancel.calledOnce;

		expect(actual).toBe(expected);
	});

	test(
		'should bubble up the component tree when config handler does not call stopPropagation',
		() => {
			const handleCancel = sinon.spy(returnsTrue);
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
			const actual = handleCancel.callCount;

			expect(actual).toBe(expected);
		}
	);


	test(
		'should not bubble up the component tree when config handler calls stopPropagation',
		() => {
			const handleCancel = sinon.spy(stop);
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
			const actual = handleCancel.callCount;

			expect(actual).toBe(expected);
		}
	);

	test(
		'should bubble up the component tree when prop handler does not call stopPropagation',
		() => {
			const handleCancel = sinon.spy();
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

			const expected = true;
			const actual = handleCancel.called;

			expect(actual).toBe(expected);
		}
	);

	test(
		'should not bubble up the component tree when prop handler calls stopPropagation',
		() => {
			const handleCancel = sinon.spy();
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

			const expected = false;
			const actual = handleCancel.called;

			expect(actual).toBe(expected);
		}
	);

	describe('modal instances', () => {
		const customEventHandler = (ev) => {
			return ev.keyIdentifier === '27';
		};

		const makeKeyboardEvent = (keyCode) => {
			return new KeyboardEvent('keyup', {keyCode, code: keyCode, bubbles: true});
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
				const handleCancel = sinon.spy(returnsTrue);
				const Comp = Cancelable(
					{modal: true, onCancel: handleCancel},
					Component
				);

				mount(<Comp />);
				document.dispatchEvent(makeKeyboardEvent(27));

				const expected = true;
				const actual = handleCancel.called;

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
				const handleCancel = sinon.spy(returnsTrue);

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

				const expected = false;
				const actual = handleCancel.called;

				expect(actual).toBe(expected);
			}
		);
	});
});
