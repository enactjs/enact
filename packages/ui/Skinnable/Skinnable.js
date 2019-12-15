/**
 * A higher-order component for customizing the visual appearance throughout an application.
 *
 * This is the base-level implementation of this component. It will typically never be accessed
 * directly, and only be instantiated with a configuration once inside a visual library like
 * {@link moonstone/Skinnable}. Interface libraries will supply a set of supported skins which will
 * be accessible to their components.
 *
 * @module ui/Skinnable
 * @exports Skinnable
 * @public
 */

import hoc from '@enact/core/hoc';
import React from 'react';
import PropTypes from 'prop-types';

import {configureSkinnable, defaultConfig, useSkinnable, SkinContext} from './useSkinnable';

/**
 * A higher-order component that assigns skinning classes for the purposes of styling children components.
 *
 * Use the config options to specify the skins your theme has. Set this up in your theme's decorator
 * component to establish your supported skins.
 *
 * Note: This HoC passes `className` to the wrapped component. It must be passed to the main DOM
 * node. Additionally, it can be configured to pass the skin and skin variant as props.
 *
 * Example:
 * ```
 * const MyApp = ({skinName, ...rest) => (<div {...props}>{skinName}</div>);
 * ...
 * App = Skinnable({
 * 	prop: 'skinName',
 * 	skins: {
 * 		dark: 'moonstone',
 * 		light: 'moonstone-light'
 * 	},
 * 	defaultTheme: 'dark'
 * 	defaultVariants: ['highContrast'],
 * 	allowedVariants: ['highContrast', 'largeText', 'grayscale']
 * }, MyApp);
 * ```
 *
 * @class Skinnable
 * @memberof ui/Skinnable
 * @hoc
 * @public
 */
const Skinnable = hoc(defaultConfig, (config, Wrapped) => {
	const hook = configureSkinnable(config);

	// eslint-disable-next-line no-shadow
	function Skinnable (props) {
		const {parentSkin, parentVariants, ...rest} = hook(props);

		return (
			<SkinContext.Provider value={{parentSkin, parentVariants}}>
				<Wrapped {...props} {...rest} />
			</SkinContext.Provider>
		);
	}

	Skinnable.propTypes = /** @lends ui/Skinnable.Skinnable.prototype */{
		/**
		 * The name of the skin a component should use to render itself. Available skins are
		 * defined in the "defaultConfig" for this HOC.
		 *
		 * @type {String}
		 * @public
		 */
		skin: PropTypes.string,

		/**
		 * The variant(s) on a skin that a component should use when rendering. These will
		 * typically alter the appearance of a skin's existing definition in a way that does not
		 * override that skin's general styling.
		 *
		 * Multiple data types are supported by this prop, which afford different conveniences
		 * and abilities. String and Array are effectively the same, supporting just additions
		 * to the variants being applied to a component, and are much more convenient. Objects
		 * may also be used, and have the ability to disable variants being passed by their
		 * ancestors. Objects take the format of a basic hash, with variants as key names and
		 * true/false Booleans as values, depicting their state. If a variant is excluded from
		 * any version of data type used to set this prop, that variant will ignored, falling
		 * back to the defaultVariant or parent variant, in that order.
		 *
		 * skinVariants examples:
		 * ```
		 *  // String
		 *  skinVariants="highContrast"
		 *
		 *  // Array
		 *  skinVariants={['highContrast']}
		 *
		 *  // Object
		 *  skinVariants={{
		 *  	highContrast: true,
		 *  	grayscale: false
		 *  }}
		 * ```
		 *
		 * @type {String|String[]|Object}
		 * @public
		 */
		skinVariants: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.array,
			PropTypes.object
		])
	};

	return Skinnable;
});

export default Skinnable;
export {
	configureSkinnable,
	Skinnable,
	useSkinnable
};
