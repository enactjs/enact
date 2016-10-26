/* eslint-disable */

/*
 * A javascript-based implementation of Spatial Navigation.
 *
 * Copyright (c) 2016 Luke Chang.
 * https://github.com/luke-chang/js-spatial-navigation
 *
 * Licensed under the MPL license.
 */

import R from 'ramda';
import Accelerator from '@enact/core/Accelerator';

const spotlightRootContainerName = 'spotlightRootDecorator';
const SpotlightAccelerator = new Accelerator();
const Spotlight = (function() {
	'use strict';

	/**
	/* config
	*/
	// Note: an <extSelector> can be one of following types:
	// - a valid selector string for "querySelectorAll"
	// - a NodeList or an array containing DOM elements
	// - a single DOM element
	// - a string "@<containerId>" to indicate the specified container
	// - a string "@" to indicate the default container
	const GlobalConfig = {
		selector: '',           // can be a valid <extSelector> except "@" syntax.
		straightOnly: false,
		straightOverlapThreshold: 0.5,
		rememberSource: false,
		selectorDisabled: false,
		defaultElement: '',     // <extSelector> except "@" syntax.
		enterTo: '',            // '', 'last-focused', 'default-element'
		leaveFor: null,         // {left: <extSelector>, right: <extSelector>, up: <extSelector>, down: <extSelector>}
		restrict: 'self-first', // 'self-first', 'self-only', 'none'
		tabIndexIgnoreList: 'a, input, select, textarea, button, iframe, [contentEditable=true]',
		navigableFilter: null
	};

	/**
	* constants
	*/
	const _directions = {
		'37': 'left',
		'38': 'up',
		'39': 'right',
		'40': 'down'
	};

	const _reverseDirections = {
		'left': 'right',
		'up': 'down',
		'right': 'left',
		'down': 'up'
	};

	const _enterKeyCodes = [13, 16777221];

	/**
	 * The key code of the pointer show event.
	 *
	 * @type {Number}
	 * @default 1536
	 */
	const _pointerShowKeyCode = 1536;

	/**
	 * The key code of the pointer hide event.
	 *
	 * @type {Number}
	 * @default 1537
	 */
	const _pointerHideKeyCode = 1537;

	const _containerPrefix = 'container-';

	/**
	/* private vars
	*/
	let _ids = 0;
	let _initialized = false;
	let _pause = false;
	let _containers = {};
	let _containerCount = 0;
	let _defaultContainerId = '';
	let _lastContainerId = '';
	let _duringFocusChange = false;

	/**
	 * Whether Spotlight is in pointer mode (as opposed to 5-way mode).
	 *
	 * @type {Boolean}
	 * @default true
	 */
	let _pointerMode = true;

	/**
	 * Timestamp at the last point the pointer was hidden.
	 *
	 * @type {Number}
	 * @default 0
	 */
	let _pointerHiddenTime = 0;

	/**
	 * Length of time in milliseconds required after hiding pointer before 5-way keys
	 * are processed.
	 *
	 * @type {Number}
	 * @default 300
	 */
	let _pointerHiddenToKeyTimeout = 300;

	/*
	* polyfills
	*/
	let elementMatchesSelector = function (selector) {
		const matchedNodes = (this.parentNode || this.document).querySelectorAll(selector);
		return [].slice.call(matchedNodes).indexOf(this) >= 0;
	};
	if (typeof window === 'object') {
		elementMatchesSelector = window.Element.prototype.matches
			|| window.Element.prototype.matchesSelector
			|| window.Element.prototype.mozMatchesSelector
			|| window.Element.prototype.webkitMatchesSelector
			|| window.Element.prototype.msMatchesSelector
			|| window.Element.prototype.oMatchesSelector
			|| elementMatchesSelector;
	}

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

		let targetRect = getRect(target);
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
		if (config.rememberSource
				&& config.previous
				&& config.previous.destination === target
				&& config.previous.reverse === direction) {
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

	function generateId () {
		let id;
		/* eslint no-constant-condition: ["error", { "checkLoops": false }]*/
		while (true) {
			id = _containerPrefix + String(++_ids);
			if (!_containers[id]) {
				break;
			}
		}
		return id;
	}

	function parseSelector (selector) {
		let result;
		if (typeof selector === 'string') {
			result = [].slice.call(document.querySelectorAll(selector));
		} else if (typeof selector === 'object' && selector.length) {
			result = [].slice.call(selector);
		} else if (typeof selector === 'object' && selector.nodeType === 1) {
			result = [selector];
		} else {
			result = [];
		}
		return result;
	}

	function matchSelector (elem, selector) {
		if (typeof selector === 'string') {
			return elementMatchesSelector.call(elem, selector);
		} else if (typeof selector === 'object' && selector.length) {
			return selector.indexOf(elem) >= 0;
		} else if (typeof selector === 'object' && selector.nodeType === 1) {
			return elem === selector;
		}
		return false;
	}

	function getCurrent () {
		let activeElement = document.activeElement;
		if (activeElement && activeElement !== document.body) {
			return activeElement;
		}
	}

	function extend (out) {
		out = out || {};
		for (let i = 1; i < arguments.length; i++) {
			if (!arguments[i]) {
				continue;
			}
			for (let key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key) && typeof arguments[i][key] !== 'undefined') {
					out[key] = arguments[i][key];
				}
			}
		}
		return out;
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
		if (!elem || !containerId || !_containers[containerId] || _containers[containerId].selectorDisabled) {
			return false;
		}
		if ((elem.offsetWidth <= 0 && elem.offsetHeight <= 0)) {
			return false;
		}
		if (verifyContainerSelector && !matchSelector(elem, _containers[containerId].selector)) {
			return false;
		}
		if (typeof _containers[containerId].navigableFilter === 'function') {
			if (_containers[containerId].navigableFilter(elem, containerId) === false) {
				return false;
			}
		} else if (typeof GlobalConfig.navigableFilter === 'function') {
			if (GlobalConfig.navigableFilter(elem, containerId) === false) {
				return false;
			}
		}
		return true;
	}

	function getContainerId (elem) {
		for (let id in _containers) {
			if (!_containers[id].selectorDisabled && isNavigable(elem, id, true)) {
				return id;
			}
		}
	}

	function getContainerNavigableElements (containerId) {
		return parseSelector(_containers[containerId].selector).filter(function (elem) {
			return isNavigable(elem, containerId);
		});
	}

	function getContainerDefaultElement (containerId) {
		let defaultElement = _containers[containerId].defaultElement;
		if (!defaultElement) {
			return null;
		}
		if (typeof defaultElement === 'string') {
			defaultElement = parseSelector(defaultElement)[0];
		}
		if (isNavigable(defaultElement, containerId, true)) {
			return defaultElement;
		}
		return null;
	}

	function getContainerLastFocusedElement (containerId) {
		let lastFocusedElement = _containers[containerId].lastFocusedElement;
		if (!isNavigable(lastFocusedElement, containerId, true)) {
			return null;
		}
		return lastFocusedElement;
	}

	function focusElement (elem, containerId) {
		if (!elem) {
			return false;
		}

		let currentFocusedElement = getCurrent();

		let silentFocus = function () {
			if (currentFocusedElement) {
				currentFocusedElement.blur();
			}
			elem.focus();
			focusChanged(elem, containerId);
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

		focusChanged(elem, containerId);
		return true;
	}

	function focusChanged (elem, containerId) {
		if (!containerId) {
			containerId = getContainerId(elem);
		}
		if (containerId) {
			_containers[containerId].lastFocusedElement = elem;
			_lastContainerId = containerId;
		}
	}

	function focusExtendedSelector (selector, direction) {
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
				let nextContainerId = getContainerId(next);
				if (isNavigable(next, nextContainerId)) {
					return focusElement(next, nextContainerId, direction);
				}
			}
		}
		return false;
	}

	function focusContainer (containerId) {
		let range = [];
		let addRange = function (id) {
			if (id && range.indexOf(id) < 0
					&& _containers[id] && !_containers[id].selectorDisabled) {
				range.push(id);
			}
		};

		if (containerId) {
			addRange(containerId);
		} else {
			addRange(_defaultContainerId);
			addRange(_lastContainerId);
			Object.keys(_containers).map(addRange);
		}

		for (let i = 0; i < range.length; i++) {
			let id = range[i];
			let next;

			if (_containers[id].enterTo === 'last-focused') {
				next = getContainerLastFocusedElement(id)
					|| getContainerDefaultElement(id)
					|| getContainerNavigableElements(id)[0];
			} else {
				next = getContainerDefaultElement(id)
					|| getContainerLastFocusedElement(id)
					|| getContainerNavigableElements(id)[0];
			}

			if (next) {
				return focusElement(next, id);
			}
		}

		return false;
	}

	function gotoLeaveFor (containerId, direction) {
		if (_containers[containerId].leaveFor && typeof _containers[containerId].leaveFor[direction] !== 'undefined') {
			let next = _containers[containerId].leaveFor[direction];

			if (typeof next === 'string') {
				if (next === '') {
					return null;
				}
				return focusExtendedSelector(next, direction);
			}

			let nextContainerId = getContainerId(next);
			if (isNavigable(next, nextContainerId)) {
				return focusElement(next, nextContainerId, direction);
			}
		}
		return false;
	}

	function spotNext (direction, currentFocusedElement, currentContainerId) {
		let extSelector = currentFocusedElement.getAttribute('data-spot-' + direction);
		if (typeof extSelector === 'string') {
			if (extSelector === '' || !focusExtendedSelector(extSelector, direction)) {
				return false;
			}
			return true;
		}

		let containerNavigableElements = {};
		let allNavigableElements = [];
		for (let id in _containers) {
			containerNavigableElements[id] = getContainerNavigableElements(id);
			allNavigableElements = allNavigableElements.concat(containerNavigableElements[id]);
		}

		let config = extend({}, GlobalConfig, _containers[currentContainerId]);
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
			_containers[currentContainerId].previous = {
				target: currentFocusedElement,
				destination: next,
				reverse: _reverseDirections[direction]
			};

			let nextContainerId = getContainerId(next);

			if (currentContainerId !== nextContainerId) {
				let result = gotoLeaveFor(currentContainerId, direction);
				if (result) {
					return true;
				} else if (result === null) {
					return false;
				}

				let enterToElement;
				switch (_containers[nextContainerId].enterTo) {
					case 'last-focused':
						enterToElement = getContainerLastFocusedElement(nextContainerId) || getContainerDefaultElement(nextContainerId);
						break;
					case 'default-element':
						enterToElement = getContainerDefaultElement(nextContainerId);
						break;
				}
				if (enterToElement) {
					next = enterToElement;
				}
			}

			return focusElement(next, nextContainerId, direction);
		} else if (gotoLeaveFor(currentContainerId, direction)) {
			return true;
		}

		return false;
	}

	function preventDefault(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		return false;
	}

	function onAcceleratedKeyDown(evt) {
		let currentFocusedElement = getCurrent();

		if (!currentFocusedElement) {
			if (_lastContainerId) {
				currentFocusedElement = getContainerLastFocusedElement(_lastContainerId);
			}
			if (!currentFocusedElement) {
				focusContainer();
				return preventDefault(evt);
			}
		}

		const currentContainerId = getContainerId(currentFocusedElement);
		if (!currentContainerId) {
			return;
		}

		if (!spotNext(_directions[evt.keyCode], currentFocusedElement, currentContainerId)) {
			focusElement(currentFocusedElement, currentContainerId)
		}
	}

	function onKeyUp(evt) {
		if (!_containerCount || _pause) {
			return;
		}

		const keyCode = evt.keyCode;
		if (!_directions[keyCode] && !R.contains(keyCode, _enterKeyCodes)) {
			return;
		}

		SpotlightAccelerator.reset();
	}

	function onKeyDown(evt) {
		if (!_containerCount || _pause) {
			return;
		}

		const keyCode = evt.keyCode;
		const validKeyCodes = [..._enterKeyCodes, _pointerHideKeyCode, _pointerShowKeyCode];
		if (!_directions[keyCode] && !R.contains(keyCode, validKeyCodes)) {
			return;
		}

		switch (keyCode) {
			case _pointerHideKeyCode:
				_pointerMode = false;
				if (!getCurrent() && _lastContainerId) {
					Spotlight.focus(getContainerLastFocusedElement(_lastContainerId));
				}
				setPointerHideTimestamp();
				break;
			case _pointerShowKeyCode:
				_pointerMode = true;
				break;
			default:
				_pointerMode = false;
				if (isPointerHideTimestampExpired()) {
					SpotlightAccelerator.processKey(evt, onAcceleratedKeyDown);
				}
				break;
		}

		if (_directions[keyCode]) {
			preventDefault(evt);
		}
	}

	function onMouseOver (evt) {
		if (!_containerCount || _pause) {
			return;
		}

		_pointerMode = true;

		let target = getNavigableTarget(evt.target), // account for child controls
			current = getCurrent();

		if (!target) { // we are moving over a non-focusable element, so we force a blur to occur
			if (current) {
				current.blur();
			}
		} else if (target !== getCurrent()) { // moving over a focusable element
			focusElement(target, getContainerId(target));
			preventDefault(evt);
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
		for (let id in _containers) { // check *all* the containers to see if the specified element is a focusable element
			if (isNavigable(elem, id, true)) return true;
		}
		return false;
	}

	function isPointerHideTimestampExpired () {
		return performance.now() >= (_pointerHiddenTime + _pointerHiddenToKeyTimeout);
	}

	function setPointerHideTimestamp () {
		_pointerHiddenTime = performance.now();
	}

	/**
	/* public methods
	*/
	const Spotlight = { // eslint-disable-line no-shadow
		initialize: function () {
			if (!_initialized) {
				window.addEventListener('keydown', onKeyDown);
				window.addEventListener('keyup', onKeyUp);
				window.addEventListener('mouseover', onMouseOver);
				_initialized = true;
			}
		},

		terminate: function () {
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('keyup', onKeyUp);
			window.removeEventListener('mouseover', onMouseOver);
			Spotlight.clear();
			_ids = 0;
			_initialized = false;
		},

		clear: function () {
			_containers = {};
			_containerCount = 0;
			_defaultContainerId = '';
			_lastContainerId = '';
			_duringFocusChange = false;
		},

		// set(<config>);
		// set(<containerId>, <config>);
		set: function () {
			let containerId, config;

			if (typeof arguments[0] === 'object') {
				config = arguments[0];
			} else if (typeof arguments[0] === 'string' && typeof arguments[1] === 'object') {
				containerId = arguments[0];
				config = arguments[1];
				if (!_containers[containerId]) {
					throw new Error('Container "' + containerId + '" doesn\'t exist!');
				}
			} else {
				return;
			}

			for (let key in config) {
				if (typeof GlobalConfig[key] !== 'undefined') {
					if (containerId) {
						_containers[containerId][key] = config[key];
					} else if (typeof config[key] !== 'undefined') {
						GlobalConfig[key] = config[key];
					}
				}
			}

			if (containerId) {
				// remove "undefined" items
				_containers[containerId] = extend({}, _containers[containerId]);
			}
		},

		// add(<config>);
		// add(<containerId>, <config>);
		add: function () {
			let containerId;
			let config = {};

			if (typeof arguments[0] === 'object') {
				config = arguments[0];
			} else if (typeof arguments[0] === 'string' && typeof arguments[1] === 'object') {
				containerId = arguments[0];
				config = arguments[1];
			}

			if (!containerId) {
				containerId = (typeof config.id === 'string') ? config.id : generateId();
			}

			if (_containers[containerId]) {
				throw new Error('Container "' + containerId + '" has already existed!');
			}

			_containers[containerId] = {};
			_containerCount++;

			Spotlight.set(containerId, config);

			return containerId;
		},

		remove: function (containerId) {
			if (!containerId || typeof containerId !== 'string') {
				throw new Error('Please assign the "containerId"!');
			}
			if (_containers[containerId]) {
				_containers[containerId] = void 0;
				_containers = extend({}, _containers);
				_containerCount--;
				return true;
			}
			return false;
		},

		disableSelector: function (containerId) {
			if (_containers[containerId]) {
				_containers[containerId].selectorDisabled = true;
				return true;
			}
			return false;
		},

		enableSelector: function (containerId) {
			if (_containers[containerId]) {
				_containers[containerId].selectorDisabled = false;
				return true;
			}
			return false;
		},

		pause: function () {
			_pause = true;
		},

		resume: function () {
			_pause = false;
		},

		// focus([silent])
		// focus(<containerId>, [silent])
		// focus(<extSelector>, [silent])
		// Note: "silent" is optional and default to false
		focus: function (elem, silent) {
			let result = false;

			if (typeof silent === 'undefined' && typeof elem === 'boolean') {
				silent = elem;
				elem = void 0;
			}

			let autoPause = !_pause && silent;

			if (autoPause) {
				Spotlight.pause();
			}

			if (!elem) {
				result  = focusContainer();
			} else if (typeof elem === 'string') {
				if (_containers[elem]) {
					result = focusContainer(elem);
				} else {
					result = focusExtendedSelector(elem);
				}
			} else {
				let nextContainerId = getContainerId(elem);
				if (isNavigable(elem, nextContainerId)) {
					result = focusElement(elem, nextContainerId);
				}
			}

			if (autoPause) {
				Spotlight.resume();
			}

			return result;
		},

		// move(<direction>)
		// move(<direction>, <selector>)
		move: function (direction, selector) {
			let elem, containerId;

			direction = direction.toLowerCase();
			if (!_reverseDirections[direction]) {
				return false;
			}

			elem = selector ? parseSelector(selector)[0] : getCurrent();
			if (!elem) {
				return false;
			}

			containerId = getContainerId(elem);
			if (!containerId) {
				return false;
			}

			return spotNext(direction, elem, containerId);
		},

		setDefaultContainer: function (containerId) {
			if (!containerId) {
				_defaultContainerId = '';
			} else if (!_containers[containerId]) {
				throw new Error('Container "' + containerId + '" doesn\'t exist!');
			} else {
				_defaultContainerId = containerId;
			}
		},

		/**
		 * Gets the current pointer mode
		 *
		 * @return {Boolean} `true` if spotlight is in pointer mode
		 */
		getPointerMode: function () {
			return _pointerMode;
		}
	};

	return Spotlight;

})();

export default Spotlight;
export {Spotlight, spotlightRootContainerName};
