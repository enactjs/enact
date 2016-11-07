import React from 'react';
import {mount} from 'enzyme';
import CheckboxItem from '../CheckboxItem';
import css from '../CheckboxItem.less';

describe('CheckboxItem Specs', () => {

	it('should have `translucent` icon class when not checked', function () {
		const checkboxItem = mount(
			<CheckboxItem>
				Hello CheckboxItem
			</CheckboxItem>
		);

		const expected = css.translucent;
		const actual = checkboxItem.find('ToggleItem').prop('iconClasses');

		expect(actual).to.equal(expected);
	});

	it('should not have `translucent` icon class when checked', function () {
		const checkboxItem = mount(
			<CheckboxItem checked>
				Hello CheckboxItem
			</CheckboxItem>
		);

		const expected = null;
		const actual = checkboxItem.find('ToggleItem').prop('iconClasses');

		expect(actual).to.equal(expected);
	});

});
