import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import PlaceholderDecorator from '../../Placeholder';

describe('PlaceholderDecorator', () => {
	const Component = PlaceholderDecorator('div');

	describe('config', () => {
		test('should configure the default style of the placeholder element', () => {
			render(
				<div data-testid="wrapper">
					<Component />
				</div>
			);

			const expectedAttribute = 'style';
			const expectedValue = 'height: 0px; width: auto;';
			const actual = screen.getByTestId('wrapper').children[0];

			expect(actual).toHaveAttribute(expectedAttribute, expectedValue);
		});
	});
});
