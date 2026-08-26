import {createContext} from 'react';

/**
 * The registry handle notified when a resize is necessary.
 *
 * @private
 */
interface ResizeRegistryHandle {
	notify: (payload?: Record<string, any>) => void;
	unregister: () => void;
}

/**
 * A function that registers a resize callback and returns a handle used to notify/unregister it.
 *
 * @private
 */
type ResizeContextValue = ((onInvalidateBounds: () => void) => ResizeRegistryHandle) | null;

/**
 * Used internally for things to notify children that they need to resize because of a parent
 * update.
 *
 * @type Object
 * @private
 */
const ResizeContext = createContext<ResizeContextValue>(null);

export default ResizeContext;
export type {ResizeContextValue, ResizeRegistryHandle};
