/**
 * A component for instantiating a section of content with a title.
 *
 * @example
 * <Heading spacing="none">
 *   A Content Section Heading
 * </Heading>
 *
 * @module ui/Heading
 * @exports Heading
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import css from './Heading.module.less';

/**
 * A labeled Heading component.
 *
 * @class Heading
 * @memberof ui/Heading
 * @ui
 * @public
 */
const Heading = kind({
	name: 'Heading',

	propTypes: /** @lends ui/Heading.Heading.prototype */ {
		/**
		 * The text for the label of the Heading.
		 *
		 * A Heading with no children (text content) will render simply as a horizontal line, with
		 * even spacing above and below.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `heading` - The root component class
		 * * `title` - Applied when `size` is set to "title"
		 * * `subtitle` - Applied when `size` is set to "subtitle"
		 * * `large` - Applied when `size` is set to "large"
		 * * `medium` - Applied when `size` is set to "medium"
		 * * `small` - Applied when `size` is set to "small"
		 * * `tiny` - Applied when `size` is set to "tiny"
		 * * `largeSpacing` - Applied when `spacing` is set to "large"
		 * * `mediumSpacing` - Applied when `spacing` is set to "medium"
		 * * `smallSpacing` - Applied when `spacing` is set to "small"
		 * * `noneSpacing` - Applied when `spacing` is set to "none"
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Set the size of this component.
		 *
		 * Allowed values include:
		 * * `'title'` and `'subtitle'` are generally considered to be used only once on a given screen.
		 * * `'large'`, `'medium'`, `'small'`, and `'tiny'` are typically used as section headings
		 * for content on a screen, starting with `'large'` for the first tier of information
		 * followed by `'medium'` for the next, and so fourth.
		 *
		 * If the `spacing` prop is not set (defaulting to "auto"), these values automatically set
		 * the spacing to the correlated names.
		 *
		 * @type {('title'|'subtitle'|'large'|'medium'|'small'|'tiny')}
		 * @public
		 */
		size: PropTypes.oneOf(['title', 'subtitle', 'large', 'medium', 'small', 'tiny']),

		/**
		 * The size of the spacing around the Heading.
		 *
		 * These have no built-in measurements, as they are intended to be defined by the theme
		 * consuming this UI element. The values correlate with customizable classes bade available
		 * by this component's `css` prop.
		 *
		 * Allowed values include:
		 * * `'auto'` (default) - Lets this value be based on the `size` prop for automatic usage.
		 * * `'large'` - Specifically assign the `'large'` spacing.
		 * * `'medium'` - Specifically assign the `'medium'` spacing.
		 * * `'small'` - Specifically assign the `'small'` spacing.
		 * * `'none'` - No spacing at all. Neighboring elements will directly touch the Heading.
		 *
		 * @type {('auto'|'large'|'medium'|'small'|'none')}
		 * @default 'auto'
		 * @public
		 */
		spacing: PropTypes.oneOf(['auto', 'large', 'medium', 'small', 'none'])
	},

	defaultProps: {
		size: 'medium',
		spacing: 'auto'
	},

	styles: {
		css,
		className: 'heading',
		publicClassNames: true
	},

	computed: {
		// This logic is intended to have the following result:
		// Apply a class for the current 'size'. Use the 'size' to determine the spacing, unless a
		// "non-auto" spacing value was specified.
		className: ({size, spacing, styler}) => styler.append(size, {[(spacing !== 'auto' ? spacing : (size || 'none')) + 'Spacing']: true}),
		Tag: ({size}) => {
			switch (size) {
				case 'title':    return 'h1';
				case 'subtitle': return 'h2';
				case 'large':    return 'h3';
				case 'medium':   return 'h4';
				case 'small':    return 'h5';
				case 'tiny':     return 'h6';
			}
		}
	},

	render: ({Tag, ...rest}) => {
		delete rest.size;
		delete rest.spacing;

		return (
			<Tag {...rest} />
		);
	}
});

export default Heading;
export {
	Heading
};
