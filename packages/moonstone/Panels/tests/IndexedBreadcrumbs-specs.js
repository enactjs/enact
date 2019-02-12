import React from 'react';
import {mount} from 'enzyme';
import IndexedBreadcrumbs from '../IndexedBreadcrumbs';

describe('IndexedBreadcrumbs', () => {

	// Suite-wide setup

	test('should generate {index} breadcrumbs when {index} <= {max}', () => {
		const index = 3;
		const max = 5;
		const breadcrumbs = IndexedBreadcrumbs('id', index, max);

		const expected = index;
		const actual = breadcrumbs.length;

		expect(actual).toBe(expected);
	});

	test('should generate {max} breadcrumbs when {index} > {max}', () => {
		const index = 6;
		const max = 1;
		const breadcrumbs = IndexedBreadcrumbs('id', index, max);

		const expected = max;
		const actual = breadcrumbs.length;

		expect(actual).toBe(expected);
	});

	test('should pad indices less than 10 with 0', () => {
		const breadcrumbs = IndexedBreadcrumbs('id', 1, 5);

		const expected = '01';
		// React creates two children, one for '<' and one for the index label
		const actual = breadcrumbs[0].props.children[1];

		expect(actual).toBe(expected);
	});

	test(
		'should call {onBreadcrumbClick} once when breadcrumb is clicked',
		() => {
			const handleClick = jest.fn();
			const subject = mount(
				<nav>
					{IndexedBreadcrumbs('id', 1, 1, handleClick)}
				</nav>
			);

			subject.find('Breadcrumb').simulate('click', {});

			const expected = 1;
			const actual = handleClick.mock.calls.length;

			expect(actual).toBe(expected);
		}
	);

});
