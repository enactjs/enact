import React from 'react';
import {mount} from 'enzyme';
import Layout, {Cell} from '../Layout';
import css from '../Layout.less';

describe('Layout Specs', () => {
	// NOTE: Feature not yet implemented
	it.skip('should apply author classes', function () {
		const className = 'classA classB';

		const ChildNode = (props) => <Cell {...props}>Body</Cell>;

		const wrapped = mount(
			<Layout className={className}>
				<ChildNode />
			</Layout>
		);

		const expected = className;
		const actual = wrapped.find('ChildNode').prop('className');

		expect(actual).to.contain(expected);
	});

	// NOTE: Feature not yet implemented
	it.skip('should apply author styles', function () {
		const styles = {
			color: '#000000',
			backgroundColor: '#FFFFFF'
		};

		const ChildNode = (props) => <Cell {...props}>Body</Cell>;

		const wrapped = mount(
			<Layout style={styles}>
				<ChildNode />
			</Layout>
		);

		const expected = styles;
		const actual = wrapped.find('ChildNode').prop('style');

		expect(actual).to.equal(expected);
	});

	it('should apply a class for inline', function () {
		const wrapped = mount(
			<Layout inline><Cell>Body</Cell></Layout>
		);

		const expected = true;
		const actual = wrapped.hasClass(css.inline);

		expect(actual).to.equal(expected);
	});

	// Tests for prop and className combinations
	const propStyleCombination = [
		['orientation', ['horizontal', 'vertical']]
	];

	propStyleCombination.forEach(([prop, vals]) => {
		vals.forEach((value) => {
			it(`should apply classes for ${prop}`, function () {
				const propValue = {
					[prop]: value
				};
				const wrapped = mount(
					<Layout {...propValue}><Cell>Body</Cell></Layout>
				);

				const expected = true;
				const actual = wrapped.hasClass(css[value]);

				expect(actual).to.equal(expected);
			});
		});
	});

	// Test for boolean classes
	const cellBooleanPropClasses = [
		'fixed',
		'flexible'
	];

	cellBooleanPropClasses.forEach((prop) => {
		it(`should apply a class for ${prop}`, function () {
			const props = {
				[prop]: true
			};
			const wrapped = mount(
				<Cell {...props}>Body</Cell>
			);

			const expected = true;
			const actual = wrapped.hasClass(css[prop]);

			expect(actual).to.equal(expected);
		});
	});

	const cellPropSize = [
		['size', ['100px', '50%', '5em']]
	];

	cellPropSize.forEach(([prop, vals]) => {
		vals.forEach((value) => {
			it(`should apply flexBasis styles the size prop value ${value}`, function () {
				const propValue = {
					[prop]: value
				};
				const wrapped = mount(
					<Layout><Cell {...propValue}>Body</Cell></Layout>
				);

				const expected = value;
				const actual = wrapped.find(`.${css.cell}`).node.style.flexBasis;

				expect(actual).to.contain(expected);
			});
		});
	});
});
