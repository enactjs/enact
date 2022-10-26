import {useCallback, useContext, useEffect, useRef} from 'react';

import ResizeContext from './ResizeContext';

/**
 * A custom hook which returns handler that indicates a resize is necessary
 * @function useResizable
 * @memberof ui/Resizable
 * @ui
 */
const useResizable = (props, config) => {
	// `resize` is the name of the event on the component to listen for size changes.
	const {resize} = config;
	const forwardHandler = props[resize];

	const resizeContextValue = useContext(ResizeContext);
	const mutableRef = useRef({
		resizeRegistry: null
	});

	useEffect(() => {
		if (resizeContextValue && typeof resizeContextValue === 'function') {
			mutableRef.current.resizeRegistry = resizeContextValue(() => {});
		}
	}, [resizeContextValue]);

	const handleResize = useCallback(() => {
		if (typeof forwardHandler === 'function') {
			forwardHandler();
		}
		// Notifies a container that a resize is necessary
		if (mutableRef.current.resizeRegistry) {
			mutableRef.current.resizeRegistry.notify({action: 'invalidateBounds'});
		}
	}, [forwardHandler]);

	const handlers = Object.assign({});
	handlers[resize] = handleResize;
	return handlers;
};

export default useResizable;
