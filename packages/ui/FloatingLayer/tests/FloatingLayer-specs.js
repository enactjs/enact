import {render, screen} from '@testing-library/react';

import {FloatingLayerBase} from '../FloatingLayer';
import FloatingLayerDecorator from '../FloatingLayerDecorator';

describe('FloatingLayer Specs', () => {
	const Root = FloatingLayerDecorator('div');

	test('should not render if FloatingLayer is not open', () => {
		render(
			<Root data-testid="rootElement">
				<FloatingLayerBase><p>Hi</p></FloatingLayerBase>
			</Root>
		);

		const expected = 0;
		const floatingLayerContainer = screen.getByTestId('rootElement').nextElementSibling.children.length;

		expect(floatingLayerContainer).toBe(expected);
	});

	test('should render if FloatingLayer is open', () => {
		render(
			<Root data-testid="rootElement">
				<FloatingLayerBase open><p>Hi</p></FloatingLayerBase>
			</Root>
		);

		const expected = 1;
		const floatingLayerContainer = screen.getByTestId('rootElement').nextElementSibling.children.length;

		expect(floatingLayerContainer).toBe(expected);
	});
});
