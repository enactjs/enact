import '@testing-library/jest-dom';

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
		'should call scrollBy on scrollToPosition',
		() => {
			const instance = new ScrollerBasic({scrollContentRef, direction: 'both'});

			instance.scrollToPosition(100, 200, 'smooth', 'arrowKey');
			expect(scrollContentRef.current.scrollTo).toHaveBeenCalledWith({left: 100, top: 200, behavior: 'smooth'});

			instance.scrollToPosition(100, 200, 'instant');
			expect(scrollContentRef.current.scrollTo).toHaveBeenCalledWith({left: 100, top: 200, behavior: 'instant'});
		}
	);

	test(
		'should call scrollBy with animated values during animateScroll',
		() => {
			let rafCallback;
			const instance = new ScrollerBasic({scrollContentRef, direction: 'both'});

			window.requestAnimationFrame = jest.fn((cb) => {
				rafCallback = cb;
			});
			window.cancelAnimationFrame = jest.fn();

			instance.animateScroll(100, 200, scrollContentRef.current);
			rafCallback();
			expect(scrollContentRef.current.scrollBy).toHaveBeenCalled();

			instance.stopAnimatedScroll();
			expect(window.cancelAnimationFrame).toHaveBeenCalled();
		}
	);
});
