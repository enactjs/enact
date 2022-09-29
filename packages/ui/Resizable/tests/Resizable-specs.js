import {render} from '@testing-library/react';

import Resizable from '../Resizable';

describe('Resizable', () => {
	let data;

	const DivComponent = (props) => {
		data = props;

		return <div data-testid="component" />;
	};

	const ResizableComponent = Resizable({resize: 'onClick'}, DivComponent);

	describe('config', () => {
		test('should pass \'onClick\' handler to the wrapped component', () => {
			render(<ResizableComponent />);

			expect(data).toHaveProperty('onClick');

			const expected = 'function';
			const actual = typeof data.onClick;

			expect(actual).toBe(expected);
		});
	});
});
