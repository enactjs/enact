import {render, screen} from '@testing-library/react';

import {FloatingLayerBase} from '../FloatingLayer';
import {useFloatingLayerDecorator} from '../FloatingLayerDecorator';

describe('FloatingLayer Specs', () => {
	function Root (props) {
		const hook = useFloatingLayerDecorator();

		return hook.provideFloatingLayer(
			<div key="floatWrapped" {...props} />
		);
	}

	test('should not render if FloatingLayer is not open', () => {
		render(
			<Root data-testid="rootElem">
				<FloatingLayerBase><p>Hi</p></FloatingLayerBase>
			</Root>
		);

		const expected = 0;
		const floatingLayerContainer = screen.getByTestId('rootElem').nextElementSibling.children.length;

		expect(floatingLayerContainer).toBe(expected);
	});

	test('should render if FloatingLayer is open', () => {
		render(
			<Root data-testid="rootElem">
				<FloatingLayerBase open><p>Hi</p></FloatingLayerBase>
			</Root>
		);

		const expected = 1;
		const floatingLayerContainer = screen.getByTestId('rootElem').nextElementSibling.children.length;

		expect(floatingLayerContainer).toBe(expected);
	});
});
