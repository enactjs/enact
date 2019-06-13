import React from 'react';
import {mount} from 'enzyme';
import {ExpandableList, ExpandableListBase} from '../ExpandableList';

describe('ExpandableList', () => {
	describe('#aria-multiselectable', () => {
		test('should be true when select is multiple', () => {
			const expandableList = mount(
				<ExpandableListBase title="Item" select="multiple">
					{['option1', 'option2', 'option3']}
				</ExpandableListBase>
			);

			const expected = true;
			const actual = expandableList.find('ExpandableItem').prop('aria-multiselectable');
			expect(actual).toBe(expected);
		});
	});

	test('should update when children are added', () => {
		const children = ['option1', 'option2', 'option3'];

		const expandableList = mount(
			<ExpandableList title="Item" open>
				{children}
			</ExpandableList>
		);

		const updatedChildren = children.concat('option4', 'option5');
		expandableList.setProps({children: updatedChildren});

		const expected = 5;
		const actual = expandableList.find('GroupItem').length;

		expect(actual).toBe(expected);
	});

	test('should set "data-webos-voice-disabled" to LabeledItem when voice control is disabled', () => {
		const children = ['option1', 'option2', 'option3'];

		const expandableList = mount(
			<ExpandableListBase data-webos-voice-disabled title="Item" open>
				{children}
			</ExpandableListBase>
		);

		const expected = true;
		const actual = expandableList.find('LabeledItem').prop('data-webos-voice-disabled');

		expect(actual).toBe(expected);
	});

	test('should set "data-webos-voice-disabled" to child item when voice control is disabled', () => {
		const children = ['option1', 'option2', 'option3'];

		const expandableList = mount(
			<ExpandableList data-webos-voice-disabled title="Item" open>
				{children}
			</ExpandableList>
		);

		const expected = true;
		const actual = expandableList.find('GroupItem').first().prop('data-webos-voice-disabled');

		expect(actual).toBe(expected);
	});

	test('should allow for selected as array when not multi-select', () => {
		const children = ['option1', 'option2', 'option3'];

		const expandableList = mount(
			<ExpandableList selected={[0, 1]} title="Item">
				{children}
			</ExpandableList>
		);

		const expected = children[0];
		const actual = expandableList.text().slice(-1 * expected.length);

		expect(actual).toBe(expected);
	});

	test('should allow for selected as array when not multi-select with object', () => {
		const children = [{
			children: 'option1',
			key: 'a'
		}, {
			children: 'option2',
			key: 'b'
		}, {
			children: 'option3',
			key: 'c'
		}];

		const expandableList = mount(
			<ExpandableList selected={[1, 2]} title="Item">
				{children}
			</ExpandableList>
		);

		const expected = children[1].children;
		const actual = expandableList.text().slice(-1 * expected.length);

		expect(actual).toBe(expected);
	});

	test('should show noneText when selected is empty array', () => {
		const children = [{
			children: 'option1',
			key: 'a'
		}, {
			children: 'option2',
			key: 'b'
		}, {
			children: 'option3',
			key: 'c'
		}];

		const expandableList = mount(
			<ExpandableList selected={[]} title="Item" noneText="hello">
				{children}
			</ExpandableList>
		);

		const expected = 'hello';
		const actual = expandableList.text().slice(-1 * expected.length);

		expect(actual).toBe(expected);
	});
});
