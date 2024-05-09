import handle, {forward} from '@enact/core/handle';
import useHandlers from '@enact/core/useHandlers';
import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';
import classNames from 'classnames';
import {useRef} from 'react';

import Spotlight from '../../src/spotlight.js';
import useSpottable from '../useSpottable';

const
	forwardMouseUp = forward('onMouseUp'),
	forwardMouseDown = forward('onMouseDown'),
	forwardKeyDown = forward('onKeyDown'),
	forwardKeyUp = forward('onKeyUp'),
	id = 'test-useSpot';

const makeKeyEvent = (keyCode) => {
	return {
		keyCode,
		which: keyCode
	};
};

const REMOTE_OK_KEY = 16777221;

let compRef = null;
let getCurrent = Spotlight.getCurrent;

const callContext = (name) => (ev, props, context) => context[name](ev, props);
const spotHandlers = {
	onKeyDown: handle(
		forwardKeyDown,
		callContext('onKeyDown'),
		forwardMouseDown
	),
	onKeyUp: handle(
		forwardKeyUp,
		callContext('onKeyUp'),
		forwardMouseUp
	),
	onBlur: callContext('onBlur'),
	onFocus: callContext('onFocus'),
	onMouseEnter: callContext('onMouseEnter'),
	onMouseLeave: callContext('onMouseLeave')
};

describe('useSpottable', () => {
	function SpottableComponent (props) {
		const nodeRef = useRef();

		const {className, component, disabled, emulateMouse, onSelectionCancel, onSpotlightDisappear, onSpotlightDown, onSpotlightLeft, onSpotlightRight, onSpotlightUp, selectionKeys, spotlightDisabled, spotlightId, ...rest} = props;
		const spot = useSpottable({
			disabled,
			emulateMouse,
			onSelectionCancel,
			onSpotlightDisappear,
			onSpotlightDown,
			onSpotlightLeft,
			onSpotlightRight,
			onSpotlightUp,
			selectionKeys,
			spotlightDisabled,
			spotlightId
		});
		const Comp = component || 'div';

		rest.tabIndex = -1;

		const handlers = useHandlers(spotHandlers, rest, spot);

		compRef = nodeRef.current?.firstElementChild;

		return (
			<div ref={nodeRef}>
				<Comp
					{...rest}
					{...spot.attributes}
					{...handlers}
					className={classNames(className, spot.className)}
					disabled={disabled}
					ref={spot.ref}
				/>
			</div>
		);
	}

	beforeEach(() => {
		// Spotlight.getCurrent() did not work in unit tests. It always returns `undefined`.
		// So Spotlight.getCurrent() is replaced with the function returning the wrapped component by the Component
		// including `useSpottable`.
		Spotlight.getCurrent = () => (compRef.current);
	});

	afterEach(() => {
		Spotlight.getCurrent = getCurrent;
	});

	test('should add the spottable class', () => {
		render(<SpottableComponent data-testid={id} />);
		const div = screen.getByTestId(id);

		const expected = 'spottable';

		expect(div).toHaveClass(expected);
	});

	test('should add the spottable class to a {disabled} component', () => {
		render(<SpottableComponent data-testid={id} disabled />);
		const div = screen.getByTestId(id);

		const expected = 'spottable';

		expect(div).toHaveClass(expected);
	});

	test('should not add the spottable class to a {spotlightDisabled} component', () => {
		render(<SpottableComponent data-testid={id} spotlightDisabled />);
		const div = screen.getByTestId(id);

		const expected = 'spottable';

		expect(div).not.toHaveClass(expected);
	});

	describe('should emit event properly', () => {
		test('should emit {onSpotlightUp} when the the {keydown} is emitted with 38 keycode', () => {
			const spy = jest.fn();
			render(<SpottableComponent data-testid={id} onSpotlightUp={spy} />);
			const div = screen.getByTestId(id);

			fireEvent.keyDown(div, makeKeyEvent(38));

			const expected = 1;

			expect(spy).toHaveBeenCalledTimes(expected);
		});

		test('should emit {onSpotlightDown} when the the {keydown} is emitted with 40 keycode', () => {
			const spy = jest.fn();
			render(<SpottableComponent data-testid={id} onSpotlightDown={spy} />);
			const div = screen.getByTestId(id);

			fireEvent.keyDown(div, makeKeyEvent(40));

			const expected = 1;

			expect(spy).toHaveBeenCalledTimes(expected);
		});

		test('should emit {onSpotlightLeft} when the the {keydown} is emitted with 37 keycode', () => {
			const spy = jest.fn();
			render(<SpottableComponent data-testid={id} onSpotlightLeft={spy} />);
			const div = screen.getByTestId(id);

			fireEvent.keyDown(div, makeKeyEvent(37));

			const expected = 1;

			expect(spy).toHaveBeenCalledTimes(expected);
		});

		test('should emit {onSpotlightRight} when the the {keydown} is emitted with 39 keycode', () => {
			const spy = jest.fn();
			render(<SpottableComponent data-testid={id} onSpotlightRight={spy} />);
			const div = screen.getByTestId(id);

			fireEvent.keyDown(div, makeKeyEvent(39));

			const expected = 1;

			expect(spy).toHaveBeenCalledTimes(expected);
		});

		test('should emulate {onMouseDown} when REMOTE_OK_KEY key is pressed', () => {
			const spy = jest.fn();
			render(<SpottableComponent data-testid={id} emulateMouse onMouseDown={spy} selectionKeys={[13]} />);
			const div = screen.getByTestId(id);

			fireEvent.keyDown(div, makeKeyEvent(REMOTE_OK_KEY));

			const expected = 1;

			expect(spy).toHaveBeenCalledTimes(expected);
		});

		test('should emulate {onMouseUp} when {REMOTE_OK_KEY} key is pressed and released', () => {
			const spy = jest.fn();
			render(<SpottableComponent data-testid={id} emulateMouse onMouseUp={spy} selectionKeys={[13]} />);
			const div = screen.getByTestId(id);

			fireEvent.keyDown(div, makeKeyEvent(REMOTE_OK_KEY));
			fireEvent.keyUp(div, makeKeyEvent(REMOTE_OK_KEY));

			const expected = 1;

			expect(spy).toHaveBeenCalledTimes(expected);
		});

		test('should not emulate {onMouseUp} if the default behavior is prevented even though {REMOTE_OK_KEY} key is pressed', () => {
			const spy = jest.fn();
			function onKeyUp (ev) {
				ev.preventDefault();
			}
			render(
				<SpottableComponent
					data-testid={id}
					emulateMouse
					onKeyUp={onKeyUp}
					onMouseUp={spy}
					selectionKeys={[13]}
				/>
			);
			const div = screen.getByTestId(id);

			fireEvent.keyDown(div, makeKeyEvent(REMOTE_OK_KEY));
			fireEvent.keyUp(div, makeKeyEvent(REMOTE_OK_KEY));

			expect(spy).not.toHaveBeenCalled();
		});
	});

	describe('shouldComponentUpdate', () => {
		test('should re-render when a non-Component prop changes', () => {
			const spy = jest.fn((props) => <div {...props} />);
			const {rerender} = render(<SpottableComponent component={spy} data-testid={id} />);

			rerender(<SpottableComponent component={spy} data-id="123" data-testid={id} />);

			const expected = 2;

			expect(spy).toHaveBeenCalledTimes(expected);
		});

		test('should re-render when {selectionKeys} changes', () => {
			const spy = jest.fn((props) => <div {...props} />);
			const {rerender} = render(
				<SpottableComponent
					component={spy}
					data-testid={id}
					selectionKeys={[1, 2, 3]}
				/>
			);

			rerender(<SpottableComponent component={spy} data-testid={id} selectionKeys={[2, 1, 3]} />);

			const expected = 2;

			expect(spy).toHaveBeenCalledTimes(expected);
		});

		test('should not re-render when focused', () => {
			const spy = jest.fn((props) => <div {...props} />);
			render(<SpottableComponent component={spy} data-testid={id} />);
			const div = screen.getByTestId(id);

			div.focus();

			const expected = 1;

			expect(spy).toHaveBeenCalledTimes(expected);
		});
	});
});
