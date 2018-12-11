import {ExpandableItemBase} from '../ExpandableItem';

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
});
