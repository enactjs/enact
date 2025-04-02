import Registry from '@enact/core/internal/Registry';
import {render} from '@testing-library/react';

import {ResizeContext} from '../Resizable';
import useResize from '../useResize';

describe('useResize', () => {
	let data;

	const DivComponent = (props) => {
		data = props;

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
});
