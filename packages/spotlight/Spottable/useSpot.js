import useClass from '@enact/core/useClass';
import React from 'react';
import ReactDOM from 'react-dom';

import {Spot, spottableClass} from './Spot';

const ENTER_KEY = 13;
const REMOTE_OK_KEY = 16777221;

/**
 * Configuration for `useSpot`
 *
 * @typedef {Object} useSpotConfig
 * @memberof ui/Spottable
 * @property {Boolean}  disabled             Whether or not the component is in a disabled state.
 * @property {Boolean}  emulateMouse         Whether or not the component should emulate mouse events as a response to Spotlight 5-way events.
 * @property {Function} onSelectionCancel    Is is called if the component is focused and became disabled.
 * @property {Function} onSpotlightDisappear The handler to run when the component is removed while retaining focus.
 * @property {Function} onSpotlightDown      The handler to run when the 5-way down key is pressed.
 * @property {Function} onSpotlightLeft      The handler to run when the 5-way left key is pressed.
 * @property {Function} onSpotlightRight     The handler to run when the 5-way right key is pressed.
 * @property {Function} onSpotlightUp        The handler to run when the 5-way up key is pressed.
 * @property {Number[]} selectionKeys        An array of numbers representing keyCodes that should trigger mouse event
 *                                           emulation when `emulateMouse` is `true`. If a keyCode equals a directional
 *                                           key, then default 5-way navigation will be prevented when that key is pressed.
 * @property {Boolean}  spotlightDisabled    When `true`, the component cannot be navigated using spotlight.
 * @private
 */

/**
 * Object returned by `useSpot`
 *
 * @typedef {Object} useSpotInterface
 * @memberof ui/Spottable
 * @property {Boolean}  [blur]       Handle when blurred.
 * @property {Boolean}  [className]  The class being spottable and focused when disabled.
 * @property {Boolean}  [focus]      Handle when focused.
 * @property {Boolean}  [keyDown]    Handle to run when the 5-way up key is pressed.
 * @property {Boolean}  [keyUp]      Handle to run when the 5-way up key is released.
 * @property {Boolean}  [mouseEnter] Handle when mouse enters.
 * @property {Boolean}  [mouseLeave] Handle when mouse leaves.
 * @property {Boolean}  [ref]        The ref for the target node.
 * @private
 */

/**
 * Manages a boolean state value.
 *
 * The value may either be Spotd via the `onSpot` or explicitly set via `onActivate` and
 * `onDeactivate`. The initial value can be set using the `defaultSelected` option.
 *
 * @param {useSpotConfig} config Configuration options
 * @returns {useSpotInterface}
 * @private
 */

const useSpot = ({componentRef, emulateMouse, selectionKeys = [ENTER_KEY, REMOTE_OK_KEY], spotlightDisabled, ...props} = {}) => {
	const useForceUpdate = () => (React.useReducer(x => x + 1, 0));
	const spot = useClass(Spot, {emulateMouse, useForceUpdate});
	const context = React.useRef({
		prevSpotlightDisabled: spotlightDisabled,
		spotlightDisabled
	});

	context.current = {
		prevSpotlightDisabled: context.current.spotlightDisabled,
		spotlightDisabled
	};

	spot.setPropsAndContext({selectionKeys, spotlightDisabled, ...props}, context.current);

	React.useEffect(() => {
		// eslint-disable-next-line react/no-find-dom-node
		spot.load(ReactDOM.findDOMNode(componentRef && componentRef.current || null));

		return () => {
			spot.unload();
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	React.useEffect(spot.didUpdate); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		blur: spot.handleBlur,
		className: spot.spottableClass || null,
		focus: spot.handleFocus,
		keyDown: spot.handleKeyDown,
		keyUp: spot.handleKeyUp,
		mouseEnter: spot.handleEnter,
		mouseLeave: spot.handleLeave
	};
};

export default useSpot;
export {
	spottableClass,
	useSpot
};
