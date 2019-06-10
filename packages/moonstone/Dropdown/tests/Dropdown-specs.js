import React from 'react';
import {mount, shallow} from 'enzyme';
import {Dropdown, DropdownBase} from '../Dropdown';

const title = 'Dropdown select';
const children = ['option1', 'option2', 'option3'];

describe('Dropdown', () => {
	test('should have title', () => {
		const dropDown = mount(
			<DropdownBase title={title}>
				{children}
			</DropdownBase>
		);

		const expected = title;
		const actual = dropDown.find('.text').text();

		expect(actual).toBe(expected);
	});

	test('should have title that reflects selected option', () => {
		const selectedIndex = 1;

		const dropDown = mount(
			<DropdownBase selected={selectedIndex} title={title}>
				{children}
			</DropdownBase>
		);

		const expected = children[selectedIndex];
		const actual = dropDown.find('.text').text();

		expect(actual).toBe(expected);
	});

	test('should be disabled when there is no children', () => {
		const dropDown = mount(
			<DropdownBase title={title} />
		);

		const expected = true;
		const actual = dropDown.find('DropdownButton').prop('disabled');

		expect(actual).toBe(expected);
	});

	test('should have title that reflects default selected option', () => {
		const selectedIndex = 2;

		const dropDown = mount(
			<Dropdown defaultSelected={selectedIndex} title={title}>
				{children}
			</Dropdown>
		);

		const expected = children[selectedIndex];
		const actual = dropDown.find('.text').text();

		expect(actual).toBe(expected);
	});

	test('should update when children are added', () => {
		const dropDown = shallow(
			<Dropdown title={title}>
				{children}
			</Dropdown>
		);

		const updatedChildren = children.concat('option4', 'option5');
		dropDown.setProps({children: updatedChildren});

		const expected = 5;
		const actual = dropDown.children().length;

		expect(actual).toBe(expected);
	});
});
