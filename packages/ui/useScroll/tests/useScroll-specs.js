import '@testing-library/jest-dom';

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
			// eslint-disable-next-line testing-library/no-unnecessary-act
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
			// eslint-disable-next-line testing-library/no-unnecessary-act
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
			// eslint-disable-next-line testing-library/no-unnecessary-act
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
