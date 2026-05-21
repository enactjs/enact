// Integration tests for Spotlight keyboard dispatch and Tab navigation.

import {
	configureContainer,
	configureDefaults,
	getPopupOwnerElement,
	rootContainerId,
	setLastContainer
} from '../container';
import {pause, resume} from '../../Pause';
import Spotlight, {_tabNavTestHooks as tabNavTestHooks} from '../spotlight';
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

	test('should move focus forward on Tab', () => {
		setupSimpleDocument();
		focusForTest(document.getElementById('first'));

		const ev = dispatchTab(handlers.keydown);

		expect(ev.preventDefault).toHaveBeenCalled();
		expect(document.activeElement.id).toBe('second');
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

describe('Spotlight spotLinear (integration)', () => {
	beforeEach(() => Spotlight.setPointerMode(false));
	afterEach(teardownTabTest);

	test('should return false when nothing is focused and focus cannot be restored', () => {
		document.body.innerHTML = `
			<div data-spotlight-container="true" data-spotlight-id="${rootContainerId}"></div>
		`;
		configureDefaults({selector: '.spottable'});
		configureContainer(rootContainerId, {selector: '.spottable'});
		setLastContainer(rootContainerId);

		expect(tabNavTestHooks.spotLinear(true)).toBe(false);
	});

	test('should return false when restoreFocus appears to succeed but leaves no active element', () => {
		setupSimpleDocument();
		document.getElementById('first').blur?.();
		const focusSpy = jest.spyOn(Spotlight, 'focus').mockImplementation(() => true);
		try {
			expect(tabNavTestHooks.spotLinear(true)).toBe(false);
		} finally {
			focusSpy.mockRestore();
		}
	});

	test('should advance focus to the next spottable element', () => {
		setupSimpleDocument();
		focusForTest(document.getElementById('first'));

		const moved = tabNavTestHooks.spotLinear(true);

		expect(moved).toBe(true);
		expect(document.activeElement.id).toBe('second');
	});

	test('should return false at the end of the linear list', () => {
		setupSimpleDocument();
		focusForTest(document.getElementById('second'));

		expect(tabNavTestHooks.spotLinear(true)).toBe(false);
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
			const moved = tabNavTestHooks.spotLinear(true);
			expect(moved).toBe(true);
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

		const moved = tabNavTestHooks.spotLinear(true);

		expect(moved).toBe(true);
		expect(document.activeElement.id).toBe('outside');
	});

	test('should return false when reverse index goes before start in non-self-only scope', () => {
		setupPopupDocument();
		focusForTest(document.getElementById('ownerA'));

		expect(tabNavTestHooks.spotLinear(false)).toBe(false);
	});

	test('should bootstrap focus via restoreFocus when nothing is focused', () => {
		setupSimpleDocument();
		if (document.activeElement?.blur) {
			document.activeElement.blur();
		}

		const moved = tabNavTestHooks.spotLinear(true);

		expect(moved).toBe(true);
		expect(document.activeElement.id).toBe('second');
	});

	test('should return false when self-only popup has no spottable linear targets', () => {
		setupPopupDocument();
		const popup = document.querySelector('[data-spotlight-id="popup-a"]');
		popup.innerHTML = '';
		const btn = document.createElement('button');
		btn.id = 'non-spottable-inside';
		popup.appendChild(btn);
		setLastContainer('popup-a');
		focusForTest(btn);

		expect(tabNavTestHooks.spotLinear(true)).toBe(false);
	});

	test('should return false when self-only container has no valid exit target', () => {
		setupPopupDocument();
		document.getElementById('ownerA').removeAttribute('aria-owns');
		document.getElementById('ownerB').remove();
		document.getElementById('layerB').remove();
		document.getElementById('outside').remove();
		setLastContainer('popup-a');
		focusForTest(document.getElementById('a2'));

		expect(tabNavTestHooks.spotLinear(true)).toBe(false);
	});
});

describe('Spotlight Tab helpers (integration)', () => {
	afterEach(teardownTabTest);

	test('getLinearTabSearchContainerId: returns root for null focus', () => {
		setupPopupDocument();
		expect(tabNavTestHooks.getLinearTabSearchContainerId(null)).toBe(rootContainerId);
	});

	test('getLinearTabSearchContainerId: returns root when paused', () => {
		setupPopupDocument();
		pause();
		try {
			expect(tabNavTestHooks.getLinearTabSearchContainerId(document.getElementById('a1'))).toBe(rootContainerId);
		} finally {
			resume();
		}
	});

	test('getLinearTabSearchContainerId: returns self-only container for an element inside one', () => {
		setupPopupDocument();
		setLastContainer('popup-a');
		expect(tabNavTestHooks.getLinearTabSearchContainerId(document.getElementById('a1'))).toBe('popup-a');
	});

	test.each([
		['different rows', 10, 10, 10, 40, false, true],
		['same row ltr', 10, 10, 30, 12, false, true],
		['same row rtl', 30, 10, 10, 12, true, true],
		['same row same X', 10, 10, 10, 12, false, false]
	])('comesBeforeInTabOrder: %s', (_label, ax, ay, bx, by, rtl, expected) => {
		expect(tabNavTestHooks.comesBeforeInTabOrder(ax, ay, bx, by, rtl)).toBe(expected);
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
		expect(tabNavTestHooks.isTargetInSelfOnlyContainer(document.getElementById('a2'))).toBe(true);
		expect(tabNavTestHooks.isTargetInSelfOnlyContainer(document.getElementById('ownerB'))).toBe(false);
		expect(tabNavTestHooks.isTargetInSelfOnlyContainer(document.getElementById('outside'))).toBe(false);
		expect(tabNavTestHooks.isTargetInSelfOnlyContainer(null)).toBe(false);
	});

	test('isTargetInSelfOnlyContainer: false when target has no spotlight container ancestor', () => {
		setupPopupDocument();
		const orphan = document.createElement('button');
		document.body.appendChild(orphan);
		expect(tabNavTestHooks.isTargetInSelfOnlyContainer(orphan)).toBe(false);
	});

	test('isTargetInSelfOnlyContainer: false for a node inside the root container itself', () => {
		document.body.innerHTML = `
			<div data-spotlight-container="true" data-spotlight-id="${rootContainerId}">
				<button id="root-child" class="spottable">Root Child</button>
			</div>
		`;
		configureDefaults({selector: '.spottable'});
		configureContainer(rootContainerId, {selector: '.spottable'});

		expect(tabNavTestHooks.isTargetInSelfOnlyContainer(document.getElementById('root-child'))).toBe(false);
	});

	test('resolveTargetToOpenPopupItem: redirects into the first item of an open popup', () => {
		setupPopupDocument();
		const res = tabNavTestHooks.resolveTargetToOpenPopupItem(
			document.getElementById('ownerB'), 'popup-a', true
		);
		expect(res.id).toBe('b1');
	});

	test('resolveTargetToOpenPopupItem: passes through when aria-owns is removed', () => {
		setupPopupDocument();
		document.getElementById('ownerB').removeAttribute('aria-owns');
		const res = tabNavTestHooks.resolveTargetToOpenPopupItem(
			document.getElementById('ownerB'), 'popup-a', true
		);
		expect(res.id).toBe('ownerB');
	});

	test('resolveTargetToOpenPopupItem: passes through when aria-owns is empty string', () => {
		setupPopupDocument();
		document.getElementById('ownerB').setAttribute('aria-owns', '');
		const res = tabNavTestHooks.resolveTargetToOpenPopupItem(
			document.getElementById('ownerB'), 'popup-a', true
		);
		expect(res.id).toBe('ownerB');
	});

	test('resolveTargetToOpenPopupItem: passes through when aria-owns points to a non-container element', () => {
		setupPopupDocument();
		document.getElementById('ownerB').setAttribute('aria-owns', 'outside');
		const res = tabNavTestHooks.resolveTargetToOpenPopupItem(
			document.getElementById('ownerB'), 'popup-a', true
		);
		expect(res.id).toBe('ownerB');
	});

	test('resolveTargetToOpenPopupItem: passes through when nearest aria-owns ancestor is document.body', () => {
		setupPopupDocument();
		document.getElementById('ownerA').removeAttribute('aria-owns');
		document.body.setAttribute('aria-owns', 'layerB');
		try {
			const res = tabNavTestHooks.resolveTargetToOpenPopupItem(
				document.getElementById('ownerA'), 'popup-b', true
			);
			expect(res.id).toBe('ownerA');
		} finally {
			document.body.removeAttribute('aria-owns');
		}
	});

	test('findLinearTabExitTarget: uses forward fallback path when popup owner has no aria-owns', () => {
		setupPopupDocument();
		document.getElementById('ownerA').removeAttribute('aria-owns');
		setRect(document.getElementById('outside'), {left: 320, top: 160});

		const exitTarget = tabNavTestHooks.findLinearTabExitTarget(document.getElementById('a2'), 'popup-a', true);

		expect(exitTarget).not.toBeNull();
		expect(exitTarget.id).toBe('outside');
	});

	test('findLinearTabExitTarget: uses reverse fallback path when popup owner has no aria-owns', () => {
		setupPopupDocument();
		document.getElementById('ownerB').removeAttribute('aria-owns');

		const exitTarget = tabNavTestHooks.findLinearTabExitTarget(document.getElementById('b1'), 'popup-b', false);

		expect(exitTarget).not.toBeNull();
		expect(exitTarget.id).toBe('outside');
	});

	test('findLinearTabExitTarget: exits second popup forward to the element after it in root order', () => {
		setupPopupDocument();
		const exitTarget = tabNavTestHooks.findLinearTabExitTarget(
			document.getElementById('b2'), 'popup-b', true
		);
		expect(exitTarget).not.toBeNull();
		expect(exitTarget.id).toBe('outside');
	});

	test('findLinearTabExitTargetInTargets: skips self-only members and returns null when nothing qualifies', () => {
		setupPopupDocument();
		const targets = [
			{target: document.getElementById('a2'), x: 40, y: 120},
			{target: document.getElementById('b1'), x: 180, y: 92},
			{target: document.getElementById('outside'), x: 360, y: 32}
		];
		expect(tabNavTestHooks.findLinearTabExitTargetInTargets(targets, 60, 90, false, true)).toBeNull();
	});

	test('findLinearTabExitTargetInTargets: returns outside in reverse order', () => {
		setupPopupDocument();
		const targets = [
			{target: document.getElementById('a2'), x: 40, y: 120},
			{target: document.getElementById('b1'), x: 180, y: 92},
			{target: document.getElementById('outside'), x: 360, y: 32}
		];
		const reverse = tabNavTestHooks.findLinearTabExitTargetInTargets(targets, 180, 90, false, false);
		expect(reverse).not.toBeNull();
		expect(reverse.id).toBe('outside');
	});

	test('findLinearTabExitTargetInTargets: returns a non-popup owner with empty aria-owns directly', () => {
		setupPopupDocument();
		const ownerLike = document.createElement('button');
		ownerLike.id = 'owner-empty-owns';
		ownerLike.className = 'spottable';
		ownerLike.setAttribute('aria-owns', '');
		document.getElementById('root').appendChild(ownerLike);

		const result = tabNavTestHooks.findLinearTabExitTargetInTargets(
			[{target: ownerLike, x: 300, y: 90}],
			60, 90, false, true
		);
		expect(result.id).toBe('owner-empty-owns');
	});

	test('getLinearTargetsInContainer: skips nested containers that have no spotlight id', () => {
		configureDefaults({selector: '.spottable'});
		document.body.innerHTML = `
			<div data-spotlight-container="true" data-spotlight-id="${rootContainerId}">
				<div data-spotlight-container="true"></div>
			</div>
		`;
		configureContainer(rootContainerId, {selector: '.spottable'});

		expect(tabNavTestHooks.getLinearTargetsInContainer(rootContainerId)).toEqual([]);
	});

	test('getLinearTargetContainerId: falls back to getContainersForNode when closest container has empty id', () => {
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

		expect(tabNavTestHooks.getLinearTargetContainerId(btn)).toBe('');
	});

	test('getLinearTargetsInContainer: lists root and portaled controls in visual order with finite coordinates', () => {
		setupPopupDocument();
		const linear = tabNavTestHooks.getLinearTargetsInContainer(rootContainerId);
		const ids = linear.map(({target: t}) => t.id);

		expect(ids).toEqual(['ownerA', 'ownerB', 'outside', 'a1', 'b1', 'a2', 'b2']);
		expect(linear.every(({x, y}) => Number.isFinite(x) && Number.isFinite(y))).toBe(true);
	});

	test('getLinearTargetsInContainer: computes correct centre coordinates from getBoundingClientRect', () => {
		setupPopupDocument();
		const linear = tabNavTestHooks.getLinearTargetsInContainer(rootContainerId);

		const ownerAEntry = linear.find(({target: t}) => t.id === 'ownerA');
		expect(ownerAEntry).toBeDefined();
		expect(ownerAEntry.x).toBe(60);
		expect(ownerAEntry.y).toBe(32);

		const outsideEntry = linear.find(({target: t}) => t.id === 'outside');
		expect(outsideEntry).toBeDefined();
		expect(outsideEntry.x).toBe(360);
		expect(outsideEntry.y).toBe(32);
	});

	test('getLinearTargetsInContainer: preserves DOM insertion order when coordinates are equal', () => {
		setupSimpleDocument();
		const sameRect = {left: 20, top: 20, width: 80, height: 24};
		setRect(document.getElementById('first'), sameRect);
		setRect(document.getElementById('second'), sameRect);

		const linear = tabNavTestHooks.getLinearTargetsInContainer(rootContainerId);
		expect(linear[0].target.id).toBe('first');
		expect(linear[1].target.id).toBe('second');
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
