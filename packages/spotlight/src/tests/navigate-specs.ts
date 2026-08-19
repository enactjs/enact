import navigate from '../navigate';
import type {Direction} from '../../types/Direction';
import type {NavigableConfig} from '../../types/NavigableConfig';
import type {Rect} from '../../types/Rect';

const emptyConfig: NavigableConfig = {
	obliqueMultiplier: 0,
	straightMultiplier: 0,
	straightOnly: false,
	straightOverlapThreshold: 0
};

// loose copy from utils/getRect to fabricate a rect for navigation
function getRect (top: number, left: number, height: number, width: number, id?: string): Rect {
	const centerX = left + Math.floor(width / 2);
	const centerY = top + Math.floor(height / 2);
	const element = document.createElement('div');
	if (id) {
		element.id = id;
	}

	return {
		left,
		top,
		width,
		height,
		element,
		right: left + width,
		bottom: top + height,
		center: {
			x: centerX,
			y: centerY,
			left: centerX,
			right: centerX,
			top: centerY,
			bottom: centerY
		}
	};
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

		const actual = navigate(
			targetRect,
			'up',
			rects,
			emptyConfig
		);

		expect(actual?.id).toBe('above');
	});

	test('should return the element to the left when direction="left"', () => {
		const targetRect = getRect(100, 100, 10, 10);
		const rects = [
			[100, 110, 10, 10, 'right'],
			[100, 90, 10, 10, 'left'],
			[90, 100, 10, 10, 'above'],
			[110, 100, 10, 10, 'below']
		].map(args => getRect(...args as [number, number, number, number, string]));

		const actual = navigate(
			targetRect,
			'left',
			rects,
			emptyConfig
		);

		expect(actual?.id).toBe('left');
	});

	test('should return the element below when direction="down"', () => {
		const targetRect = getRect(100, 100, 10, 10);
		const rects = [
			[100, 110, 10, 10, 'right'],
			[100, 90, 10, 10, 'left'],
			[90, 100, 10, 10, 'above'],
			[110, 100, 10, 10, 'below']
		].map(args => getRect(...args as [number, number, number, number, string]));

		const actual = navigate(
			targetRect,
			'down',
			rects,
			emptyConfig
		);

		expect(actual?.id).toBe('below');
	});

	test('should return the element to the right when direction="right"', () => {
		const targetRect = getRect(100, 100, 10, 10);
		const rects = [
			[100, 110, 10, 10, 'right'],
			[100, 90, 10, 10, 'left'],
			[90, 100, 10, 10, 'above'],
			[110, 100, 10, 10, 'below']
		].map(args => getRect(...args as [number, number, number, number, string]));

		const actual = navigate(
			targetRect,
			'right',
			rects,
			emptyConfig
		);

		expect(actual?.id).toBe('right');
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

			const cases: Array<[Direction, string]> = [
				['up', 'under'],
				['down', 'below'],
				['left', 'left'],
				['right', 'right']
			];

			cases.forEach(([direction, expected]) => {
				expect(navigate(
					targetRect,
					direction,
					rects,
					emptyConfig
				)?.id).toBe(expected);
			});
		}
	);
});
