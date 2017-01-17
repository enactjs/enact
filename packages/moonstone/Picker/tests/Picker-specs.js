import React from 'react';
import {mount} from 'enzyme';
import Picker from '../Picker';

describe('Picker Specs', () => {
	it('should render selected child wrapped with <PickerItem/>', function () {
		const picker = mount(
			<Picker value={1}>
				{[1, 2, 3, 4]}
			</Picker>
		);

		const expected = '2';
		const actual = picker.find('PickerItem').text();

		expect(actual).to.equal(expected);
	});

	it('should set the max of <Picker> to be one less than the number of children', function () {
		const picker = mount(
			<Picker value={1}>
				{[1, 2, 3, 4]}
			</Picker>
		);

		const expected = 3;
		const actual = picker.find('Picker').last().prop('max');

		expect(actual).to.equal(expected);
	});
});
