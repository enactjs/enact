/**
 * Exports the {@link ui/FloatingLayer.FloatingLayer} component and
 * {@link ui/FloatingLayer.FloatingLayerDecorator} Higher-order Component (HOC).
 * The default export is {@link ui/FloatingLayer.FloatingLayer}.
 *
 * @module ui/FloatingLayer
 */

import FloatingLayer from './FloatingLayer';
import {FloatingLayerDecorator, contextTypes} from './FloatingLayerDecorator';

export default FloatingLayer;
export {
	contextTypes,
	FloatingLayer,
	FloatingLayerDecorator
};
