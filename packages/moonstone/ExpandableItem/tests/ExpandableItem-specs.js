import React from 'react';
import {ExpandableItemBase} from '../ExpandableItem';
import {mount} from 'enzyme';

describe('ExpandableItem', () => {
	describe('computed', () => {
		describe('label', () => {
			test('should use noneText when label is not set', () => {
				const expected = 'noneText';
				const actual = ExpandableItemBase.computed.label({
					noneText: 'noneText'
				});

				expect(actual).toBe(expected);
			});

			test('should use label when set', () => {
				const expected = 'label';
				const actual = ExpandableItemBase.computed.label({
					label: 'label',
					noneText: 'noneText'
				});

				expect(actual).toBe(expected);
			});
		});

		describe('open', () => {
			test('should be false when disabled', () => {
				const expected = false;
				const actual = ExpandableItemBase.computed.open({
					disabled: true,
					open: true
				});

				expect(actual).toBe(expected);
			});
		});
	});

	describe('Voice Control', () => {
		test('should set ExpandableItem "data-webos-voice-disabled" when voice control is disabled', () => {
			const children = ['option1', 'option2', 'option3'];

			const expandableItem = mount(
				<ExpandableItemBase data-webos-voice-disabled title="Item">
					{children}
				</ExpandableItemBase>
			);

			const expected = true;
			const actual = expandableItem.find('ExpandableItem').prop('data-webos-voice-disabled');

			expect(actual).toBe(expected);
		});
	});
});
