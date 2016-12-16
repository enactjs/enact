/**
 * Exports a number of useful methods for resolution independence as well as the
 * {@link ui/resolution.ResolutionDecorator} Higher-order Component (HOC). The default export is an
 * object containing the resolution independence methods.
 *
 * @module ui/resolution
 */

import * as ri from './resolution';
import ResolutionDecorator from './ResolutionDecorator';

export default ri;
export * from './resolution';
export {ResolutionDecorator};
