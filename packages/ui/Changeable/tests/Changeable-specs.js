import '@testing-library/jest-dom';
import {act, render, screen} from '@testing-library/react';

import Changeable from '../Changeable';

describe('Changeable', () => {
	let data;
	const testValue = 3;

	const DivComponent = (props) => {
		data = props;
		return <div data-testid="changeable">{props.value?.toString()}</div>;
	};

	describe('#config', () => {
		test('should pass \'value\' to the wrapped component', () => {
			const Component = Changeable(DivComponent);
			render(<Component />);

			const expected = '';
			const actual = screen.getByTestId('changeable');

			expect(actual).toHaveTextContent(expected);
		});

		test('should pass configured \'prop\' as the value\'s key to the wrapped component', () => {
			const prop = 'id';
			const Component = Changeable({prop: prop}, DivComponent);
			render(<Component defaultId={testValue} />);

			expect(data).toHaveProperty(prop, testValue);
		});

		test('should pass \'onChange\' handler to the wrapped component', () => {
			const Component = Changeable(DivComponent);
			render(<Component />);

			expect(data).toHaveProperty('onChange');

			const expected = 'function';
			const actual = typeof data.onChange;

			expect(actual).toBe(expected);
		});

		test('should pass configured handler to the wrapped component', () => {
			const handle = 'onClick';
			const Component = Changeable({change: handle}, DivComponent);
			render(<Component />);

			expect(data).toHaveProperty(handle);

			const expected = 'function';
			const actual = typeof data.onClick;

			expect(actual).toBe(expected);
		});
	});

	describe('#prop', () => {
		test('should use defaultValue prop when value prop is omitted', () => {
			const Component = Changeable(DivComponent);
			render(<Component defaultValue={1} />);

			const expected = '1';
			const actual = screen.getByTestId('changeable');

			expect(actual).toHaveTextContent(expected);
		});

		test('should warn when \'defaultValue\' and \'value\' props are provided', () => {
			const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
			const Component = Changeable(DivComponent);
			render(
				<Component defaultValue={10} value={5} />
			);

			const expected = 1;
			const actual = spy.mock.calls.length;

			expect(actual).toBe(expected);
		});

		test('should use defaultValue prop when value prop is null', () => {
			const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
			const Component = Changeable(DivComponent);
			render(<Component defaultValue={1} value={null} />);

			const expected = '1';
			const actual = screen.getByTestId('changeable');

			expect(actual).toHaveTextContent(expected);
			expect(spy).toHaveBeenCalled();
		});

		test('should use value prop when value changed from truthy to null', () => {
			const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
			const Component = Changeable(DivComponent);
			const {rerender} = render(<Component defaultValue={1} value={2} />);

			rerender(<Component defaultValue={1} value={null} />);

			const expected = '';
			const actual = screen.getByTestId('changeable');

			expect(actual).toHaveTextContent(expected);
			expect(spy).toHaveBeenCalled();
		});

		test('should use defaultValue prop when value prop is undefined', () => {
			const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
			const Component = Changeable(DivComponent);
			// eslint-disable-next-line no-undefined
			render(<Component defaultValue={1} value={undefined} />);

			const expected = '1';
			const actual = screen.getByTestId('changeable');

			expect(actual).toHaveTextContent(expected);
			expect(spy).toHaveBeenCalled();
		});

		test('should use value prop when value changed from truthy to undefined', () => {
			const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
			const Component = Changeable(DivComponent);
			const {rerender} = render(<Component defaultValue={1} value={2} />);

			// eslint-disable-next-line no-undefined
			rerender(<Component defaultValue={1} value={undefined} />);

			const expected = '';
			const actual = screen.getByTestId('changeable');

			expect(actual).toHaveTextContent(expected);
			expect(spy).toHaveBeenCalled();
		});

		test('should use value prop when defined but falsy', () => {
			const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
			const Component = Changeable(DivComponent);
			render(<Component defaultValue={1} value={0} />);

			const expected = '0';
			const actual = screen.getByTestId('changeable');

			expect(actual).toHaveTextContent(expected);
			expect(spy).toHaveBeenCalled();
		});

		test('should use value prop when both value and defaultValue are defined', () => {
			const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
			const Component = Changeable(DivComponent);
			render(
				<Component defaultValue={1} value={2} />
			);

			const expected = '2';
			const actual = screen.getByTestId('changeable');

			expect(actual).toHaveTextContent(expected);
			expect(spy).toHaveBeenCalled();
		});
	});

	test('should invoke passed \'onChange\' handler', () => {
		const handleChange = jest.fn();
		const Component = Changeable(DivComponent);
		render(<Component onChange={handleChange} />);

		act(() => data.onChange({}));

		const expected = 1;
		const actual = handleChange.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test('should not invoke passed \'onChange\' handler when \'disabled\'', () => {
		const handleChange = jest.fn();
		const Component = Changeable(DivComponent);
		render(<Component onChange={handleChange} disabled />);

		act(() => data.onChange({value: '1'}));

		expect(handleChange).not.toHaveBeenCalled();
	});

	test('should update \'value\' when \'onChange\' invoked and is not controlled', () => {
		const handleChange = jest.fn();
		const Component = Changeable(DivComponent);
		render(<Component defaultValue={0} onChange={handleChange} />);

		act(() => data.onChange({value: '1'}));

		const expected = '1';
		const actual = screen.getByTestId('changeable');

		expect(actual).toHaveTextContent(expected);
	});

	test('should not update \'value\' when \'onChange\' invoked and is not controlled but disabled', () => {
		const Component = Changeable(DivComponent);
		render(<Component defaultValue={0} disabled />);

		act(() => data.onChange({value: '1'}));

		const expected = '0';
		const actual = screen.getByTestId('changeable');

		expect(actual).toHaveTextContent(expected);
	});

	test('should not update \'value\' when \'onChange\' invoked and is controlled', () => {
		const Component = Changeable(DivComponent);
		render(<Component value={0} />);

		act(() => data.onChange({value: '1'}));

		const expected = '0';
		const actual = screen.getByTestId('changeable');

		expect(actual).toHaveTextContent(expected);
	});

	test('should update \'value\' with new props when is controlled', () => {
		const Component = Changeable(DivComponent);
		const {rerender} = render(<Component value={0} />);

		rerender(<Component value={1} />);

		const expected = '1';
		const actual = screen.getByTestId('changeable');

		expect(actual).toHaveTextContent(expected);
	});

	test('should not update \'value\' with new props when is not controlled', () => {
		// eslint-disable-next-line
		console.error = () => {};
		const Component = Changeable(DivComponent);
		const {rerender} = render(<Component defaultValue={0} />);

		rerender(<Component defaultValue={0} value={1} />);

		const expected = '0';
		const actual = screen.getByTestId('changeable');

		expect(actual).toHaveTextContent(expected);
	});

	test('should not update the value with new defaultProp when is not controlled', () => {
		const Component = Changeable(DivComponent);
		const {rerender} = render(<Component defaultValue={0} />);

		rerender(<Component defaultValue={1} />);

		const expected = '0';
		const actual = screen.getByTestId('changeable');

		expect(actual).toHaveTextContent(expected);
	});
});
