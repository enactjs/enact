import {forward} from '@enact/core/handle';

import {useCallback, useContext, useEffect, useRef} from 'react';

import ResizeContext from './ResizeContext';

/**
 * A custom hook which returns handler that indicates a resize is necessary
 * @function useResize
 * @memberof ui/Resizable
 * @ui
 */
const useResize = (props, config) => {
	// `resize` is the name of the event on the component to listen for size changes.
	const {filter = null, resize = null} = config;

	const resizeContextValue = useContext(ResizeContext);
	const mutableRef = useRef({
		resizeRegistry: null
	});

	useEffect(() => {
		let {resizeRegistry} = mutableRef.current;

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

	const handlers = Object.assign({});
	handlers[resize] = handleResize;

	return handlers;
};

export default useResize;
