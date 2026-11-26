import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';

import ProgressBar from '../../ProgressBar';

import Knob from '../Knob';
import Slider from '../Slider';

describe('Slider', () => {
	function CustomProgressBar () {
		return <div />;
	}

	test('should return a DOM node reference for `componentRef`', () => {
		const ref = jest.fn();
		render(<Slider progressBarComponent={CustomProgressBar} ref={ref} />);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});

	test('should set \'ui-slider-proportion-end-knob\' to 0 when \'defaultValue\' is smaller than min value', () => {
		jest.spyOn(console, 'warn').mockImplementation(() => {});
		render(<Slider defaultValue={-10} knobComponent={Knob} max={100} min={0} progressBarComponent={ProgressBar} step={3} />);

		const slider = screen.getByRole('progressbar').parentElement;
		const expected = '0';

		expect(slider).toHaveStyle({'--ui-slider-proportion-end-knob': expected});
	});

	test('should set \'ui-slider-proportion-end-knob\' to 1 when \'defaultValue\' is bigger than max value', () => {
		jest.spyOn(console, 'warn').mockImplementation(() => {});
		render(<Slider defaultValue={110} knobComponent={Knob} max={100} min={0} progressBarComponent={ProgressBar} step={3} />);

		const slider = screen.getByRole('progressbar').parentElement;
		const expected = '1';

		expect(slider).toHaveStyle({'--ui-slider-proportion-end-knob': expected});
	});

	test('should set \'ui-slider-proportion-end-knob\' to 0.5 when \'defaultValue\' is half of the range between min and max value', () => {
		render(<Slider defaultValue={50} knobComponent={Knob} max={100} min={0} progressBarComponent={ProgressBar} step={3} />);

		const slider = screen.getByRole('progressbar').parentElement;
		const expected = '0.5';

		expect(slider).toHaveStyle({'--ui-slider-proportion-end-knob': expected});
	});

	test('should fire `onChange` with `onChange` type of horizontal slider when value changed', () => {
		const handleChange = jest.fn();
		render(<Slider defaultValue={50} onChange={handleChange} progressBarComponent={ProgressBar} step={5} />);

		const knob = screen.getByRole('progressbar').children.item(1);
		fireEvent.mouseDown(knob);

		const expected = {type: 'onChange'};
		const actual = handleChange.mock.calls.length && handleChange.mock.calls[0][0];

		expect(actual).toMatchObject(expected);
	});

	test('should fire `onChange` with `onChange` type of vertical slider when value changed', () => {
		const handleChange = jest.fn();
		render(<Slider defaultValue={50} onChange={handleChange} progressBarComponent={ProgressBar} orientation="vertical" step={5} />);

		const knob = screen.getByRole('progressbar').children.item(1);
		fireEvent.mouseDown(knob);

		const expected = {type: 'onChange'};
		const actual = handleChange.mock.calls.length && handleChange.mock.calls[0][0];

		expect(actual).toMatchObject(expected);
	});

	test('should fire `onChange` with `onChange` type of vertical slider when value changed with `colorPicker` true', () => {
		const handleChange = jest.fn();
		render(<Slider colorPicker defaultValue={50} onChange={handleChange} progressBarComponent={ProgressBar} orientation="vertical" step={5} />);

		const knob = screen.getByRole('progressbar').children.item(1);
		fireEvent.mouseDown(knob);

		const expected = {type: 'onChange'};
		const actual = handleChange.mock.calls.length && handleChange.mock.calls[0][0];

		expect(actual).toMatchObject(expected);
	});

	describe('with pointer position', () => {
		let boundingClientRectSpy, computedStyleSpy;

		beforeEach(() => {
			boundingClientRectSpy = jest.spyOn(window.Element.prototype, 'getBoundingClientRect').mockReturnValue({
				left: 0, right: 100, top: 0, bottom: 100, width: 100, height: 100
			});
			computedStyleSpy = jest.spyOn(window, 'getComputedStyle').mockReturnValue({
				paddingLeft: '0', paddingRight: '0', paddingTop: '0', paddingBottom: '0', getPropertyValue: () => ''
			});
		});

		afterEach(() => {
			boundingClientRectSpy.mockRestore();
			computedStyleSpy.mockRestore();
		});

		test('should fire `onChange` with the value under the pointer while dragging, including back to an earlier value', () => {
			const handleChange = jest.fn();
			const handleDrag = jest.fn();
			const handleDragStart = jest.fn();
			render(<Slider onChange={handleChange} onDrag={handleDrag} onDragStart={handleDragStart} progressBarComponent={ProgressBar} />);

			const slider = screen.getByRole('progressbar').parentElement;
			fireEvent.mouseDown(slider, {clientX: 20, clientY: 5});
			fireEvent.mouseMove(document, {clientX: 50, clientY: 5});
			fireEvent.mouseMove(document, {clientX: 60, clientY: 5});
			fireEvent.mouseMove(document, {clientX: 20, clientY: 5});
			fireEvent.mouseUp(document, {clientX: 20, clientY: 5});

			const expected = [20, 50, 60, 20];
			const actual = handleChange.mock.calls.map(([ev]) => ev.value);

			expect(actual).toEqual(expected);
			expect(handleDragStart).toHaveBeenCalledTimes(1);
			expect(handleDrag).toHaveBeenCalledTimes(2);
		});

		test('should invert the pointer position for a vertical slider', () => {
			const handleChange = jest.fn();
			render(<Slider onChange={handleChange} orientation="vertical" progressBarComponent={ProgressBar} />);

			const slider = screen.getByRole('progressbar').parentElement;
			fireEvent.mouseDown(slider, {clientX: 5, clientY: 25});

			const expected = 75;
			const actual = handleChange.mock.calls[0][0].value;

			expect(actual).toBe(expected);
		});

		test('should round the value to the nearest `step`', () => {
			const handleChange = jest.fn();
			render(<Slider onChange={handleChange} progressBarComponent={ProgressBar} step={10} />);

			const slider = screen.getByRole('progressbar').parentElement;
			fireEvent.mouseDown(slider, {clientX: 26, clientY: 5});

			const expected = {value: 30, proportion: 0.3};
			const actual = handleChange.mock.calls[0][0];

			expect(actual).toMatchObject(expected);
		});

		test('should include the color in the `onChange` payload when `colorPicker` is true', () => {
			const handleChange = jest.fn();
			render(<Slider colorPicker max={360} onChange={handleChange} progressBarComponent={ProgressBar} />);

			const slider = screen.getByRole('progressbar').parentElement;
			fireEvent.mouseDown(slider, {clientX: 50, clientY: 5});

			const expected = {value: 180, color: {hsl: 'hsla(180, 100%, 50%, 1)'}};
			const actual = handleChange.mock.calls[0][0];

			expect(actual).toMatchObject(expected);
		});

		test('should not fire `onChange` when the pointer value equals the current `value`', () => {
			const handleChange = jest.fn();
			render(<Slider onChange={handleChange} progressBarComponent={ProgressBar} value={40} />);

			const slider = screen.getByRole('progressbar').parentElement;
			fireEvent.mouseDown(slider, {clientX: 40, clientY: 5});

			expect(handleChange).not.toHaveBeenCalled();
		});
	});
});

describe('Knob', () => {
	test('should render a knob', () => {
		render(<Knob role="knob" />);

		const knob = screen.queryByRole('knob');

		expect(knob).toBeInTheDocument();
	});
});
