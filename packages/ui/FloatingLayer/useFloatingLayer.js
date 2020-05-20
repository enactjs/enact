import useClass from '@enact/core/useClass';
import React from 'react';

import FloatingLayerContainer from './FloatingLayerContainer';

/**
 * Configuration for `useFloatingLayer`
 *
 * @typedef {Object} useFloatingLayerConfig
 * @memberof ui/FloatingLayerDecorator
 * @property {Function} [floatLayerId] Floating layer id
 * @private
 */

/**
 * Object returned by `useFloatingLayer`
 *
 * @typedef {Object} useFloatingLayerInterface
 * @memberof ui/FloatingLayerDecorator
 * @property {Function} registry         Registe the instance
 * @property {Function} setFloatingLayer Set the floating layer DOM element
 * @private
 */

/**
 * Close all floating layers registered in the same id
 *
 * @param {useFloatingLayerConfig} config Configuration options
 * @returns {useFloatingLayerInterface}
 * @private
 */
function useFloatingLayer (config) {
	const floating = useClass(FloatingLayerContainer, config);

	React.useEffect(() => {
		floating.load();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		registry: floating.registry,
		setFloatingLayer: floating.setFloatingLayer
	};
}

export default useFloatingLayer;
export {
	useFloatingLayer
};
