/**
 * Updates multiple reference callbacks or objects
 *
 * @module core/useChainRefs
 * @exports useChainRefs
 * @exports chainRefs
 * @private
 */

import {useCallback} from 'react';
import warning from 'warning';

import {Ref} from './types';

// Safely handles functional and object refs (and ignores invalid refs)
function updateRef (ref: Ref, node: Node) {
	if (ref) {
		if (typeof ref === 'function') {
			ref(node);
		} else if (Object.prototype.hasOwnProperty.call(ref, 'current')) {
			ref.current = node;
		} else {
			// warn for a truthy ref that isn't a function or is an object without `current`
			warning(ref, `Invalid ref "${ref}" passed to useChainRefs.`);
		}
	}
}

/**
 * Creates a reference callback that updates each of the provided references
 *
 * @memberof core/useChainRefs
 * @param {...Object[]|...Function[]} refs List of references to be updated.
 * @returns {Function}                     A callback that updates each reference
 * @public
 */
function chainRefs (...refs: Ref[]): Function {
	return (node: Node) => {
		refs.forEach(ref => updateRef(ref, node));
	};
}

/**
 * Creates a memoized reference callback that updates each of the provided references
 *
 * @memberof core/useChainRefs
 * @param {Object|Function} refs         List of references to be updated.
 * @returns {Function}                   A memoized callback that updates each reference
 * @public
 */
function useChainRefs (...refs: Ref[]): Function {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useCallback(chainRefs(...refs), refs);
}

export default useChainRefs;
export {
	useChainRefs,
	chainRefs
};
