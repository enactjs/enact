import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import {Callback, CallbackObject} from '@enact/core/types';
import {useEffect} from 'react';

import useControlledState from '../useControlledState';

describe('useControlledState', () => {
	let data: Callback;

	function Component (props: {defaultValue?: string | null, value?: string, onChange?: Callback}) {
		const [value, setValue] = useControlledState(props.defaultValue, props.value, 'value' in props);
		const handleChange = (ev: CallbackObject) => setValue(ev.value);
		useEffect(() => {
			data = setValue;
		}, [setValue]);

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
