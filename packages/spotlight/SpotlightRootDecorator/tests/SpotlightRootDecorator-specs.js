import '@testing-library/jest-dom';
import {render, screen, fireEvent, act} from '@testing-library/react';

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

	test('should set `spotlight-input-key` class on keydown event', async () => {
		jest.useFakeTimers();
		// jsdom does not implement elementFromPoint; mock it to prevent Spotlight internals from throwing
		document.elementFromPoint = jest.fn().mockReturnValue(null);

		const App = SpotlightRootDecorator(AppBase);

		render(<App />);

		const element = screen.getByTestId('root');

		fireEvent.keyDown(document, {keyCode: 38}); // up arrow — avoids enter+touch-input branch

		await act(async () => {
			jest.runAllTimers();
		});

		expect(element).toHaveClass('spotlight-input-key');

		delete document.elementFromPoint;
		jest.useRealTimers();
	});

	test('should set `spotlight-input-mouse` class on pointermove event with mouse pointer', () => {
		const App = SpotlightRootDecorator(AppBase);

		render(<App />);

		const element = screen.getByTestId('root');

		fireEvent.focus(screen.queryByText('123'));

		const pointerMoveEvent = Object.assign(new Event('pointermove', {bubbles: true, cancelable: true}), {pointerType: 'mouse'});

		document.dispatchEvent(pointerMoveEvent);

		expect(element).toHaveClass('spotlight-input-mouse');
	});

	test('should set `spotlight-input-touch` class on pointerover event with touch pointer', () => {
		const App = SpotlightRootDecorator(AppBase);

		render(<App />);

		const element = screen.getByTestId('root');

		fireEvent.focus(screen.queryByText('123'));

		const pointerOverEvent = Object.assign(new Event('pointerover', {bubbles: true, cancelable: true}), {pointerType: 'touch'});

		document.dispatchEvent(pointerOverEvent);

		expect(element).toHaveClass('spotlight-input-touch');
	});

	test('should handle focusin that fires before mount without throwing', () => {
		const App = SpotlightRootDecorator(AppBase);

		const originalAddEventListener = document.addEventListener.bind(document);
		let beforeMountHandlerCalled = false;

		jest.spyOn(document, 'addEventListener').mockImplementation((type, handler, options) => {
			if (type === 'focusin' && !beforeMountHandlerCalled) {
				beforeMountHandlerCalled = true;
				// Invoke it immediately to simulate focusin firing before useEffect
				handler();
			}
			originalAddEventListener(type, handler, options);
		});

		render(<App />);

		document.addEventListener.mockRestore();

		expect(screen.getByTestId('root')).toBeInTheDocument();
	});

	test('should prevent default for enter key when container has touch input class', async () => {
		jest.useFakeTimers();
		document.elementFromPoint = jest.fn().mockReturnValue(null);

		const App = SpotlightRootDecorator(AppBase);

		render(<App />);

		// Add the touch class directly to the container to satisfy the condition in handleKeyDown
		document.querySelector('#root').classList.add('spotlight-input-touch');

		const preventDefaultSpy = jest.spyOn(Event.prototype, 'preventDefault');

		fireEvent.keyDown(document, {keyCode: 13});

		expect(preventDefaultSpy).toHaveBeenCalled();

		preventDefaultSpy.mockRestore();

		await act(async () => {
			jest.runAllTimers();
		});

		delete document.elementFromPoint;
		jest.useRealTimers();
	});
});
