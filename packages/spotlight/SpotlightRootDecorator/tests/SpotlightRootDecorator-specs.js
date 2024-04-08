import '@testing-library/jest-dom';
import {render, screen, fireEvent} from '@testing-library/react';

import {
	SpotlightRootDecorator,
	setInputType,
	getInputType
} from '../SpotlightRootDecorator';

import {
	getContainerConfig
} from '../../src/container';

describe('SpotlightRootDecorator', () => {
	const AppBase = (props) => (
		<div id="root" data-testid="root" {...props} >
			<button>123</button>
		</div>
	);

	test('should set `spotlight-input-key` class when the app is focused for the first time', () => {
		const App = SpotlightRootDecorator(AppBase);

		render(<App />);

		const button = screen.queryByText('123');
		const element = screen.getByTestId('root');

		fireEvent.focus(button);

		const expectedClass = 'spotlight-input-key';

		expect(element).toHaveClass(expectedClass);
	});

	test('should set input type properly in internal variable', () => {
		const App = SpotlightRootDecorator(AppBase);

		render(<App />);

		setInputType('touch');

		const expected = 'touch';
		const actual = getInputType();

		expect(actual).toBe(expected);
	});

	test('should set spotlightRootDecorator container enterTo config to `null` by default', () => {
		const App = SpotlightRootDecorator(AppBase);

		render(<App />);

		const containerConfig = getContainerConfig('spotlightRootDecorator');
		const expected = null;
		const actual = containerConfig.enterTo;

		expect(actual).toBe(expected);
	});
});
