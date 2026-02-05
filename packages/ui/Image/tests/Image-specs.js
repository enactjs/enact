import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import Image, {ImageBase} from '../Image';

const src = {
	'hd': 'http://lorempixel.com/64/64/city/1/',
	'fhd': 'http://lorempixel.com/128/128/city/1/',
	'uhd': 'http://lorempixel.com/256/256/city/1/'
};

describe('Image Specs', () => {
	test('should only have image class without sizing', () => {
		render(<ImageBase data-testid="image" sizing="none" src={src} />);

		const expected = 'image';
		const imageElement = screen.getByTestId('image');

		expect(imageElement).toHaveClass(expected);
	});

	test('should have class for fill', () => {
		render(<ImageBase data-testid="image" sizing="fill" src={src} />);

		const expected = 'fill';
		const imageElement = screen.getByTestId('image');

		expect(imageElement).toHaveClass(expected);
	});

	test('should have class for fit', () => {
		render(<ImageBase data-testid="image" sizing="fit" src={src} />);

		const expected = 'fit';
		const imageElement = screen.getByTestId('image');

		expect(imageElement).toHaveClass(expected);
	});

	test('should set role to img by default', () => {
		render(<ImageBase data-testid="image" sizing="fit" src={src} />);

		const expected = 'img';
		const imageElement = screen.getByTestId('image');

		expect(imageElement).toHaveAttribute('role', expected);
	});

	test('should return a DOM node reference for `componentRef`', () => {
		const ref = jest.fn();
		render(<Image ref={ref} src={src} />);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});
});
