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
const TouchableHoC = hoc(defaultConfig, (config, Wrapped) => {
	const {
		activeProp
	} = config;

	function Touchable (props) {
		const updated = {...props};
		const hook = useTouch({activeProp, ...props});

		/* TBD: disabled is not deleted */
		delete updated.dragConfig;
		delete updated.flickConfig;
		delete updated.holdConfig;
		delete updated.noResume;
		delete updated.onDown;
		delete updated.onDrag; /* TBD I don't know why this prop was not deleted in the original code */
		delete updated.onDragEnd; /* TBD I don't know why this prop was not deleted in the original code */
		delete updated.onDragStart; /* TBD I don't know why this prop was not deleted in the original code */
		delete updated.onFlick;
		delete updated.onHold;
		delete updated.onHoldEnd;
		delete updated.onHoldPulse;
		delete updated.onTap;
		delete updated.onUp;

		Object.assign(updated, hook.handlers);

		if (activeProp) {
			updated[activeProp] = hook.activeProp;
		}

		return (
			<Wrapped {...updated} />
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

export default TouchableHoC;
export {
	configure,
	TouchableHoC as Touchable,
	useTouch
};
