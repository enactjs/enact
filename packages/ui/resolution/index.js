/**
 * Provides resolution independence utilities for responsive applications.
 *
 * This module enables applications to adapt to different screen resolutions, orientations, and aspect ratios.
 * It includes support for screen rotation scenarios, allowing applications
 * to dynamically adjust their layout and scaling when device orientation changes.
 *
 * Key features:
 * - Automatic detection of a screen type based on resolution
 * - Dynamic font-size calculation for different resolutions
 * - Support for screen rotation and orientation changes
 * - Configurable behavior via {@link ui/resolution.config}
 * - CSS class generation for resolution-specific styling via {@link ui/resolution.getResolutionClasses}
 * - The default export is an object containing the resolution independence methods.
 *
 * Key exports include:
 * - {@link ui/resolution.config} - Configuration object for controlling resolution behavior, screen rotation handling, and more
 * - {@link ui/resolution.getResolutionClasses} - Returns CSS classes for resolution, orientation, and aspect ratio
 * - {@link ui/resolution.ResolutionDecorator} - HOC for wrapping components with resolution support
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
