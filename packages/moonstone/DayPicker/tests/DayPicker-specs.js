import React from 'react';
import {shallow} from 'enzyme';
import {DayPickerBase} from '../DayPicker';

describe('DayPicker', () => {
	describe('#aria-label', () => {
		it('should use title, selected long string when day is single selected', function () {
			const subject = shallow(
				<DayPickerBase title="Day Picker" selected={0} />
			);

			const expected = 'Day Picker Sunday';
			const actual = subject.prop('aria-label');

			expect(actual).to.equal(expected);
		});

		it('should use title, selected long string when day is multi selected', function () {
			const subject = shallow(
				<DayPickerBase title="Day Picker" selected={[0, 1]} />
			);

			const expected = 'Day Picker Sunday, Monday';
			const actual = subject.prop('aria-label');

			expect(actual).to.equal(expected);
		});

		it('should be null when day is not selected', function () {
			const subject = shallow(
				<DayPickerBase title="Day Picker" />
			);

			const expected = null;
			const actual = subject.prop('aria-label');

			expect(actual).to.equal(expected);
		});

		it('should be null when every day is selected', function () {
			const subject = shallow(
				<DayPickerBase title="Day Picker" selected={[0, 1, 2, 3, 4, 5, 6]} />
			);

			const expected = null;
			const actual = subject.prop('aria-label');

			expect(actual).to.equal(expected);
		});

		it('should be null when every weekday is selected', function () {
			const subject = shallow(
				<DayPickerBase title="Day Picker" selected={[1, 2, 3, 4, 5]} />
			);

			const expected = null;
			const actual = subject.prop('aria-label');

			expect(actual).to.equal(expected);
		});

		it('should be null when every weekend is selected', function () {
			const subject = shallow(
				<DayPickerBase title="Day Picker" selected={[0, 6]} />
			);

			const expected = null;
			const actual = subject.prop('aria-label');

			expect(actual).to.equal(expected);
		});
	});
});
