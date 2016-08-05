import React from 'react';
import {mount} from 'enzyme';
import {ItemBase} from '../Item';

describe('Item Specs', () => {

	it('should create an Item that is enabled by default', function () {
		const item = mount(
			<ItemBase>I am an Item</ItemBase>
		);

		const expected = 0;
		const actual = item.find({disabled: true}).length;

		expect(actual).to.equal(expected);
	});

	it('should have \'disabled\' HTML attribute when \'disabled=true\'', function () {
		const item = mount(
			<ItemBase disabled>I am a disabled Item</ItemBase>
		);

		const expected = 1;
		const actual = item.find({disabled: true}).length;

		expect(actual).to.equal(expected);
	});

	it('should only render a single \<div\> regardless of the number of children', function () {
		const children = ['Line 1', 42, ['foo', 'bar']];
		const item = mount(
			<ItemBase>{children}</ItemBase>
		);

		const expected = 1;
		const actual = item.find('div').length;

		expect(actual).to.equal(expected);
	});
});
