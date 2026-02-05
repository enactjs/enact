import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ToggleIcon from '../ToggleIcon';

const tap = (node) => {
	fireEvent.mouseDown(node);
	fireEvent.mouseUp(node);
};

describe('ToggleIcon Specs', () => {
	test('should call onToggle when tapped', () => {
		const handleToggle = jest.fn();
		render(<ToggleIcon onToggle={handleToggle}>star</ToggleIcon>);
		const toggleIcon = screen.getByText('star');

		tap(toggleIcon);

		const expected = 1;

		expect(handleToggle).toHaveBeenCalledTimes(expected);
	});

	test('should call onClick when clicked', async () => {
		const handleClick = jest.fn();
		const user = userEvent.setup();
		render(<ToggleIcon onClick={handleClick}>star</ToggleIcon>);
		const toggleIcon = screen.getByText('star');

		await user.click(toggleIcon);

		const expected = 1;

		expect(handleClick).toHaveBeenCalledTimes(expected);
	});

	test('should call onTap when tapped', () => {
		const handleTap = jest.fn();
		render(<ToggleIcon onTap={handleTap}>star</ToggleIcon>);
		const toggleIcon = screen.getByText('star');

		tap(toggleIcon);

		const expected = 1;

		expect(handleTap).toHaveBeenCalledTimes(expected);
	});

	test('should call both onToggle and onTap when tapped', () => {
		const handleBoth = jest.fn();
		render(<ToggleIcon onTap={handleBoth} onToggle={handleBoth}>star</ToggleIcon>);
		const toggleIcon = screen.getByText('star');

		tap(toggleIcon);

		const expected = 2;

		expect(handleBoth).toHaveBeenCalledTimes(expected);
	});

	test('should return a DOM node reference for `componentRef`', () => {
		const ref = jest.fn();
		render(<ToggleIcon ref={ref}>star</ToggleIcon>);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});
});
