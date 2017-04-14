import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';

/**
 * {@link moonstone/MoonstoneDecorator.ThemeDecorator} is a Higher-order Component that
 * classifies an application with a target set of font sizing rules
 *
 * @class ThemeDecorator
 * @memberof moonstone/MoonstoneDecorator
 * @hoc
 * @public
 */
const ThemeDecorator = hoc((config, Wrapped) => kind({
	name: 'ThemeDecorator',

	propTypes: /** @lends moonstone/MoonstoneDecorator.ThemeDecorator.prototype */ {
		/**
		 * Set the goal size of the text. The UI library will be responsible for using this
		 * information to adjust the components' text sizes to this preset.
		 * Current presets are `'normal'` (default), and `'large'`.
		 *
		 * @type {String}
		 * @default 'normal'
		 * @public
		 */
		theme: React.PropTypes.oneOf(['moonstone', 'aqua', 'car', 'material'])
	},

	defaultProps: {
		theme: 'moonstone'
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
