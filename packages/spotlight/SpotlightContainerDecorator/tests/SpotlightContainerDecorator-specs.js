import {mount} from 'enzyme';
import React from 'react';
import Spotlight from '../../src/spotlight';

import SpotlightContainerDecorator from '../SpotlightContainerDecorator';

import closest from './Element.prototype.closest';

describe('SpotlightContainerDecorator', () => {

	const hoverPosition = {clientX: 0, clientY: 1};
	const unhoverPosition = {clientX: 0, clientY: 0};

	const Div = (props) => (
		<div {...props} />
	);

	closest(before, after);

	beforeEach(() => {
		Spotlight.setActiveContainer(null);
	});

	it('should set itself as the active container on mouse enter', function () {
		const Component = SpotlightContainerDecorator(Div);

		const subject = mount(
			<Component spotlightId="test-container" />
		);

		const div = subject.find(Div);

		// initialize pointer position
		div.prop('onMouseMove')(unhoverPosition);

		div.prop('onMouseEnter')(hoverPosition);

		const expected = 'test-container';
		const actual = Spotlight.getActiveContainer();

		expect(actual).to.equal(expected);
	});

	it('should set active container to parent container on mouse leave', function () {
		const Component = SpotlightContainerDecorator(Div);

		const node = document.createElement('div');
		const subject = mount(
			<Component spotlightId="outer-container">
				<Component spotlightId="inner-container" />
			</Component>,
			{attachTo: node}
		);

		const selector = 'div[data-spotlight-id="inner-container"]';
		const innerWrapper = subject.find(selector);
		const innerNode = node.querySelector(selector);

		// initialize pointer position
		innerWrapper.prop('onMouseMove')(unhoverPosition);

		// set inner-container as active
		innerWrapper.prop('onMouseEnter')(hoverPosition);
		innerWrapper.prop('onMouseMove')(hoverPosition);

		// leave inner-container
		innerWrapper.prop('onMouseLeave')({...unhoverPosition, currentTarget: innerNode});

		const expected = 'outer-container';
		const actual = Spotlight.getActiveContainer();

		expect(actual).to.equal(expected);
	});

	it('should not set active container on mouse leave if another container is active', function () {
		const Component = SpotlightContainerDecorator(Div);

		const node = document.createElement('div');
		const subject = mount(
			<Component spotlightId="outer-container">
				<Component spotlightId="inner-container" />
				<Component spotlightId="self-only-container" />
			</Component>,
			{attachTo: node}
		);

		const selector = 'div[data-spotlight-id="inner-container"]';
		const innerWrapper = subject.find(selector);
		const innerNode = node.querySelector(selector);

		// initialize pointer position
		innerWrapper.prop('onMouseMove')(unhoverPosition);

		// set inner-container as active
		innerWrapper.prop('onMouseEnter')(hoverPosition);
		innerWrapper.prop('onMouseMove')(hoverPosition);

		// set another container to be active
		Spotlight.setActiveContainer('self-only-container');

		// leave inner-container
		innerWrapper.prop('onMouseLeave')({...unhoverPosition, currentTarget: innerNode});

		const expected = 'self-only-container';
		const actual = Spotlight.getActiveContainer();

		expect(actual).to.equal(expected);
	});
});
