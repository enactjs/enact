/**
 * Exports the {@link spotlight.Spottable}, {@link spotlight.SpotlightRootDecorator},
 * and {@link spotlight.SpotlightContainerDecorator} Higher-order Components, the
 * {@link spotlight.Spotlight} utility object, the {@link spotlight.spottableClass} and
 * {@link spotlight.spotlightDefaultClass} `className`s and the {@link spotlight.getDirection}
 * function. The default export is {@link spotlight.Spotlight}.
 *
 * @module spotlight
 */

import {Spotlight, getDirection} from './spotlight';
import {SpotlightRootDecorator} from './root';
import {SpotlightContainerDecorator, spotlightDefaultClass} from './container';
import {Spottable, spottableClass} from './spottable';

export default Spotlight;
export {Spotlight, SpotlightRootDecorator, SpotlightContainerDecorator, Spottable, spottableClass, spotlightDefaultClass, getDirection};

