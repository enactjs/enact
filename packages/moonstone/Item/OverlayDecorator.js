import hoc from '@enact/core/hoc';
import React from 'react';
import {OverlayDecorator as UiOverlayDecorator} from '@enact/ui/Item';

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

const OverlayDecorator = (props) => OverlayDecoratorBase(UiOverlayDecorator(props));

export default OverlayDecorator;
export {OverlayDecorator};
