import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import Scrim from '../Scrim';

describe('Scrim Specs', () => {
	test('should be translucent by default', () => {
		render(<Scrim data-testid="scrim" />);

		const expected = 'translucent';
		const scrimContainer = screen.getByTestId('scrim');

		expect(scrimContainer).toHaveClass(expected);
	});

	test('should only render 1 translucent scrim at a time', () => {
		render(
			<div data-testid="rootElement">
				<Scrim />
				<Scrim />
				<Scrim />
			</div>
		);

		const childrenElements = screen.getByTestId('rootElement').children;

		const expectedLength = 1;
		expect(childrenElements).toHaveLength(expectedLength);

		const expectedClassname = 'translucent';
		expect(childrenElements[0]).toHaveClass(expectedClassname);
	});
});
