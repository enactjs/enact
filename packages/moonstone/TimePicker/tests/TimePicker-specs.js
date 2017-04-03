import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import {TimePicker, TimePickerBase} from '../TimePicker';
import css from '../TimePicker.less';

describe('TimePicker', () => {

	// Suite-wide setup

	it('should not generate a label when value is undefined', function () {
		const subject = mount(
			<TimePicker title="Time" />
		);

		const expected = null;
		const actual = subject.find('ExpandableItem').prop('label');

		expect(actual).to.equal(expected);
	});

	it('should emit an onChange event when changing a component picker', function () {
		const handleChange = sinon.spy();
		const subject = mount(
			<TimePicker title="Time" value={new Date(2000, 6, 15, 3, 30)} open onChange={handleChange} />
		);

		const base = subject.find('DateComponentRangePicker').first();
		base.prop('onChange')({value: 0});

		const expected = true;
		const actual = handleChange.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should omit labels when noLabels is true', function () {
		const subject = mount(
			<TimePickerBase title="Time" hour={1} minute={1} meridiem={0} meridiems={['am', 'pm']} order={['h', 'm']} open noLabels />
		);

		const expected = 2;
		const actual = subject.find(`.${css.timeComponents}`).children().filterWhere(c => !c.prop('label')).length;

		expect(actual).to.equal(expected);
	});

	it('should create pickers arranged by order', function () {
		const subject = mount(
			<TimePickerBase title="Time" hour={1} minute={1} meridiem={0} meridiems={['am', 'pm']} order={['h', 'm']} open />
		);

		const expected = ['hour', 'minute'];
		const actual = subject.find(`.${css.timeComponents}`).children().map(c => c.prop('label'));

		expect(actual).to.deep.equal(expected);
	});

	it('should accept a JavaScript Date for its value prop', function () {
		const subject = mount(
			<TimePicker title="Date" value={new Date(2000, 0, 1, 12, 30)} open />
		);

		const minutePicker = subject.find('DateComponentRangePicker').findWhere(p => {
			return p.type().displayName === 'DateComponentRangePicker' && p.prop('label') === 'minute';
		});

		const expected = 30;
		const actual = minutePicker.prop('value');

		expect(actual).to.equal(expected);
	});

	it('should accept an updated JavaScript Date for its value prop', function () {
		const subject = mount(
			<TimePicker title="Date" value={new Date(2000, 0, 1, 12, 30)} open />
		);

		subject.setProps({
			value: new Date(2000, 0, 1, 12, 45)
		});

		const minutePicker = subject.find('DateComponentRangePicker').findWhere(p => {
			return p.type().displayName === 'DateComponentRangePicker' && p.prop('label') === 'minute';
		});

		const expected = 45;
		const actual = minutePicker.prop('value');

		expect(actual).to.equal(expected);
	});
});
