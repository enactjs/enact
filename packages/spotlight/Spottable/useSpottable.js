/**
 * Adds spottability to components.
 *
 * @module spotlight/Spottable
 * @exports Spottable
 * @exports spottableClass
 */

import classnames from 'classnames';
import {forKey, forward, forwardWithPrevent, handle, oneOf, preventDefault, returnsTrue, stop} from '@enact/core/handle';
import {is} from '@enact/core/keymap';
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

const defaultProps = {
	selectionKeys: [ENTER_KEY, REMOTE_OK_KEY]
};

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

const handlePointerMoved = ({clientX, clientY}) => hasPointerMoved(clientX, clientY);
const setState = (name, value) => (ev, props, {state}) => {
	state[name] = value;
	return true;
};

// Last instance of spottable to be focused
let lastSelectTarget = null;
// Should we prevent select being passed through
let selectCancelled = false;

const isSelectionEvent = ({which}, {selectionKeys = defaultProps.selectionKeys}) => {
	return selectionKeys.find((value) => which === value);
};

const handleSelect = (ev, props, {state}) => {
	// Only apply accelerator if handling a selection key
	if (isSelectionEvent(ev, props)) {
		if (selectCancelled || (lastSelectTarget && lastSelectTarget !== state)) {
			return false;
		}
		lastSelectTarget = state;
	}

	return true;
};

function unmountTarget (target) {
	if (lastSelectTarget === target) {
		lastSelectTarget = null;
	}
}

const shouldEmulateMouse = (ev, props, {config: {emulateMouse}}) => {
	if (!emulateMouse) {
		return;
	}

	const {currentTarget, repeat, type, which} = ev;
	const {selectionKeys = defaultProps.selectionKeys} = props;
	const keyboardAccessible = isKeyboardAccessible(currentTarget);

	// TODO: Determine if this method or isSelectionEvent should be the definitive method
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

const forwardSpotlightEvents = returnsTrue(oneOf(
	[forKey('down'), forward('onSpotlightDown')],
	[forKey('right'), forward('onSpotlightRight')],
	[forKey('up'), forward('onSpotlightUp')],
	[forKey('left'), forward('onSpotlightLeft')],
));

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

			unmountTarget(state);
		};
	};
}

function updateEffect (props, state) {
	return () => {
		// if the component became enabled, notify spotlight to enable restoring "lost" focus
		if (!props.spotlightDisabled && !Spotlight.isPaused()) {
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

const handleBlur = (ev, props, {state}) => {
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

const handleFocus = (ev, props, {state}) => {
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

const forwardAndResetLastSelectTarget = (ev, props, {state}) => {
	const {keyCode} = ev;
	const key = isSelectionEvent(ev, props);
	const notPrevented = forwardWithPrevent('onKeyUp', ev, props);

	// bail early for non-selection keyup to avoid clearing lastSelectTarget prematurely
	if (!key && (!is('enter', keyCode) || !getDirection(keyCode))) {
		return notPrevented;
	}

	const allow = lastSelectTarget === state;
	selectCancelled = false;
	lastSelectTarget = null;

	return notPrevented && allow;
};

const handleKeyUp = handle(
	forwardAndResetLastSelectTarget,
	isSpottable,
	shouldEmulateMouse,
	forward('onMouseUp'),
	forward('onClick')
);

const handleKeyDown = handle(
	forwardWithPrevent('onKeyDown'),
	forwardSpotlightEvents,
	isSpottable,
	handleSelect,
	shouldEmulateMouse,
	forward('onMouseDown')
);

const handleEnter = handle(
	forward('onMouseEnter'),
	handlePointerMoved,
	setState('isHovered', true)
);

const handleLeave = handle(
	forward('onMouseLeave'),
	handlePointerMoved,
	setState('isHovered', false)
);

function configureSpottable (config) {
	config = {...defaultConfig, ...config};

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
		React.useEffect(focusEffect(props, state), [props.disabled]);
		React.useEffect(updateEffect(props, state), [props.spotlightDisabled]);

		const context = {
			state,
			config
		};

		return {
			// if (spotlightId) ...
			'data-spotlight-id': props.spotlightId,
			className: classnames(props.className, {[spottableClass]: !props.spotlightDisabled}),
			onBlur: (ev) => handleBlur(ev, props, context),
			onFocus: (ev) => handleFocus(ev, props, context),
			onMouseEnter: (ev) => handleEnter(ev, props, context),
			onMouseLeave: (ev) => handleLeave(ev, props, context),
			onKeyDown: (ev) => handleKeyDown(ev, props, context),
			onKeyUp: (ev) => handleKeyUp(ev, props, context),
			// TODO: This is a bit problematic right now since refs can only be attached to DOM
			// nodes and React class components but not functional components. Previously, we used
			// findDOMNode on the spottable class to derive the DOM node so the HOC could be safely
			// applied to anything. That's no longer the case with this implementation and needs to
			// be addressed.
			ref: node,
			tabIndex: props.tabIndex != null ? props.tabIndex : -1
		};
	};
}

const useSpottable = configureSpottable();
useSpottable.configure = configureSpottable;

export default useSpottable;
export {
	configureSpottable,
	defaultConfig,
	defaultProps,
	spottableClass,
	useSpottable
};
