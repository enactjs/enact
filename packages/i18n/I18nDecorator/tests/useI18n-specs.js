import {useState} from 'react';
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

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

		const divProps = {...state, ...i18n};

		return <div className={divProps.className} data-testid="i18nDiv">{divProps.rtl ? 'rtl' : 'ltr'}</div>;
	}

	test('should return rtl=false by default', () => {
		render(<Component />);

		const expected = 'ltr';
		const i18nDiv = screen.getByTestId('i18nDiv');

		expect(i18nDiv).toHaveTextContent(expected);
	});

	test('should return en-US classes', () => {
		render(<Component />);

		const i18nDiv = screen.getByTestId('i18nDiv');

		expect(i18nDiv).toHaveClass('enact-locale-en');
		expect(i18nDiv).toHaveClass('enact-locale-en-US');
		expect(i18nDiv).toHaveClass('enact-locale-US');
	});

	test('should return rtl=true for RTL locales', () => {
		render(<Component locale="ar-SA" />);

		const expected = 'rtl';
		const i18nDiv = screen.getByTestId('i18nDiv');

		expect(i18nDiv).toHaveTextContent(expected);
	});

	test('should return ar-SA classes', () => {
		render(<Component locale="ar-SA" />);

		const i18nDiv = screen.getByTestId('i18nDiv');

		expect(i18nDiv).toHaveClass('enact-locale-ar');
		expect(i18nDiv).toHaveClass('enact-locale-ar-SA');
		expect(i18nDiv).toHaveClass('enact-locale-SA');
		expect(i18nDiv).toHaveClass('enact-locale-non-italic');
		expect(i18nDiv).toHaveClass('enact-locale-non-latin');
		expect(i18nDiv).toHaveClass('enact-locale-right-to-left');
	});

	test('should return support overriding to latin locale', () => {
		render(<Component locale="ar-SA" latinLanguageOverrides={['ar-SA']} />);

		const i18nDiv = screen.getByTestId('i18nDiv');

		expect(i18nDiv).toHaveClass('enact-locale-ar');
		expect(i18nDiv).toHaveClass('enact-locale-ar-SA');
		expect(i18nDiv).toHaveClass('enact-locale-SA');
		expect(i18nDiv).toHaveClass('enact-locale-non-italic');
		expect(i18nDiv).toHaveClass('enact-locale-right-to-left');
	});

	test('should return support overriding to non-latin locale', () => {
		render(<Component locale="en-US" nonLatinLanguageOverrides={['en-US']} />);

		const i18nDiv = screen.getByTestId('i18nDiv');

		expect(i18nDiv).toHaveClass('enact-locale-en');
		expect(i18nDiv).toHaveClass('enact-locale-en-US');
		expect(i18nDiv).toHaveClass('enact-locale-US');
		expect(i18nDiv).toHaveClass('enact-locale-non-latin');
	});
});
