import {cancelScrollMotion, resolveScrollMotion, startNativeScroll} from '../scrollMotion';

const motion = (overrides) => ({
	delay: 0,
	duration: 600,
	ease: (progress) => progress,
	...overrides
});

describe('scrollMotion', () => {
	describe('resolveScrollMotion', () => {
		test('should use the token when the scroll has no duration of its own', () => {
			const resolved = resolveScrollMotion({getScrollMotion: () => motion()});

			expect(resolved.duration).toBe(600);
			expect(resolved.delay).toBe(0);
			expect(resolved.timingFunction(0, 100, 600, 300, false)).toBe(50);
		});

		test('should keep a held key linear', () => {
			const {timingFunction} = resolveScrollMotion({getScrollMotion: () => motion({ease: () => 1})});

			expect(timingFunction(0, 100, 100, 50, true)).toBe(50);
		});

		test('should keep an explicit duration, a held key, and a repeat on the existing timing', () => {
			const getScrollMotion = () => motion();

			expect(resolveScrollMotion({duration: 320, getScrollMotion})).toBeNull();
			expect(resolveScrollMotion({keyPressed: true, getScrollMotion})).toBeNull();
			expect(resolveScrollMotion({repeat: true, getScrollMotion})).toBeNull();
			expect(resolveScrollMotion({})).toBeNull();
			expect(resolveScrollMotion({getScrollMotion: () => null})).toBeNull();
			expect(resolveScrollMotion({getScrollMotion: () => ({duration: 600})})).toBeNull();
		});

		test('should keep a positive delay and drop a non-positive one', () => {
			expect(resolveScrollMotion({getScrollMotion: () => motion({delay: 30})}).delay).toBe(30);
			expect(resolveScrollMotion({getScrollMotion: () => motion({delay: 0})}).delay).toBe(0);
		});
	});

	describe('startNativeScroll', () => {
		const realNow = performance.now;
		const realRaf = global.requestAnimationFrame;
		const realCancel = global.cancelAnimationFrame;
		let now;
		let next;

		beforeEach(() => {
			now = 1000;
			next = null;
			performance.now = () => now;
			global.requestAnimationFrame = (callback) => {
				next = callback;
				return 1;
			};
			global.cancelAnimationFrame = () => {
				next = null;
			};
		});

		afterEach(() => {
			performance.now = realNow;
			global.requestAnimationFrame = realRaf;
			global.cancelAnimationFrame = realCancel;
		});

		const frame = (at) => {
			const callback = next;
			next = null;
			now = at;
			callback(at);
		};

		test('should interpolate in logical coordinates and release the animation before the final position', () => {
			const state = {};
			const positions = [];

			startNativeScroll(state, {
				fromX: 0,
				fromY: 0,
				toX: 100,
				toY: 40,
				duration: 600,
				ease: (progress) => progress,
				scrollTo: (x, y) => positions.push({x, y, animating: state.motionAnimating})
			});

			expect(state.motionAnimating).toBe(true);

			frame(1300);

			expect(positions).toEqual([{x: 50, y: 20, animating: true}]);

			frame(1600);

			expect(positions[1]).toEqual({x: 100, y: 40, animating: false});
			expect(state.motionAnimating).toBe(false);
			expect(state.motionFrame).toBeNull();
		});

		test('should not move when the scroll is already at its target', () => {
			const state = {motionAnimating: true};
			const scrollTo = jest.fn();

			startNativeScroll(state, {
				fromX: 10,
				fromY: 10,
				toX: 10,
				toY: 10,
				duration: 600,
				ease: (progress) => progress,
				scrollTo
			});

			expect(scrollTo).not.toHaveBeenCalled();
			expect(state.motionAnimating).toBe(false);
			expect(next).toBeNull();
		});

		test('should drop a frame scheduled before it was cancelled', () => {
			const state = {};
			const scrollTo = jest.fn();

			startNativeScroll(state, {
				fromX: 0,
				fromY: 0,
				toX: 100,
				toY: 0,
				duration: 600,
				ease: (progress) => progress,
				scrollTo
			});

			const scheduled = next;
			cancelScrollMotion(state);
			scheduled(1600);

			expect(scrollTo).not.toHaveBeenCalled();
			expect(state.motionAnimating).toBe(false);
		});
	});

	describe('cancelScrollMotion', () => {
		test('should cancel a delayed start', () => {
			jest.useFakeTimers();
			try {
				const started = jest.fn();
				const state = {};

				state.motionDelay = setTimeout(started, 30);
				cancelScrollMotion(state);
				jest.advanceTimersByTime(30);

				expect(started).not.toHaveBeenCalled();
				expect(state.motionDelay).toBeNull();
				expect(state.motionAnimating).toBe(false);
			} finally {
				jest.useRealTimers();
			}
		});
	});
});
