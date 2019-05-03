import React from 'react';
import {mount, shallow} from 'enzyme';
import {DropDown, DropDownBase} from '../DropDown';

const title = 'Dropdown select';
const children = ['option1', 'option2', 'option3'];

describe('DropDownBase', () => {
	test('should have title', () => {

		const dropDown = mount(
			<DropDownBase title={title}>
				{children}
			</DropDownBase>
		);

		const expected = title;
		const actual = dropDown.find('.text').text();

		expect(actual).toBe(expected);
	});

	test('should have title that reflects selected option', () => {
		const selectedIndex = 1;

		const dropDown = mount(
			<DropDownBase selected={selectedIndex} title={title}>
				{children}
			</DropDownBase>
		);

		const expected = children[selectedIndex];
		const actual = dropDown.find('.text').text();

		expect(actual).toBe(expected);
	});
});

describe('DropDown', () => {
	test('should have title that reflects default selected option', () => {
		const selectedIndex = 2;

		const dropDown = mount(
			<DropDown defaultSelected={selectedIndex} title={title}>
				{children}
			</DropDown>
		);

		const expected = children[selectedIndex];
		const actual = dropDown.find('.text').text();

		expect(actual).toBe(expected);
	});

	test('should update when children are added', () => {

		const dropDown = shallow(
			<DropDown title={title}>
				{children}
			</DropDown>
		);

		const updatedChildren = children.concat('option4', 'option5');
		dropDown.setProps({children: updatedChildren});

		const expected = 5;
		const actual = dropDown.children().length;

		expect(actual).toBe(expected);
	});
});
