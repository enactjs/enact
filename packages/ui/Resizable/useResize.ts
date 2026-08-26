import {forward} from '@enact/core/handle';
import {useCallback, use, useEffect, useRef} from 'react';

import ResizeContext, {type ResizeRegistryHandle} from './ResizeContext';

interface UseResizeConfig {
	/**
	 * A handler to process the `resize` event.
	 *
	 * It should return a truthy value if the event should trigger a resize.
	 */
	filter?: ((ev: any, props: Record<string, any>) => boolean) | null;

	/**
	 * The name of the event on the wrapped component to listen to for size changes.
	 */
	resize?: string | null;
}

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
const useResize = (props: Record<string, any>, config: UseResizeConfig): Record<string, (ev: any) => void> => {
	// `resize` is the name of the event on the component to listen for size changes.
	const {filter = null, resize = null} = config;

	const resizeContextValue = use(ResizeContext);
	const mutableRef = useRef<{resizeRegistry: ResizeRegistryHandle | null}>({
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

	const handleResize = useCallback((ev: any) => {
		forward(resize as string, ev, props);

		// Notifies a container that a resize is necessary
		if ((filter === null || filter(ev, props)) && mutableRef.current.resizeRegistry) {
			mutableRef.current.resizeRegistry.notify({action: 'invalidateBounds'});
		}
	}, [filter, props, resize]);

	return {[resize as string]: handleResize};
};

export default useResize;
