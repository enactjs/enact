import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import {SpinnerBase} from '../Spinner';

import css from '../Spinner.module.less';

describe('Spinner Specs', () => {
	test('should have centered class when centered prop equals true', () => {
		render(<SpinnerBase centered component="div">Loading...</SpinnerBase>);
		const spinner = screen.getByText('Loading...');

		const expected = css.centered;

		expect(spinner).toHaveClass(expected);
	});

	test('should not have content class when Spinner has no children', () => {
		render(<SpinnerBase component="div" data-testid="spinner" />);
		const spinner = screen.getByTestId('spinner');

		const expected = css.content;

		expect(spinner).not.toHaveClass(expected);
	});

	test('should have no scrim class when blockClickOn prop equals container', () => {
		render(<SpinnerBase blockClickOn="container" component="div" data-testid="spinner" />);
		const spinnerContainer = screen.getByTestId('spinner').previousElementSibling;

		const expected = css.scrim;

		expect(spinnerContainer).not.toHaveClass(expected);
	});

	test('should have scrim class when blockClickOn prop equals container and when scrim prop equals true', () => {
		render(<SpinnerBase blockClickOn="container" component="div" data-testid="spinner" scrim />);
		const spinnerContainer = screen.getByTestId('spinner').previousElementSibling;

		const expected = css.scrim;

		expect(spinnerContainer).toHaveClass(expected);
	});

	// TODO This test is skipped because React Testing Library can't check if Spinner can have FloatingLayer
	test.skip('should have FloatingLayer when blockClickOn prop equals screen', () => {
		render(<SpinnerBase blockClickOn="screen" component="div" data-testid="spinner" />);
		const spinner = screen.getByTestId('spinner');

		const expected = true;
		// FloatingLayer is wrapped by Cancelable so it's undiscoverable by name
		const actual = spinner.find('Cancelable').exists();

		expect(actual).toBe(expected);
	});
});
