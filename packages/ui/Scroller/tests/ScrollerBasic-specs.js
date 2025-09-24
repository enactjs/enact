import '@testing-library/jest-dom';

import {ScrollerBasic} from '../Scroller';

describe('ScrollBasic', () => {
	let scrollContentRef;

	beforeEach(() => {
		scrollContentRef = {
			current: {
				scrollLeft: 0,
				scrollTop: 0,
				scrollTo: jest.fn()
			}
		};
	});

	test(
		'should call scrollTo on scrollToPosition',
		() => {
			const instance = new ScrollerBasic({scrollContentRef, direction: 'both'});

			instance.scrollToPosition(30, 40, 'smooth');
			expect(scrollContentRef.current.scrollTo).toHaveBeenCalledWith({left: 30, top: 40, behavior: 'smooth'});

			instance.scrollToPosition(30, 40, 'instant');
			expect(scrollContentRef.current.scrollTo).toHaveBeenCalledWith({left: 30, top: 40, behavior: 'instant'});
		}
	);

	test(
		'should call scrollTo with animated values during animateScroll',
		() => {
			let now = 0;
			let rafCallback;
			const instance = new ScrollerBasic({scrollContentRef, direction: 'both'});

			jest.useFakeTimers();
			jest.spyOn(require('@enact/core/util'), 'perfNow').mockImplementation(() => now);
			window.requestAnimationFrame = jest.fn((cb) => {
				rafCallback = cb;
				return 1;
			});
			window.cancelAnimationFrame = jest.fn();

			instance.animateScroll(100, 200, scrollContentRef.current);

			now = 500;
			rafCallback();
			expect(scrollContentRef.current.scrollTo).toHaveBeenCalled();

			now = 1001;
			rafCallback();
			expect(window.cancelAnimationFrame).toHaveBeenCalled();

			jest.useRealTimers();
		}
	);

	test(
		'should cancel previous animation frame if one exists',
		() => {
			const instance = new ScrollerBasic({scrollContentRef, direction: 'both'});
			instance.scrollAnimationId = 1;
			window.cancelAnimationFrame = jest.fn();
			window.requestAnimationFrame = jest.fn(() => 2);

			instance.animateScroll(100, 200, scrollContentRef.current);

			expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
			expect(instance.scrollAnimationId).toBe(2);
		}
	);
});
