/*
 * The xhr package allows overriding the XMLHttpRequest implementation via a
 * property on its default export, but its bundled typings omit it.
 */
import 'xhr';

declare module 'xhr' {
	interface XhrStatic {
		XMLHttpRequest: typeof XMLHttpRequest;
	}
}
