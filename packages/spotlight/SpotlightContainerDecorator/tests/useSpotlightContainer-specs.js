import {mount} from 'enzyme';
import React from 'react';
import Spotlight from '../../src/spotlight';
import {updatePointerPosition} from '../../src/pointer';

import useSpotlightContainer from '../useSpotlightContainer';

import closest from './Element.prototype.closest';

describe('useSpotlightContainer', () => {

	const hoverPosition = {clientX: 0, clientY: 1};
	const unhoverPosition = {clientX: 0, clientY: 0};

	const Div = (props) => (
		<div {...props} />
	);

	// eslint-disable-next-line enact/prop-types
	function Component ({component, spotlightDisabled, spotlightMuted, ...rest}) {
		const spotlightContainer = useSpotlightContainer({spotlightDisabled, ...rest});
		const Wrapped = component || Div;
		const updated = {...rest};

		delete updated.containerId;
		delete updated.spotlightId;
		delete updated.spotlightupdatedrict;

		updated['data-spotlight-container'] = true;
		updated['data-spotlight-id'] = spotlightContainer.id;
		updated.onBlurCapture = spotlightContainer.blur;
		updated.onFocusCapture = spotlightContainer.focus;
		updated.onMouseEnter = spotlightContainer.mouseEnter;
		updated.onMouseLeave = spotlightContainer.mouseLeave;

		if (spotlightDisabled) {
			updated['data-spotlight-container-disabled'] = spotlightDisabled;
		}

		if (spotlightMuted) {
			updated['data-spotlight-container-muted'] = spotlightMuted;
		}

		return (
			<Wrapped {...updated} />
		);
	}

	closest(beforeAll, afterAll);

	beforeEach(() => {
		Spotlight.setActiveContainer(null);
		updatePointerPosition(0, 0);
	});

	test('should set itself as the active container on mouse enter', () => {
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
			const wrapped = ({onFocusCapture}) => { // eslint-disable-line enact/prop-types
				focus = onFocusCapture;
				return <div />;
			};

			mount(
				<Component onFocusCapture={spy} component={wrapped} /> // eslint-disable-line react/jsx-no-bind
			);

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
			const wrapped = ({onFocusCapture}) => { // eslint-disable-line enact/prop-types
				focus = onFocusCapture;
				return <div />;
			};

			mount(
				<Component onFocusCapture={spy} spotlightDisabled component={wrapped} /> // eslint-disable-line react/jsx-no-bind
			);

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
			const wrapped = ({onBlurCapture}) => { // eslint-disable-line enact/prop-types
				blur = onBlurCapture;
				return <div />;
			};

			mount(
				<Component onBlurCapture={spy} spotlightDisabled component={wrapped} /> // eslint-disable-line react/jsx-no-bind
			);

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
			const wrapped = ({onBlurCapture, onFocusCapture}) => { // eslint-disable-line enact/prop-types
				blur = onBlurCapture;
				focus = onFocusCapture;
				return <div />;
			};

			mount(
				<Component onBlurCapture={spy} spotlightDisabled component={wrapped} /> // eslint-disable-line react/jsx-no-bind
			);

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
