import {mount} from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import ApplicationCloseDecorator from '../ApplicationCloseDecorator';

const Wrapper = ApplicationCloseDecorator('div');

describe.only('ApplicationCloseDecorator Specs', () => {

	it('should render ApplicationCloseButton when \'noCloseButton\' is not specified', () => {
		const subject = mount(
			<Wrapper>
				<div />
			</Wrapper>
		);
		const applicationCloseButton = subject.find('IconButton');
		const expected = 1;
		const actual = applicationCloseButton.length;

		expect(actual).to.equal(expected);
	});

	it('should not render ApplicationCloseButton when \'noCloseButton\' is specified', () => {
		const subject = mount(
			<Wrapper noCloseButton>
				<div />
			</Wrapper>
		);
		const applicationCloseButton = subject.find('IconButton');
		const expected = 0;
		const actual = applicationCloseButton.length;

		expect(actual).to.equal(expected);
	});

	it('should set ApplicationCloseButton id', () => {
		const subject = mount(
			<Wrapper>
				<div />
			</Wrapper>
		);
		const applicationCloseButton = subject.find('#closeButton');
		const expected = 1;
		const actual = applicationCloseButton.length;

		expect(actual).to.equal(expected);
	});

	it('should set ApplicationCloseButton id via prop', () => {
		const closeButtonId = 'testCloseButtonId';
		const subject = mount(
			<Wrapper closeButtonId={closeButtonId}>
				<div />
			</Wrapper>
		);
		const applicationCloseButton = subject.find(`#${closeButtonId}`);
		const expected = 1;
		const actual = applicationCloseButton.length;

		expect(actual).to.equal(expected);
	});

	it('should call onApplicationClose when application close button is clicked', function () {
		const handleAppClose = sinon.spy();
		const subject = mount(
			<Wrapper onApplicationClose={handleAppClose} >
				<div />
			</Wrapper>
		);

		subject.find('IconButton').simulate('click');

		const expected = true;
		const actual = handleAppClose.calledOnce;

		expect(expected).to.equal(actual);
	});
});
