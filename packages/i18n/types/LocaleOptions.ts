import type {IlibCallbackOptions} from './IlibCallbackOptions';

/**
 * Options for a locale-classification request.
 *
 * Used by `locale/locale.ts` and `I18nDecorator/getI18nClasses.ts`.
 */
interface LocaleOptions<T> extends IlibCallbackOptions<T> {
	/**
	 * Locales that should be treated as latin regardless of their script
	 */
	latinLanguageOverrides?: string[];
	/**
	 * Locales that should be treated as non-latin regardless of their script
	 */
	nonLatinLanguageOverrides?: string[];
}

export type {LocaleOptions};
