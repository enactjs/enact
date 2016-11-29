import React from 'react';
import {mount, shallow} from 'enzyme';
import Icon from '../Icon';

describe('Icon Specs', () => {

	it('should return the correct Unicode value for named icon \'star\'', function () {
		const icon = mount(
			<Icon>star</Icon>
		);

		const expected = 983080; // decimal converted charCode of Unicode 'star' character
		const actual = icon.text().codePointAt();

		expect(actual).to.equal(expected);
	});

	it('should return the correct Unicode value when provided \'star\' hex value', function () {
		const icon = mount(
			<Icon>0x0F0028</Icon>
		);

		const expected = 983080; // decimal converted charCode of character
		const actual = icon.text().codePointAt();

		expect(actual).to.equal(expected);
	});

	it('should return the correct Unicode value when provided HTML entity as hex value', function () {
		const icon = mount(
			<Icon>&#x02605;</Icon>
		);

		const expected = 9733; // decimal converted charCode of character
		const actual = icon.text().codePointAt();

		expect(actual).to.equal(expected);
	});

	it('should return the correct Unicode value when provided Unicode reference', function () {
		const icon = mount(
			<Icon>\u0F0028</Icon>
		);

		const expected = 983080; // decimal converted charCode of Unicode 'star' character
		const actual = icon.text().codePointAt();

		expect(actual).to.equal(expected);
	});

	it('should merge author styles with src', function () {
		const src = 'images/icon.png';
		const icon = shallow(
			<Icon src={src} style={{color: 'green'}} />
		);

		const expected = {
			color: 'green',
			backgroundImage: `url(${src})`
		};
		const actual = icon.prop('style');
		expect(actual).to.deep.equal(expected);
	});
});

