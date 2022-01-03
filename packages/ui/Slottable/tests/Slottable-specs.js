/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import kind from '@enact/core/kind';
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import Slottable from '../Slottable';

describe('Slottable Specs', () => {
	test('should distribute children with a \'slot\' property', () => {
		const Component = Slottable({slots: ['a', 'b', 'c']}, ({a, b, c}) => (
			<div data-testid="slottable">
				{c}
				{b}
				{a}
			</div>
		));
		render(
			<Component>
				<div slot="a">A</div>
				<div slot="b">B</div>
				<div slot="c">C</div>
			</Component>
		);

		const actual = screen.getByTestId('slottable');
		const expected = 'CBA';

		expect(actual.textContent).toBe(expected);
	});

	test('should distribute children with a \'type\' that matches a slot', () => {
		const Component = Slottable({slots: ['a', 'b', 'c', 'custom']}, ({a, b, c, custom}) => (
			<div data-testid="slottable">
				{c}
				{b}
				{a}
				{custom}
			</div>
		));
		render(
			<Component>
				<div slot="a">A</div>
				<div slot="b">B</div>
				<custom>D</custom>
				<div slot="c">C</div>
			</Component>
		);

		const actual = screen.getByTestId('slottable');
		const expected = 'CBAD';

		expect(actual.textContent).toBe(expected);
	});

	test('should distribute children whose \'type\' has a \'defaultSlot\' property that matches a slot', () => {
		const Custom = kind({
			name: 'Custom',
			render: ({children}) => {
				return <div>{children}</div>;
			}
		});
		Custom.defaultSlot = 'c';

		const Component = Slottable({slots: ['a', 'b', 'c']}, ({a, b, c}) => (
			<div data-testid="slottable">
				{c}
				{b}
				{a}
			</div>
		));
		render(
			<Component>
				<div slot="a">A</div>
				<div slot="b">B</div>
				<Custom>C</Custom>
			</Component>
		);

		const expected = 'CBA';
		const actual = screen.getByTestId('slottable');

		expect(actual.textContent).toBe(expected);
	});

	test('should distribute children with no \'slot\' property to Slottable\'s \'children\'', () => {
		const Component = Slottable({slots: ['a', 'b']}, ({a, b, children}) => (
			<div data-testid="slottable">
				{children}
				{b}
				{a}
			</div>
		));
		render(
			<Component>
				<div slot="a">A</div>
				<div slot="b">B</div>
				<div>C</div>
			</Component>
		);

		const expected = 'CBA';
		const actual = screen.getByTestId('slottable');

		expect(actual.textContent).toBe(expected);
	});

	test('should not distribute children with an invalid \'slot\' property', () => {
		// Modify the console spy to silence error output with
		// an empty mock implementation
		console.error.mockImplementation();

		const Component = Slottable({slots: ['a', 'b']}, ({a, b, c}) => (
			<div data-testid="slottable">
				{c}
				{b}
				{a}
			</div>
		));

		render(
			<Component>
				<div slot="a">A</div>
				<div slot="b">B</div>
				<div slot="c">C</div>
			</Component>
		);

		const expected = 'BA';
		const actual = screen.getByTestId('slottable');

		expect(actual.textContent).toBe(expected);

		// Check to make sure that we only get the one expected error
		const actualErrorsLength = console.error.mock.calls.length;
		const expectedErrorLength = 1;

		expect(actualErrorsLength).toBe(expectedErrorLength);

		const actualError = console.error.mock.calls[0][0];
		const expectedError = 'Warning: The slot "c" specified on div does not exist';

		expect(actualError).toBe(expectedError);
	});

	test('should distribute children with props other than simply \'children\', in entirety, to the matching destination slot', () => {
		const Component = Slottable({slots: ['a', 'b', 'c', 'custom']}, ({a, b, c, custom}) => (
			<div className="root-div" data-testid="slottable">
				{c}
				{b}
				{a}
				{custom}
			</div>
		));
		render(
			<Component>
				<div slot="a" title="Div A" />
				<div slot="b">B</div>
				<custom>D</custom>
				<div slot="c">C</div>
			</Component>
		);

		const expected = 'CBD';
		const actual = screen.getByTestId('slottable');

		expect(actual.textContent).toBe(expected);

		const expectedTitle = 'Div A';
		const actualChild = screen.getByTestId('slottable').children[2];

		expect(actualChild).toHaveAttribute('title', expectedTitle);
	});

	test('should preserve values in \'slot\' property', () => {
		// This suppresses the unique key warning that this implementation creates. Also, we can't
		// restore this because it breaks our global warning listener.
		jest.spyOn(console, 'error').mockImplementation(() => {});

		const Component = Slottable({slots: ['a']}, ({a}) => (
			<div data-testid="slottable">
				{a}
			</div>
		));
		render(
			<Component a={<div key="X">X</div>}>
				<div slot="a" key="A">A</div>
			</Component>
		);

		const expected = 'XA';
		const actual = screen.getByTestId('slottable');

		expect(actual.textContent).toBe(expected);
	});

	test('should add values to existing array in \'slot\' property', () => {
		const Component = Slottable({slots: ['a']}, ({a}) => (
			<div data-testid="slottable">
				{a}
			</div>
		));

		/* eslint-disable jsx-a11y/anchor-is-valid */
		render(
			<Component a={['a', 'b']}>
				<a>c</a>
			</Component>
		);

		/* eslint-enable jsx-a11y/anchor-is-valid */
		const actual = screen.getByTestId('slottable');

		expect(actual).toHaveTextContent('abc');
	});

	test('should distribute multiple children with the same slot into the same slot', () => {
		function ComponentBase ({a}) {
			return (
				<div className="root-div" data-testid="slottable">
					{a}
				</div>
			);
		}

		const Component = Slottable({slots: ['a']}, ComponentBase);

		render(
			<Component>
				<div slot="a">A</div>
				<div slot="a">A</div>
				<div slot="a">A</div>
			</Component>
		);

		const expected = 'AAA';
		const actual = screen.getByTestId('slottable');

		expect(actual.textContent).toBe(expected);
	});

	test('should allow downstream component to have default value for unset slot', () => {
		function ComponentBase ({a}) {
			return (
				<div data-testid="slottable">
					{a}
				</div>
			);
		}

		ComponentBase.defaultProps = {
			a: 'Default A'
		};

		const Component = Slottable({slots: ['a']}, ComponentBase);

		render(<Component />);

		const actual = screen.getByTestId('slottable');

		expect(actual).toHaveTextContent('Default A');
	});
});
