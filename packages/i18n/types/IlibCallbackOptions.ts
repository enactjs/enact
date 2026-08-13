/**
 * Options for an ilib-style asynchronous request.
 *
 * Used by `src/wrapIlibCallback.ts`, `locale/locale.ts`, `I18nDecorator/getI18nClasses.ts`,
 * and `src/resBundle.ts`.
 */
interface IlibCallbackOptions<T> {
	/**
	 * Perform the request synchronously
	 */
	sync?: boolean;
	/**
	 * Called with the result. If omitted, the request is a no-op.
	 */
	onLoad?: (result: T) => void;
	/**
	 * Any remaining options are passed through to the underlying ilib request
	 */
	[key: string]: unknown;
}

export type {IlibCallbackOptions};
