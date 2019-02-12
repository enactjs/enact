import navigate from '../navigate';

// loose copy from utils/getRect to fabricate a rect for navigation
function getRect (top, left, height, width, elem) {
	const rect = {
		left,
		top,
		width,
		height
	};
	rect.element = elem;
	rect.right = rect.left + rect.width;
	rect.bottom = rect.top + rect.height;
	rect.center = {
		x: rect.left + Math.floor(rect.width / 2),
		y: rect.top + Math.floor(rect.height / 2)
	};
	rect.center.left = rect.center.right = rect.center.x;
	rect.center.top = rect.center.bottom = rect.center.y;
	return rect;
}

describe('navigate', () => {
	test('should return the element above when direction="up"', () => {
		const targetRect = getRect(100, 100, 10, 10);
		const rects = [
			[100, 110, 10, 10, 'right'],
			[100, 90, 10, 10, 'left'],
			[90, 100, 10, 10, 'above'],
			[110, 100, 10, 10, 'below']
		].map(args => getRect(...args));

		const expected = 'above';
		const actual = navigate(
			targetRect,
			'up',
			rects,
			{}
		);

		expect(actual).toBe(expected);
	});

	test('should return the element to the left when direction="left"', () => {
		const targetRect = getRect(100, 100, 10, 10);
		const rects = [
			[100, 110, 10, 10, 'right'],
			[100, 90, 10, 10, 'left'],
			[90, 100, 10, 10, 'above'],
			[110, 100, 10, 10, 'below']
		].map(args => getRect(...args));

		const expected = 'left';
		const actual = navigate(
			targetRect,
			'left',
			rects,
			{}
		);

		expect(actual).toBe(expected);
	});

	test('should return the element below when direction="down"', () => {
		const targetRect = getRect(100, 100, 10, 10);
		const rects = [
			[100, 110, 10, 10, 'right'],
			[100, 90, 10, 10, 'left'],
			[90, 100, 10, 10, 'above'],
			[110, 100, 10, 10, 'below']
		].map(args => getRect(...args));

		const expected = 'below';
		const actual = navigate(
			targetRect,
			'down',
			rects,
			{}
		);

		expect(actual).toBe(expected);
	});

	test('should return the element to the right when direction="right"', () => {
		const targetRect = getRect(100, 100, 10, 10);
		const rects = [
			[100, 110, 10, 10, 'right'],
			[100, 90, 10, 10, 'left'],
			[90, 100, 10, 10, 'above'],
			[110, 100, 10, 10, 'below']
		].map(args => getRect(...args));

		const expected = 'right';
		const actual = navigate(
			targetRect,
			'right',
			rects,
			{}
		);

		expect(actual).toBe(expected);
	});

	test(
		'should return the element "under" when its center is nearest in that direction',
		() => {
			const targetRect = getRect(105, 100, 10, 10);
			const rects = [
				[100, 110, 10, 10, 'right'],
				[100, 90, 10, 10, 'left'],
				[90, 90, 30, 30, 'under'], // completely contains the targetRect
				[110, 100, 10, 10, 'below']
			].map(args => getRect(...args));

			expect(navigate(
				targetRect,
				'up',
				rects,
				{}
			)).toBe('under');

			expect(navigate(
				targetRect,
				'down',
				rects,
				{}
			)).toBe('below');

			expect(navigate(
				targetRect,
				'left',
				rects,
				{}
			)).toBe('left');

			expect(navigate(
				targetRect,
				'right',
				rects,
				{}
			)).toBe('right');
		}
	);
});
