/**
 * Exports the Resize context. This is used internally for things to notify children that they need
 * to resize because of a parent update.
 *
 * @module ui/Resize
 * @private
 */
import React from 'react';

const Resize = React.createContext();

export default Resize;
export {Resize as ResizeContext};
