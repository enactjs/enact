import Registry from '@enact/core/internal/Registry';
import {fireEvent, render, screen} from '@testing-library/react';
import {useEffect} from 'react';

import {ResizeContext} from '../Resizable';
import useResize from '../useResize';

describe('useResize', () => {
	let data;

	const DivComponent = (props) => {
		useEffect(() => {
			data = props;
		}, [props]);

		return <div data-testid="component" />;
	};

	const ResizeButtonWithHook = (props) => {
		const handlers = useResize(props, {resize: 'onClick'});
		return <DivComponent {...handlers}>{props.children}</DivComponent>;
	};

	describe('config', () => {
		test('should pass \'onClick\' handler to the wrapped component', () => {
			const resizeRegistry = Registry.create();
			render(
				<ResizeContext value={resizeRegistry.register}>
					<ResizeButtonWithHook />
				</ResizeContext>
			);

			expect(data).toHaveProperty('onClick');

			const expected = 'function';
			const actual = typeof data.onClick;

			expect(actual).toBe(expected);
		});
	});

	describe('resize event', () => {
		const ResizeButton = (props) => {
			const handlers = useResize(props, {filter: props.filter, resize: 'onClick'});
			return <button {...handlers} data-testid="button" />;
		};

		test('should forward the resize event and ask the container to invalidate its bounds', () => {
			const handleRegistry = jest.fn();
			const handleClick = jest.fn();
			const resizeRegistry = Registry.create(handleRegistry);
			render(
				<ResizeContext value={resizeRegistry.register}>
					<ResizeButton onClick={handleClick} />
				</ResizeContext>
			);

			fireEvent.click(screen.getByTestId('button'));

			expect(handleClick).toHaveBeenCalled();
			expect(handleRegistry).toHaveBeenCalledWith({action: 'invalidateBounds'}, expect.any(Function));
		});

		test('should not ask the container to invalidate its bounds when the filter rejects the event', () => {
			const handleRegistry = jest.fn();
			const resizeRegistry = Registry.create(handleRegistry);
			render(
				<ResizeContext value={resizeRegistry.register}>
					<ResizeButton filter={() => false} />
				</ResizeContext>
			);

			fireEvent.click(screen.getByTestId('button'));

			expect(handleRegistry).not.toHaveBeenCalledWith({action: 'invalidateBounds'}, expect.anything());
		});

		test('should forward the resize event without a resize container', () => {
			const handleClick = jest.fn();
			render(<ResizeButton onClick={handleClick} />);

			fireEvent.click(screen.getByTestId('button'));

			expect(handleClick).toHaveBeenCalled();
		});
	});
});
