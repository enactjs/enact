import React from 'react';
import {shallow} from 'enzyme';
import {ExpandableInputBase} from '../ExpandableInput';

describe('ExpandableInput', () => {
	describe('#aria-label', () => {
		it('should use title, value, and hint', function () {
			const subject = shallow(
				<ExpandableInputBase title="Item" value="value" />
			);

			const expected = 'Item value edit box';
			const actual = subject.prop('aria-label');

			expect(actual).to.equal(expected);
		});

		it('should use title, noneText, and hint when value is not set', function () {
			const subject = shallow(
				<ExpandableInputBase title="Item" noneText="noneText" />
			);

			const expected = 'Item noneText edit box';
			const actual = subject.prop('aria-label');

			expect(actual).to.equal(expected);
		});

		it('should use title and hint when value and noneText are not set', function () {
			const subject = shallow(
				<ExpandableInputBase title="Item" />
			);

			const expected = 'Item  edit box'; // the extra space is intentional
			const actual = subject.prop('aria-label');

			expect(actual).to.equal(expected);
		});

		it('should use title, character count, and hint when type is "password"', function () {
			const subject = shallow(
				<ExpandableInputBase title="Item" type="password" value="long" />
			);

			const expected = 'Item 4 characters edit box';
			const actual = subject.prop('aria-label');

			expect(actual).to.equal(expected);
		});

		it('should use title, single character count, and hint when type is "password" and value length is 1', function () {
			const subject = shallow(
				<ExpandableInputBase title="Item" type="password" value="1" />
			);

			const expected = 'Item 1 character edit box';
			const actual = subject.prop('aria-label');

			expect(actual).to.equal(expected);
		});
	});

	describe('#label', () => {
		it('should use value', function () {
			const subject = shallow(
				<ExpandableInputBase title="Item" value="value" />
			);

			const expected = 'value';
			const actual = subject.prop('label');

			expect(actual).to.equal(expected);
		});

		it('should use noneText when value is not set', function () {
			const subject = shallow(
				<ExpandableInputBase title="Item" noneText="noneText" />
			);

			const expected = 'noneText';
			const actual = subject.prop('label');

			expect(actual).to.equal(expected);
		});

		it('should be excluded when type is "password"', function () {
			const subject = shallow(
				<ExpandableInputBase title="Item" value="value" type="password" />
			);

			const expected = null;
			const actual = subject.prop('label');

			expect(actual).to.equal(expected);
		});
	});
});
