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

	test(
		'should forward onFocusCapture events',
		() => {
			const spy = jest.fn();
			let focus;

			const Component = SpotlightContainerDecorator(({onFocusCapture}) => {
				focus = onFocusCapture;
				return <div />;
			});
			mount(<Component onFocusCapture={spy} />);

			focus({});

			const expected = 1;
			const actual = spy.mock.calls.length;
			expect(actual).toBe(expected);
		}
	);

	test(
		'should suppress onFocusCapture events when spotlightDisabled',
		() => {
			const spy = jest.fn();
			let focus;

			const Component = SpotlightContainerDecorator(({onFocusCapture}) => {
				focus = onFocusCapture;
				return <div />;
			});
			mount(<Component onFocusCapture={spy} spotlightDisabled />);

			// building out the api called on the event object + target
			focus({
				stopPropagation: () => true,
				target: {
					blur: () => true
				}
			});

			const expected = 0;
			const actual = spy.mock.calls.length;
			expect(actual).toBe(expected);
		}
	);

	test(
		'should forward onBlurCapture events',
		() => {
			const spy = jest.fn();
			let blur;

			const Component = SpotlightContainerDecorator(({onBlurCapture}) => {
				blur = onBlurCapture;
				return <div />;
			});
			mount(<Component onBlurCapture={spy} spotlightDisabled />);

			// building out the api called on the event object + target
			blur({
				stopPropagation: () => true,
				target: {
					blur: () => blur({})
				}
			});

			const expected = 1;
			const actual = spy.mock.calls.length;
			expect(actual).toBe(expected);
		}
	);

	test(
		'should suppress onBlurCapture events when focus was suppressed',
		() => {
			const spy = jest.fn();
			let focus;
			let blur;

			const Component = SpotlightContainerDecorator(({onBlurCapture, onFocusCapture}) => {
				blur = onBlurCapture;
				focus = onFocusCapture;
				return <div />;
			});
			mount(<Component onBlurCapture={spy} spotlightDisabled />);

			// building out the api called on the event object + target
			focus({
				stopPropagation: () => true,
				target: {
					// the focus handler calls blur() on the target so we're simulating that here by
					// wiring our onBlurCapture handler directly to the invocation. This isn't a
					// perfect modeling of the system but serves to validate the callback
					// suppression logic.
					blur: () => blur({})
				}
			});

			const expected = 0;
			const actual = spy.mock.calls.length;
			expect(actual).toBe(expected);
		}
	);
});
