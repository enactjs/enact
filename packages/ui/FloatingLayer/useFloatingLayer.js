import useClass from '@enact/core/useClass';
import React from 'react';

import FloatingLayerContainer from './FloatingLayerContainer';

const FloatingLayerContext = React.createContext();

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
 * @property {Function} provideFloatingLayer Provide the wrapper DOM elements
 * @private
 */

/**
 * Close all floating layers registered in the same id
 *
 * @param {useFloatingLayerConfig} config Configuration options
 * @returns {useFloatingLayerInterface}
 * @private
 */
function useFloatingLayer ({className, ...config}) {
	const {floatLayerId} = config;
	const floating = useClass(FloatingLayerContainer, config);

	React.useEffect(() => {
		floating.load();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const provideFloatingLayer = React.useCallback((children) => {
		return (
			<FloatingLayerContext.Provider value={floating.registry.register}>
				<div className={className}>
					{children}
					<div id={floatLayerId} key="floatLayer" ref={floating.setFloatingLayer} />
				</div>
			</FloatingLayerContext.Provider>
		);
	}, [className, floating, floatLayerId]);

	return {
		provideFloatingLayer
	};
}

export default useFloatingLayer;
export {
	FloatingLayerContext,
	useFloatingLayer
};
