import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import ImageItem, {ImageItemBase} from '../ImageItem';

const src = {
	'hd': 'http://lorempixel.com/64/64/city/1/',
	'fhd': 'http://lorempixel.com/128/128/city/1/',
	'uhd': 'http://lorempixel.com/256/256/city/1/'
};

const slotBefore = () => {
	return null;
}

describe('ImageItem', () => {
	let data;

	const Img = (props) => {
		data = props;
		return null;
	};

	test('should support `children` prop', () => {
		const children = 'children';
		render(<ImageItemBase data-testid="imageItem" src={src.hd}>{children}</ImageItemBase>);

		const expected = children;
		const imageItem = screen.getByTestId('imageItem');

		expect(imageItem).toHaveTextContent(expected);
	});

	test('should omit caption node when `children` is unset', () => {
		render(<ImageItemBase data-testid="imageItem" src={src} />);

		const expected = 1;
		const imageItemChildren = screen.getByTestId('imageItem').children;

		expect(imageItemChildren).toHaveLength(expected);
	});

	test('should apply `.horizontal` when `orientation="horizontal"`', () => {
		render(<ImageItem data-testid="imageItem" orientation="horizontal" src={src} />);

		const expected = 'horizontal';
		const imageItem = screen.getByTestId('imageItem');

		expect(imageItem).toHaveClass(expected);
	});

	test('should apply `.vertical` when `orientation="vertical"`', () => {
		render(<ImageItemBase data-testid="imageItem" orientation="vertical" src={src} />);

		const expected = 'vertical';
		const imageItem = screen.getByTestId('imageItem');

		expect(imageItem).toHaveClass(expected);
	});

	test('should apply `.selected` when `selected`', () => {
		render(<ImageItemBase data-testid="imageItem" selected src={src} />);

		const expected = 'selected';
		const imageItem = screen.getByTestId('imageItem');

		expect(imageItem).toHaveClass(expected);
	});

	test('should apply `.slotBefore` when `slotBefore`', () => {
		render(<ImageItemBase data-testid="imageItem" slotBefore={slotBefore} selected src={src} />);

		const expected = 'slotBefore';
		const imageItem = screen.getByTestId('imageItem').firstElementChild;

		expect(imageItem).toHaveClass(expected);
	});

	test('should pass `src` and `placeholder` to `imageComponent` as component', () => {
		const props = {
			src: 'img.png',
			placeholder: 'place.png'
		};

		render(<ImageItemBase imageComponent={Img} {...props} />);

		expect(data).toMatchObject(props);
	});

	test('should pass `src` and `placeholder` to `imageComponent` as element', () => {
		const props = {
			src: 'img.png',
			placeholder: 'place.png'
		};

		render(<ImageItemBase imageComponent={<Img />} {...props} />);

		expect(data).toMatchObject(props);
	});

	test('should override `src` and `placeholder` when passing `imageComponent` as element', () => {
		const props = {
			src: 'img.png',
			placeholder: 'place.png'
		};

		render(
			<ImageItemBase
				imageComponent={<Img placeholder="my-place.png" src="my-src.png" />}
				{...props}
			/>
		);

		expect(data).toMatchObject(props);
	});

	test('should support string for `src` prop', () => {
		render(<ImageItemBase src={src.hd} />);

		const expected = src.hd;
		const imgElement = screen.getAllByRole('img')[1];

		expect(imgElement).toHaveAttribute('src', expected);
	});

	test('should support object for `src` prop', () => {
		render(<ImageItemBase src={src} />);

		const imgElementSrc = screen.getAllByRole('img')[1];

		expect(imgElementSrc).not.toBeNull();
	});

	test('should return a DOM node reference for `componentRef`', () => {
		const ref = jest.fn();
		render(<ImageItem ref={ref} src={src} />);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});
});
