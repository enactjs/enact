import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SpotlightContainerDecorator from '../SpotlightContainerDecorator';
import {updatePointerPosition} from '../../src/pointer';
import Spotlight from '../../src/spotlight';

import closest from './Element.prototype.closest';

const testId = 'test-spotlightContainerDecorator';

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
		render(<Component data-testid={testId} spotlightId="test-container" />);
		const component = screen.getByTestId(testId);

		userEvent.hover(component, hoverPosition);

		const expected = 'test-container';
		const actual = Spotlight.getActiveContainer();

		expect(actual).toBe(expected);
	});

	test('should set active container to parent container on mouse leave', () => {
		const Component = SpotlightContainerDecorator(Div);
		const node = document.createElement('div');
		render(
			<Component spotlightId="outer-container">
				<Component data-testid={testId} spotlightId="inner-container" />
			</Component>,
			{attachTo: node}
		);
		const component = screen.getByTestId(testId);

		// set inner-container as active
		userEvent.hover(component, hoverPosition);
		updatePointerPosition(0, 1);

		// leave inner-container
		userEvent.unhover(component, unhoverPosition);

		const expected = 'outer-container';
		const actual = Spotlight.getActiveContainer();

		expect(actual).toBe(expected);
	});

	test('should not set active container on mouse leave if another container is active', () => {
		const Component = SpotlightContainerDecorator(Div);
		const node = document.createElement('div');
		render(
			<Component spotlightId="outer-container">
				<Component data-testid={testId} spotlightId="inner-container" />
				<Component spotlightId="self-only-container" />
			</Component>,
			{attachTo: node}
		);
		const component = screen.getByTestId(testId);

		// set inner-container as active
		userEvent.hover(component, hoverPosition);
		updatePointerPosition(0, 1);

		// set another container to be active
		Spotlight.setActiveContainer('self-only-container');

		// leave inner-container
		userEvent.unhover(component, unhoverPosition);

		const expected = 'self-only-container';
		const actual = Spotlight.getActiveContainer();

		expect(actual).toBe(expected);
	});

	test('should forward onFocusCapture events', () => {
		const spy = jest.fn();
		let focus;

		const Component = SpotlightContainerDecorator(({onFocusCapture}) => {
			focus = onFocusCapture;
			return <div />;
		});
		render(<Component onFocusCapture={spy} />);

		focus({});

		const expected = 1;

		expect(spy).toHaveBeenCalledTimes(expected);
	});

	test('should suppress onFocusCapture events when spotlightDisabled', () => {
		const spy = jest.fn();
		let focus;

		const Component = SpotlightContainerDecorator(({onFocusCapture}) => {
			focus = onFocusCapture;
			return <div />;
		});
		render(<Component onFocusCapture={spy} spotlightDisabled />);

		// building out the api called on the event object + target
		focus({
			stopPropagation: () => true,
			target: {
				blur: () => true
			}
		});

		expect(spy).not.toHaveBeenCalled();
	});

	test('should forward onBlurCapture events', () => {
		const spy = jest.fn();
		let blur;

		const Component = SpotlightContainerDecorator(({onBlurCapture}) => {
			blur = onBlurCapture;
			return <div />;
		});
		render(<Component onBlurCapture={spy} spotlightDisabled />);

		// building out the api called on the event object + target
		blur({
			stopPropagation: () => true,
			target: {
				blur: () => blur({})
			}
		});

		const expected = 1;

		expect(spy).toHaveBeenCalledTimes(expected);
	});

	test('should suppress onBlurCapture events when focus was suppressed', () => {
		const spy = jest.fn();
		let blur;
		let focus;

		const Component = SpotlightContainerDecorator(({onBlurCapture, onFocusCapture}) => {
			blur = onBlurCapture;
			focus = onFocusCapture;
			return <div />;
		});
		render(<Component onBlurCapture={spy} spotlightDisabled />);

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

		expect(spy).not.toHaveBeenCalled();
	});
});
