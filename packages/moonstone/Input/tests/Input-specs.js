import React from 'react';
import {mount} from 'enzyme';
import Input from '../Input';
import Spotlight from '@enact/spotlight';

const isPaused = () => Spotlight.isPaused() ? 'paused' : 'not paused';

describe('Input Specs', () => {
	test('should have an input element', () => {
		const subject = mount(
			<Input />
		);

		expect(subject.find('input')).toHaveLength(1);
	});

	test('should include a placeholder if specified', () => {
		const subject = mount(
			<Input placeholder="hello" />
		);

		expect(subject.find('input').prop('placeholder')).toBe('hello');
	});

	test('should callback onChange when the text changes', () => {
		const handleChange = jest.fn();
		const value = 'blah';
		const evt = {target: {value: value}};
		const subject = mount(
			<Input onChange={handleChange} />
		);

		subject.find('input').simulate('change', evt);

		const expected = value;
		const actual = handleChange.mock.calls[0][0].value;

		expect(actual).toBe(expected);
	});

	test('should blur input on enter if dismissOnEnter', () => {
		const node = document.body.appendChild(document.createElement('div'));
		const handleChange = jest.fn();

		const subject = mount(
			<Input onBlur={handleChange} dismissOnEnter />,
			{attachTo: node}
		);
		const input = subject.find('input');

		input.simulate('mouseDown');
		input.simulate('keyUp', {which: 13, keyCode: 13, code:13});
		node.remove();

		const expected = 1;
		const actual = handleChange.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test('should be able to be disabled', () => {
		const subject = mount(
			<Input disabled />
		);

		expect(subject.find('input').prop('disabled')).toBe(true);
	});

	test('should reflect the value if specified', () => {
		const subject = mount(
			<Input value="hello" />
		);

		expect(subject.find('input').prop('value')).toBe('hello');
	});

	test('should have dir equal to rtl when there is rtl text', () => {
		const subject = mount(
			<Input value="שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקי" />
		);

		const expected = 'rtl';
		const actual = subject.find('input').prop('dir');

		expect(actual).toBe(expected);
	});

	test('should have dir equal to ltr when there is ltr text', () => {
		const subject = mount(
			<Input value="content" />
		);

		const expected = 'ltr';
		const actual = subject.find('input').prop('dir');

		expect(actual).toBe(expected);
	});

	test(
		'should have dir equal to rtl when there is rtl text in the placeholder',
		() => {
			const subject = mount(
				<Input value="שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקי" />
			);

			const expected = 'rtl';
			const actual = subject.find('input').prop('dir');

			expect(actual).toBe(expected);
		}
	);

	test(
		'should have dir equal to ltr when there is ltr text in the placeholder',
		() => {
			const subject = mount(
				<Input placeholder="content" />
			);

			const expected = 'ltr';
			const actual = subject.find('input').prop('dir');

			expect(actual).toBe(expected);
		}
	);

	test(
		'should have dir equal to rtl when there is ltr text in the placeholder, but rtl text in value',
		() => {
			const subject = mount(
				<Input
					placeholder="content"
					value="שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקי"
				/>
			);

			const expected = 'rtl';
			const actual = subject.find('input').prop('dir');

			expect(actual).toBe(expected);
		}
	);

	test(
		'should have dir equal to ltr when there is rtl text in the placeholder, but ltr text in value',
		() => {
			const subject = mount(
				<Input
					placeholder="שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקי"
					value="content"
				/>
			);

			const expected = 'ltr';
			const actual = subject.find('input').prop('dir');

			expect(actual).toBe(expected);
		}
	);

	test('should pause spotlight when input has focus', () => {
		const subject = mount(
			<Input />
		);

		subject.simulate('mouseDown');

		const expected = 'paused';
		const actual = isPaused();

		Spotlight.resume();

		expect(actual).toBe(expected);
	});

	test('should resume spotlight on unmount', () => {
		const subject = mount(
			<Input />
		);

		subject.simulate('mouseDown');
		subject.unmount();

		const expected = 'not paused';
		const actual = isPaused();

		Spotlight.resume();

		expect(actual).toBe(expected);
	});

	test(
		'should display invalid message if it invalid and invalid message exists',
		() => {
			const subject = mount(
				<Input invalid invalidMessage="invalid message" />
			);

			expect(subject.find('Tooltip').prop('children')).toBe('INVALID MESSAGE');
		}
	);

	test('should not display invalid message if it is valid', () => {
		const subject = mount(
			<Input invalidMessage="invalid message" />
		);

		expect(subject.find('Tooltip')).toHaveLength(0);
	});
});
