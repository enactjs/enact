import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';

import Spottable from '../Spottable';
import {setFocusEffectClass} from '../../src/focusEffect';

const id = 'test-spottable';

describe('Spottable', () => {
	test('should add the spottable class', () => {
		const Component = Spottable('div');
		render(<Component data-testid={id} />);
		const div = screen.getByTestId(id);

		const expectedClass = 'spottable';

		expect(div).toHaveClass(expectedClass);
	});

	test('should add the spottable class to a {disabled} component', () => {
		const Component = Spottable('div');
		render(<Component data-testid={id} disabled />);
		const div = screen.getByTestId(id);

		const expectedClass = 'spottable';

		expect(div).toHaveClass(expectedClass);
	});

	test('should not add the spottable class to a {spotlightDisabled} component', () => {
		const Component = Spottable('div');
		render(<Component data-testid={id} spotlightDisabled />);
		const div = screen.getByTestId(id);

		const expectedClass = 'spottable';

		expect(div).not.toHaveClass(expectedClass);
	});

	test('should emit {onSpotlightDisappear} when unmounted while focused', () => {
		const spy = jest.fn();
		const Component = Spottable('div');
		const {unmount} = render(<Component data-testid={id} onSpotlightDisappear={spy} />);
		const div = screen.getByTestId(id);

		div.focus();
		unmount();

		const expected = 1;

		expect(spy).toHaveBeenCalledTimes(expected);
		expect(spy).toHaveBeenCalledWith({type: 'onSpotlightDisappear'});
	});

	describe('applyFocusEffect / removeFocusEffect', () => {
		afterEach(() => {
			setFocusEffectClass(null);
		});

		test('should add data-spotlight-focused attribute when focused', () => {
			const Component = Spottable('div');
			render(<Component data-testid={id} />);
			const div = screen.getByTestId(id);

			fireEvent.focus(div);

			expect(div).toHaveAttribute('data-spotlight-focused');
		});

		test('should remove data-spotlight-focused attribute when blurred', () => {
			const Component = Spottable('div');
			render(<Component data-testid={id} />);
			const div = screen.getByTestId(id);

			fireEvent.focus(div);
			fireEvent.blur(div);

			expect(div).not.toHaveAttribute('data-spotlight-focused');
		});

		test('should add focus effect class when focusEffectClass is set', () => {
			setFocusEffectClass('my-focus-class');
			const Component = Spottable('div');
			render(<Component data-testid={id} />);
			const div = screen.getByTestId(id);

			fireEvent.focus(div);

			expect(div).toHaveClass('my-focus-class');
		});

		test('should remove focus effect class when blurred', () => {
			setFocusEffectClass('my-focus-class');
			const Component = Spottable('div');
			render(<Component data-testid={id} />);
			const div = screen.getByTestId(id);

			fireEvent.focus(div);
			fireEvent.blur(div);

			expect(div).not.toHaveClass('my-focus-class');
		});

		test('should add multiple space-separated focus effect classes when focused', () => {
			setFocusEffectClass('class-a class-b');
			const Component = Spottable('div');
			render(<Component data-testid={id} />);
			const div = screen.getByTestId(id);

			fireEvent.focus(div);

			expect(div).toHaveClass('class-a');
			expect(div).toHaveClass('class-b');
		});

		test('should remove all space-separated focus effect classes when blurred', () => {
			setFocusEffectClass('class-a class-b');
			const Component = Spottable('div');
			render(<Component data-testid={id} />);
			const div = screen.getByTestId(id);

			fireEvent.focus(div);
			fireEvent.blur(div);

			expect(div).not.toHaveClass('class-a');
			expect(div).not.toHaveClass('class-b');
		});

		test('should remove the class that was set at focus time even if focusEffectClass changes before blur', () => {
			setFocusEffectClass('original-class');
			const Component = Spottable('div');
			render(<Component data-testid={id} />);
			const div = screen.getByTestId(id);

			fireEvent.focus(div);
			setFocusEffectClass('new-class');
			fireEvent.blur(div);

			expect(div).not.toHaveClass('original-class');
		});

		test('should not add any extra class when no focusEffectClass is set', () => {
			const Component = Spottable('div');
			render(<Component data-testid={id} />);
			const div = screen.getByTestId(id);

			fireEvent.focus(div);

			expect(div.className).toBe('spottable');
		});
	});

	describe('shouldComponentUpdate', () => {
		test('should re-render when a non-Spottable prop changes', () => {
			const spy = jest.fn((props) => <div {...props} />);
			const Component = Spottable(spy);
			const {rerender} = render(<Component />);

			rerender(<Component data-id="123" />);

			const expected = 3;

			expect(spy).toHaveBeenCalledTimes(expected);
		});

		test('should re-render when {selectionKeys} changes', () => {
			const spy = jest.fn((props) => <div {...props} />);
			const Component = Spottable(spy);
			const {rerender} = render(<Component selectionKeys={[1, 2, 3]} />);

			rerender(<Component selectionKeys={[2, 1, 3]} />);

			const expected = 3;

			expect(spy).toHaveBeenCalledTimes(expected);
		});

		test('should not re-render when focused', () => {
			const spy = jest.fn((props) => <div {...props} />);
			const Component = Spottable(spy);
			render(<Component data-testid={id} />);
			const div = screen.getByTestId(id);

			div.focus();

			const expected = 2;

			expect(spy).toHaveBeenCalledTimes(expected);
		});
	});
});
