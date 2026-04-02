import '@testing-library/jest-dom';
import {act, fireEvent, render, screen} from '@testing-library/react';

import ResolutionDecorator from '../ResolutionDecorator';

const changeTargetResolution = (target, width, height) => {
	Object.defineProperty(target, 'clientWidth', {configurable: true, value: width});
	Object.defineProperty(target, 'clientHeight', {configurable: true, value: height});
}

describe('ResolutionDecorator Specs', () => {
	test('should apply resolution classes to the wrapped component', () => {
		const Component = ResolutionDecorator('div');
		render(<Component data-testid="component" />);

		const div = screen.getByTestId('component').className;
		const expected = true;
		const actual = div.includes('enact-res-standard') &&
			(div.includes('enact-orientation-landscape') || div.includes('enact-orientation-portrait'));

		expect(actual).toBe(expected);
	});

	test('should not change resolution between renders if the screen stays the same', () => {
		const Component = ResolutionDecorator('div');
		const {rerender} = render(<Component data-testid="component" />);

		const expected = true;
		let div = screen.getByTestId('component').className;
		let actual = div.includes('enact-res-standard') &&
			(div.includes('enact-orientation-landscape') || div.includes('enact-orientation-portrait'));

		expect(actual).toBe(expected);

		rerender (<Component data-testid="component" />);

		div = screen.getByTestId('component').className;
		actual = div.includes('enact-res-standard') &&
			(div.includes('enact-orientation-landscape') || div.includes('enact-orientation-portrait'));

		expect(actual).toBe(expected);
	});

	test('should allow custom screen types', () => {
		const name = 'mhd';
		const screens = [
			{name: name, pxPerRem: 36, width: 1440, height: 920, aspectRatioName: 'hdtv', base: true}
		];
		const Component = ResolutionDecorator({screenTypes: screens}, 'div');
		render(<Component data-testid="component" />);
		const div = screen.getByTestId('component');

		expect(div).toHaveClass('enact-res-mhd');
	});

	test('should update the resolution when the screen is resized', () => {
		const screens = [
			{name: 'hd', pxPerRem: 16, width: 1280, height: 720, aspectRatioName: 'hdtv', base: true},
			{name: 'fhd', pxPerRem: 24, width: 1920, height: 1080, aspectRatioName: 'hdtv'}
		];

		const Component = ResolutionDecorator({screenTypes: screens}, 'div');
		render(<Component data-testid="component" />);
		const div = screen.getByTestId('component');

		act(() => {
			changeTargetResolution(div, 1920, 1080);
			fireEvent(window, new Event('resize'));
		});
		expect(div).toHaveClass('enact-res-fhd');

		act(() => {
			changeTargetResolution(div, 1280, 720);
			fireEvent(window, new Event('resize'));
		});
		expect(div).not.toHaveClass('enact-res-hd');
		expect(div).not.toHaveClass('enact-res-fhd');
	});

	test('should not allow dynamic resolution updates when \'dynamic\' config option is false', () => {
		const screens = [
			{name: 'mhd', pxPerRem: 36, width: 1440, height: 920, aspectRatioName: 'hdtv', base: true},
			{name: 'fhd', pxPerRem: 24, width: 1920, height: 1080, aspectRatioName: 'hdtv'}
		];

		const Component = ResolutionDecorator({dynamic: false, screenTypes: screens}, 'div');
		render(<Component data-testid="component" />);
		const div = screen.getByTestId('component');

		expect(div).toHaveClass('enact-res-mhd');

		act(() => {
			changeTargetResolution(div, 1920, 1080);
			fireEvent(window, new Event('resize'));
		});

		expect(div).toHaveClass('enact-res-mhd');
		expect(div).not.toHaveClass('enact-res-fhd');
	});
});
