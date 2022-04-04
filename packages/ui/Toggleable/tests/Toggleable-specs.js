import '@testing-library/jest-dom';
import {act, render, screen} from '@testing-library/react';

import Toggleable from '../Toggleable';

describe('Toggleable', () => {
	let data;

	const DivComponent = (props) => {
		data = props;
		return <div data-testid="selected-state">{props.selected?.toString()}</div>;
	};

	describe('#config', () => {
		test('should pass "selected" to the wrapped component', () => {
			const Component = Toggleable(DivComponent);
			render(<Component />);
			const toggleableDiv = screen.getByTestId('selected-state');

			const expected = 'false';

			expect(toggleableDiv).toHaveTextContent(expected);
		});

		test('should pass configured "prop" "banana" as the toggled state\'s key to the wrapped component', () => {
			const prop = 'banana';
			const Component = Toggleable({prop: prop}, DivComponent);
			render(<Component defaultSelected />);

			expect(data).toHaveProperty(prop);
		});

		test('should pass "onToggle" handler to the wrapped component', () => {
			const Component = Toggleable(DivComponent);
			render(<Component />);

			const expected = 'onToggle';

			expect(data).toHaveProperty(expected);
		});

		test('should pass configured "toggle" handler to the wrapped component', () => {
			const handle = 'onClick';
			const Component = Toggleable({toggle: handle}, DivComponent);
			render(<Component />);

			expect(data).toHaveProperty(handle);

			const expected = 'function';
			const actual = typeof data.onClick;

			expect(actual).toBe(expected);
		});
	});

	describe('#prop', () => {
		test('should use defaultSelected prop when selected prop is omitted', () => {
			const Component = Toggleable(DivComponent);
			render(<Component defaultSelected />);
			const toggleableDiv = screen.getByTestId('selected-state');

			const expected = 'true';

			expect(toggleableDiv).toHaveTextContent(expected);
		});

		test('should warn when "defaultSelected" and "selected" props are provided', () => {
			const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
			const Component = Toggleable(DivComponent);
			render(<Component defaultSelected selected />);

			const expected = 1;

			expect(spy).toHaveBeenCalledTimes(expected);
		});

		test('should use defaultSelected prop when selected prop is null', () => {
			const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
			const Component = Toggleable(DivComponent);
			render(<Component defaultSelected selected={null} />);
			const toggleableDiv = screen.getByTestId('selected-state');

			const expected = 'true';

			expect(toggleableDiv).toHaveTextContent(expected);
			expect(spy).toHaveBeenCalled();
		});

		test('should use selected prop when selected changed from truthy to null', () => {
			const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
			const Component = Toggleable(DivComponent);
			const {rerender} = render(
				<Component defaultSelected selected />
			);

			rerender(<Component defaultSelected selected={null} />);
			const toggleableDiv = screen.getByTestId('selected-state');

			const expected = 'false';

			expect(toggleableDiv).toHaveTextContent(expected);
			expect(spy).toHaveBeenCalled();
		});

		test('should use defaultSelected prop when selected prop is undefined', () => {
			const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
			const Component = Toggleable(DivComponent);
			// eslint-disable-next-line no-undefined
			render(<Component defaultSelected selected={undefined} />);
			const toggleableDiv = screen.getByTestId('selected-state');

			const expected = 'true';

			expect(toggleableDiv).toHaveTextContent(expected);
			expect(spy).toHaveBeenCalled();
		});

		test('should use selected prop when selected changed from truthy to undefined', () => {
			const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
			const Component = Toggleable(DivComponent);
			const {rerender} = render(<Component defaultSelected selected />);
			// eslint-disable-next-line no-undefined
			rerender(<Component defaultSelected selected={undefined} />);
			const toggleableDiv = screen.getByTestId('selected-state');

			const expected = 'false';

			expect(toggleableDiv).toHaveTextContent(expected);
			expect(spy).toHaveBeenCalled();
		});

		test('should use selected prop when both selected and defaultSelected are defined', () => {
			const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
			const Component = Toggleable(DivComponent);
			render(<Component defaultSelected selected={false} />);
			const toggleableDiv = screen.getByTestId('selected-state');

			const expected = 'false';

			expect(toggleableDiv).toHaveTextContent(expected);
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('#forwarding events', () => {
		test('should invoke passed "onToggle" handler with type', () => {
			// eslint-disable-next-line
			console.error = () => {};
			const handleToggle = jest.fn();
			const Component = Toggleable(DivComponent);
			render(<Component onToggle={handleToggle} />);
			act(() => data.onToggle());

			const expected = 1;
			const expectedType = {type: 'onToggle'};
			const actual = handleToggle.mock.calls.length && handleToggle.mock.calls[0][0];

			expect(handleToggle).toHaveBeenCalledTimes(expected);
			expect(actual).toMatchObject(expectedType);
		});

		test('should invoke passed custom "onJiggle" handler with type', () => {
			// eslint-disable-next-line
			console.error = () => {};
			const handleJiggle = jest.fn();
			const Component = Toggleable({toggleProp: 'onJiggle'}, DivComponent);
			render(<Component onJiggle={handleJiggle} />);
			data.onJiggle();

			const expected = 1;
			const expectedType = {type: 'onJiggle'};
			const actual = handleJiggle.mock.calls.length && handleJiggle.mock.calls[0][0];

			expect(handleJiggle).toHaveBeenCalledTimes(expected);
			expect(actual).toMatchObject(expectedType);
		});

		test('should invoke passed "onActivate" handler with type', () => {
			// eslint-disable-next-line
			console.error = () => {};
			const handleActivate = jest.fn();
			const Component = Toggleable({activate: 'onActivate'}, DivComponent);
			render(<Component onActivate={handleActivate} />);
			act(() => data.onActivate());

			const expected = 1;
			const expectedType = {type: 'onActivate'};
			const actual = handleActivate.mock.calls.length && handleActivate.mock.calls[0][0];

			expect(handleActivate).toHaveBeenCalledTimes(expected);
			expect(actual).toMatchObject(expectedType);
		});

		test('should invoke passed "onDeactivate" handler with type', () => {
			// eslint-disable-next-line
			console.error = () => {};
			const handleDeactivate = jest.fn();
			const Component = Toggleable({deactivate: 'onDeactivate'}, DivComponent);
			render(<Component onDeactivate={handleDeactivate} />);
			act(() => data.onDeactivate());

			const expected = 1;
			const expectedType = {type: 'onDeactivate'};
			const actual = handleDeactivate.mock.calls.length && handleDeactivate.mock.calls[0][0];

			expect(handleDeactivate).toHaveBeenCalledTimes(expected);
			expect(actual).toMatchObject(expectedType);
		});

		test('should not invoke passed "onToggle" handler when disabled', () => {
			const handleToggle = jest.fn();
			const Component = Toggleable(DivComponent);
			render(<Component onToggle={handleToggle} disabled />);
			act(() => data.onToggle());

			expect(handleToggle).not.toHaveBeenCalled();
		});

		test('should invoke passed "onToggle" handler when disabled at creation and becoming enabled', () => {
			// eslint-disable-next-line
			console.error = () => {};
			const handleToggle = jest.fn();
			const Component = Toggleable(DivComponent);
			const {rerender} = render(<Component onToggle={handleToggle} disabled />);

			rerender(<Component onToggle={handleToggle} disabled={false} />);
			act(() => data.onToggle());

			const expected = 1;

			expect(handleToggle).toHaveBeenCalledTimes(expected);
		});

		test('should invoke changed "onToggle" handler', () => {
			// eslint-disable-next-line
			console.error = () => {};
			const handleToggle = jest.fn();
			const Component = Toggleable(DivComponent);
			const {rerender} = render(<Component />);

			rerender(<Component onToggle={handleToggle} />);
			act(() => data.onToggle());

			const expected = 1;

			expect(handleToggle).toHaveBeenCalledTimes(expected);
		});

		test('should not invoke passed "onActivate" handler when disabled', () => {
			const handleActivate = jest.fn();
			const Component = Toggleable({activate: 'onActivate'}, DivComponent);
			render(<Component onActivate={handleActivate} disabled />);
			act(() => data.onActivate());
			expect(handleActivate).not.toHaveBeenCalled();
		});

		test('should not invoke passed "onDeactivate" handler when "disabled"', () => {
			const handleDeactivate = jest.fn();
			const Component = Toggleable({deactivate: 'onDeactivate'}, DivComponent);
			render(<Component onDeactivate={handleDeactivate} disabled />);
			act(() => data.onDeactivate());

			expect(handleDeactivate).not.toHaveBeenCalled();
		});
	});

	describe('#updating state', () => {
		test('should update "selected" when "onToggle" invoked and is not controlled', () => {
			// eslint-disable-next-line
			console.error = () => {};
			const Component = Toggleable(DivComponent);
			render(<Component defaultSelected />);
			act(() => data.onToggle());
			const toggleableDiv = screen.getByTestId('selected-state');

			const expected = 'false';

			expect(toggleableDiv).toHaveTextContent(expected);
		});

		test('should update "selected" when "onJiggle" invoked and is not controlled', () => {
			// eslint-disable-next-line
			console.error = () => {};
			const Component = Toggleable({toggleProp: 'onJiggle'}, DivComponent);
			render(<Component defaultSelected />);
			act(() => data.onJiggle());
			const toggleableDiv = screen.getByTestId('selected-state');

			const expected = 'false';

			expect(toggleableDiv).toHaveTextContent(expected);
		});

		test('should not update "selected" when "onToggle" invoked and is not controlled but disabled',
			() => {
				const Component = Toggleable(DivComponent);
				render(<Component defaultSelected disabled />);
				act(() => data.onToggle());
				const toggleableDiv = screen.getByTestId('selected-state');

				const expected = 'true';

				expect(toggleableDiv).toHaveTextContent(expected);
			});

		test('should not update "selected" when "onActivate" invoked and is not controlled but disabled',
			() => {
				const Component = Toggleable({activate: 'onActivate'}, DivComponent);
				render(<Component defaultSelected={false} disabled />);
				act(() => data.onActivate());
				const toggleableDiv = screen.getByTestId('selected-state');

				const expected = 'false';

				expect(toggleableDiv).toHaveTextContent(expected);
			}
		);

		test('should not update "selected" when "onDeactivate" invoked and is not controlled but disabled',
			() => {
				const Component = Toggleable({deactivate: 'onDeactivate'}, DivComponent);
				render(<Component defaultSelected disabled />);
				act(() => data.onDeactivate());
				const toggleableDiv = screen.getByTestId('selected-state');

				const expected = 'true';

				expect(toggleableDiv).toHaveTextContent(expected);
			});

		test('should not update "selected" when "onToggle" invoked and is controlled', () => {
			const Component = Toggleable(DivComponent);
			render(<Component selected />);
			act(() => data.onToggle());
			const toggleableDiv = screen.getByTestId('selected-state');

			const expected = 'true';

			expect(toggleableDiv).toHaveTextContent(expected);
		});

		test('should not update "selected" when "onJiggle" invoked and is controlled', () => {
			const Component = Toggleable({toggleProp: 'onJiggle'}, DivComponent);
			render(<Component selected />);
			act(() => data.onJiggle());
			const toggleableDiv = screen.getByTestId('selected-state');

			const expected = 'true';

			expect(toggleableDiv).toHaveTextContent(expected);
		});

		test('should not update "selected" when "onActivate" invoked and is controlled', () => {
			const Component = Toggleable({activate: 'onActivate'}, DivComponent);
			render(<Component selected={false} />);
			act(() => data.onActivate());
			const toggleableDiv = screen.getByTestId('selected-state');

			const expected = 'false';

			expect(toggleableDiv).toHaveTextContent(expected);
		});

		test('should not update "selected" when "onDeactivate" invoked and is controlled', () => {
			const Component = Toggleable({deactivate: 'onDeactivate'}, DivComponent);
			render(<Component selected />);
			act(() => data.onDeactivate());
			const toggleableDiv = screen.getByTestId('selected-state');

			const expected = 'true';

			expect(toggleableDiv).toHaveTextContent(expected);
		});
	});

	describe('#new props', () => {
		test('should update "selected" with new props when controlled', () => {
			const Component = Toggleable(DivComponent);
			const {rerender} = render(<Component selected />);

			rerender(<Component selected={false} />);
			const toggleableDiv = screen.getByTestId('selected-state');

			const expected = 'false';

			expect(toggleableDiv).toHaveTextContent(expected);
		});

		test('should not update "selected" with new props when not controlled', () => {
			const Component = Toggleable(DivComponent);
			const {rerender} = render(<Component defaultSelected />);
			const toggleableDiv = screen.getByTestId('selected-state');

			const expected = 'true';

			expect(toggleableDiv).toHaveTextContent(expected);

			rerender(<Component defaultSelected selected={false} />);

			expect(toggleableDiv).toHaveTextContent(expected);
		});

		test('should not update "selected" with custom prop and new defaultProp when not controlled', () => {
			const Component = Toggleable({prop: 'active'}, DivComponent);
			const {rerender} = render(<Component defaultSelected />);

			const expectedProp = 'active';
			const expectedValue = false;

			expect(data).toHaveProperty(expectedProp, expectedValue);

			rerender(<Component defaultSelected={false} />);

			expect(data).toHaveProperty(expectedProp, expectedValue);
		});
	});

	// testing regression from #2679 causing #2735
	test('should not update instance value when prop did not change', () => {
		const Component = Toggleable(DivComponent);
		const {rerender} = render(<Component />);
		act(() => data.onToggle());

		rerender(<Component />);
		const toggleableDiv = screen.getByTestId('selected-state');

		const expected = 'true';

		expect(toggleableDiv).toHaveTextContent(expected);
	});
});
