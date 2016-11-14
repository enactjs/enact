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

	it('should emit an onChange event when closed', function () {
		const handleChange = sinon.spy();
		const subject = mount(
			<DatePicker title="Date" open onChange={handleChange} />
		);

		const base = subject.find('DatePickerBase');
		base.prop('onClose')();

		const expected = true;
		const actual = handleChange.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should omit labels when noLabels is true', function () {
		const subject = shallow(
			<DatePickerBase title="Date" day={1} maxDays={31} month={1} maxMonths={12} year={2000} order={['m', 'd']} noLabels />
		);

		const expected = 2;
		// DateComponentRangePicker is wrapped by Changeable so in a shallow render, we have to
		// check for that kind
		const actual = subject.find('Changeable').filterWhere(c => !c.prop('label')).length;

		expect(actual).to.equal(expected);
	});

	it('should create pickers arranged by order', function () {
		const subject = shallow(
			<DatePickerBase title="Date" day={1} maxDays={31} month={1} maxMonths={12} year={2000} order={['m', 'd']} />
		);

		const expected = ['month', 'day'];
		// DateComponentRangePicker is wrapped by Changeable so in a shallow render, we have to
		// check for that kind
		const actual = subject.find('Changeable').map(c => c.prop('label'));

		expect(actual).to.deep.equal(expected);
	});
});
