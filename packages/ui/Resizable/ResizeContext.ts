import type {RegisterFunction} from '@enact/core/internal/Registry';
import {createContext} from 'react';

/**
 * A function that registers a resize callback and returns a handle used to notify/unregister it.
 *
 * This is the real `RegisterFunction` from `core/internal/Registry` -- the value provided here is
 * always `Registry.create(...).register`. An earlier version of this file declared its own
 * approximate `ResizeContextValue`/`ResizeRegistryHandle` shapes (written before the real
 * `core/internal/Registry` types were available for cross-checking); those didn't structurally
 * match the real `RegisterFunction`/`RegistryController` (e.g. `notify`'s payload is optional here
 * but required on the real `RegistryController`), so they're replaced with the real type directly.
 *
 * @private
 */
type ResizeContextValue = RegisterFunction | null;

/**
 * Used internally for things to notify children that they need to resize because of a parent
 * update.
 *
 * @type Object
 * @private
 */
const ResizeContext = createContext<ResizeContextValue>(null);

export default ResizeContext;
export type {ResizeContextValue};
