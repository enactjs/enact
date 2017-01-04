
import React from 'react';
import {mount} from 'enzyme';
import CheckboxItem from '../CheckboxItem';

describe('CheckboxItem Specs', () => {

	it('should always use the check icon', function () {

		const checkbox = mount(
			<CheckboxItem>
				Checkbox
			</CheckboxItem>
		);
		const checkboxIcon = checkbox.text().split('').shift();

		const expected = checkboxIcon;
		const actual = '✓';

		expect(actual).to.equal(expected);
	});
});
