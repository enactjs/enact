import type {KeyboardEventHandler} from 'react';
import Accelerator from '../Accelerator';
import {fireEvent, render, screen} from '@testing-library/react';

describe('Accelerator', () => {
	test('should invoke callback function passed by processKey method', () => {
		const SpotlightAccelerator = new Accelerator([3, 2]);

		const acceleratorCallback = jest.fn();

		const handleKeyDown = (ev: Parameters<typeof SpotlightAccelerator.processKey>[0]) => {
			SpotlightAccelerator.processKey(ev, acceleratorCallback);
		};

		render (
			<div>
				<button onKeyDown={handleKeyDown as unknown as KeyboardEventHandler<HTMLButtonElement>}>
					button
				</button>
			</div>
		);
		const button = screen.queryByText('button');

		fireEvent.keyDown(button!, {which: 13, keyCode: 13, code: 13});

		expect(acceleratorCallback).toHaveBeenCalled();
	});

	test('should set \'accelerating\' true when keyDown event occurs several time', () => {
		const SpotlightAccelerator = new Accelerator([3, 2]);
		const acceleratorCallback = jest.fn();
		let actual = 0;

		const handleKeyDown = (ev: Parameters<typeof SpotlightAccelerator.processKey>[0]) => {
			SpotlightAccelerator.processKey(ev, acceleratorCallback);
		};

		render (
			<div>
				<button onKeyDown={handleKeyDown as unknown as KeyboardEventHandler<HTMLButtonElement>}>
					button
				</button>
			</div>
		);

		const button = screen.queryByText('button');

		fireEvent.keyDown(button!, {which: 13, keyCode: 13, code: 13});
		actual = actual | Number(SpotlightAccelerator.isAccelerating());
		fireEvent.keyDown(button!, {which: 13, keyCode: 13, code: 13});
		actual = actual | Number(SpotlightAccelerator.isAccelerating());
		fireEvent.keyDown(button!, {which: 13, keyCode: 13, code: 13});
		actual = actual | Number(SpotlightAccelerator.isAccelerating());
		expect(actual).toBe(1);
	});
});
