import navigate from '../navigate';

// loose copy from utils/getRect to fabricate a rect for navigation
function getRect (top: number, left: number, height: number, width: number, elem?: string) {
	const rect = {
		left,
		top,
		width,
		height
	};
	const navigateRect = {
		...rect,
		element: elem,
		right: rect.left + rect.width,
		bottom: rect.top + rect.height,
		center: {
			x: rect.left + Math.floor(rect.width / 2),
			y: rect.top + Math.floor(rect.height / 2),
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		}
	};
	navigateRect.center.left = navigateRect.center.right = navigateRect.center.x;
	navigateRect.center.top = navigateRect.center.bottom = navigateRect.center.y;
	return navigateRect;
}

describe('navigate', () => {
	test('should return the element above when direction="up"', () => {
		const targetRect = getRect(100, 100, 10, 10);
		const rects = [
			[100, 110, 10, 10, 'right'],
			[100, 90, 10, 10, 'left'],
			[90, 100, 10, 10, 'above'],
			[110, 100, 10, 10, 'below']
		].map(args => getRect(...args as [number, number, number, number, string]));

		const expected = 'above';
		const actual = navigate(
			targetRect as any,
			'up',
			rects as any,
			{} as any
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
		].map(args => getRect(...args as [number, number, number, number, string]));

		const expected = 'left';
		const actual = navigate(
			targetRect as any,
			'left',
			rects as any,
			{} as any
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
		].map(args => getRect(...args as [number, number, number, number, string]));

		const expected = 'below';
		const actual = navigate(
			targetRect as any,
			'down',
			rects as any,
			{} as any
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
		].map(args => getRect(...args as [number, number, number, number, string]));

		const expected = 'right';
		const actual = navigate(
			targetRect as any,
			'right',
			rects as any,
			{} as any
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
			].map(args => getRect(...args as [number, number, number, number, string]));

			expect(navigate(
				targetRect as any,
				'up',
				rects as any,
				{} as any
			)).toBe('under');

			expect(navigate(
				targetRect as any,
				'down',
				rects as any,
				{} as any
			)).toBe('below');

			expect(navigate(
				targetRect as any,
				'left',
				rects as any,
				{} as any
			)).toBe('left');

			expect(navigate(
				targetRect as any,
				'right',
				rects as any,
				{} as any
			)).toBe('right');
		}
	);
});
