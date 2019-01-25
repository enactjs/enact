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
import mergeWith from 'ramda/src/mergeWith';

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

const objectify = (arg) => {
	// undefined, null, empty string case
	// bail early
	if (!arg) return {};

	if (typeof arg === 'string') {
		// String case
		arg = arg.split(' ');
	} else if (arg instanceof Array) {
		// Array case
	} else {
		// It's just an object already.
		// return it unaltered
		return arg;
	}

	// only dealing with arrays now
	return arg.reduce((obj, a) => {
		obj[a] = true;
		return obj;
	}, {});
};

const preferDefined = (a, b) => ((a != null) ? a : b);

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
	const {prop, skins, defaultSkin, allowedVariants, variantsProp} = config;
	const defaultVariants = objectify(config.defaultVariants);

	function determineSkin (authorSkin, parentSkin) {
		return authorSkin || defaultSkin || parentSkin;
	}

	function determineVariants (authorVariants, parentVariants) {
		authorVariants = objectify(authorVariants);
		parentVariants = objectify(parentVariants);

		// Start with parent vars vs config-defaults, then compare author (prop) vars, overwriting
		// as we go, ignoring null/undefined values.
		const mergedObj = mergeWith(
			preferDefined,
			mergeWith(
				preferDefined,
				parentVariants,
				defaultVariants
			),
			authorVariants
		);

		// Clean up the merged object
		for (const key in mergedObj) {
			// Delete keys that are null or undefined and delete keys that aren't allowed
			if (mergedObj[key] == null || !allowedVariants.includes(key)) {
				delete mergedObj[key];
			}
		}

		// DELETE BEFORE MERGING
		console.group('vars');
		console.log('auth:', authorVariants);
		console.log('defs:', defaultVariants);
		console.log('pare:', parentVariants);
		console.log('merg:', mergedObj);
		console.groupEnd();

		return mergedObj;
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

	// eslint-disable-next-line no-shadow
	return function Skinnable ({className, skin, skinVariants, ...rest}) {
		return (
			<SkinContext.Consumer>
				{(value) => {
					const {parentSkin, parentVariants} = value || {};
					const effectiveSkin = determineSkin(skin, parentSkin);
					const variants = determineVariants(skinVariants, parentVariants);

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
