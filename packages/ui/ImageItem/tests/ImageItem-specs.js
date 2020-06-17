// import {render} from '@testing-library/react'
import React from 'react';
import {mount, shallow} from 'enzyme';

import ImageItem from '../ImageItem';

const src = {
	'hd': 'http://lorempixel.com/64/64/city/1/',
	'fhd': 'http://lorempixel.com/128/128/city/1/',
	'uhd': 'http://lorempixel.com/256/256/city/1/'
};

describe('ImageItem', () => {
	function Img () {
		return null;
	}

	// FIXME:
	// enzyme doesn't support a new context consumer yet.
	// `children` and `src` is updated throught a context.
	// It will be fixed based on testing-library later.
	test.skip('should support `children` prop', () => {
		const children = 'children';
		const subject = shallow(
			<ImageItem>{children}</ImageItem>
		);

		const expected = children;
		const actual = subject.find('.caption').prop('children');

		expect(actual).toBe(expected);
	});

	test('should omit caption node when `children` is unset', () => {
		const subject = shallow(
			<ImageItem />
		);

		const actual = subject.find('.caption');

		expect(actual).toHaveLength(0);
	});

	test('should use a `Row` when `orientation="horizontal"`', () => {
		const subject = shallow(
			<ImageItem orientation="horizontal" />
		);

		const actual = subject.find('Row.imageItem');

		expect(actual).toHaveLength(1);
	});

	test('should apply `.horizontal` when `orientation="horizontal"`', () => {
		const subject = shallow(
			<ImageItem orientation="horizontal" />
		);

		const expected = 'horizontal';
		const actual = subject.find('Row.imageItem').prop('className');

		expect(actual).toContain(expected);
	});

	test('should use a `Column` when `orientation="vertical"`', () => {
		const subject = shallow(
			<ImageItem orientation="vertical" />
		);

		const actual = subject.find('Column.imageItem');

		expect(actual).toHaveLength(1);
	});

	test('should apply `.horizontal` when `orientation="vertical"`', () => {
		const subject = shallow(
			<ImageItem orientation="vertical" />
		);

		const expected = 'vertical';
		const actual = subject.find('Column.imageItem').prop('className');

		expect(actual).toContain(expected);
	});

	test('should apply `.selected` when `selected`', () => {
		const subject = shallow(
			<ImageItem selected />
		);

		const expected = 'selected';
		const actual = subject.find('Column.imageItem').prop('className');

		expect(actual).toContain(expected);
	});

	test('should pass `src` and `placeholder` to `imageComponent` as component', () => {
		const props = {
			src: 'img.png',
			placeholder: 'place.png'
		};

		// Using mount() to render Img within Cell
		const subject = mount(
			<ImageItem imageComponent={Img} {...props} />
		);

		const expected = props;
		const actual = subject.find(Img).props();

		expect(actual).toMatchObject(expected);
	});

	test('should pass `src` and `placeholder` to `imageComponent` as element', () => {
		const props = {
			src: 'img.png',
			placeholder: 'place.png'
		};

		// Using mount() to render Img within Cell
		const subject = mount(
			<ImageItem imageComponent={<Img />} {...props} />
		);

		const expected = props;
		const actual = subject.find(Img).props();

		expect(actual).toMatchObject(expected);
	});

	test('should override `src` and `placeholder` when passing `imageComponent` as element', () => {
		const props = {
			src: 'img.png',
			placeholder: 'place.png'
		};

		// Using mount() to render Img within Cell
		const subject = mount(
			<ImageItem
				imageComponent={<Img src="my-src.png" placeholder="my-place.png" />}
				{...props}
			/>
		);

		const expected = props;
		const actual = subject.find(Img).props();

		expect(actual).toMatchObject(expected);
	});

	// FIXME:
	// enzyme doesn't support a new context consumer yet.
	// `children` and `src` is updated throught a context.
	// It will be fixed based on testing-library later.
	test.skip('should support string for `src` prop', () => {
		const subject = shallow(
			<ImageItem src={src.hd} />
		);

		const expected = {src: src.hd};
		const actual = subject.find('.image').props();

		expect(actual).toMatchObject(expected);
	});

	// FIXME:
	// enzyme doesn't support a new context consumer yet.
	// `children` and `src` is updated throught a context.
	// It will be fixed based on testing-library later.
	test.skip('should support object for `src` prop', () => {
		const subject = shallow(
			<ImageItem src={src} />
		);

		const expected = {src};
		const actual = subject.find('.image').props();

		expect(actual).toMatchObject(expected);
	});
});
