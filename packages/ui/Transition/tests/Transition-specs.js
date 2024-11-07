import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

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

		expect(handleShow).toBeCalledTimes(expected);
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

		expect(handleHide).toBeCalledTimes(expected);
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
});
