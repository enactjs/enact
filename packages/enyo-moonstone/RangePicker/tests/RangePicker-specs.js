import React from 'react';
import {mount} from 'enzyme';
import RangePicker from '../RangePicker';

describe('RangePicker Specs', () => {
	it('should render a single child with the current value', function () {
		const picker = mount(
			<RangePicker min={-10} max={20} value={10} />
		);

		const expected = '10';
		const actual = picker.find('PickerItem').text();

		expect(actual).to.equal(expected);
	});
});

