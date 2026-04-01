import '@testing-library/jest-dom';
import {render, screen, fireEvent} from '@testing-library/react';

import {
	SpotlightRootDecorator,
	setFocusEffectClass,
	setInputType,
	getInputType
} from '../SpotlightRootDecorator';

import {
	getContainerConfig
} from '../../src/container';

import {getFocusEffectClass} from '../../src/focusEffect';

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

	test('should export setFocusEffectClass as a function', () => {
		expect(typeof setFocusEffectClass).toBe('function');
	});

	describe('focusEffectClass config', () => {
		afterEach(() => {
			setFocusEffectClass(null);
		});

		test('should call setFocusEffectClass with the configured class on construction', () => {
			const App = SpotlightRootDecorator({focusEffectClass: 'app-focus-class'}, AppBase);

			render(<App />);

			expect(getFocusEffectClass()).toBe('app-focus-class');
		});

		test('should not call setFocusEffectClass when focusEffectClass config is not provided', () => {
			const App = SpotlightRootDecorator(AppBase);

			render(<App />);

			expect(getFocusEffectClass()).toBeNull();
		});
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
