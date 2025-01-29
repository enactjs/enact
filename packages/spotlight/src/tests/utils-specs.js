import {
	getPointRect,
	getContainerRect
} from '../utils';

describe('utils', () => {
	describe('#getPointRect', () => {
		test('should return an rect value calculated based on given position', () => {
			const expected = {
				left: 10,
				top: 20,
				width: 0,
				height: 0,
				right: 10,
				bottom: 20,
				center: {
					x: 10,
					y: 20,
					left: 10,
					right: 10,
					top: 20,
					bottom: 20
				}
			};
			const actual = getPointRect({x: 10, y:20});

			expect(actual).toEqual(expected);
		});
	});

	describe('#getContainerRect', () => {
		test('should return an viewPort rect value when container is document', () => {
			const innerWidth = window.innerWidth;
			const innerHeight = window.innerHeight;

			const actual = getContainerRect('spotlightRootDecorator');
			const expected = {
				left: 0,
				top: 0,
				width: innerWidth,
				height: innerHeight,
				right: innerWidth,
				bottom: innerHeight,
				center: {
					x: innerWidth / 2,
					y: innerHeight / 2,
					left: innerWidth / 2,
					right: innerWidth / 2,
					top: innerHeight / 2,
					bottom: innerHeight / 2
				}
			};
			expect(actual).toEqual(expected);
		});
	});
});
