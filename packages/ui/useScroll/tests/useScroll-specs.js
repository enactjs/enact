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
});
