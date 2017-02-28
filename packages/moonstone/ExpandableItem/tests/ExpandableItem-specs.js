import React from 'react';
import {mount} from 'enzyme';
import {ExpandableItemBase} from '../ExpandableItem';

describe('ExpandableItem', () => {
	it('should close when disabled', function () {
		const wrapped = mount(
			<ExpandableItemBase title="Item" open>
				<div>Hello</div>
			</ExpandableItemBase>
		);

		wrapped.setProps({disabled: true});

		const expected = false;
		const actual = wrapped.find('ExpandableContainer').prop('open');

		expect(actual).to.equal(expected);
	});

	describe('computed', () => {
		describe('label', () => {
			it('should use noneText when label is not set', function () {
				const expected = 'noneText';
				const actual = ExpandableItemBase.computed.label({
					showLabel: 'always',
					noneText: 'noneText'
				});

				expect(actual).to.equal(expected);
			});

			it('should use label when set', function () {
				const expected = 'label';
				const actual = ExpandableItemBase.computed.label({
					showLabel: 'always',
					label: 'label',
					noneText: 'noneText'
				});

				expect(actual).to.equal(expected);
			});

			it('should be null when showLabel is "never"', function () {
				const expected = null;
				const actual = ExpandableItemBase.computed.label({
					showLabel: 'never',
					label: 'label',
					noneText: 'noneText'
				});

				expect(actual).to.equal(expected);
			});

			it('should be null when showLabel is "auto" and open is true', function () {
				const expected = null;
				const actual = ExpandableItemBase.computed.label({
					label: 'label',
					open: true,
					showLabel: 'auto'
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
