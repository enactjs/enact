import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ilib from '../../iLibLink/iLibLink';

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
			<div data-testid="i18n">{'rtl' in props ? 'has rtl prop' : 'does not have rtl prop'}</div>
		);

		const Wrapped = I18nDecorator(
			{sync: true},
			I18nContextDecorator(
				{rtlProp: 'rtl'},
				Component
			)
		);
		render(<Wrapped />);

		const expected = 'has rtl prop';
		const i18nDiv = screen.getByTestId('i18n');

		expect(i18nDiv).toHaveTextContent(expected);
	});

	test('should add updateLocale context parameter', () => {
		const Component = ({updateLocale: update}) => (
			<div data-testid="i18n">{typeof update}</div>
		);

		const Wrapped = I18nDecorator(
			{sync: true},
			I18nContextDecorator(
				{updateLocaleProp: 'updateLocale'},
				Component
			)
		);
		render(<Wrapped />);

		const expected = 'function';
		const i18nDiv = screen.getByTestId('i18n');

		expect(i18nDiv).toHaveTextContent(expected);
	});

	test('should update the current locale when updateLocale is called', async () => {
		const user = userEvent.setup();
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
		render(<Wrapped />);

		await user.click(screen.getByRole('button'));

		const expected = 'ar-SA';
		const actual = ilib.getLocale();

		expect(actual).toBe(expected);
	});

	test('should update the rtl context parameter when RTL changes', async () => {
		const user = userEvent.setup();
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
		render(<Wrapped />);

		const button = screen.getByRole('button');
		await user.click(button);

		const expected = 'rtl';

		expect(button).toHaveTextContent(expected);
	});

	test('should set locale via props', () => {
		const Component = (props) => (
			<div className={props.className} />
		);

		const Wrapped = I18nDecorator({sync: true}, Component);
		render(<Wrapped locale="ar-SA" />);

		const expected = 'ar-SA';
		const actual = ilib.getLocale();

		expect(actual).toBe(expected);
	});

	test('should add locale classes to Wrapped', () => {
		const Component = (props) => (
			<div className={props.className} data-testid="i18nDiv" />
		);

		const Wrapped = I18nDecorator({sync: true}, Component);
		// explicitly setting locale so we get a known class list regardless of runtime locale
		render(<Wrapped locale="en-US" />);
		const i18nDiv = screen.getByTestId('i18nDiv');

		expect(i18nDiv).toHaveClass('enact-locale-en');
		expect(i18nDiv).toHaveClass('enact-locale-en-US');
		expect(i18nDiv).toHaveClass('enact-locale-US');
	});

	test('should treat "en-US" as latin locale', () => {
		const Component = (props) => (
			<div className={props.className} data-testid="i18nDiv" />
		);

		const Wrapped = I18nDecorator({sync: true}, Component);
		// explicitly setting locale so we get a known class list regardless of runtime locale
		render(<Wrapped locale="en-US" />);

		const i18nDiv = screen.getByTestId('i18nDiv');

		expect(i18nDiv).not.toHaveClass('enact-locale-non-latin');
	});

	test('should treat "ja-JP" as non-latin locale', () => {
		const Component = (props) => (
			<div className={props.className} data-testid="i18nDiv" />
		);

		const Wrapped = I18nDecorator({sync: true}, Component);
		// explicitly setting locale so we get a known class list regardless of runtime locale
		render(<Wrapped locale="ja-JP" />);

		const i18nDiv = screen.getByTestId('i18nDiv');

		expect(i18nDiv).toHaveClass('enact-locale-non-latin');
	});
});
