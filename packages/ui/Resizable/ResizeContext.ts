import {Context, createContext} from 'react';

/**
 * Used internally for things to notify children that they need to resize because of a parent
 * update.
 *
 * @type Object
 * @private
 */
const ResizeContext: Context<any> = createContext(null);

export default ResizeContext;
