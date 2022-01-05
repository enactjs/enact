import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import Layout, {Cell} from '../Layout';

describe('Layout Specs', () => {
	const layoutPropAlign = [
		['baseline', 'baseline'],
		['center', 'center'],
		['end', 'flex-end'],
		['start', 'flex-start']
	];

	layoutPropAlign.forEach(([value, resolved]) => {
		test(`should apply '${resolved}' style value given an align prop value of "${value}"`, () => {
			render(<Layout align={value}><Cell>Body</Cell></Layout>);
			const layout = screen.getByText('Body').parentElement;

			const expected = resolved;

			expect(layout).toHaveStyle({'align-items': expected});
		});
	});

	test('should apply a class for inline', () => {
		render(<Layout inline><Cell>Body</Cell></Layout>);
		const layout = screen.getByText('Body').parentElement;

		const expected = 'inline';

		expect(layout).toHaveClass(expected);
	});

	// Tests for prop and className combinations
	const propStyleCombination = [
		['orientation', ['horizontal', 'vertical']]
	];

	propStyleCombination.forEach(([prop, vals]) => {
		vals.forEach((value) => {
			test(`should apply classes for ${prop}`, () => {
				const propValue = {
					[prop]: value
				};
				render(<Layout {...propValue}><Cell>Body</Cell></Layout>);
				const layout = screen.getByText('Body').parentElement;

				const expected = value;

				expect(layout).toHaveClass(expected);
			});
		});
	});

	// Test for boolean classes
	const cellBooleanPropClasses = [
		'shrink'
	];

	cellBooleanPropClasses.forEach((prop) => {
		test(`should apply a class for ${prop}`, () => {
			const props = {
				[prop]: true
			};
			render(<Cell {...props}>Body</Cell>);
			const layout = screen.getByText('Body');

			const expected = prop;

			expect(layout).toHaveClass(expected);
		});
	});

	const cellPropSize = [
		['size', ['100px', '50%', '5em']]
	];

	cellPropSize.forEach(([prop, vals]) => {
		vals.forEach((value) => {
			test(`should apply flexBasis styles the size prop value ${value}`, () => {
				const propValue = {
					[prop]: value
				};
				render(<Layout><Cell {...propValue}>Body</Cell></Layout>);
				const layoutCell = screen.getByText('Body');

				const expected = value;

				expect(layoutCell).toHaveStyle({'flex-basis': expected});
			});
		});
	});

	test('should return a DOM node reference for `componentRef` on `Layout`', () => {
		const ref = jest.fn();
		render(<Layout ref={ref} />);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});

	test('should return a DOM node reference for `componentRef` on `Cell`', () => {
		const ref = jest.fn();
		render(<Cell ref={ref} />);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});
});
