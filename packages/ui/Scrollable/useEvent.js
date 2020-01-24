import Spotlight, {} from '@enact/spotlight';
import {useEffect, useRef} from 'react';

// A `React.useEvent` hooks is introduced in https://github.com/facebook/react/pull/17651
// The `useEvent` below will be replaced with the `React.useEvent` later.
const useEvent = (eventName) => {
	return {
		addEventListener (ref, fn, param) {
			if (ref.current) {
				ref.current.addEventListener(eventName, fn, param);
			} else if (typeof window !== 'undefined' && ref === window) {
				window.addEventListener(eventName, fn, param);
			}
		},
        removeEventListener (ref, fn, param) {
			if (ref.current) {
				ref.current.removeEventListener(eventName, fn, param);
			} else if (typeof window !== 'undefined' && ref === window) {
				window.addEventListener(eventName, fn, param);
			}
		}
	};
};

export default useEvent;
export {
	useEvent
};
