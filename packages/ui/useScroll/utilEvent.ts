// A `React.useEvent` hooks is introduced in https://github.com/facebook/react/pull/17651
// The `useEvent` below will be replaced with the `React.useEvent` later.

/*
 * Detects if the browser natively supports the scrollend event.
 */
import {RefObject} from 'react';

import {Callback} from '../types';

export type EventTargetRef = RefObject<HTMLElement | null> | EventTarget | null | undefined;

function isRefObject<T> (ref: any): ref is RefObject<T> {
	return ref !== null && typeof ref === 'object' && 'current' in ref;
}

const supportsScrollEnd = () => {
	if (typeof window === 'undefined') {
		return false;
	}
	return 'onscrollend' in window;
};

const utilEvent = (eventName: string) => {
	const isScrollEndEvent = eventName === 'scrollend';
	const hasNativeScrollEnd = isScrollEndEvent && supportsScrollEnd();

	return {
		addEventListener (ref: EventTargetRef, fn: Callback, param?: AddEventListenerOptions) {
			if (!ref) return;

			if (isScrollEndEvent && !hasNativeScrollEnd) {
				return;
			}

			if (typeof window !== 'undefined' && (ref === window || ref === document)) {
				ref.addEventListener(eventName, fn, param);
			} else if (isRefObject(ref) && ref.current) {
				ref.current.addEventListener(eventName, fn, param);
			} else if (!isRefObject(ref) && ref && ref.addEventListener) {
				ref.addEventListener(eventName, fn, param);
			}
		},

		removeEventListener (ref: EventTargetRef, fn: Callback, param?: AddEventListenerOptions) {
			if (!ref) return;

			if (isScrollEndEvent && !hasNativeScrollEnd) {
				return;
			}

			if (typeof window !== 'undefined' && (ref === window || ref === document)) {
				ref.removeEventListener(eventName, fn, param);
			} else if (isRefObject(ref) && ref.current) {
				ref.current.removeEventListener(eventName, fn, param);
			} else if (!isRefObject(ref) && ref && ref.removeEventListener) {
				ref.removeEventListener(eventName, fn, param);
			}
		}
	};
};

export default utilEvent;
export {
	utilEvent
};
