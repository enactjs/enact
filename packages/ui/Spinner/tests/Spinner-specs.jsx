import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import {SpinnerBase} from '../Spinner';
import {FloatingLayerDecorator} from '../../FloatingLayer';

describe('Spinner Specs', () => {
	test('should have centered class when centered prop equals true', () => {
		render(<SpinnerBase centered component="div">Loading...</SpinnerBase>);
		const spinner = screen.getByText('Loading...');

		const expected = 'centered';

		expect(spinner).toHaveClass(expected);
	});

	test('should not have content class when Spinner has no children', () => {
		render(<SpinnerBase component="div" data-testid="spinner" />);
		const spinner = screen.getByTestId('spinner');

		const expected = 'content';

		expect(spinner).not.toHaveClass(expected);
	});

	test('should have no scrim class when blockClickOn prop equals container', () => {
		render(<SpinnerBase blockClickOn="container" component="div" data-testid="spinner" />);
		const spinnerContainer = screen.getByTestId('spinner').previousElementSibling;

		const expected = 'scrim';

		expect(spinnerContainer).not.toHaveClass(expected);
	});

	test('should have scrim class when blockClickOn prop equals container and when scrim prop equals true', () => {
		render(<SpinnerBase blockClickOn="container" component="div" data-testid="spinner" scrim />);
		const spinnerContainer = screen.getByTestId('spinner').previousElementSibling;

		const expected = 'scrim';

		expect(spinnerContainer).toHaveClass(expected);
	});

	test('should have FloatingLayer when blockClickOn prop equals screen', () => {
		const Root = FloatingLayerDecorator('div');
		render(
			<Root>
				<SpinnerBase blockClickOn="screen" component="div" data-testid="spinner" />
			</Root>
		);

		const spinner = screen.getByTestId('spinner');

		expect(spinner).toBeInTheDocument();
		expect(spinner.parentElement.parentElement.id).toBe('floatLayer');
	});
});
