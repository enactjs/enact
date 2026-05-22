import '@testing-library/jest-dom';

const mockPlatform = {};

jest.mock('@enact/core/platform', () => ({
	get platform () {
		return mockPlatform;
	}
}));

import {ScrollerBasic} from '../Scroller';

describe('ScrollBasic', () => {
	let scrollContentRef;

	beforeEach(() => {
		jest.createMockFromModule('@enact/core/platform');

		scrollContentRef = {
			current: {
				scrollLeft: 0,
				scrollTop: 0,
				scrollBy: jest.fn(),
				scrollTo: jest.fn()
			}
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test(
		'should call scrollTo on scrollToPosition',
		() => {
			const instance = new ScrollerBasic({scrollContentRef, direction: 'both'});

			instance.scrollToPosition(100, 200, 'smooth');
			expect(scrollContentRef.current.scrollTo).toHaveBeenCalledWith({left: 100, top: 200, behavior: 'smooth'});

			instance.scrollToPosition(100, 200, 'instant');
			expect(scrollContentRef.current.scrollTo).toHaveBeenCalledWith({left: 100, top: 200, behavior: 'instant'});
		}
	);

	test(
		'should cancel pending animation before calling scrollTo on scrollToPosition',
		() => {
			const instance = new ScrollerBasic({scrollContentRef, direction: 'both'});
			const mockAnimationId = 42;
			instance.scrollAnimationId = mockAnimationId;

			window.cancelAnimationFrame = jest.fn();

			instance.scrollToPosition(100, 200, 'instant');

			expect(window.cancelAnimationFrame).toHaveBeenCalledWith(mockAnimationId);
			expect(instance.scrollAnimationId).toBeNull();
			expect(scrollContentRef.current.scrollTo).toHaveBeenCalledWith({left: 100, top: 200, behavior: 'instant'});
		}
	);

	test(
		'should not call cancelAnimationFrame when scrollAnimationId is null on scrollToPosition',
		() => {
			const instance = new ScrollerBasic({scrollContentRef, direction: 'both'});
			instance.scrollAnimationId = null;

			window.cancelAnimationFrame = jest.fn();

			instance.scrollToPosition(100, 200, 'instant');

			expect(window.cancelAnimationFrame).not.toHaveBeenCalled();
		}
	);

	test(
		'should call animateScroll instead of scrollTo when platform is Chrome, behavior is smooth, and repeat is true',
		() => {
			mockPlatform.chrome = 132;

			const instance = new ScrollerBasic({scrollContentRef, direction: 'both'});
			instance.animateScroll = jest.fn();

			instance.scrollToPosition(100, 200, 'smooth', true);

			expect(instance.animateScroll).toHaveBeenCalledWith(100, 200, scrollContentRef.current);
			expect(scrollContentRef.current.scrollTo).not.toHaveBeenCalled();

			delete mockPlatform.chrome;
		}
	);

	describe('animateScroll', () => {
		let rafCallbacks;
		let rafIdCounter;
		let nowValue;

		beforeEach(() => {
			rafCallbacks = [];
			rafIdCounter = 1;
			nowValue = 0;

			window.requestAnimationFrame = jest.fn((cb) => {
				const id = rafIdCounter++;
				rafCallbacks.push({id, cb});
				return id;
			});
			window.cancelAnimationFrame = jest.fn((id) => {
				rafCallbacks = rafCallbacks.filter((entry) => entry.id !== id);
			});

			jest.spyOn(performance, 'now').mockImplementation(() => nowValue);
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		function flushRaf (time) {
			nowValue = time;
			const callbacks = rafCallbacks.splice(0);
			callbacks.forEach(({cb}) => cb(time));
		}

		test(
			'should call scrollBy with a dynamic step (10% of remaining distance) during animateScroll',
			() => {
				scrollContentRef.current.scrollLeft = 0;
				scrollContentRef.current.scrollTop = 0;

				const instance = new ScrollerBasic({scrollContentRef, direction: 'both'});
				const node = scrollContentRef.current;

				instance.animateScroll(200, 100, node);

				// First frame at t=0
				flushRaf(0);

				expect(node.scrollBy).toHaveBeenCalledWith(expect.objectContaining({
					left: expect.closeTo(20, 1),  // 10% of 200
					top: expect.closeTo(10, 1),   // 10% of 100
					behavior: 'instant'
				}));
			}
		);

		test(
			'should use minimum step of 8px when remaining distance is less than 80px',
			() => {
				scrollContentRef.current.scrollLeft = 0;
				scrollContentRef.current.scrollTop = 0;

				const instance = new ScrollerBasic({scrollContentRef, direction: 'both'});
				const node = scrollContentRef.current;

				// 50px remaining → 10% = 5px < 8px minimum
				instance.animateScroll(50, 50, node);

				flushRaf(0);

				expect(node.scrollBy).toHaveBeenCalledWith(expect.objectContaining({
					left: 8,
					top: 8,
					behavior: 'instant'
				}));
			}
		);

		test(
			'should stop animating and not call scrollBy when target is already reached',
			() => {
				scrollContentRef.current.scrollLeft = 100;
				scrollContentRef.current.scrollTop = 200;

				const instance = new ScrollerBasic({scrollContentRef, direction: 'both'});
				const node = scrollContentRef.current;

				// Target equals current position → already reached
				instance.animateScroll(100, 200, node);

				flushRaf(0);

				expect(node.scrollBy).not.toHaveBeenCalled();
				expect(node.scrollTo).not.toHaveBeenCalled();
			}
		);

		test(
			'should stop animation and call scrollTo with smooth behavior when 1s timeout elapses before reaching target',
			() => {
				scrollContentRef.current.scrollLeft = 0;
				scrollContentRef.current.scrollTop = 0;

				const instance = new ScrollerBasic({scrollContentRef, direction: 'both'});
				const node = scrollContentRef.current;

				instance.animateScroll(500, 500, node);

				// Advance past 1s timeout without updating scroll position
				flushRaf(1100);

				expect(node.scrollTo).toHaveBeenCalledWith({top: 500, left: 500, behavior: 'smooth'});
			}
		);

		test(
			'should not call scrollTo fallback when target is reached exactly at timeout boundary',
			() => {
				scrollContentRef.current.scrollLeft = 500;
				scrollContentRef.current.scrollTop = 500;

				const instance = new ScrollerBasic({scrollContentRef, direction: 'both'});
				const node = scrollContentRef.current;

				// Target already reached
				instance.animateScroll(500, 500, node);

				flushRaf(1100);

				expect(node.scrollTo).not.toHaveBeenCalled();
			}
		);

		test(
			'should continue requesting animation frames until target is reached',
			() => {
				scrollContentRef.current.scrollLeft = 0;
				scrollContentRef.current.scrollTop = 0;

				const instance = new ScrollerBasic({scrollContentRef, direction: 'both'});
				const node = scrollContentRef.current;

				instance.animateScroll(100, 0, node);

				// First frame: scrollBy called, new rAF registered
				flushRaf(0);
				expect(node.scrollBy).toHaveBeenCalledTimes(1);

				// Simulate scroll progress
				node.scrollLeft = 50;
				flushRaf(100);
				expect(node.scrollBy).toHaveBeenCalledTimes(2);

				// Simulate reaching target
				node.scrollLeft = 100;
				flushRaf(200);
				expect(node.scrollBy).toHaveBeenCalledTimes(2);
			}
		);
	});
});
