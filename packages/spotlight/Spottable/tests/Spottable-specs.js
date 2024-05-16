import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import Spottable from '../Spottable';

const id = 'test-spottable';

describe.skip('Spottable', () => {
	test('should add the spottable class', () => {
		const Component = Spottable('div');
		render(<Component data-testid={id} />);
		const div = screen.getByTestId(id);

		const expectedClass = 'spottable';

		expect(div).toHaveClass(expectedClass);
	});

	test('should add the spottable class to a {disabled} component', () => {
		const Component = Spottable('div');
		render(<Component data-testid={id} disabled />);
		const div = screen.getByTestId(id);

		const expectedClass = 'spottable';

		expect(div).toHaveClass(expectedClass);
	});

	test('should not add the spottable class to a {spotlightDisabled} component', () => {
		const Component = Spottable('div');
		render(<Component data-testid={id} spotlightDisabled />);
		const div = screen.getByTestId(id);

		const expectedClass = 'spottable';

		expect(div).not.toHaveClass(expectedClass);
	});

	test('should emit {onSpotlightDisappear} when unmounted while focused', () => {
		const spy = jest.fn();
		const Component = Spottable('div');
		const {unmount} = render(<Component data-testid={id} onSpotlightDisappear={spy} />);
		const div = screen.getByTestId(id);

		div.focus();
		unmount();

		const expected = 1;

		expect(spy).toHaveBeenCalledTimes(expected);
		expect(spy).toBeCalledWith({type: 'onSpotlightDisappear'});
	});

	describe('shouldComponentUpdate', () => {
		test('should re-render when a non-Spottable prop changes', () => {
			const spy = jest.fn((props) => <div {...props} />);
			const Component = Spottable(spy);
			const {rerender} = render(<Component />);

			rerender(<Component data-id="123" />);

			const expected = 3;

			expect(spy).toHaveBeenCalledTimes(expected);
		});

		test('should re-render when {selectionKeys} changes', () => {
			const spy = jest.fn((props) => <div {...props} />);
			const Component = Spottable(spy);
			const {rerender} = render(<Component selectionKeys={[1, 2, 3]} />);

			rerender(<Component selectionKeys={[2, 1, 3]} />);

			const expected = 3;

			expect(spy).toHaveBeenCalledTimes(expected);
		});

		test('should not re-render when focused', () => {
			const spy = jest.fn((props) => <div {...props} />);
			const Component = Spottable(spy);
			render(<Component data-testid={id} />);
			const div = screen.getByTestId(id);

			div.focus();

			const expected = 2;

			expect(spy).toHaveBeenCalledTimes(expected);
		});
	});
});
