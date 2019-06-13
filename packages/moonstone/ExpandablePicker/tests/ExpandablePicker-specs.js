import React from 'react';
import {mount} from 'enzyme';
import ExpandablePicker from '../ExpandablePicker';

const tap = (node) => {
	node.simulate('mousedown');
	node.simulate('mouseup');
};

describe('ExpandablePicker Specs', () => {

	test('should close onChange', () => {

		const expandablePicker = mount(
			<ExpandablePicker defaultOpen title="Options">
				{['Option one', 'Option two', 'Option three']}
			</ExpandablePicker>
		);

		const checkButton = expandablePicker.find('IconButton').last();
		tap(checkButton);

		const expected = false;
		const actual = expandablePicker.find('ExpandableItem').props().open;

		expect(actual).toBe(expected);
	});

	test('should include value in onChange when value is specified', () => {
		const value = 2;
		const handleChange = jest.fn();
		const expandablePicker = mount(
			<ExpandablePicker onChange={handleChange} open title="Options" value={value}>
				{['Option one', 'Option two', 'Option three']}
			</ExpandablePicker>
		);

		const checkButton = expandablePicker.find('IconButton').last();
		tap(checkButton);

		const expected = value;
		const actual = handleChange.mock.calls[0][0].value;

		expect(actual).toBe(expected);
	});

	test(
		'should include default value in onChange when value is not specified',
		() => {
			const value = 0;
			const handleChange = jest.fn();
			const expandablePicker = mount(
				<ExpandablePicker onChange={handleChange} open title="Options">
					{['Option one', 'Option two', 'Option three']}
				</ExpandablePicker>
			);

			const checkButton = expandablePicker.find('IconButton').last();
			tap(checkButton);

			const expected = value;
			const actual = handleChange.mock.calls[0][0].value;

			expect(actual).toBe(expected);
		}
	);

	test('should set "checkButtonAriaLabel" to check button', () => {
		const label = 'custom check button aria-label';
		const expandablePicker = mount(
			<ExpandablePicker checkButtonAriaLabel={label} open title="Options">
				{['Option one', 'Option two', 'Option three']}
			</ExpandablePicker>
		);

		const checkButton = expandablePicker.find('IconButton').at(2);

		const expected = label;
		const actual = checkButton.prop('aria-label');

		expect(actual).toBe(expected);
	});

	test('should set "decrementAriaLabel" to previous button', () => {
		const label = 'custom previous button aria-label';
		const expandablePicker = mount(
			<ExpandablePicker decrementAriaLabel={label} open title="Options">
				{['Option one', 'Option two', 'Option three']}
			</ExpandablePicker>
		);

		const checkButton = expandablePicker.find('IconButton').at(1);

		const expected = label;
		const actual = checkButton.prop('aria-label');

		expect(actual).toBe(expected);
	});

	test('should set "incrementAriaLabel" to next button', () => {
		const label = 'custom next button aria-label';
		const expandablePicker = mount(
			<ExpandablePicker incrementAriaLabel={label} open title="Options">
				{['Option one', 'Option two', 'Option three']}
			</ExpandablePicker>
		);

		const checkButton = expandablePicker.find('IconButton').at(0);

		const expected = label;
		const actual = checkButton.prop('aria-label');

		expect(actual).toBe(expected);
	});

	test('should set "pickerAriaLabel" to joined picker', () => {
		const label = 'custom joined picker aria-label';
		const expandablePicker = mount(
			<ExpandablePicker joined open pickerAriaLabel={label} title="Options">
				{['Option one', 'Option two', 'Option three']}
			</ExpandablePicker>
		);

		const joinedPicker = expandablePicker.find('Picker').at(1);

		const expected = label;
		const actual = joinedPicker.prop('aria-label');

		expect(actual).toBe(expected);
	});

	test('should set "data-webos-voice-disabled" to decrement button when voice control is disabled', () => {
		const children = ['option1', 'option2', 'option3'];

		const expandablePicker = mount(
			<ExpandablePicker data-webos-voice-disabled title="Options" open>
				{children}
			</ExpandablePicker>
		);

		const expected = true;
		const actual = expandablePicker.find('IconButton').at(0).prop('data-webos-voice-disabled');

		expect(actual).toBe(expected);
	});

	test('should set "data-webos-voice-disabled" to increment button when voice control is disabled', () => {
		const children = ['option1', 'option2', 'option3'];

		const expandablePicker = mount(
			<ExpandablePicker data-webos-voice-disabled title="Options" open>
				{children}
			</ExpandablePicker>
		);

		const expected = true;
		const actual = expandablePicker.find('IconButton').at(1).prop('data-webos-voice-disabled');

		expect(actual).toBe(expected);
	});
});
