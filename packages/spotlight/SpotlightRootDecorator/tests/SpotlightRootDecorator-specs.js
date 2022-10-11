import '@testing-library/jest-dom';
import {render, screen, fireEvent} from '@testing-library/react';

import SpotlightRootDecorator from '../SpotlightRootDecorator';

describe('SpotlightDecorator', () => {
	const AppBase = (props) => (
		<div id="root" data-testid="custom-element" {...props} >
			<button>123</button>
		</div>
	);

	test('should set `spotlight-input-key` class when the app is focused for the first time', () => {
		const App = SpotlightRootDecorator(AppBase);

		render(<App />);

		const button = screen.queryByText('123');
		const element = screen.getByTestId('custom-element');

		fireEvent.focus(button);

		const expectedClass = 'spotlight-input-key';

		expect(element).toHaveClass(expectedClass);
	});
});
