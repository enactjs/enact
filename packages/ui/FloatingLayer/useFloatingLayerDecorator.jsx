import useClass from '@enact/core/useClass';
import {createContext, useCallback, useEffect} from 'react';

import FloatingLayerContainer from './FloatingLayerContainer';

const FloatingLayerContext = createContext();

/**
 * Configuration for `useFloatingLayerDecorator`
 *
 * @typedef {Object} useFloatingLayerDecoratorConfig
 * @memberof ui/FloatingLayerDecorator
 * @property {Function} [floatLayerId] Floating layer id
 * @private
 */

/**
 * Object returned by `useFloatingLayerDecorator`
 *
 * @typedef {Object} useFloatingLayerDecoratorInterface
 * @memberof ui/FloatingLayerDecorator
 * @property {Function} provideFloatingLayer Provide the wrapper DOM elements
 * @private
 */

/**
 * Close all floating layers registered in the same id
 *
 * @param {useFloatingLayerDecoratorConfig} config Configuration options
 * @returns {useFloatingLayerDecoratorInterface}
 * @private
 */
function useFloatingLayerDecorator (config = {}) {
	const {className, floatLayerId = 'floatLayer'} = config;
	const floating = useClass(FloatingLayerContainer, {floatLayerId});

	useEffect(() => {
		floating.load();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const provideFloatingLayer = useCallback((children) => {
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

export default useFloatingLayerDecorator;
export {
	FloatingLayerContext,
	useFloatingLayerDecorator
};
