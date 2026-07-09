// Public Spotlight API and Tab handoff across multi-popup scenarios.

import {
	configureContainer,
	configureDefaults,
	containerAttribute,
	removeAllContainers,
	rootContainerId,
	setLastContainer
} from '../container';
import Spotlight from '../spotlight';
import {findLinearTabExitTarget} from '../tabTraversal';

import {
	captureHandlers,
	dispatchTab,
	focusForTest,
	installTabTestEnvironment,
	setupPopupDocument,
	setupTabHandoffScenario,
	teardownTabTest,
	uninstallTabTestEnvironment
} from './tab-fixtures';

import {
	container,
	join,
	node,
	someSpottables,
	spottable,
	testScenario
} from './utils';

const nonSpottable = () => node({className: 'other'});

const scenarios = {
	complexTree: join(
		spottable({'data-spotlight-id': 's1'}),
		spottable(nonSpottable()),
		container({[containerAttribute]: 'first-container', children: join(
			someSpottables(2),
			container({[containerAttribute]: 'second-container', children: join(
				spottable({id: 'secondContainerFirstSpottable'}),
				someSpottables(2),
				container({
					[containerAttribute]: 'third-container',
					'data-spotlight-container-disabled': true,
					children: join(
						someSpottables(4),
						node({id: 'child-of-third'})
					)
				})
			)})
		)})
	)
};

const setupContainers = () => {
	Spotlight.setPointerMode(false);
	configureDefaults({
		selector: '.spottable'
	});
	configureContainer(rootContainerId);
	setLastContainer(rootContainerId);
};

const teardownContainers = () => {
	removeAllContainers();
	document.body.innerHTML = '';
};

const mockFocus = (n) => {
	const fn = jest.fn().mockImplementation(() => true);
	Object.defineProperty(n, 'focus', {
		get: () => fn
	});

	return fn;
};

describe('Spotlight', () => {
	describe('#focus', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		test('should focus spottable by id', testScenario(
			scenarios.complexTree,
			(root) => {
				const fn = mockFocus(root.querySelector('[data-spotlight-id="s1"]'));
				Spotlight.focus('s1');

				expect(fn).toHaveBeenCalled();
			}
		));

		test('should focus container by id', testScenario(
			scenarios.complexTree,
			(root) => {
				configureContainer('first-container');

				const fn = mockFocus(root.querySelector('[data-spotlight-id="first-container"] > .spottable'));
				Spotlight.focus('first-container');

				expect(fn).toHaveBeenCalled();
			}
		));

		test('should focus spottable by node', testScenario(
			scenarios.complexTree,
			(root) => {
				const n = root.querySelector('[data-spotlight-id="s1"]');
				const fn = mockFocus(n);
				Spotlight.focus(n);

				expect(fn).toHaveBeenCalled();
			}
		));

		test('should focus container by node', testScenario(
			scenarios.complexTree,
			(root) => {
				configureContainer('first-container');

				const n = root.querySelector('[data-spotlight-id="first-container"]');
				const fn = mockFocus(n.querySelector('.spottable'));
				Spotlight.focus(n);

				expect(fn).toHaveBeenCalled();
			}
		));

		test('should focus spottable by selector', testScenario(
			scenarios.complexTree,
			(root) => {
				const n = root.querySelector('[data-spotlight-id="s1"]');
				const fn = mockFocus(n);
				Spotlight.focus('[data-spotlight-id="s1"]');

				expect(fn).toHaveBeenCalled();
			}
		));

		test('should focus container by selector', testScenario(
			scenarios.complexTree,
			(root) => {
				configureContainer('first-container');

				const n = root.querySelector('[data-spotlight-id="first-container"]');
				const fn = mockFocus(n.querySelector('.spottable'));
				Spotlight.focus('[data-spotlight-id="first-container"]');

				expect(fn).toHaveBeenCalled();
			}
		));

		test('should pass preventScroll option', testScenario(
			scenarios.complexTree,
			(root) => {
				const fn = mockFocus(root.querySelector('[data-spotlight-id="s1"]'));
				Spotlight.focus('s1', {preventScroll: true});

				expect(fn).toHaveBeenCalledWith({preventScroll: true});
			}
		));
	});

	describe('#move', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		test('should return false when the direction is not one of \'left\', \'right\', \'up\' or \'down\'', testScenario(
			scenarios.complexTree,
			() => {
				const actual = Spotlight.move('leeeft');
				expect(actual).toBe(false);
			}
		));
	});

	describe('#initialize', () => {
		beforeEach(() => {
			jest.spyOn(window, 'addEventListener').mockImplementationOnce(() => {});
		});
		afterEach(() => {
			window.addEventListener.mockRestore();
		});

		test('should register event listener of several event types', () => {
			Spotlight.initialize();

			expect(window.addEventListener).toHaveBeenCalledWith('blur', expect.any(Function));
			expect(window.addEventListener).toHaveBeenCalledWith('focus', expect.any(Function));
			expect(window.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
			expect(window.addEventListener).toHaveBeenCalledWith('keyup', expect.any(Function));
			expect(window.addEventListener).toHaveBeenCalledWith('mouseover', expect.any(Function));
			expect(window.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
		});
	});

	describe('#terminate', () => {
		beforeEach(() => {
			jest.spyOn(window, 'removeEventListener').mockImplementationOnce(() => {});
		});
		afterEach(() => {
			window.removeEventListener.mockRestore();
		});

		test('should remove event listener of several event types', () => {
			Spotlight.terminate();

			expect(window.removeEventListener).toHaveBeenCalledWith('blur', expect.any(Function));
			expect(window.removeEventListener).toHaveBeenCalledWith('focus', expect.any(Function));
			expect(window.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
			expect(window.removeEventListener).toHaveBeenCalledWith('keyup', expect.any(Function));
			expect(window.removeEventListener).toHaveBeenCalledWith('mouseover', expect.any(Function));
			expect(window.removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
		});
	});

	describe('tabTraversal — findLinearTabExitTarget', () => {
		afterEach(teardownTabTest);

		test('should find a DOM element target when tabbing forward out of a popup with two open', () => {
			setupTabHandoffScenario({openA: true, openB: true, openC: false});
			const next = findLinearTabExitTarget(document.getElementById('a5'), 'popup-a', true);

			expect(next).not.toBeNull();
			expect(next.id).toBe('b1');
		});

		test('should find a DOM element target when shift-tabbing backward out of a popup', () => {
			setupTabHandoffScenario({openA: true, openB: true, openC: false});
			const previous = findLinearTabExitTarget(document.getElementById('b1'), 'popup-b', false);

			expect(previous).not.toBeNull();
			expect(previous.id).toBe('a5');
		});

		test('should chain forward handoff a5 -> b1, b5 -> c1, c5 -> closeX when three popups are open', () => {
			setupTabHandoffScenario({openA: true, openB: true, openC: true});
			const fromA = findLinearTabExitTarget(document.getElementById('a5'), 'popup-a', true);
			const fromB = findLinearTabExitTarget(document.getElementById('b5'), 'popup-b', true);
			const fromC = findLinearTabExitTarget(document.getElementById('c5'), 'popup-c', true);

			expect(fromA).not.toBeNull();
			expect(fromA.id).toBe('b1');
			expect(fromB).not.toBeNull();
			expect(fromB.id).toBe('c1');
			expect(fromC).not.toBeNull();
			expect(fromC.id).toBe('closeX');
		});

		test('should return null when popup container id is invalid', () => {
			setupTabHandoffScenario({openA: true, openB: true, openC: false});
			const result = findLinearTabExitTarget(document.getElementById('a5'), 'missing-popup', true);

			expect(result).toBeNull();
		});

		test('should find a DOM element target when the adjacent popup is closed', () => {
			setupTabHandoffScenario({openA: true, openB: false, openC: false});
			const next = findLinearTabExitTarget(document.getElementById('a5'), 'popup-a', true);

			expect(next).not.toBeNull();
			expect(next.id).toBe('bOwner');
		});
	});

	describe('Tab keydown (integration — real modules, real DOM, real keydown events)', () => {
		let onKeyDown;

		beforeAll(installTabTestEnvironment);
		afterAll(uninstallTabTestEnvironment);

		beforeEach(() => {
			Spotlight.terminate();
			onKeyDown = captureHandlers().keydown;
			Spotlight.setPointerMode(false);
		});

		afterEach(teardownTabTest);

		test('should move focus from popup-a last option to popup-b first option on Tab', () => {
			setupPopupDocument();
			setLastContainer('popup-a');
			focusForTest(document.getElementById('a2'));

			const ev = dispatchTab(onKeyDown);

			expect(ev.preventDefault).toHaveBeenCalled();
			expect(document.activeElement.id).toBe('b1');
		});

		test('should move focus from popup-b first option back to popup-a last option on Shift+Tab', () => {
			setupPopupDocument();
			setLastContainer('popup-b');
			focusForTest(document.getElementById('b1'));

			const ev = dispatchTab(onKeyDown, true);

			expect(ev.preventDefault).toHaveBeenCalled();
			expect(document.activeElement.id).toBe('a2');
		});

		test('should hand off to trigger button ownerB when it has no aria-owns', () => {
			setupPopupDocument();
			document.getElementById('ownerB').removeAttribute('aria-owns');
			setLastContainer('popup-a');
			focusForTest(document.getElementById('a2'));

			const ev = dispatchTab(onKeyDown);

			expect(ev.preventDefault).toHaveBeenCalled();
			expect(document.activeElement.id).toBe('ownerB');
		});

		test('should chain Tab across three open popups: a5 → b1, b5 → c1, c5 → closeX', () => {
			setupTabHandoffScenario({openA: true, openB: true, openC: true});

			setLastContainer('popup-a');
			focusForTest(document.getElementById('a5'));
			let ev = dispatchTab(onKeyDown);
			expect(ev.preventDefault).toHaveBeenCalled();
			expect(document.activeElement.id).toBe('b1');

			setLastContainer('popup-b');
			focusForTest(document.getElementById('b5'));
			ev = dispatchTab(onKeyDown);
			expect(ev.preventDefault).toHaveBeenCalled();
			expect(document.activeElement.id).toBe('c1');

			setLastContainer('popup-c');
			focusForTest(document.getElementById('c5'));
			ev = dispatchTab(onKeyDown);
			expect(ev.preventDefault).toHaveBeenCalled();
			expect(document.activeElement.id).toBe('closeX');
		});

		test('should hand off to nearest owner button when adjacent popup is closed', () => {
			setupTabHandoffScenario({openA: true, openB: false, openC: false});
			setLastContainer('popup-a');
			focusForTest(document.getElementById('a5'));

			const ev = dispatchTab(onKeyDown);

			expect(ev.preventDefault).toHaveBeenCalled();
			expect(document.activeElement.id).toBe('bOwner');
		});
	});

});
