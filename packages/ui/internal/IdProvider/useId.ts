import useClass from '@enact/core/useClass';
import {useLayoutEffect} from 'react';

import Provider from './Provider';

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

interface UseIdProviderConfig {
	/** Optional prefix for the identifier. */
	prefix?: string;
}

interface UseIdProviderInterface {
	/** The function to generate id. */
	generateId: (...args: any[]) => string;
}

/**
 * Generate globally-unique identifiers
 *
 * @param {useIdProviderConfig} config Configuration options
 * @returns {useIdProviderInterface}
 * @private
 */
const useIdProvider = ({prefix}: UseIdProviderConfig): UseIdProviderInterface => {
	const provider = useClass(Provider, prefix);

	useLayoutEffect(() => {
		return () => provider.unload();
	}, [provider]);

	return {
		generateId: provider.generate
	};
};

export default useIdProvider;
export {
	useIdProvider
};
