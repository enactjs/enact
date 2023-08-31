import Registry from '@enact/core/internal/Registry';
import {render} from '@testing-library/react';

import Resizable, {ResizeContext} from '../Resizable';

describe('Resizable', () => {
	let data;

	const DivComponent = (props) => {
		data = props;

		return <div data-testid="component" />;
	};

	const ResizableComponent = Resizable({resize: 'onClick'}, DivComponent);

	describe('config', () => {
		test('should pass \'onClick\' handler to the wrapped component', () => {
			const resizeRegistry = Registry.create();
			render(
				<ResizeContext.Provider value={resizeRegistry.register}>
					<ResizableComponent />
				</ResizeContext.Provider>
			);

			expect(data).toHaveProperty('onClick');

			const expected = 'function';
			const actual = typeof data.onClick;

			expect(actual).toBe(expected);
		});
	});
});
