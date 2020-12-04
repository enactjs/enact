import handle, {adaptEvent, forward, forwardWithPrevent} from '@enact/core/handle';
import useHandlers from '@enact/core/useHandlers';
import Spotlight from '../../src/spotlight.js';
import classNames from 'classnames';
import {mount} from 'enzyme';
import React from 'react';
import ReactDOM from 'react-dom';

import useSpot from '../useSpot';

const
	forwardMouseUp = forward('onMouseUp'),
	forwardMouseDown = forward('onMouseDown');

const
	forwardKeyDownWithPrevent = forwardWithPrevent('onKeyDown'),
	forwardKeyUpWithPrevent = forwardWithPrevent('onKeyUp');

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
		forwardKeyDownWithPrevent,
		callContext('onKeyDown'),
		forwardMouseDown
	),
	onKeyUp: handle(
		adaptEvent(
			(ev, props) => ({notPrevented: forwardKeyUpWithPrevent(ev, props), ...ev}), // eslint-disable-line no-shadow
			callContext('onKeyUp')
		),
		forwardMouseUp
	),
	onBlur: callContext('onBlur'),
	onFocus: callContext('onFocus'),
	onMouseEnter: callContext('onMouseEnter'),
	onMouseLeave: callContext('onMouseLeave')
};

describe('useSpot', () => {

	function SpottableBase (props) {
		// eslint-disable-next-line enact/prop-types
		const {className, component, componentRef, disabled, emulateMouse, onSelectionCancel, onSpotlightDisappear, onSpotlightDown, onSpotlightLeft, onSpotlightRight, onSpotlightUp, selectionKeys, spotlightDisabled, ...rest} = props;
		const spot = useSpot({
			disabled,
			emulateMouse,
			onSelectionCancel,
			onSpotlightDisappear,
			onSpotlightDown,
			onSpotlightLeft,
			onSpotlightRight,
			onSpotlightUp,
			selectionKeys,
			spotlightDisabled
		});
		const Comp = component || 'div';

		rest.tabIndex = -1;

		const handlers = useHandlers(spotHandlers, rest, spot);

		compRef = componentRef;

		return (
			<Comp
				{...rest}
				{...spot.attributes}
				{...handlers}
				className={classNames(className, spot.className)}
				disabled={disabled}
				ref={spot.ref}
			/>
		);
	}

	class Component extends React.Component {
		componentDidMount () {
			// eslint-disable-next-line react/no-find-dom-node
			this.node = ReactDOM.findDOMNode(this);
		}

		get componentRef () {
			return this.node;
		}

		render () {
			return <SpottableBase {...this.props} componentRef={this.componentRef} />;
		}
	}

	beforeEach(() => {
		// Spotlight.getCurrent() did not work in unit tests. It always returns `undefined`.
		// So Spotlight.getCurrent() is replaced with the function returning the wrapped component by the Component
		// including `useSpot`.
		Spotlight.getCurrent = () => (compRef.current);
	});

	afterEach(() => {
		Spotlight.getCurrent = getCurrent;
	});

	test('should add the spottable class', () => {
		const subject = mount(
			<Component />
		);

		const expected = 'spottable';
		const actual = subject.find('div').prop('className');

		expect(actual).toEqual(expected);
	});

	test('should add the spottable class to a {disabled} component', () => {
		const subject = mount(
			<Component disabled />
		);

		const expected = 'spottable';
		const actual = subject.find('div').prop('className');

		expect(actual).toEqual(expected);
	});

	test('should not add the spottable class to a {spotlightDisabled} component', () => {
		const subject = mount(
			<Component spotlightDisabled />
		);

		const expected = 'spottable';
		const actual = subject.find('div').prop('className');

		expect(actual).not.toEqual(expected);
	});

	describe('should emit event properly', () => {
		test('should emit {onSpotlightUp} when the the {keydown} is emitted with 38 keycode', () => {
			const spy = jest.fn();

			const subject = mount(
				<Component onSpotlightUp={spy} />
			);

			subject.simulate('keydown', makeKeyEvent(38));


			const expected = 1;
			const actual = spy.mock.calls.length;

			expect(actual).toEqual(expected);
		});

		test('should emit {onSpotlightDown} when the the {keydown} is emitted with 40 keycode', () => {
			const spy = jest.fn();

			const subject = mount(
				<Component onSpotlightDown={spy} />
			);

			subject.simulate('keydown', makeKeyEvent(40));


			const expected = 1;
			const actual = spy.mock.calls.length;

			expect(actual).toEqual(expected);
		});

		test('should emit {onSpotlightLeft} when the the {keydown} is emitted with 37 keycode', () => {
			const spy = jest.fn();

			const subject = mount(
				<Component onSpotlightLeft={spy} />
			);

			subject.simulate('keydown', makeKeyEvent(37));


			const expected = 1;
			const actual = spy.mock.calls.length;

			expect(actual).toEqual(expected);
		});

		test('should emit {onSpotlightRight} when the the {keydown} is emitted with 39 keycode', () => {
			const spy = jest.fn();

			const subject = mount(
				<Component onSpotlightRight={spy} />
			);

			subject.simulate('keydown', makeKeyEvent(39));

			const expected = 1;
			const actual = spy.mock.calls.length;

			expect(actual).toEqual(expected);
		});

		test('should emulate {onMouseDown} when REMOTE_OK_KEY key is pressed', () => {
			const spy = jest.fn();

			const subject = mount(
				<Component emulateMouse onMouseDown={spy} selectionKeys={[13]} />
			);

			subject.simulate('keydown', makeKeyEvent(REMOTE_OK_KEY));

			const expected = 1;
			const actual = spy.mock.calls.length;

			expect(actual).toEqual(expected);
		});

		test('should emulate {onMouseUp} when {REMOTE_OK_KEY} key is pressed and released', () => {
			const spy = jest.fn();

			const subject = mount(
				<Component emulateMouse onMouseUp={spy} selectionKeys={[13]} />
			);

			subject.simulate('keydown', makeKeyEvent(REMOTE_OK_KEY));
			subject.simulate('keyup', makeKeyEvent(REMOTE_OK_KEY));

			const expected = 1;
			const actual = spy.mock.calls.length;

			expect(actual).toEqual(expected);
		});

		test('should not emulate {onMouseUp} if passing ev.notPrevented of false even though {REMOTE_OK_KEY} key is pressed', () => {
			const spy = jest.fn();
			function onKeyUp (ev) {
				ev.preventDefault();
			}

			const subject = mount(
				<Component emulateMouse onKeyUp={onKeyUp} onMouseUp={spy} selectionKeys={[13]} />
			);

			subject.simulate('keydown', makeKeyEvent(REMOTE_OK_KEY));
			subject.simulate('keyup', makeKeyEvent(REMOTE_OK_KEY));

			const expected = 0;
			const actual = spy.mock.calls.length;

			expect(actual).toEqual(expected);
		});

	});

	describe('shouldComponentUpdate', () => {
		test('should re-render when a non-Component prop changes', () => {
			const spy = jest.fn((props) => <div {...props} />);

			const subject = mount(
				<Component component={spy} />
			);

			subject.setProps({
				'data-id': '123'
			});

			const expected = 2;
			const actual = spy.mock.calls.length;

			expect(actual).toEqual(expected);
		});

		test('should re-render when {selectionKeys} changes', () => {
			const spy = jest.fn((props) => <div {...props} />);

			const subject = mount(
				<Component component={spy} selectionKeys={[1, 2, 3]} />
			);

			subject.setProps({
				selectionKeys: [2, 1, 3]
			});

			const expected = 2;
			const actual = spy.mock.calls.length;

			expect(actual).toEqual(expected);
		});

		test('should not re-render when focused', () => {
			const spy = jest.fn((props) => <div {...props} />);

			const subject = mount(
				<Component component={spy} />
			);

			subject.simulate('focus');

			const expected = 1;
			const actual = spy.mock.calls.length;

			expect(actual).toEqual(expected);
		});
	});
});
