import React from 'react';
import {mount} from 'enzyme';
import {TimePicker, TimePickerBase} from '../TimePicker';
import css from '../TimePicker.less';

describe('TimePicker', () => {

	// Suite-wide setup

	test('should not generate a label when value is undefined', () => {
		const subject = mount(
			<TimePicker title="Time" />
		);

		const expected = null;
		const actual = subject.find('ExpandableItem').prop('label');

		expect(actual).toBe(expected);
	});

	test(
		'should emit an onChange event when changing a component picker',
		() => {
			const handleChange = jest.fn();
			const subject = mount(
				<TimePicker onChange={handleChange} open title="Time" value={new Date(2000, 6, 15, 3, 30)} />
			);

			const base = subject.find('DateComponentRangePicker').first();
			base.prop('onChange')({value: 0});

			const expected = 1;
			const actual = handleChange.mock.calls.length;

			expect(actual).toBe(expected);
		}
	);

	test('should omit labels when noLabels is true', () => {
		const subject = mount(
			<TimePickerBase hour={1} meridiem={0} meridiems={['am', 'pm']} minute={1} noLabels open order={['h', 'm']} title="Time" />
		);

		const expected = 2;
		const actual = subject.find(`.${css.timeComponents}`).children().filterWhere(c => !c.prop('label')).length;

		expect(actual).toBe(expected);
	});

	test('should create pickers arranged by order', () => {
		const subject = mount(
			<TimePickerBase hour={1} meridiem={0} meridiems={['am', 'pm']} minute={1} open order={['h', 'm']} title="Time" />
		);

		const expected = ['hour', 'minute'];
		const actual = subject.find(`.${css.timeComponents}`).children().map(c => c.prop('label'));

		expect(actual).toEqual(expected);
	});

	test('should accept a JavaScript Date for its value prop', () => {
		const subject = mount(
			<TimePicker open title="Date" value={new Date(2000, 0, 1, 12, 30)} />
		);

		const minutePicker = subject.find(`.${css.minutesComponents}`).at(0);

		const expected = 30;
		const actual = minutePicker.prop('value');

		expect(actual).toBe(expected);
	});

	test(
		'should accept an updated JavaScript Date for its value prop',
		() => {
			const subject = mount(
				<TimePicker open title="Date" value={new Date(2000, 0, 1, 12, 30)} />
			);

			subject.setProps({
				value: new Date(2000, 0, 1, 12, 45)
			});

			const minutePicker = subject.find(`.${css.minutesComponents}`).at(0);

			const expected = 45;
			const actual = minutePicker.prop('value');

			expect(actual).toBe(expected);
		}
	);

	test('should set "hourAriaLabel" to hour picker', () => {
		const label = 'custom hour aria-label';
		const subject = mount(
			<TimePicker hourAriaLabel={label} open title="Date" value={new Date(2000, 0, 1, 12, 30)} />
		);

		const hourPicker = subject.find(`.${css.hourComponents}`).at(0);

		const expected = label;
		const actual = hourPicker.prop('aria-label');

		expect(actual).toBe(expected);
	});

	test('should set "meridiemAriaLabel" to meridiem picker', () => {
		const label = 'custom meridiem aria-label';
		const subject = mount(
			<TimePicker meridiemAriaLabel={label} open title="Date" value={new Date(2000, 0, 1, 12, 30)} />
		);

		const meridiemPicker = subject.find(`.${css.meridiemComponent}`).at(0);

		const expected = label;
		const actual = meridiemPicker.prop('aria-label');

		expect(actual).toBe(expected);
	});

	test('should set "minuteAriaLabel" to minute picker', () => {
		const label = 'custom minute aria-label';
		const subject = mount(
			<TimePicker minuteAriaLabel={label} open title="Date" value={new Date(2000, 0, 1, 12, 30)} />
		);

		const minutePicker = subject.find(`.${css.minutesComponents}`).at(0);

		const expected = label;
		const actual = minutePicker.prop('aria-label');

		expect(actual).toBe(expected);
	});

	test('should set "hourLabel" to hour picker', () => {
		const label = 'custom hour label';
		const subject = mount(
			<TimePicker hourLabel={label} open title="Date" value={new Date(2000, 0, 1, 12, 30)} />
		);

		const hourPicker = subject.find(`.${css.hourComponents}`).at(0);

		const expected = label;
		const actual = hourPicker.prop('label');

		expect(actual).toBe(expected);
	});

	test('should set "meridiemLabel" to meridiem picker', () => {
		const label = 'custom meridiem label';
		const subject = mount(
			<TimePicker meridiemLabel={label} open title="Date" value={new Date(2000, 0, 1, 12, 30)} />
		);

		const meridiemPicker = subject.find(`.${css.meridiemComponent}`).at(0);

		const expected = label;
		const actual = meridiemPicker.prop('label');

		expect(actual).toBe(expected);
	});

	test('should set "minuteLabel" to minute picker', () => {
		const label = 'custom minute label';
		const subject = mount(
			<TimePicker minuteLabel={label} open title="Date" value={new Date(2000, 0, 1, 12, 30)} />
		);

		const minutePicker = subject.find(`.${css.minutesComponents}`).at(0);

		const expected = label;
		const actual = minutePicker.prop('label');

		expect(actual).toBe(expected);
	});
});
