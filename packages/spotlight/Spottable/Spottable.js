/**
 * Adds spottability to components.
 *
 * @module spotlight/Spottable
 * @exports Spottable
 * @exports spottableClass
 */

import {forward, forwardWithPrevent, handle, preventDefault, stop} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import {getContainersForNode} from '../src/container';
import {hasPointerMoved} from '../src/pointer';
import {getDirection, Spotlight} from '../src/spotlight';

/**
 * The class name for spottable components. In general, you do not need to directly access this class
 *
 * @memberof spotlight/Spottable
 * @public
 */
const spottableClass = 'spottable';

const ENTER_KEY = 13;
const REMOTE_OK_KEY = 16777221;

const isKeyboardAccessible = (node) => {
	if (!node) return false;
	const name = node.nodeName.toUpperCase();
	const type = node.type ? node.type.toUpperCase() : null;
	return (
		name === 'BUTTON' ||
		name === 'A' ||
		name === 'INPUT' && (
			type === 'BUTTON' ||
			type === 'CHECKBOX' ||
			type === 'IMAGE' ||
			type === 'RADIO' ||
			type === 'RESET' ||
			type === 'SUBMIT'
		)
	);
};

const isSpottable = (ev, props) => !props.spotlightDisabled;

// Last instance of spottable to be focused
let lastSelectTarget = null;
// Should we prevent select being passed through
let selectCancelled = false;

/**
 * Default configuration for Spottable
 *
 * @hocconfig
 * @memberof spotlight/Spottable.Spottable
 */
const defaultConfig = {
	/**
	 * Whether or not the component should emulate mouse events as a response
	 * to Spotlight 5-way events.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 * @memberof spotlight/Spottable.Spottable.defaultConfig
	 */
	emulateMouse: true
};

const shouldEmulateMouse = (emulateMouse) => (ev, props) => {
	if (!emulateMouse) {
		return;
	}

	const {currentTarget, repeat, type, which} = ev;
	const {selectionKeys} = props;
	const keyboardAccessible = isKeyboardAccessible(currentTarget);

	const keyCode = selectionKeys.find((value) => (
		// emulate mouse events for any remote okay button event
		which === REMOTE_OK_KEY ||
		// or a non-keypress selection event or any selection event on a non-keyboard accessible
		// control
		(
			which === value &&
			(type !== 'keypress' || !keyboardAccessible)
		)
	));

	if (getDirection(keyCode)) {
		preventDefault(ev);
		stop(ev);
	} else if (keyCode && keyboardAccessible) {
		preventDefault(ev);
	}

	return keyCode && !repeat;
};

const forwardSpotlightEvents = (ev, {onSpotlightDown, onSpotlightLeft, onSpotlightRight, onSpotlightUp}) => {
	const {keyCode} = ev;

	if (onSpotlightDown && is('down', keyCode)) {
		onSpotlightDown(ev);
	} else if (onSpotlightLeft && is('left', keyCode)) {
		onSpotlightLeft(ev);
	} else if (onSpotlightRight && is('right', keyCode)) {
		onSpotlightRight(ev);
	} else if (onSpotlightUp && is('up', keyCode)) {
		onSpotlightUp(ev);
	}

	return true;
};

const forwardAndResetLastSelectTarget = (ev, props) => {
	const {keyCode} = ev;
	const {selectionKeys} = props;
	const key = selectionKeys.find((value) => keyCode === value);
	const notPrevented = forwardWithPrevent('onKeyUp', ev, props);

	// bail early for non-selection keyup to avoid clearing lastSelectTarget prematurely
	if (!key && (!is('enter', keyCode) || !getDirection(keyCode))) {
		return notPrevented;
	}

	const allow = lastSelectTarget === this;
	selectCancelled = false;
	lastSelectTarget = null;

	return notPrevented && allow;
};

function focusEffect (props, state) {
	return () => {
		state.isFocused = state.node && Spotlight.getCurrent() === state.node;

		// if the component is focused and became disabled
		if (state.isFocused && props.disabled && lastSelectTarget === state && !selectCancelled) {
			selectCancelled = true;
			forward('onMouseUp', null, props);
		}
	};
}

function mountEffect (props, state, node) {
	return () => {
		// eslint-disable-next-line react/no-find-dom-node
		state.node = ReactDOM.findDOMNode(node.current);

		return () => {
			if (state.isFocused) {
				forward('onSpotlightDisappear', null, props);
			}

			if (lastSelectTarget === state) {
				lastSelectTarget = null;
			}
		};
	}
}

function updateEffect (props, state) {
	return () => {
		// if the component became enabled, notify spotlight to enable restoring "lost" focus
		if (!props.spottableDisabled && !Spotlight.isPaused()) {
			if (Spotlight.getPointerMode()) {
				if (state.isHovered) {
					Spotlight.setPointerMode(false);
					Spotlight.focus(state.node);
					Spotlight.setPointerMode(true);
				}
			} else if (!Spotlight.getCurrent()) {
				const containers = getContainersForNode(state.node);
				const containerId = Spotlight.getActiveContainer();
				if (containers.indexOf(containerId) >= 0) {
					Spotlight.focus(containerId);
				}
			}
		}
	};
}

function configureSpottable (config) {
	const {emulateMouse} = {...defaultConfig, ...config};

	const handleKeyUp = handle(
		forwardAndResetLastSelectTarget,
		isSpottable,
		shouldEmulateMouse(emulateMouse),
		forward('onMouseUp'),
		forward('onClick')
	);

	// eslint-disable-next-line no-shadow
	return function useSpottable (props) {
		const [state] = React.useState({
			isFocused: false,
			isHovered: false,
			// Used to indicate that we want to stop propagation on blur events that occur as a
			// result of this component imperatively blurring itself on focus when spotlightDisabled
			shouldPreventBlur: false
		});

		const node = React.useRef(null);

		React.useLayoutEffect(mountEffect(props, state, node), [node.current]);
		React.useEffect(focusEffect(props, state));
		React.useEffect(updateEffect(props, state), [props.spottableDisabled]);

		const handleBlur = (ev) => {
			if (state.shouldPreventBlur) return;
			if (ev.currentTarget === ev.target) {
				state.isFocused = false;
			}

			if (Spotlight.isMuted(ev.target)) {
				ev.stopPropagation();
			} else {
				forward('onBlur', ev, props);
			}
		};

		const handleFocus = (ev) => {
			if (props.spotlightDisabled) {
				state.shouldPreventBlur = true;
				ev.target.blur();
				state.shouldPreventBlur = false;
				return;
			}

			if (ev.currentTarget === ev.target) {
				state.isFocused = true;
			}

			if (Spotlight.isMuted(ev.target)) {
				ev.stopPropagation();
			} else {
				forward('onFocus', ev, props);
			}
		};

		const handleSelect = ({which}, {selectionKeys}) => {
			// Only apply accelerator if handling a selection key
			if (selectionKeys.find((value) => which === value)) {
				if (selectCancelled || (lastSelectTarget && lastSelectTarget !== this)) {
					return false;
				}
				lastSelectTarget = state;
			}

			return true;
		};

		const handleKeyDown = handle(
			forwardWithPrevent('onKeyDown'),
			forwardSpotlightEvents,
			isSpottable,
			handleSelect,
			shouldEmulateMouse(emulateMouse),
			forward('onMouseDown')
		);

		const handleEnter = (ev) => {
			forward('onMouseEnter', ev, props);
			if (hasPointerMoved(ev.clientX, ev.clientY)) {
				state.isHovered = true;
			}
		};

		const handleLeave = (ev) => {
			forward('onMouseLeave', ev, props);
			if (hasPointerMoved(ev.clientX, ev.clientY)) {
				state.isHovered = false;
			}
		};

		const {spotlightId} = props;
		let {className, tabIndex} = props;

		if (props.tabIndex == null) {
			tabIndex = -1;
		}

		if (!props.spotlightDisabled) {
			className = className ? className + ' ' + spottableClass : spottableClass;
		}

		return {
			// if (spotlightId) ...
			'data-spotlight-id': spotlightId,
			className,
			onBlur: (ev) => handleBlur(ev, props),
			onFocus: (ev) => handleFocus(ev, props),
			onMouseEnter: (ev) => handleEnter(ev, props),
			onMouseLeave: (ev) => handleLeave(ev, props),
			onKeyDown: (ev) => handleKeyDown(ev, props),
			onKeyUp: (ev) => handleKeyUp(ev, props),
			// TODO: This is a bit problematic right now since refs can only be attached to DOM
			// nodes and React class components but not functional components. Previously, we used
			// findDOMNode on the spottable class to derive the DOM node so the HOC could be safely
			// applied to anything. That's no longer the case with this implementation and needs to
			// be addressed.
			ref: node,
			tabIndex: tabIndex
		};
	};
}

const useSpottable = configureSpottable();
useSpottable.configure = configureSpottable;

/**
 * Constructs a Spotlight 5-way navigation-enabled higher-order component.
 *
 * Note: This HoC passes a number of props to the wrapped component that should be passed to the
 * main DOM node.
 *
 * Example:
 * ```
 *	const Component = ({myProp, ...rest}) => (
 *		<div {...rest}>{myProp}</div>
 *	);
 *	...
 *	const SpottableComponent = Spottable(Component);
 * ```
 * @class Spottable
 * @memberof spotlight/Spottable
 * @param  {Object} defaultConfig Set of default configuration parameters
 * @param  {Function} Wrapped Component to wrap
 *
 * @hoc
 * @returns {Function} Spottable
 */
const Spottable = hoc(defaultConfig, (config, Wrapped) => {
	const hook = configureSpottable(config);

	// eslint-disable-next-line no-shadow
	function Spottable (props) {
		const updated = {
			...props,
			...hook(props)
		};

		delete updated.onSpotlightDisappear;
		delete updated.onSpotlightDown;
		delete updated.onSpotlightLeft;
		delete updated.onSpotlightRight;
		delete updated.onSpotlightUp;
		delete updated.selectionKeys;
		delete updated.spotlightId;

		return (
			<Wrapped {...updated} />
		);
	}

	Spottable.propTypes = /** @lends spotlight/Spottable.Spottable.prototype */ {
		/**
		 * Whether or not the component is in a disabled state.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The handler to run when the component is removed while retaining focus.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDisappear: PropTypes.func,

		/**
		 * The handler to run when the 5-way down key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDown: PropTypes.func,

		/**
		 * The handler to run when the 5-way left key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightLeft: PropTypes.func,

		/**
		 * The handler to run when the 5-way right key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightRight: PropTypes.func,

		/**
		 * The handler to run when the 5-way up key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightUp: PropTypes.func,

		/**
		 * An array of numbers representing keyCodes that should trigger mouse event
		 * emulation when `emulateMouse` is `true`. If a keyCode equals a directional
		 * key, then default 5-way navigation will be prevented when that key is pressed.
		 *
		 * @type {Number[]}
		 * @default [13, 16777221]
		 * @public
		 */
		selectionKeys: PropTypes.arrayOf(PropTypes.number),

		/**
		 * When `true`, the component cannot be navigated using spotlight.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		spotlightDisabled: PropTypes.bool,

		/**
		 * Used to identify this component within the Spotlight system
		 *
		 * @type {String}
		 * @public
		 */
		spotlightId: PropTypes.string,

		/**
		 * The tabIndex of the component. This value will default to -1 if left
		 * unset and the control is spottable.
		 *
		 * @type {Number}
		 * @public
		 */
		tabIndex: PropTypes.number
	}

	Spottable.defaultProps = {
		selectionKeys: [ENTER_KEY, REMOTE_OK_KEY]
	};

	return Spottable;
});

export default Spottable;
export {
	configureSpottable,
	Spottable,
	spottableClass,
	useSpottable
};
