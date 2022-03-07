import {fireEvent, render, screen} from '@testing-library/react';

import {addCancelHandler, Cancelable, removeCancelHandler} from '../Cancelable';

describe('Cancelable', () => {
	// Suite-wide setup
	const Component = ({children, className, onKeyUp, ...rest}) => (
		<div className={className} data-testid="cancelable" onKeyUp={onKeyUp} {...rest}>
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

	const returnsTrue = () => true;
	const stop = (ev) => ev.stopPropagation();

	test('should call onCancel with type from prop for escape key', () => {
		const handleCancel = jest.fn(returnsTrue);
		const Comp = Cancelable(
			{onCancel: 'onCustomEvent'},
			Component
		);
		render(<Comp onCustomEvent={handleCancel} />);
		const component = screen.getByTestId('cancelable');

		fireEvent.keyUp(component, makeKeyEvent(27));

		const expected = 1;
		const expectedType = {type: 'onCustomEvent'};
		const actual = handleCancel.mock.calls.length && handleCancel.mock.calls[0][0];

		expect(handleCancel).toHaveBeenCalledTimes(expected);
		expect(actual).toMatchObject(expectedType);
	});

	test('should only call onCancel with type for escape key by default', () => {
		const handleCancel = jest.fn(returnsTrue);
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		render(<Comp />);
		const component = screen.getByTestId('cancelable');

		fireEvent.keyUp(component, makeKeyEvent(27));

		const expected = 1;
		const expectedType = {type: 'onCancel'};
		const actual = handleCancel.mock.calls.length && handleCancel.mock.calls[0][0];

		expect(handleCancel).toHaveBeenCalledTimes(expected);
		expect(actual).toMatchObject(expectedType);
	});

	test('should not call onCancel for non-escape key', () => {
		const handleCancel = jest.fn(returnsTrue);
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		render(<Comp />);
		const component = screen.getByTestId('cancelable');

		fireEvent.keyUp(component, makeKeyEvent(42));

		expect(handleCancel).not.toHaveBeenCalled();
	});

	test('should stop propagation when handled', () => {
		const handleCancel = jest.fn(stop);
		const handleCancelParent = jest.fn(stop);
		const keyEvent = makeKeyEvent(27);
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		render(<div onKeyUp={handleCancelParent}><Comp /></div>);
		const component = screen.getByTestId('cancelable');

		fireEvent.keyUp(component, keyEvent);

		expect(handleCancelParent).not.toHaveBeenCalled();
	});

	test('should not stop propagation for not handled', () => {
		const handleCancel = jest.fn(returnsTrue);
		const handleCancelParent = jest.fn(returnsTrue);
		const keyEvent = makeKeyEvent(42);
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		render(<div onKeyUp={handleCancelParent}><Comp /></div>);
		const component = screen.getByTestId('cancelable');

		fireEvent.keyUp(component, keyEvent);

		const expected = 1;

		expect(handleCancelParent).toHaveBeenCalledTimes(expected);
	});

	test('should forward to onKeyUp handler for any key', () => {
		const handleKeyUp = jest.fn();
		const keyEvent = makeKeyEvent(42);
		const Comp = Cancelable(
			{onCancel: returnsTrue},
			Component
		);

		render(<Comp onKeyUp={handleKeyUp} />);
		const component = screen.getByTestId('cancelable');

		fireEvent.keyUp(component, keyEvent);

		const expected = 1;

		expect(handleKeyUp).toHaveBeenCalledTimes(expected);
	});

	test('should call onCancel when additional cancel handlers pass', () => {
		const customCancelHandler = (ev) => ev.keyCode === 461;
		addCancelHandler(customCancelHandler);
		const handleCancel = jest.fn(returnsTrue);
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		render(<Comp />);
		const component = screen.getByTestId('cancelable');

		fireEvent.keyUp(component, makeKeyEvent(461));
		removeCancelHandler(customCancelHandler);

		const expected = 1;

		expect(handleCancel).toHaveBeenCalledTimes(expected);
	});

	test('should bubble up the component tree when config handler does not call stopPropagation', () => {
		const handleCancel = jest.fn(returnsTrue);
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		render(
			<Comp>
				<Comp data-testid="second" className="second" />
			</Comp>
		);
		const secondComponent = screen.getByTestId('second');

		fireEvent.keyUp(secondComponent, makeKeyEvent(27));

		const expected = 2;

		expect(handleCancel).toHaveBeenCalledTimes(expected);
	});

	test('should not bubble up the component tree when config handler calls stopPropagation', () => {
		const handleCancel = jest.fn(stop);
		const Comp = Cancelable(
			{onCancel: handleCancel},
			Component
		);

		render(
			<Comp>
				<Comp data-testid="second" className="second" />
			</Comp>
		);
		const secondComponent = screen.getByTestId('second');

		fireEvent.keyUp(secondComponent, makeKeyEvent(27));

		const expected = 1;

		expect(handleCancel).toHaveBeenCalledTimes(expected);
	});

	test('should bubble up the component tree when prop handler does not call stopPropagation', () => {
		const handleCancel = jest.fn();
		const Comp = Cancelable(
			{onCancel: 'onCustomEvent'},
			Component
		);

		render(
			<Comp onCustomEvent={handleCancel}>
				<Comp data-testid="second" className="second" onCustomEvent={returnsTrue} />
			</Comp>
		);
		const secondComponent = screen.getByTestId('second');

		fireEvent.keyUp(secondComponent, makeKeyEvent(27));

		const expected = 1;

		expect(handleCancel).toHaveBeenCalledTimes(expected);
	});

	test('should not bubble up the component tree when prop handler calls stopPropagation', () => {
		const handleCancel = jest.fn();
		const Comp = Cancelable(
			{onCancel: 'onCustomEvent'},
			Component
		);

		render(
			<Comp onCustomEvent={handleCancel}>
				<Comp data-testid="second" className="second" onCustomEvent={stop} />
			</Comp>
		);
		const secondComponent = screen.getByTestId('second');

		fireEvent.keyUp(secondComponent, makeKeyEvent(27));

		expect(handleCancel).not.toHaveBeenCalled();
	});

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

		test('should invoke handler for cancel events dispatch to the window', () => {
			const handleCancel = jest.fn(returnsTrue);
			const Comp = Cancelable(
				{modal: true, onCancel: handleCancel},
				Component
			);

			render(<Comp />);
			document.dispatchEvent(makeKeyboardEvent(27));

			const expected = 1;

			expect(handleCancel).toHaveBeenCalledTimes(expected);
		});

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

			render(<First />);
			render(<Second />);

			document.dispatchEvent(makeKeyboardEvent(27));

			const expected = ['second', 'first'];

			expect(results).toEqual(expected);
		});

		test('should invoke nested modal handlers in LIFO order', () => {
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

			render(<First><Second /></First>);

			document.dispatchEvent(makeKeyboardEvent(27));

			const expected = ['second', 'first'];

			expect(results).toEqual(expected);
		});

		test('should not invoke modal handlers after one calls stopPropagation', () => {
			const handleCancel = jest.fn(returnsTrue);

			const First = Cancelable(
				{modal: true, onCancel: handleCancel},
				Component
			);
			const Second = Cancelable(
				{modal: true, onCancel: stop},
				Component
			);

			render(<First />);
			render(<Second />);

			document.dispatchEvent(makeKeyboardEvent(27));

			expect(handleCancel).not.toHaveBeenCalled();
		});
	});
});
