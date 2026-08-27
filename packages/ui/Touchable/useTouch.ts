import useClass from '@enact/core/useClass';
import {useState, useEffect, FocusEvent, PointerEvent, TouchEvent, MouseEvent} from 'react';

import {Callback, HandlerFunction} from '../types';

import {States} from './state';
import Touch from './Touch';
import {TouchableProps} from './Touchable';

/**
 * Configuration for `useTouch`
 *
 * @typedef {Object} useTouchConfig
 * @memberof ui/Touchable
 * @property {Object}    dragConfig       Instance-specific overrides of the drag configuration
 * @property {Object}    flickConfig      Instance-specific overrides of the flick configuration
 * @property {Object}    holdConfig       Instance-specific overrides of the hold configuration
 * @property {Object}    pinchConfig      Instance-specific overrides of the pinch configuration
 * @property {Boolean}   getActive        Enables active state management
 * @property {Boolean}   disabled         Disables a hook
 * @property {Boolean}   noResume         Prevents resuming the touch events and gestures when re-entering the component
 * @property {Function}  onBlur           Event handler for a blur event
 * @property {Function}  onClick          Event handler for a click event
 * @property {Function}  onMouseDown      Event handler for a mousedown event
 * @property {Function}  onMouseEnter     Event handler for a mouseenter event
 * @property {Function}  onMouseLeave     Event handler for a mouseleave event
 * @property {Function}  onMouseMove      Event handler for a mousemove event
 * @property {Function}  onMouseUp        Event handler for a mouseup event
 * @property {Function}  onTouchEnd       Event handler for a touchend event
 * @property {Function}  onTouchMove      Event handler for a touchmove event
 * @property {Function}  onTouchStart     Event handler for a touchstart event
 * @property {Function}  onDown           Event handler for 'down' pointer events
 * @property {Function}  onDrag           Event handler for a drag gesture
 * @property {Function}  onDragEnd        Event handler for the end of a drag gesture
 * @property {Function}  onDragStart      Event handler for the start of a drag gesture
 * @property {Function}  onFlick          Event handler for a flick gesture
 * @property {Function}  onHold           Event handler for hold pulse events
 * @property {Function}  onHoldEnd        Event handler for the end of hold events
 * @property {Function}  onHoldStart      Event handler for hold events
 * @property {Function}  onPinch          Event handler for pinch gesture
 * @property {Function}  onPinchEnd       Event handler for the end of pinch gesture
 * @property {Function}  onPinchStart     Event handler for pinch gesture
 * @property {Function}  onMove           Event handler for a pointer moving
 * @property {Function}  onTap            Event handler for 'tap' pointer events
 * @property {Function}  onUp             Event handler for 'up' pointer events
 * @see {@link ui/Touchable.configure}
 * @private
 */
export interface useTouchConfig extends TouchableProps {
	getActive?: boolean;
	/** Disables a hook */
	disabled?: boolean;
	/** Prevents resuming the touch events and gestures when re-entering the component */
	noResume?: boolean;
	/** Event handler for a blur event */
	onBlur?: Callback<void, FocusEvent<HTMLElement>>;
	/** Event handler for a click event */
	onClick?: Callback<void, PointerEvent<HTMLElement>>;
	/** Event handler for a mousedown event */
	onMouseDown?: Callback<void, MouseEvent<HTMLElement>>;
	/** Event handler for a mouseenter event */
	onMouseEnter?: Callback<void, MouseEvent<HTMLElement>>;
	/** Event handler for a mouseleave event */
	onMouseLeave?: Callback<void, MouseEvent<HTMLElement>>;
	/** Event handler for a mousemove event */
	onMouseMove?: Callback<void, MouseEvent<HTMLElement>>;
	/** Event handler for a mouseup event */
	onMouseUp?: Callback<void, MouseEvent<HTMLElement>>;
	/** Event handler for a touchend event */
	onTouchEnd?: Callback<void, TouchEvent<HTMLElement>>;
	/** Event handler for a touchmove event */
	onTouchMove?: Callback<void, TouchEvent<HTMLElement>>;
	/** Event handler for a touchstart event */
	onTouchStart?: Callback<void, TouchEvent<HTMLElement>>;
}

/**
 * Object returned by `useTouch`
 *
 * @typedef {Object} useTouchInterface
 * @memberof ui/Touchable
 * @property {Boolean} active   The active state
 * @property {Object}  handlers Event handlers that need to be passed to DOM node
 * @private
 */
export interface useTouchInterface {
	active: boolean;
	handlers: {
		onClick: HandlerFunction,
		onBlur: HandlerFunction,
		onMouseDown: HandlerFunction,
		onMouseEnter: HandlerFunction,
		onMouseMove: HandlerFunction,
		onMouseLeave: HandlerFunction,
		onMouseUp: HandlerFunction
	}
}

/**
 * Provides a consistent set of pointer events -- `onDown`, `onUp`, and `onTap` --
 * across mouse and touch interfaces along with support for common gestures including
 * `onFlick`, `onDragStart`, `onDrag`, `onDragEnd`, `onHoldStart`, `onHold`, `onHoldEnd`,
 * `onPinchStart`, `onPinch`, and `onPinchEnd`.
 * @param {useTouchConfig} config Configuration options
 * @returns {useTouchInterface}
 * @private
 */
function useTouch (config: useTouchConfig): useTouchInterface {
	const {
		getActive = false, disabled,
		dragConfig, flickConfig, holdConfig, pinchConfig,
		onDrag, onDragEnd, onDragStart, onHold, onHoldEnd, onHoldStart, onFlick, onPinch, onPinchEnd, onPinchStart
	} = config;

	const touch = useClass(Touch);
	const [state, setState] = useState<number>(States.Inactive);
	const [prevTouchState, setPrevTouchState] = useState<number>();

	touch.setPropsAndContext({...config, disabled: !!disabled}, state, setState);

	// componentDidMount and componentWillUnmount
	useEffect(() => {
		touch.addGlobalHandlers();
		return (() => {
			touch.disable();
			touch.removeGlobalHandlers();
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		touch.updateGestureConfig(dragConfig, flickConfig, holdConfig, pinchConfig);
	}, [dragConfig, flickConfig, holdConfig, pinchConfig]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		touch.updateProps(config);
	}, [onDrag, onDragEnd, onDragStart, onHold, onHoldEnd, onHoldStart, onFlick, onPinch, onPinchEnd, onPinchStart]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (disabled) {
			touch.disable();
		}
	}, [disabled]); // eslint-disable-line react-hooks/exhaustive-deps

	if (state !== prevTouchState) {
		setState((prevState) => ((!getActive || disabled) ? States.Inactive : prevState));
		setPrevTouchState(state);
	}

	return {
		active: state !== States.Inactive,
		handlers: touch.getHandlers()
	};
}

export default useTouch;
export {
	useTouch
};
