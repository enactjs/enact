import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import ExpandablePicker, {ExpandablePickerBase} from '../ExpandablePicker';

const tap = (node) => {
	node.simulate('mousedown');
	node.simulate('mouseup');
};

describe('ExpandablePicker Specs', () => {

	it('should close onChange', function () {

		const expandablePicker = mount(
			<ExpandablePicker defaultOpen title="Options">
				{['Option one', 'Option two', 'Option three']}
			</ExpandablePicker>
		);

		const checkButton = expandablePicker.find('IconButton').last();
		tap(checkButton);

		const expected = false;
		const actual = expandablePicker.find('ExpandableItem').props().open;

		expect(actual).to.equal(expected);
	});

	it('should include value in onChange when value is specified', function () {
		const value = 2;
		const handleChange = sinon.spy();
		const expandablePicker = mount(
			<ExpandablePicker onChange={handleChange} open title="Options" value={value}>
				{['Option one', 'Option two', 'Option three']}
			</ExpandablePicker>
		);

		const checkButton = expandablePicker.find('IconButton').last();
		tap(checkButton);

		const expected = value;
		const actual = handleChange.firstCall.args[0].value;

		expect(actual).to.equal(expected);
	});

	it('should include default value in onChange when value is not specified', function () {
		const value = 0;
		const handleChange = sinon.spy();
		const expandablePicker = mount(
			<ExpandablePickerBase onChange={handleChange} open title="Options">
				{['Option one', 'Option two', 'Option three']}
			</ExpandablePickerBase>
		);

		const checkButton = expandablePicker.find('IconButton').last();
		tap(checkButton);

		const expected = value;
		const actual = handleChange.firstCall.args[0].value;

		expect(actual).to.equal(expected);
	});

	it('should set "checkButtonAriaLabel" to check button', function () {
		const label = 'custom check button aria-label';
		const expandablePicker = mount(
			<ExpandablePickerBase checkButtonAriaLabel={label} open title="Options">
				{['Option one', 'Option two', 'Option three']}
			</ExpandablePickerBase>
		);

		const checkButton = expandablePicker.find('IconButton').at(2);

		const expected = label;
		const actual = checkButton.prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should set "decrementAriaLabel" to previous button', function () {
		const label = 'custom previous button aria-label';
		const expandablePicker = mount(
			<ExpandablePickerBase decrementAriaLabel={label} open title="Options">
				{['Option one', 'Option two', 'Option three']}
			</ExpandablePickerBase>
		);

		const checkButton = expandablePicker.find('IconButton').at(0);

		const expected = label;
		const actual = checkButton.prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should set "incrementAriaLabel" to next button', function () {
		const label = 'custom next button aria-label';
		const expandablePicker = mount(
			<ExpandablePickerBase incrementAriaLabel={label} open title="Options">
				{['Option one', 'Option two', 'Option three']}
			</ExpandablePickerBase>
		);

		const checkButton = expandablePicker.find('IconButton').at(1);

		const expected = label;
		const actual = checkButton.prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should set "pickerAriaLabel" to joined picker', function () {
		const label = 'custom joined picker aria-label';
		const expandablePicker = mount(
			<ExpandablePickerBase joined open pickerAriaLabel={label} title="Options">
				{['Option one', 'Option two', 'Option three']}
			</ExpandablePickerBase>
		);

		const joinedPicker = expandablePicker.find('Picker').at(1);

		const expected = label;
		const actual = joinedPicker.prop('aria-label');

		expect(actual).to.equal(expected);
	});
});
