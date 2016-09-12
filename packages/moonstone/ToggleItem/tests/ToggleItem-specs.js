
import React from 'react';
import {mount} from 'enzyme';
import {ToggleItemBase} from '../ToggleItem';

describe('ToggleItem Specs', () => {

	it('should create a \<label\> tag with an \<input\> child', function () {
		const toggleItem = mount(
			<ToggleItemBase>
				Toggle Item
			</ToggleItemBase>
		);
		const expected = 1;
		const actual = toggleItem.find('label').find('input').length;

		expect(actual).to.equal(expected);
	});

	it('should create \<input type="checkbox"\> by default', function () {
		const toggleItem = mount(
			<ToggleItemBase>
				Toggle Item
			</ToggleItemBase>
		);
		const expected = 1;
		const actual = toggleItem.find('input[type="checkbox"]').length;

		expect(actual).to.equal(expected);
	});

	it('should create \<input type="radio"\> when prop \'multi\' is false', function () {
		const toggleItem = mount(
			<ToggleItemBase multi={false}>
				Toggle Item
			</ToggleItemBase>
		);
		const expected = 1;
		const actual = toggleItem.find('input[type="radio"]').length;

		expect(actual).to.equal(expected);
	});

	it('should create an \<Icon\> when a non-element is passed to \'icon\'', function () {
		const toggleItem = mount(
			<ToggleItemBase icon="star">
				Toggle Item
			</ToggleItemBase>
		);

		const expected = 1;
		const actual = toggleItem.find('Icon').length;

		expect(actual).to.equal(expected);
	});

	it('should not create an \<Icon\> when an element is passed to \'icon\'', function () {
		const icon = <span>*</span>;
		const toggleItem = mount(
			<ToggleItemBase icon={icon}>
				Toggle Item
			</ToggleItemBase>
		);
		const expected = 0;
		const actual = toggleItem.find('Icon').length;

		expect(actual).to.equal(expected);
	});

});
