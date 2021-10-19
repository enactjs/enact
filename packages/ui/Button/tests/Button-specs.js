import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {Button, ButtonBase} from '../Button';

import css from '../Button.module.less';

describe('Button', () => {
	test('should return a DOM node reference for `componentRef`', () => {
		const ref = jest.fn();
		render(<Button ref={ref} />);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});

	test('should have \'disabled\' HTML attribute when \'disabled\' prop is provided', () => {
		render(<Button disabled>I am a disabled Button</Button>);
		const button = screen.getByRole('button');

		expect(button).toHaveAttribute('disabled');
	});

	test('should have default minWidth class', function () {
		render(<ButtonBase />);
		const button = screen.getByRole('button');

		const expected = css.minWidth;

		expect(button).toHaveClass(expected);
	});

	test('should have selected class when selected prop is set to true', () => {
		render(<ButtonBase selected />);
		const button = screen.getByRole('button');

		const expected = css.selected;

		expect(button).toHaveClass(expected);
	});

	test('should have pressed class when pressed prop is set to true', () => {
		render(<ButtonBase pressed />);
		const button = screen.getByRole('button');

		const expected = css.pressed;

		expect(button).toHaveClass(expected);
	});

	test('should have large class when size prop is set to large', () => {
		render(<ButtonBase size="large" />);
		const button = screen.getByRole('button');

		const expected = css.large;

		expect(button).toHaveClass(expected);
	});

	test('should have small class when size prop is set to small', () => {
		render(<ButtonBase size="small" />);
		const button = screen.getByRole('button');

		const expected = css.small;

		expect(button).toHaveClass(expected);
	});

	test('should have hasIcon class when icon prop is defined', () => {
		render(<Button icon>Hello Button!</Button>);
		const button = screen.getByRole('button');

		const expected = css.hasIcon;

		expect(button).toHaveClass(expected);
	});

	test('should call onClick', () => {
		const handleCLick = jest.fn();
		render(<Button onClick={handleCLick}>Hello Button!</Button>);
		const button = screen.getByRole('button');

		userEvent.click(button);

		const expected = 1;

		expect(handleCLick).toHaveBeenCalledTimes(expected);
	});

	test('should not call onClick when button is disabled', () => {
		const handleClick = jest.fn();
		render(<Button disabled onClick={handleClick}>Hello Button!</Button>);
		const button = screen.getByRole('button');

		userEvent.click(button);

		expect(handleClick).not.toHaveBeenCalled();
	});
});
