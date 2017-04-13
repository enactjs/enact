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
import {Job} from '@enact/core/util';
import difference from 'ramda/src/difference';
import last from 'ramda/src/last';

import Accelerator from '../Accelerator';
import {spottableClass} from '../Spottable';

import * as TEST from './container';
import {matchSelector, parseSelector} from './utils';

const isDown = is('down');
const isEnter = is('enter');
const isLeft = is('left');
const isRight = is('right');
const isUp = is('up');

/**
 * Translates keyCodes into 5-way direction descriptions (e.g. `'down'`)
 *
 * @function
 * @memberof spotlight.Spotlight
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
const isPointerEvent = (target) => ('x' in target && 'y' in target);
const isPointerShow = is('pointerShow');
const isPointerHide = is('pointerHide');

const SpotlightAccelerator = new Accelerator();

/**
 * Provides 5-way navigation and focus support
 *
 * @class Spotlight
 * @memberof spotlight
 * @public
 */
const Spotlight = (function () {
	'use strict';

	const _reverseDirections = {
		'left': 'right',
		'up': 'down',
		'right': 'left',
		'down': 'up'
	};

	/*
	/* private vars
	*/
	let _initialized = false;
	let _pause = false;
	let _defaultContainerId = '';
	let _lastContainerId = '';
	let _duringFocusChange = false;
	let _pointerX = null;
	let _pointerY = null;

	/*
	 * Whether a 5-way directional key is being held.
	 *
	 * @type {Boolean}
	 * @default false
	 */
	let _5WayKeyHold = false;

	/*
	 * Whether Spotlight is in pointer mode (as opposed to 5-way mode).
	 *
	 * @type {Boolean}
	 * @default true
	 */
	let _pointerMode = true;

	/*
	* protected methods
	*/
	function getRect (elem) {
		const cr = elem.getBoundingClientRect();
		const rect = {
			left: cr.left,
			top: cr.top,
			width: cr.width,
			height: cr.height
		};
		rect.element = elem;
		rect.right = rect.left + rect.width;
		rect.bottom = rect.top + rect.height;
		rect.center = {
			x: rect.left + Math.floor(rect.width / 2),
			y: rect.top + Math.floor(rect.height / 2)
		};
		rect.center.left = rect.center.right = rect.center.x;
		rect.center.top = rect.center.bottom = rect.center.y;
		return rect;
	}

	function getPointRect (position) {
		const {x, y} = position;
		return {
			left: x,
			top: y,
			width: 0,
			height: 0,
			right: x,
			bottom: y,
			center: {
				x,
				y,
				left: x,
				right: x,
				top: y,
				bottom: y
			}
		};
	}

	function partition (rects, targetRect, straightOverlapThreshold) {
		let groups = [[], [], [], [], [], [], [], [], []];

		for (let i = 0; i < rects.length; i++) {
			let rect = rects[i];
			let center = rect.center;
			let x, y, groupId;

			if (center.x < targetRect.left) {
				x = 0;
			} else if (center.x <= targetRect.right) {
				x = 1;
			} else {
				x = 2;
			}

			if (center.y < targetRect.top) {
				y = 0;
			} else if (center.y <= targetRect.bottom) {
				y = 1;
			} else {
				y = 2;
			}

			groupId = y * 3 + x;
			groups[groupId].push(rect);

			if ([0, 2, 6, 8].indexOf(groupId) !== -1) {
				let threshold = straightOverlapThreshold;

				if (rect.left <= targetRect.right - targetRect.width * threshold) {
					if (groupId === 2) {
						groups[1].push(rect);
					} else if (groupId === 8) {
						groups[7].push(rect);
					}
				}

				if (rect.right >= targetRect.left + targetRect.width * threshold) {
					if (groupId === 0) {
						groups[1].push(rect);
					} else if (groupId === 6) {
						groups[7].push(rect);
					}
				}

				if (rect.top <= targetRect.bottom - targetRect.height * threshold) {
					if (groupId === 6) {
						groups[3].push(rect);
					} else if (groupId === 8) {
						groups[5].push(rect);
					}
				}

				if (rect.bottom >= targetRect.top + targetRect.height * threshold) {
					if (groupId === 0) {
						groups[3].push(rect);
					} else if (groupId === 2) {
						groups[5].push(rect);
					}
				}
			}
		}

		return groups;
	}

	function generateDistancefunction (targetRect) {
		return {
			nearPlumbLineIsBetter: function (rect) {
				let d;
				if (rect.center.x < targetRect.center.x) {
					d = targetRect.center.x - rect.right;
				} else {
					d = rect.left - targetRect.center.x;
				}
				return d < 0 ? 0 : d;
			},
			nearHorizonIsBetter: function (rect) {
				let d;
				if (rect.center.y < targetRect.center.y) {
					d = targetRect.center.y - rect.bottom;
				} else {
					d = rect.top - targetRect.center.y;
				}
				return d < 0 ? 0 : d;
			},
			nearTargetLeftIsBetter: function (rect) {
				let d;
				if (rect.center.x < targetRect.center.x) {
					d = targetRect.left - rect.right;
				} else {
					d = rect.left - targetRect.left;
				}
				return d < 0 ? 0 : d;
			},
			nearTargetTopIsBetter: function (rect) {
				let d;
				if (rect.center.y < targetRect.center.y) {
					d = targetRect.top - rect.bottom;
				} else {
					d = rect.top - targetRect.top;
				}
				return d < 0 ? 0 : d;
			},
			topIsBetter: function (rect) {
				return rect.top;
			},
			bottomIsBetter: function (rect) {
				return -1 * rect.bottom;
			},
			leftIsBetter: function (rect) {
				return rect.left;
			},
			rightIsBetter: function (rect) {
				return -1 * rect.right;
			}
		};
	}

	function prioritize (priorities) {
		let destPriority = null;
		for (let i = 0; i < priorities.length; i++) {
			if (priorities[i].group.length) {
				destPriority = priorities[i];
				break;
			}
		}

		if (!destPriority) {
			return null;
		}

		const destDistance = destPriority.distance;

		destPriority.group.sort(function (a, b) {
			for (let i = 0; i < destDistance.length; i++) {
				const distance = destDistance[i];
				const delta = distance(a) - distance(b);
				if (delta) {
					return delta;
				}
			}
			return 0;
		});

		return destPriority.group;
	}

	function navigate (target, direction, candidates, config) {
		if (!target || !direction || !candidates || !candidates.length) {
			return null;
		}

		let rects = [];
		for (let i = 0; i < candidates.length; i++) {
			let rect = getRect(candidates[i]);
			if (rect) {
				rects.push(rect);
			}
		}
		if (!rects.length) {
			return null;
		}

		const targetRect = isPointerEvent(target) ? getPointRect(target) : getRect(target);
		if (!targetRect) {
			return null;
		}

		let distanceFunction = generateDistancefunction(targetRect);

		let groups = partition(
			rects,
			targetRect,
			config.straightOverlapThreshold
		);

		let internalGroups = partition(
			groups[4],
			targetRect.center,
			config.straightOverlapThreshold
		);

		let priorities;

		switch (direction) {
			case 'left':
				priorities = [
					{
						group: internalGroups[0].concat(internalGroups[3]).concat(internalGroups[6]),
						distance: [
							distanceFunction.nearPlumbLineIsBetter,
							distanceFunction.topIsBetter
						]
					},
					{
						group: groups[3],
						distance: [
							distanceFunction.nearPlumbLineIsBetter,
							distanceFunction.topIsBetter
						]
					},
					{
						group: groups[0].concat(groups[6]),
						distance: [
							distanceFunction.nearHorizonIsBetter,
							distanceFunction.rightIsBetter,
							distanceFunction.nearTargetTopIsBetter
						]
					}
				];
				break;
			case 'right':
				priorities = [
					{
						group: internalGroups[2].concat(internalGroups[5]).concat(internalGroups[8]),
						distance: [
							distanceFunction.nearPlumbLineIsBetter,
							distanceFunction.topIsBetter
						]
					},
					{
						group: groups[5],
						distance: [
							distanceFunction.nearPlumbLineIsBetter,
							distanceFunction.topIsBetter
						]
					},
					{
						group: groups[2].concat(groups[8]),
						distance: [
							distanceFunction.nearHorizonIsBetter,
							distanceFunction.leftIsBetter,
							distanceFunction.nearTargetTopIsBetter
						]
					}
				];
				break;
			case 'up':
				priorities = [
					{
						group: internalGroups[0].concat(internalGroups[1]).concat(internalGroups[2]),
						distance: [
							distanceFunction.nearHorizonIsBetter,
							distanceFunction.leftIsBetter
						]
					},
					{
						group: groups[1],
						distance: [
							distanceFunction.nearHorizonIsBetter,
							distanceFunction.leftIsBetter
						]
					},
					{
						group: groups[0].concat(groups[2]),
						distance: [
							distanceFunction.nearPlumbLineIsBetter,
							distanceFunction.bottomIsBetter,
							distanceFunction.nearTargetLeftIsBetter
						]
					}
				];
				break;
			case 'down':
				priorities = [
					{
						group: internalGroups[6].concat(internalGroups[7]).concat(internalGroups[8]),
						distance: [
							distanceFunction.nearHorizonIsBetter,
							distanceFunction.leftIsBetter
						]
					},
					{
						group: groups[7],
						distance: [
							distanceFunction.nearHorizonIsBetter,
							distanceFunction.leftIsBetter
						]
					},
					{
						group: groups[6].concat(groups[8]),
						distance: [
							distanceFunction.nearPlumbLineIsBetter,
							distanceFunction.topIsBetter,
							distanceFunction.nearTargetLeftIsBetter
						]
					}
				];
				break;
			default:
				return null;
		}

		if (config.straightOnly) {
			priorities.pop();
		}

		let destGroup = prioritize(priorities);
		if (!destGroup) {
			return null;
		}

		let dest = null;
		if (config.rememberSource &&
				config.previous &&
				config.previous.destination === target &&
				config.previous.reverse === direction) {
			for (let j = 0; j < destGroup.length; j++) {
				if (destGroup[j].element === config.previous.target) {
					dest = destGroup[j].element;
					break;
				}
			}
		}

		if (!dest) {
			dest = destGroup[0].element;
		}

		return dest;
	}

	function getCurrent () {
		let activeElement = document.activeElement;
		if (activeElement && activeElement !== document.body) {
			return activeElement;
		}
	}

	function exclude (elemList, excludedElem) {
		if (!Array.isArray(excludedElem)) {
			excludedElem = [excludedElem];
		}
		for (let i = 0, index; i < excludedElem.length; i++) {
			index = elemList.indexOf(excludedElem[i]);
			if (index >= 0) {
				elemList.splice(index, 1);
			}
		}
		return elemList;
	}

	function isNavigable (elem, containerId, verifyContainerSelector) {
		if (!elem || (elem.offsetWidth <= 0 && elem.offsetHeight <= 0)) {
			return false;
		}

		return TEST.isNavigable(elem, containerId, verifyContainerSelector);
	}

	function focusElement (elem, containerIds, fromPointer) {
		if (!elem) {
			return false;
		}

		if ((_pointerMode && !fromPointer)) {
			TEST.setContainerLastFocusedElement(elem, containerIds);
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
			containerIds = TEST.getContainersForNode(elem);
		}
		const containerId = last(containerIds);
		if (containerId) {
			TEST.setContainerLastFocusedElement(elem, containerIds);
			_lastContainerId = containerId;
		}
	}

	function focusExtendedSelector (selector) {
		if (selector.charAt(0) === '@') {
			if (selector.length === 1) {
				return focusContainer();
			} else {
				let containerId = selector.substr(1);
				return focusContainer(containerId);
			}
		} else {
			let next = parseSelector(selector)[0];
			if (next) {
				const nextContainerIds = TEST.getContainersForNode(next);
				if (isNavigable(next, last(nextContainerIds))) {
					return focusElement(next, nextContainerIds);
				}
			}
		}
		return false;
	}

	function focusContainer (containerId) {
		let range = [];
		let addRange = function (id) {
			const config = TEST.getContainerConfig(id);
			if (id && range.indexOf(id) < 0 &&
					config && !config.selectorDisabled) {
				range.push(id);
			}
		};

		if (containerId) {
			addRange(containerId);
		} else {
			addRange(_defaultContainerId);
			addRange(_lastContainerId);
			[...TEST.GETKEYS()].map(addRange);
		}

		for (let i = 0; i < range.length; i++) {
			let id = range[i];
			let next;

			if (TEST.getContainerConfig(id).enterTo === 'last-focused') {
				next = TEST.getContainerLastFocusedElement(id) ||
					TEST.getContainerDefaultElement(id) ||
					TEST.getSpottableDescendants(id)[0];
			} else {
				next = TEST.getContainerDefaultElement(id) ||
					TEST.getContainerLastFocusedElement(id) ||
					TEST.getSpottableDescendants(id)[0];
			}

			if (next) {
				return focusElement(next, range);
			}
		}

		return false;
	}

	function gotoLeaveFor (containerIds, direction) {
		for (let i = containerIds.length; i-- > 0;) {
			const config = TEST.getContainerConfig(containerIds[i]);

			if (config.leaveFor && typeof config.leaveFor[direction] !== 'undefined') {
				const next = config.leaveFor[direction];

				if (typeof next === 'string') {
					if (next === '') {
						return null;
					}
					return focusExtendedSelector(next);
				}

				const nextContainerIds = TEST.getContainersForNode(next);
				if (isNavigable(next, last(nextContainerIds))) {
					return focusElement(next, nextContainerIds);
				}
			}
		}
		return false;
	}

	function getNavigableElements () {
		let containerNavigableElements = {};
		let allNavigableElements = [];

		for (const id of TEST.GETKEYS()) {
			containerNavigableElements[id] = TEST.getSpottableDescendants(id);
			allNavigableElements = allNavigableElements.concat(containerNavigableElements[id]);
		}
		return {
			allNavigableElements: allNavigableElements.filter(n => !TEST.isContainer(n)),
			containerNavigableElements
		};
	}

	function focusNext (next, direction, currentContainerIds, currentFocusedElement) {
		const nextContainerIds = TEST.getContainersForNode(next);
		const nextContainerId = last(nextContainerIds);
		const currentContainerId = last(currentContainerIds);

		if (currentContainerId !== nextContainerId) {
			if (_5WayKeyHold) {
				return false;
			}

			if (nextContainerIds.indexOf(currentContainerId) < 0) {
				const result = gotoLeaveFor(difference(currentContainerIds, nextContainerIds), direction);

				if (result) {
					return true;
				} else if (result === null) {
					return false;
				}
			}

			let enterToElement;
			if (!isNavigable(currentFocusedElement, nextContainerId, true)) {
				switch (TEST.getContainerConfig(nextContainerId).enterTo) {
					case 'last-focused':
						enterToElement = TEST.getContainerLastFocusedElement(nextContainerId) || TEST.getContainerDefaultElement(nextContainerId);
						break;
					case 'default-element':
						enterToElement = TEST.getContainerDefaultElement(nextContainerId);
						break;
				}
			}
			if (enterToElement) {
				next = enterToElement;
			}
		}

		return focusElement(next, nextContainerIds);
	}

	function spotNextFromPoint (direction, position, containerId) {
		const config = TEST.getContainerConfig(containerId);
		const {allNavigableElements, containerNavigableElements} = getNavigableElements();
		let next;

		if (config.restrict === 'self-only' || config.restrict === 'self-first') {
			next = navigate(
				position,
				direction,
				containerNavigableElements[containerId],
				config
			);
		} else {
			next = navigate(
				position,
				direction,
				allNavigableElements,
				config
			);
		}

		if (next) {
			TEST.getContainerConfig(containerId).previous = {
				target: TEST.getContainerLastFocusedElement(_lastContainerId),
				destination: next,
				reverse: _reverseDirections[direction]
			};
			return focusNext(next, direction, TEST.getContainersForNode(next));
		}

		return false;
	}

	function spotNext (direction, currentFocusedElement, currentContainerIds) {
		const extSelector = currentFocusedElement.getAttribute('data-spot-' + direction);
		if (typeof extSelector === 'string') {
			if (extSelector === '' || !focusExtendedSelector(extSelector)) {
				return false;
			}
			return true;
		}

		const {allNavigableElements, containerNavigableElements} = getNavigableElements();
		const currentContainerId = last(currentContainerIds);
		const config = TEST.getContainerConfig(currentContainerId);
		let next;

		if (config.restrict === 'self-only' || config.restrict === 'self-first') {
			let currentContainerNavigableElements = containerNavigableElements[currentContainerId];

			next = navigate(
				currentFocusedElement,
				direction,
				exclude(currentContainerNavigableElements, currentFocusedElement),
				config
			);

			if (!next && config.restrict === 'self-first') {
				next = navigate(
					currentFocusedElement,
					direction,
					exclude(allNavigableElements, currentContainerNavigableElements),
					config
				);
			}
		} else {
			next = navigate(
				currentFocusedElement,
				direction,
				exclude(allNavigableElements, currentFocusedElement),
				config
			);
		}

		if (next) {
			TEST.getContainerConfig(currentContainerId).previous = {
				target: currentFocusedElement,
				destination: next,
				reverse: _reverseDirections[direction]
			};
			return focusNext(next, direction, currentContainerIds, currentFocusedElement);
		} else if (gotoLeaveFor(currentContainerIds, direction)) {
			return true;
		}

		return false;
	}

	// 30ms (_pointerHiddenToKeyTimeout) is semi-arbitrary, to account for the time it takes for the
	// following directional key event to fire, and to prevent momentary spotting of the last
	// focused item - needs to be a value large enough to account for the potentially-trailing
	// event, but not too large that another unrelated event can be fired inside the window
	const hidePointerJob = new Job(function () {
		_pointerMode = false;
		if (!getCurrent() && _lastContainerId) {
			Spotlight.focus(TEST.getContainerLastFocusedElement(_lastContainerId));
		}
	}, 30);

	function preventDefault (evt) {
		evt.preventDefault();
		evt.stopPropagation();
		return false;
	}

	function onAcceleratedKeyDown (evt) {
		let currentFocusedElement = getCurrent();
		const direction = getDirection(evt.keyCode);

		if (!currentFocusedElement) {
			if (_lastContainerId) {
				currentFocusedElement = TEST.getContainerLastFocusedElement(_lastContainerId);
			}
			if (!currentFocusedElement) {
				focusContainer();
				return preventDefault(evt);
			}
		}

		const currentContainerIds = TEST.getContainersForNode(currentFocusedElement);
		if (!currentContainerIds.length) {
			return;
		}

		if (direction && !spotNext(direction, currentFocusedElement, currentContainerIds) && currentFocusedElement !== document.activeElement) {
			focusElement(currentFocusedElement, currentContainerIds);
		}
	}

	function shouldPreventNavigation () {
		return (!TEST.GETKEYS().next() || _pause);
	}

	function onKeyUp (evt) {
		const keyCode = evt.keyCode;

		if (getDirection(keyCode) || isEnter(keyCode)) {
			SpotlightAccelerator.reset();
			_5WayKeyHold = false;
		}
	}

	function onKeyDown (evt) {
		if (shouldPreventNavigation()) {
			return;
		}

		const keyCode = evt.keyCode;
		const direction = getDirection(keyCode);

		if (!direction && !(
				isPointerHide(keyCode) ||
				isPointerShow(keyCode) ||
				isEnter(keyCode)
			)
		) {
			return;
		}

		if (isPointerHide(keyCode)) {
			hidePointerJob.start();
		} else if (isPointerShow(keyCode)) {
			_pointerMode = true;
		} else {
			_pointerMode = false;
			if (!_pause) {
				if (getCurrent()) {
					SpotlightAccelerator.processKey(evt, onAcceleratedKeyDown);
				} else if (!spotNextFromPoint(direction, {x: _pointerX, y: _pointerY}, _lastContainerId)) {
					Spotlight.focus(TEST.getContainerLastFocusedElement(_lastContainerId));
				}
				_5WayKeyHold = true;
			}
		}

		if (direction) {
			preventDefault(evt);
		}
	}

	function onMouseOver (evt) {
		// a motionless pointer over animated spottable dom (such as list scrolling via 5-way) still emits
		// an `onMouseOver` event even when `_pointerMode` is `false`, in which case we terminate early.
		if (!_pointerMode || shouldPreventNavigation()) {
			return;
		}

		const target = getNavigableTarget(evt.target); // account for child controls

		if (target && target !== getCurrent()) { // moving over a focusable element
			focusElement(target, TEST.getContainersForNode(target), true);
			preventDefault(evt);
		}
	}

	function onMouseMove (evt) {
		const pointerMode = _pointerMode;

		// Chrome emits mousemove on scroll, but client coordinates do not change.
		if (!pointerMode && (evt.clientX === _pointerX) && (evt.clientY === _pointerY)) {
			return;
		}

		_pointerMode = true;

		// cache last-known pointer coordinates
		_pointerX = evt.clientX;
		_pointerY = evt.clientY;

		if (shouldPreventNavigation()) {
			return;
		}

		const current = getCurrent();
		const currentContainsTarget = current ? current.contains(evt.target) : false;

		// calling `getNavigableTarget()` is a heavy operation during `mousemove`, so we specifically guard
		// against unnecessarily executing it
		if (pointerMode && current && !currentContainsTarget) {
			// we are moving over a non-focusable element, so we force a blur to occur
			current.blur();
		} else if (!pointerMode && !(current && currentContainsTarget)) {
			const target = getNavigableTarget(evt.target);

			if (!target && current) {
				// we are moving over a non-focusable element, so we force a blur to occur
				current.blur();
			} else if (target && (!current || target !== current)) {
				// we are moving over a focusable element, so we set focus to the target
				focusElement(target, TEST.getContainersForNode(target), true);
			}
		}
	}

	function getNavigableTarget (target) {
		let parent;
		while (target && !isFocusable(target)) {
			parent = target.parentNode;
			target = parent === document ? null : parent; // calling isNavigable on document is problematic
		}
		return target;
	}

	function isFocusable (elem) {
		for (const id of TEST.GETKEYS()) { // check *all* the containers to see if the specified element is a focusable element
			if (isNavigable(elem, id, true)) return true;
		}
		return false;
	}

	/*
	 * public methods
	 */
	const exports = /** @lends spotlight.Spotlight.prototype */ { // eslint-disable-line no-shadow
		/**
		 * Initializes Spotlight. This is generally handled by
		 * {@link spotlight/SpotlightRootDecorator.SpotlightRootDecorator}.
		 *
		 * @memberof spotlight.Spotlight.prototype
		 * @public
		 */
		initialize: function (containerDefaults) {
			if (!_initialized) {
				window.addEventListener('keydown', onKeyDown);
				window.addEventListener('keyup', onKeyUp);
				window.addEventListener('mouseover', onMouseOver);
				window.addEventListener('mousemove', onMouseMove);
				_lastContainerId = TEST.rootContainerId;
				TEST.configureDefaults(containerDefaults);
				TEST.configureContainer(TEST.rootContainerId);
				_initialized = true;
			}
		},

		/**
		 * Terminates Spotlight. This is generally handled by {@link spotlight.SpotlightRootDecorator}.
		 *
		 * @memberof spotlight.Spotlight.prototype
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
		 * @memberof spotlight.Spotlight.prototype
		 * @private
		 */
		clear: function () {
			// _containers.clear();
			_defaultContainerId = '';
			_lastContainerId = '';
			_duringFocusChange = false;
		},

		// set(<config>);
		// set(<containerId>, <config>);
		/**
		 * Sets the config for spotlight or the specified containerID
		 *
		 * @memberof spotlight.Spotlight.prototype
		 * @param {String|Object} param1 Configuration object or container ID
		 * @param {Object|undefined} param2 Configuration object if container ID supplied in param1
		 * @returns {undefined}
		 * @public
		 */
		set: function (containerId, config) {
			TEST.configureContainer(containerId, config);
		},

		// add(<config>);
		// add(<containerId>, <config>);
		/**
		 * Adds the config for a new container. The container ID may be passed in the configuration
		 * object. If no container ID is supplied, a new container ID will be generated.
		 *
		 * @memberof spotlight.Spotlight.prototype
		 * @param {String|Object} param1 Configuration object or container ID
		 * @param {Object|undefined} param2 Configuration object if container ID supplied in param1
		 * @returns {String} The container ID of the container
		 * @public
		 */
		add: function (containerId, config) {
			return TEST.configureContainer(containerId, config);
		},

		unmount: function (containerId) {
			if (!containerId || typeof containerId !== 'string') {
				throw new Error('Please assign the "containerId"!');
			}
			const cfg = TEST.getContainerConfig(containerId);
			if (cfg) {
				const {lastFocusedElement} = cfg;
				if (lastFocusedElement) {
					const spottableChildren = TEST.getSpottableDescendants(containerId);
					const lastFocusedIndex = [].slice.call(spottableChildren).indexOf(lastFocusedElement);

					// store last index and release node reference to lastFocusedElement
					cfg.lastFocusedIndex = lastFocusedIndex;
					cfg.lastFocusedElement = null;
				}
			}
		},

		/**
		 * Removes a container from Spotlight
		 *
		 * @memberof spotlight.Spotlight.prototype
		 * @param {String} containerId Container ID to remove
		 * @returns {Boolean} `true` if container removed, `false` if container does not exist
		 * @public
		 */
		remove: function (containerId) {
			if (!containerId || typeof containerId !== 'string') {
				throw new Error('Please assign the "containerId"!');
			}
			if (TEST.getContainerConfig(containerId)) {
				TEST.removeContainer(containerId);
				if (_lastContainerId === containerId) {
					Spotlight.setActiveContainer(null);
				}
				return true;
			}
			return false;
		},

		/**
		 * Disables the selector rules of the specified container
		 *
		 * @memberof spotlight.Spotlight.prototype
		 * @param {String} containerId Container ID selector rules to disable
		 * @returns {Boolean} `true` if container's selector rules are disabled, `false` if container does not exist
		 * @public
		 */
		disableSelector: function (containerId) {
			if (TEST.isContainer(containerId)) {
				TEST.configureContainer(containerId, {selectorDisabled: false});
				return true;
			}

			return false;
		},

		/**
		 * Enables the selector rules of the specified container
		 *
		 * @memberof spotlight.Spotlight.prototype
		 * @param {String} containerId Container ID selector rules to enable
		 * @returns {Boolean} `true` if container's selector rules are enabled, `false` if container does not exist
		 * @public
		 */
		enableSelector: function (containerId) {
			if (TEST.isContainer(containerId)) {
				TEST.configureContainer(containerId, {selectorDisabled: false});
				return true;
			}

			return false;
		},

		/**
		 * Pauses Spotlight
		 *
		 * @memberof spotlight.Spotlight.prototype
		 * @returns {undefined}
		 * @public
		 */
		pause: function () {
			_pause = true;
		},

		/**
		 * Resumes Spotlight
		 *
		 * @memberof spotlight.Spotlight.prototype
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
		 * Focuses the specified element selector or container ID or the default container. Has no
		 * effect if Spotlight is paused.
		 *
		 * @memberof spotlight.Spotlight.prototype
		 * @param {String|Object|undefined} elem Element selector or the container ID.
		 *	If not supplied, the default container will be focused.
		 * @returns {Boolean} `true` if focus successful, `false` if not.
		 * @public
		 */
		focus: function (elem) {
			let result = false;

			if (!elem) {
				result = focusContainer();
			} else if (typeof elem === 'string') {
				if (TEST.getContainerConfig(elem)) {
					result = focusContainer(elem);
				} else {
					result = focusExtendedSelector(elem);
				}
			} else {
				const nextContainerIds = TEST.getContainersForNode(elem);
				const nextContainerId = last(nextContainerIds);
				if (isNavigable(elem, nextContainerId)) {
					result = focusElement(elem, nextContainerIds);
				}
			}

			return result;
		},

		// move(<direction>)
		// move(<direction>, <selector>)
		/**
		 * Moves focus to the next spottable control in the direction specified. Optionally, a source
		 * element selector may be supplied as the starting point.
		 *
		 * @memberof spotlight.Spotlight.prototype
		 * @param {String} direction Direction to move, one of `'left'`, `'right'`, `'up'` or `'down'`
		 * @param {String|undefined} selector If supplied, the element to move from. If not supplied,
		 *	the currently focused item will be used.
		 * @returns {Boolean} `true` if focus successful, `false` if not.
		 * @public
		 */
		move: function (direction, selector) {
			direction = direction.toLowerCase();
			if (!_reverseDirections[direction]) {
				return false;
			}

			const elem = selector ? parseSelector(selector)[0] : getCurrent();
			if (!elem) {
				return false;
			}

			const containerIds = TEST.getContainersForNode(elem);
			if (!containerIds.length) {
				return false;
			}

			return spotNext(direction, elem, containerIds);
		},

		/**
		 * Sets or clears the default container that will receive focus.
		 *
		 * @memberof spotlight.Spotlight.prototype
		 * @param {String|undefined} containerId The container ID or a falsy value to clear default container
		 * @returns {undefined}
		 * @public
		 */
		setDefaultContainer: function (containerId) {
			if (!containerId) {
				_defaultContainerId = '';
			} else if (!TEST.getContainerConfig(containerId)) {
				throw new Error('Container "' + containerId + '" doesn\'t exist!');
			} else {
				_defaultContainerId = containerId;
			}
		},

		/**
		 * Sets the currently active container.
		 *
		 * @memberof spotlight.Spotlight.prototype
		 * @param {String} [containerId] The id of the currently active container. If this is not
		 *	provided, the root container is set as the currently active container.
		 * @public
		 */
		setActiveContainer: function (containerId) {
			_lastContainerId = containerId || TEST.rootContainerId;
		},

		/**
		 * Gets the current pointer mode
		 *
		 * @memberof spotlight.Spotlight.prototype
		 * @returns {Boolean} `true` if spotlight is in pointer mode
		 * @public
		 */
		getPointerMode: function () {
			return _pointerMode;
		},

		/**
		 * Sets the current pointer mode
		 *
		 * @memberof spotlight.Spotlight.prototype
		 * @param {Boolean} pointerMode The value of the pointer mode. This determines how
		 *	spotlight manages focus change behaviors.
		 * @public
		 */
		setPointerMode: function (pointerMode) {
			_pointerMode = pointerMode;
		},

		/**
		 * Gets the muted mode value of a spottable element.
		 *
		 * @memberof spotlight.Spotlight.prototype
		 * @param {Object} elem The dom element used to determine the muted status.
		 * @returns {Boolean} `true` if the passed-in control is in muted mode.
		 * @public
		 */
		isMuted: function (elem) {
			if (!elem) {
				return false;
			}

			return matchSelector(elem, '[data-container-muted="true"] .' + spottableClass);
		},

		/**
		 * Determines whether Spotlight is currently paused.
		 *
		 * @memberof spotlight.Spotlight.prototype
		 * @returns {Boolean} `true` if Spotlight is currently paused.
		 * @public
		 */
		isPaused: function () {
			return _pause;
		},

		/**
		 * Determines whether an element is spottable.
		 *
		 * @memberof spotlight.Spotlight.prototype
		 * @param {Object} elem The dom element used to determine the spottable status.
		 * @returns {Boolean} `true` if the element being evaluated is currently spottable.
		 * @public
		 */
		isSpottable: function (elem) {
			if (!elem) {
				return false;
			}

			return matchSelector(elem, '.' + spottableClass);
		},

		/**
		 * Returns the currently spotted control.
		 *
		 * @memberof spotlight.Spotlight.prototype
		 * @returns {Object} The control that currently has focus, if available
		 * @public
		 */
		getCurrent: function () {
			return getCurrent();
		}
	};

	return exports;

})();

export default Spotlight;
export {
	getDirection,
	Spotlight
};
