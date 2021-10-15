import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import ImageItem, {ImageItemBase} from '../ImageItem';

const src = {
	'hd': 'http://lorempixel.com/64/64/city/1/',
	'fhd': 'http://lorempixel.com/128/128/city/1/',
	'uhd': 'http://lorempixel.com/256/256/city/1/'
};

describe('ImageItem', () => {
	let data = [];

	const Img =  (props) => {
		data = props;
		return null;
	};

	test('should support `children` prop', () => {
		const children = 'children';
		render(<ImageItemBase data-testid="imageItem">{children}</ImageItemBase>);

		const expected = children;
		const imageItem = screen.getByTestId('imageItem');

		expect(imageItem).toHaveTextContent(expected);
	});

	test('should omit caption node when `children` is unset', () => {
		render(
			<ImageItemBase data-testid="imageItem" />
		);

		const expected = 1;
		const imageItemChildren = screen.getByTestId('imageItem').children;

		expect(imageItemChildren).toHaveLength(expected);
	});

	test('should apply `.horizontal` when `orientation="horizontal"`', () => {
		render(<ImageItem data-testid="imageItem" orientation="horizontal" />);

		const expected = 'horizontal';
		const imageItem = screen.getByTestId('imageItem');

		expect(imageItem).toHaveClass(expected);
	});

	test('should apply `.vertical` when `orientation="vertical"`', () => {
		render(<ImageItemBase data-testid="imageItem" orientation="vertical" />);

		const expected = 'vertical';
		const imageItem = screen.getByTestId('imageItem');

		expect(imageItem).toHaveClass(expected);
	});

	test('should apply `.selected` when `selected`', () => {
		render(<ImageItemBase data-testid="imageItem" selected />);

		const expected = 'selected';
		const imageItem = screen.getByTestId('imageItem');

		expect(imageItem).toHaveClass(expected);
	});

	test('should pass `src` and `placeholder` to `imageComponent` as component', () => {
		const props = {
			src: 'img.png',
			placeholder: 'place.png'
		};

		render(<ImageItemBase data-testid="imageItem" imageComponent={Img} {...props} />);

		expect(data).toHaveProperty('src', props.src);
		expect(data).toHaveProperty('placeholder', props.placeholder);
	});

	test('should pass `src` and `placeholder` to `imageComponent` as element', () => {
		const props = {
			src: 'img.png',
			placeholder: 'place.png'
		};

		render(<ImageItemBase imageComponent={<Img />} {...props} />);

		expect(data).toHaveProperty('src', props.src);
		expect(data).toHaveProperty('placeholder', props.placeholder);
	});

	test('should override `src` and `placeholder` when passing `imageComponent` as element', () => {
		const props = {
			src: 'img.png',
			placeholder: 'place.png'
		};

		// Using mount() to render Img within Cell
		render(
			<ImageItemBase
				imageComponent={<Img src="my-src.png" placeholder="my-place.png" />}
				{...props}
			/>
		);

		expect(data).toHaveProperty('src', props.src);
		expect(data).toHaveProperty('placeholder', props.placeholder);
	});

	test('should support string for `src` prop', () => {
		render(<ImageItemBase data-testid="imageItem" src={src.hd} />);

		const expected = src.hd;
		const imgElement = screen.getByTestId('imageItem').children.item(0).children.item(0);

		expect(imgElement).toHaveAttribute('src', expected);
	});

	test('should support object for `src` prop', () => {
		render(<ImageItemBase data-testid="imageItem" src={src} />);

		const imgElementSrc = screen.getByTestId('imageItem').children.item(0).children.item(0).src;
		// const actual = subject.find('.image').props();
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
