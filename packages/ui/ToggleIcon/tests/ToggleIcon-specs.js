import {mount} from 'enzyme';
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
		// const subject = mount(
		// 	<ToggleIcon onToggle={handleToggle}>
		// 		star
		// 	</ToggleIcon>
		// );
		render(<ToggleIcon onToggle={handleToggle}>star</ToggleIcon>);
		const toggleIcon = screen.getByText('star');

		tap(toggleIcon);

		const expected = 1;

		expect(handleToggle).toHaveBeenCalledTimes(expected);

		// tap(subject);

		// const expected = 1;
		// const actual = handleToggle.mock.calls.length;
		//
		// expect(expected).toBe(actual);
	});

	test('should call onClick when clicked', () => {
		const handleClick = jest.fn();
		// const subject = mount(
		// 	<ToggleIcon onClick={handleClick}>
		// 		star
		// 	</ToggleIcon>
		// );
		render(<ToggleIcon onClick={handleClick}>star</ToggleIcon>);
		const toggleIcon = screen.getByText('star');

		userEvent.click(toggleIcon);

		const expected = 1;

		expect(handleClick).toHaveBeenCalledTimes(expected);

		// subject.simulate('click');
		//
		// const expected = 1;
		// const actual = handleClick.mock.calls.length;
		//
		// expect(expected).toBe(actual);
	});
	//
	test('should call onTap when tapped', () => {
		const handleTap = jest.fn();
		// const subject = mount(
		// 	<ToggleIcon onTap={handleTap}>
		// 		star
		// 	</ToggleIcon>
		// );
		render(<ToggleIcon onTap={handleTap}>star</ToggleIcon>);
		const toggleIcon = screen.getByText('star');

		tap(toggleIcon);

		const expected = 1;

		expect(handleTap).toHaveBeenCalledTimes(expected);

		// tap(subject);
		//
		// const expected = 1;
		// const actual = handleTap.mock.calls.length;
		//
		// expect(expected).toBe(actual);
	});
	//
	test('should call both onToggle and onTap when tapped', () => {
		const handleBoth = jest.fn();
		// const subject = mount(
		// 	<ToggleIcon onTap={handleBoth} onToggle={handleBoth}>
		// 		star
		// 	</ToggleIcon>
		// );
		render(<ToggleIcon onTap={handleBoth} onToggle={handleBoth}>star</ToggleIcon>);
		const toggleIcon = screen.getByText('star');

		tap(toggleIcon);

		const expected = 2;

		expect(handleBoth).toHaveBeenCalledTimes(expected);
		// const actual = handleBoth.mock.calls.length;
		//
		// expect(expected).toBe(actual);
	});
	//
	test('should return a DOM node reference for `componentRef`', () => {
		const ref = jest.fn();
		// mount(
		// 	<ToggleIcon ref={ref}>
		// 		star
		// 	</ToggleIcon>
		// );
		render(<ToggleIcon ref={ref}>star</ToggleIcon>);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});
});
