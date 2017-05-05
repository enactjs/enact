import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';

/**
 * {@link ui/Skinnable} is a Higher-order Component that assigns skinning classes for the
 * purposes of styling children components.
 *
 * Use the config options to specify the skins your theme has. Set this up in your Theme's decorator
 * component to establish your supported skins.
 *
 * Example:
 * ```
 * App = Skinnable({
 * 	skins: ['moonstone', 'moonstone-light'],
 * 	defaultTheme: 'moonstone'
 * }, App);
 * ```
 *
 * @class Skinnable
 * @memberof ui/Skinnable
 * @hoc
 * @public
 */
const Skinnable = hoc((config, Wrapped) => kind({
	name: 'Skinnable',

	propTypes: /** @lends ui/Skinnable.prototype */ {
		/**
		 * Set the goal size of the text. The UI library will be responsible for using this
		 * information to adjust the components' text sizes to this preset.
		 * Current presets are `'normal'` (default), and `'large'`.
		 *
		 * @type {String}
		 * @default [providedByConfig]
		 * @public
		 */
		skin: React.PropTypes.oneOf(config.skins)
	},

	defaultProps: {
		skin: config.defaultskin
	},

	styles: {},	// Empty `styles` tells `kind` that we want to use `styler` later and don't have a base className.

	computed: {
		className: ({skin, styler}) => styler.append(skin)
	},

	render: (props) => {
		delete props.skin;
		return (
			<Wrapped {...props} />
		);
	}
}));

export default Skinnable;
export {Skinnable};
