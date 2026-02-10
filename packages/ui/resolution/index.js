/**
 * Exports a number of useful methods for resolution independence.
 *
 * The default export is an object containing the resolution independence methods.
 *
 * Key exports include:
 * - `{@link ui/resolution.config}` - Configuration object for controlling resolution behavior, screen rotation handling, and more
 * - `{@link ui/resolution.getResolutionClasses}` - Returns CSS classes for resolution, orientation, and aspect ratio
 * - `{@link ui/resolution.ResolutionDecorator}` - HOC for wrapping components with resolution support
 * - Other utility functions for scaling, unit conversion, and screen type detection
 *
 * @module ui/resolution
 * @exports ResolutionDecorator
 */

import * as ri from './resolution';
import ResolutionDecorator from './ResolutionDecorator';

export default ri;
export * from './resolution';
export {ResolutionDecorator};
