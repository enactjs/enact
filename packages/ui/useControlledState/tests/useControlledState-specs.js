import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import useControlledState from '../useControlledState';

describe('useControlledState', () => {
	let data;

	function Component (props) {
		const [value, setValue] = useControlledState(props.defaultValue, props.value, 'value' in props);
		const handleChange = (ev) => setValue(ev.value);
		data = setValue;

		return <div onChange={handleChange}>{value}</div>;
	}

	test('should use the default value when the value is undefined', () => {
		render(<Component defaultValue="abc" />);

		const actual = screen.queryByText('abc');

		expect(actual).toBeInTheDocument();
	});

	test('should not change default value', () => {
		const {rerender} = render(<Component defaultValue="abc" />);

		rerender(<Component defaultValue="def" />);

		const actual = screen.queryByText('abc');

		expect(actual).toBeInTheDocument();
	});

	test('should not change uncontrolled setting', () => {
		const {rerender} = render(<Component defaultValue="abc" />);

		rerender(<Component defaultValue={null} value="def" />);

		const actual = screen.queryByText('abc');

		expect(actual).toBeInTheDocument();
	});

	test('should update controlled value', () => {
		const {rerender} = render(<Component value="abc" />);

		rerender(<Component value="def" />);

		const actual = screen.queryByText('def');

		expect(actual).toBeInTheDocument();
	});

	test('should not change controlled setting', () => {
		const {rerender} = render(<Component value="abc" />);

		rerender(<Component defaultValue="def" value="ghi" />);

		const actual = screen.queryByText('ghi');

		expect(actual).toBeInTheDocument();
	});

	test('should not allow setting a value when controlled', () => {
		const handleChange = jest.fn();
		const value = 'ghi';
		render(<Component onChange={handleChange} value="abc" />);
		const component = screen.queryByText('abc');

		data(value);

		expect(component).toBeInTheDocument();
	});
});
