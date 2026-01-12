import '@testing-library/jest-dom';
import {act, fireEvent, renderHook} from '@testing-library/react';

// Mock all dependencies at the top level BEFORE importing useScroll
let mockRiScale;
let mockPlatform;

jest.mock('../../resolution', () => ({
	__esModule: true,
	default: {
		get scale() {
			return mockRiScale || ((val) => val);
		}
	}
}));

jest.mock('@enact/core/platform', () => ({
	__esModule: true,
	get platform() {
		return mockPlatform || {chrome: 120};
	}
}));

global.ResizeObserver = class ResizeObserver {
	constructor() {}
	observe() {}
	unobserve() {}
	disconnect() {}
};

// Import AFTER all mocks
import {useScrollBase} from '../useScroll';

// Helper function to create complete mock refs
function createMockRefs() {
	return {
		scrollContentHandle: {
			current: {
				getScrollBounds: jest.fn(() => ({
					clientWidth: 1920,
					clientHeight: 1080,
					scrollWidth: 1000,
					scrollHeight: 800,
					maxTop: 200,
					maxLeft: 200
				})),
				getMoreInfo: jest.fn(() => ({})),
				hasDataSizeChanged: false,
				syncClientSize: jest.fn(() => false),
				getRtlPositionX: jest.fn((x) => x),
				calculateMetrics: jest.fn(),
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
				startHidingScrollbarTrack: jest.fn()
			}
		},
		verticalScrollbarHandle: {
			current: {
				update: jest.fn(),
				getContainerRef: jest.fn(() => document.createElement('div')),
				startHidingScrollbarTrack: jest.fn()
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

			act(() => {
				fireEvent(window, new Event('resize'));
				jest.runAllTimers();
			});

			expect(itemSize.minWidth).toBe(200);
			expect(itemSize.minHeight).toBe(100);
		});

		test('should NOT scale when ri.scale(1) remains unchanged', () => {
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

			act(() => {
				fireEvent(window, new Event('resize'));
				jest.runAllTimers();
			});

			expect(itemSize.minWidth).toBe(100);
			expect(itemSize.minHeight).toBe(50);
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

		test('should round target position downwards when target is bi than current position', () => {
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
});