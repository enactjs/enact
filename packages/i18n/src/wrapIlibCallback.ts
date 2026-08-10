import type {IlibCallbackFn} from '../types/IlibCallbackFn';
import type {IlibCallbackOptions} from '../types/IlibCallbackOptions';

const invoke = <T>(fn: IlibCallbackFn<T>, options: IlibCallbackOptions<T>, callback: (result: T) => void) => {
	const {onLoad} = options;

	fn({
		...options,
		onLoad: (result) => {
			callback(result);
			if (onLoad) onLoad(result);
		}
	});
};

/**
 * Invokes an ilib-style callback function and returns either the result (when `options.sync` is
 * `true`) or a `Promise` for the result.
 */
function wrapIlibCallback <T = unknown> (fn: IlibCallbackFn<T> | null | undefined, options: IlibCallbackOptions<T> = {}): T | null | Promise<T | null> {
	const {sync = false} = options;

	if (!fn) {
		return sync ? null : Promise.resolve(null);
	}

	if (sync) {
		let value: T | null = null;
		invoke(fn, options, (v) => (value = v));

		return value;
	}

	return new Promise<T | null>(resolve => invoke(fn, options, resolve));
}

export default wrapIlibCallback;
export {
	wrapIlibCallback
};
