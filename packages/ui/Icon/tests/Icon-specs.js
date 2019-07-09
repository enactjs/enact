import React from 'react';
import {shallow} from 'enzyme';
import Icon from '../Icon';

describe('Icon Specs', () => {
	test('should allow icon-name words to pass through', () => {
		const iconName = 'hollow_star';
		const icon = shallow(
			<Icon>
				{iconName}
			</Icon>
		);

		const expected = iconName;
		const actual = icon.text();
		expect(actual).toEqual(expected);
	});

	test('should allow single-byte characters to pass through', () => {
		const iconName = '+';
		const icon = shallow(
			<Icon>
				{iconName}
			</Icon>
		);

		const expected = iconName;
		const actual = icon.text();
		expect(actual).toEqual(expected);
	});

	test('should allow multi-byte characters to pass through', () => {
		const iconName = '󰂪';
		const icon = shallow(
			<Icon>
				{iconName}
			</Icon>
		);

		const expected = iconName;
		const actual = icon.text();
		expect(actual).toEqual(expected);
	});

	test('should allow pre-defined icon names as an icon', () => {
		const iconName = 'factory';
		const iconGlyph = 'F';
		const iconList = {
			train: 'T',
			factory: 'F'
		};
		const icon = shallow(
			<Icon iconList={iconList}>
				{iconName}
			</Icon>
		);

		const expected = iconGlyph;
		const actual = icon.text();
		expect(actual).toEqual(expected);
	});

	test('should allow un-matched icon names to fall through, even when pre-defined icons exist', () => {
		const iconName = 'custom-icon-word';
		const iconList = {
			train: 'T',
			factory: 'F'
		};
		const icon = shallow(
			<Icon iconList={iconList}>
				{iconName}
			</Icon>
		);

		const expected = iconName;
		const actual = icon.text();
		expect(actual).toEqual(expected);
	});

	test('should allow URIs to be used as an icon', () => {
		const src = 'images/icon.png';
		const icon = shallow(
			<Icon>
				{src}
			</Icon>
		);

		const expected = {
			backgroundImage: `url(${src})`
		};
		const actual = icon.prop('style');
		expect(actual).toEqual(expected);
	});

	test('should allow URLs to be used as an icon', () => {
		const src = 'http://enactjs.com/images/logo';
		const icon = shallow(
			<Icon>
				{src}
			</Icon>
		);

		const expected = {
			backgroundImage: `url(${src})`
		};
		const actual = icon.prop('style');
		expect(actual).toEqual(expected);
	});

	test('should merge author styles with image URLs', () => {
		const src = 'images/icon.png';
		const icon = shallow(
			<Icon style={{color: 'green'}}>
				{src}
			</Icon>
		);

		const expected = {
			color: 'green',
			backgroundImage: `url(${src})`
		};
		const actual = icon.prop('style');
		expect(actual).toEqual(expected);
	});
});

