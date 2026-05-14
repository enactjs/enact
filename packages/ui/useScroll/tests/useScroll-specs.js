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
				scrollToPosition: jest.fn(),
				scrollPos: {left: 0, top: 0},
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
	describe('Rounding target scroll position', () => {
		beforeEach(() => {
			jest.resetModules(); // important! clears cached modules
		});

		test('should round target position upwards when target is bigger than current position', () => {
			jest.doMock('@enact/core/platform', () => ({
				__esModule: true,
				platform: {chrome: 132}
			}));

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

		test('should round target position downwards when target is bigger than current position', () => {
			jest.doMock('@enact/core/platform', () => ({
				__esModule: true,
				platform: {chrome: 132}
			}));

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
			jest.doMock('@enact/core/platform', () => ({
				__esModule: true,
				platform: {chrome: 119}
			}));

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

	describe('Native scroll behavior determination (long press / arrowKey)', () => {
		let containerHandle;

		beforeEach(() => {
			jest.useFakeTimers();
			mockPlatform = {chrome: 132};
			mockRiScale = jest.fn((val) => val);
			containerHandle = null;
		});

		afterEach(() => {
			jest.runOnlyPendingTimers();
			jest.useRealTimers();
		});

		function createNativeProps (mocks) {
			return {
				direction: 'vertical',
				scrollMode: 'native',
				...mocks,
				assignProperties: jest.fn(),
				horizontalScrollbar: 'auto',
				verticalScrollbar: 'auto',
				setScrollContainerHandle: (handle) => {
					containerHandle = handle;
				}
			};
		}

		test('should use smooth behavior when animate is true and not scrolling', () => {
			const mocks = createMockRefs();
			renderHook(() => useScrollBase(createNativeProps(mocks)));

			act(() => {
				containerHandle.lastInputType = 'arrowKey';
				// scrolling is false by default
				containerHandle.start({targetX: 0, targetY: 100, animate: true});
			});

			expect(mocks.scrollContentHandle.current.scrollToPosition).toHaveBeenCalledWith(
				expect.any(Number),
				expect.any(Number),
				'smooth'
			);
		});

		test('should use instant behavior when animate is true but already scrolling with arrowKey (long press)', () => {
			const mocks = createMockRefs();
			renderHook(() => useScrollBase(createNativeProps(mocks)));

			act(() => {
				// Simulate an in-progress native scroll to set scrolling=true
				const scrollEvent = new Event('scroll');
				Object.defineProperty(scrollEvent, 'target', {value: {scrollLeft: 0, scrollTop: 50}});
				fireEvent(mocks.scrollContentRef.current, scrollEvent);
			});

			act(() => {
				containerHandle.lastInputType = 'arrowKey';
				containerHandle.start({targetX: 0, targetY: 200, animate: true});
			});

			const calls = mocks.scrollContentHandle.current.scrollToPosition.mock.calls;
			const lastCall = calls[calls.length - 1];
			expect(lastCall[2]).toBe('instant');
		});

		test('should use smooth behavior when animate is true, scrolling, but lastInputType is not arrowKey', () => {
			const mocks = createMockRefs();
			renderHook(() => useScrollBase(createNativeProps(mocks)));

			act(() => {
				const scrollEvent = new Event('scroll');
				Object.defineProperty(scrollEvent, 'target', {value: {scrollLeft: 0, scrollTop: 50}});
				fireEvent(mocks.scrollContentRef.current, scrollEvent);
			});

			act(() => {
				containerHandle.lastInputType = 'drag';
				containerHandle.start({targetX: 0, targetY: 200, animate: true});
			});

			const calls = mocks.scrollContentHandle.current.scrollToPosition.mock.calls;
			const lastCall = calls[calls.length - 1];
			expect(lastCall[2]).toBe('smooth');
		});

		test('should use instant behavior when animate is false regardless of lastInputType', () => {
			const mocks = createMockRefs();
			renderHook(() => useScrollBase(createNativeProps(mocks)));

			act(() => {
				containerHandle.lastInputType = 'drag';
				containerHandle.start({targetX: 0, targetY: 100, animate: false});
			});

			expect(mocks.scrollContentHandle.current.scrollToPosition).toHaveBeenCalledWith(
				expect.any(Number),
				expect.any(Number),
				'instant'
			);
		});
	});
});
