import {mount} from 'enzyme';
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

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

	test('should have default minWidth', function () {
		render(<ButtonBase />);
		const button = screen.getByRole('button');

		const expected = css.minWidth;

		expect(button).toHaveClass(expected);
	});
});
