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

		const expected = css.inline;
		const actual = wrapped.childAt(0).prop('className');

		expect(actual).to.contain(expected);
	});

	// Tests for prop and className combinations
	const propStyleCombination = [
		['orientation', [css.horizontal, css.vertical]]
	];

	// Test not ready yet
	propStyleCombination.forEach(([prop, val]) => {
		it.skip(`should apply classes for ${prop}`, function () {
			const propValue = {
				[prop]: true
			};
			const wrapped = mount(
				<Layout {...propValue}><Cell>Body</Cell></Layout>
			);

			const expected = val;
			const actual = wrapped.childAt(0).prop('className');

			expect(actual).to.contain(expected);
		});
	});

	// Test for boolean classes
	const cellBooleanPropClasses = [
		['fixed', css.fixed],
		['flexible', css.flexible]
	];

	cellBooleanPropClasses.forEach(([prop, val]) => {
		it(`should apply a class for ${prop}`, function () {
			const props = {
				[prop]: true
			};
			const wrapped = mount(
				<Cell {...props}>Body</Cell>
			);

			const expected = val;
			const actual = wrapped.childAt(0).prop('className');

			expect(actual).to.contain(expected);
		});
	});

	const cellPropSize  = [
		['size', ['100px', '50%', '5em']]
	];

	cellPropSize.forEach(([prop, vals]) => {
		vals.forEach(([value]) => {
			it(`should apply flexBasis styles the size prop value ${value}`, function () {
				const propValue = {
					[prop]: value
				};
				const wrapped = mount(
					<Layout><Cell {...propValue}>Body</Cell></Layout>
				);

				const expected = value;
				const actual = wrapped.childAt(0).style.flexBasis;

				expect(actual).to.contain(expected);
			});
		});
	});
});
