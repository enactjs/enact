/**
 * Exports the {@link ui/Placeholder.contextTypes} object and the
 * {@link ui/Placeholder.PlaceholderControllerDecorator} and
 * {@link ui/Placeholder.PlaceholderDecorator} higher-order components.
 *
 * The default export is [PlaceholderDecorator]{@link ui/Placeholder.PlaceholderDecorator}.
 *
 * @module ui/Placeholder
 * @exports contextTypes
 * @exports PlaceholderControllerDecorator
 * @exports PlaceholderDecorator
 */

import PlaceholderControllerDecorator from './PlaceholderControllerDecorator';
import {PlaceholderDecorator, contextTypes} from './PlaceholderDecorator';

export default PlaceholderDecorator;
export {
	contextTypes,
	PlaceholderControllerDecorator,
	PlaceholderDecorator
};
