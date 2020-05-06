import {adaptEvent, forward, forwardWithPrevent, returnsTrue} from '@enact/core/handle';
import classNames from 'classnames';
import {mount} from 'enzyme';
import React from 'react';

import useSpot from '../useSpot';

const
	forwardMouseDown = forward('onMouseDown'),
	forwardMouseUp = forward('onMouseUp'),
	forwardClick = forward('onClick'),
	forwardBlur = forward('onBlur'),
	forwardFocus = forward('onFocus'),
	forwardMouseEnter = forward('onMouseEnter'),
	forwardMouseLeave = forward('onMouseLeave');

const
	forwardKeyDownWithPrevent = forwardWithPrevent('onKeyDown'),
	forwardKeyUpWithPrevent = forwardWithPrevent('onKeyUp');

const handleWithProps = (props) => (...handlers) => (ev) => {
	handlers.reduce((ret, fn) => (ret && fn(ev, props) || false), true);
};

describe('useSpot', () => {

	function Component (props) {
		// eslint-disable-next-line enact/prop-types
		const {className, component, disabled, emulateMouse, onSpotlightDisappear, onSpotlightDown, onSpotlightLeft, onSpotlightRight, onSpotlightUp, selectionKeys, spotlightDisabled, ...rest} = props;
		const spot = useSpot({
			disabled,
			emulateMouse,
			onSelectionCancel: rest.onMouseUp,
			onSpotlightDisappear,
			onSpotlightDown,
			onSpotlightLeft,
			onSpotlightRight,
			onSpotlightUp,
			selectionKeys,
			spotlightDisabled
		});
		const handle = handleWithProps(props);
		const Comp = component || 'div';

		// let tabIndex = rest.tabIndex;
		// if (tabIndex == null) {
		// 	tabIndex = -1;
		// }
		rest.tabIndex = -1;

		// if (spotlightId) {
		// 	rest['data-spotlight-id'] = spotlightId;
		// }

		rest.onKeyDown = handle(
			forwardKeyDownWithPrevent,
			spot.keyDown,
			forwardMouseDown,
		);
		rest.onKeyUp = handle(
			adaptEvent(
				(ev, props) => ({notPrevented: forwardKeyUpWithPrevent(ev, props), ...ev}), // eslint-disable-line no-shadow
				spot.keyUp
			),
			forwardMouseUp,
			forwardClick,
		);
		rest.onBlur = handle(
			spot.blur,
			forwardBlur,
		);
		rest.onFocus = handle(
			spot.focus,
			forwardFocus,
		);
		rest.onMouseEnter = handle(
			returnsTrue((ev) => forwardMouseEnter(ev, props)),
			spot.mouseEnter
		);
		rest.onMouseLeave = handle(
			returnsTrue((ev) => forwardMouseLeave(ev, props)),
			spot.mouseLeave
		);

		return (
			<Comp
				{...rest}
				className={classNames(className, spot.className)}
				disabled={disabled}
				ref={spot.ref}
			/>
		);
	}

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

	test('should emit {onSpotlightDisappear} when unmounted while focused', () => {
		const spy = jest.fn();

		const subject = mount(
			<Component onSpotlightDisappear={spy} />
		);

		subject.simulate('focus');
		subject.unmount();

		const expected = 1;
		const actual = spy.mock.calls.length;

		expect(actual).toEqual(expected);
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
