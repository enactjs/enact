import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import PickerCore from '../Picker';
import {stepped} from '../PickerPropTypes';
import css from '../Picker.less';

describe('PickerCore Specs', function () {

	it('should have a default \'value\' of 0', function () {
		const picker = mount(
			<PickerCore index={0} min={0} max={0} />
		);

		const expected = 0;
		const actual = picker.prop('value');

		expect(actual).to.equal(expected);
	});

	it('should return an object \{value: Number\} that represents the next value of the PickerCore component when clicking the increment \<span\>', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<PickerCore onChange={handleChange} min={-1} max={1} value={0} index={0} />
		);

		picker.find(`.${css.incrementer}`).simulate('click');

		const expected = 1;
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should return an object \{value: Number\} that represents the next value of the PickerCore component when clicking the decrement \<span\>', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<PickerCore onChange={handleChange} min={-1} max={1} value={0} index={0} />
		);

		picker.find(`.${css.decrementer}`).simulate('click');

		const expected = -1;
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should not run the onChange handler when disabled', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<PickerCore onChange={handleChange} disabled min={0} max={0} value={0} index={0} />
		);

		picker.find(`.${css.incrementer}`).simulate('click');

		const expected = false;
		const actual = handleChange.called;

		expect(actual).to.equal(expected);
	});

	it('should wrap to the beginning of the value range if \'wrap\' is true', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<PickerCore onChange={handleChange} wrap min={-1} max={0} value={0} index={0} />
		);

		picker.find(`.${css.incrementer}`).simulate('click');

		const expected = -1;
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should wrap to the end of the value range if \'wrap\' is true', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<PickerCore onChange={handleChange} wrap min={0} max={1} value={0} index={0} />
		);

		picker.find(`.${css.decrementer}`).simulate('click');

		const expected = 1;
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should increment by \'step\' value', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<PickerCore onChange={handleChange} step={3} min={0} max={6} value={0} index={0} />
		);
		const button = picker.find(`.${css.incrementer}`);

		const expected = 3;
		button.simulate('click');
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should decrement by \'step\' value', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<PickerCore onChange={handleChange} step={3} min={0} max={3} value={3} index={0} />
		);
		const button = picker.find(`.${css.decrementer}`);

		const expected = 0;
		button.simulate('click');
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should increment by \'step\' value and wrap successfully', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<PickerCore onChange={handleChange} wrap step={3} min={0} max={3} value={3} index={0} />
		);

		picker.find(`.${css.incrementer}`).simulate('click');

		const expected = 0;
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should decrement by \'step\' value and wrap successfully', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<PickerCore onChange={handleChange} wrap step={3} min={0} max={9} value={0} index={0} />
		);

		picker.find(`.${css.decrementer}`).simulate('click');

		const expected = 9;
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should enable the increment button when there is a wrapped value to increment', function () {
		const picker = mount(
			<PickerCore wrap min={0} max={2} value={2} index={0} />
		);

		const expected = false;
		const actual = picker.find(`.${css.incrementer}`).prop('disabled');

		expect(actual).to.equal(expected);
	});

	it('should enable the decrement button when there is a wrapped value to decrement', function () {
		const picker = mount(
			<PickerCore wrap min={0} max={2} value={2} index={0} />
		);

		const expected = false;
		const actual = picker.find(`.${css.incrementer}`).prop('disabled');

		expect(actual).to.equal(expected);
	});

	it('should disable the increment button when there is no value to increment', function () {
		const picker = mount(
			<PickerCore min={0} max={2} value={2} index={0} />
		);

		const expected = true;
		const actual = picker.find(`.${css.incrementer}`).prop('disabled');

		expect(actual).to.equal(expected);
	});

	it('should disable the decrement button when there is no value to decrement', function () {
		const picker = mount(
			<PickerCore min={0} max={2} value={0} index={0} />
		);

		const expected = true;
		const actual = picker.find(`.${css.decrementer}`).prop('disabled');

		expect(actual).to.equal(expected);
	});

	it('should disable the increment and decrement buttons when wrapped and there is a single value', function () {
		const picker = mount(
			<PickerCore wrap min={0} max={0} value={0} index={0} />
		);

		const expected = true;
		const actual = picker.find(`.${css.decrementer}`).prop('disabled') &&
			picker.find(`.${css.incrementer}`).prop('disabled');

		expect(actual).to.equal(expected);
	});

	// TODO: not sure if 'joined'/keyPress is broken or test is bad or ??? (skipping for now)
	it.skip('should allow keyboard increment via arrow keys when \'joined\'', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<PickerCore onChange={handleChange} min={-1} max={1} value={0} index={0} joined />
		);

		const button = picker.find(`.${css.incrementer}`);
		const expected = 1;
		// TODO is it right, up, or both, depends on orientation?
		button.simulate('keyPress', {keyCode: 39}); // right
		// button.simulate('keyPress', {keyCode: 38}); // up
		const actual = handleChange.args[0][0].value;
		expect(actual).to.equal(expected);

	});

	// TODO: not sure if 'joined'/keyPress is broken or test is bad or ??? (skipping for now)
	it.skip('should allow keyboard decrement via arrow keys when \'joined\'', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<PickerCore onChange={handleChange} min={-1} max={1} value={0} index={0} joined />
		);

		const button = picker.find(`.${css.decrementer}`);
		const expected = -1;
		// TODO is it left, down, or both, depends on orientation?
		button.simulate('keyPress', {keyCode: 37}); // left
		// button.simulate('keyPress', {keyCode: 40}); // down
		const actual = handleChange.args[0][0].value;
		expect(actual).to.equal(expected);

	});
});

describe('stepped specs', function () {
	it('should validate prop is a number and divisible by step', function () {
		const props = {
			min: 0,
			value: 9,
			step: 3
		};

		const expected = false;
		const actual = stepped(props, 'value') instanceof Error;

		expect(actual).to.equal(expected);
	});

	it('should return an error when prop is not divisible by step', function () {
		const props = {
			min: 0,
			value: 10,
			step: 3
		};

		const expected = true;
		const actual = stepped(props, 'value') instanceof Error;

		expect(actual).to.equal(expected);
	});

	it('should return an error when prop is not a number', function () {
		const props = {
			min: 0,
			value: 'not a number',
			step: 3
		};

		const expected = true;
		const actual = stepped(props, 'value') instanceof Error;

		expect(actual).to.equal(expected);
	});
});
