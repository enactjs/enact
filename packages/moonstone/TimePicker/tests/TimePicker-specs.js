import React from 'react';
import {mount, shallow} from 'enzyme';
import sinon from 'sinon';
import {TimePicker, TimePickerBase} from '../TimePicker';

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

	it('should emit an onChange event when closed', function () {
		const handleChange = sinon.spy();
		const subject = mount(
			<TimePicker title="Time" open onChange={handleChange} />
		);

		const base = subject.find('TimePickerBase');
		base.prop('onClose')();

		const expected = true;
		const actual = handleChange.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should omit labels when noLabels is true', function () {
		const subject = shallow(
			<TimePickerBase title="Time" hour={1} minute={1} meridiem={0} meridiems={['am', 'pm']} order={['h', 'm']} noLabels />
		);

		const expected = 2;
		// DateComponentRangePicker is wrapped by Changeable so in a shallow render, we have to
		// check for that kind
		const actual = subject.find('Changeable').filterWhere(c => !c.prop('label')).length;

		expect(actual).to.equal(expected);
	});

	it('should create pickers arranged by order', function () {
		const subject = shallow(
			<TimePickerBase title="Time" hour={1} minute={1} meridiem={0} meridiems={['am', 'pm']} order={['h', 'm']} />
		);

		const expected = ['hour', 'minute'];
		// DateComponentRangePicker is wrapped by Changeable so in a shallow render, we have to
		// check for that kind
		const actual = subject.find('Changeable').map(c => c.prop('label'));

		expect(actual).to.deep.equal(expected);
	});
});
