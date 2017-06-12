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
import last from 'ramda/src/last';

import Accelerator from '../Accelerator';
import {spottableClass} from '../Spottable';

import {
	configureContainer,
	configureDefaults,
	getAllContainerIds,
	getContainerConfig,
	getContainerLastFocusedElement,
	getContainersForNode,
	getLastContainer,
	getSpottableDescendants,
	isContainer,
	isNavigable,
	unmountContainer,
	removeAllContainers,
	removeContainer,
	rootContainerId,
	setContainerLastFocusedElement,
	setContainerPreviousTarget,
	setDefaultContainer,
	setLastContainer,
	setLastContainerFromTarget
} from './container';

import {
	getLastPointerPosition,
	getPointerMode,
	notifyKeyDown,
	notifyPointerMove,
	setPointerMode
} from './pointer';

import {
	getNavigableTarget,
	getTargetByContainer,
	getTargetByDirectionFromElement,
	getTargetByDirectionFromPosition,
	getTargetBySelector
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
	let _pause = false;
	let _duringFocusChange = false;

	/*
	 * Whether a 5-way directional key is being held.
	 *
	 * @type {Boolean}
	 * @default false
	 */
	let _5WayKeyHold = false;

	/*
	* protected methods
	*/

	function preventDefault (evt) {
		evt.preventDefault();
		evt.stopPropagation();
		return false;
	}

	function shouldPreventNavigation () {
		return (!getAllContainerIds().length || _pause);
	}

	function getCurrent () {
		let activeElement = document.activeElement;
		if (activeElement && activeElement !== document.body) {
			return activeElement;
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

		let silentFocus = function () {
			if (currentFocusedElement) {
				currentFocusedElement.blur();
			}
			elem.focus();
			focusChanged(elem, containerIds);
		};

		if (_duringFocusChange) {
			silentFocus();
			return true;
		}

		_duringFocusChange = true;

		if (_pause) {
			silentFocus();
			_duringFocusChange = false;
			return true;
		}

		if (currentFocusedElement) {
			currentFocusedElement.blur();
		}

		elem.focus();

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
	}

	function spotNextFromPoint (direction, position) {
		const containerId = getLastContainer();
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

			// prevent focus if 5-way is being held and the next element would change containers
			if (_5WayKeyHold && nextContainerIds.indexOf(currentContainerId) < 0) {
				return false;
			}

			setContainerPreviousTarget(
				currentContainerId,
				direction,
				next,
				currentFocusedElement
			);

			return focusElement(next, nextContainerIds);
		}

		return false;
	}

	function onAcceleratedKeyDown (evt) {
		let currentFocusedElement = getCurrent();
		const direction = getDirection(evt.keyCode);

		if (!currentFocusedElement) {
			const lastContainerId = getLastContainer();
			if (lastContainerId) {
				currentFocusedElement = getContainerLastFocusedElement(lastContainerId);
			}
			if (!currentFocusedElement) {
				focusElement(getTargetByContainer(), getContainersForNode(currentFocusedElement));

				return preventDefault(evt);
			}
		}

		const currentContainerIds = getContainersForNode(currentFocusedElement);
		if (
			direction &&
			!spotNext(direction, currentFocusedElement, currentContainerIds) &&
			currentFocusedElement !== document.activeElement
		) {
			focusElement(currentFocusedElement, currentContainerIds);
		}
	}


	function onKeyUp (evt) {
		const keyCode = evt.keyCode;

		if (getDirection(keyCode) || isEnter(keyCode)) {
			SpotlightAccelerator.reset();
			_5WayKeyHold = false;
		}
	}

	function handlePointerHide () {
		const lastContainerId = getLastContainer();
		if (!getCurrent() && lastContainerId) {
			Spotlight.focus(getContainerLastFocusedElement(lastContainerId));
		}
	}

	function onKeyDown (evt) {
		if (shouldPreventNavigation()) {
			return;
		}

		const keyCode = evt.keyCode;
		const direction = getDirection(keyCode);
		const pointerHandled = notifyKeyDown(keyCode, handlePointerHide);

		if (pointerHandled || !(direction || isEnter(keyCode))) {
			return;
		}

		if (!_pause) {
			if (getCurrent()) {
				SpotlightAccelerator.processKey(evt, onAcceleratedKeyDown);
			} else if (!spotNextFromPoint(direction, getLastPointerPosition())) {
				Spotlight.focus(getContainerLastFocusedElement(getLastContainer()));
			}
			_5WayKeyHold = true;
		}

		if (direction) {
			preventDefault(evt);
		}
	}

	function onMouseMove ({target, clientX, clientY}) {
		if (shouldPreventNavigation()) return;

		const current = getCurrent();
		const update = notifyPointerMove(current, target, clientX, clientY);

		if (update) {
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

		if (getPointerMode()) {
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
		 * @public
		 */
		initialize: function (containerDefaults) {
			if (!_initialized) {
				window.addEventListener('keydown', onKeyDown);
				window.addEventListener('keyup', onKeyUp);
				window.addEventListener('mouseover', onMouseOver);
				window.addEventListener('mousemove', onMouseMove);
				setLastContainer(rootContainerId);
				configureDefaults(containerDefaults);
				configureContainer(rootContainerId);
				_initialized = true;
			}
		},

		/**
		 * Terminates Spotlight. This is generally handled by {@link spotlight.SpotlightRootDecorator}.
		 *
		 * @public
		 */
		terminate: function () {
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('keyup', onKeyUp);
			window.removeEventListener('mouseover', onMouseOver);
			window.removeEventListener('mousemove', onMouseMove);
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
		 * @param {String|Object} param1 Configuration object or container ID
		 * @param {Object|undefined} param2 Configuration object if container ID supplied in param1
		 * @returns {undefined}
		 * @public
		 */
		set: function (containerId, config) {
			configureContainer(containerId, config);
		},

		// add(<config>);
		// add(<containerId>, <config>);
		/**
		 * Adds the config for a new container. The container ID may be passed in the configuration
		 * object. If no container ID is supplied, a new container ID will be generated.
		 *
		 * @param {String|Object} param1 Configuration object or container ID
		 * @param {Object|undefined} param2 Configuration object if container ID supplied in param1
		 * @returns {String} The container ID of the container
		 * @public
		 */
		add: function (containerId, config) {
			return configureContainer(containerId, config);
		},

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
		 * @returns {undefined}
		 * @public
		 */
		pause: function () {
			_pause = true;
		},

		/**
		 * Resumes Spotlight
		 *
		 * @returns {undefined}
		 * @public
		 */
		resume: function () {
			_pause = false;
		},

		// focus()
		// focus(<containerId>)
		// focus(<extSelector>)
		/**
		 * Focuses the specified element selector or container ID or the default container. If
		 * Spotlight is in pointer mode, focus is not changed but `elem` will be set as the last
		 * focused element of its spotlight containers.
		 *
		 * @param {String|Object|undefined} elem Element selector or the container ID.
		 *	If not supplied, the default container will be focused.
		 * @returns {Boolean} `true` if focus successful, `false` if not.
		 * @public
		 */
		focus: function (elem) {
			let target = elem;

			if (!elem) {
				target = getTargetByContainer();
			} else if (typeof elem === 'string') {
				if (getContainerConfig(elem)) {
					target = getTargetByContainer(elem);
				} else {
					target = getTargetBySelector(elem);
				}
			}

			const nextContainerIds = getContainersForNode(target);
			const nextContainerId = last(nextContainerIds);
			if (isNavigable(target, nextContainerId)) {
				return focusElement(target, nextContainerIds);
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
		 * @param {String|undefined} containerId The container ID or a falsy value to clear default container
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
		getActiveContainer: getLastContainer,

		/**
		 * Sets the currently active container.
		 *
		 * @param {String} [containerId] The id of the currently active container. If this is not
		 *	provided, the root container is set as the currently active container.
		 * @public
		 */
		setActiveContainer: function (containerId) {
			setLastContainer(containerId || rootContainerId);
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

			return matchSelector('[data-container-muted="true"] .' + spottableClass, elem);
		},

		/**
		 * Determines whether Spotlight is currently paused.
		 *
		 * @returns {Boolean} `true` if Spotlight is currently paused.
		 * @public
		 */
		isPaused: function () {
			return _pause;
		},

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

			return matchSelector('.' + spottableClass, elem);
		},

		/**
		 * Returns the currently spotted control.
		 *
		 * @returns {Object} The control that currently has focus, if available
		 * @public
		 */
		getCurrent: function () {
			return getCurrent();
		},

		/**
		 * Returns a list of spottable elements wrapped by the supplied container.
		 *
		 * @param {String} [containerId] The id of the container used to determine the list of spottable elements
		 * @returns {NodeList} The spottable elements that are wrapped by the supplied container
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
