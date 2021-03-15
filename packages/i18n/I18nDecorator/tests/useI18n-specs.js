/* eslint-disable react/jsx-no-bind */

import {shallow} from 'enzyme';
import {useState} from 'react';

import {updateLocale} from '../../locale';

import useI18n from '../useI18n';

describe('useI18n', () => {

	// Suite-wide setup

	beforeEach(() => {
		updateLocale('en-US');
	});

	afterEach(() => {
		updateLocale();
	});

	// eslint-disable-next-line enact/prop-types
	function Component ({locale, latinLanguageOverrides, nonLatinLanguageOverrides}) {
		const [state, setState] = useState({
			rtl: false,
			className: null
		});
		const i18n = useI18n({
			latinLanguageOverrides,
			locale,
			nonLatinLanguageOverrides,
			onLoadResources: setState
		});

		return <div {...state} {...i18n} />;
	}

	test('should return rtl=false by default', () => {
		const subject = shallow(<Component />);

		const expected = false;
		const actual = subject.prop('rtl');

		expect(actual).toBe(expected);
	});

	test('should return en-US classes', () => {
		const subject = shallow(<Component />);
		subject.update();

		const expected = ['enact-locale-en', 'enact-locale-en-US', 'enact-locale-US'].sort();
		const actual = subject.prop('className').split(' ').sort();

		expect(actual).toEqual(expected);
	});

	test('should return rtl=true for RTL locales', () => {
		const subject = shallow(<Component locale="ar-SA" />);

		const expected = true;
		const actual = subject.prop('rtl');

		expect(actual).toBe(expected);
	});

	test('should return ar-SA classes', () => {
		const subject = shallow(<Component locale="ar-SA" />);

		const expected = [
			'enact-locale-ar',
			'enact-locale-ar-SA',
			'enact-locale-SA',
			'enact-locale-non-italic',
			'enact-locale-non-latin',
			'enact-locale-right-to-left'
		].sort();
		const actual = subject.prop('className').split(' ').sort();

		expect(actual).toEqual(expected);
	});

	test('should return support overriding to latin locale', () => {
		const subject = shallow(<Component locale="ar-SA" latinLanguageOverrides={['ar-SA']} />);

		const expected = [
			'enact-locale-ar',
			'enact-locale-ar-SA',
			'enact-locale-SA',
			'enact-locale-non-italic',
			'enact-locale-right-to-left'
		].sort();
		const actual = subject.prop('className').split(' ').sort();

		expect(actual).toEqual(expected);
	});

	test('should return support overriding to non-latin locale', () => {
		const subject = shallow(<Component locale="en-US" nonLatinLanguageOverrides={['en-US']} />);

		const expected = [
			'enact-locale-en',
			'enact-locale-en-US',
			'enact-locale-US',
			'enact-locale-non-latin'
		].sort();
		const actual = subject.prop('className').split(' ').sort();

		expect(actual).toEqual(expected);
	});
});
