import React from 'react';
import {mount} from 'enzyme';
import DayPicker from '../DayPicker';

describe('DayPicker', () => {
	describe('#aria-label', () => {
		test(
			'should use title, selected long string when day is single selected',
			() => {
				const subject = mount(
					<DayPicker title="Day Picker" selected={0} />
				);

				const expected = 'Day Picker Sunday';
				const actual = subject.find('DayPicker').prop('aria-label');

				expect(actual).toBe(expected);
			}
		);

		test(
			'should use title, selected long string when day is multi selected',
			() => {
				const subject = mount(
					<DayPicker title="Day Picker" selected={[0, 1]} />
				);

				const expected = 'Day Picker Sunday, Monday';
				const actual = subject.find('DayPicker').prop('aria-label');

				expect(actual).toBe(expected);
			}
		);

		test('should be null when day is not selected', () => {
			const subject = mount(
				<DayPicker title="Day Picker" />
			);

			const expected = undefined; // eslint-disable-line no-undefined
			const actual = subject.find('DayPicker').prop('aria-label');

			expect(actual).toBe(expected);
		});

		test('should be null when every day is selected', () => {
			const subject = mount(
				<DayPicker title="Day Picker" everyDayText="every" selected={[0, 1, 2, 3, 4, 5, 6]} />
			);

			const expected = 'Day Picker every';
			const actual = subject.find('DayPicker').prop('aria-label');

			expect(actual).toBe(expected);
		});

		test('should be null when every weekday is selected', () => {
			const subject = mount(
				<DayPicker title="Day Picker" everyWeekdayText="weekday" selected={[1, 2, 3, 4, 5]} />
			);

			const expected = 'Day Picker weekday';
			const actual = subject.find('DayPicker').prop('aria-label');

			expect(actual).toBe(expected);
		});

		test('should be null when every weekend is selected', () => {
			const subject = mount(
				<DayPicker title="Day Picker" everyWeekendText="weekend" selected={[0, 6]} />
			);

			const expected = 'Day Picker weekend';
			const actual = subject.find('DayPicker').prop('aria-label');

			expect(actual).toBe(expected);
		});
	});
});
