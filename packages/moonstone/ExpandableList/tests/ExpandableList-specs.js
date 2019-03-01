import React from 'react';
import {mount} from 'enzyme';
import {ExpandableListBase} from '../ExpandableList';

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
			<ExpandableListBase title="Item" open>
				{children}
			</ExpandableListBase>
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
			<ExpandableListBase data-webos-voice-disabled title="Item" open>
				{children}
			</ExpandableListBase>
		);

		const expected = true;
		const actual = expandableList.find('GroupItem').first().prop('data-webos-voice-disabled');

		expect(actual).toBe(expected);
	});
});
