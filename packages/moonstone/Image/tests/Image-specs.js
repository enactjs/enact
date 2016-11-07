import React from 'react';
import {mount} from 'enzyme';
import Image from '../Image';
import css from '../Image.less';

const src = {
	'hd': 'http://lorempixel.com/64/64/city/1/',
	'fhd': 'http://lorempixel.com/128/128/city/1/',
	'uhd': 'http://lorempixel.com/256/256/city/1/'
};

describe('Image Specs', () => {
	it('should only have image class without sizing', function () {
		const image = mount(
			<Image src={src} sizing="none" />
		);

		const expected = css.image;
		const actual = image.find('div').prop('className');

		expect(actual).to.equal(expected);
	});

	it('should have class for fill', function () {
		const image = mount(
			<Image src={src} sizing="fill" />
		);

		const expected = true;
		const actual = image.find('div').hasClass(css.fill);

		expect(actual).to.equal(expected);
	});

	it('should have class for fit', function () {
		const image = mount(
			<Image src={src} sizing="fit" />
		);

		const expected = true;
		const actual = image.find('div').hasClass(css.fit);

		expect(actual).to.equal(expected);
	});

});
