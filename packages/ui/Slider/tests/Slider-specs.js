import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import Knob from '../Knob';
import Slider from '../Slider';

describe('Slider', () => {
	function ProgressBar () {
		return <div />;
	}

	test('should return a DOM node reference for `componentRef`', () => {
		const ref = jest.fn();
		render(<Slider progressBarComponent={ProgressBar} ref={ref} />);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});

	test('should set knob proportion to 0 when \'defaultValue\' is smaller than min value', () => {
		jest.spyOn(console, 'warn').mockImplementation(() => {});
		render(<Slider data-testid="slider" defaultValue={-10} max={100} min={0} progressBarComponent={ProgressBar} />);

		const slider = screen.getByTestId('slider');
		const expected = '0';

		expect(slider).toHaveStyle({'--ui-slider-proportion-end-knob': expected});
	});

	test('should set knob proportion to 1 when \'defaultValue\' is bigger than max value', () => {
		jest.spyOn(console, 'warn').mockImplementation(() => {});
		render(<Slider data-testid="slider" defaultValue={110} max={100} min={0} progressBarComponent={ProgressBar} />);

		const slider = screen.getByTestId('slider');
		const expected = '1';

		expect(slider).toHaveStyle({'--ui-slider-proportion-end-knob': expected});
	});

	test('should set knob proportion to 0.5 when \'defaultValue\' is half of the range between min and max value', () => {
		render(<Slider data-testid="slider" defaultValue={50} max={100} min={0} progressBarComponent={ProgressBar} />);

		const slider = screen.getByTestId('slider');
		const expected = '0.5';

		expect(slider).toHaveStyle({'--ui-slider-proportion-end-knob': expected});
	});

	test('should render a knob', () => {
		render(<Knob role="knob" />);

		const knob = screen.queryByRole('knob');

		expect(knob).toBeInTheDocument();
	});
});
