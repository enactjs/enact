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
	const onResize = props[resize];

	const resizeContextValue = useContext(ResizeContext);
	const mutableRef = useRef({
		resizeRegistry: null
	});

	useEffect(() => {
		if (resizeContextValue && typeof resizeContextValue === 'function') {
			mutableRef.current.resizeRegistry = resizeContextValue(() => {});
		}
	}, [resizeContextValue]);

	const invalidateBounds = useCallback(() => {
		onResize();
		// Notifies a container that a resize is necessary
		if (mutableRef.current.resizeRegistry) {
			mutableRef.current.resizeRegistry.notify({action: 'invalidateBounds'});
		}
	}, [onResize]);

	const handlers = Object.assign({});
	handlers[resize] = invalidateBounds;
	return handlers;
};

export default useResizable;
