import type {IlibCallbackOptions} from './IlibCallbackOptions';

/**
 * An ilib-style function that reports its result via `options.onLoad`.
 *
 * Used by `src/wrapIlibCallback.ts` and `I18nDecorator/I18n.ts`.
 */
type IlibCallbackFn<T> = (options: IlibCallbackOptions<T>) => void;

export type {IlibCallbackFn};
