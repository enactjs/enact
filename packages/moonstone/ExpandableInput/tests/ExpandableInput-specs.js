import React from 'react';
import {mount, shallow} from 'enzyme';
import {ExpandableInput, ExpandableInputBase} from '../ExpandableInput';

describe('ExpandableInputBase', () => {
	const inputHint = ' Input field';
	describe('#aria-label', () => {
		test('should use title, value, and input hint', () => {
			const subject = shallow(
				<ExpandableInputBase title="Item" value="value" />
			);

			const expected = 'Item value' + inputHint;
			const actual = subject.prop('aria-label');

			expect(actual).toBe(expected);
		});

		test(
			'should use title, noneText, and input hint when value is not set',
			() => {
				const subject = shallow(
					<ExpandableInputBase title="Item" noneText="noneText" />
				);

				const expected = 'Item noneText' + inputHint;
				const actual = subject.prop('aria-label');

				expect(actual).toBe(expected);
			}
		);

		test(
			'should use title and input hint when value and noneText are not set',
			() => {
				const subject = shallow(
					<ExpandableInputBase title="Item" />
				);

				const expected = 'Item ' + inputHint; // the extra space is intentional
				const actual = subject.prop('aria-label');

				expect(actual).toBe(expected);
			}
		);

		test(
			'should use title, character count, and input hint when type is "password"',
			() => {
				const subject = shallow(
					<ExpandableInputBase title="Item" type="password" value="long" />
				);

				const expected = 'Item 4 characters' + inputHint;
				const actual = subject.prop('aria-label');

				expect(actual).toBe(expected);
			}
		);

		test(
			'should use title, single character count, and input hint when type is "password" and value length is 1',
			() => {
				const subject = shallow(
					<ExpandableInputBase title="Item" type="password" value="1" />
				);

				const expected = 'Item 1 character' + inputHint;
				const actual = subject.prop('aria-label');

				expect(actual).toBe(expected);
			}
		);
	});

	describe('#label', () => {
		test('should use value', () => {
			const subject = shallow(
				<ExpandableInputBase title="Item" value="value" />
			);

			const expected = 'value';
			const actual = subject.prop('label');

			expect(actual).toBe(expected);
		});

		test('should use noneText when value is not set', () => {
			const subject = shallow(
				<ExpandableInputBase title="Item" noneText="noneText" />
			);

			const expected = 'noneText';
			const actual = subject.prop('label');

			expect(actual).toBe(expected);
		});

		test('should be excluded when type is "password"', () => {
			const subject = shallow(
				<ExpandableInputBase title="Item" value="value" type="password" />
			);

			const expected = null;
			const actual = subject.prop('label');

			expect(actual).toBe(expected);
		});
	});
});

describe('ExpandableInput', () => {
	test('should pass onChange callback to input', () => {
		const handleChange = jest.fn();
		const value = 'input string';
		const evt = {target: {value: value}};

		const subject = mount(
			<ExpandableInput title="Item" open onChange={handleChange} />
		);

		subject.find('input').simulate('change', evt);

		const expected = value;
		const actual = handleChange.mock.calls[0][0].value;

		expect(actual).toBe(expected);
	});
});
