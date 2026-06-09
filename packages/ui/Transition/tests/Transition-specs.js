import '@testing-library/jest-dom';
import {act, fireEvent, render, screen} from '@testing-library/react';

import {ResizeContext} from '../../Resizable';
import Transition, {TransitionBase} from '../Transition';

describe('Transition Specs', () => {
	// NOTE: Feature not yet implemented
	test.skip('should apply author classes', function () {
		const className = 'classA classB';

		const ChildNode = (props) => <div {...props}>Body</div>;

		render(
			<Transition className={className}>
				<ChildNode />
			</Transition>
		);

		const expected = className;
		const actual = screen.getByText('Body');

		expect(actual).toHaveClass(expected);
	});

	// NOTE: Feature not yet implemented
	test.skip('should apply author styles', function () {
		const styles = {
			color: '#000000',
			backgroundColor: '#FFFFFF'
		};

		const ChildNode = (props) => <div {...props}>Body</div>;

		render(
			<Transition style={styles}>
				<ChildNode />
			</Transition>
		);

		const expected = styles;
		const actual = screen.getByText('Body');

		expect(actual).toHaveStyle(expected);
	});


	test('should apply \'shown\' class when visible', () => {
		render(<TransitionBase data-testid="transition" />);

		const expected = 'shown';
		const actual = screen.getByTestId('transition');

		expect(actual).toHaveClass(expected);
	});

	test('should apply \'hidden\' class when not visible', () => {
		render(<TransitionBase data-testid="transition" visible={false} />);

		const expected = 'hidden';
		const actual = screen.getByTestId('transition');

		expect(actual).toHaveClass(expected);
	});

	test('should apply \'shown\' class when visible with noAnimation', () => {
		render(<TransitionBase data-testid="transition" noAnimation />);

		const expected = 'shown';
		const actual = screen.getByTestId('transition');

		expect(actual).toHaveClass(expected);
	});

	test('should apply \'hidden\' class when not visible with noAnimation', () => {
		render(<TransitionBase data-testid="transition" noAnimation visible={false} />);

		const expected = 'hidden';
		const actual = screen.getByTestId('transition');

		expect(actual).toHaveClass(expected);
	});

	test('should fire \'onShow\' event with type when \'visible\' prop becomes true', () => {
		const handleShow = jest.fn();
		const ChildNode = (props) => <div {...props}>Body</div>;

		const {rerender} = render(
			<Transition noAnimation onShow={handleShow} visible={false}>
				<ChildNode />
			</Transition>
		);

		rerender(
			<Transition noAnimation onShow={handleShow} visible>
				<ChildNode />
			</Transition>
		);

		const expected = 1;
		const expectedType = {type: 'onShow'};
		const actual = handleShow.mock.calls.length && handleShow.mock.calls[0][0];

		expect(handleShow).toHaveBeenCalledTimes(expected);
		expect(actual).toMatchObject(expectedType);
	});

	test('should fire \'onHide\' event with type when \'visible\' prop becomes false', () => {
		const handleHide = jest.fn();
		const ChildNode = (props) => <div {...props}>Body</div>;

		const {rerender} = render(
			<Transition noAnimation onHide={handleHide} visible>
				<ChildNode />
			</Transition>
		);

		rerender(
			<Transition noAnimation onHide={handleHide} visible={false}>
				<ChildNode />
			</Transition>
		);

		const expected = 1;
		const expectedType = {type: 'onHide'};
		const actual = handleHide.mock.calls.length && handleHide.mock.calls[0][0];

		expect(handleHide).toHaveBeenCalledTimes(expected);
		expect(actual).toMatchObject(expectedType);
	});

	// Tests for prop and className combinations
	const directionCombination = [
		['up', 'up'],
		['right', 'right'],
		['down', 'down'],
		['left', 'left']
	];

	const durationCombination = [
		['short', 'short'],
		['medium', 'medium'],
		['long', 'long']
	];

	const timingFunctionCombination = [
		['ease', 'ease'],
		['ease-in', 'ease-in'],
		['ease-out', 'ease-out'],
		['ease-in-out', 'ease-in-out'],
		['ease-in-quart', 'ease-in-quart'],
		['ease-out-quart', 'ease-out-quart'],
		['linear', 'linear']
	];

	const propStyleCombination = [
		['duration', durationCombination],
		['direction', directionCombination],
		['timingFunction', timingFunctionCombination]
	];

	propStyleCombination.forEach(([prop, val]) => {
		val.forEach(([key, value]) => {
			test(`should apply classes for ${prop}="${value}"`, () => {
				const propValue = {
					[prop]: value
				};
				render(<Transition {...propValue} data-testid="transition" visible>Body</Transition>);

				const expected = key;
				const actual = screen.getByTestId('transition');

				expect(actual).toHaveClass(expected);
			});
		});
	});

	// type="clip"
	test('should set inner width when type="clip" and direction="right"', () => {
		render(<TransitionBase clipWidth={100} data-testid="transition" direction="right" type="clip">Body</TransitionBase>);

		const expected = {width: '100px'};
		const actual = screen.getByText('Body');

		expect(actual).toHaveStyle(expected);
	});

	test('should apply overflow hidden on root when type="clip"', () => {
		render(<TransitionBase clipWidth={100} data-testid="transition" direction="right" type="clip">Body</TransitionBase>);

		const expected = {overflow: 'hidden'};
		const actual = screen.getByTestId('transition');

		expect(actual).toHaveStyle(expected);
	});

	test('should set height on root when type="clip", direction="up", and visible', () => {
		render(<TransitionBase clipHeight={50} data-testid="transition" direction="up" type="clip">Body</TransitionBase>);

		const expected = {height: '50px'};
		const actual = screen.getByTestId('transition');

		expect(actual).toHaveStyle(expected);
	});

	// Custom duration paths.
	test('should set transitionDuration on inner style for a custom duration', () => {
		const actual = TransitionBase.computed.innerStyle({css: {}, duration: 200, type: 'slide'});

		const expected = {transitionDuration: '200ms'};

		expect(actual).toEqual(expected);
	});

	test('should set transitionDuration on style for type="clip" with a custom duration', () => {
		const actual = TransitionBase.computed.style({clipHeight: 10, css: {}, direction: 'up', duration: '3s', type: 'clip', visible: true});

		const expected = {height: 10, overflow: 'hidden', transitionDuration: '3s'};

		expect(actual).toMatchObject(expected);
	});

	// transitionend handling
	test('should fire \'onShow\' on transitionend when visible', () => {
		const handleShow = jest.fn();

		render(<Transition onShow={handleShow} visible>Body</Transition>);

		fireEvent.transitionEnd(screen.getByText('Body'));

		const expected = 1;

		expect(handleShow).toHaveBeenCalledTimes(expected);
	});

	test('should fire \'onHide\' on transitionend when not visible', () => {
		const handleHide = jest.fn();

		const {rerender} = render(<Transition onHide={handleHide} visible>Body</Transition>);
		rerender(<Transition onHide={handleHide} visible={false}>Body</Transition>);

		fireEvent.transitionEnd(screen.getByText('Body'));

		const expected = 1;

		expect(handleHide).toHaveBeenCalledTimes(expected);
	});

	test('should forward \'onTransitionEnd\'', () => {
		const handleTransitionEnd = jest.fn();

		render(<Transition onTransitionEnd={handleTransitionEnd} visible>Body</Transition>);

		fireEvent.transitionEnd(screen.getByText('Body'));

		const expected = 1;

		expect(handleTransitionEnd).toHaveBeenCalledTimes(expected);
	});

	// The main accordion/header path: animated clip transition driven by `transitionend`
	// across a full show → hide → show cycle
	test('should fire \'onHide\' then \'onShow\' over a visible true → false → true cycle with type="clip"', () => {
		const handleHide = jest.fn();
		const handleShow = jest.fn();

		const {rerender} = render(
			<Transition direction="up" onHide={handleHide} onShow={handleShow} type="clip" visible>Body</Transition>
		);

		// true → false: the hide animation runs and completes.
		rerender(<Transition direction="up" onHide={handleHide} onShow={handleShow} type="clip" visible={false}>Body</Transition>);
		fireEvent.transitionEnd(screen.getByText('Body'));

		expect(handleHide).toHaveBeenCalledTimes(1);
		expect(handleShow).not.toHaveBeenCalled();

		// false → true: the show animation runs and completes.
		rerender(<Transition direction="up" onHide={handleHide} onShow={handleShow} type="clip" visible>Body</Transition>);
		fireEvent.transitionEnd(screen.getByText('Body'));

		expect(handleShow).toHaveBeenCalledTimes(1);
		expect(handleHide).toHaveBeenCalledTimes(1);
	});

	// ResizeContext registration
	test('should register with ResizeContext and unregister on unmount', () => {
		const unregister = jest.fn();
		const register = jest.fn(() => ({unregister}));

		const {unmount} = render(
			<ResizeContext.Provider value={register}>
				<Transition visible>Body</Transition>
			</ResizeContext.Provider>
		);

		expect(register).toHaveBeenCalled();

		unmount();

		expect(unregister).toHaveBeenCalled();
	});

	test('should re-measure when notified through ResizeContext', () => {
		let resizeHandler;
		const register = jest.fn((handler) => {
			resizeHandler = handler;
			return {unregister: jest.fn()};
		});

		render(
			<ResizeContext.Provider value={register}>
				<Transition visible>Body</Transition>
			</ResizeContext.Provider>
		);

		// Invoking the registered handler nulls the cached measurement and triggers a re-measure on the next layout commit.
		act(() => {
			resizeHandler();
		});

		expect(register).toHaveBeenCalled();
	});

	test('should defer rendering then pre-measure when mounted with visible={false}', () => {
		jest.useFakeTimers();

		try {
			render(<Transition visible={false}>Body</Transition>);

			// INIT state — children are not rendered yet.
			expect(screen.queryByText('Body')).toBeNull();

			// The idle Job moves the state to MEASURE, rendering the (hidden) children so they can be measured.
			act(() => {
				jest.runOnlyPendingTimers();
			});

			expect(screen.getByText('Body')).toBeInTheDocument();
		} finally {
			jest.useRealTimers();
		}
	});
});
