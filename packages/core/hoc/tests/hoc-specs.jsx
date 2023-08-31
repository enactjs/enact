/* eslint-disable enact/display-name */

import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import hoc from '../hoc';

describe('hoc', () => {
	let data;
	const testID = 'test-HoC';
	const defaultConfig = {
		color: 'blue'
	};

	const HoC = hoc(defaultConfig, (config, Wrapped) => {
		data = Wrapped;
		return (props) => <Wrapped {...props} {...config} data-testid={testID} />;
	});

	const NullHoC = hoc(null, (config, Wrapped) => {
		return () => <Wrapped {...config} data-testid={testID} />;
	});

	test('should support HoC factory function as first argument to hoc()', () => {
		const ImplicitNullHoC = hoc((config, Wrapped) => {
			return () => <Wrapped {...config} data-testid={testID} />;
		});
		const Component = ImplicitNullHoC('span');
		render(<Component />);
		const component = screen.getByTestId(testID);

		const expected = 'SPAN';
		const actual = component.nodeName;

		expect(actual).toBe(expected);
	});

	test('should support DOM node name as first argument to HoC', () => {
		const Component = HoC('span');
		render(<Component />);
		const component = screen.getByTestId(testID);

		const expected = 'SPAN';
		const actual = component.nodeName;

		expect(actual).toBe(expected);
	});

	test('should support React component as first argument to HoC', () => {
		function Thing () {
			return <div data-testid={testID} />;
		}
		const Component = HoC(Thing);
		render(<Component />);
		const component = screen.getByTestId(testID);

		const expected = 'DIV';
		const actual = component.nodeName;
		const actualWrapped = data;

		expect(actual).toBe(expected);
		expect(actualWrapped).toBe(Thing);
	});

	test('should use default config when instance config is omitted', () => {
		const Component = HoC('span');
		render(<Component />);
		const component = screen.getByTestId(testID);

		const expectedAttribute = 'color';
		const expectedValue = defaultConfig.color;

		expect(component).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should overwrite default config with instance config', () => {
		const instanceConfig = {
			color: 'green'
		};
		const Component = HoC(instanceConfig, 'div');
		render(<Component />);
		const component = screen.getByTestId(testID);

		const expectedAttribute = 'color';
		const expectedValue = instanceConfig.color;

		expect(component).toHaveAttribute(expectedAttribute, expectedValue);
	});

	test('should allow construction without default or instance configs', () => {
		const Component = NullHoC('input');
		render(<Component />);
		const component = screen.getByTestId(testID);

		const expected = 'INPUT';
		const actual = component.nodeName;

		expect(actual).toBe(expected);
		expect(component).toBeInTheDocument();
	});

	test('should allow construction without default config', () => {
		const instanceConfig = {
			color: 'green'
		};
		const Component = NullHoC(instanceConfig, 'div');
		render(<Component />);
		const component = screen.getByTestId(testID);

		const expectedAttribute = 'color';
		const expectedValue = instanceConfig.color;

		expect(component).toHaveAttribute(expectedAttribute, expectedValue);
	});
});
