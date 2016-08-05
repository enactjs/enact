import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import {RangePickerBase} from '../RangePicker';
import css from '../../Picker/Picker.less'; // need to include Picker's css for RangePicker tests that do clicks on incrementer/decrementer

describe('RangePickerBase Specs', () => {
	it('should have a default \'max\' of 0', function () {
		const picker = mount(
			<RangePickerBase />
		);

		const expected = 0;
		const actual = picker.prop('max');

		expect(actual).to.equal(expected);
	});

	it('should have a default \'value\' of 0', function () {
		const picker = mount(
			<RangePickerBase />
		);

		const expected = 0;
		const actual = picker.prop('value');

		expect(actual).to.equal(expected);
	});

	it('should return an object \{value: Number\} that represents the next value of the RangePickerBase component when clicking the increment \<span\>', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<RangePickerBase onChange={handleChange} min={-1} max={1} value={0} />
		);
		const button = picker.find(`.${css.incrementer}`);

		const expected = 1;
		button.simulate('click');
		const actual = handleChange.firstCall.args[0].value;

		expect(actual).to.equal(expected);

	});

	it('should return an object \{value: Number\} that represents the next value of the RangePickerBase component when clicking the decrement \<span\>', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<RangePickerBase onChange={handleChange} min={-1} max={1} value={0} />
		);
		const button = picker.find(`.${css.decrementer}`);

		const expected = -1;
		button.simulate('click');
		const actual = handleChange.firstCall.args[0].value;

		expect(actual).to.equal(expected);

	});

	it('should not run the onChange handler when disabled', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<RangePickerBase onChange={handleChange} disabled />
		);
		const incButton = picker.find(`.${css.incrementer}`);

		incButton.simulate('click');

		const expected = false;
		const actual = handleChange.called;

		expect(actual).to.equal(expected);
	});

	it('should wrap to the beginning of the value range if \'wrap\' is true', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<RangePickerBase onChange={handleChange} wrap min={-1} value={0} />
		);
		const button = picker.find(`.${css.incrementer}`);

		const expected = -1;
		button.simulate('click');
		const actual = handleChange.firstCall.args[0].value;

		expect(actual).to.equal(expected);

	});

	it('should wrap to the end of the value range if \'wrap\' is true', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<RangePickerBase onChange={handleChange} wrap max={1} value={0} />
		);
		const button = picker.find(`.${css.decrementer}`);

		const expected = 1;
		button.simulate('click');
		const actual = handleChange.firstCall.args[0].value;

		expect(actual).to.equal(expected);

	});

	it('should increment by \'step\' value', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<RangePickerBase onChange={handleChange} step={3} max={4} value={0} />
		);
		const button = picker.find(`.${css.incrementer}`);

		const expected = 3;
		button.simulate('click');
		const actual = handleChange.firstCall.args[0].value;

		expect(actual).to.equal(expected);
	});

	it('should decrement by \'step\' value', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<RangePickerBase onChange={handleChange} step={3} max={3} value={3} />
		);
		const button = picker.find(`.${css.decrementer}`);

		const expected = 0;
		button.simulate('click');
		const actual = handleChange.firstCall.args[0].value;

		expect(actual).to.equal(expected);
	});

	it('should increment by \'step\' value and wrap successfully', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<RangePickerBase onChange={handleChange} wrap step={3} max={2} value={0} />
		);
		const button = picker.find(`.${css.incrementer}`);

		const expected = 0;
		button.simulate('click');
		const actual = handleChange.firstCall.args[0].value;

		expect(actual).to.equal(expected);
	});

	it('should decrement by \'step\' value and wrap successfully', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<RangePickerBase onChange={handleChange} wrap step={3} max={10} value={0} />
		);
		const button = picker.find(`.${css.decrementer}`);

		const expected = 8;
		button.simulate('click');
		const actual = handleChange.firstCall.args[0].value;

		expect(actual).to.equal(expected);
	});

	// TODO: not sure if 'joined'/keyPress is broken or test is bad or ??? (skipping for now)
	it.skip('should allow keyboard increment via arrow keys when \'joined\'', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<RangePickerBase onChange={handleChange} min={-1} max={1} value={0} joined />
		);

		const button = picker.find(`.${css.incrementer}`);
		const expected = 1;
		// TODO is it right, up, or both, depends on orientation?
		button.simulate('keyPress', {keyCode: 39}); // right
		// button.simulate('keyPress', {keyCode: 38}); // up
		const actual = handleChange.firstCall.args[0].args[0].value;
		expect(actual).to.equal(expected);

	});

	// TODO: not sure if 'joined'/keyPress is broken or test is bad or ??? (skipping for now)
	it.skip('should allow keyboard decrement via arrow keys when \'joined\'', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<RangePickerBase onChange={handleChange} min={-1} max={1} value={0} joined />
		);

		const button = picker.find(`.${css.decrementer}`);
		const expected = -1;
		// TODO is it left, down, or both, depends on orientation?
		button.simulate('keyPress', {keyCode: 37}); // left
		// button.simulate('keyPress', {keyCode: 40}); // down
		const actual = handleChange.firstCall.args[0].value;
		expect(actual).to.equal(expected);

	});
});

