import '@testing-library/jest-dom';
import {act, fireEvent, render, screen} from '@testing-library/react';
import {use, useEffect} from 'react';

import {FloatingLayer, FloatingLayerBase} from '../FloatingLayer';
import FloatingLayerDecorator, {FloatingLayerContext} from '../FloatingLayerDecorator';

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

	describe('dismissing', () => {
		test('should fire `onDismiss` with the click input type when the scrim is clicked', () => {
			const handleDismiss = jest.fn();
			render(
				<Root>
					<FloatingLayerBase onDismiss={handleDismiss} open scrimType="translucent"><p>Hi</p></FloatingLayerBase>
				</Root>
			);

			fireEvent.click(document.querySelector('.scrim'));

			expect(handleDismiss).toHaveBeenCalledWith(expect.objectContaining({type: 'onDismiss', detail: {inputType: 'click'}}));
		});

		test('should not fire `onDismiss` when the scrim is clicked with `noAutoDismiss`', () => {
			const handleDismiss = jest.fn();
			render(
				<Root>
					<FloatingLayerBase noAutoDismiss onDismiss={handleDismiss} open scrimType="translucent"><p>Hi</p></FloatingLayerBase>
				</Root>
			);

			fireEvent.click(document.querySelector('.scrim'));

			expect(handleDismiss).not.toHaveBeenCalled();
		});

		test('should fire `onDismiss` for a click anywhere outside the layer when there is no scrim', () => {
			const handleDismiss = jest.fn();
			render(
				<Root>
					<button data-testid="outside">outside</button>
					<FloatingLayerBase onDismiss={handleDismiss} open scrimType="none"><p>Hi</p></FloatingLayerBase>
				</Root>
			);

			fireEvent.click(screen.getByTestId('outside'));

			expect(handleDismiss).toHaveBeenCalledWith(expect.objectContaining({detail: {inputType: 'click'}}));
		});

		test('should not fire `onDismiss` for a click inside the layer and still call its `onClick`', () => {
			const handleDismiss = jest.fn();
			const handleClick = jest.fn();
			render(
				<Root>
					<FloatingLayerBase onDismiss={handleDismiss} open scrimType="none"><p onClick={handleClick}>Hi</p></FloatingLayerBase>
				</Root>
			);

			fireEvent.click(screen.getByText('Hi'));

			expect(handleClick).toHaveBeenCalled();
			expect(handleDismiss).not.toHaveBeenCalled();
		});

		test('should listen for outside clicks only while an unscrimmed layer is open', () => {
			const handleDismiss = jest.fn();
			const renderLayer = (open) => (
				<Root>
					<button data-testid="outside">outside</button>
					<FloatingLayerBase onDismiss={handleDismiss} open={open} scrimType="none"><p>Hi</p></FloatingLayerBase>
				</Root>
			);
			const {rerender} = render(renderLayer(false));

			rerender(renderLayer(true));
			fireEvent.click(screen.getByTestId('outside'));

			expect(handleDismiss).toHaveBeenCalledTimes(1);

			rerender(renderLayer(false));
			fireEvent.click(screen.getByTestId('outside'));

			expect(handleDismiss).toHaveBeenCalledTimes(1);
		});

		test('should fire `onDismiss` on open layers when all floating layers are closed', () => {
			const handleDismiss = jest.fn();
			let controller;
			const CloseAll = () => {
				const register = use(FloatingLayerContext);

				useEffect(() => {
					controller = register(() => {});
				}, [register]);

				return null;
			};
			render(
				<Root>
					<CloseAll />
					<FloatingLayerBase onDismiss={handleDismiss} open><p>Hi</p></FloatingLayerBase>
				</Root>
			);

			act(() => controller.notify({action: 'closeAll'}));

			expect(handleDismiss).toHaveBeenCalledWith(expect.objectContaining({type: 'onDismiss'}));
		});
	});

	test('should keep the floating layer scrolled to its origin', () => {
		render(
			<Root>
				<FloatingLayerBase open><p>Hi</p></FloatingLayerBase>
			</Root>
		);
		const layer = document.getElementById('floatLayer');
		layer.scrollTop = 40;
		layer.scrollLeft = 20;

		fireEvent.scroll(layer);

		expect(layer.scrollTop).toBe(0);
		expect(layer.scrollLeft).toBe(0);
	});
});
