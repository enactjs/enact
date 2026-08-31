import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';

import {FloatingLayer, FloatingLayerBase} from '../FloatingLayer';
import FloatingLayerDecorator from '../FloatingLayerDecorator';

describe('FloatingLayer Specs', () => {
	const Root = FloatingLayerDecorator('div');

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

	test('should fire onOpen event with type when FloatingLayer is open', () => {
		const handleOpen = jest.fn();

		render(
			<Root>
				<FloatingLayerBase onOpen={handleOpen} open><p>Hi</p></FloatingLayerBase>
			</Root>
		);

		const expected = 1;
		const expectedType = {type: 'onOpen'};
		const actual = handleOpen.mock.calls.length && handleOpen.mock.calls[0][0];

		expect(handleOpen).toHaveBeenCalledTimes(expected);
		expect(actual).toMatchObject(expectedType);
	});

	test('should fire onClose event with type when FloatingLayer is closed', () => {
		const handleClose = jest.fn();

		const {rerender} = render(
			<Root>
				<FloatingLayerBase onClose={handleClose} open><p>Hi</p></FloatingLayerBase>
			</Root>
		);

		rerender(
			<Root>
				<FloatingLayerBase onClose={handleClose}><p>Hi</p></FloatingLayerBase>
			</Root>
		);

		const expectedType = {type: 'onClose'};
		const actual = handleClose.mock.calls.length && handleClose.mock.calls[0][0];

		expect(actual).toMatchObject(expectedType);
	});

	test('should fire onDismiss event with type and detail info when FloatingLayer is closed', () => {
		const handleDismiss = jest.fn();

		render(
			<Root>
				<FloatingLayer onDismiss={handleDismiss} open><p>Hi</p></FloatingLayer>
			</Root>
		);

		fireEvent.keyUp(screen.getByText('Hi'), {keyCode: 27});

		const expectedType = {type: 'onDismiss', detail: {inputType: 'key'}};
		const actual = handleDismiss.mock.calls.length && handleDismiss.mock.calls[0][0];

		expect(actual).toMatchObject(expectedType);
	});
});
