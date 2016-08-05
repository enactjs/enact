import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import {PickerCore} from '../Picker';
import css from '../Picker.less';


describe('PickerCore Specs', () => {
	it('should have a default \'min\' of 0', function () {
		const picker = mount(
			<PickerCore displayValue={0} />
		);

		const expected = 0;
		const actual = picker.prop('min');

		expect(actual).to.equal(expected);
	});

	it('should have a default \'max\' of 0', function () {
		const picker = mount(
			<PickerCore displayValue={0} />
		);

		const expected = 0;
		const actual = picker.prop('max');

		expect(actual).to.equal(expected);
	});

	it('should have a default \'value\' of 0', function () {
		const picker = mount(
			<PickerCore displayValue={0} />
		);

		const expected = 0;
		const actual = picker.prop('value');

		expect(actual).to.equal(expected);
	});

	it('should return an object \{value: Number\} that represents the next value of the PickerCore component when clicking the increment \<span\>', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<PickerCore onChange={handleChange} min={-1} max={1} value={0} displayValue={0} />
		);
		const button = picker.find(`.${css.incrementer}`);

		const expected = 1;
		button.simulate('click');
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);

	});

	it('should return an object \{value: Number\} that represents the next value of the PickerCore component when clicking the decrement \<span\>', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<PickerCore onChange={handleChange} min={-1} max={1} value={0} displayValue={0} />
		);
		const button = picker.find(`.${css.decrementer}`);

		const expected = -1;
		button.simulate('click');
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);

	});

	it('should not run the onChange handler when disabled', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<PickerCore onChange={handleChange} disabled displayValue={0} />
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
			<PickerCore onChange={handleChange} wrap min={-1} value={0} displayValue={0} />
		);
		const button = picker.find(`.${css.incrementer}`);

		const expected = -1;
		button.simulate('click');
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);

	});

	it('should wrap to the end of the value range if \'wrap\' is true', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<PickerCore onChange={handleChange} wrap max={1} value={0} displayValue={0} />
		);
		const button = picker.find(`.${css.decrementer}`);

		const expected = 1;
		button.simulate('click');
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);

	});

	it('should increment by \'step\' value', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<PickerCore onChange={handleChange} step={3} max={4} value={0} displayValue={0} />
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
			<PickerCore onChange={handleChange} step={3} max={3} value={3} displayValue={0} />
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
			<PickerCore onChange={handleChange} wrap step={3} max={2} value={0} displayValue={0} />
		);
		const button = picker.find(`.${css.incrementer}`);

		const expected = 0;
		button.simulate('click');
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	it('should decrement by \'step\' value and wrap successfully', function () {
		const handleChange = sinon.spy();
		const picker = mount(
			<PickerCore onChange={handleChange} wrap step={3} max={10} value={0} displayValue={0} />
		);
		const button = picker.find(`.${css.decrementer}`);

		const expected = 8;
		button.simulate('click');
		const actual = handleChange.args[0][0].value;

		expect(actual).to.equal(expected);
	});

	// TODO: not sure if 'joined'/keyPress is broken or test is bad or ??? (skipping for now)
	it('should allow keyboard increment via arrow keys when \'joined\'', function () {
		this.skip();
		const handleChange = sinon.spy();
		const picker = mount(
			<PickerCore onChange={handleChange} min={-1} max={1} value={0} displayValue={0} joined />
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
	it('should allow keyboard decrement via arrow keys when \'joined\'', function () {
		this.skip();
		const handleChange = sinon.spy();
		const picker = mount(
			<PickerCore onChange={handleChange} min={-1} max={1} value={0} displayValue={0} joined />
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
