import {forward} from '@enact/core/handle';
import {useCallback, useContext, useEffect, useRef} from 'react';

import ResizeContext from './ResizeContext';

/**
 * Object returned by `useResize`
 * Object has a property named with the value of the resize property of config.
 * And this property has resizehandler.
 *
 * @typedef {Object} useResizeInterface
 * @memberof ui/Resizable
 * @private
 */

/**
 * A custom hook which returns handler that indicates a resize is necessary
 *
 * @param {Object} props  Resize component props
 * @param {Object} config  Configuration options with resize, filter property
 * @returns {useResizeInterface}
 * @private
 *
 */
const useResize = (props, config) => {
	// `resize` is the name of the event on the component to listen for size changes.
	const {filter = null, resize = null} = config;

	const resizeContextValue = useContext(ResizeContext);
	const mutableRef = useRef({
		resizeRegistry: null
	});

	useEffect(() => {
		const {resizeRegistry} = mutableRef.current;

		if (resizeContextValue && typeof resizeContextValue === 'function') {
			mutableRef.current.resizeRegistry = resizeContextValue(() => {});
		}

		return () => {
			if (resizeRegistry) {
				resizeRegistry.unregister();
			}
		};
	}, [resizeContextValue]);

	const handleResize = useCallback((ev) => {
		forward(resize, ev, props);

		// Notifies a container that a resize is necessary
		if ((filter === null || filter(ev, props)) && mutableRef.current.resizeRegistry) {
			mutableRef.current.resizeRegistry.notify({action: 'invalidateBounds'});
		}
	}, [filter, props, resize]);

	return {[resize]: handleResize};
};

export default useResize;
