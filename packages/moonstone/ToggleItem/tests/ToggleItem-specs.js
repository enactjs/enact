
import React from 'react';
import {mount} from 'enzyme';
import {ToggleItemBase} from '../ToggleItem';

describe('ToggleItem Specs', () => {

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
