import Accelerator from '../Accelerator';
import {fireEvent, render, screen} from '@testing-library/react';

describe('Accelerator', () => {
	test('should invoke callback function passed by processKey method', () => {
		const SpotlightAccelerator = new Accelerator([3, 2]);

		const acceleratorCallback = jest.fn();

		const handleKeyDown = (ev) => {
			SpotlightAccelerator.processKey(ev, acceleratorCallback);
		};

		render (
			<div>
				<button onKeyDown={handleKeyDown}>
					button
				</button>
			</div>
		);
		const button = screen.queryByText('button');

		fireEvent.keyDown(button, {which: 13, keyCode: 13, code: 13});

		expect(acceleratorCallback).toHaveBeenCalled();
	});

	test('should set \'accelerating\' true when keyDown event occurs several time', () => {
		const SpotlightAccelerator = new Accelerator([3, 2]);
		const acceleratorCallback = jest.fn();
		let actual = false;

		const handleKeyDown = (ev) => {
			SpotlightAccelerator.processKey(ev, acceleratorCallback);
		};

		render (
			<div>
				<button onKeyDown={handleKeyDown}>
					button
				</button>
			</div>
		);

		const button = screen.queryByText('button');

		fireEvent.keyDown(button, {which: 13, keyCode: 13, code: 13});
		actual = actual | SpotlightAccelerator.isAccelerating();
		fireEvent.keyDown(button, {which: 13, keyCode: 13, code: 13});
		actual = actual | SpotlightAccelerator.isAccelerating();
		fireEvent.keyDown(button, {which: 13, keyCode: 13, code: 13});
		actual = actual | SpotlightAccelerator.isAccelerating();
		expect(actual).toBe(1);
	});

	describe('processKey', () => {
		let now;

		beforeEach(() => {
			now = 1000;
			jest.spyOn(Date, 'now').mockImplementation(() => now);
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		const keyDown = (keyCode = 40) => ({type: 'keydown', keyCode, preventDefault: jest.fn()});
		const keyUp = (keyCode = 40) => ({type: 'keyup', keyCode, preventDefault: jest.fn()});

		// Records which of `count` repeated key downs reach the callback
		const pressRepeatedly = (accelerator, count, keyCode) => {
			const callback = jest.fn();
			const handled = [];

			for (let i = 0; i < count; i++) {
				const ev = keyDown(keyCode);
				accelerator.processKey(ev, callback);
				handled.push(!ev.preventDefault.mock.calls.length);
			}

			return {callback, handled};
		};

		test('should skip repeated key downs according to the first frequency', () => {
			const accelerator = new Accelerator([3, 2]);

			const {handled} = pressRepeatedly(accelerator, 7);

			// Every 3rd key down is handled, the others are skipped and prevented
			expect(handled).toEqual([true, false, false, true, false, false, true]);
		});

		test('should skip fewer key downs as the key is held longer', () => {
			const accelerator = new Accelerator([3, 2]);
			accelerator.processKey(keyDown(), jest.fn());

			now += 1000;
			const {handled} = pressRepeatedly(accelerator, 4);

			// After a second, every 2nd key down is handled
			expect(handled).toEqual([false, true, false, true]);
		});

		test('should keep using the last frequency once the key is held past it', () => {
			const accelerator = new Accelerator([3, 1]);
			accelerator.processKey(keyDown(), jest.fn());

			now += 5000;
			const {handled} = pressRepeatedly(accelerator, 3);

			expect(handled).toEqual([true, true, true]);
			expect(accelerator.isAccelerating()).toBe(true);
		});

		test('should handle the first key down of another key right away', () => {
			const accelerator = new Accelerator([3, 2]);
			accelerator.processKey(keyDown(40), jest.fn());
			accelerator.processKey(keyDown(40), jest.fn());

			const callback = jest.fn();
			accelerator.processKey(keyDown(38), callback);

			expect(callback).toHaveBeenCalled();
		});

		test('should skip and prevent every key down once canceled until the key is released', () => {
			const accelerator = new Accelerator([1]);
			accelerator.processKey(keyDown(), jest.fn());

			accelerator.cancel();
			const {callback, handled} = pressRepeatedly(accelerator, 2);

			expect(callback).not.toHaveBeenCalled();
			expect(handled).toEqual([false, false]);

			const upCallback = jest.fn();
			accelerator.processKey(keyUp(), upCallback);
			const afterRelease = jest.fn();
			accelerator.processKey(keyDown(), afterRelease);

			expect(upCallback).toHaveBeenCalled();
			expect(afterRelease).toHaveBeenCalled();
		});

		test('should stop accelerating when the key is released', () => {
			const accelerator = new Accelerator([1]);
			pressRepeatedly(accelerator, 3);

			accelerator.processKey(keyUp(), jest.fn());

			expect(accelerator.isAccelerating()).toBe(false);
		});
	});
});
