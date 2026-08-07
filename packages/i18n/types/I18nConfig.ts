import type {Resource} from './Resource';

/**
 * Configuration for the {@link i18n/I18nDecorator.I18n} store.
 *
 * Used by `I18nDecorator/I18n.ts` and `I18nDecorator/useI18n.ts`.
 */
interface I18nConfig {
	latinLanguageOverrides?: string[] | null;
	nonLatinLanguageOverrides?: string[] | null;
	resources?: Resource[] | null;
	sync?: boolean;
}

export type {I18nConfig};
