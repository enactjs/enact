import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import Heading from '../Heading';

describe('Heading Specs', () => {
	test('should render a Heading with content', () => {
		const content = 'Hello Heading!';
		render(<Heading>{content}</Heading>);

		const actual = screen.getByText('Hello Heading!');

		expect(actual).toBeInTheDocument();
	});

	test('should have medium class by default', () => {
		render(<Heading>Heading Text</Heading>);

		const expected = 'medium';
		const actual = screen.getByText('Heading Text');

		expect(actual).toHaveClass(expected);
	});

	test('should have title class if `size` is title', () => {
		render(<Heading size="title">Heading Text</Heading>);

		const expected = 'title';
		const actual = screen.getByText('Heading Text');

		expect(actual).toHaveClass(expected);
	});

	test('should have subtitle class if `size` is subtitle', () => {
		render(<Heading size="subtitle">Heading Text</Heading>);

		const expected = 'subtitle';
		const actual = screen.getByText('Heading Text');

		expect(actual).toHaveClass(expected);
	});

	test('should have large class if `size` is large', () => {
		render(<Heading size="large">Heading Text</Heading>);

		const expected = 'large';
		const actual = screen.getByText('Heading Text');

		expect(actual).toHaveClass(expected);
	});

	test('should have small class if `size` is small', () => {
		render(<Heading size="small">Heading Text</Heading>);

		const expected = 'small';
		const actual = screen.getByText('Heading Text');

		expect(actual).toHaveClass(expected);
	});

	test('should have tiny class if `size` is tiny', () => {
		render(<Heading size="tiny">Heading Text</Heading>);

		const expected = 'tiny';
		const actual = screen.getByText('Heading Text');

		expect(actual).toHaveClass(expected);
	});

	test('should apply a matching spacing class to its defined size', () => {
		render(<Heading size="large">Heading Text</Heading>);

		const expected = 'largeSpacing';
		const actual = screen.getByText('Heading Text');

		expect(actual).toHaveClass(expected);
	});

	test('should apply an alternate spacing class to its defined size if the two differ', () => {
		render(<Heading size="large" spacing="small">Heading Text</Heading>);

		const expected = 'smallSpacing';
		const actual = screen.getByText('Heading Text');

		expect(actual).toHaveClass(expected);
	});

	test('should have largeSpacing class if `spacing` is large', () => {
		render(<Heading spacing="large">Heading Text</Heading>);

		const expected = 'largeSpacing';
		const actual = screen.getByText('Heading Text');

		expect(actual).toHaveClass(expected);
	});

	test('should have mediumSpacing class if `spacing` is medium', () => {
		render(<Heading spacing="medium">Heading Text</Heading>);

		const expected = 'mediumSpacing';
		const actual = screen.getByText('Heading Text');

		expect(actual).toHaveClass(expected);
	});

	test('should have smallSpacing class if `spacing` is small', () => {
		render(<Heading spacing="small">Heading Text</Heading>);

		const expected = 'smallSpacing';
		const actual = screen.getByText('Heading Text');

		expect(actual).toHaveClass(expected);
	});

	test('should have noneSpacing class if `spacing` is none', () => {
		render(<Heading spacing="none">Heading Text</Heading>);

		const expected = 'noneSpacing';
		const actual = screen.getByText('Heading Text');

		expect(actual).toHaveClass(expected);
	});

	test('should return a DOM node reference for `componentRef`', () => {
		const ref = jest.fn();
		render(<Heading size="large" ref={ref} />);

		const expected = 'H3';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});
});
