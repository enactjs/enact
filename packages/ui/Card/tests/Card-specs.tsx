import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import Card, {CardBase} from '../Card';

const src = {
	'hd': 'https://placehold.co/200x200/000000/ffffff/png',
	'fhd': 'https://placehold.co/300x300/000000/ffffff/png',
	'uhd': 'https://placehold.co/600x600/000000/ffffff/png'
};

describe('Card', () => {
	test('should support `children` prop', () => {
		const children = 'children';
		render(<CardBase src={src.hd}>{children}</CardBase>);

		const expected = children;
		const card = screen.getByText(children);

		expect(card).toHaveTextContent(expected);
	});

	test('should apply `.horizontal` when `orientation="horizontal"`', () => {
		render(<CardBase data-testid="card" orientation="horizontal" src={src} />);

		const expected = 'horizontal';
		const card = screen.getByTestId('card');

		expect(card).toHaveClass(expected);
	});

	test('should apply `.vertical` when `oreintation="vertical"`', () => {
		render(<CardBase data-testid="card" orientation="vertical" src={src} />);

		const expected = 'vertical';
		const card = screen.getByTestId('card');

		expect(card).toHaveClass(expected);
	});

	test('should apply `.selected` when `selected`', () => {
		render(<CardBase data-testid="card" selected src={src} />);

		const expected = 'selected';
		const card = screen.getByTestId('card');

		expect(card).toHaveClass(expected);
	});

	test('should apply `.captionOverlay` when `captionOverlay`', () => {
		render(<CardBase data-testid="card" captionOverlay src={src} />);

		const expected = 'captionOverlay';
		const card = screen.getByTestId('card');

		expect(card).toHaveClass(expected);
	});

	test('should support string for `src` prop', () => {
		render(<CardBase src={src.hd} />);

		const expected = src.hd;
		const imgElement = screen.getAllByRole('img')[1];

		expect(imgElement).toHaveAttribute('src', expected);
	});

	test('should support object for `src` prop', () => {
		render(<CardBase src={src} />);

		const imgElementSrc = screen.getAllByRole('img')[1];

		expect(imgElementSrc).not.toBeNull();
	});

	test('should return a DOM node reference for `componentRef`', () => {
		const ref = jest.fn();
		render(<Card ref={ref} src={src} />);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});
});
