import '@testing-library/jest-dom';
import {act, render, screen, waitFor} from '@testing-library/react';
import {useState} from 'react';

import {updateLocale} from '../../locale';
import {I18n} from '../I18n';
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
		const {className, rtl} = useI18n({
			latinLanguageOverrides,
			locale,
			nonLatinLanguageOverrides
		});

		return <div className={className} data-testid="i18nDiv">{rtl ? 'rtl' : 'ltr'}</div>;
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
		expect(i18nDiv).not.toHaveClass('enact-locale-non-latin');
	});

	test('should return support overriding to non-latin locale', () => {
		render(<Component locale="en-US" nonLatinLanguageOverrides={['en-US']} />);

		const i18nDiv = screen.getByTestId('i18nDiv');

		expect(i18nDiv).toHaveClass('enact-locale-en');
		expect(i18nDiv).toHaveClass('enact-locale-en-US');
		expect(i18nDiv).toHaveClass('enact-locale-US');
		expect(i18nDiv).toHaveClass('enact-locale-non-latin');
	});

	// Async mode (sync: false) — tests the Promise.all path in loadResources
	describe('async mode', () => {
		function AsyncComponent ({locale}) {
			const {className, loaded, rtl} = useI18n({locale, sync: false});

			return (
				<div
					className={className}
					data-loaded={loaded}
					data-testid="i18nDiv"
				>
					{rtl ? 'rtl' : 'ltr'}
				</div>
			);
		}

		test('should start with loaded=false', () => {
			render(<AsyncComponent />);

			const i18nDiv = screen.getByTestId('i18nDiv');

			expect(i18nDiv).toHaveAttribute('data-loaded', 'false');
		});

		test('should set loaded=true after resources resolve', async () => {
			render(<AsyncComponent />);

			const i18nDiv = screen.getByTestId('i18nDiv');

			await waitFor(() => {
				expect(i18nDiv).toHaveAttribute('data-loaded', 'true');
			});
		});

		test('should apply locale classes after async load', async () => {
			render(<AsyncComponent locale="ar-SA" />);

			const i18nDiv = screen.getByTestId('i18nDiv');

			await waitFor(() => {
				expect(i18nDiv).toHaveClass('enact-locale-ar-SA');
			});
			await waitFor(() => {
				expect(i18nDiv).toHaveTextContent('rtl');
			});
		});
	});

	// Runtime locale change — verifies useSyncExternalStore re-renders on locale prop change
	describe('runtime locale change', () => {
		function LocaleSwitcherComponent () {
			const [locale, setLocale] = useState('en-US');
			const {className, rtl} = useI18n({locale});

			return (
				<div>
					<div className={className} data-testid="i18nDiv">{rtl ? 'rtl' : 'ltr'}</div>
					<button data-testid="switchBtn" onClick={() => setLocale('ar-SA')}>switch</button>
				</div>
			);
		}

		test('should update rtl when locale prop changes', async () => {
			render(<LocaleSwitcherComponent />);

			const i18nDiv = screen.getByTestId('i18nDiv');
			const btn = screen.getByTestId('switchBtn');

			expect(i18nDiv).toHaveTextContent('ltr');

			act(() => {
				btn.click();
			});

			expect(i18nDiv).toHaveTextContent('rtl');
		});

		test('should update classes when locale prop changes', async () => {
			render(<LocaleSwitcherComponent />);

			const i18nDiv = screen.getByTestId('i18nDiv');
			const btn = screen.getByTestId('switchBtn');

			expect(i18nDiv).toHaveClass('enact-locale-en-US');

			act(() => {
				btn.click();
			});

			expect(i18nDiv).toHaveClass('enact-locale-ar-SA');
			expect(i18nDiv).not.toHaveClass('enact-locale-en-US');
		});
	});

	// updateLocale — verifies the store notifies subscribers when called imperatively
	describe('updateLocale', () => {
		function UpdateLocaleComponent () {
			const {className, rtl, updateLocale: changeLocale} = useI18n({});

			return (
				<div>
					<div className={className} data-testid="i18nDiv">{rtl ? 'rtl' : 'ltr'}</div>
					<button data-testid="updateBtn" onClick={() => changeLocale('ar-SA')}>update</button>
				</div>
			);
		}

		test('should re-render when updateLocale is called', () => {
			render(<UpdateLocaleComponent />);

			const i18nDiv = screen.getByTestId('i18nDiv');
			const btn = screen.getByTestId('updateBtn');

			expect(i18nDiv).toHaveTextContent('ltr');

			act(() => {
				btn.click();
			});

			expect(i18nDiv).toHaveTextContent('rtl');
		});
	});

	// getServerSnapshot — used by useSyncExternalStore for SSR
	describe('getServerSnapshot', () => {
		test('should return loaded=true for SSR', () => {
			const i18n = new I18n({sync: false});

			const snapshot = i18n.getServerSnapshot();

			expect(snapshot.loaded).toBe(true);
		});

		test('should return the current locale in server snapshot', () => {
			const i18n = new I18n({sync: true});

			i18n.setContext('ar-SA');

			const snapshot = i18n.getServerSnapshot();

			expect(snapshot.locale).toBe('ar-SA');
		});
	});

	// No tearing — two components using the same store must stay in sync
	describe('no tearing between multiple subscribers', () => {
		function ComponentA () {
			const {rtl} = useI18n({});
			return <div data-testid="compA">{rtl ? 'rtl' : 'ltr'}</div>;
		}

		function ComponentB () {
			const {rtl} = useI18n({});
			return <div data-testid="compB">{rtl ? 'rtl' : 'ltr'}</div>;
		}

		test('should keep multiple components in sync after updateLocale', () => {
			const {rerender} = render(
				<div>
					<ComponentA />
					<ComponentB />
				</div>
			);

			expect(screen.getByTestId('compA')).toHaveTextContent('ltr');
			expect(screen.getByTestId('compB')).toHaveTextContent('ltr');

			act(() => {
				updateLocale('ar-SA');
			});

			rerender(
				<div>
					<ComponentA />
					<ComponentB />
				</div>
			);

			expect(screen.getByTestId('compA')).toHaveTextContent('rtl');
			expect(screen.getByTestId('compB')).toHaveTextContent('rtl');
		});
	});
});
