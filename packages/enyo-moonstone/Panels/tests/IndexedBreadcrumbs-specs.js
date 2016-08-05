import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import IndexedBreadcrumbs from '../IndexedBreadcrumbs';

describe('IndexedBreadcrumbs', () => {

	// Suite-wide setup

	it('should generate {index} breadcrumbs when {index} <= {max}', function () {
		const index = 3;
		const max = 5;
		const breadcrumbs = IndexedBreadcrumbs(index, max);

		const expected = index;
		const actual = breadcrumbs.length;

		expect(actual).to.equal(expected);
	});

	it('should generate {max} breadcrumbs when {index} > {max}', function () {
		const index = 6;
		const max = 1;
		const breadcrumbs = IndexedBreadcrumbs(index, max);

		const expected = max;
		const actual = breadcrumbs.length;

		expect(actual).to.equal(expected);
	});

	it('should pad indices less than 10 with 0', function () {
		const breadcrumbs = IndexedBreadcrumbs(1, 5);

		const expected = '01';
		// React creates two children, one for '<' and one for the index label
		const actual = breadcrumbs[0].props.children[1];

		expect(actual).to.equal(expected);
	});

	it('should call {onBreadcrumbClick} once when breadcrumb is clicked', function () {
		const handleClick = sinon.spy();
		const subject = mount(
			<nav>
				{IndexedBreadcrumbs(1, 1, handleClick)}
			</nav>
		);

		subject.find('Breadcrumb').simulate('click', {});

		const expected = true;
		const actual = handleClick.calledOnce;

		expect(actual).to.equal(expected);
	});

});
