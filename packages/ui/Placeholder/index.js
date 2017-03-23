/**
 * Exports the {@link ui/Placeholder.contextTypes},
 * {@link ui/Placeholder.PlaceholderContainer}, and
 * {@link ui/Placeholder.PlaceholderDecorator} components.
 *
 * The default export is {@link ui/Placeholder.PlaceholderDecorator}.
 *
 * @module ui/Placeholder
 */

import PlaceholderContainer from './PlaceholderContainer';
import {PlaceholderDecorator, contextTypes} from './PlaceholderDecorator';

export default PlaceholderDecorator;
export {
	contextTypes,
	PlaceholderContainer,
	PlaceholderDecorator
};
