import React from 'react';
import {mount, shallow} from 'enzyme';
import sinon from 'sinon';
import {DatePicker, DatePickerBase} from '../DatePicker';

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
		// DateComponentRangePicker is wrapped by Changeable so in a shallow render, we have to
		// check for that kind
		const actual = subject.find('DateComponentRangePicker').filterWhere(c => !c.prop('label')).length;

		expect(actual).to.equal(expected);
	});

	it('should create pickers arranged by order', function () {
		const subject = mount(
			<DatePickerBase title="Date" day={1} maxDays={31} month={1} maxMonths={12} year={2000} order={['m', 'd']} open />
		);

		const expected = ['month', 'day'];
		// DateComponentRangePicker is wrapped by Changeable so in a shallow render, we have to
		// check for that kind
		const actual = subject.find('DateComponentRangePicker').map(c => c.prop('label'));

		expect(actual).to.deep.equal(expected);
	});

	it('should accept a JavaScript Date for its value prop', function () {
		const subject = mount(
			<DatePicker title="Date" value={new Date(2000, 0, 1)} open />
		);

		const yearPicker = subject.find('DateComponentRangePicker').findWhere(p => {
			return p.type().displayName === 'DateComponentRangePicker' && p.prop('label') === 'year';
		});

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

		const yearPicker = subject.find('DateComponentRangePicker').findWhere(p => {
			return p.type().displayName === 'DateComponentRangePicker' && p.prop('label') === 'year';
		});

		const expected = 1900;
		const actual = yearPicker.prop('value');

		expect(actual).to.equal(expected);
	});
});
