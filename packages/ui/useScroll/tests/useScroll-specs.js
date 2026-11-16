import '@testing-library/jest-dom';
import {act, fireEvent, renderHook} from '@testing-library/react';

// Mock all dependencies at the top level BEFORE importing useScroll
let mockRiScale;
let mockPlatform;

jest.mock('../../resolution', () => ({
	__esModule: true,
	default: {
		get scale () {
			return mockRiScale || ((val) => val);
		}
	}
}));

jest.mock('@enact/core/platform', () => ({
	__esModule: true,
	get platform () {
		return mockPlatform || {chrome: 120};
	}
}));

global.ResizeObserver = class ResizeObserver {
	constructor () {}
	observe () {}
	unobserve () {}
	disconnect () {}
};

// Import AFTER all mocks
import {useScrollBase} from '../useScroll';

// Helper function to create complete mock refs
function createMockRefs () {
	return {
		scrollContentHandle: {
			current: {
				getScrollBounds: jest.fn(() => ({
					clientWidth: 1920,
					clientHeight: 1080,
					scrollWidth: 2000,      // greater than clientWidth
					scrollHeight: 2000,     // greater than clientHeight
					maxTop: 920,            // 2000 - 1080 = 920
					maxLeft: 80             // 2000 - 1920 = 80
				})),
				getMoreInfo: jest.fn(() => ({})),
				hasDataSizeChanged: false,
				syncClientSize: jest.fn(() => false),
				getRtlPositionX: jest.fn((x) => x),
				calculateMetrics: jest.fn(),
				didScroll: jest.fn(),
				props: {}
			}
		},
		scrollContainerRef: {
			current: document.createElement('div')
		},
		scrollContentRef: {
			current: document.createElement('div')
		},
		horizontalScrollbarHandle: {
			current: {
				update: jest.fn(),
				getContainerRef: jest.fn(() => document.createElement('div')),
				startHidingScrollbarTrack: jest.fn(),
				showScrollbarTrack: jest.fn()
			}
		},
		verticalScrollbarHandle: {
			current: {
				update: jest.fn(),
				getContainerRef: jest.fn(() => document.createElement('div')),
				startHidingScrollbarTrack: jest.fn(),
				showScrollbarTrack: jest.fn()
			}
		}
	};
}

describe('useScroll', () => {
	describe('riRatio itemSize scaling on window resize', () => {
		beforeEach(() => {
			jest.useFakeTimers();
			mockPlatform = {chrome: 132};
		});

		afterEach(() => {
			jest.runOnlyPendingTimers();
			jest.useRealTimers();
		});

		test('should scale itemSize when ri.scale(1) changes from 1 to 2', () => {
			mockRiScale = jest.fn((val) => val);

			const itemSize = {
				minWidth: 100,
				minHeight: 50
			};

			const mocks = createMockRefs();
			const assignProperties = jest.fn();

			const props = {
				itemRenderer: jest.fn(),
				itemSize,
				direction: 'vertical',
				scrollMode: 'translate',
				...mocks,
				assignProperties,
				horizontalScrollbar: 'auto',
				verticalScrollbar: 'auto'
			};

			renderHook(() => useScrollBase(props));

			mockRiScale = jest.fn(() => 2);

			// eslint-disable-next-line testing-library/no-unnecessary-act
			act(() => {
				fireEvent(window, new Event('resize'));
				jest.runAllTimers();
			});

			// Original props object must not be mutated
			expect(itemSize.minWidth).toBe(100);
			expect(itemSize.minHeight).toBe(50);

			// The scaled values should be passed to scrollContentProps via assignProperties
			const scrollContentPropsCall = assignProperties.mock.calls.findLast(([name]) => name === 'scrollContentProps');
			const passedItemSize = scrollContentPropsCall?.[1]?.itemSize;

			expect(passedItemSize?.minWidth).toBe(200);
			expect(passedItemSize?.minHeight).toBe(100);
		});

		test('should scale itemSizes when ri.scale(1) changes from 1 to 2', () => {
			mockRiScale = jest.fn((val) => val);

			const itemSize = 100;
			const itemSizes = [100, 100, 100, 100, 100];

			const mocks = createMockRefs();
			const assignProperties = jest.fn();

			const props = {
				itemRenderer: jest.fn(),
				itemSize,
				itemSizes,
				direction: 'vertical',
				scrollMode: 'translate',
				...mocks,
				assignProperties,
				horizontalScrollbar: 'auto',
				verticalScrollbar: 'auto'
			};

			renderHook(() => useScrollBase(props));

			mockRiScale = jest.fn(() => 2);

			// eslint-disable-next-line testing-library/no-unnecessary-act
			act(() => {
				fireEvent(window, new Event('resize'));
				jest.runAllTimers();
			});

			// Original props array must not be mutated
			expect(itemSizes[1]).toBe(100);

			// The scaled values should be passed to scrollContentProps via assignProperties
			const scrollContentPropsCall = assignProperties.mock.calls.findLast(([name]) => name === 'scrollContentProps');
			const passedItemSizes = scrollContentPropsCall?.[1]?.itemSizes;

			expect(passedItemSizes?.[1]).toBe(200);
		});

		test('should NOT scale itemSize when ri.scale(1) remains unchanged', () => {
			mockRiScale = jest.fn((val) => val);

			const itemSize = {
				minWidth: 100,
				minHeight: 50
			};

			const mocks = createMockRefs();

			const props = {
				itemRenderer: jest.fn(),
				itemSize,
				direction: 'vertical',
				scrollMode: 'translate',
				...mocks,
				assignProperties: jest.fn(),
				horizontalScrollbar: 'auto',
				verticalScrollbar: 'auto'
			};

			renderHook(() => useScrollBase(props));

			// eslint-disable-next-line testing-library/no-unnecessary-act
			act(() => {
				fireEvent(window, new Event('resize'));
				jest.runAllTimers();
			});

			expect(itemSize.minWidth).toBe(100);
			expect(itemSize.minHeight).toBe(50);
		});

		test('should NOT scale itemSizes when ri.scale(1) remains unchanged', () => {
			mockRiScale = jest.fn((val) => val);

			const itemSize = 100;
			const itemSizes = [100, 100, 100, 100, 100];

			const mocks = createMockRefs();

			const props = {
				itemRenderer: jest.fn(),
				itemSize,
				itemSizes,
				direction: 'vertical',
				scrollMode: 'translate',
				...mocks,
				assignProperties: jest.fn(),
				horizontalScrollbar: 'auto',
				verticalScrollbar: 'auto'
			};

			renderHook(() => useScrollBase(props));

			// eslint-disable-next-line testing-library/no-unnecessary-act
			act(() => {
				fireEvent(window, new Event('resize'));
				jest.runAllTimers();
			});

			expect(itemSizes[1]).toBe(100);
		});

		test('should NOT scale when minWidth is missing', () => {
			mockRiScale = jest.fn((val) => val);

			const itemSize = {
				minHeight: 50
			};

			const mocks = createMockRefs();

			const props = {
				itemRenderer: jest.fn(),
				itemSize,
				direction: 'vertical',
				scrollMode: 'translate',
				...mocks,
				assignProperties: jest.fn(),
				horizontalScrollbar: 'auto',
				verticalScrollbar: 'auto'
			};

			renderHook(() => useScrollBase(props));

			mockRiScale = jest.fn(() => 2);

			// eslint-disable-next-line testing-library/no-unnecessary-act
			act(() => {
				fireEvent(window, new Event('resize'));
				jest.runAllTimers();
			});

			expect(itemSize.minHeight).toBe(50);
			expect(itemSize.minWidth).toBeUndefined();
		});

		test('should NOT scale when minHeight is missing', () => {
			mockRiScale = jest.fn((val) => val);

			const itemSize = {
				minWidth: 100
			};

			const mocks = createMockRefs();

			const props = {
				itemRenderer: jest.fn(),
				itemSize,
				direction: 'vertical',
				scrollMode: 'translate',
				...mocks,
				assignProperties: jest.fn(),
				horizontalScrollbar: 'auto',
				verticalScrollbar: 'auto'
			};

			renderHook(() => useScrollBase(props));

			mockRiScale = jest.fn(() => 2);

			// eslint-disable-next-line testing-library/no-unnecessary-act
			act(() => {
				fireEvent(window, new Event('resize'));
				jest.runAllTimers();
			});

			expect(itemSize.minWidth).toBe(100);
			expect(itemSize.minHeight).toBeUndefined();
		});
	});

	describe('Rounding target scroll position', () => {
		beforeEach(() => {
			jest.resetModules(); // important! clears cached modules
		});

		test('should round target position upwards when target is bigger than current position', () => {
			mockPlatform = {chrome: 132};

			const {roundTarget} = require('../useScroll');

			const currentPosition = {
				scrollPos: {
					left: 100,
					top: 100
				}
			};

			const {roundedTargetX, roundedTargetY} = roundTarget(currentPosition, 120.5, 120.4);

			expect(roundedTargetX).toEqual(121);
			expect(roundedTargetY).toEqual(121);
		});

		test('should round target position downwards when target is less than current position', () => {
			mockPlatform = {chrome: 132};

			const {roundTarget} = require('../useScroll');

			const currentPosition = {
				scrollPos: {
					left: 100,
					top: 100
				}
			};

			const {roundedTargetX, roundedTargetY} = roundTarget(currentPosition, 90.4, 80.8);

			expect(roundedTargetX).toEqual(90);
			expect(roundedTargetY).toEqual(80);
		});

		test('should not round target position when chrome <= 120', () => {
			mockPlatform = {chrome: 119};

			const {roundTarget} = require('../useScroll');

			const currentPosition = {
				scrollPos: {
					left: 100,
					top: 100
				}
			};

			const {roundedTargetX, roundedTargetY} = roundTarget(currentPosition, 90.4, 80.8);

			expect(roundedTargetX).toEqual(90.4);
			expect(roundedTargetY).toEqual(80.8);
		});
	});

	describe('Native scroll behavior', () => {
		beforeEach(() => {
			jest.useFakeTimers();
			mockPlatform = {chrome: 132};
			mockRiScale = jest.fn((val) => val);
		});

		afterEach(() => {
			jest.runOnlyPendingTimers();
			jest.useRealTimers();
		});

		test('should update scroll position from scroll event', () => {
			const mocks = createMockRefs();

			const props = {
				direction: 'vertical',
				scrollMode: 'native',
				...mocks,
				assignProperties: jest.fn(),
				horizontalScrollbar: 'auto',
				verticalScrollbar: 'auto'
			};

			renderHook(() => useScrollBase(props));

			const scrollEvent = new Event('scroll');
			Object.defineProperty(scrollEvent, 'target', {
				value: {scrollLeft: 50, scrollTop: 150},
				writable: false
			});

			// eslint-disable-next-line testing-library/no-unnecessary-act
			act(() => {
				fireEvent(mocks.scrollContentRef.current, scrollEvent);
			});

			expect(mocks.scrollContentHandle.current.didScroll).toHaveBeenCalledWith(50, 150);
		});

		test('should handle RTL scroll position correctly', () => {
			const mocks = createMockRefs();
			mockPlatform = {chrome: 132};

			const props = {
				direction: 'horizontal',
				scrollMode: 'native',
				rtl: true,
				...mocks,
				addEventListeners: jest.fn(),
				assignProperties: jest.fn(),
				horizontalScrollbar: 'auto',
				verticalScrollbar: 'auto'
			};

			renderHook(() => useScrollBase(props));

			const scrollEvent = new Event('scroll');
			Object.defineProperty(scrollEvent, 'target', {
				value: {scrollLeft: -50, scrollTop: 0}
			});

			// eslint-disable-next-line testing-library/no-unnecessary-act
			act(() => {
				fireEvent(mocks.scrollContentRef.current, scrollEvent);
			});

			expect(mocks.scrollContentHandle.current.didScroll).toHaveBeenCalledWith(50, 0);
		});
	});

	describe('onKeyDown repeat handling (native scroll mode)', () => {
		beforeEach(() => {
			jest.useFakeTimers();
			mockPlatform = {chrome: 132};
			mockRiScale = jest.fn((val) => val);
		});

		afterEach(() => {
			jest.runOnlyPendingTimers();
			jest.useRealTimers();
		});

		function createNativeScrollProps (mocks, extra = {}) {
			return {
				direction: 'vertical',
				scrollMode: 'native',
				...mocks,
				assignProperties: jest.fn(),
				horizontalScrollbar: 'auto',
				verticalScrollbar: 'auto',
				...extra
			};
		}

		test('should forward onKeyDown event when key is not repeated', () => {
			const mocks = createMockRefs();
			const onKeyDown = jest.fn();
			const props = createNativeScrollProps(mocks, {onKeyDown});

			renderHook(() => useScrollBase(props));

			// eslint-disable-next-line testing-library/no-unnecessary-act
			act(() => {
				fireEvent.keyDown(mocks.scrollContainerRef.current, {keyCode: 40, repeat: false});
			});

			expect(onKeyDown).toHaveBeenCalledTimes(1);
		});

		test('should not forward onKeyDown event when arrowKey is repeated and lastInputType is arrowKey', () => {
			const mocks = createMockRefs();
			const onKeyDown = jest.fn();
			let scrollContainerHandle = null;

			const props = createNativeScrollProps(mocks, {
				onKeyDown,
				setScrollContainerHandle: (handle) => {
					scrollContainerHandle = handle;
				}
			});

			renderHook(() => useScrollBase(props));

			// Set lastInputType to arrowKey via the exposed themeScrollContainerHandle
			act(() => {
				if (scrollContainerHandle) {
					scrollContainerHandle.lastInputType = 'arrowKey';
				}
			});

			// eslint-disable-next-line testing-library/no-unnecessary-act
			act(() => {
				fireEvent.keyDown(mocks.scrollContainerRef.current, {keyCode: 40, repeat: true});
			});

			expect(onKeyDown).not.toHaveBeenCalled();
		});

		test('should not forward onKeyDown event when pageKey is repeated and lastInputType is pageKey', () => {
			const mocks = createMockRefs();
			const onKeyDown = jest.fn();
			let scrollContainerHandle = null;

			const props = createNativeScrollProps(mocks, {
				onKeyDown,
				setScrollContainerHandle: (handle) => {
					scrollContainerHandle = handle;
				}
			});

			renderHook(() => useScrollBase(props));

			// Set lastInputType to pageKey via the exposed themeScrollContainerHandle
			act(() => {
				if (scrollContainerHandle) {
					scrollContainerHandle.lastInputType = 'pageKey';
				}
			});

			// eslint-disable-next-line testing-library/no-unnecessary-act
			act(() => {
				fireEvent.keyDown(mocks.scrollContainerRef.current, {keyCode: 33, repeat: true});
			});

			expect(onKeyDown).not.toHaveBeenCalled();
		});

		test('should forward onKeyDown event when repeat is true but lastInputType is neither arrowKey nor pageKey', () => {
			const mocks = createMockRefs();
			const onKeyDown = jest.fn();
			let scrollContainerHandle = null;

			const props = createNativeScrollProps(mocks, {
				onKeyDown,
				setScrollContainerHandle: (handle) => {
					scrollContainerHandle = handle;
				}
			});

			renderHook(() => useScrollBase(props));

			// Set lastInputType to wheel (not arrowKey or pageKey)
			act(() => {
				if (scrollContainerHandle) {
					scrollContainerHandle.lastInputType = 'wheel';
				}
			});

			// eslint-disable-next-line testing-library/no-unnecessary-act
			act(() => {
				fireEvent.keyDown(mocks.scrollContainerRef.current, {keyCode: 40, repeat: true});
			});

			expect(onKeyDown).toHaveBeenCalledTimes(1);
		});
	});

	describe('scroll motion', () => {
		const realRaf = window.requestAnimationFrame;
		const realCancel = window.cancelAnimationFrame;
		const realNow = performance.now;
		let now;
		let next;

		beforeEach(() => {
			mockPlatform = {chrome: 120};
			mockRiScale = (val) => val;
			now = 1000;
			next = null;
			performance.now = () => now;
			window.requestAnimationFrame = (callback) => {
				next = callback;
				return 1;
			};
			window.cancelAnimationFrame = () => {
				next = null;
			};
			if (!('onscrollend' in window)) {
				window.onscrollend = null;
			}
		});

		afterEach(() => {
			performance.now = realNow;
			window.requestAnimationFrame = realRaf;
			window.cancelAnimationFrame = realCancel;
			jest.useRealTimers();
		});

		const bounds = {
			clientWidth: 1920,
			clientHeight: 1080,
			scrollWidth: 2000,
			scrollHeight: 2000,
			maxTop: 920,
			maxLeft: 80
		};

		const token = (overrides) => ({
			delay: 0,
			duration: 600,
			ease: (progress) => progress,
			...overrides
		});

		function renderScroll (extra = {}) {
			const mocks = createMockRefs();
			mocks.scrollContentHandle.current.getScrollBounds = () => bounds;
			mocks.scrollContentHandle.current.scrollToPosition = jest.fn();
			mocks.scrollContentHandle.current.setScrollPosition = jest.fn();
			let handle = null;

			renderHook(() => useScrollBase({
				direction: 'vertical',
				scrollMode: 'native',
				...mocks,
				assignProperties: jest.fn(),
				horizontalScrollbar: 'auto',
				verticalScrollbar: 'auto',
				onKeyDown: jest.fn(),
				setScrollContainerHandle: (value) => {
					handle = value;
				},
				...extra
			}));

			return {
				mocks,
				get handle () {
					return handle;
				}
			};
		}

		function emitScroll (node, top = 10, left = 0) {
			const event = new Event('scroll');
			Object.defineProperty(event, 'target', {value: {scrollLeft: left, scrollTop: top}});
			fireEvent(node, event);
		}

		function emitScrollEnd (node) {
			fireEvent(node, new Event('scrollend'));
		}

		test('should interpolate a native scroll with the motion token', () => {
			const themeStart = jest.fn();
			const {mocks, handle} = renderScroll({
				getScrollMotion: () => token(),
				start: themeStart
			});

			act(() => {
				handle.start({targetX: 0, targetY: 100});
			});

			expect(themeStart).toHaveBeenCalledWith(true);

			act(() => {
				next(1300);
			});

			expect(mocks.scrollContentHandle.current.scrollToPosition).toHaveBeenCalledWith(0, 50, 'instant');

			act(() => {
				next(1600);
			});

			expect(mocks.scrollContentHandle.current.scrollToPosition).toHaveBeenLastCalledWith(0, 100, 'instant');
		});

		test('should keep the browser smooth scroll when no motion token is set', () => {
			const {mocks, handle} = renderScroll();

			act(() => {
				handle.start({targetX: 0, targetY: 100});
			});

			const call = mocks.scrollContentHandle.current.scrollToPosition.mock.calls[0];
			expect(call.slice(0, 3)).toEqual([0, 100, 'smooth']);
			expect(call[3]).toBeFalsy();
		});

		test('should scroll instantly when animation is disabled', () => {
			const themeStart = jest.fn();
			const {mocks, handle} = renderScroll({start: themeStart});

			act(() => {
				handle.start({targetX: 0, targetY: 40, animate: false});
			});

			expect(mocks.scrollContentHandle.current.scrollToPosition).toHaveBeenCalledWith(0, 40, 'instant');
			expect(themeStart).toHaveBeenCalledWith(false);
		});

		test('should wait for the token delay before starting', () => {
			jest.useFakeTimers({doNotFake: ['cancelAnimationFrame', 'performance', 'requestAnimationFrame']});
			now = 1000;
			performance.now = () => now;
			window.requestAnimationFrame = (callback) => {
				next = callback;
				return 1;
			};
			window.cancelAnimationFrame = () => {
				next = null;
			};
			const {mocks, handle} = renderScroll({
				getScrollMotion: () => token({delay: 30})
			});

			act(() => {
				handle.start({targetX: 0, targetY: 100});
			});

			expect(next).toBeNull();

			act(() => {
				jest.advanceTimersByTime(30);
			});

			expect(next).toEqual(expect.any(Function));
			expect(mocks.scrollContentHandle.current.scrollToPosition).not.toHaveBeenCalled();
		});

		test('should ignore a native scroll that repeats the current target', () => {
			const {mocks, handle} = renderScroll({
				getScrollMotion: () => token()
			});

			act(() => {
				handle.start({targetX: 0, targetY: 100});
				emitScroll(mocks.scrollContentRef.current);
			});

			const scheduled = next;

			act(() => {
				handle.start({targetX: 0, targetY: 100});
			});

			expect(next).toBe(scheduled);
			expect(mocks.scrollContentHandle.current.scrollToPosition).not.toHaveBeenCalled();
		});

		test('should aim a motion scroll at the end of the range', () => {
			const applyOverscrollEffect = jest.fn();
			const {mocks, handle} = renderScroll({
				applyOverscrollEffect,
				getScrollMotion: () => token()
			});

			act(() => {
				handle.start({targetX: 0, targetY: 2000, overscrollEffect: true});
			});

			act(() => {
				now = 1600;
				next(1600);
			});

			expect(mocks.scrollContentHandle.current.scrollToPosition).toHaveBeenLastCalledWith(0, bounds.maxTop, 'instant');
			expect(applyOverscrollEffect).not.toHaveBeenCalled();

			// eslint-disable-next-line testing-library/no-unnecessary-act
			act(() => {
				emitScroll(mocks.scrollContentRef.current, bounds.maxTop, 0);
				const scrollEnd = new Event('scrollend');
				Object.defineProperty(scrollEnd, 'target', {value: {scrollLeft: 0, scrollTop: bounds.maxTop}});
				fireEvent(mocks.scrollContentRef.current, scrollEnd);
			});

			act(() => {
				handle.start({targetX: 0, targetY: bounds.maxTop + 400, overscrollEffect: true});
			});

			expect(applyOverscrollEffect).toHaveBeenCalledWith('vertical', 'after', 2, 0.5);
		});

		test('should retarget a native scroll when the target changes while scrolling', () => {
			const {mocks, handle} = renderScroll({
				getScrollMotion: () => token()
			});

			act(() => {
				handle.start({targetX: 0, targetY: 100});
				emitScroll(mocks.scrollContentRef.current, 20, 0);
			});

			act(() => {
				handle.start({targetX: 0, targetY: 180});
			});

			act(() => {
				now = 1600;
				next(1600);
			});

			expect(mocks.scrollContentHandle.current.scrollToPosition).toHaveBeenLastCalledWith(0, 180, 'instant');
		});

		test('should apply overscroll on both axes when a scroll starts', () => {
			const {mocks, handle} = renderScroll({
				direction: 'both',
				applyOverscrollEffect: jest.fn()
			});

			act(() => {
				handle.start({targetX: 80, targetY: 920, overscrollEffect: true});
			});

			const call = mocks.scrollContentHandle.current.scrollToPosition.mock.calls[0];
			expect(call.slice(0, 3)).toEqual([80, 920, 'smooth']);
			expect(call[3]).toBeFalsy();
		});

		test('should ease a horizontal translate scroll with the motion token', () => {
			const {mocks, handle} = renderScroll({
				direction: 'horizontal',
				scrollMode: 'translate',
				getScrollMotion: () => token()
			});

			act(() => {
				handle.start({targetX: 40, targetY: 0});
			});
			act(() => {
				next();
			});

			expect(mocks.scrollContentHandle.current.setScrollPosition).toHaveBeenCalled();
		});

		test('should not accept scrollend while a motion scroll is running', () => {
			const scrollStopOnScroll = jest.fn();
			const {mocks, handle} = renderScroll({
				getScrollMotion: () => token(),
				scrollStopOnScroll
			});

			act(() => {
				handle.start({targetX: 0, targetY: 100});
				emitScroll(mocks.scrollContentRef.current);
				emitScrollEnd(mocks.scrollContentRef.current);
			});

			expect(scrollStopOnScroll).not.toHaveBeenCalled();
		});

		test('should accept scrollend when the motion scroll is not running', () => {
			const scrollStopOnScroll = jest.fn();
			const {mocks} = renderScroll({scrollStopOnScroll});

			act(() => {
				emitScroll(mocks.scrollContentRef.current);
				emitScrollEnd(mocks.scrollContentRef.current);
			});

			expect(scrollStopOnScroll).toHaveBeenCalled();
		});

		test('should ignore scrollend while a key is held or the content is scrolling', () => {
			const scrollStopOnScroll = jest.fn();
			const {mocks} = renderScroll({scrollStopOnScroll});

			emitScroll(mocks.scrollContentRef.current);
			fireEvent.keyDown(mocks.scrollContainerRef.current, {keyCode: 40, repeat: true});
			emitScrollEnd(mocks.scrollContentRef.current);

			expect(scrollStopOnScroll).not.toHaveBeenCalled();

			fireEvent.keyUp(mocks.scrollContainerRef.current, {keyCode: 40});
			mocks.scrollContentHandle.current.scrolling = true;
			emitScrollEnd(mocks.scrollContentRef.current);

			expect(scrollStopOnScroll).not.toHaveBeenCalled();
		});

		test('should skip the native scroll when the content handle is gone', () => {
			const {mocks, handle} = renderScroll();
			const inner = mocks.scrollContentHandle.current;
			let reads = 0;

			Object.defineProperty(mocks.scrollContentHandle, 'current', {
				configurable: true,
				get () {
					reads += 1;
					return reads < 4 ? inner : null;
				}
			});

			act(() => {
				handle.start({targetX: 0, targetY: 100});
			});

			expect(inner.scrollToPosition).not.toHaveBeenCalled();
		});

		test('should skip a motion frame when the content handle is gone', () => {
			const {mocks, handle} = renderScroll({
				getScrollMotion: () => token()
			});
			const scrollToPosition = mocks.scrollContentHandle.current.scrollToPosition;

			act(() => {
				handle.start({targetX: 0, targetY: 100});
			});
			mocks.scrollContentHandle.current = null;

			act(() => {
				next(1600);
			});

			expect(scrollToPosition).not.toHaveBeenCalled();
		});
	});
});
