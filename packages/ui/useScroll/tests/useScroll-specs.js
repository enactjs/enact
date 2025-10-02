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
});
