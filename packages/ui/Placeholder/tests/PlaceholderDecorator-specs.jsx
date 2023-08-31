import Registry from '@enact/core/internal/Registry';
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import {PlaceholderContext} from '../PlaceholderControllerDecorator';
import PlaceholderDecorator from '../PlaceholderDecorator';

describe('PlaceholderDecorator', () => {
	const Component = PlaceholderDecorator('div');

	describe('config', () => {
		test('should configure the default style of the placeholder element', () => {
			const controllerRegistry = Registry.create();
			render(
				<PlaceholderContext.Provider value={controllerRegistry.register}>
					<div data-testid="wrapper">
						<Component />
					</div>
				</PlaceholderContext.Provider>
			);

			const expectedAttribute = 'style';
			const expectedValue = 'height: 0px; width: auto;';
			const actual = screen.getByTestId('wrapper').children[0];

			expect(actual).toHaveAttribute(expectedAttribute, expectedValue);
		});
	});
});
