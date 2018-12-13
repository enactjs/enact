import React from 'react';
import {mount} from 'enzyme';
import Layout, {Cell} from '../Layout';
import css from '../Layout.less';

describe('Layout Specs', () => {
	const layoutPropAlign = [
		['baseline', 'baseline'],
		['center', 'center'],
		['end', 'flex-end'],
		['start', 'flex-start']
	];

	layoutPropAlign.forEach(([value, resolved]) => {
		test(
			`should apply '${resolved}' style value given an align prop value of "${value}"`,
			() => {
				const wrapped = mount(
					<Layout align={value}><Cell>Body</Cell></Layout>
				);

				const expected = resolved;
				const actual = wrapped.find(`.${css.layout}`).prop('style').alignItems;

				expect(actual).toContain(expected);
			}
		);
	});

	test('should apply a class for inline', () => {
		const wrapped = mount(
			<Layout inline><Cell>Body</Cell></Layout>
		);

		const expected = true;
		const actual = wrapped.find(`.${css.layout}`).hasClass(css.inline);

		expect(actual).toBe(expected);
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
				const wrapped = mount(
					<Layout {...propValue}><Cell>Body</Cell></Layout>
				);

				const expected = true;
				const actual = wrapped.find(`.${css.layout}`).hasClass(css[value]);

				expect(actual).toBe(expected);
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
			const wrapped = mount(
				<Cell {...props}>Body</Cell>
			);

			const expected = true;
			const actual = wrapped.find(`.${css.cell}`).hasClass(css[prop]);

			expect(actual).toBe(expected);
		});
	});

	const cellPropSize = [
		['size', ['100px', '50%', '5em']]
	];

	cellPropSize.forEach(([prop, vals]) => {
		vals.forEach((value) => {
			test(
				`should apply flexBasis styles the size prop value ${value}`,
				() => {
					const propValue = {
						[prop]: value
					};
					const wrapped = mount(
						<Layout><Cell {...propValue}>Body</Cell></Layout>
					);

					const expected = value;
					const actual = wrapped.find(`.${css.cell}`).prop('style').flexBasis;

					expect(actual).toContain(expected);
				}
			);
		});
	});
});
