/**
 * Provides Moonstone-themed divider components and behaviors.
 *
 * @module moonstone/Divider
 * @exports Divider
 * @exports DividerBase
 * @exports DividerDecorator
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';
import Uppercase from '@enact/i18n/Uppercase';
import compose from 'ramda/src/compose';
import defaultProps from 'recompose/defaultProps';
import setPropTypes from 'recompose/setPropTypes';
import React from 'react';

import {MarqueeDecorator} from '../Marquee';
import Skinnable from '../Skinnable';

import css from './Divider.less';

/**
 * A simply styled component that may be used as a separator between groups of components.
 *
 * @class Divider
 * @memberof moonstone/Divider
 * @ui
 * @public
 */
const DividerBase = kind({
	name: 'Divider',

	propTypes: /** @lends moonstone/Divider.Divider.prototype */ {
		/**
		 * The divider content.
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
		 * * `'normal'` (default) spacing is slightly larger than the standard spotlight spacing.
		 * * `'small'` is the same size as spotlight spacing.
		 * * `'medium'` is 2x spotlight.
		 * * `'large'` is 3x spotlight.
		 * * `'none'` has no spacing at all. Neighboring elements will directly touch the divider.
		 *
		 * _Note:_ Spacing is separate from margin with regard to `margin-top`. It ensures a
		 * consistent distance from the bottom horizontal line. It's safe to use `margin-top` to add
		 * additional spacing above your `Divider`.
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
 * Moonstone-specific divider behaviors to apply to [Divider]{@link moonstone/Divider.DividerBase}.
 *
 * @hoc
 * @memberof moonstone/Divider
 * @mixes i18n/Uppercase.Uppercase
 * @mixes moonstone/MarqueeDecorator.MarqueeDecorator
 * @mixes ui/Skinnable.Skinnable
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
 * A Moonstone-styled divider with built-in support for uppercasing, and marqueed text.
 *
 * @class Divider
 * @extends moonstone/Divider.DividerBase
 * @memberof moonstone/Divider
 * @mixes moonstone/Divider.DividerDecorator
 * @ui
 * @public
 */

/**
 * Capitalization style for `children`.
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
 * Valid values are `'hover'` and `'render'`.
 *
 * @name marqueeOn
 * @type {String}
 * @default 'render'
 * @memberof moonstone/Divider.Divider.prototype
 * @see moonstone/Marquee.Marquee
 * @public
 */

const Divider = DividerDecorator(DividerBase);

export default Divider;
export {
	Divider,
	DividerBase,
	DividerDecorator
};
