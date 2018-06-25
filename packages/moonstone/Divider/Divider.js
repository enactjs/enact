/**
 * Moonstone styled labeled divider components.
 *
 * @example
 * <Divider
 *   casing="preserve"
 *   spacing="medium"
 * >
 *   A group of related components
 * </Divider>
 *
 * @module moonstone/Divider
 * @exports Divider
 * @exports DividerBase
 */

import kind from '@enact/core/kind';
import Uppercase from '@enact/i18n/Uppercase';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import React from 'react';

import {MarqueeDecorator} from '../Marquee';
import Skinnable from '../Skinnable';

import css from './Divider.less';

const MarqueeH3 = Uppercase(MarqueeDecorator('h3'));

/**
 * A Moonstone styled labeled divider component used to group components.
 *
 * This component is most often not used directly but may be composed within another component as it
 * is within {@link moonstone/Divider.Divider}.
 *
 * @class DividerBase
 * @memberof moonstone/Divider
 * @mixes i18n/Uppercase.Uppercase
 * @mixes moonstone/MarqueeDecorator.MarqueeDecorator
 * @ui
 * @public
 */
const DividerBase = kind({
	name: 'Divider',

	propTypes: /** @lends moonstone/Divider.DividerBase.prototype */ {
		/**
		 * The casing mode applied to the `children` text.
		 *
		 * @see i18n/Uppercase#casing
		 * @type {String}
		 * @default 'word'
		 * @public
		 */
		casing: PropTypes.oneOf(['upper', 'preserve', 'word', 'sentence']),

		/**
		 * The text for the label of the divider.
		 *
		 * A divider with no children (text content) will render simply as a horizontal line, with
		 * even spacing above and below.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string,

		/**
		 * The size of the spacing around the divider.
		 *
		 * Allowed values include:
		 * * `'normal'` (default) - slightly larger than the standard spotlight spacing.
		 * * `'small'` - same size as spotlight spacing.
		 * * `'medium'` - 2x spotlight.
		 * * `'large'` - 3x spotlight.
		 * * `'none'` - no spacing at all. Neighboring elements will directly touch the divider.
		 *
		 * _Note:_ Spacing is separate from margin with regard to `margin-top`. It ensures a
		 * consistent distance from the bottom horizontal line. It's safe to use `margin-top` to add
		 * additional spacing above the divider.
		 *
		 * @type {String}
		 * @default 'normal'
		 * @public
		 */
		spacing: PropTypes.oneOf(['normal', 'small', 'medium', 'large', 'none'])
	},

	defaultProps: {
		casing: 'word',
		spacing: 'normal'
	},

	styles: {
		css,
		className: 'divider'
	},

	computed: {
		className: ({spacing, styler}) => styler.append(spacing)
	},

	render: ({children, ...rest}) => {
		delete rest.spacing;

		return (
			// TODO: change to `marqueeOn="render"`
			<MarqueeH3 marqueeOn="hover" {...rest}>{children}</MarqueeH3>
		);
	}
});

/**
 * A Moonstone styled labeled divider component used to group components.
 *
 * Usage:
 * ```
 * <Divider
 *   casing="preserve"
 *   spacing="medium"
 * >
 *   A group of related components
 * </Divider>
 * ```
 *
 * @class Divider
 * @memberof moonstone/Divider
 * @extends moonstone/Divider.DividerBase
 * @mixes ui/Skinnable.Skinnable
 * @ui
 * @public
 */
const Divider = Pure(
	Skinnable(
		DividerBase
	)
);

export default Divider;
export {Divider, DividerBase};
