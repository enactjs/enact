import '@testing-library/jest-dom';

import {ScrollerBasic} from '../Scroller';

describe('ScrollerBasic', () => {
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

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('scrollToPosition', () => {
		test('should call scrollTo with smooth behavior', () => {
			const instance = new ScrollerBasic({scrollContentRef, direction: 'both'});

			instance.scrollToPosition(100, 200, 'smooth');

			expect(scrollContentRef.current.scrollTo).toHaveBeenCalledWith({left: 100, top: 200, behavior: 'smooth'});
		});

		test('should call scrollTo with instant behavior', () => {
			const instance = new ScrollerBasic({scrollContentRef, direction: 'both'});

			instance.scrollToPosition(100, 200, 'instant');

			expect(scrollContentRef.current.scrollTo).toHaveBeenCalledWith({left: 100, top: 200, behavior: 'instant'});
		});
	});
});
