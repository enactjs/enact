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
});

describe('Knob', () => {
	test('should render a knob', () => {
		render(<Knob role="knob" />);

		const knob = screen.queryByRole('knob');

		expect(knob).toBeInTheDocument();
	});
});
