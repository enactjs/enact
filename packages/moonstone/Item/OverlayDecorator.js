import hoc from '@enact/core/hoc';
import React from 'react';
import {OverlayDecoratorFactory as UiOverlayDecoratorFactory} from '@enact/ui/Item';

import Overlay from './Overlay';

/**
 * {@link moonstone/Item.OverlayDecorator} is a Higher-order Component that adds
 * `overlayBefore` and `overlayAfter` properties to add components before or after the usual
 * text content of an Item. The visibility of each can be individually controlled via the `autoHide`
 * property.
 *
 * @class OverlayDecorator
 * @memberof moonstone/Item
 * @hoc
 * @public
 */
const OverlayDecoratorBase = hoc((config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'MoonstoneOverlayDecorator'

		render () {
			return (
				<Wrapped {...this.props} Overlay={Overlay} />
			);
		}
	};
});

// Generate a base Overlay hoc
const UiOverlayDecorator = UiOverlayDecoratorFactory();
// Use the base hoc from above as the basis for OverlayDecoratorBase
const OverlayDecorator = (config, props) => OverlayDecoratorBase(UiOverlayDecorator(config, props));
// Generates a factory of a hoc and applies the factory props to the inner hoc-factory and the incoming props to the generated hoc (sorry, it's sorta confusing)
const OverlayDecoratorFactory = (factoryProps) => (props) => OverlayDecoratorBase(UiOverlayDecoratorFactory(factoryProps)(props));

export default OverlayDecorator;
export {
	OverlayDecorator,
	OverlayDecoratorFactory
};
