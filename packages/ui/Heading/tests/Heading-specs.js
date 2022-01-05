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

	test('should apply a size class when defining a size', () => {
		render(<Heading size="large">Heading Text</Heading>);

		const expected = 'large';
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

	test('should return a DOM node reference for `componentRef`', () => {
		const ref = jest.fn();
		render(<Heading size="large" ref={ref} />);

		const expected = 'H3';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});
});
