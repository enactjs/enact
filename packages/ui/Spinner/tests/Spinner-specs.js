import {shallow} from 'enzyme';
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react'

import {SpinnerBase} from '../Spinner';

import css from '../Spinner.module.less';

describe('Spinner Specs', () => {
	test('should have centered class when centered prop equals true', () => {
		// const spinner = shallow(
		// 	<SpinnerBase component="div" centered>
		// 		Loading...
		// 	</SpinnerBase>
		// );
		render(<SpinnerBase component="div" centered>Loading...</SpinnerBase>);
		const spinner = screen.getByText('Loading...');

		const expected = css.centered;

		expect(spinner).toHaveClass(expected);

		// const expected = true;
		// const actual = spinner.find(`.${css.spinner}`).hasClass(css.centered);
		//
		// expect(actual).toBe(expected);
	});

	test('should not have content class when Spinner has no children', () => {
			// const spinner = shallow(
			// 	<SpinnerBase component="div" />
			// );
		render(<SpinnerBase data-testid="spinner" component="div" />);
		const spinner = screen.getByTestId('spinner');

		const expected = css.content;

		expect(spinner).not.toHaveClass(expected);

			// const expected = false;
			// const actual = spinner.find(`.${css.spinner}`).hasClass(css.content);
			//
			// expect(actual).toBe(expected);
	});

	test('should have no scrim class when blockClickOn prop equals container', () => {
		// const spinner = shallow(
		// 	<SpinnerBase component="div" blockClickOn="container" />
		// );
		render(<SpinnerBase data-testid="spinner" component="div" blockClickOn="container" />);
		const spinnerContainer = screen.getByTestId('spinner').previousElementSibling;

		const expected = css.scrim;

		expect(spinnerContainer).not.toHaveClass(expected);

		// const expected = false;
		// const actual = spinner.find(`.${css.scrim}`).exists();
		//
		// expect(actual).toBe(expected);
	});
	//
	test('should have scrim class when blockClickOn prop equals container and when scrim prop equals true', () => {
		// const spinner = shallow(
		// 	<SpinnerBase component="div" blockClickOn="container" scrim />
		// );
		render(<SpinnerBase data-testid="spinner" component="div" blockClickOn="container" scrim />);
		const spinnerContainer = screen.getByTestId('spinner').previousElementSibling;

		const expected = css.scrim;

		expect(spinnerContainer).toHaveClass(expected);

		// const expected = true;
		// const actual = spinner.find(`.${css.scrim}`).exists();
		//
		// expect(actual).toBe(expected);
	});
	//
	test('should have FloatingLayer when blockClickOn prop equals screen', () => {
		// const spinner = shallow(
		// 	<SpinnerBase component="div" blockClickOn="screen" />
		// );
		render(<SpinnerBase component="div" blockClickOn="screen" />);
		screen.debug();

		// const expected = true;
		// // FloatingLayer is wrapped by Cancelable so it's undiscoverable by name with shallow
		// // mounting
		// const actual = spinner.find('Cancelable').exists();
		//
		// expect(actual).toBe(expected);
	});
});
