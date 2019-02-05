import React from 'react';
import {mount} from 'enzyme';
import {DatePicker, DatePickerBase} from '../DatePicker';
import css from '../DatePicker.module.less';

describe('DatePicker', () => {

	// Suite-wide setup

	test('should not generate a label when value is undefined', () => {
		const subject = mount(
			<DatePicker title="Date" />
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
				<DatePicker onChange={handleChange} open title="Date" value={new Date(2000, 6, 15)} locale="en-US" />
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
			<DatePickerBase day={1} maxDays={31} maxMonths={12} month={1} noLabels open order={['m', 'd']} title="Date" year={2000} />
		);

		const expected = 2;
		const actual = subject.find('DateComponentRangePicker').filterWhere(c => !c.prop('label')).length;

		expect(actual).toBe(expected);
	});

	test('should create pickers arranged by order', () => {
		const subject = mount(
			<DatePickerBase title="Date" day={1} maxDays={31} month={1} maxMonths={12} year={2000} order={['m', 'd']} open />
		);

		const expected = ['month', 'day'];
		const actual = subject.find('DateComponentRangePicker').map(c => c.prop('label'));

		expect(actual).toEqual(expected);
	});

	test('should accept a JavaScript Date for its value prop', () => {
		const subject = mount(
			<DatePicker open title="Date" value={new Date(2000, 0, 1)} locale="en-US" />
		);

		const yearPicker = subject.find(`DateComponentRangePicker.${css.year}`);

		const expected = 2000;
		const actual = yearPicker.prop('value');

		expect(actual).toBe(expected);
	});

	test(
		'should accept an updated JavaScript Date for its value prop',
		() => {
			const subject = mount(
				<DatePicker open title="Date" value={new Date(2000, 0, 1)} locale="en-US" />
			);

			subject.setProps({
				value: new Date(1900, 0, 1)
			});

			const yearPicker = subject.find(`DateComponentRangePicker.${css.year}`);

			const expected = 1900;
			const actual = yearPicker.prop('value');

			expect(actual).toBe(expected);
		}
	);

	test('should set "dayAriaLabel" to day picker', () => {
		const label = 'custom day aria-label';
		const subject = mount(
			<DatePicker dayAriaLabel={label} open title="Date" value={new Date(2000, 0, 1)} />
		);

		const dayPicker = subject.find(`DateComponentRangePicker.${css.day}`);

		const expected = label;
		const actual = dayPicker.prop('aria-label');

		expect(actual).toBe(expected);
	});

	test('should set "monthAriaLabel" to month picker', () => {
		const label = 'custom month aria-label';
		const subject = mount(
			<DatePicker monthAriaLabel={label} open title="Date" value={new Date(2000, 0, 1)} />
		);

		const monthPicker = subject.find(`DateComponentRangePicker.${css.month}`);

		const expected = label;
		const actual = monthPicker.prop('aria-label');

		expect(actual).toBe(expected);
	});

	test('should set "yearAriaLabel" to year picker', () => {
		const label = 'custom year aria-label';
		const subject = mount(
			<DatePicker open title="Date" value={new Date(2000, 0, 1)} yearAriaLabel={label} />
		);

		const yearPicker = subject.find(`DateComponentRangePicker.${css.year}`);

		const expected = label;
		const actual = yearPicker.prop('aria-label');

		expect(actual).toBe(expected);
	});

	test('should set "dayLabel" to day label', () => {
		const label = 'custom day label';
		const subject = mount(
			<DatePicker dayLabel={label} open title="Date" value={new Date(2000, 0, 1)} />
		);

		const dayPicker = subject.find(`DateComponentRangePicker.${css.day}`);

		const expected = label;
		const actual = dayPicker.prop('label');

		expect(actual).toBe(expected);
	});

	test('should set "monthAriaLabel" to month picker', () => {
		const label = 'custom month label';
		const subject = mount(
			<DatePicker monthLabel={label} open title="Date" value={new Date(2000, 0, 1)} />
		);

		const monthPicker = subject.find(`DateComponentRangePicker.${css.month}`);

		const expected = label;
		const actual = monthPicker.prop('label');

		expect(actual).toBe(expected);
	});

	test('should set "yearAriaLabel" to year picker', () => {
		const label = 'custom year label';
		const subject = mount(
			<DatePicker open title="Date" value={new Date(2000, 0, 1)} yearLabel={label} />
		);

		const yearPicker = subject.find(`DateComponentRangePicker.${css.year}`);

		const expected = label;
		const actual = yearPicker.prop('label');

		expect(actual).toBe(expected);
	});

	test('should set "data-webos-voice-disabled" to day picker when voice control is disabled', () => {
		const subject = mount(
			<DatePicker open title="Date" value={new Date(2000, 0, 1)} data-webos-voice-disabled />
		);

		const dayPicker = subject.find(`DateComponentRangePicker.${css.day}`);

		const expected = true;
		const actual = dayPicker.prop('data-webos-voice-disabled');

		expect(actual).toBe(expected);
	});

	test('should set "data-webos-voice-disabled" to month picker when voice control is disabled', () => {
		const subject = mount(
			<DatePicker open title="Date" value={new Date(2000, 0, 1)} data-webos-voice-disabled />
		);

		const monthPicker = subject.find(`DateComponentRangePicker.${css.month}`);

		const expected = true;
		const actual = monthPicker.prop('data-webos-voice-disabled');

		expect(actual).toBe(expected);
	});

	test('should set "data-webos-voice-disabled" to year picker when voice control is disabled', () => {
		const subject = mount(
			<DatePicker open title="Date" value={new Date(2000, 0, 1)} data-webos-voice-disabled />
		);

		const yearPicker = subject.find(`DateComponentRangePicker.${css.year}`);

		const expected = true;
		const actual = yearPicker.prop('data-webos-voice-disabled');

		expect(actual).toBe(expected);
	});
});
