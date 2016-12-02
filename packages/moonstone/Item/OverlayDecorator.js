import {kind, hoc} from '@enact/core';
import React, {PropTypes} from 'react';

import Overlay from './Overlay';

import css from './Overlay.less';

/**
 * {@link moonstone/Item.OverlayDecorator} is a Higher-order Component that adds
 * `overlayBefore` and `overlayAfter` properties to add components before or after the usual
 * text content of an Item. The visibility of each can be individually controlled via the `autoHide`
 * property.
 *
 * @class OverlayDecorator
 * @memberOf moonstone/Item
 * @hoc
 * @public
 */
const OverlayDecorator = hoc((config, Wrapped) => {
	return kind({
		name: 'OverlayDecorator',

		propTypes: /** @lends moonstone/Item.OverlayDecorator.prototype */ {
			/**
			 * Controls the visibility state of the overlays. One, both, or neither overlay can be
			 * shown when the item is focused. Choosing 'after' will leave `overlayBefore`
			 * visible at all times; only `overlayAfter` will have its visibility toggled on focus.
			 * Valid values are 'before', 'after', 'both' and 'no'. 'no' being no-auto-hiding
			 * for either overlay. They will both be present regardless of focus.
			 *
			 * @type {Boolean}
			 * @default 'no'
			 * @public
			 */
			autoHide: PropTypes.oneOf(['no', 'before', 'after', 'both']),

			/**
			 * Property accepts a node which will be displayed at the end of the item.
			 * Typically this will be an icon or multiple icons.
			 *
			 * @type {Element}
			 * @default null
			 * @public
			 */
			overlayAfter: PropTypes.node,

			/**
			 * Property accepts a node which will be displayed at the beginning of the item.
			 * Typically this will be an icon or multiple icons.
			 *
			 * @type {Element}
			 * @default null
			 * @public
			 */
			overlayBefore: PropTypes.node
		},

		defaultProps: {
			autoHide: 'no'
		},

		styles: {
			css,
			className: 'item'
		},

		render: ({overlayAfter, autoHide, overlayBefore, children, ...rest}) => {
			return (
				<Wrapped {...rest}>
					<Overlay className={css.before} hidden={autoHide === 'before' || autoHide === 'both'}>
						{overlayBefore}
					</Overlay>
					{children}
					<Overlay className={css.after} hidden={autoHide === 'after' || autoHide === 'both'}>
						{overlayAfter}
					</Overlay>
				</Wrapped>
			);
		}
	});
});

export default OverlayDecorator;
export {OverlayDecorator};
