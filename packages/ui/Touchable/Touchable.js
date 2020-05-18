/**
 * Application support for gestures.
 *
 * @module ui/Touchable
 * @exports Touchable
 * @exports configure
 */

import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import React from 'react';

import {configure} from './config';

import {dragConfigPropType} from './Drag';
import {flickConfigPropType} from './Flick';
import {holdConfigPropType} from './Hold';
import useTouch from './useTouch';

const selectProps = (props) => {
	const {
		/* configs */
		dragConfig, flickConfig, holdConfig,
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
		onHold, onHoldEnd, onHoldPulse,
		onMove,
		onTap,
		onUp,
		/* rest */
		...rest
	} = props;

	return {
		configForHook: {
			/* configs */
			dragConfig, flickConfig, holdConfig,
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
			onHold, onHoldEnd, onHoldPulse,
			onMove,
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
const defaultConfig = {
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
 * `onFlick`, `onDrag`, `onHold`, and `onHoldPulse`.
 *
 * Note: This HoC passes a number of props to the wrapped component that should be passed to the
 * main DOM node or consumed by the wrapped component.
 *
 * @class Touchable
 * @memberof ui/Touchable
 * @hoc
 * @public
 */
const Touchable = hoc(defaultConfig, (config, Wrapped) => {
	const {
		activeProp
	} = config;

	// eslint-disable-next-line no-shadow
	function Touchable (props) {
		const {configForHook, propsForWrapped} = selectProps(props);
		const hook = useTouch({getActive: !!activeProp, ...configForHook});

		Object.assign(propsForWrapped, hook.handlers);

		if (activeProp) {
			propsForWrapped[activeProp] = hook.active;
		}

		return (
			<Wrapped {...propsForWrapped} />
		);
	}

	Touchable.propTypes = {
		/**
		 * Disables the component.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Instance-specific overrides of the drag configuration.
		 *
		 * @see {@link ui/Touchable.configure}
		 * @type {Object}
		 * @public
		 */
		dragConfig: dragConfigPropType,

		/**
		 * Instance-specific overrides of the flick configuration.
		 *
		 * @see {@link ui/Touchable.configure}
		 * @type {Object}
		 * @public
		 */
		flickConfig: flickConfigPropType,

		/**
		 * Instance-specific overrides of the hold configuration.
		 *
		 * @see {@link ui/Touchable.configure}
		 * @type {Object}
		 * @public
		 */
		holdConfig: holdConfigPropType,

		/**
		 * Prevents resuming the touch events and gestures when re-entering the component.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noResume: PropTypes.bool,

		/**
		 * Event handler for 'down' pointer events.
		 *
		 * @type {Function}
		 * @public
		 */
		onDown: PropTypes.func,

		/**
		 * Event handler for a drag gesture.
		 *
		 * Event payload includes:
		 *
		 * * `type` - Type of event, `'onDrag'`
		 * * `x` - Horizontal position of the drag, relative to the viewport
		 * * `y` - Vertical position of the drag, relative to the viewport
		 *
		 * @type {Function}
		 * @public
		 */
		onDrag: PropTypes.func,

		/**
		 * Event handler for the end of a drag gesture.
		 *
		 * Event payload includes:
		 *
		 * * `type` - Type of event, `'onDragEnd'`
		 *
		 * @type {Function}
		 * @public
		 */
		onDragEnd: PropTypes.func,

		/**
		 * Event handler for the start of a drag gesture.
		 *
		 * Event payload includes:
		 *
		 * * `type` - Type of event, `'onDragStart'`
		 * * `x` - Horizontal position of the drag, relative to the viewport
		 * * `y` - Vertical position of the drag, relative to the viewport
		 *
		 * @type {Function}
		 * @public
		 */
		onDragStart: PropTypes.func,

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
		 * @type {Function}
		 * @public
		 */
		onFlick: PropTypes.func,

		/**
		 * Event handler for hold events.
		 *
		 * Event payload includes:
		 *
		 * * `type` - Type of event, `'onHold'`
		 * * `name` - The name of the hold as configured in the events list
		 * * `time` - Time, in milliseconds, configured for this hold which may vary slightly
		 *            from time since the hold began
		 *
		 * @type {Function}
		 * @public
		 */
		onHold: PropTypes.func,

		/**
		 * Event handler for the end of hold events.
		 *
		 * Event payload includes:
		 *
		 * * `type` - Type of event, `'onHoldEnd'`
		 * * `time` - Time, in milliseconds, since the hold began
		 *
		 * @type {Function}
		 * @public
		 */
		onHoldEnd: PropTypes.func,

		/**
		 * Event handler for hold pulse events
		 *
		 * Event payload includes:
		 *
		 * * `type` - Type of event, `'onHoldPulse'`
		 * * `time` - Time, in milliseconds, since the hold began
		 *
		 * @type {Function}
		 * @public
		 */
		onHoldPulse: PropTypes.func,

		/**
		 * Event handler for 'move' pointer events
		 *
		 * @type {Function}
		 * @public
		 */
		onMove: PropTypes.func,

		/**
		 * Event handler for 'tap' pointer events
		 *
		 * @type {Function}
		 * @public
		 */
		onTap: PropTypes.func,

		/**
		 * Event handler for 'up' pointer events
		 *
		 * @type {Function}
		 * @public
		 */
		onUp: PropTypes.func
	};

	Touchable.defaultProps = {
		disabled: false,
		noResume: false
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
