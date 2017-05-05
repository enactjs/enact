import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';

/**
 * {@link ui/ThemeDecorator} is a Higher-order Component that assigns theming classes for the
 * purposes of styling children components.
 *
 * @class ThemeDecorator
 * @memberof ui/ThemeDecorator
 * @hoc
 * @public
 */
const ThemeDecorator = hoc((config, Wrapped) => kind({
	name: 'ThemeDecorator',

	propTypes: /** @lends ui/ThemeDecorator.prototype */ {
		/**
		 * Set the goal size of the text. The UI library will be responsible for using this
		 * information to adjust the components' text sizes to this preset.
		 * Current presets are `'normal'` (default), and `'large'`.
		 *
		 * @type {String}
		 * @default 'normal'
		 * @public
		 */
		theme: React.PropTypes.oneOf(config.themes)
	},

	defaultProps: {
		theme: config.defaultTheme
	},

	styles: {},	// Empty `styles` tells `kind` that we want to use `styler` later and don't have a base className.

	computed: {
		className: ({theme, styler}) => styler.append(theme)
	},

	render: (props) => {
		delete props.theme;
		return (
			<Wrapped {...props} />
		);
	}
}));

export default ThemeDecorator;
export {ThemeDecorator};
