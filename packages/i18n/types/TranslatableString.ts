/**
 * A source string with an explicit translation key.
 *
 * Used by `src/resBundle.ts` and `$L/$L.ts`.
 */
interface TranslatableString {
	key?: string;
	value: string;
}

export type {TranslatableString};
