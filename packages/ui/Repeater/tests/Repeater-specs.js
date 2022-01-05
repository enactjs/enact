import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import Repeater, {RepeaterBase} from '../Repeater';

describe('Repeater Specs', () => {
	const stringItems = ['One', 'Two', 'Three'];
	const objItems = stringItems.map((content, key) => ({key, content}));

	const CustomRootType = (props) => <div {...props} />;
	const CustomType = (props) => <div>{props.content}</div>;

	test('should have a root span element', () => {
		render(<RepeaterBase childComponent="div" data-testid="repeater">{stringItems}</RepeaterBase>);

		const expected = 'SPAN';
		const rootElementName = screen.getByTestId('repeater').nodeName;

		expect(rootElementName).toBe(expected);
	});

	test('should accept a nodeName as root element', () => {
		render(<RepeaterBase childComponent="div" component="div" data-testid="repeater">{stringItems}</RepeaterBase>);

		const expected = 'DIV';
		const rootElementName = screen.getByTestId('repeater').nodeName;

		expect(rootElementName).toBe(expected);
	});

	test('should accept a function as root element', () => {
		render(<RepeaterBase childComponent="div" component={CustomRootType} data-testid="repeater">{stringItems}</RepeaterBase>);

		const expected = 'DIV';
		const rootElementName = screen.getByTestId('repeater').nodeName;

		expect(rootElementName).toBe(expected);
	});

	test('should accept a nodeName as childComponent', () => {
		render(<RepeaterBase childComponent="div" data-testid="repeater">{stringItems}</RepeaterBase>);

		const expected = 3;
		const actual = screen.getByTestId('repeater').children.length;

		expect(actual).toBe(expected);
	});

	test('should accept a function as childComponent', () => {
		render(<RepeaterBase childComponent={CustomType} data-testid="repeater">{stringItems}</RepeaterBase>);

		const expected = 3;
		const actual = screen.getByTestId('repeater').children.length;

		expect(actual).toBe(expected);
	});

	test('should create a number of children matching the length of items', () => {
		render(<RepeaterBase childComponent="div" data-testid="repeater">{stringItems}</RepeaterBase>);

		const expected = stringItems.length;
		const actual = screen.getByTestId('repeater').children.length;

		expect(actual).toBe(expected);
	});

	test('should support an array of objects as items', () => {
		render(<RepeaterBase childComponent={CustomType} data-testid="repeater">{objItems}</RepeaterBase>);

		const expected = objItems.length;
		const actual = screen.getByTestId('repeater').children.length;

		expect(actual).toBe(expected);
	});

	test('should support passing itemProps to children', () => {
		render(<RepeaterBase childComponent="div" data-testid="repeater" itemProps={{title: 'test'}}>{stringItems}</RepeaterBase>);

		const expected = 'test';
		const actual = screen.getByTestId('repeater').children.item(0);

		expect(actual).toHaveAttribute('title', expected);
	});

	test('should pass index to each child', () => {
		render(<RepeaterBase childComponent="div" data-testid="repeater">{stringItems}</RepeaterBase>);

		const expected = '0';
		const actual = screen.getByTestId('repeater').children.item(0);

		expect(actual).toHaveAttribute('data-index', expected);
	});

	test('should pass data to each child', () => {
		render(<RepeaterBase childComponent="div" childProp="data-str" data-testid="repeater">{stringItems}</RepeaterBase>);

		const expected = stringItems[0];
		const actual = screen.getByTestId('repeater').children.item(0);

		expect(actual).toHaveAttribute('data-str', expected);
	});

	test('should pass item as children to each child', () => {
		render(<RepeaterBase childComponent="div" data-testid="repeater">{stringItems}</RepeaterBase>);

		const expected = stringItems[0];
		const actual = screen.getByTestId('repeater').children.item(0);

		expect(actual).toHaveTextContent(expected);
	});

	test('should set role to list by default', () => {
		render(<RepeaterBase childComponent="div" data-testid="repeater">{stringItems}</RepeaterBase>);

		const expected = 'list';
		const listElement = screen.getByTestId('repeater');

		expect(listElement).toHaveAttribute('role', expected);
	});

	test('should allow role to be overridden', () => {
		render(<RepeaterBase childComponent="div" data-testid="repeater" role="listbox">{stringItems}</RepeaterBase>);

		const expected = 'listbox';
		const listElement = screen.getByTestId('repeater');

		expect(listElement).toHaveAttribute('role', expected);
	});

	test('should return a DOM node reference for `componentRef`', () => {
		const ref = jest.fn();
		render(<Repeater childComponent="div" component="div" ref={ref}>{stringItems}</Repeater>);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});
});
