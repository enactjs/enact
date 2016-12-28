import React from 'react';
import {mount} from 'enzyme';
import Button from '../Button';

describe('Button Specs', () => {

	it('should render with button text upper-cased', function () {
		let msg = 'Hello Button!';

		const button = mount(
			<Button>{msg}</Button>
		);

		const expected = msg.toUpperCase();
		const actual = button.text();

		expect(actual).to.equal(expected);
	});

	it('should not convert text content when preserveCase=true', function () {
		let msg = 'Hello Button!';
		const button = mount(
			<Button preserveCase>{msg}</Button>
		);

		const expected = msg;
		const actual = button.text();

		expect(actual).to.equal(expected);
	});

	it('should have \'disabled\' HTML attribute when \'disabled\' prop is provided', function () {
		const button = mount(
			<Button disabled>I am a disabled Button</Button>
		);

		const expected = 1;
		const actual = button.find({disabled: true}).length;

		expect(actual).to.equal(expected);
	});
});
