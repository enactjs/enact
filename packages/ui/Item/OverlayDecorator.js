import factory from '@enact/core/factory';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import UiOverlay from './Overlay';

import componentCss from './Overlay.less';

/**
 * {@link ui/Item.OverlayDecorator} is a Higher-order Component that adds
 * `overlayBefore` and `overlayAfter` properties to add components before or after the usual
 * text content of an Item. The visibility of each can be individually controlled via the `autoHide`
 * property.
 *
 * @class OverlayDecorator
 * @memberof ui/Item
 * @hoc
 * @public
 */
const OverlayDecoratorFactory =  factory({css: componentCss}, ({css}) =>
	hoc((config, Wrapped) =>
		kind({
			name: 'OverlayDecorator',

			propTypes: /** @lends ui/Item.OverlayDecorator.prototype */ {
				/**
				 * Controls the visibility state of the overlays. One, both, or neither overlay can be
				 * shown when the item is focused. Choosing `'after'` will leave `overlayBefore` visible
				 * at all times; only `overlayAfter` will have its visibility toggled on focus.  Valid
				 * values are `'before'`, `'after'` and `'both'`. Omitting the property will result in
				 * no-auto-hiding for either overlay. They will both be present regardless of focus.
				 *
				 * @type {Boolean}
				 * @public
				 */
				autoHide: PropTypes.oneOf(['before', 'after', 'both']),

				/**
				 * The Overlay component to use in this decorator.
				 *
				 * @type {Component}
				 * @default {@link ui/Overlay}
				 * @public
				 */
				Overlay: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

				/**
				 * A node which will be displayed at the end of the item.  Typically this will be an
				 * icon or multiple icons.
				 *
				 * @type {Element}
				 * @public
				 */
				overlayAfter: PropTypes.node,

				/**
				 * A node which will be displayed at the beginning of the item.  Typically this will be
				 * an icon or multiple icons.
				 *
				 * @type {Element}
				 * @public
				 */
				overlayBefore: PropTypes.node
			},

			defaultProps: {
				Overlay: UiOverlay
			},

			styles: {
				css,
				className: 'item'
			},

			render: ({autoHide, children, Overlay, overlayAfter, overlayBefore, ...rest}) => {
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
		})
	)
);

const OverlayDecorator = OverlayDecoratorFactory();

export default OverlayDecorator;
export {
	OverlayDecorator,
	OverlayDecoratorFactory
};
