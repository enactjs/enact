import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import ResolutionDecorator from '../ResolutionDecorator';

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

	test.skip('should update the resolution when the screen is resized', function () {
		// TODO: write a test
	});

	test.skip(
		'should not allow dynamic resolution updates when \'dynamic\' config option is false',
		function () {
			// TODO: write a test
		}
	);
});
