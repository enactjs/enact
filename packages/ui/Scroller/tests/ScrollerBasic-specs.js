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
		async () => {
			const instance = new ScrollerBasic({scrollContentRef, direction: 'both'});

			instance.scrollToPosition(30, 40, 'smooth');
			expect(scrollContentRef.current.scrollTo).toHaveBeenCalledWith({left: 30, top: 40, behavior: 'smooth'});

			instance.scrollToPosition(30, 40, 'instant');
			expect(scrollContentRef.current.scrollTo).toHaveBeenCalledWith({left: 30, top: 40, behavior: 'instant'});
		}
	);

	test(
		'should call requestAnimationFrame on animateScroll',
		async () => {
			const requestAnimationFrame = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
			const instance = new ScrollerBasic({scrollContentRef, direction: 'both'});

			instance.animateScroll(0, 100, scrollContentRef.current);
			instance.animateScroll(0, 200, scrollContentRef.current);
			expect(requestAnimationFrame).toHaveBeenCalled();
		}
	);
});
