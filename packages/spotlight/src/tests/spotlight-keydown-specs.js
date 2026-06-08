// Integration tests for Spotlight keyboard dispatch and Tab navigation.

import * as container from '../container';
import {
	configureContainer,
	configureDefaults,
	getPopupOwnerElement,
	rootContainerId,
	setLastContainer
} from '../container';
import {pause, resume} from '../../Pause';
import Spotlight from '../spotlight';
import {
	comesBeforeInTabOrder,
	findLinearTabExitTarget,
	findLinearTabExitTargetInTargets,
	getLinearTabSearchContainerId,
	getLinearTargetContainerId,
	getLinearTargetsInContainer,
	isTargetInSelfOnlyContainer,
	resolveTargetToOpenPopupItem,
	runWithLinearTargetsCache
} from '../tabTraversal';
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

	test('should wrap Tab focus to the first target after the last root target', () => {
		setupSimpleDocument();
		focusForTest(document.getElementById('second'));

		const ev = dispatchTab(handlers.keydown);

		expect(ev.preventDefault).toHaveBeenCalled();
		expect(document.activeElement.id).toBe('first');
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

	test('should not call preventDefault when Tab cannot restore focus in an empty container', () => {
		document.body.innerHTML = `
			<div data-spotlight-container="true" data-spotlight-id="${rootContainerId}"></div>
		`;
		configureDefaults({selector: '.spottable'});
		configureContainer(rootContainerId, {selector: '.spottable'});
		setLastContainer(rootContainerId);

		const ev = dispatchTab(handlers.keydown);

		expect(ev.preventDefault).not.toHaveBeenCalled();
	});

	test('should not call preventDefault when restoreFocus succeeds but leaves no active element', () => {
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

	test('should wrap Shift+Tab focus to the last root target before the first', () => {
		setupPopupDocument();
		focusForTest(document.getElementById('ownerA'));

		const ev = dispatchTab(handlers.keydown, true);

		expect(ev.preventDefault).toHaveBeenCalled();
		expect(document.activeElement.id).toBe('b2');
	});

	test('should move focus from sidebar Button tab to Home on Shift+Tab in TabLayout-like layout', () => {
		document.body.innerHTML = `
			<div data-spotlight-container="true" data-spotlight-id="${rootContainerId}">
				<div data-spotlight-container="true" data-spotlight-id="tablayout">
					<div id="tabs-collapsed" data-spotlight-container="true" data-spotlight-id="tabs-collapsed">
						<button id="home" class="spottable tab">Home</button>
						<button id="gear" class="spottable tab">Button</button>
						<button id="item" class="spottable tab">Item</button>
					</div>
					<button id="closex" class="spottable">X</button>
					<button id="btn1" class="spottable">Button 1</button>
					<button id="btn2" class="spottable">Button 2</button>
					<button id="btn3" class="spottable">Button 3</button>
					<button id="btn4" class="spottable">Button 4</button>
					<button id="btn5" class="spottable">Button 5</button>
				</div>
			</div>
		`;
		setRect(document.getElementById('tabs-collapsed'), {left: 10, top: 100, width: 60, height: 400});
		setRect(document.getElementById('home'), {left: 20, top: 110});
		setRect(document.getElementById('gear'), {left: 20, top: 200});
		setRect(document.getElementById('item'), {left: 20, top: 290});
		setRect(document.getElementById('closex'), {left: 900, top: 40, width: 48, height: 48});
		setRect(document.getElementById('btn1'), {left: 300, top: 200});
		setRect(document.getElementById('btn2'), {left: 400, top: 200});
		setRect(document.getElementById('btn3'), {left: 500, top: 200});
		setRect(document.getElementById('btn4'), {left: 600, top: 200});
		setRect(document.getElementById('btn5'), {left: 700, top: 200});

		configureDefaults({selector: '.spottable'});
		configureContainer(rootContainerId, {selector: '.spottable'});
		configureContainer('tablayout', {
			navigableFilter: (elem) => (
				elem.dataset.spotlightId !== 'tabs-collapsed' &&
				!elem.classList.contains('tab')
			),
			selector: '.spottable'
		});
		configureContainer('tabs-collapsed', {partition: true, selector: '.spottable'});

		focusForTest(document.getElementById('gear'));
		const ev = dispatchTab(handlers.keydown, true);

		expect(ev.preventDefault).toHaveBeenCalled();
		expect(document.activeElement.id).toBe('home');
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

	test('should not call preventDefault when self-only popup has no spottable linear targets', () => {
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
		expect(document.activeElement.id).toBe('non-spottable-inside');
	});

	test('should not call preventDefault when self-only container has no valid exit target', () => {
		setupPopupDocument();
		document.getElementById('ownerA').removeAttribute('aria-owns');
		document.getElementById('ownerB').remove();
		document.getElementById('layerB').remove();
		document.getElementById('outside').remove();
		setLastContainer('popup-a');
		focusForTest(document.getElementById('a2'));

		const ev = dispatchTab(handlers.keydown);

		expect(ev.preventDefault).not.toHaveBeenCalled();
		expect(document.activeElement.id).toBe('a2');
	});

	test('should complete Tab handoff when owned popup is empty and aria-owns lists duplicate layers', () => {
		setupPopupDocument();
		document.getElementById('ownerB').setAttribute('aria-owns', 'layerB layerB');
		document.querySelector('[data-spotlight-id="popup-b"]').innerHTML = '';
		setLastContainer('popup-a');
		focusForTest(document.getElementById('a2'));

		const ev = dispatchTab(handlers.keydown);

		expect(ev.preventDefault).toHaveBeenCalled();
		expect(document.activeElement.id).toBe('ownerB');
	});
});

describe('tabTraversal — pure helpers', () => {
	afterEach(teardownTabTest);

	test('getLinearTabSearchContainerId: returns root for null focus', () => {
		setupPopupDocument();
		expect(getLinearTabSearchContainerId(null)).toBe(rootContainerId);
	});

	test('getLinearTabSearchContainerId: returns root when paused', () => {
		setupPopupDocument();
		pause();
		try {
			expect(getLinearTabSearchContainerId(document.getElementById('a1'))).toBe(rootContainerId);
		} finally {
			resume();
		}
	});

	test('getLinearTabSearchContainerId: returns self-only container for an element inside one', () => {
		setupPopupDocument();
		setLastContainer('popup-a');
		expect(getLinearTabSearchContainerId(document.getElementById('a1'))).toBe('popup-a');
	});

	test.each([
		['different rows', 10, 10, 10, 40, false, true],
		['same row ltr', 10, 10, 30, 12, false, true],
		['same row rtl', 30, 10, 10, 12, true, true],
		['same row same X', 10, 10, 10, 12, false, false]
	])('comesBeforeInTabOrder: %s', (_label, ax, ay, bx, by, rtl, expected) => {
		expect(comesBeforeInTabOrder(ax, ay, bx, by, rtl)).toBe(expected);
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
		expect(isTargetInSelfOnlyContainer(document.getElementById('a2'))).toBe(true);
		expect(isTargetInSelfOnlyContainer(document.getElementById('ownerB'))).toBe(false);
		expect(isTargetInSelfOnlyContainer(document.getElementById('outside'))).toBe(false);
		expect(isTargetInSelfOnlyContainer(null)).toBe(false);
	});

	test('isTargetInSelfOnlyContainer: false when target has no spotlight container ancestor', () => {
		setupPopupDocument();
		const orphan = document.createElement('button');
		document.body.appendChild(orphan);
		expect(isTargetInSelfOnlyContainer(orphan)).toBe(false);
	});

	test('isTargetInSelfOnlyContainer: false for a node inside the root container itself', () => {
		document.body.innerHTML = `
			<div data-spotlight-container="true" data-spotlight-id="${rootContainerId}">
				<button id="root-child" class="spottable">Root Child</button>
			</div>
		`;
		configureDefaults({selector: '.spottable'});
		configureContainer(rootContainerId, {selector: '.spottable'});

		expect(isTargetInSelfOnlyContainer(document.getElementById('root-child'))).toBe(false);
	});

	test('resolveTargetToOpenPopupItem: redirects into the first item of an open popup', () => {
		setupPopupDocument();
		const res = resolveTargetToOpenPopupItem(
			document.getElementById('ownerB'), 'popup-a', true
		);
		expect(res.id).toBe('b1');
	});

	test('resolveTargetToOpenPopupItem: passes through when aria-owns is removed', () => {
		setupPopupDocument();
		document.getElementById('ownerB').removeAttribute('aria-owns');
		const res = resolveTargetToOpenPopupItem(
			document.getElementById('ownerB'), 'popup-a', true
		);
		expect(res.id).toBe('ownerB');
	});

	test('resolveTargetToOpenPopupItem: passes through when aria-owns is empty string', () => {
		setupPopupDocument();
		document.getElementById('ownerB').setAttribute('aria-owns', '');
		const res = resolveTargetToOpenPopupItem(
			document.getElementById('ownerB'), 'popup-a', true
		);
		expect(res.id).toBe('ownerB');
	});

	test('resolveTargetToOpenPopupItem: passes through when aria-owns points to a non-container element', () => {
		setupPopupDocument();
		document.getElementById('ownerB').setAttribute('aria-owns', 'outside');
		const res = resolveTargetToOpenPopupItem(
			document.getElementById('ownerB'), 'popup-a', true
		);
		expect(res.id).toBe('ownerB');
	});

	test('resolveTargetToOpenPopupItem: passes through when nearest aria-owns ancestor is document.body', () => {
		setupPopupDocument();
		document.getElementById('ownerA').removeAttribute('aria-owns');
		document.body.setAttribute('aria-owns', 'layerB');
		try {
			const res = resolveTargetToOpenPopupItem(
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

		const exitTarget = findLinearTabExitTarget(document.getElementById('a2'), 'popup-a', true);

		expect(exitTarget).not.toBeNull();
		expect(exitTarget.id).toBe('outside');
	});

	test('findLinearTabExitTarget: uses reverse fallback path when popup owner has no aria-owns', () => {
		setupPopupDocument();
		document.getElementById('ownerB').removeAttribute('aria-owns');

		const exitTarget = findLinearTabExitTarget(document.getElementById('b1'), 'popup-b', false);

		expect(exitTarget).not.toBeNull();
		expect(exitTarget.id).toBe('outside');
	});

	test('findLinearTabExitTarget: exits second popup forward to the element after it in root order', () => {
		setupPopupDocument();
		const exitTarget = findLinearTabExitTarget(
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
		expect(findLinearTabExitTargetInTargets(targets, 60, 90, false, true)).toBeNull();
	});

	test('findLinearTabExitTargetInTargets: returns outside in reverse order', () => {
		setupPopupDocument();
		const targets = [
			{target: document.getElementById('a2'), x: 40, y: 120},
			{target: document.getElementById('b1'), x: 180, y: 92},
			{target: document.getElementById('outside'), x: 360, y: 32}
		];
		const reverse = findLinearTabExitTargetInTargets(targets, 180, 90, false, false);
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

		const result = findLinearTabExitTargetInTargets(
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

		expect(getLinearTargetsInContainer(rootContainerId)).toEqual([]);
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

		const containersSpy = jest.spyOn(container, 'getContainersForNode')
			.mockReturnValue([rootContainerId, 'sentinel']);

		expect(getLinearTargetContainerId(btn)).toBe('sentinel');

		containersSpy.mockRestore();
	});

	test('getLinearTargetsInContainer: reuses the per-keypress cache on repeated lookups', () => {
		setupPopupDocument();

		runWithLinearTargetsCache(() => {
			const first = getLinearTargetsInContainer(rootContainerId);
			const second = getLinearTargetsInContainer(rootContainerId);

			expect(second).toBe(first);
		});
	});

	test('getLinearTargetsInContainer: lists root and portaled controls in visual order with finite coordinates', () => {
		setupPopupDocument();
		const linear = getLinearTargetsInContainer(rootContainerId);
		const ids = linear.map(({target: t}) => t.id);

		expect(ids).toEqual(['ownerA', 'ownerB', 'outside', 'a1', 'b1', 'a2', 'b2']);
		expect(linear.every(({x, y}) => Number.isFinite(x) && Number.isFinite(y))).toBe(true);
	});

	test('getLinearTargetsInContainer: computes correct centre coordinates from getBoundingClientRect', () => {
		setupPopupDocument();
		const linear = getLinearTargetsInContainer(rootContainerId);

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

		const linear = getLinearTargetsInContainer(rootContainerId);
		expect(linear[0].target.id).toBe('first');
		expect(linear[1].target.id).toBe('second');
	});

	test('getLinearTargetsInContainer: includes spottables inside navigableFilter-excluded subcontainers', () => {
		document.body.innerHTML = `
			<div id="root" data-spotlight-container="true" data-spotlight-id="${rootContainerId}">
				<div data-spotlight-container="true" data-spotlight-id="tabs-collapsed">
					<button id="home" class="spottable tab">Home</button>
					<button id="gear" class="spottable tab">Gear</button>
				</div>
				<button id="content" class="spottable">Content</button>
			</div>
		`;
		setRect(document.getElementById('home'), {left: 20, top: 20});
		setRect(document.getElementById('gear'), {left: 20, top: 60});
		// Content sits below the sidebar tabs so visual Tab order matches TabLayout.
		setRect(document.getElementById('content'), {left: 200, top: 100});

		configureDefaults({selector: '.spottable'});
		configureContainer(rootContainerId, {
			navigableFilter: (elem) => (
				elem.dataset.spotlightId !== 'tabs-collapsed' &&
				!elem.classList.contains('tab')
			),
			selector: '.spottable'
		});
		configureContainer('tabs-collapsed', {partition: true, selector: '.spottable'});

		const linear = getLinearTargetsInContainer(rootContainerId);
		expect(linear.map(({target: t}) => t.id)).toEqual(['home', 'gear', 'content']);
	});

	test('getLinearTargetsInContainer: orders partition sidebar before content even when x coordinates overlap', () => {
		document.body.innerHTML = `
			<div id="root" data-spotlight-container="true" data-spotlight-id="${rootContainerId}">
				<div id="tablayout-body">
					<div id="tabs-collapsed" data-spotlight-container="true" data-spotlight-id="tabs-collapsed">
						<button id="home" class="spottable tab">Home</button>
						<button id="gear" class="spottable tab">Button</button>
						<button id="item" class="spottable tab">Item</button>
					</div>
					<button id="btn1" class="spottable">Button 1</button>
					<button id="btn5" class="spottable">Button 5</button>
				</div>
			</div>
		`;
		setRect(document.getElementById('tabs-collapsed'), {left: 10, top: 100, width: 200, height: 400});
		setRect(document.getElementById('home'), {left: 20, top: 110});
		setRect(document.getElementById('gear'), {left: 20, top: 200});
		setRect(document.getElementById('item'), {left: 20, top: 290});
		// Same row as the sidebar Button tab; x still inside the partition rect width.
		setRect(document.getElementById('btn1'), {left: 120, top: 200});
		setRect(document.getElementById('btn5'), {left: 180, top: 200});

		configureDefaults({selector: '.spottable'});
		configureContainer(rootContainerId, {selector: '.spottable'});
		configureContainer('tabs-collapsed', {partition: true, selector: '.spottable'});

		const linear = getLinearTargetsInContainer(rootContainerId);
		expect(linear.map(({target: t}) => t.id)).toEqual(['home', 'gear', 'item', 'btn1', 'btn5']);
	});

	test('getLinearTargetsInContainer: orders partition groups in DOM order before visually overlapping controls', () => {
		document.body.innerHTML = `
			<div id="root" data-spotlight-container="true" data-spotlight-id="${rootContainerId}">
				<div id="tabs-collapsed" data-spotlight-container="true" data-spotlight-id="tabs-collapsed">
					<button id="home" class="spottable tab">Home</button>
					<button id="gear" class="spottable tab">Button</button>
					<button id="item" class="spottable tab">Item</button>
				</div>
				<button id="btn1" class="spottable">Button 1</button>
				<button id="btn2" class="spottable">Button 2</button>
				<button id="btn3" class="spottable">Button 3</button>
				<button id="btn4" class="spottable">Button 4</button>
				<button id="btn5" class="spottable">Button 5</button>
			</div>
		`;
		setRect(document.getElementById('tabs-collapsed'), {left: 10, top: 10, width: 60, height: 150});
		setRect(document.getElementById('home'), {left: 20, top: 20});
		setRect(document.getElementById('gear'), {left: 20, top: 60});
		setRect(document.getElementById('item'), {left: 20, top: 100});
		setRect(document.getElementById('btn1'), {left: 200, top: 60});
		setRect(document.getElementById('btn2'), {left: 280, top: 60});
		setRect(document.getElementById('btn3'), {left: 360, top: 60});
		setRect(document.getElementById('btn4'), {left: 440, top: 60});
		setRect(document.getElementById('btn5'), {left: 520, top: 60});

		configureDefaults({selector: '.spottable'});
		configureContainer(rootContainerId, {
			navigableFilter: (elem) => (
				elem.dataset.spotlightId !== 'tabs-collapsed' &&
				!elem.classList.contains('tab')
			),
			selector: '.spottable'
		});
		configureContainer('tabs-collapsed', {partition: true, selector: '.spottable'});

		const linear = getLinearTargetsInContainer(rootContainerId);
		expect(linear.map(({target: t}) => t.id)).toEqual([
			'home', 'gear', 'item', 'btn1', 'btn2', 'btn3', 'btn4', 'btn5'
		]);
	});

	test('getLinearTargetsInContainer: keeps partition sidebar before scrolled content in the same panel', () => {
		document.body.innerHTML = `
			<div id="root" data-spotlight-container="true" data-spotlight-id="${rootContainerId}">
				<div id="tabs-collapsed" data-spotlight-container="true" data-spotlight-id="tabs-collapsed">
					<button id="home" class="spottable tab">Home</button>
					<button id="gear" class="spottable tab">Button</button>
					<button id="item" class="spottable tab">Item</button>
				</div>
				<button id="img11" class="spottable">ImageItem 11</button>
				<button id="img12" class="spottable">ImageItem 12</button>
			</div>
		`;
		setRect(document.getElementById('tabs-collapsed'), {left: 10, top: 10, width: 60, height: 400});
		setRect(document.getElementById('home'), {left: 20, top: 20});
		setRect(document.getElementById('gear'), {left: 20, top: 200});
		setRect(document.getElementById('item'), {left: 20, top: 380});
		// Scrolled content: item 11 can sit above the sidebar Button tab in viewport coordinates.
		setRect(document.getElementById('img11'), {left: 300, top: 50});
		setRect(document.getElementById('img12'), {left: 300, top: 700});

		configureDefaults({selector: '.spottable'});
		configureContainer(rootContainerId, {selector: '.spottable'});
		configureContainer('tabs-collapsed', {partition: true, selector: '.spottable'});

		const linear = getLinearTargetsInContainer(rootContainerId);
		expect(linear.map(({target: t}) => t.id)).toEqual([
			'home', 'gear', 'item', 'img11', 'img12'
		]);
	});
});
