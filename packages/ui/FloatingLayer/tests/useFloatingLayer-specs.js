import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import FloatingLayerDecorator from '../FloatingLayerDecorator';
import useFloatingLayer from '../useFloatingLayer';

describe('useFloatingLayer', () => {
	const LayerId = () => {
		const {floatingLayerId} = useFloatingLayer();

		return <div data-testid="layerId">{String(floatingLayerId)}</div>;
	};

	test('should return the id of the floating layer of the nearest FloatingLayerDecorator', () => {
		const Root = FloatingLayerDecorator({floatLayerId: 'customLayer'}, 'div');

		render(<Root><LayerId /></Root>);

		expect(screen.getByTestId('layerId')).toHaveTextContent('customLayer');
	});

	test('should return `null` outside of a FloatingLayerDecorator', () => {
		render(<LayerId />);

		expect(screen.getByTestId('layerId')).toHaveTextContent('null');
	});
});
