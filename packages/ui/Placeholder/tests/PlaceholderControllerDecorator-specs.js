import '@testing-library/jest-dom';
import {render} from '@testing-library/react';
import {useEffect} from 'react';

import {PlaceholderControllerDecorator} from '../../Placeholder';

describe('PlaceholderControllerDecorator', () => {
	let data;

	const DivComponent = (props) => {
		useEffect(() => {
			data = props;
		}, [props]);

		return <div data-testid="component" {...props} />;
	};

	const Component = PlaceholderControllerDecorator(DivComponent);

	describe('config', () => {
		test('should pass \'onScroll\' handler to the wrapped component', () => {
			render(<Component />);

			expect(data).toHaveProperty('onScroll');

			const expected = 'function';
			const actual = typeof data.onScroll;

			expect(actual).toBe(expected);
		});
	});
});
