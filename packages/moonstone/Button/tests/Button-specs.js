import React from 'react';
import {mount, shallow} from 'enzyme';
import sinon from 'sinon';
import {Button, ButtonBase} from '../Button';

describe('Button', () => {

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

	it('should not add "aria-pressed" when "selected" is omitted', function () {
		const button = shallow(
			<ButtonBase />
		);

		const expected = false;
		const actual = 'aria-pressed' in button.props();

		expect(actual).to.equal(expected);
	});

	it('should set "aria-pressed" to the value of "selected"', function () {
		const button = shallow(
			<ButtonBase selected={false} />
		);

		const expected = false;
		const actual = button.prop('aria-pressed');

		expect(actual).to.equal(expected);
	});

	describe('events', () => {
		it('should call onClick when not disabled', function () {
			const handleClick = sinon.spy();
			const subject = mount(
				<Button onClick={handleClick}>I am a disabled Button</Button>
			);

			subject.simulate('click');

			const expected = true;
			const actual = handleClick.called;

			expect(actual).to.equal(expected);
		});

		it('should not call onClick when disabled', function () {
			const handleClick = sinon.spy();
			const subject = mount(
				<Button disabled onClick={handleClick}>I am a disabled Button</Button>
			);

			subject.simulate('click');

			const expected = false;
			const actual = handleClick.called;

			expect(actual).to.equal(expected);
		});
	});
});
