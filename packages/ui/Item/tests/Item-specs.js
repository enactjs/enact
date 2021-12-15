import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Item from '../Item';

const tap = (node) => {
	fireEvent.mouseDown(node);
	fireEvent.mouseUp(node);
};

describe('Item', () => {
	test('should render an item', () => {
		render(<Item>I am an item</Item>);
		const actual = screen.getByText('I am an item');

		expect(actual).toBeInTheDocument();
	});

	test('should render a disabled item', () => {
		render(<Item disabled>I am a disabled item</Item>);
		const actual = screen.getByText('I am a disabled item');

		expect(actual).toHaveAttribute('disabled');
	});

	test('should render an inline item', () => {
		render(<Item inline>I am an inline item</Item>);
		const actual = screen.getByText('I am an inline item');

		const expected = 'inline';

		expect(actual).toHaveClass(expected);
	});

	describe('events', () => {
		test('should call onTap when tapped', () => {
			const handleClick = jest.fn();
			render(<Item onTap={handleClick}>I am a normal item</Item>);
			const item = screen.getByText('I am a normal item');

			tap(item);

			const expected = 1;

			expect(handleClick).toHaveBeenCalledTimes(expected);
		});

		test('should not call onTap when tapped and disabled', () => {
			const handleClick = jest.fn();
			render(<Item disabled onTap={handleClick}>I am a disabled item</Item>);
			const item = screen.getByText('I am a disabled item');

			tap(item);

			expect(handleClick).not.toHaveBeenCalled();
		});

		test('should call onClick when clicked', () => {
			const handleClick = jest.fn();
			render(<Item onClick={handleClick}>I am a normal Item</Item>);
			const item = screen.getByText('I am a normal Item');

			userEvent.click(item);

			const expected = 1;

			expect(handleClick).toHaveBeenCalledTimes(expected);
		});

		test('should not call onClick when clicked and disabled', () => {
			const handleClick = jest.fn();
			render(<Item disabled onClick={handleClick}>I am a disabled Item</Item>);
			const item = screen.getByText('I am a disabled Item');

			userEvent.click(item);

			expect(handleClick).not.toHaveBeenCalled();
		});
	});
});
