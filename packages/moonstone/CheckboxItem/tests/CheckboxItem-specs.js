
import React from 'react';
import {shallow} from 'enzyme';
import CheckboxItem from '../CheckboxItem';

describe('CheckboxItem Specs', () => {

	it('should always use the check icon', function () {

		const checkbox = shallow(
			<CheckboxItem>
				Checkbox
			</CheckboxItem>
		);

		const expected = 'check';
		const actual = checkbox.prop('icon');

		expect(actual).to.equal(expected);
	});
});
