import React from 'react';
import {mount} from 'enzyme';
import DateTimeDecorator from '../';

describe('DateTimeDecorator', () => {
	test(
		'should accept an updated JavaScript Date for its value prop',
		() => {
			const Picker = DateTimeDecorator({}, function PickerBase () {
				return <div />;
			});

			const subject = mount(
				<Picker
					title="Date"
					value={new Date(2000, 0, 1, 12, 30)}
					locale="en-US"
				/>
			);

			subject.setProps({
				value: new Date(2000, 0, 1, 12, 45)
			});

			const expected = 45;
			const actual = subject.find('PickerBase').prop('value').getMinutes();

			expect(actual).toBe(expected);
		}
	);

});
