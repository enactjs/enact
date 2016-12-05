import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import Input from '../Input';

describe('Input Specs', () => {
	it('Should have an input element', function () {
		const subject = mount(
			<Input />
		);

		expect(subject.find('input')).to.have.length(1);
	});

	it('Should include a placeholder if specified', function () {
		const subject = mount(
			<Input placeholder="hello" />
		);

		expect(subject.find('input').prop('placeholder')).to.equal('hello');
	});

	it('Should callback onChange when the text changes', function () {
		const handleChange = sinon.spy();
		const value = 'blah';
		const evt = {target: {value: value}};
		const subject = mount(
			<Input onChange={handleChange} />
		);

		subject.find('input').simulate('change', evt);

		const expected = value;
		const actual = handleChange.firstCall.args[0].value;

		expect(actual).to.equal(expected);
	});

	it('Should blur input on enter if dismissOnEnter', function () {
		const node = document.body.appendChild(document.createElement('div'));
		const handleChange = sinon.spy();

		const subject = mount(
			<Input onBlur={handleChange} dismissOnEnter />,
			{attachTo: node}
		);
		const input = subject.find('input');

		input.node.focus();
		input.simulate('keyDown', {nativeEvent: {which: 13, keyCode: 13}});
		node.remove();

		const expected = true;
		const actual = handleChange.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('Should be able to be disabled', function () {
		const subject = mount(
			<Input disabled />
		);

		expect(subject.find('input').prop('disabled')).to.true();
	});

	it('Should reflect the value if specified', function () {
		const subject = mount(
			<Input value="hello" />
		);

		expect(subject.find('input').prop('value')).to.equal('hello');
	});

});
