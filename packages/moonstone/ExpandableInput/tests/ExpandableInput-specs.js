import React from 'react';
import sinon from 'sinon';
import {mount, shallow} from 'enzyme';
import {ExpandableInput, ExpandableInputBase} from '../ExpandableInput';

describe('ExpandableInputBase', () => {
	const inputHint = ' input field';
	describe('#aria-label', () => {
		it('should use title, value, and input hint', function () {
			const subject = shallow(
				<ExpandableInputBase title="Item" value="value" />
			);

			const expected = 'Item value' + inputHint;
			const actual = subject.prop('aria-label');

			expect(actual).to.equal(expected);
		});

		it('should use title, noneText, and input hint when value is not set', function () {
			const subject = shallow(
				<ExpandableInputBase title="Item" noneText="noneText" />
			);

			const expected = 'Item noneText' + inputHint;
			const actual = subject.prop('aria-label');

			expect(actual).to.equal(expected);
		});

		it('should use title and input hint when value and noneText are not set', function () {
			const subject = shallow(
				<ExpandableInputBase title="Item" />
			);

			const expected = 'Item ' + inputHint; // the extra space is intentional
			const actual = subject.prop('aria-label');

			expect(actual).to.equal(expected);
		});

		it('should use title, character count, and input hint when type is "password"', function () {
			const subject = shallow(
				<ExpandableInputBase title="Item" type="password" value="long" />
			);

			const expected = 'Item 4 characters' + inputHint;
			const actual = subject.prop('aria-label');

			expect(actual).to.equal(expected);
		});

		it('should use title, single character count, and input hint when type is "password" and value length is 1', function () {
			const subject = shallow(
				<ExpandableInputBase title="Item" type="password" value="1" />
			);

			const expected = 'Item 1 character' + inputHint;
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

describe('ExpandableInput', () => {
	it('should pass onChange callback to input', () => {
		const handleChange = sinon.spy();
		const value = 'input string';
		const evt = {target: {value: value}};

		const subject = mount(
			<ExpandableInput title="Item" open onChange={handleChange} />
		);

		subject.find('input').simulate('change', evt);

		const expected = value;
		const actual = handleChange.firstCall.args[0].value;

		expect(actual).to.equal(expected);
	});
});
