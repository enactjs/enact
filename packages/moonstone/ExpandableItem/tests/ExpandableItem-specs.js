import {ExpandableItemBase} from '../ExpandableItem';

describe('ExpandableItem', () => {
	describe('computed', () => {
		describe('label', () => {
			it('should use noneText when label is not set', function () {
				const expected = 'noneText';
				const actual = ExpandableItemBase.computed.label({
					noneText: 'noneText'
				});

				expect(actual).to.equal(expected);
			});

			it('should use label when set', function () {
				const expected = 'label';
				const actual = ExpandableItemBase.computed.label({
					label: 'label',
					noneText: 'noneText'
				});

				expect(actual).to.equal(expected);
			});
		});

		describe('open', () => {
			it('should be false when disabled', function () {
				const expected = false;
				const actual = ExpandableItemBase.computed.open({
					disabled: true,
					open: true
				});

				expect(actual).to.equal(expected);
			});
		});
	});
});
