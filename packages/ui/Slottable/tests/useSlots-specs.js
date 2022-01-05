/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import useSlots from '../useSlots';

describe('useSlots', () => {
	test('should distribute children with a \'slot\' property', () => {
		function Component ({a, b, c, children}) {
			const slots = useSlots({a, b, c, children});

			return (
				<div data-testid="useSlots">
					{slots.c}
					{slots.b}
					{slots.a}
				</div>
			);
		}

		render(
			<Component>
				<div slot="a">A</div>
				<div slot="b">B</div>
				<div slot="c">C</div>
			</Component>
		);

		const expected = 'CBA';
		const actual = screen.getByTestId('useSlots');

		expect(actual.textContent).toBe(expected);
	});

	test('should have no children when all have been distributed', () => {
		function Component ({a, b, c, children}) {
			const slots = useSlots({a, b, c, children});

			return (
				<div data-testid="useSlots">
					{slots.children}
				</div>
			);
		}

		render(
			<Component>
				<div slot="a">A</div>
				<div slot="b">B</div>
				<div slot="c">C</div>
			</Component>
		);

		const expected = '';
		const actual = screen.getByTestId('useSlots');

		expect(actual).toHaveTextContent(expected);
	});

	test('should distribute children with a \'type\' that matches a slot', () => {
		function Component ({a, b, c, children, custom}) {
			const slots = useSlots({a, b, c, children, custom});

			return (
				<div data-testid="useSlots">
					{slots.c}
					{slots.b}
					{slots.a}
					{slots.custom}
				</div>
			);
		}
		render(
			<Component>
				<div slot="a">A</div>
				<div slot="b">B</div>
				<custom>D</custom>
				<div slot="c">C</div>
			</Component>
		);

		const expected = 'CBAD';
		const actual = screen.getByTestId('useSlots');

		expect(actual.textContent).toBe(expected);
	});

	test('should distribute children whose \'type\' has a \'defaultSlot\' property that matches a slot', () => {
		function Custom (props) {
			return <div>{props.children}</div>;
		}
		Custom.defaultSlot = 'c';

		function Component ({a, b, c, children}) {
			const slots = useSlots({a, b, c, children});

			return (
				<div data-testid="useSlots">
					{slots.c}
					{slots.b}
					{slots.a}
				</div>
			);
		}

		render(
			<Component>
				<div slot="a">A</div>
				<div slot="b">B</div>
				<Custom>C</Custom>
			</Component>
		);

		const expected = 'CBA';
		const actual = screen.getByTestId('useSlots');

		expect(actual.textContent).toBe(expected);
	});

	test('should distribute children with no \'slot\' property to Slottable\'s \'children\'', () => {
		function Component ({a, b, children}) {
			const slots = useSlots({a, b, children});

			return (
				<div data-testid="useSlots">
					{slots.children}
					{slots.b}
					{slots.a}
				</div>
			);
		}
		render(
			<Component>
				<div slot="a">A</div>
				<div slot="b">B</div>
				<div>C</div>
			</Component>
		);

		const expected = 'CBA';
		const actual = screen.getByTestId('useSlots');

		expect(actual.textContent).toBe(expected);
	});

	test('should not distribute children with an invalid \'slot\' property', () => {
		// Modify the console spy to silence error output with
		// an empty mock implementation
		console.error.mockImplementation();

		function Component ({a, b, children}) {
			const slots = useSlots({a, b, children});

			return (
				<div data-testid="useSlots">
					{slots.c}
					{slots.b}
					{slots.a}
				</div>
			);
		}
		render(
			<Component>
				<div slot="a">A</div>
				<div slot="b">B</div>
				<div slot="c">C</div>
			</Component>
		);

		const expected = 'BA';
		const actual = screen.getByTestId('useSlots');

		expect(actual.textContent).toBe(expected);
		expect(actual.textContent).toHaveLength(2);

		// Check to make sure that we only get the one expected error
		const actualErrorsLength = console.error.mock.calls.length;
		const expectedErrorLength = 1;

		expect(actualErrorsLength).toBe(expectedErrorLength);

		const actualError = console.error.mock.calls[0][0];
		const expectedError = 'Warning: The slot "c" specified on div does not exist';

		expect(actualError).toBe(expectedError);
	});

	test('should distribute children with props other than simply \'children\', in entirety, to the matching destination slot', () => {
		function Component ({a, b, c, children, custom}) {
			const slots = useSlots({a, b, c, children, custom});

			return (
				<div className="root-div" data-testid="useSlots">
					{slots.c}
					{slots.b}
					{slots.a}
					{slots.custom}
				</div>
			);
		}
		render(
			<Component>
				<div slot="a" title="Div A" />
				<div slot="b">B</div>
				<custom>D</custom>
				<div slot="c">C</div>
			</Component>
		);

		const expected = 'CBD';
		const actual = screen.getByTestId('useSlots');

		expect(actual.textContent).toBe(expected);

		const expectedTitle = 'Div A';
		const actualChild = screen.getByTestId('useSlots').children[2];

		expect(actualChild).toHaveAttribute('title', expectedTitle);
	});

	test('should distribute multiple children with the same slot into the same slot', () => {
		function Component ({a, children}) {
			const slots = useSlots({a, children});
			return (
				<div data-testid="useSlots">
					{slots.a}
				</div>
			);
		}
		render(
			<Component>
				<div slot="a">A</div>
				<div slot="a">A</div>
				<div slot="a">A</div>
			</Component>
		);

		const expected = 'AAA';
		const actual = screen.getByTestId('useSlots');

		expect(actual.textContent).toBe(expected);
	});

	test('should override prop with slot value', () => {
		function Component ({a, children}) {
			const slots = useSlots({a, children});
			return (
				<div data-testid="useSlots">
					{slots.a}
				</div>
			);
		}
		render(
			<Component a="B">
				<div slot="a">A</div>
			</Component>
		);

		const actual = screen.getByTestId('useSlots');

		expect(actual).toHaveTextContent('A');
	});

	test('should fallback to prop when slot is omitted', () => {
		function Component ({a, children}) {
			const slots = useSlots({a, children});
			return (
				<div data-testid="useSlots">
					{slots.a}
				</div>
			);
		}
		render(
			<Component a="B" />
		);

		const actual = screen.getByTestId('useSlots');

		expect(actual).toHaveTextContent('B');
	});
});
