// Integration tests for Spotlight keyboard dispatch and Tab navigation.

import {
	configureContainer,
	configureDefaults,
	getPopupOwnerElement,
	rootContainerId,
	setLastContainer
} from '../container';
import {pause, resume} from '../../Pause';
import Spotlight from '../spotlight';
import * as tabTraversal from '../tabTraversal';
import * as target from '../target';

import {
	captureHandlers,
	dispatchTab,
	focusForTest,
	installTabTestEnvironment,
	makeTabEvent,
	setRect,
	setupPopupDocument,
	setupSimpleDocument,
	teardownTabTest,
	uninstallTabTestEnvironment
} from './tab-fixtures';

beforeAll(installTabTestEnvironment);
afterAll(uninstallTabTestEnvironment);

describe('Spotlight Tab key dispatch (integration)', () => {
	let handlers;

	beforeEach(() => {
		Spotlight.terminate();
		handlers = captureHandlers();
		Spotlight.setPointerMode(false);
	});

	afterEach(teardownTabTest);

	test('should call preventDefault for Tab while Spotlight is paused', () => {
		setupSimpleDocument();
		focusForTest(document.getElementById('first'));
		pause();
		try {
			const ev = makeTabEvent();
			handlers.keydown(ev);
			expect(ev.preventDefault).toHaveBeenCalled();
		} finally {
			resume();
		}
	});

	test('should ignore non-Tab keys while Spotlight is paused', () => {
		setupSimpleDocument();
		focusForTest(document.getElementById('first'));
		pause();
		try {
			const ev = {
				keyCode: 37,
				shiftKey: false,
				preventDefault: jest.fn(),
				stopPropagation: jest.fn()
			};
			handlers.keydown(ev);
			expect(document.activeElement.id).toBe('first');
			expect(ev.preventDefault).not.toHaveBeenCalled();
		} finally {
			resume();
		}
	});

	test('should move focus forward on Tab', () => {
		setupSimpleDocument();
		focusForTest(document.getElementById('first'));

		const ev = dispatchTab(handlers.keydown);

		expect(ev.preventDefault).toHaveBeenCalled();
		expect(document.activeElement.id).toBe('second');
	});

	test('should move focus forward on Tab when document dir is rtl', () => {
		setupSimpleDocument();
		document.documentElement.setAttribute('dir', 'rtl');
		try {
			focusForTest(document.getElementById('second'));

			const ev = dispatchTab(handlers.keydown);

			expect(ev.preventDefault).toHaveBeenCalled();
			expect(document.activeElement.id).toBe('first');
		} finally {
			document.documentElement.removeAttribute('dir');
		}
	});

	test('should move focus forward on Tab when I18nDecorator RTL class is present', () => {
		setupSimpleDocument();
		document.getElementById('root').classList.add('enact-locale-right-to-left');
		focusForTest(document.getElementById('second'));

		const ev = dispatchTab(handlers.keydown);

		expect(ev.preventDefault).toHaveBeenCalled();
		expect(document.activeElement.id).toBe('first');
	});

	test('should move focus forward on Tab when body dir is rtl', () => {
		setupSimpleDocument();
		document.body.setAttribute('dir', 'rtl');
		try {
			focusForTest(document.getElementById('second'));

			const ev = dispatchTab(handlers.keydown);

			expect(ev.preventDefault).toHaveBeenCalled();
			expect(document.activeElement.id).toBe('first');
		} finally {
			document.body.removeAttribute('dir');
		}
	});

	test('should move focus forward on Tab when dir is RTL (case insensitive)', () => {
		setupSimpleDocument();
		document.documentElement.setAttribute('dir', 'RTL');
		try {
			focusForTest(document.getElementById('second'));

			const ev = dispatchTab(handlers.keydown);

			expect(ev.preventDefault).toHaveBeenCalled();
			expect(document.activeElement.id).toBe('first');
		} finally {
			document.documentElement.removeAttribute('dir');
		}
	});

	test('should move focus forward on Tab when RTL class is on documentElement', () => {
		setupSimpleDocument();
		document.documentElement.classList.add('enact-locale-right-to-left');
		try {
			focusForTest(document.getElementById('second'));

			const ev = dispatchTab(handlers.keydown);

			expect(ev.preventDefault).toHaveBeenCalled();
			expect(document.activeElement.id).toBe('first');
		} finally {
			document.documentElement.classList.remove('enact-locale-right-to-left');
		}
	});

	test('should move focus forward on Tab when RTL class is on body', () => {
		setupSimpleDocument();
		document.body.classList.add('enact-locale-right-to-left');
		try {
			focusForTest(document.getElementById('second'));

			const ev = dispatchTab(handlers.keydown);

			expect(ev.preventDefault).toHaveBeenCalled();
			expect(document.activeElement.id).toBe('first');
		} finally {
			document.body.classList.remove('enact-locale-right-to-left');
		}
	});

	test('should move focus backward on Shift+Tab', () => {
		setupSimpleDocument();
		focusForTest(document.getElementById('second'));

		const ev = dispatchTab(handlers.keydown, true);

		expect(ev.preventDefault).toHaveBeenCalled();
		expect(document.activeElement.id).toBe('first');
	});

	test('should skip Tab focus movement when pointer moved during key press', () => {
		setupSimpleDocument();
		focusForTest(document.getElementById('first'));
		handlers.keydown({keyCode: 39, shiftKey: false, preventDefault: jest.fn(), stopPropagation: jest.fn()});
		handlers.mousemove({target: document.getElementById('first'), clientX: 30, clientY: 30});

		const ev = dispatchTab(handlers.keydown);

		expect(document.activeElement.id).toBe('first');
		expect(ev.preventDefault).not.toHaveBeenCalled();
		handlers.keyup({keyCode: 39});
	});

	test('should not call preventDefault when Tab reaches end of a non-self-only linear list', () => {
		setupSimpleDocument();
		focusForTest(document.getElementById('second'));

		const ev = dispatchTab(handlers.keydown);

		expect(ev.preventDefault).not.toHaveBeenCalled();
		expect(document.activeElement.id).toBe('second');
	});

	test('should move focus to nearest element when current focus is outside the linear list', () => {
		setupSimpleDocument();
		const orphan = document.createElement('button');
		orphan.id = 'orphan';
		document.body.appendChild(orphan);
		setRect(orphan, {left: 110, top: 14, width: 10, height: 10});
		focusForTest(orphan);

		const ev = dispatchTab(handlers.keydown);

		expect(ev.preventDefault).toHaveBeenCalled();
		expect(document.activeElement.id).toBe('second');
	});
});

describe('Spotlight Tab dispatch — spotLinear branches', () => {
	let handlers;

	beforeEach(() => {
		Spotlight.terminate();
		handlers = captureHandlers();
		Spotlight.setPointerMode(false);
	});

	afterEach(teardownTabTest);

	test('should not move focus when nothing is focused and focus cannot be restored', () => {
		document.body.innerHTML = `
			<div data-spotlight-container="true" data-spotlight-id="${rootContainerId}"></div>
		`;
		configureDefaults({selector: '.spottable'});
		configureContainer(rootContainerId, {selector: '.spottable'});
		setLastContainer(rootContainerId);

		const ev = dispatchTab(handlers.keydown);

		expect(ev.preventDefault).not.toHaveBeenCalled();
	});

	test('should not move focus when restoreFocus succeeds but leaves no active element', () => {
		setupSimpleDocument();
		document.getElementById('first').blur?.();
		const focusSpy = jest.spyOn(Spotlight, 'focus').mockImplementation(() => true);
		try {
			const ev = dispatchTab(handlers.keydown);
			expect(ev.preventDefault).not.toHaveBeenCalled();
		} finally {
			focusSpy.mockRestore();
		}
	});

	test('should fall back to first element when nearest target cannot be resolved', () => {
		setupPopupDocument();
		const orphan = document.createElement('button');
		orphan.id = 'orphan-outside-list';
		document.body.appendChild(orphan);
		setRect(orphan, {left: 500, top: 500, width: 10, height: 10});
		focusForTest(orphan);

		const nearestSpy = jest.spyOn(target, 'getNearestTargetFromPosition').mockReturnValue(null);
		try {
			const ev = dispatchTab(handlers.keydown);
			expect(ev.preventDefault).toHaveBeenCalled();
			expect(document.activeElement.id).toBe('ownerA');
		} finally {
			nearestSpy.mockRestore();
		}
	});

	test('should use the nearest linear element when current focus is outside the list', () => {
		setupPopupDocument();
		const orphan = document.createElement('button');
		orphan.id = 'orphan-near-ownerB';
		document.body.appendChild(orphan);
		setRect(orphan, {left: 144, top: 18, width: 16, height: 10});
		focusForTest(orphan);

		const ev = dispatchTab(handlers.keydown);

		expect(ev.preventDefault).toHaveBeenCalled();
		expect(document.activeElement.id).toBe('outside');
	});

	test('should not move focus on Shift+Tab from the first element in non-self-only scope', () => {
		setupPopupDocument();
		focusForTest(document.getElementById('ownerA'));

		const ev = dispatchTab(handlers.keydown, true);

		expect(ev.preventDefault).not.toHaveBeenCalled();
	});

	test('should bootstrap focus via restoreFocus when nothing is focused', () => {
		setupSimpleDocument();
		if (document.activeElement?.blur) {
			document.activeElement.blur();
		}

		const ev = dispatchTab(handlers.keydown);

		expect(ev.preventDefault).toHaveBeenCalled();
		expect(document.activeElement.id).toBe('second');
	});

	test('should not move focus when self-only popup has no spottable linear targets', () => {
		setupPopupDocument();
		const popup = document.querySelector('[data-spotlight-id="popup-a"]');
		popup.innerHTML = '';
		const btn = document.createElement('button');
		btn.id = 'non-spottable-inside';
		popup.appendChild(btn);
		setLastContainer('popup-a');
		focusForTest(btn);

		const ev = dispatchTab(handlers.keydown);

		expect(ev.preventDefault).not.toHaveBeenCalled();
	});

	test('should not move focus when self-only container has no valid exit target', () => {
		setupPopupDocument();
		document.getElementById('ownerA').removeAttribute('aria-owns');
		document.getElementById('ownerB').remove();
		document.getElementById('layerB').remove();
		document.getElementById('outside').remove();
		setLastContainer('popup-a');
		focusForTest(document.getElementById('a2'));

		const ev = dispatchTab(handlers.keydown);

		expect(ev.preventDefault).not.toHaveBeenCalled();
	});
});

// Pure helpers — these don't touch the Spotlight singleton or window events, so they're
// imported directly from tabTraversal and tested as plain functions.
describe('tabTraversal pure helpers', () => {
	afterEach(teardownTabTest);

	test('getLinearTabSearchContainerId: returns root for null focus', () => {
		setupPopupDocument();
		expect(tabTraversal.getLinearTabSearchContainerId(null)).toBe(rootContainerId);
	});

	test('getLinearTabSearchContainerId: returns root when paused', () => {
		setupPopupDocument();
		pause();
		try {
			expect(tabTraversal.getLinearTabSearchContainerId(document.getElementById('a1'))).toBe(rootContainerId);
		} finally {
			resume();
		}
	});

	test('getLinearTabSearchContainerId: returns self-only container for an element inside one', () => {
		setupPopupDocument();
		setLastContainer('popup-a');
		expect(tabTraversal.getLinearTabSearchContainerId(document.getElementById('a1'))).toBe('popup-a');
	});

	test.each([
		['different rows', 10, 10, 10, 40, false, true],
		['same row ltr', 10, 10, 30, 12, false, true],
		['same row rtl', 30, 10, 10, 12, true, true],
		['same row same X', 10, 10, 10, 12, false, false]
	])('comesBeforeInTabOrder: %s', (_label, ax, ay, bx, by, rtl, expected) => {
		expect(tabTraversal.comesBeforeInTabOrder(ax, ay, bx, by, rtl)).toBe(expected);
	});

	test('getPopupOwnerElement: finds the aria-owns trigger for a popup container', () => {
		setupPopupDocument();
		expect(
			getPopupOwnerElement(document.querySelector('[data-spotlight-id="popup-a"]')).id
		).toBe('ownerA');
	});

	test('getPopupOwnerElement: returns null for a null input', () => {
		setupPopupDocument();
		expect(getPopupOwnerElement(null)).toBeNull();
	});

	test('isTargetInSelfOnlyContainer: true for popup items, false for root-level elements and null', () => {
		setupPopupDocument();
		expect(tabTraversal.isTargetInSelfOnlyContainer(document.getElementById('a2'))).toBe(true);
		expect(tabTraversal.isTargetInSelfOnlyContainer(document.getElementById('ownerB'))).toBe(false);
		expect(tabTraversal.isTargetInSelfOnlyContainer(document.getElementById('outside'))).toBe(false);
		expect(tabTraversal.isTargetInSelfOnlyContainer(null)).toBe(false);
	});

	test('isTargetInSelfOnlyContainer: false when target has no spotlight container ancestor', () => {
		setupPopupDocument();
		const orphan = document.createElement('button');
		document.body.appendChild(orphan);
		expect(tabTraversal.isTargetInSelfOnlyContainer(orphan)).toBe(false);
	});

	test('isTargetInSelfOnlyContainer: false for a node inside the root container itself', () => {
		document.body.innerHTML = `
			<div data-spotlight-container="true" data-spotlight-id="${rootContainerId}">
				<button id="root-child" class="spottable">Root Child</button>
			</div>
		`;
		configureDefaults({selector: '.spottable'});
		configureContainer(rootContainerId, {selector: '.spottable'});

		expect(tabTraversal.isTargetInSelfOnlyContainer(document.getElementById('root-child'))).toBe(false);
	});

	test('getLinearTargetContainerId: returns the empty string when closest container has empty id', () => {
		setupSimpleDocument();
		const wrap = document.createElement('div');
		wrap.setAttribute('data-spotlight-container', 'true');
		wrap.setAttribute('data-spotlight-id', '');
		const btn = document.createElement('button');
		btn.className = 'spottable';
		btn.id = 'empty-id-wrapper-child';
		setRect(btn, {left: 260, top: 20});
		wrap.appendChild(btn);
		document.getElementById('root').appendChild(wrap);

		expect(tabTraversal.getLinearTargetContainerId(btn)).toBe('');
	});

	test('getLinearTargetsInContainer: skips nested containers that have no spotlight id', () => {
		configureDefaults({selector: '.spottable'});
		document.body.innerHTML = `
			<div data-spotlight-container="true" data-spotlight-id="${rootContainerId}">
				<div data-spotlight-container="true"></div>
			</div>
		`;
		configureContainer(rootContainerId, {selector: '.spottable'});

		expect(tabTraversal.getLinearTargetsInContainer(rootContainerId)).toEqual([]);
	});

	test('getLinearTargetsInContainer: reuses cache Map on repeated lookups', () => {
		setupPopupDocument();
		const cache = new Map();

		const first = tabTraversal.getLinearTargetsInContainer(rootContainerId, cache);
		const second = tabTraversal.getLinearTargetsInContainer(rootContainerId, cache);

		expect(second).toBe(first);
	});

	test('getLinearTargetsInContainer: lists root and portaled controls in visual order with finite coordinates', () => {
		setupPopupDocument();
		const linear = tabTraversal.getLinearTargetsInContainer(rootContainerId);
		const ids = linear.map(({target: t}) => t.id);

		expect(ids).toEqual(['ownerA', 'ownerB', 'outside', 'a1', 'b1', 'a2', 'b2']);
		expect(linear.every(({x, y}) => Number.isFinite(x) && Number.isFinite(y))).toBe(true);
	});

	test('getLinearTargetsInContainer: computes correct centre coordinates from getBoundingClientRect', () => {
		setupPopupDocument();
		const linear = tabTraversal.getLinearTargetsInContainer(rootContainerId);

		const ownerAEntry = linear.find(({target: t}) => t.id === 'ownerA');
		expect(ownerAEntry.x).toBe(60);
		expect(ownerAEntry.y).toBe(32);

		const outsideEntry = linear.find(({target: t}) => t.id === 'outside');
		expect(outsideEntry.x).toBe(360);
		expect(outsideEntry.y).toBe(32);
	});

	test('getLinearTargetsInContainer: preserves DOM insertion order when coordinates are equal', () => {
		setupSimpleDocument();
		const sameRect = {left: 20, top: 20, width: 80, height: 24};
		setRect(document.getElementById('first'), sameRect);
		setRect(document.getElementById('second'), sameRect);

		const linear = tabTraversal.getLinearTargetsInContainer(rootContainerId);
		expect(linear[0].target.id).toBe('first');
		expect(linear[1].target.id).toBe('second');
	});

	test('resolveTargetToOpenPopupItem: redirects into the first item of an open popup', () => {
		setupPopupDocument();
		const res = tabTraversal.resolveTargetToOpenPopupItem(
			document.getElementById('ownerB'), 'popup-a', true
		);
		expect(res.id).toBe('b1');
	});

	test('resolveTargetToOpenPopupItem: passes through when aria-owns is removed', () => {
		setupPopupDocument();
		document.getElementById('ownerB').removeAttribute('aria-owns');
		const res = tabTraversal.resolveTargetToOpenPopupItem(
			document.getElementById('ownerB'), 'popup-a', true
		);
		expect(res.id).toBe('ownerB');
	});

	test('resolveTargetToOpenPopupItem: passes through when nearest aria-owns ancestor is document.body', () => {
		setupPopupDocument();
		document.getElementById('ownerA').removeAttribute('aria-owns');
		document.body.setAttribute('aria-owns', 'layerB');
		try {
			const res = tabTraversal.resolveTargetToOpenPopupItem(
				document.getElementById('ownerA'), 'popup-b', true
			);
			expect(res.id).toBe('ownerA');
		} finally {
			document.body.removeAttribute('aria-owns');
		}
	});

	test('findLinearTabExitTarget: forward fallback path lands on outside when popup owner has no aria-owns', () => {
		setupPopupDocument();
		document.getElementById('ownerA').removeAttribute('aria-owns');
		setRect(document.getElementById('outside'), {left: 320, top: 160});

		const exitTarget = tabTraversal.findLinearTabExitTarget(document.getElementById('a2'), 'popup-a', true);

		expect(exitTarget.id).toBe('outside');
	});

	test('findLinearTabExitTarget: reverse fallback lands on outside when popup owner has no aria-owns', () => {
		setupPopupDocument();
		document.getElementById('ownerB').removeAttribute('aria-owns');

		const exitTarget = tabTraversal.findLinearTabExitTarget(document.getElementById('b1'), 'popup-b', false);

		expect(exitTarget.id).toBe('outside');
	});

	test('findLinearTabExitTargetInTargets: skips self-only members and returns null when nothing qualifies', () => {
		setupPopupDocument();
		const targets = [
			{target: document.getElementById('a2'), x: 40, y: 120},
			{target: document.getElementById('b1'), x: 180, y: 92},
			{target: document.getElementById('outside'), x: 360, y: 32}
		];
		expect(tabTraversal.findLinearTabExitTargetInTargets(targets, 60, 90, false, true)).toBeNull();
	});

	test('findLinearTabExitTargetInTargets: returns outside in reverse order', () => {
		setupPopupDocument();
		const targets = [
			{target: document.getElementById('a2'), x: 40, y: 120},
			{target: document.getElementById('b1'), x: 180, y: 92},
			{target: document.getElementById('outside'), x: 360, y: 32}
		];
		const reverse = tabTraversal.findLinearTabExitTargetInTargets(targets, 180, 90, false, false);
		expect(reverse.id).toBe('outside');
	});

	test('should complete Tab handoff when owned popup is empty and aria-owns lists duplicate layers', () => {
		setupPopupDocument();
		document.getElementById('ownerB').setAttribute('aria-owns', 'layerB layerB');
		document.querySelector('[data-spotlight-id="popup-b"]').innerHTML = '';
		setLastContainer('popup-a');
		focusForTest(document.getElementById('a2'));

		Spotlight.terminate();
		const {keydown} = captureHandlers();
		Spotlight.setPointerMode(false);
		const ev = dispatchTab(keydown);

		expect(ev.preventDefault).toHaveBeenCalled();
		expect(document.activeElement.id).toBe('ownerB');
	});
});
