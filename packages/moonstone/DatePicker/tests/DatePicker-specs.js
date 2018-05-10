import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import {DatePicker, DatePickerBase} from '../DatePicker';
import css from '../DatePicker.less';

describe('DatePicker', () => {

	// Suite-wide setup

	it('should not generate a label when value is undefined', function () {
		const subject = mount(
			<DatePicker title="Date" />
		);

		const expected = null;
		const actual = subject.find('ExpandableItem').prop('label');

		expect(actual).to.equal(expected);
	});

	it('should emit an onChange event when changing a component picker', function () {
		const handleChange = sinon.spy();
		const subject = mount(
			<DatePicker value={new Date(2000, 6, 15)} title="Date" open onChange={handleChange} />
		);

		const base = subject.find('DateComponentRangePicker').first();
		base.prop('onChange')({value: 0});

		const expected = true;
		const actual = handleChange.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should omit labels when noLabels is true', function () {
		const subject = mount(
			<DatePickerBase title="Date" day={1} maxDays={31} month={1} maxMonths={12} year={2000} order={['m', 'd']} open noLabels />
		);

		const expected = 2;
		const actual = subject.find('DateComponentRangePicker').filterWhere(c => !c.prop('label')).length;

		expect(actual).to.equal(expected);
	});

	it('should create pickers arranged by order', function () {
		const subject = mount(
			<DatePickerBase title="Date" day={1} maxDays={31} month={1} maxMonths={12} year={2000} order={['m', 'd']} open />
		);

		const expected = ['month', 'day'];
		const actual = subject.find('DateComponentRangePicker').map(c => c.prop('label'));

		expect(actual).to.deep.equal(expected);
	});

	it('should accept a JavaScript Date for its value prop', function () {
		const subject = mount(
			<DatePicker title="Date" value={new Date(2000, 0, 1)} open />
		);

		const yearPicker = subject.find(`DateComponentRangePicker.${css.year}`);

		const expected = 2000;
		const actual = yearPicker.prop('value');

		expect(actual).to.equal(expected);
	});

	it('should accept an updated JavaScript Date for its value prop', function () {
		const subject = mount(
			<DatePicker title="Date" value={new Date(2000, 0, 1)} open />
		);

		subject.setProps({
			value: new Date(1900, 0, 1)
		});

		const yearPicker = subject.find(`DateComponentRangePicker.${css.year}`);

		const expected = 1900;
		const actual = yearPicker.prop('value');

		expect(actual).to.equal(expected);
	});

	it('should set "dayAriaLabel" to day picker', function () {
		const label = 'custom day aria-label';
		const subject = mount(
			<DatePicker dayAriaLabel={label} title="Date" value={new Date(2000, 0, 1)} open />
		);

		const dayPicker = subject.find(`DateComponentRangePicker.${css.day}`);

		const expected = label;
		const actual = dayPicker.prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should set "monthAriaLabel" to month picker', function () {
		const label = 'custom month aria-label';
		const subject = mount(
			<DatePicker monthAriaLabel={label} title="Date" value={new Date(2000, 0, 1)} open />
		);

		const monthPicker = subject.find(`DateComponentRangePicker.${css.month}`);

		const expected = label;
		const actual = monthPicker.prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should set "yearAriaLabel" to year picker', function () {
		const label = 'custom year aria-label';
		const subject = mount(
			<DatePicker yearAriaLabel={label} title="Date" value={new Date(2000, 0, 1)} open />
		);

		const yearPicker = subject.find(`DateComponentRangePicker.${css.year}`);

		const expected = label;
		const actual = yearPicker.prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should set "dayLabel" to day label', function () {
		const label = 'custom day label';
		const subject = mount(
			<DatePicker dayLabel={label} title="Date" value={new Date(2000, 0, 1)} open />
		);

		const dayPicker = subject.find(`DateComponentRangePicker.${css.day}`);

		const expected = label;
		const actual = dayPicker.prop('label');

		expect(actual).to.equal(expected);
	});

	it('should set "monthAriaLabel" to month picker', function () {
		const label = 'custom month label';
		const subject = mount(
			<DatePicker monthLabel={label} title="Date" value={new Date(2000, 0, 1)} open />
		);

		const monthPicker = subject.find(`DateComponentRangePicker.${css.month}`);

		const expected = label;
		const actual = monthPicker.prop('label');

		expect(actual).to.equal(expected);
	});

	it('should set "yearAriaLabel" to year picker', function () {
		const label = 'custom year label';
		const subject = mount(
			<DatePicker yearLabel={label} title="Date" value={new Date(2000, 0, 1)} open />
		);

		const yearPicker = subject.find(`DateComponentRangePicker.${css.year}`);

		const expected = label;
		const actual = yearPicker.prop('label');

		expect(actual).to.equal(expected);
	});
});
