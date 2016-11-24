import React from 'react';
import {mount} from 'enzyme';
import CheckboxItem from '../CheckboxItem';
import css from '../CheckboxItem.less';

describe('CheckboxItem Specs', () => {

	it('should have `translucent` icon class when not selected', function () {
		const checkboxItem = mount(
			<CheckboxItem>
				Hello CheckboxItem
			</CheckboxItem>
		);

		const expected = css.translucent;
		const actual = checkboxItem.find('ToggleItem').prop('iconClasses');

		expect(actual).to.equal(expected);
	});

	it('should not have `translucent` icon class when selected', function () {
		const checkboxItem = mount(
			<CheckboxItem selected>
				Hello CheckboxItem
			</CheckboxItem>
		);

		const expected = '';
		const actual = checkboxItem.find('ToggleItem').prop('iconClasses');

		expect(actual).to.equal(expected);
	});

});
