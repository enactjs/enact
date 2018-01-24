import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import EditableIntegerPicker from '../EditableIntegerPicker';
import Spotlight from '@enact/spotlight';

const tap = (node) => {
	node.simulate('mousedown');
	node.simulate('mouseup');
};

const decrement = (slider) => tap(slider.find('Icon').last());
const increment = (slider) => tap(slider.find('Icon').first());
describe('EditableIntegerPicker', () => {

	it('should render a single child with the current value', function () {
		const picker = mount(
			<EditableIntegerPicker min={0} max={100} defaultValue={10} step={1} />
		);
		const expected = 10;
		const actual = parseInt(picker.find('PickerItem').text());
		expect(actual).to.equal(expected);
	});

	it('should increase by step amount on increment press', function () {
		const picker = mount(
			<EditableIntegerPicker min={0} max={100} defaultValue={10} step={10} />
		);
		increment(picker);
		const expected = 20;
		const actual = parseInt(picker.find('PickerItem').first().text());
		expect(actual).to.equal(expected);
	});

	it('should decrease by step amount on decrement press', function () {
		const picker = mount(
			<EditableIntegerPicker min={0} max={100} defaultValue={10} step={10} />
		);
		decrement(picker);
		const expected = 0;
		const actual = parseInt(picker.find('PickerItem').first().text());
		expect(actual).to.equal(expected);
	});

	it('should enable input field on click', function () {
		const picker = mount(
			<EditableIntegerPicker min={0} max={100} defaultValue={10} step={1} />
		);

		picker.find('PickerItem').simulate('click', {target: {type: 'click'}});
		const expected = 1;
		const actual = picker.find('input').length;
		expect(actual).to.equal(expected);
	});

	it('should disable input when blurred', function () {
		const picker = mount(
			<EditableIntegerPicker min={0} max={100} defaultValue={10} step={1} />
		);

		picker.find('PickerItem').simulate('click', {target: {type: 'click'}});
		const input = picker.find('input').first();
		input.node.focus();
		input.simulate('blur');
		const expected = 0;
		const actual = picker.find('input').length;

		expect(actual).to.equal(expected);
	});

	it('should take value inputted and navigate to the value on blur', function () {
		const picker = mount(
			<EditableIntegerPicker min={0} max={100} defaultValue={10} step={1} />
		);

		picker.find('PickerItem').simulate('click', {target: {type: 'click'}});
		const input = picker.find('input').first();
		input.node.focus();
		input.node.value = 38;
		input.simulate('blur');
		const expected = 38;
		const actual = parseInt(picker.find('PickerItem').first().text());

		expect(actual).to.equal(expected);
	});

	it('should enable input field when some number is typed on the picker', function () {
		const picker = mount(
			<EditableIntegerPicker min={0} max={100} defaultValue={10} step={1} />
		);

		picker.simulate('keyDown', {keyCode: 50});
		const expected = 1;
		const actual = picker.find('input').length;

		expect(actual).to.equal(expected);
	});

	it('should pause the spotlight when input is focused', function () {
		const pauseSpy = sinon.spy(Spotlight, 'pause');
		const picker = mount(
			<EditableIntegerPicker min={0} max={100} defaultValue={10} step={1} />
		);

		picker.simulate('keyDown', {keyCode: 50});
		const input = picker.find('input').first();
		input.node.focus();
		const expected = true;
		const actual = pauseSpy.calledOnce;
		Spotlight.pause.restore();
		expect(actual).to.equal(expected);
	});

	it('should resume the spotlight when input is blurred', function () {
		const resumeSpy = sinon.spy(Spotlight, 'resume');
		const picker = mount(
			<EditableIntegerPicker min={0} max={100} defaultValue={10} step={1} />
		);

		picker.find('PickerItem').simulate('click', {target: {type: 'click'}});
		const input = picker.find('input').first();

		input.node.focus();
		input.simulate('blur');
		const expected = true;
		const actual = resumeSpy.calledOnce;
		Spotlight.resume.restore();
		expect(actual).to.equal(expected);
	});

});
