/**
 * Exports the {@link ui/Divider.Divider} component.
 *
 * @module ui/Divider
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import Uppercase from '@enact/i18n/Uppercase';
import React from 'react';
import PropTypes from 'prop-types';

import {MarqueeDecorator} from '../Marquee';

import componentCss from './Divider.less';

const MarqueeH3 = Uppercase(MarqueeDecorator('h3'));

/**
 * {@link ui/Divider.DividerBaseFactory} is Factory wrapper around {@link ui/Divider.DividerBase}
 * that allows overriding certain classes at design time. The following are properties of the `css`
 * member of the argument to the factory.
 *
 * @class DividerBaseFactory
 * @memberof ui/Divider
 * @factory
 * @ui
 * @public
 */
const DividerBaseFactory = factory({css: componentCss}, ({css}) => {
	/**
	 * {@link ui/Divider.Divider} is a simply styled component that may be used as a separator
	 * between groups of components.
	 *
	 * @class Divider
	 * @memberof ui/Divider
	 * @ui
	 * @public
	 */
	return kind({
		name: 'Divider',

		propTypes: /** @lends ui/Divider.Divider.prototype */ {
			/**
			 * Configures how the `children` string will be capitalized. By default, each word is capitalized.
			 *
			 * @see i18n/Uppercase#casing
			 * @type {String}
			 * @default 'word'
			 * @public
			 */
			casing: PropTypes.oneOf(['upper', 'preserve', 'word', 'sentence']),

			/**
			 * The content of the divider. A divider with no children (text content) will render simply
			 * as a horizontal line, with even spacing above and below.
			 *
			 * @type {String}
			 * @public
			 */
			children: PropTypes.string,

			/**
			 * The children string will have each word capitalized, unless this is set to `true`.
			 *
			 * @type {Boolean}
			 * @default false
			 * @deprecated use `casing`
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
			 * additional spacing above your {@link ui/Divider.Divider}.
			 *
			 * @type {String}
			 * @default 'normal'
			 * @public
			 */
			spacing: PropTypes.oneOf(['normal', 'small', 'medium', 'large', 'none'])
		},

		defaultProps: {
			casing: 'word',
			preserveCase: false,
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
				<MarqueeH3 {...rest} marqueeOn="hover">{children}</MarqueeH3>
			);
		}
	});
});

const DividerBase = DividerBaseFactory();

export default DividerBase;
export {
	DividerBase as Divider,
	DividerBase,
	DividerBaseFactory as DividerFactory,
	DividerBaseFactory
};
