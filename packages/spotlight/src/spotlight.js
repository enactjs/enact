/*
 * A javascript-based implementation of Spatial Navigation.
 *
 * Copyright (c) 2016 Luke Chang.
 * https://github.com/luke-chang/js-spatial-navigation
 *
 * Licensed under the MPL license.
 */

/**
 * Exports the {@link spotlight.Spotlight} object used for controlling spotlight behavior and the
 * {@link spotlight.Spotlight.getDirection} function for mapping a keycode to a spotlight direction.
 *
 * The default export is {@link spotlight.Spotlight}.
 *
 * @module spotlight
 */

import {is} from '@enact/core/keymap';
import {isWindowReady} from '@enact/core/snapshot';
import platform from '@enact/core/platform';
import last from 'ramda/src/last';

import Accelerator from '../Accelerator';
import {spottableClass} from '../Spottable';
import {isPaused, pause, resume} from '../Pause';

import {
	addContainer,
	configureContainer,
	configureDefaults,
	getAllContainerIds,
	getContainerConfig,
	getContainerLastFocusedElement,
	getContainersForNode,
	getLastContainer,
	getSpottableDescendants,
	isContainer,
	isContainer5WayHoldable,
	isNavigable,
	isWithinOverflowContainer,
	mayActivateContainer,
	notifyLeaveContainer,
	notifyLeaveContainerFail,
	notifyEnterContainer,
	removeAllContainers,
	removeContainer,
	rootContainerId,
	setContainerLastFocusedElement,
	setContainerPreviousTarget,
	setDefaultContainer,
	setLastContainer,
	setLastContainerFromTarget,
	unmountContainer
} from './container';

import {
	getLastPointerPosition,
	getPointerMode,
	hasPointerMoved,
	notifyKeyDown,
	notifyPointerMove,
	setPointerMode
} from './pointer';

import {
	getNavigableTarget,
	getTargetByContainer,
	getTargetByDirectionFromElement,
	getTargetByDirectionFromPosition,
	getTargetBySelector,
	isFocusable
} from './target';

import {
	matchSelector,
	parseSelector
} from './utils';

const isDown = is('down');
const isEnter = is('enter');
const isLeft = is('left');
const isRight = is('right');
const isUp = is('up');

/**
 * Translates keyCodes into 5-way direction descriptions (e.g. `'down'`)
 *
 * @function
 * @memberof spotlight
 * @param {Number} keyCode - Key code to analyze
 * @returns {String|false} - One of `'up'`, `'down'`, `'left'`, `'right'` or `false` if not a direction key
 * @public
 */
const getDirection = function (keyCode) {
	return	isDown(keyCode) && 'down' ||
			isLeft(keyCode) && 'left' ||
			isRight(keyCode) && 'right' ||
			isUp(keyCode) && 'up';
};


const SpotlightAccelerator = new Accelerator();

/**
 * Provides 5-way navigation and focus support
 *
 * ```
 * import Spotlight from '@enact/Spotlight';
 *
 * // get the currently focused component
 * const current = Spotlight.getCurrent();
 *
 * // focus an element by CSS selector
 * Spotlight.focus('.my-custom-class');
 *
 * // is `current` focusable?
 * const isFocused = Spotlight.isSpottable(current);
 * ```
 *
 * @type {Object}
 * @memberof spotlight
 * @public
 */
const Spotlight = (function () {
	'use strict';

	/*
	/* private vars
	*/
	let _initialized = false;
	let _duringFocusChange = false;

	/*
	 * Whether a 5-way directional key is being held.
	 *
	 * @type {Boolean}
	 * @default false
	 */
	let _5WayKeyHold = false;

	/*
	 * Whether to set focus during the next window focus event
	 *
	 * @type {Boolean}
	 * @default false
	 */
	let _spotOnWindowFocus = false;

	/*
	 * `true` when a pointer move event occurs during a keypress. Used to short circuit key down
	 * handling until the next keyup occurs.
	 *
	 * @type {Boolean}
	 * @default false
	 */
	let _pointerMoveDuringKeyPress = false;

	/*
	* protected methods
	*/

	function preventDefault (evt) {
		evt.preventDefault();
		evt.stopPropagation();
		return false;
	}

	function shouldPreventNavigation () {
		return isPaused() || getAllContainerIds().length === 0;
	}

	function getCurrent () {
		if (!isWindowReady()) return;

		let activeElement = document.activeElement;
		if (activeElement && activeElement !== document.body) {
			return activeElement;
		}
	}

	// An extension point for updating pointer mode based on the current platform.
	// Currently only webOS
	function setPlatformPointerMode () {
		const palmSystem = window.PalmSystem;
		if (palmSystem && palmSystem.cursor) {
			setPointerMode(palmSystem.cursor.visibility);
		}
	}

	function focusElement (elem, containerIds, fromPointer) {
		if (!elem) {
			return false;
		}

		if ((getPointerMode() && !fromPointer)) {
			setContainerLastFocusedElement(elem, containerIds);
			return false;
		}

		let currentFocusedElement = getCurrent();

		if (elem === currentFocusedElement) {
			return true;
		}

		const focusOptions = isWithinOverflowContainer(elem, containerIds) ? {preventScroll: true} : null;

		let silentFocus = function () {
			elem.focus(focusOptions);
			focusChanged(elem, containerIds);
		};

		if (_duringFocusChange) {
			silentFocus();
			return true;
		}

		_duringFocusChange = true;

		if (isPaused()) {
			silentFocus();
			_duringFocusChange = false;
			return true;
		}

		elem.focus(focusOptions);

		_duringFocusChange = false;

		focusChanged(elem, containerIds);
		return true;
	}

	function focusChanged (elem, containerIds) {
		if (!containerIds || !containerIds.length) {
			containerIds = getContainersForNode(elem);
		}
		const containerId = last(containerIds);
		if (containerId) {
			setContainerLastFocusedElement(elem, containerIds);
			setLastContainer(containerId);
		}

		if (__DEV__) {
			// assignFocusPreview(elem);
		}
	}

	function restoreFocus () {
		const lastContainerId = getLastContainer();
		const next = [rootContainerId];

		if (lastContainerId) {
			next.unshift(lastContainerId);

			// only prepend last focused if it exists so that Spotlight.focus() doesn't receive
			// a falsy target
			const lastFocused = getContainerLastFocusedElement(lastContainerId);
			if (lastFocused) {
				next.unshift(lastFocused);
			}
		}

		// attempt to find a target starting with the last focused element in the last
		// container, followed by the last container, and finally the root container
		return next.reduce((focused, target) => focused || Spotlight.focus(target), false);
	}

	// The below should be gated on non-production environment only.
	function assignFocusPreview (elem) {
		const directions = ['up', 'right', 'down', 'left'],
			nextClassBase = spottableClass + '-next-';

		// Remove all previous targets
		directions.forEach((dir) => {
			const nextClass = nextClassBase + dir,
				prevElems = parseSelector('.' + nextClass);
			if (prevElems && prevElems.length !== 0) {
				prevElems.forEach(prevElem => prevElem.classList.remove(nextClass));
			}
		});

		// Find all next targets and identify them
		directions.forEach((dir) => {
			const nextElem = getTargetByDirectionFromElement(dir, elem);
			if (nextElem) {
				nextElem.classList.add(nextClassBase + dir);
			}
		});
	}

	function spotNextFromPoint (direction, position) {
		const containerId = Spotlight.getActiveContainer();
		const next = getTargetByDirectionFromPosition(direction, position, containerId);

		if (next) {
			setContainerPreviousTarget(
				containerId,
				direction,
				next,
				getContainerLastFocusedElement(containerId)
			);

			return focusElement(next, getContainersForNode(next));
		}

		return false;
	}

	function spotNext (direction, currentFocusedElement, currentContainerIds) {
		const next = getTargetByDirectionFromElement(direction, currentFocusedElement);

		if (next) {
			const currentContainerId = last(currentContainerIds);
			const nextContainerIds = getContainersForNode(next);

			// prevent focus if 5-way is being held and the next element isn't wrapped by
			// the current element's immediate container
			if (_5WayKeyHold && nextContainerIds.indexOf(currentContainerId) < 0 && !isContainer5WayHoldable(currentContainerId)) {
				return false;
			}

			notifyLeaveContainer(
				direction,
				currentFocusedElement,
				currentContainerIds,
				next,
				nextContainerIds
			);

			setContainerPreviousTarget(
				currentContainerId,
				direction,
				next,
				currentFocusedElement
			);

			const focused = focusElement(next, nextContainerIds);

			notifyEnterContainer(
				direction,
				currentFocusedElement,
				currentContainerIds,
				next,
				nextContainerIds
			);

			return focused;
		}

		notifyLeaveContainerFail(direction, currentFocusedElement, currentContainerIds);

		return false;
	}

	function onAcceleratedKeyDown (evt) {
		const direction = getDirection(evt.keyCode);

		if (!direction) return;

		const currentFocusedElement = getCurrent();
		const currentContainerIds = getContainersForNode(currentFocusedElement);

		spotNext(direction, currentFocusedElement, currentContainerIds);
	}

	function onBlur () {
		const current = getCurrent();

		if (current) {
			current.blur();
		}
		Spotlight.setPointerMode(false);
		_spotOnWindowFocus = true;
		_pointerMoveDuringKeyPress = false;
	}

	function handleWebOSMouseEvent (ev) {
		if (!isPaused() && ev && ev.detail && ev.detail.type === 'Leave') {
			onBlur();
		}
	}

	function handleKeyboardStateChangeEvent ({visibility}) {
		if (!visibility) {
			setPlatformPointerMode();
		}
	}

	function onFocus () {
		// Normally, there isn't focus here unless the window has been blurred above. On webOS, the
		// platform may focus the window after the app has already focused a component so we prevent
		// trying to focus something else (potentially) unless the window was previously blurred
		if (_spotOnWindowFocus) {
			setPlatformPointerMode();

			// If the window was previously blurred while in pointer mode, the last active containerId may
			// not have yet set focus to its spottable elements. For this reason we can't rely on setting focus
			// to the last focused element of the last active containerId, so we use rootContainerId instead
			let lastFocusedElement = getContainerLastFocusedElement(rootContainerId);
			while (isContainer(lastFocusedElement)) {
				({lastFocusedElement} = getContainerConfig(lastFocusedElement));
			}

			if (!Spotlight.focus(lastFocusedElement)) {
				// If the last focused element was previously also disabled (or no longer exists), we
				// need to set focus somewhere
				Spotlight.focus();
			}
			_spotOnWindowFocus = false;
		}
	}

	function onKeyUp (evt) {
		_pointerMoveDuringKeyPress = false;
		const keyCode = evt.keyCode;

		if (getDirection(keyCode) || isEnter(keyCode)) {
			SpotlightAccelerator.reset();
			_5WayKeyHold = false;
		}
	}

	function handlePointerHide () {
		if (!getCurrent()) {
			restoreFocus();
		}
	}

	function onKeyDown (evt) {
		if (shouldPreventNavigation()) {
			notifyKeyDown(evt.keyCode);
			return;
		}

		const keyCode = evt.keyCode;
		const direction = getDirection(keyCode);
		const pointerHandled = notifyKeyDown(keyCode, handlePointerHide);

		if (pointerHandled || !(direction || isEnter(keyCode))) {
			return;
		}

		if (!isPaused() && !_pointerMoveDuringKeyPress) {
			if (getCurrent()) {
				SpotlightAccelerator.processKey(evt, onAcceleratedKeyDown);
			} else if (!spotNextFromPoint(direction, getLastPointerPosition())) {
				restoreFocus();
			}
			_5WayKeyHold = true;
		}

		if (direction) {
			preventDefault(evt);
		}
	}

	function onMouseMove ({target, clientX, clientY}) {
		if (shouldPreventNavigation()) {
			notifyPointerMove(null, target, clientX, clientY);
			return;
		}

		const current = getCurrent();
		const update = notifyPointerMove(current, target, clientX, clientY);

		if (update) {
			if (_5WayKeyHold) {
				_pointerMoveDuringKeyPress = true;
			}

			const next = getNavigableTarget(target);

			// TODO: Consider encapsulating this work within focusElement
			if (next !== current) {
				if (next) {
					focusElement(next, getContainersForNode(next), true);

					return true;
				} else if (current) {
					current.blur();
					setLastContainerFromTarget(current, target);
				}
			}
		}
	}

	function onMouseOver (evt) {
		if (shouldPreventNavigation()) return;

		const {target} = evt;

		if (getPointerMode() && hasPointerMoved(evt.clientX, evt.clientY)) {
			const next = getNavigableTarget(target); // account for child controls

			if (next && next !== getCurrent()) {
				focusElement(next, getContainersForNode(next), true);

				return true;
			}

			preventDefault(evt);
		}
	}

	/*
	 * public methods
	 */
	const exports = /** @lends spotlight.Spotlight */ { // eslint-disable-line no-shadow
		/**
		 * Initializes Spotlight. This is generally handled by
		 * {@link spotlight/SpotlightRootDecorator.SpotlightRootDecorator}.
		 *
		 * @param {Object} containerDefaults Default configuration for new spotlight containers
		 * @returns {undefined}
		 * @public
		 */
		initialize: function (containerDefaults) {
			if (!_initialized) {
				window.addEventListener('blur', onBlur);
				window.addEventListener('focus', onFocus);
				window.addEventListener('keydown', onKeyDown);
				window.addEventListener('keyup', onKeyUp);
				window.addEventListener('mouseover', onMouseOver);
				window.addEventListener('mousemove', onMouseMove);
				if (platform.webos) {
					window.top.document.addEventListener('webOSMouse', handleWebOSMouseEvent);
					window.top.document.addEventListener('keyboardStateChange', handleKeyboardStateChangeEvent);
				}
				setLastContainer(rootContainerId);
				configureDefaults(containerDefaults);
				configureContainer(rootContainerId);
				// by default, pointer mode is off but the platform's current state will override that
				setPointerMode(false);
				setPlatformPointerMode();
				_initialized = true;
			}
		},

		/**
		 * Terminates Spotlight. This is generally handled by {@link spotlight.SpotlightRootDecorator}.
		 *
		 * @public
		 */
		terminate: function () {
			window.removeEventListener('blur', onBlur);
			window.removeEventListener('focus', onFocus);
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('keyup', onKeyUp);
			window.removeEventListener('mouseover', onMouseOver);
			window.removeEventListener('mousemove', onMouseMove);
			if (platform.webos) {
				window.top.document.removeEventListener('webOSMouse', handleWebOSMouseEvent);
				window.top.document.removeEventListener('keyboardStateChange', handleKeyboardStateChangeEvent);
			}
			Spotlight.clear();
			_initialized = false;
		},

		/**
		 * Resets spotlight container information
		 *
		 * @private
		 */
		clear: function () {
			removeAllContainers();
			setDefaultContainer();
			setLastContainer();
			_duringFocusChange = false;
		},

		// set(<config>);
		// set(<containerId>, <config>);
		/**
		 * Sets the config for spotlight or the specified containerID
		 *
		 * @function
		 * @param {String|Object} containerIdOrConfig  Configuration object or container ID
		 * @param {Object}        [config]             Configuration object if container ID supplied
		 *                                             in `containerIdOrConfig`
		 * @returns {undefined}
		 * @public
		 */
		set: configureContainer,

		// add(<config>);
		// add(<containerId>, <config>);
		/**
		 * Adds the config for a new container. The container ID may be passed in the configuration
		 * object. If no container ID is supplied, a new container ID will be generated.
		 *
		 * @function
		 * @param {String|Object} containerIdOrConfig  Configuration object or container ID
		 * @param {Object}        [config]             Configuration object if container ID supplied
		 *                                             in `containerIdOrConfig`
		 * @returns {String} The container ID of the container
		 * @public
		 */
		add: addContainer,

		unmount: function (containerId) {
			if (!containerId || typeof containerId !== 'string') {
				throw new Error('Please assign the "containerId"!');
			}
			unmountContainer(containerId);
		},

		/**
		 * Removes a container from Spotlight
		 *
		 * @param {String} containerId Container ID to remove
		 * @returns {Boolean} `true` if container removed, `false` if container does not exist
		 * @public
		 */
		remove: function (containerId) {
			if (!containerId || typeof containerId !== 'string') {
				throw new Error('Please assign the "containerId"!');
			}
			if (getContainerConfig(containerId)) {
				removeContainer(containerId);
				if (getLastContainer() === containerId) {
					Spotlight.setActiveContainer(null);
				}
				return true;
			}
			return false;
		},

		/**
		 * Disables the selector rules of the specified container
		 *
		 * @param {String} containerId Container ID selector rules to disable
		 * @returns {Boolean} `true` if container's selector rules are disabled, `false` if container does not exist
		 * @public
		 */
		disableSelector: function (containerId) {
			if (isContainer(containerId)) {
				configureContainer(containerId, {selectorDisabled: false});
				return true;
			}

			return false;
		},

		/**
		 * Enables the selector rules of the specified container
		 *
		 * @param {String} containerId Container ID selector rules to enable
		 * @returns {Boolean} `true` if container's selector rules are enabled, `false` if container does not exist
		 * @public
		 */
		enableSelector: function (containerId) {
			if (isContainer(containerId)) {
				configureContainer(containerId, {selectorDisabled: false});
				return true;
			}

			return false;
		},

		/**
		 * Pauses Spotlight
		 *
		 * @function
		 * @returns {undefined}
		 * @public
		 */
		pause,

		/**
		 * Resumes Spotlight
		 *
		 * @function
		 * @returns {undefined}
		 * @public
		 */
		resume,

		// focus()
		// focus(<containerId>)
		// focus(<extSelector>)
		/**
		 * Focuses the specified component ID, container ID, element selector, or the default
		 * container.
		 *
		 * If Spotlight is in pointer mode, focus is not changed but `elem` will be set as the last
		 * focused element of its spotlight containers.
		 *
		 * @param {String|Object|undefined} elem Component ID, container, ID or element selector.
		 *	If not supplied, the default container will be focused.
		 * @returns {Boolean} `true` if focus successful, `false` if not.
		 * @public
		 */
		focus: function (elem) {
			let target = elem;
			let wasContainerId = false;

			if (!elem) {
				target = getTargetByContainer();
			} else if (typeof elem === 'string') {
				if (getContainerConfig(elem)) {
					target = getTargetByContainer(elem);
					wasContainerId = true;
				} else if (/^[\w\d-]+$/.test(elem)) {
					// support component IDs consisting of alphanumeric, dash, or underscore
					target = getTargetBySelector(`[data-spotlight-id=${elem}]`);
				} else {
					target = getTargetBySelector(elem);
				}
			}

			const nextContainerIds = getContainersForNode(target);
			const nextContainerId = last(nextContainerIds);
			if (isNavigable(target, nextContainerId, true)) {
				const focused = focusElement(target, nextContainerIds);

				if (!focused && wasContainerId) {
					setLastContainer(elem);
				}

				return focused;
			} else if (wasContainerId) {
				// if we failed to find a spottable target within the provided container, we'll set
				// it as the active container to allow it to focus itself if its contents change
				setLastContainer(elem);
			}

			return false;
		},

		// move(<direction>)
		// move(<direction>, <selector>)
		/**
		 * Moves focus to the next spottable control in the direction specified. Optionally, a source
		 * element selector may be supplied as the starting point.
		 *
		 * @param {String} direction Direction to move, one of `'left'`, `'right'`, `'up'` or `'down'`
		 * @param {String|undefined} selector If supplied, the element to move from. If not supplied,
		 *	the currently focused item will be used.
		 * @returns {Boolean} `true` if focus successful, `false` if not.
		 * @public
		 */
		move: function (direction, selector) {
			direction = direction.toLowerCase();
			if (direction !== 'up' && direction !== 'down' && direction !== 'left' && direction !== 'right') {
				return false;
			}

			const elem = selector ? parseSelector(selector)[0] : getCurrent();
			if (!elem) {
				return false;
			}

			const containerIds = getContainersForNode(elem);
			if (!containerIds.length) {
				return false;
			}

			return spotNext(direction, elem, containerIds);
		},

		/**
		 * Sets or clears the default container that will receive focus.
		 *
		 * @function
		 * @param {String} [containerId] The container ID or a falsy value to clear default
		 *                               container
		 * @returns {undefined}
		 * @public
		 */
		setDefaultContainer,

		/**
		 * Gets the currently active container.
		 *
		 * @returns {String} The id of the currently active container
		 * @public
		 */
		getActiveContainer: function () {
			return getLastContainer() || rootContainerId;
		},

		/**
		 * Sets the currently active container.
		 *
		 * Note: If the current container is restricted to 'self-only' and `containerId` is not
		 * contained within the current container then the active container will not be updated.
		 *
		 * @param {String} [containerId] The id of the currently active container. If this is not
		 *	provided, the root container is set as the currently active container.
		 * @public
		 */
		setActiveContainer: function (containerId) {
			if (mayActivateContainer(containerId)) {
				setLastContainer(containerId || rootContainerId);
			}
		},

		/**
		 * Gets the current pointer mode
		 *
		 * @function
		 * @returns {Boolean} `true` if spotlight is in pointer mode
		 * @public
		 */
		getPointerMode,

		/**
		 * Sets the current pointer mode
		 *
		 * @function
		 * @param {Boolean} pointerMode The value of the pointer mode. This determines how
		 *	spotlight manages focus change behaviors.
		 * @public
		 */
		setPointerMode,

		/**
		 * Gets the muted mode value of a spottable element.
		 *
		 * @param {Object} elem The dom element used to determine the muted status.
		 * @returns {Boolean} `true` if the passed-in control is in muted mode.
		 * @public
		 */
		isMuted: function (elem) {
			if (!elem) {
				return false;
			}

			return matchSelector('[data-spotlight-container-muted="true"] .' + spottableClass, elem);
		},

		/**
		 * Determines whether Spotlight is currently paused.
		 *
		 * @function
		 * @returns {Boolean} `true` if Spotlight is currently paused.
		 * @public
		 */
		isPaused,

		/**
		 * Determines whether an element is spottable.
		 *
		 * @param {Object} elem The dom element used to determine the spottable status.
		 * @returns {Boolean} `true` if the element being evaluated is currently spottable.
		 * @public
		 */
		isSpottable: function (elem) {
			if (!elem) {
				return false;
			}

			return isFocusable(elem);
		},

		/**
		 * Returns the currently spotted control.
		 *
		 * @returns {Node} The control that currently has focus, if available
		 * @public
		 */
		getCurrent: function () {
			return getCurrent();
		},

		/**
		 * Returns a list of spottable elements wrapped by the supplied container.
		 *
		 * @param {String} containerId The id of the container used to determine the list of spottable elements
		 * @returns {Node[]} The spottable elements that are wrapped by the supplied container
		 * @public
		 */
		getSpottableDescendants: function (containerId) {
			if (!containerId || typeof containerId !== 'string') {
				throw new Error('Please assign the "containerId"!');
			}

			return getSpottableDescendants(containerId);
		}
	};

	return exports;

})();

export default Spotlight;
export {
	getDirection,
	Spotlight
};
