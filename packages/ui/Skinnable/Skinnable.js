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
import classnames from 'classnames';
import intersection from 'ramda/src/intersection';

/**
 * Default config for `Skinnable`.
 *
 * @memberof ui/Skinnable.Skinnable
 * @hocconfig
 * @public
 */
const defaultConfig = {
	// The prop to pass down to children if they want the variants prop (possibly for modification).
	variantsProp: null,

	/**
	 * The prop in which to pass the effective skin to the wrapped component.
	 *
	 * If left unset, the current skin will not be passed to the wrapped component.
	 *
	 * @type {string}
	 * @memberof ui/Skinnable.Skinnable.defaultConfig
	 */
	prop: null,

	/**
	 * A hash mapping the available skin names to their CSS class name.
	 *
	 * The keys are accepted as the only valid values for the `skin` prop on the wrapped component.
	 *
	 * @type {Object}
	 * @memberof ui/Skinnable.Skinnable.defaultConfig
	 */
	skins: null,

	/**
	 * Assign a default skin from the `skins` list.
	 *
	 * This will be used if the instantiator of the wrapped component provides no value to the `skin` prop.
	 *
	 * @type {String}
	 * @memberof ui/Skinnable.Skinnable.defaultConfig
	 */
	defaultSkin: null,

	// Initial collection of applied variants
	defaultVariants: null,
	// A complete list (array) of all supported variants
	allowedVariants: null
};

/**
 * Allows a component to respond to skin changes via the Context API
 *
 * Example:
 * ```
 * ```
 *
 * @class SkinContext
 * @memberof ui/Skinnable
 * @hoc
 * @public
 */
const SkinContext = React.createContext(null);

/**
 * A higher-order component that assigns skinning classes for the purposes of styling children components.
 *
 * Use the config options to specify the skins your theme has. Set this up in your theme's decorator
 * component to establish your supported skins.
 *
 * Example:
 * ```
 * App = Skinnable({
 * 	skins: {
 * 		dark: 'moonstone',
 * 		light: 'moonstone-light'
 * 	},
 * 	defaultTheme: 'dark'
 * }, App);
 * ```
 *
 * @class Skinnable
 * @memberof ui/Skinnable
 * @hoc
 * @public
 */
const Skinnable = hoc(defaultConfig, (config, Wrapped) => {
	const {prop, skins, defaultSkin, allowedVariants, defaultVariants, variantsProp} = config;

	function determineSkin (authorSkin, parentSkin) {
		return authorSkin || defaultSkin || parentSkin;
	}

	function determineVariants (authorVariants, parentVariants) {
		return authorVariants || defaultVariants || parentVariants;
	}

	function getClassName (effectiveSkin, className, variants) {
		const skin = skins[effectiveSkin];

		// only apply the skin class if it's set and different from the "current" skin as
		// defined by the value in context
		if (skin || variants) {
			className = classnames(skin, variants, className);
		}

		return className;
	}

	function getVariants (variants) {
		// Bail if anything isn't setup correctly
		if (!allowedVariants || !allowedVariants.length || !variants) return [];

		// Support both an array of variants and a string of variants
		return intersection(allowedVariants, (variants instanceof Array ? variants : variants.split(' ')));
	}

	// eslint-disable-next-line
	return function Skinnable ({className, skin, skinVariants, ...rest}) {
		return (
			<SkinContext.Consumer>
				{(value) => {
					const {parentSkin, parentVariants} = value || {};
					const effectiveSkin = determineSkin(skin, parentSkin);
					const variants = getVariants(determineVariants(skinVariants, parentVariants));

					if (prop) {
						rest[prop] = effectiveSkin;
					}

					if (variantsProp) {
						rest[variantsProp] = variants;
					}

					return (
						<SkinContext.Provider value={{parentSkin: effectiveSkin, parentVariants: variants}}>
							<Wrapped className={getClassName(effectiveSkin, className, variants)} {...rest} />
						</SkinContext.Provider>
					);
				}}
			</SkinContext.Consumer>
		);
	};
});

export default Skinnable;
export {
	Skinnable
};
