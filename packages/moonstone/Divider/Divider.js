/**
 * Moonstone styled labeled divider components and behaviors
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
 * @exports DividerDecorator
 */

import kind from '@enact/core/kind';
import Uppercase from '@enact/i18n/Uppercase';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import defaultProps from 'recompose/defaultProps';
import setPropTypes from 'recompose/setPropTypes';
import React from 'react';

import {MarqueeDecorator} from '../Marquee';
import Skinnable from '../Skinnable';

import css from './Divider.less';

/**
 * A Moonstone styled labeled divider component used to group components.
 *
 * This component is most often not used directly but may be composed within another component as it
 * is within {@link moonstone/Divider.Divider}.
 *
 * @class DividerBase
 * @memberof moonstone/Divider
 * @ui
 * @public
 */
const DividerBase = kind({
	name: 'Divider',

	propTypes: /** @lends moonstone/Divider.DividerBase.prototype */ {
		/**
		 * The text for the label of the divider.
		 *
		 * A divider with no children (text content) will render simply as a horizontal line, with
		 * even spacing above and below.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

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
		spacing: 'normal'
	},

	styles: {
		css,
		className: 'divider'
	},

	computed: {
		className: ({spacing, styler}) => styler.append(spacing)
	},

	render: (props) => {
		delete props.spacing;

		return (
			<h3 {...props} />
		);
	}
});

/**
 * Moonstone specific divider behaviors to apply to
 * [DividerBase]{@link moonstone/Divider.DividerBase}.
 *
 * @hoc
 * @memberof moonstone/Divider
 * @mixes i18n/Uppercase.Uppercase
 * @mixes moonstone/MarqueeDecorator.MarqueeDecorator
 * @mixes ui/Skinnable.Skinnable
 * @public
 */
const DividerDecorator = compose(
	setPropTypes({
		marqueeOn: PropTypes.oneOf(['hover', 'render'])
	}),
	defaultProps({
		casing: 'word',
		marqueeOn: 'render'
	}),
	Pure,
	Uppercase,
	MarqueeDecorator,
	Skinnable
);

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
 * @mixes moonstone/Divider.DividerDecorator
 * @ui
 * @public
 */
const Divider = DividerDecorator(DividerBase);

/**
 * The casing mode applied to the `children` text.
 *
 * @name casing
 * @type {String}
 * @default 'word'
 * @memberof moonstone/Divider.Divider.prototype
 * @see i18n/Uppercase#casing
 * @public
 */

/**
 * Marquee animation trigger.
 *
 * Allowed values include:
 * * `'hover'` - Marquee begins when the pointer enters the component
 * * `'render'` - Marquee begins when the component is rendered
 *
 * @name marqueeOn
 * @type {String}
 * @default 'render'
 * @memberof moonstone/Divider.Divider.prototype
 * @see moonstone/Marquee.Marquee
 * @public
 */

export default Divider;
export {
	Divider,
	DividerBase,
	DividerDecorator
};
