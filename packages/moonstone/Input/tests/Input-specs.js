import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import Input from '../Input';
import Spotlight from '@enact/spotlight';

const isPaused = () => Spotlight.isPaused() ? 'paused' : 'not paused';

describe('Input Specs', () => {
	it('should have an input element', () => {
		const subject = mount(
			<Input />
		);

		expect(subject.find('input')).to.have.length(1);
	});

	it('should include a placeholder if specified', () => {
		const subject = mount(
			<Input placeholder="hello" />
		);

		expect(subject.find('input').prop('placeholder')).to.equal('hello');
	});

	it('should callback onChange when the text changes', () => {
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

	it('should blur input on enter if dismissOnEnter', () => {
		const node = document.body.appendChild(document.createElement('div'));
		const handleChange = sinon.spy();

		const subject = mount(
			<Input onBlur={handleChange} dismissOnEnter />,
			{attachTo: node}
		);
		const input = subject.find('input');

		node.querySelector('input').focus();
		input.simulate('keyDown', {nativeEvent: {which: 13, keyCode: 13}});
		node.remove();

		const expected = true;
		const actual = handleChange.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should be able to be disabled', () => {
		const subject = mount(
			<Input disabled />
		);

		expect(subject.find('input').prop('disabled')).to.true();
	});

	it('should reflect the value if specified', () => {
		const subject = mount(
			<Input value="hello" />
		);

		expect(subject.find('input').prop('value')).to.equal('hello');
	});

	it('should have dir equal to rtl when there is rtl text', () => {
		const subject = mount(
			<Input value="שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקי" />
		);

		const expected = 'rtl';
		const actual = subject.find('input').prop('dir');

		expect(actual).to.equal(expected);
	});

	it('should have dir equal to ltr when there is ltr text', () => {
		const subject = mount(
			<Input value="content" />
		);

		const expected = 'ltr';
		const actual = subject.find('input').prop('dir');

		expect(actual).to.equal(expected);
	});

	it('should have dir equal to rtl when there is rtl text in the placeholder', () => {
		const subject = mount(
			<Input value="שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקי" />
		);

		const expected = 'rtl';
		const actual = subject.find('input').prop('dir');

		expect(actual).to.equal(expected);
	});

	it('should have dir equal to ltr when there is ltr text in the placeholder', () => {
		const subject = mount(
			<Input placeholder="content" />
		);

		const expected = 'ltr';
		const actual = subject.find('input').prop('dir');

		expect(actual).to.equal(expected);
	});

	it('should have dir equal to rtl when there is ltr text in the placeholder, but rtl text in value', () => {
		const subject = mount(
			<Input
				placeholder="content"
				value="שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקי"
			/>
		);

		const expected = 'rtl';
		const actual = subject.find('input').prop('dir');

		expect(actual).to.equal(expected);
	});

	it('should have dir equal to ltr when there is rtl text in the placeholder, but ltr text in value', () => {
		const subject = mount(
			<Input
				placeholder="שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקי"
				value="content"
			/>
		);

		const expected = 'ltr';
		const actual = subject.find('input').prop('dir');

		expect(actual).to.equal(expected);
	});

	it('should pause spotlight when input has focus', () => {
		const subject = mount(
			<Input />
		);

		subject.simulate('mouseDown');

		const expected = 'paused';
		const actual = isPaused();

		Spotlight.resume();

		expect(actual).to.equal(expected);
	});

	it('should resume spotlight on unmount', () => {
		const subject = mount(
			<Input />
		);

		subject.simulate('mouseDown');
		subject.unmount();

		const expected = 'not paused';
		const actual = isPaused();

		Spotlight.resume();

		expect(actual).to.equal(expected);
	});

	it('should display invalid message if it invalid and invalid message exists', () => {
		const subject = mount(
			<Input invalid invalidMessage="invalid message" />
		);

		expect(subject.find('Tooltip').prop('children')).to.equal('INVALID MESSAGE');
	});

	it('should not display invalid message if it is valid', () => {
		const subject = mount(
			<Input invalidMessage="invalid message" />
		);

		expect(subject.find('Tooltip')).to.have.length(0);
	});
});
