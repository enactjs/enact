import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import DatePicker from '../DatePicker';

describe.skip('DatePicker', () => {

	// Suite-wide setup

	it('should not generate a label when value is undefined', function () {
		const subject = shallow(
			<DatePicker title="Date" />
		);

		const expected = null;
		const actual = subject.prop('label');

		expect(actual).to.equal(expected);
	});

	it('should restore the value from props after an onCancel event', function () {
		const value = new Date(2000, 0, 1);
		const subject = shallow(
			<DatePicker title="Date" value={value} />
		);

		subject.simulate('onChangeMonth', {value: 1});
		subject.simulate('onCancel');
		subject.update();

		const expected = 0;
		const actual = subject.prop('month');

		expect(actual).to.equal(expected);
	});

	it('should set an internal value when opened', function () {
		const subject = shallow(
			<DatePicker title="Date" open />
		);

		const actual = subject.prop('value');

		expect(actual).to.exist();
	});

	it('should emit an onChange event when closed with a value', function () {
		const handleChange = sinon.spy();
		const value = new Date(2000, 0, 1);
		const subject = shallow(
			<DatePicker title="Date" value={value} onChange={handleChange} />
		);

		subject.simulate('onChangeMonth', {value: 1});
		subject.simulate('onClose');
		subject.update();

		const expected = true;
		const actual = handleChange.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should not emit an onChange event when cancelled', function () {
		const handleChange = sinon.spy();
		const value = new Date(2000, 0, 1);
		const subject = shallow(
			<DatePicker title="Date" value={value} onChange={handleChange} />
		);

		subject.simulate('onChangeMonth', {value: 1});
		subject.simulate('onCancel');
		subject.update();

		const expected = false;
		const actual = handleChange.calledOnce;

		expect(actual).to.equal(expected);
	});
});
