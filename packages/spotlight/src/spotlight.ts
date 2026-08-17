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
 * @exports default Spotlight
 * @exports getDirection
 */

import {is} from '@enact/core/keymap';
import {isWindowReady} from '@enact/core/snapshot';
import platform from '@enact/core/platform';
import last from 'ramda/src/last';

import Accelerator from '../Accelerator';
import {spottableClass} from '../Spottable';
import {getPausedInstance, isPaused, pause, resume} from '../Pause';

import {getInputType} from './inputType';
import {contains} from './utils';

import {
	addContainer,
	configureContainer,
	configureDefaults,
	getAllContainerIds,
	getContainerConfig,
	getContainerConfigOrThrow,
	getContainerId,
	getContainerLastFocusedElement,
	getContainerNode,
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
	getNearestTargetFromPosition,
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

import type {ContainerTarget} from '../types/ContainerTarget';
import type {Direction} from '../types/Direction';
import type {FocusOptions} from '../types/FocusOptions';
import type {Position} from '../types/Position';
import type {SpotlightApi} from '../types/SpotlightApi';

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
const getDirection = function (keyCode: number): Direction | false {
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
const Spotlight = (function (): SpotlightApi {
	'use strict';

	/*
	/* private vars
	*/
	let _initialized = false;
	let _duringFocusChange = false;
	let _focusRingElement: HTMLElement | null = null;

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

	function preventDefault (evt: Event): false {
		evt.preventDefault();
		evt.stopPropagation();
		return false;
	}

	function shouldPreventNavigation (): boolean {
		return isPaused() || getAllContainerIds().length === 0;
	}

	function getCurrent (): HTMLElement | undefined {
		if (!isWindowReady()) return;

		let activeElement = document.activeElement;
		if (activeElement && activeElement !== document.body) {
			return activeElement as HTMLElement;
		}
	}

	// An extension point for updating pointer mode based on the current platform.
	// Currently only webOS
	function setPlatformPointerMode (): void {
		const webOSSystem = window.webOSSystem ?? window.PalmSystem;
		if (webOSSystem && webOSSystem.cursor) {
			setPointerMode(webOSSystem.cursor.visibility as boolean);
		}
	}

	function focusElement (elem: HTMLElement | null | undefined, containerIds: string[], fromPointer?: boolean, preventScroll?: boolean): boolean {
		if (!elem) {
			return false;
		}

		const webOSSystem = window.webOSSystem ?? window.PalmSystem;
		if ((getPointerMode() && !fromPointer) && (getInputType() === 'touch' || (typeof window !== 'undefined' && (!webOSSystem || webOSSystem.cursor?.visibility)))) {
			setContainerLastFocusedElement(elem, containerIds);
			return false;
		}

		let currentFocusedElement = getCurrent();

		if (elem === currentFocusedElement) {
			return true;
		}

		const focusOptions = preventScroll || isWithinOverflowContainer(elem, containerIds) ? {preventScroll: true} : void 0;

		let silentFocus = function (): void {
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

		/* istanbul ignore next */
		if (_focusRingElement) {
			const elemRect = elem.getBoundingClientRect();

			_focusRingElement.style.left = `${elemRect.x + window.scrollX}px`;
			_focusRingElement.style.top = `${elemRect.y + window.scrollY}px`;
			_focusRingElement.style.width = `${elemRect.width}px`;
			_focusRingElement.style.height = `${elemRect.height}px`;
		}

		_duringFocusChange = false;

		focusChanged(elem, containerIds);
		return true;
	}

	function focusChanged (elem: Element, containerIds?: string[]): void {
		if (!containerIds || !containerIds.length) {
			containerIds = getContainersForNode(elem);
		}
		const containerId = last(containerIds);
		if (containerId) {
			setContainerLastFocusedElement(elem, containerIds);
			setLastContainer(containerId);
		}

		if (__DEV__) {
			assignFocusPreview(elem);
		}
	}

	function restoreFocus (): boolean {
		const lastContainerId = getLastContainer();
		let next: ContainerTarget[];

		if (lastContainerId) {
			const position = getLastPointerPosition();

			// walk up the chain of containers from the last to attempt to find a target
			next = getContainersForNode(getContainerNode(lastContainerId)).reverse();

			// only prepend last focused if it exists so that Spotlight.focus() doesn't receive
			// a falsy target
			let lastFocusedElement: ContainerTarget | null | undefined | false = getContainerLastFocusedElement(lastContainerId);

			while (isContainer(lastFocusedElement)) {
				({lastFocusedElement} = getContainerConfigOrThrow(lastFocusedElement as string));
			}

			const lastContainerNode = getContainerNode(lastContainerId);
			const lastFocusedNode = lastFocusedElement as Element | null | undefined;

			if (!lastFocusedNode || (
				typeof (lastContainerNode as Element | null)?.getBoundingClientRect === 'function' &&
				typeof lastFocusedNode.getBoundingClientRect === 'function' &&
				!contains(
					(lastContainerNode as Element).getBoundingClientRect(),
					lastFocusedNode.getBoundingClientRect()
				)
			)) {
				lastFocusedElement = getContainerConfig(lastContainerId)?.overflow && getNearestTargetFromPosition(position as Position, lastContainerId);
			}

			if (lastFocusedElement) {
				next.unshift(lastFocusedElement);
			}
		} else {
			next = [rootContainerId];
		}

		// attempt to find a target starting with the last focused element in the last
		// container, followed by the last container, and finally the root container
		return next.reduce((focused: boolean, target) => focused || Spotlight.focus(target), false);
	}

	// The below should be gated on non-production environment only.
	function assignFocusPreview (elem: Element): void {
		const directions: Direction[] = ['up', 'right', 'down', 'left'],
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
			const nextElem = getTargetByDirectionFromElement(dir, elem) as Element | null;
			if (nextElem) {
				nextElem.classList.add(nextClassBase + dir);
			}
		});
	}

	function spotNextFromPoint (direction: Direction, position: Position): boolean {
		const containerId = Spotlight.getActiveContainer();
		const next = getTargetByDirectionFromPosition(direction, position, containerId);

		if (next) {
			setContainerPreviousTarget(
				containerId,
				direction,
				next,
				getContainerLastFocusedElement(containerId) as ContainerTarget
			);

			return focusElement(next as HTMLElement, getContainersForNode(next));
		}

		return false;
	}

	function spotNext (direction: Direction, currentFocusedElement: HTMLElement | null | undefined, currentContainerIds: string[]): boolean {
		const next = getTargetByDirectionFromElement(direction, currentFocusedElement as Element);

		if (next) {
			const currentContainerId = last(currentContainerIds) as string;
			const nextContainerIds = getContainersForNode(next as Element);

			// prevent focus if 5-way is being held and the next element isn't wrapped by
			// the current element's immediate container
			if (_5WayKeyHold && nextContainerIds.indexOf(currentContainerId) < 0 && !isContainer5WayHoldable(currentContainerId)) {
				return false;
			}

			notifyLeaveContainer(
				direction,
				currentFocusedElement,
				currentContainerIds,
				next as Element,
				nextContainerIds
			);

			setContainerPreviousTarget(
				currentContainerId,
				direction,
				next,
				currentFocusedElement as ContainerTarget
			);

			const focused = focusElement(next as HTMLElement, nextContainerIds);

			notifyEnterContainer(
				direction,
				currentFocusedElement,
				currentContainerIds,
				next as Element,
				nextContainerIds
			);

			return focused;
		}

		notifyLeaveContainerFail(direction, currentFocusedElement, currentContainerIds);

		return false;
	}

	function onAcceleratedKeyDown (evt: KeyboardEvent): void {
		const direction = getDirection(evt.keyCode);

		if (!direction) return;

		const currentFocusedElement = getCurrent();
		const currentContainerIds = getContainersForNode(currentFocusedElement);

		spotNext(direction, currentFocusedElement, currentContainerIds);
	}

	function onBlur (): void {
		const current = getCurrent();

		if (current) {
			current.blur();
		}
		Spotlight.setPointerMode(false);
		_spotOnWindowFocus = true;
		_pointerMoveDuringKeyPress = false;
	}

	interface WebOSMouseEvent extends Event {
		detail?: {type?: string};
	}

	function handleWebOSMouseEvent (ev: WebOSMouseEvent): void {
		if (!isPaused() && ev && ev.detail && ev.detail.type === 'Leave') {
			onBlur();
		}
	}

	interface KeyboardStateChangeEvent extends Event {
		visibility?: boolean;
	}

	function handleKeyboardStateChangeEvent ({visibility}: KeyboardStateChangeEvent): void {
		if (!visibility) {
			setPlatformPointerMode();
		}
	}

	function onFocus (): void {
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
				({lastFocusedElement} = getContainerConfigOrThrow(lastFocusedElement as string));
			}

			if (!Spotlight.focus(lastFocusedElement)) {
				// If the last focused element was previously also disabled (or no longer exists), we
				// need to set focus somewhere
				Spotlight.focus();
			}
			_spotOnWindowFocus = false;
		}
	}

	function onKeyUp (evt: KeyboardEvent): void {
		_pointerMoveDuringKeyPress = false;
		const keyCode = evt.keyCode;

		if (getDirection(keyCode) || isEnter(keyCode)) {
			SpotlightAccelerator.reset();
			_5WayKeyHold = false;
		}
	}

	function handlePointerHide (): void {
		if (!getCurrent()) {
			restoreFocus();
		}
	}

	function onKeyDown (evt: KeyboardEvent): void {
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
			} else if (!spotNextFromPoint(direction as Direction, getLastPointerPosition() as Position)) {
				restoreFocus();
			}
			_5WayKeyHold = true;
		}

		if (direction) {
			preventDefault(evt);
		}
	}

	function onMouseMove ({target, clientX, clientY}: MouseEvent): boolean | undefined {
		if (shouldPreventNavigation()) {
			notifyPointerMove(null, target as Node | null, clientX, clientY);
			return;
		}

		const current = getCurrent();
		const update = notifyPointerMove(current, target as Node | null, clientX, clientY);

		if (update) {
			if (_5WayKeyHold) {
				_pointerMoveDuringKeyPress = true;
			}

			const next = getNavigableTarget(target as Element | null);

			// TODO: Consider encapsulating this work within focusElement
			if (next !== current) {
				if (next) {
					focusElement(next as HTMLElement, getContainersForNode(next), true);

					return true;
				} else if (current) {
					current.blur();
					setLastContainerFromTarget(current, target as Element | null);
				}
			}
		}
	}

	function onMouseOver (evt: MouseEvent): boolean | undefined {
		if (shouldPreventNavigation()) return;

		const {target} = evt;

		if (getPointerMode() && hasPointerMoved(evt.clientX, evt.clientY)) {
			const next = getNavigableTarget(target as Element | null); // account for child controls

			if (next && next !== getCurrent()) {
				focusElement(next as HTMLElement, getContainersForNode(next), true);

				return true;
			}

			preventDefault(evt);
		}
	}

	function onTouchEnd (evt: TouchEvent): void {
		const current = getCurrent();
		if (current && !current.contains(evt.target as Node | null)) {
			current.blur();
		}
	}

	/*
	 * public methods
	 */
	const exports: SpotlightApi = /** @lends spotlight.Spotlight */ { // eslint-disable-line no-shadow
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

				if (platform.touchEvent) {
					window.addEventListener('touchend', onTouchEnd);
				}

				if (platform.type === 'webos') {
					window.top!.document.addEventListener('webOSMouse', handleWebOSMouseEvent);
					window.top!.document.addEventListener('keyboardStateChange', handleKeyboardStateChangeEvent);
				}

				setLastContainer(rootContainerId);
				configureDefaults(containerDefaults);
				configureContainer(rootContainerId);
				// by default, pointer mode is off but the platform's current state will override that
				setPointerMode(false);
				setPlatformPointerMode();

				/* istanbul ignore next */
				if (getContainerConfig('spotlightRootDecorator')?.isStandardFocusableMode) {
					_focusRingElement = document.querySelector('#spotlightFocusRing') as HTMLElement | null;
				}

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

			if (platform.touchEvent) {
				window.removeEventListener('touchend', onTouchEnd);
			}

			if (platform.type === 'webos') {
				window.top!.document.removeEventListener('webOSMouse', handleWebOSMouseEvent);
				window.top!.document.removeEventListener('keyboardStateChange', handleKeyboardStateChangeEvent);
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
				configureContainer(containerId, {selectorDisabled: true});
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
		 * @param {String|Node} [elem] The spotlight ID or selector for either a spottable
		 *  component or a spotlight container, or spottable node. If not supplied, the default
		 *  container will be focused.
		 * @param {Object} [options] The object including `enterTo`, `toOuterContainer`, and `preventScroll`.
		 *  `enterTo` and `toOuterContainer` work when the first parameter `elem` is either
		 *  a spotlight container ID or a spotlight container node.
		 * @param {('last-focused'|'default-element'|'topmost')} [options.enterTo] Specifies preferred
		 *  `enterTo` configuration.
		 * @param {Boolean} [options.toOuterContainer] If the proper target is not found, search one
		 *  recursively to outer container.
		 * @param {Boolean} [options.preventScroll] Prevents the focused element from an automatic scrolling
		 *  into view after focusing the element.
		 * @returns {Boolean} `true` if focus successful, `false` if not.
		 * @public
		 */
		focus: function (elem, options: FocusOptions = {}) {
			let target: ContainerTarget | null | undefined = elem;
			let wasContainerId = false;
			let currentContainerNode: Document | Element | null = null;

			if (!elem) {
				target = getTargetByContainer();
			} else if (typeof elem === 'string') {
				if (getContainerConfig(elem)) {
					target = getTargetByContainer(elem, options.enterTo ?? void 0);
					wasContainerId = true;
					currentContainerNode = getContainerNode(elem);
				} else if (/^[\w\d-]+$/.test(elem)) {
					// support component IDs consisting of alphanumeric, dash, or underscore
					target = getTargetBySelector(`[data-spotlight-id=${elem}]`);
				} else {
					target = getTargetBySelector(elem);
				}
			} else if (isContainer(elem)) {
				target = getTargetByContainer(getContainerId(elem), options.enterTo ?? void 0);
				currentContainerNode = elem;
			}

			const nextContainerIds = getContainersForNode(target as Element | null);
			const nextContainerId = last(nextContainerIds) as string;
			if (isNavigable(target as Element | null, nextContainerId, true)) {
				const focused = focusElement(target as HTMLElement | null, nextContainerIds, false, options.preventScroll);

				if (!focused && wasContainerId) {
					setLastContainer(elem as string);
				}

				return focused;
			} else if (wasContainerId) {
				// if we failed to find a spottable target within the provided container, we'll set
				// it as the active container to allow it to focus itself if its contents change
				setLastContainer(elem as string);
			}

			if (options.toOuterContainer && currentContainerNode) {
				const outerContainer = getContainersForNode((currentContainerNode as Element).parentElement).pop();

				if (outerContainer) {
					return this.focus(outerContainer, options);
				}
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

			return spotNext(direction as Direction, elem as HTMLElement, containerIds);
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
			if (mayActivateContainer(containerId as string)) {
				setLastContainer(containerId || rootContainerId);
			}
		},

		/**
		 * Get the name of the instance.
		 *
		 * @function
		 * @returns {String} the name of the instance.
		 * @public
		 */
		getPausedInstance,

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
		},

		/**
		 * Focuses the next spottable control from the position specified in the direction specified.
		 *
		 * @param {String} direction Direction to move, one of `'left'`, `'right'`, `'up'`, or `'down'`
		 * @param {Object} position `x` and `y` coordinates for the pointer
		 * @private
		 */
		focusNextFromPoint: spotNextFromPoint,

		/**
		 * Resets spotlight accelerator and 5way key hold value
		 *
		 * @private
		 */
		resetKeyHoldState: function () {
			SpotlightAccelerator.reset();
			_5WayKeyHold = false;
		}
	};

	return exports;

})();

export default Spotlight;
export {
	getDirection,
	Spotlight
};
