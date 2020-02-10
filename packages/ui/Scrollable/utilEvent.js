// A `React.useEvent` hooks is introduced in https://github.com/facebook/react/pull/17651
// The `useEvent` below will be replaced with the `React.useEvent` later.
const utilEvent = (eventName) => {
	return {
		addEventListener (ref, fn, param) {
			if (!ref) return;

			if (typeof window !== 'undefined' && (ref === window || ref === document)) {
				ref.addEventListener(eventName, fn, param);
			} else if (ref.current) {
				ref.current.addEventListener(eventName, fn, param);
			} else if (ref && ref.addEventListener) {
				ref.addEventListener(eventName, fn, param);
			}
		},

		removeEventListener (ref, fn, param) {
			if (!ref) return;

			if (typeof window !== 'undefined' && (ref === window || ref === document)) {
				ref.removeEventListener(eventName, fn, param);
			} else if (ref.current) {
				ref.current.removeEventListener(eventName, fn, param);
			} else if (ref && ref.removeEventListener) {
				ref.removeEventListener(eventName, fn, param);
			}
		}
	};
};

export default utilEvent;
export {
	utilEvent
};
