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

	test('should be disabled when there children is omitted', () => {
		const dropDown = mount(
			<DropdownBase title={title} />
		);

		const expected = true;
		const actual = dropDown.find('DropdownButton').prop('disabled');

		expect(actual).toBe(expected);
	});

	test('should be disabled when there are no children', () => {
		const dropDown = mount(
			<DropdownBase title={title}>
				{[]}
			</DropdownBase>
		);

		const expected = true;
		const actual = dropDown.find('DropdownButton').prop('disabled');

		expect(actual).toBe(expected);
	});

	test('should be disabled when there are no valid children', () => {
		const dropDown = mount(
			<DropdownBase title={title}>
				{[null, undefined, ''] /* eslint-disable-line no-undefined */}
			</DropdownBase>
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

	test('should set the role of items to "checkbox"', () => {
		const dropDown = shallow(
			<DropdownBase title={title} defaultOpen>
				{['item']}
			</DropdownBase>
		);

		const expected = 'checkbox';
		const actual = dropDown.prop('popupProps').children[0].role;

		expect(actual).toBe(expected);
	});

	test('should set the aria-checked state of the selected item', () => {
		const dropDown = shallow(
			<DropdownBase title={title} selected={0}>
				{['item']}
			</DropdownBase>
		);

		const expected = true;
		const actual = dropDown.prop('popupProps').children[0]['aria-checked'];

		expect(actual).toBe(expected);
	});

	test('should pass through members of child objects to props for each item', () => {
		const dropDown = shallow(
			<DropdownBase title={title}>
				{[{
					disabled: true,
					children: 'child',
					key: 'item-0'
				}]}
			</DropdownBase>
		);

		const expected = true;
		const actual = dropDown.prop('popupProps').children[0].disabled;

		expect(actual).toBe(expected);
	});

	test('should allow members in child object ts to override injected aria values', () => {
		const dropDown = shallow(
			<DropdownBase title={title} selected={0}>
				{[{
					disabled: true,
					children: 'child',
					key: 'item-0',
					role: 'button',
					'aria-checked': false
				}]}
			</DropdownBase>
		);

		const expected = {
			role: 'button',
			'aria-checked': false
		};
		const actual = dropDown.prop('popupProps').children[0];

		expect(actual).toMatchObject(expected);
	});
});
