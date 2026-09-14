/* global jest, expect */
// Shared DOM fixtures and event helpers for Tab navigation tests.

import {add as addKeyCode, remove as removeKeyCode} from '@enact/core/keymap';
import {
	configureContainer,
	configureDefaults,
	removeAllContainers,
	rootContainerId,
	setLastContainer
} from '../container';
import Spotlight from '../spotlight';

export const TAB = 9;

export const setRect = (elem, {left, top, width = 80, height = 24}) => {
	const rect = {left, top, width, height, right: left + width, bottom: top + height};
	Object.defineProperty(elem, 'getBoundingClientRect', {configurable: true, value: () => rect});
	Object.defineProperty(elem, 'offsetWidth', {configurable: true, value: width});
	Object.defineProperty(elem, 'offsetHeight', {configurable: true, value: height});
};

// Two spottable buttons side-by-side: first (20,20), second (140,20).
export const setupSimpleDocument = () => {
	document.body.innerHTML = `
		<div id="root" data-spotlight-container="true" data-spotlight-id="${rootContainerId}">
			<button id="first"  class="spottable">First</button>
			<button id="second" class="spottable">Second</button>
		</div>
	`;
	setRect(document.getElementById('first'),  {left: 20,  top: 20});
	setRect(document.getElementById('second'), {left: 140, top: 20});

	configureDefaults({selector: '.spottable'});
	configureContainer(rootContainerId, {selector: '.spottable'});
	setLastContainer(rootContainerId);
};

// Popup dropdowns (popup-a, popup-b) with aria-owns owners plus an outside control.
export const setupPopupDocument = () => {
	document.body.innerHTML = `
		<div id="root" data-spotlight-container="true" data-spotlight-id="${rootContainerId}">
			<button id="ownerA"  class="spottable" data-spotlight-id="ownerA"  aria-owns="layerA">Owner A</button>
			<button id="ownerB"  class="spottable" data-spotlight-id="ownerB"  aria-owns="layerB">Owner B</button>
			<button id="outside" class="spottable" data-spotlight-id="outside">Outside</button>
			<div id="layerA">
				<div data-spotlight-container="true" data-spotlight-id="popup-a">
					<button id="a1" class="spottable" data-spotlight-id="a1">A1</button>
					<button id="a2" class="spottable" data-spotlight-id="a2">A2</button>
				</div>
			</div>
			<div id="layerB">
				<div data-spotlight-container="true" data-spotlight-id="popup-b">
					<button id="b1" class="spottable" data-spotlight-id="b1">B1</button>
					<button id="b2" class="spottable" data-spotlight-id="b2">B2</button>
				</div>
			</div>
		</div>
	`;

	[['ownerA', 20, 20], ['ownerB', 160, 20], ['outside', 320, 20],
		['a1', 20, 80], ['a2', 20, 108], ['b1', 160, 80], ['b2', 160, 108]
	].forEach(([id, left, top]) => setRect(document.getElementById(id), {left, top}));

	setRect(document.querySelector('[data-spotlight-id="popup-a"]'), {left: 20,  top: 72, width: 110, height: 90});
	setRect(document.querySelector('[data-spotlight-id="popup-b"]'), {left: 160, top: 72, width: 110, height: 90});

	configureDefaults({selector: '.spottable'});
	configureContainer(rootContainerId, {selector: '.spottable'});
	setLastContainer(rootContainerId);
	configureContainer('popup-a', {restrict: 'self-only', selector: '.spottable'});
	configureContainer('popup-b', {restrict: 'self-only', selector: '.spottable'});
};

export const setupTabHandoffScenario = ({openA = true, openB = true, openC = false} = {}) => {
	const layerId = (id) => `${id}_floatLayer`;
	const ownerAttrs = (ownerId, popupId, open) => (
		`id="${ownerId}" class="spottable" data-spotlight-id="${ownerId}"` +
		(open ? ` aria-owns="${layerId(popupId)}"` : '')
	);

	const popupMarkup = (id) => `
		<div id="${layerId(id)}">
			<div data-spotlight-container="true" data-spotlight-id="popup-${id}">
				<button id="${id}1" class="spottable" data-spotlight-id="${id}1">Option 1</button>
				<button id="${id}2" class="spottable" data-spotlight-id="${id}2">Option 2</button>
				<button id="${id}3" class="spottable" data-spotlight-id="${id}3">Option 3</button>
				<button id="${id}4" class="spottable" data-spotlight-id="${id}4">Option 4</button>
				<button id="${id}5" class="spottable" data-spotlight-id="${id}5">Option 5</button>
			</div>
		</div>
	`;

	document.body.innerHTML = `
		<div id="root" data-spotlight-container="true" data-spotlight-id="${rootContainerId}">
			<button ${ownerAttrs('aOwner', 'a', openA)}>Dropdown A</button>
			<button ${ownerAttrs('bOwner', 'b', openB)}>Dropdown B</button>
			<button ${ownerAttrs('cOwner', 'c', openC)}>Dropdown C</button>
			<button id="dOwner" class="spottable" data-spotlight-id="dOwner">Dropdown D</button>
			<button id="closeX" class="spottable" data-spotlight-id="closeX">X</button>
			${openA ? popupMarkup('a') : ''}
			${openB ? popupMarkup('b') : ''}
			${openC ? popupMarkup('c') : ''}
		</div>
	`;

	configureDefaults({selector: '.spottable'});
	configureContainer(rootContainerId, {selector: '.spottable'});
	setLastContainer(rootContainerId);

	if (openA) configureContainer('popup-a', {restrict: 'self-only', selector: '.spottable'});
	if (openB) configureContainer('popup-b', {restrict: 'self-only', selector: '.spottable'});
	if (openC) configureContainer('popup-c', {restrict: 'self-only', selector: '.spottable'});

	setRect(document.getElementById('aOwner'), {left: 20, top: 20});
	setRect(document.getElementById('bOwner'), {left: 160, top: 20});
	setRect(document.getElementById('cOwner'), {left: 300, top: 20});
	setRect(document.getElementById('dOwner'), {left: 20, top: 120});
	setRect(document.getElementById('closeX'), {left: 440, top: 20, width: 24, height: 24});

	const optionRect = (id, left) => {
		for (let i = 1; i <= 5; i++) {
			const optionNode = document.getElementById(`${id}${i}`);
			if (optionNode) {
				setRect(optionNode, {left, top: 80 + ((i - 1) * 28)});
			}
		}
		const popupContainer = document.querySelector(`[data-spotlight-id="popup-${id}"]`);
		if (popupContainer) {
			setRect(popupContainer, {left, top: 72, width: 110, height: 180});
		}
	};

	optionRect('a', 20);
	optionRect('b', 160);
	optionRect('c', 300);
};

export const captureHandlers = () => {
	const handlers = {};
	const spy = jest.spyOn(window, 'addEventListener').mockImplementation((type, handler) => {
		handlers[type] = handler;
	});
	Spotlight.initialize();
	spy.mockRestore();
	return handlers;
};

export const makeTabEvent = (shiftKey = false) => ({
	keyCode: TAB,
	shiftKey,
	preventDefault: jest.fn(),
	stopPropagation: jest.fn()
});

// Blur stale focus then focus element.
export const focusForTest = (element) => {
	if (document.activeElement && document.activeElement !== document.body) {
		document.activeElement.blur();
	}
	element.focus();
	expect(document.activeElement).toBe(element);
};

// Dispatch Tab/Shift+Tab through a captured keydown handler.
export const dispatchTab = (keydown, shiftKey = false) => {
	const ev = makeTabEvent(shiftKey);
	keydown(ev);
	return ev;
};

export const teardownTabTest = () => {
	Spotlight.terminate();
	Spotlight.resetKeyHoldState();
	removeAllContainers();
	document.body.innerHTML = '';
};

export const installTabTestEnvironment = () => {
	addKeyCode('tab', TAB);
	if (typeof document.elementFromPoint !== 'function') {
		Object.defineProperty(document, 'elementFromPoint', {configurable: true, value: () => null});
	}
};

export const uninstallTabTestEnvironment = () => {
	removeKeyCode('tab', TAB);
};
