/* global beforeAll, afterAll*/
import {mount} from 'enzyme';
import React from 'react';
import Spotlight from '../../src/spotlight';
import {updatePointerPosition} from '../../src/pointer';

import SpotlightContainerDecorator from '../SpotlightContainerDecorator';

import closest from './Element.prototype.closest';

describe('SpotlightContainerDecorator', () => {

	const hoverPosition = {clientX: 0, clientY: 1};
	const unhoverPosition = {clientX: 0, clientY: 0};

	const Div = (props) => (
		<div {...props} />
	);

	closest(beforeAll, afterAll);

	beforeEach(() => {
		Spotlight.setActiveContainer(null);
		updatePointerPosition(0, 0);
	});

	test('should set itself as the active container on mouse enter', () => {
		const Component = SpotlightContainerDecorator(Div);

		const subject = mount(
			<Component spotlightId="test-container" />
		);

		subject.find(Div).prop('onMouseEnter')(hoverPosition);

		const expected = 'test-container';
		const actual = Spotlight.getActiveContainer();

		expect(actual).toBe(expected);
	});

	test(
		'should set active container to parent container on mouse leave',
		() => {
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

			// set inner-container as active
			innerWrapper.prop('onMouseEnter')(hoverPosition);
			updatePointerPosition(0, 1);

			// leave inner-container
			innerWrapper.prop('onMouseLeave')({...unhoverPosition, currentTarget: innerNode});

			const expected = 'outer-container';
			const actual = Spotlight.getActiveContainer();

			expect(actual).toBe(expected);
		}
	);

	test(
		'should not set active container on mouse leave if another container is active',
		() => {
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

			// set inner-container as active
			innerWrapper.prop('onMouseEnter')(hoverPosition);
			updatePointerPosition(0, 1);

			// set another container to be active
			Spotlight.setActiveContainer('self-only-container');

			// leave inner-container
			innerWrapper.prop('onMouseLeave')({...unhoverPosition, currentTarget: innerNode});

			const expected = 'self-only-container';
			const actual = Spotlight.getActiveContainer();

			expect(actual).toBe(expected);
		}
	);
});
