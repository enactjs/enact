import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';

import Spottable from '../Spottable';
import {setFocusEffectClass} from '../../src/focusEffect';
import Spotlight from '../../src/spotlight';

const id = 'test-spottable';

describe('Spottable', () => {
	test('should set the focus attribute on the outermost node', () => {
		const Wrapped = (props) => (
			<div data-testid="outer">
				<span {...props} />
			</div>
		);
		const Component = Spottable(Wrapped);
		render(<Component data-testid="inner" />);

		fireEvent.focus(screen.getByTestId('inner'));

		expect(screen.getByTestId('outer')).toHaveAttribute('data-spotlight-focused');
	});

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

			const expected = 2;

			expect(spy).toHaveBeenCalledTimes(expected);
		});

		test('should re-render when {selectionKeys} changes', () => {
			const spy = jest.fn((props) => <div {...props} />);
			const Component = Spottable(spy);
			const {rerender} = render(<Component selectionKeys={[1, 2, 3]} />);

			rerender(<Component selectionKeys={[2, 1, 3]} />);

			const expected = 2;

			expect(spy).toHaveBeenCalledTimes(expected);
		});

		test('should not re-render when focused', () => {
			const spy = jest.fn((props) => <div {...props} />);
			const Component = Spottable(spy);
			render(<Component data-testid={id} />);
			const div = screen.getByTestId(id);

			div.focus();

			const expected = 1;

			expect(spy).toHaveBeenCalledTimes(expected);
		});
	});

	test('should forward mouse enter and leave', () => {
		const handleMouseEnter = jest.fn();
		const handleMouseLeave = jest.fn();
		const Component = Spottable('div');
		render(<Component data-testid={id} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />);
		const div = screen.getByTestId(id);

		fireEvent.mouseEnter(div);
		fireEvent.mouseLeave(div);

		expect(handleMouseEnter).toHaveBeenCalled();
		expect(handleMouseLeave).toHaveBeenCalled();
	});

	describe('selection', () => {
		afterEach(() => {
			jest.restoreAllMocks();
		});

		test('should release the pressed state with `onMouseUp` when it becomes disabled while it is being selected', () => {
			const handleMouseUp = jest.fn();
			const Component = Spottable('div');
			const {rerender} = render(<Component data-testid={id} onMouseUp={handleMouseUp} />);
			const div = screen.getByTestId(id);
			jest.spyOn(Spotlight, 'getCurrent').mockReturnValue(div);

			fireEvent.keyDown(div, {keyCode: 13, which: 13});
			rerender(<Component data-testid={id} disabled onMouseUp={handleMouseUp} />);
			rerender(<Component data-testid={id} disabled onMouseUp={handleMouseUp} />);

			expect(handleMouseUp).toHaveBeenCalledTimes(1);
			expect(handleMouseUp).toHaveBeenCalledWith({type: 'onSelectionCancel'});

			// Release the key so the selection does not carry over to other tests
			fireEvent.keyUp(div, {keyCode: 13, which: 13});
		});

		test('should not select another component while one is being selected', () => {
			const firstMouseDown = jest.fn();
			const secondMouseDown = jest.fn();
			const Component = Spottable('div');
			render(
				<>
					<Component data-testid="first" onMouseDown={firstMouseDown} />
					<Component data-testid="second" onMouseDown={secondMouseDown} />
				</>
			);

			fireEvent.keyDown(screen.getByTestId('first'), {keyCode: 13, which: 13});
			fireEvent.keyDown(screen.getByTestId('second'), {keyCode: 13, which: 13});
			fireEvent.keyUp(screen.getByTestId('first'), {keyCode: 13, which: 13});

			expect(firstMouseDown).toHaveBeenCalled();
			expect(secondMouseDown).not.toHaveBeenCalled();
		});

		test('should prevent and stop a direction key used as a selection key', () => {
			const handleParentKeyDown = jest.fn();
			const Component = Spottable('div');
			render(
				<div onKeyDown={handleParentKeyDown}>
					<Component data-testid={id} selectionKeys={[13, 39]} />
				</div>
			);

			const notPrevented = fireEvent.keyDown(screen.getByTestId(id), {keyCode: 39, which: 39});
			fireEvent.keyUp(screen.getByTestId(id), {keyCode: 39, which: 39});

			expect(notPrevented).toBe(false);
			expect(handleParentKeyDown).not.toHaveBeenCalled();
		});
	});

	describe('focus', () => {
		afterEach(() => {
			jest.restoreAllMocks();
		});

		test('should blur itself without forwarding focus or blur when focused while `spotlightDisabled`', () => {
			const handleFocus = jest.fn();
			const handleBlur = jest.fn();
			const Component = Spottable('div');
			render(<Component data-testid={id} onBlur={handleBlur} onFocus={handleFocus} spotlightDisabled tabIndex={0} />);
			const div = screen.getByTestId(id);

			div.focus();

			expect(div).not.toHaveFocus();
			expect(handleFocus).not.toHaveBeenCalled();
			expect(handleBlur).not.toHaveBeenCalled();
		});

		test('should not let focus and blur events of a muted container reach its ancestors', () => {
			const handleParentFocus = jest.fn();
			const handleParentBlur = jest.fn();
			jest.spyOn(Spotlight, 'isMuted').mockReturnValue(true);
			const Component = Spottable('div');
			render(
				<div onBlur={handleParentBlur} onFocus={handleParentFocus}>
					<Component data-testid={id} />
				</div>
			);

			fireEvent.focus(screen.getByTestId(id));
			fireEvent.blur(screen.getByTestId(id));

			expect(handleParentFocus).not.toHaveBeenCalled();
			expect(handleParentBlur).not.toHaveBeenCalled();
		});

		test('should stay spottable while focused after becoming `spotlightDisabled` and drop it once blurred', () => {
			const Component = Spottable('div');
			const {rerender} = render(<Component data-testid={id} />);
			const div = screen.getByTestId(id);
			jest.spyOn(Spotlight, 'getCurrent').mockReturnValue(div);
			fireEvent.focus(div);

			rerender(<Component data-testid={id} spotlightDisabled />);

			expect(div).toHaveClass('spottable');

			fireEvent.blur(div);

			expect(div).not.toHaveClass('spottable');
		});

		test('should focus its active container when it becomes spottable and nothing is focused', () => {
			const focusSpy = jest.spyOn(Spotlight, 'focus').mockImplementation(() => true);
			jest.spyOn(Spotlight, 'getPointerMode').mockReturnValue(false);
			jest.spyOn(Spotlight, 'isPaused').mockReturnValue(false);
			jest.spyOn(Spotlight, 'getCurrent').mockReturnValue(null);
			jest.spyOn(Spotlight, 'getActiveContainer').mockReturnValue('activeContainer');
			const Component = Spottable('div');
			const renderInContainer = (spotlightDisabled) => (
				<div data-spotlight-container data-spotlight-id="activeContainer">
					<Component data-testid={id} spotlightDisabled={spotlightDisabled} />
				</div>
			);
			const {rerender} = render(renderInContainer(true));

			rerender(renderInContainer(false));

			expect(focusSpy).toHaveBeenCalledWith('activeContainer');
		});
	});
});
