import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import {PlainInput as Input} from '../Input';

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
		const subject = shallow(
			<Input onChange={handleChange} />
		);

		subject.find('input').simulate('change', evt);

		expect(handleChange.calledWith(evt)).to.be.true();
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
