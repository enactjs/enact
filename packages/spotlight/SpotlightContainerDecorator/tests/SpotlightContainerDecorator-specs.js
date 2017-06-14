import {mount} from 'enzyme';
import React from 'react';
import Spotlight from '../../src/spotlight';

import SpotlightContainerDecorator from '../SpotlightContainerDecorator';

import closest from './Element.prototype.closest';

describe('SpotlightContainerDecorator', () => {

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
			<Component containerId="test-container" />
		);

		subject.find(Div).prop('onMouseEnter')();

		const expected = 'test-container';
		const actual = Spotlight.getActiveContainer();

		expect(actual).to.equal(expected);
	});

	it('should set active container to parent container on mouse leave', function () {
		const Component = SpotlightContainerDecorator(Div);

		const node = document.createElement('div');
		const subject = mount(
			<Component containerId="outer-container">
				<Component containerId="inner-container" />
			</Component>,
			{attachTo: node}
		);

		const selector = '[data-container-id="inner-container"]';
		const innerWrapper = subject.find(selector);
		const innerNode = node.querySelector(selector);

		// set inner-container as active
		innerWrapper.prop('onMouseEnter')();

		// leave inner-container
		innerWrapper.prop('onMouseLeave')({currentTarget: innerNode});

		const expected = 'outer-container';
		const actual = Spotlight.getActiveContainer();

		expect(actual).to.equal(expected);
	});

	it('should not set active container on mouse leave if another container is active', function () {
		const Component = SpotlightContainerDecorator(Div);

		const node = document.createElement('div');
		const subject = mount(
			<Component containerId="outer-container">
				<Component containerId="inner-container" />
				<Component containerId="self-only-container" />
			</Component>,
			{attachTo: node}
		);

		const selector = '[data-container-id="inner-container"]';
		const innerWrapper = subject.find(selector);
		const innerNode = node.querySelector(selector);

		// set inner-container as active
		innerWrapper.prop('onMouseEnter')();

		// set another container to be active
		Spotlight.setActiveContainer('self-only-container');

		// leave inner-container
		innerWrapper.prop('onMouseLeave')({currentTarget: innerNode});

		const expected = 'self-only-container';
		const actual = Spotlight.getActiveContainer();

		expect(actual).to.equal(expected);
	});
});
