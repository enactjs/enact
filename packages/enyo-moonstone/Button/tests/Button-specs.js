import React from 'react';
import {mount} from 'enzyme';
import Button from '../Button';

describe('Button Specs', () => {

	it('should render a single \<button\> tag', function () {
		const msg = 'Hello Button!';
		const button = mount(
			<Button>{msg}</Button>
		);

		const buttonTag = button.find('button');
		const expected = 1;
		const actual = buttonTag.length;

		expect(actual).to.equal(expected);
	});

	it('should render with button text upper-cased', function () {
		let msg = 'Hello Button!';

		const button = mount(
			<Button>{msg}</Button>
		);

		const expected = msg.toUpperCase();
		const actual = button.text();

		expect(actual).to.equal(expected);
	});

	it('should not convert text content when uppercase=false', function () {
		let msg = 'Hello Button!';
		const button = mount(
			<Button uppercase={false}>{msg}</Button>
		);

		const expected = msg;
		const actual = button.text();

		expect(actual).to.equal(expected);
	});
});
