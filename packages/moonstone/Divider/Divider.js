/**
 * Exports the {@link moonstone/Divider.Divider} component.
 *
 * @module moonstone/Divider
 */

import kind from '@enact/core/kind';
import {cap} from '@enact/core/util';
import React from 'react';
import PropTypes from 'prop-types';

import css from './Divider.less';
import {MarqueeDecorator} from '../Marquee';

const MarqueeH3 = MarqueeDecorator('h3');

/**
 * {@link moonstone/Divider.Divider} is a simply styled component that may be used as a separator
 * between groups of components.
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
		 * The content of the divider. A divider with no children (text content) will render simply
		 * as a horizontal line, with even spacing above and below.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string,

		/**
		 * The children string will be capitalized, unless this is set to true.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		preserveCase: PropTypes.bool,

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
		 * additional spacing above your {@link moonstone/Divider.Divider}.
		 *
		 * @type {String}
		 * @default 'normal'
		 * @public
		 */
		spacing: PropTypes.oneOf(['normal', 'small', 'medium', 'large', 'none'])
	},

	defaultProps: {
		preserveCase: false,
		spacing: 'normal'
	},

	styles: {
		css,
		className: 'divider'
	},

	computed: {
		className: ({spacing, styler}) => styler.append(spacing),
		content: ({children = '', preserveCase}) => preserveCase ? children : children.split(' ').map(cap).join(' ')
	},

	render: ({content, ...rest}) => {
		delete rest.preserveCase;
		delete rest.spacing;

		return (
			<MarqueeH3 {...rest} marqueeOn="hover">{content}</MarqueeH3>
		);
	}
});

export default DividerBase;
export {DividerBase as Divider, DividerBase};
