import React from 'react';
import {mount, shallow} from 'enzyme';
import ImageBase from '../Image';
import css from '../Image.module.less';

const src = {
	'hd': 'http://lorempixel.com/64/64/city/1/',
	'fhd': 'http://lorempixel.com/128/128/city/1/',
	'uhd': 'http://lorempixel.com/256/256/city/1/'
};

describe('Image Specs', () => {
	test('should only have image class without sizing', () => {
		const image = mount(
			<ImageBase src={src} sizing="none" />
		);

		const expected = css.image;
		const actual = image.find('div').prop('className');

		expect(actual).toBe(expected);
	});

	test('should have class for fill', () => {
		const image = mount(
			<ImageBase src={src} sizing="fill" />
		);

		const expected = true;
		const actual = image.find('div').hasClass(css.fill);

		expect(actual).toBe(expected);
	});

	test('should have class for fit', () => {
		const image = mount(
			<ImageBase src={src} sizing="fit" />
		);

		const expected = true;
		const actual = image.find('div').hasClass(css.fit);

		expect(actual).toBe(expected);
	});


	test('should set role to img by default', () => {
		const image = shallow(
			<ImageBase src={src} sizing="fit" />
		);

		const expected = 'img';
		const actual = image.prop('role');

		expect(actual).toBe(expected);
	});
});
