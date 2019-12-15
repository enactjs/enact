import React from 'react';
import classnames from 'classnames';

import {objectify, preferDefined} from './util';

/**
 * Default config for `Skinnable`.
 *
 * @memberof ui/Skinnable.Skinnable
 * @hocconfig
 * @public
 */
const defaultConfig = {
	/**
	 * The prop in which to pass the skinVariants value to the wrapped component. The recommended
	 * value is "skinVariants".
	 *
	 * If left unset, the skinVariant will not be passed to the wrapped component.
	 *
	 * @type {String}
	 * @memberof ui/Skinnable.Skinnable.defaultConfig
	 */
	variantsProp: null,

	/**
	 * The prop in which to pass the effective skin to the wrapped component.
	 *
	 * If left unset, the current skin will not be passed to the wrapped component.
	 *
	 * @type {String}
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
	 * This will be used if the instantiator of the wrapped component provides no value to the
	 * `skin` prop.
	 *
	 * @type {String}
	 * @memberof ui/Skinnable.Skinnable.defaultConfig
	 */
	defaultSkin: null,

	/**
	 * Initial collection of applied variants
	 *
	 * This will be used if the instantiator of the wrapped component provides no value to the
	 * `skinVariants` prop.
	 *
	 * @type {String|String[]}
	 * @memberof ui/Skinnable.Skinnable.defaultConfig
	 */
	defaultVariants: null,

	/**
	 * A complete list of all supported variants.
	 *
	 * These will translate to CSS class names so should not conflict with any skin names.
	 * CamelCase is recommended for the values.
	 *
	 * @type {String[]}
	 * @memberof ui/Skinnable.Skinnable.defaultConfig
	 */
	allowedVariants: null
};

/**
 * Allows a component to respond to skin changes via the Context API
 *
 * Example:
 * ```
 * <App skin="dark">
 * 	<Section>
 * 		<Button>Gray Button</Button>
 * 	<Section>
 * 	<Popup skin="light">
 * 		<Button>White Button</Button>
 * 	</Popup>
 * </App>
 * ```
 *
 * @class SkinContext
 * @memberof ui/Skinnable
 * @hoc
 * @public
 */
const SkinContext = React.createContext(null);

function determineSkin (defaultSkin, authorSkin, parentSkin) {
	return authorSkin || defaultSkin || parentSkin;
}

function determineVariants (defaultVariants, allowedVariants, authorVariants, parentVariants) {
	if (!allowedVariants || !(allowedVariants instanceof Array)) {
		// There are no allowed variants, so just return an empty object, indicating that there are no viable determined variants.
		return {};
	}

	authorVariants = objectify(authorVariants);
	parentVariants = objectify(parentVariants);

	// Merge all of the variants objects, preferring values in objects from left to right.
	const mergedObj = [defaultVariants, parentVariants, authorVariants].reduce(
		(obj, a) => {
			Object.keys(a).forEach(key => {
				obj[key] = preferDefined(a[key], obj[key]);
			});

			return obj;
		},
		{}
	);

	// Clean up the merged object
	for (const key in mergedObj) {
		// Delete keys that are null or undefined and delete keys that aren't allowed
		if (mergedObj[key] == null || !allowedVariants.includes(key)) {
			delete mergedObj[key];
		}
	}


	return mergedObj;
}

function getClassName (skins, effectiveSkin, className, variants) {
	const skin = skins && skins[effectiveSkin];

	// only apply the skin class if it's set and different from the "current" skin as
	// defined by the value in context
	if (skin || variants) {
		className = classnames(skin, variants, className);
	}

	if (className) return className;
}

function configureSkinnable (config) {
	config = {...defaultConfig, ...config};

	const {prop, skins, defaultSkin, allowedVariants, variantsProp} = config;
	const defaultVariants = objectify(config.defaultVariants);

	// eslint-disable-next-line no-shadow
	return function useSkinnable (props) {
		const {className, skin, skinVariants} = props;

		const {parentSkin, parentVariants} = React.useContext(SkinContext) || {};
		const effectiveSkin = determineSkin(defaultSkin, skin, parentSkin);
		const variants = determineVariants(defaultVariants, allowedVariants, skinVariants, parentVariants);
		const allClassNames = getClassName(skins, effectiveSkin, className, variants);

		const updated = {
			parentSkin: effectiveSkin,
			parentVariants: variants
		};

		if (allClassNames) {
			updated.className = allClassNames;
		}

		if (prop) {
			updated[prop] = effectiveSkin;
		}

		if (variantsProp) {
			updated[variantsProp] = variants;
		}

		return updated;
	};
}

const useSkinnable = configureSkinnable();
useSkinnable.configure = configureSkinnable;

export default useSkinnable;
export {
	configureSkinnable,
	defaultConfig,
	useSkinnable,
	SkinContext
};
