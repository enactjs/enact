/**
 * Application support for gestures.
 *
 * @module ui/Touchable
 * @exports Touchable
 * @exports configure
 */

import hoc from '@enact/core/hoc';
import {checkPropTypes} from '@enact/core/util';
import {ElementType, PointerEvent, RefObject} from 'react';

import {configure} from './config';

import {dragConfigPropType} from './Drag';
import {flickConfigPropType} from './Flick';
import {holdConfigPropType} from './Hold';
import {pinchConfigPropType} from './Pinch';
import useTouch, {useTouchConfig} from './useTouch';
import {Callback} from '../types';

export interface TouchableProps {
	/**
	 * Disables the component.
	 *
	 * @memberof ui/Touchable.Touchable.prototype
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	disabled?: boolean,

	/**
	 * Instance-specific overrides of the drag configuration.
	 *
	 * @see {@link ui/Touchable.configure}
	 * @memberof ui/Touchable.Touchable.prototype
	 * @type {Object}
	 * @public
	 */
	dragConfig: dragConfigPropType,

	/**
	 * Instance-specific overrides of the flick configuration.
	 *
	 * @see {@link ui/Touchable.configure}
	 * @memberof ui/Touchable.Touchable.prototype
	 * @type {Object}
	 * @public
	 */
	flickConfig: flickConfigPropType,

	/**
	 * Instance-specific overrides of the hold configuration.
	 *
	 * @see {@link ui/Touchable.configure}
	 * @memberof ui/Touchable.Touchable.prototype
	 * @type {Object}
	 * @public
	 */
	holdConfig: holdConfigPropType,

	/**
	 * Prevents resuming the touch events and gestures when re-entering the component.
	 *
	 * @memberof ui/Touchable.Touchable.prototype
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	noResume?: boolean,

	/**
	 * Event handler for 'down' pointer events.
	 *
	 * @memberof ui/Touchable.Touchable.prototype
	 * @type {Function}
	 * @public
	 */
	onDown?: Callback<void, PointerEvent<HTMLElement>>,

	/**
	 * Event handler for a drag gesture.
	 *
	 * Event payload includes:
	 *
	 * * `type` - Type of event, `'onDrag'`
	 * * `x` - Horizontal position of the drag, relative to the viewport
	 * * `y` - Vertical position of the drag, relative to the viewport
	 *
	 * @memberof ui/Touchable.Touchable.prototype
	 * @type {Function}
	 * @public
	 */
	onDrag?: Callback<any, {type: 'onDrag', x: number, y: number}>,

	/**
	 * Event handler for the end of a drag gesture.
	 *
	 * Event payload includes:
	 *
	 * * `type` - Type of event, `'onDragEnd'`
	 *
	 * @memberof ui/Touchable.Touchable.prototype
	 * @type {Function}
	 * @public
	 */
	onDragEnd?: Callback<any, {type: 'onDragEnd'}>

	/**
	 * Event handler for the start of a drag gesture.
	 *
	 * Event payload includes:
	 *
	 * * `type` - Type of event, `'onDragStart'`
	 * * `x` - Horizontal position of the drag, relative to the viewport
	 * * `y` - Vertical position of the drag, relative to the viewport
	 *
	 * @memberof ui/Touchable.Touchable.prototype
	 * @type {Function}
	 * @public
	 */
	onDragStart: Callback<any, {type: 'onDragStart', x: number, y: number}>,

	/**
	 * Event handler for a flick gesture.
	 *
	 * Event payload includes:
	 *
	 * * `type` - Type of event, `'onFlick'`
	 * * `direction` - Primary direction of the flick, either `'horizontal'` or `'vertical'`
	 * * `velocity` - Velocity of flick
	 * * `velocityX` - Velocity of flick along te horizontal axis
	 * * `velocityY` - Velocity of flick along te vertical axis
	 *
	 * @memberof ui/Touchable.Touchable.prototype
	 * @type {Function}
	 * @public
	 */
	onFlick?: Callback<any, {
		type: 'onFlick',
		direction: 'horizontal' | 'vertical',
		velocity: number,
		velocityX: number,
		velocityY: number
	}>,

	/**
	 * Event handler for hold pulse events.
	 *
	 * Event payload includes:
	 *
	 * * `type` - Type of event, `'onHold'`
	 * * `time` - Time, in milliseconds, since the hold began
	 *
	 * @memberof ui/Touchable.Touchable.prototype
	 * @type {Function}
	 * @public
	 */
	onHold?: Callback<any, {type: 'onHold', time: number}>

	/**
	 * Event handler for the end of hold events.
	 *
	 * Event payload includes:
	 *
	 * * `type` - Type of event, `'onHoldEnd'`
	 * * `time` - Time, in milliseconds, since the hold began
	 *
	 * @memberof ui/Touchable.Touchable.prototype
	 * @type {Function}
	 * @public
	 */
	onHoldEnd?: Callback<any, {type: 'onHoldEnd', time: number}>

	/**
	 * Event handler for hold events.
	 *
	 * Event payload includes:
	 *
	 * * `type` - Type of event, `'onHoldStart'`
	 * * `name` - The name of the hold as configured in the events list
	 * * `time` - Time, in milliseconds, configured for this hold which may vary slightly
	 *            from time since the hold began
	 *
	 * @memberof ui/Touchable.Touchable.prototype
	 * @type {Function}
	 * @public
	 */
	onHoldStart?: Callback<any, {type: 'onHoldStart', name: string, time: number}>,

	/**
	 * Event handler for 'move' pointer events.
	 *
	 * @memberof ui/Touchable.Touchable.prototype
	 * @type {Function}
	 * @public
	 */
	onMove?: Callback<void, PointerEvent<HTMLElement>>,

	/**
	 * Event handler for a pinch gesture.
	 *
	 * Event payload includes:
	 *
	 * * `type` - Type of event, `'onPinch'`
	 * * `scale` - The scale factor, calculated from the distance while pinching.
	 *             The default value is 1.0. The value would be a number between
	 *             pinchConfig.minScale and pinchConfig.maxScale.
	 * * `coords` - The coordinates array of the touch point, relative to the viewport
	 *
	 * @memberof ui/Touchable.Touchable.prototype
	 * @type {Function}
	 * @public
	 */
	onPinch?: Callback<any, {type: 'onPinch', scale: number, coords:  Array<{ x: number; y: number; }>}>

	/**
	 * Event handler for the end of a pinch gesture.
	 *
	 * Event payload includes:
	 *
	 * * `type` - Type of event, `'onPinchEnd'`
	 *
	 * @memberof ui/Touchable.Touchable.prototype
	 * @type {Function}
	 * @public
	 */
	onPinchEnd?: Callback<any, {type: 'onPinchEnd'}>

	/**
	 * Event handler for the start of a pinch gesture.
	 *
	 * Event payload includes:
	 *
	 * * `type` - Type of event, `'onPinchStart'`
	 * * `coords` - The coordinates array of the touch point, relative to the viewport
	 *
	 * @memberof ui/Touchable.Touchable.prototype
	 * @type {Function}
	 * @public
	 */
	onPinchStart?: Callback<any, {type: 'onPinchStart', coords: Array<{x: number, y: number}>}>

	/**
	 * Event handler for 'tap' pointer events.
	 *
	 * @memberof ui/Touchable.Touchable.prototype
	 * @type {Function}
	 * @public
	 */
	onTap?: Callback<void, PointerEvent<HTMLElement>>,

	/**
	 * Event handler for 'up' pointer events.
	 *
	 * @memberof ui/Touchable.Touchable.prototype
	 * @type {Function}
	 * @public
	 */
	onUp?: Callback<void, PointerEvent<HTMLElement>>,

	/**
	 * Instance-specific overrides of the pinch configuration.
	 *
	 * @see {@link ui/Touchable.configure}
	 * @memberof ui/Touchable.Touchable.prototype
	 * @type {Object}
	 * @public
	 */
	pinchConfig: pinchConfigPropType,

	/**
	 * Forwards a reference to the DOM element.
	 *
	 * @type {Object}
	 * @private
	 */
	ref?: RefObject<any>
}

export interface TouchableConfig {
	activeProp: string | null
}

const selectProps = (props: useTouchConfig) => {
	const {
		/* configs */
		dragConfig, flickConfig, holdConfig, pinchConfig,
		/* general props */
		disabled,
		noResume,
		/* events to be captured and forwarded by useTouch hook */
		onBlur,
		onClick,
		onMouseDown, onMouseEnter, onMouseLeave, onMouseMove, onMouseUp,
		onTouchEnd, onTouchMove, onTouchStart,
		/* custom events to be forwarded by useTouch hook */
		onDown,
		onDrag, onDragEnd, onDragStart,
		onFlick,
		onHold, onHoldEnd, onHoldStart,
		onMove,
		onPinch, onPinchEnd, onPinchStart,
		onTap,
		onUp,
		/* rest */
		...rest
	} = props;

	return {
		configForHook: {
			/* configs */
			dragConfig, flickConfig, holdConfig, pinchConfig,
			/* general props */
			disabled,
			noResume,
			/* events to be captured and forwarded by useTouch hook */
			onBlur,
			onClick,
			onMouseDown, onMouseEnter, onMouseLeave, onMouseMove, onMouseUp,
			onTouchEnd, onTouchMove, onTouchStart,
			/* custom events to be forwarded by useTouch hook */
			onDown,
			onDrag, onDragEnd, onDragStart,
			onFlick,
			onHold, onHoldEnd, onHoldStart,
			onMove,
			onPinch, onPinchEnd, onPinchStart,
			onTap,
			onUp
		},
		propsForWrapped: {
			disabled, // needed for both useTouch and the wrapped component
			...rest
		}
	};
};

/**
 * Default config for `Touchable`.
 *
 * @memberof ui/Touchable.Touchable
 * @hocconfig
 */
const defaultConfig: TouchableConfig = {
	/**
	 * Configures the prop name to pass the active state to the wrapped component
	 *
	 * @type {String}
	 * @default null
	 * @memberof ui/Touchable.Touchable.defaultConfig
	 */
	activeProp: null
};

/**
 * A higher-order component that provides a consistent set of pointer events -- `onDown`, `onUp`,
 * and `onTap` -- across mouse and touch interfaces along with support for common gestures including
 * `onFlick`, `onDragStart`, `onDrag`, `onDragEnd`, `onHoldStart`, `onHold`, `onHoldEnd`,
 * `onPinchStart`, `onPinch`, and `onPinchEnd`.
 * Note: This HoC passes a number of props to the wrapped component that should be passed to the
 * main DOM node or consumed by the wrapped component.
 *
 * @class Touchable
 * @memberof ui/Touchable
 * @hoc
 * @public
 */
const Touchable = hoc(defaultConfig, (config: TouchableConfig, Wrapped: ElementType) => {
	const {
		activeProp
	} = config;

	// eslint-disable-next-line no-shadow
	const Touchable = (props: TouchableProps) => {
		checkPropTypes(Touchable, props);
		const {disabled = false, noResume = false, ref = null, ...rest} = props;
		const {configForHook, propsForWrapped} = selectProps({disabled, noResume, ...rest});
		const hook = useTouch({getActive: !!activeProp, ...configForHook});

		Object.assign(propsForWrapped, hook.handlers);

		if (activeProp) {
			Object.assign(propsForWrapped, {[activeProp]: hook.active});
		}

		return (
			<Wrapped {...propsForWrapped} ref={ref} />
		);
	};

	Touchable.displayName = 'Touchable';

	return Touchable;
});

export default Touchable;
export {
	configure,
	Touchable,
	useTouch
};
