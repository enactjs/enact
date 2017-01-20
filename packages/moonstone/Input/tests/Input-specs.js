import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import Input from '../Input';
import Spotlight from '@enact/spotlight';

describe('Input Specs', () => {
	it('should have an input element', function () {
		const subject = mount(
			<Input />
		);

		expect(subject.find('input')).to.have.length(1);
	});

	it('should include a placeholder if specified', function () {
		const subject = mount(
			<Input placeholder="hello" />
		);

		expect(subject.find('input').prop('placeholder')).to.equal('hello');
	});

	it('should callback onChange when the text changes', function () {
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

	it('should blur input on enter if dismissOnEnter', function () {
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

	it('should be able to be disabled', function () {
		const subject = mount(
			<Input disabled />
		);

		expect(subject.find('input').prop('disabled')).to.true();
	});

	it('should reflect the value if specified', function () {
		const subject = mount(
			<Input value="hello" />
		);

		expect(subject.find('input').prop('value')).to.equal('hello');
	});

	it('should have dir equal to rtl when there is rtl text', function () {
		const subject = mount(
			<Input value="שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקי" />
		);

		const expected = 'rtl';
		const actual = subject.find('input').prop('dir');

		expect(actual).to.equal(expected);
	});

	it('should have dir equal to ltr when there is ltr text', function () {
		const subject = mount(
			<Input value="content" />
		);

		const expected = 'ltr';
		const actual = subject.find('input').prop('dir');

		expect(actual).to.equal(expected);
	});

	it('should have dir equal to rtl when there is rtl text in the placeholder', function () {
		const subject = mount(
			<Input value="שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקי" />
		);

		const expected = 'rtl';
		const actual = subject.find('input').prop('dir');

		expect(actual).to.equal(expected);
	});

	it('should have dir equal to ltr when there is ltr text in the placeholder', function () {
		const subject = mount(
			<Input placeholder="content" />
		);

		const expected = 'ltr';
		const actual = subject.find('input').prop('dir');

		expect(actual).to.equal(expected);
	});

	it('should have dir equal to rtl when there is ltr text in the placeholder, but rtl text in value', function () {
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

	it('should have dir equal to ltr when there is rtl text in the placeholder, but ltr text in value', function () {
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

	it('Should pause spotlight when input has focus', function () {
		const pauseSpy = sinon.spy(Spotlight, 'pause');
		const subject = mount(
			<Input />
		);

		subject.simulate('click');

		const expected = true;
		const actual = pauseSpy.calledOnce;

		Spotlight.pause.restore();
		expect(actual).to.equal(expected);
	});

	it('Should resume spotlight on unmount', function () {
		const resumeSpy = sinon.spy(Spotlight, 'resume');
		const subject = mount(
			<Input />
		);

		subject.simulate('click');
		subject.unmount();

		const expected = true;
		const actual = resumeSpy.calledOnce;

		Spotlight.resume.restore();
		expect(actual).to.equal(expected);
	});
});
