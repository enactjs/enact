import React from 'react';

let GlobalId = 0;
const ID_KEY = '$$ID$$';

/**
 * Configuration for `useIdProvider`
 *
 * @typedef {Object} useIdProviderConfig
 * @memberof ui/IdProvider
 * @property {String} [prefix] Optional prefix for the identifier.
 * @private
 */

/**
 * Object returned by `useIdProvider`
 *
 * @typedef {Object} useIdProviderInterface
 * @memberof ui/IdProvider
 * @property {Function} [generateId] The function to generate id.
 * @private
 */

/**
 * Generate globally-unique identifiers
 *
 * @param {useIdProviderConfig} config Configuration options
 * @returns {useIdProviderInterface}
 * @private
 */
const useIdProvider = ({prefix}) => {
	const ids = React.useRef({});
	// The ref value 'ids.current' will likely have changed by the time.
	// So it was copiped from 'ids.current' to the `idsCurrent`.
	const idsCurrent = ids.current;

	React.useEffect(() => {
		return () => {
			// Call the onUnmount handler for each generated id (note: not the key)
			for (const key in idsCurrent) {
				const {id, onUnmount} = idsCurrent[key];

				if (typeof onUnmount === 'function') {
					onUnmount(id);
				}
			}
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const generateId = React.useCallback((key = ID_KEY, idPrefix = prefix, onUnmount) => {
		// if an id has been generated for the key, return it
		if (key in ids.current) {
			return ids.current[key].id;
		}

		// otherwise generate a new id (with an optional prefix), cache it, and return it
		const id = `${idPrefix}${++GlobalId}`;
		ids.current[typeof key === 'undefined' ? `generated-${id}` : key] = {
			id,
			onUnmount
		};

		return id;
	}, [prefix]);

	return {
		generateId
	};
};

export default useIdProvider;
export {
	useIdProvider
};
