import React from 'react';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';
import {PlainInputBase as Input} from '../PlainInput';
import {InputBase} from '../Input';

describe('Input Specs', () => {
	it('Should have an input element', function () {
		const subject = shallow(
			<Input />
		);

		expect(subject.find('input')).to.have.length(1);
	});

	it('Should include a placeholder if specified', function () {
		const subject = shallow(
			<Input placeholder="hello" />
		);

		expect(subject.find('input').prop('placeholder')).to.equal('hello');
	});

	it('Should callback onChange when the text changes', function () {
		const handleChange = sinon.spy();
		const evt = {target: {value: 'blah'}};
		const subject = mount(
			<Input onChange={handleChange} />
		);

		subject.find('input').simulate('change', evt);

		expect(handleChange.calledWith(evt)).to.be.true();
	});

	it('Should blur input on enter if dismissOnEnter', function () {
		const node = document.body.appendChild(document.createElement('div'));
		const handleChange = sinon.spy();

		const subject = mount(
			<InputBase onBlur={handleChange} dismissOnEnter />,
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
		const subject = shallow(
			<Input disabled />
		);

		expect(subject.find('input').prop('disabled')).to.true();
	});

	it('Should reflect the value if specified', function () {
		const subject = shallow(
			<Input value="hello" />
		);

		expect(subject.find('input').prop('value')).to.equal('hello');
	});

});
