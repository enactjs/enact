import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import Button from '../Button';

describe('Button', () => {

	test('should render with button text upper-cased', () => {
		let msg = 'Hello Button!';

		const button = mount(
			<Button>{msg}</Button>
		);

		const expected = msg.toUpperCase();
		const actual = button.text();

		expect(actual).toBe(expected);
	});

	test(
		'should have \'disabled\' HTML attribute when \'disabled\' prop is provided',
		() => {
			const button = mount(
				<Button disabled>I am a disabled Button</Button>
			);

			const expected = true;
			const actual = button.find('div').at(0).prop('disabled');

			expect(actual).toBe(expected);
		}
	);

	describe('events', () => {
		test('should call onClick when not disabled', () => {
			const handleClick = sinon.spy();
			const subject = mount(
				<Button onClick={handleClick}>I am a disabled Button</Button>
			);

			subject.simulate('click');

			const expected = true;
			const actual = handleClick.called;

			expect(actual).toBe(expected);
		});

		test('should not call onClick when disabled', () => {
			const handleClick = sinon.spy();
			const subject = mount(
				<Button disabled onClick={handleClick}>I am a disabled Button</Button>
			);

			subject.simulate('click');

			const expected = false;
			const actual = handleClick.called;

			expect(actual).toBe(expected);
		});
	});
});
