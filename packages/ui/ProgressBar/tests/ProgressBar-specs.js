import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import ProgressBar from '../ProgressBar';

describe('ProgressBar Specs', () => {
	test('should return a DOM node reference for `componentRef`', () => {
		const ref = {current: null};
		render(<ProgressBar ref={ref} />);

		const expected = 'div';
		const actual = ref.current[Object.keys(ref.current)[0]].elementType;

		expect(actual).toBe(expected);
	});

	describe('horizontal', () => {
		test('should have width of 0.5', () => {
			render(<ProgressBar progress={0.5} />);
			const progressBar = screen.getByRole('progressbar');

			const expected = '0.5';

			expect(progressBar).toHaveStyle({'--ui-progressbar-proportion-end': expected});
		});

		test('should have background width of 0.75', () => {
			render(<ProgressBar backgroundProgress={0.75} />);
			const progressBar = screen.getByRole('progressbar');

			const expected = '0.75';

			expect(progressBar).toHaveStyle({'--ui-progressbar-proportion-end-background': expected});
		});
	});

	describe('vertical', () => {
		test('should have height of 0.5', () => {
			render(<ProgressBar orientation="vertical" progress={0.5} />);
			const progressBar = screen.getByRole('progressbar');

			const expected = '0.5';

			expect(progressBar).toHaveStyle({'--ui-progressbar-proportion-end': expected});
		});

		test('should have background height of 0.75', () => {
			render(<ProgressBar backgroundProgress={0.75} orientation="vertical" progress={0.5} />);
			const progressBar = screen.getByRole('progressbar');

			const expected = '0.75';

			expect(progressBar).toHaveStyle({'--ui-progressbar-proportion-end-background': expected});
		});
	});

	describe('radial', () => {
		test('should have a radius of 0.5', () => {
			render(<ProgressBar orientation="radial" progress={0.5} />);
			const progressBar = screen.getByRole('progressbar');

			const expected = '0.5';

			expect(progressBar).toHaveStyle({'--ui-progressbar-proportion-end': expected});
		});

		test('should have background radius of 0.75', () => {
			render(<ProgressBar backgroundProgress={0.75} orientation="radial" progress={0.5} />);
			const progressBar = screen.getByRole('progressbar');

			const expected = '0.75';

			expect(progressBar).toHaveStyle({'--ui-progressbar-proportion-end-background': expected});
		});
	});
});
