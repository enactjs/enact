import '@testing-library/jest-dom';
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
			<Root>
				<FloatingLayerBase data-testid="floatingLayer"><p>Hi</p></FloatingLayerBase>
			</Root>
		);

		const floatingLayerContainer = screen.queryByTestId('floatingLayer');

		expect(floatingLayerContainer).not.toBeInTheDocument();
	});

	test('should render if FloatingLayer is open', () => {
		render(
			<Root>
				<FloatingLayerBase data-testid="floatingLayer" open><p>Hi</p></FloatingLayerBase>
			</Root>
		);

		const floatingLayerContainer = screen.getByTestId('floatingLayer');

		expect(floatingLayerContainer).toBeInTheDocument();
	});
});
