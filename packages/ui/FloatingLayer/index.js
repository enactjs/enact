/**
 * Exports the {@link ui/FloatingLayer.FloatingLayer} component and
 * {@link ui/FloatingLayer.FloatingLayerDecorator} Higher-order Component (HOC).
 * The default export is {@link ui/FloatingLayer.FloatingLayer}.
 *
 * @module ui/FloatingLayer
 */

import {FloatingLayer, FloatingLayerBase} from './FloatingLayer';
import {FloatingLayerDecorator, contextTypes} from './FloatingLayerDecorator';

export default FloatingLayer;
export {
	contextTypes,
	FloatingLayer,
	FloatingLayerBase,
	FloatingLayerDecorator
};
