import {kind, hoc} from '@enact/core';
import React, {PropTypes} from 'react';

import css from './Overlay.less';
import Overlay from './Overlay';

/**
 * {@link moonstone/Item~OverlayDecorator} is a Higher-order Component that adds
 * `beginningOverlay` and `endingOverlay` properties to add components before or after the usual
 * text content of an Item. The visibility of each can be individually controlled via the `autoHide`
 * property.
 *
 * @class OverlayDecorator
 * @memberOf moonstone/Item
 * @ui
 * @public
 */
const OverlayDecorator = hoc((config, Wrapped) => {
	return kind({
		name: 'OverlayDecorator',

		propTypes: {
			/**
			 * Controls the visibility state of the overlays. One, both, or neither overlay can be
			 * shown when the item is focused. Choosing 'ending' will leave `beginningOverlay`
			 * visible at all times; only `endingOverlay` will have its visibility toggled on focus.
			 * Valid values are 'beginning', 'ending', 'both' and 'no'. 'no' being no-auto-hiding
			 * for either overlay. They will both be present regardless of focus.
			 *
			 * @type {Boolean}
			 * @default 'no'
			 * @public
			 */
			autoHide: PropTypes.oneOf(['no', 'beginning', 'ending', 'both']),

			/**
			 * Property accepts a node which will be displayed at the beginning of the item.
			 * Typically this will be an icon or multiple icons.
			 *
			 * @type {Element}
			 * @default null
			 * @public
			 */
			beginningOverlay: PropTypes.node,

			/**
			 * Property accepts a node which will be displayed at the end of the item.
			 * Typically this will be an icon or multiple icons.
			 *
			 * @type {Element}
			 * @default null
			 * @public
			 */
			endingOverlay: PropTypes.node
		},

		defaultProps: {
			autoHide: 'no'
		},

		styles: {
			css,
			className: 'item'
		},

		computed: {
			className: ({autoHide, styler}) => styler.append({autoHide})
		},

		render: ({beginningOverlay, children, endingOverlay, autoHide, ...rest}) => {
			return (
				<Wrapped {...rest}>
					<Overlay className={css.beginning} hidden={autoHide === 'beginning' || autoHide === 'both'}>
						{beginningOverlay}
					</Overlay>
					{children}
					<Overlay className={css.ending} hidden={autoHide === 'ending' || autoHide === 'both'}>
						{endingOverlay}
					</Overlay>
				</Wrapped>
			);
		}
	});
});

export default OverlayDecorator;
export {OverlayDecorator};
