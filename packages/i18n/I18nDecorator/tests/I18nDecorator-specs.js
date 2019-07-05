/* eslint-disable react/jsx-no-bind */

import {shallow, mount} from 'enzyme';
import ilib from 'ilib-webos-tv/lib/ilib';
import React from 'react';

import {updateLocale} from '../../locale';
import {I18nContextDecorator, I18nDecorator} from '../I18nDecorator';

describe('I18nDecorator', () => {

	// Suite-wide setup

	beforeEach(() => {
		updateLocale('en-US');
	});

	afterEach(() => {
		updateLocale();
	});

	test('should add rtl context parameter', () => {
		const Component = (props) => (
			<div>{'rtl' in props ? 'has rtl prop' : 'does not have rtl prop'}</div>
		);

		const Wrapped = I18nDecorator(
			{sync: true},
			I18nContextDecorator(
				{rtlProp: 'rtl'},
				Component
			)
		);
		const subject = mount(<Wrapped />);

		const expected = 'has rtl prop';
		const actual = subject.text();

		expect(actual).toBe(expected);
	});

	test('should add updateLocale context parameter', () => {
		// eslint-disable-next-line enact/prop-types
		const Component = ({updateLocale: update}) => (
			<div>{typeof update}</div>
		);

		const Wrapped = I18nDecorator(
			{sync: true},
			I18nContextDecorator(
				{updateLocaleProp: 'updateLocale'},
				Component
			)
		);
		const subject = mount(<Wrapped />);

		const expected = 'function';
		const actual = subject.text();

		expect(actual).toBe(expected);
	});

	test(
		'should update the current locale when updateLocale is called',
		() => {
			// eslint-disable-next-line enact/prop-types
			const Component = ({_updateLocale}) => {
				const handleClick = () => _updateLocale('ar-SA');

				return (
					<button onClick={handleClick} />
				);
			};

			const Wrapped = I18nDecorator(
				{sync: true},
				I18nContextDecorator(
					{updateLocaleProp: '_updateLocale'},
					Component
				)
			);
			const subject = mount(<Wrapped />);
			subject.find('button').simulate('click');

			const expected = 'ar-SA';
			const actual = ilib.getLocale();

			expect(actual).toBe(expected);
		}
	);

	test('should update the rtl context parameter when RTL changes', () => {
		// eslint-disable-next-line enact/prop-types
		const Component = ({rtl, _updateLocale}) => {
			const handleClick = () => _updateLocale('ar-SA');

			return (
				<button onClick={handleClick}>{rtl ? 'rtl' : 'ltr'}</button>
			);
		};

		const Wrapped = I18nDecorator(
			{sync: true},
			I18nContextDecorator(
				{rtlProp: 'rtl', updateLocaleProp: '_updateLocale'},
				Component
			)
		);
		const subject = mount(<Wrapped />);
		const button = subject.find('button');

		button.simulate('click');
		subject.update();

		const expected = 'rtl';
		const actual = button.text();

		expect(actual).toBe(expected);
	});

	test('should set locale via props', () => {
		const Component = (props) => (
			<div className={props.className} />
		);

		const Wrapped = I18nDecorator({sync: true}, Component);
		shallow(<Wrapped locale="ar-SA" />);

		const expected = 'ar-SA';
		const actual = ilib.getLocale();

		expect(actual).toBe(expected);
	});

	test('should add locale classes to Wrapped', () => {
		const Component = (props) => (
			<div className={props.className} />
		);

		const Wrapped = I18nDecorator({sync: true}, Component);
		// explicitly setting locale so we get a known class list regardless of runtime locale
		const subject = shallow(<Wrapped locale="en-US" />).find(Component);

		const expected = true;
		const actual =	subject.hasClass('enact-locale-en') &&
						subject.hasClass('enact-locale-en-US') &&
						subject.hasClass('enact-locale-US');

		expect(actual).toBe(expected);
	});

	test('should treat "en-US" as latin locale', () => {
		const Component = (props) => (
			<div className={props.className} />
		);

		const Wrapped = I18nDecorator({sync: true}, Component);
		// explicitly setting locale so we get a known class list regardless of runtime locale
		const subject = shallow(<Wrapped locale="en-US" />).find(Component);

		const expected = false;
		const actual =	subject.hasClass('enact-locale-non-latin');

		expect(actual).toBe(expected);
	});


	test('should treat "ja-JP" as non-latin locale', () => {
		const Component = (props) => (
			<div className={props.className} />
		);

		const Wrapped = I18nDecorator({sync: true}, Component);
		// explicitly setting locale so we get a known class list regardless of runtime locale
		const subject = shallow(<Wrapped locale="ja-JP" />).find(Component);

		const expected = true;
		const actual =	subject.hasClass('enact-locale-non-latin');

		expect(actual).toBe(expected);
	});
});
