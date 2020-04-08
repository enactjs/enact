import React from 'react';

/**
 * Creates one instance of the class, `Ctor` with the provided `args`, for the life of the
 * component.
 *
 * @param {Function} Ctor Class constructor
 * @param  {...any} args  Arguments to pass to the constructor
 * @returns {Object}      An instance of `Ctor`
 * @private
 */
function useClass (Ctor, ...args) {
	const ref = React.useRef(null);
	ref.current = ref.current || new Ctor(...args);

	return ref.current;
}

export default useClass;
export {
	useClass
};
