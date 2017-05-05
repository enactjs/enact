/**
 * Exports the {@link ui/Skinnable.Skinnable} Higher-order Component (HOC).
 *
 * @module ui/Skinnable
 */

import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';

/**
 * Default config for {@link ui/Skinnable.Skinnable}.
 *
 * @memberof ui/Skinnable
 * @hocconfig
 * @public
 */
const defaultConfig = {
	/**
	 * An array of the available skin names. These will be used as the class names for your skin,
	 * and are accepted as the only valid values for the `skin` prop on the wrapped component.
	 *
	 * @type {Array}
	 * @memberof ui/Skinnable.Skinnable.defaultConfig
	 */
	skins: null,

	/**
	 * Assign a default skin from the `skins` list. This will be used if the instantiator of the
	 * wrapped component provides no value to the `skin` prop.
	 *
	 * @type {String}
	 * @memberof ui/Skinnable.Skinnable.defaultConfig
	 */
	defaultSkin: null
};

/**
 * {@link ui/Skinnable.Skinnable} is a Higher-order Component that assigns skinning classes for the
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
const Skinnable = hoc(defaultConfig, (config, Wrapped) => kind({
	name: 'Skinnable',

	propTypes: /** @lends ui/Skinnable.Skinnable.prototype */ {
		/**
		 * Select a skin by name. The list of available skins is established by the direct consumer
		 * of this component via the config options. This will typically be done once by the theme
		 * decorator, like [MoonstoneDecorator]{@link moonstone/MoonstoneDecorator} which will
		 * supply the list of skins.
		 *
		 * @type {String}
		 * @default [providedByConfig]
		 * @public
		 */
		skin: React.PropTypes.oneOf(config.skins)
	},

	defaultProps: {
		skin: config.defaultSkin
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
