import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from "@testing-library/user-event";

import Item from '../Item';

const tap = (node) => {
	fireEvent.mouseDown(node);
	fireEvent.mouseUp(node);
};

describe('Item', () => {

	test('should create an item', () => {
		render(<Item>I am an item</Item>);
		const actual = screen.getByText('I am an item');

		expect(actual).toBeInTheDocument();
	})

	test('should create a disabled item', () => {
		render(<Item disabled>I am a disabled item</Item>);
		const actual = screen.getByText('I am a disabled item');

		expect(actual).toHaveAttribute('disabled');
	})

	describe('events', () => {
		test('should call onTap when tapped', () => {
			const handleClick = jest.fn();
			render(<Item onTap={handleClick}>I am a normal item</Item>);
			const item = screen.getByText('I am a normal item');

			tap(item);

			const expected = 1;
			const actual = handleClick.mock.calls.length;

			expect(actual).toBe(expected);
		});

		test('should not call onTap when tapped and disabled', () => {
			const handleClick = jest.fn();
			render(<Item disabled onTap={handleClick}>I am a disabled item</Item>);
			const item = screen.getByText('I am a disabled item');

			tap(item);

			const expected = 0;
			const actual = handleClick.mock.calls.length;

			expect(actual).toBe(expected);
		});

		test('should call onClick when clicked', () => {
			const handleClick = jest.fn();
			render(<Item onClick={handleClick}>I am a normal Item</Item>);
			const item = screen.getByText('I am a normal Item');

			userEvent.click(item);

			const expected = 1;
			const actual = handleClick.mock.calls.length;

			expect(actual).toBe(expected);
		});

		test('should not call onClick when clicked and disabled', () => {
			const handleClick = jest.fn();
			render(<Item disabled onClick={handleClick}>I am a disabled Item</Item>);
			const item = screen.getByText('I am a disabled Item');

			userEvent.click(item);

			const expected = 0;
			const actual = handleClick.mock.calls.length;

			expect(actual).toBe(expected);
		});
	});
});
