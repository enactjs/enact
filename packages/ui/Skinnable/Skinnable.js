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

import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import mergeWith from 'ramda/src/mergeWith';

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
 * 	defaultVariants: ['highContrast'],
 * 	allowedVariants: ['highContrast', 'largeText', 'grayscale']
 * }, App);
 * ```
 *
 * @class Skinnable
 * @memberof ui/Skinnable
 * @hoc
 * @public
 */
const Skinnable = hoc(defaultConfig, (config, Wrapped) => {
	const MemoWrapped = React.memo(Wrapped)
	const {prop, skins, defaultSkin, allowedVariants, variantsProp} = config;
	const defaultVariants = objectify(config.defaultVariants);

	function determineSkin (authorSkin, parentSkin) {
		return authorSkin || defaultSkin || parentSkin;
	}

	function determineVariants (authorVariants, parentVariants) {
		if (!allowedVariants || !(allowedVariants instanceof Array)) {
			// There are no allowed variants, so just return an empty object, indicating that there are no viable determined variants.
			return {};
		}

		authorVariants = objectify(authorVariants);
		parentVariants = objectify(parentVariants);

		// Merge all of the variants objects, preferring values in objects from left to right.
		const mergedObj = [authorVariants, defaultVariants, parentVariants].reduce(
			(obj, a) => mergeWith(preferDefined, obj, a)
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

	function getClassName (effectiveSkin, className, variants) {
		const skin = skins && skins[effectiveSkin];

		// only apply the skin class if it's set and different from the "current" skin as
		// defined by the value in context
		if (skin || variants) {
			className = classnames(skin, variants, className);
		}

		if (className) return className;
	}

	return kind({
		name: 'Skinnable',
		propTypes: /** @lends ui/Skinnable.Skinnable.prototype */{
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
		},
		render: ({className, skin, skinVariants, ...rest}) => (
			<SkinContext.Consumer>
				{(value) => {
					const {parentSkin, parentVariants} = value || {};
					const effectiveSkin = determineSkin(skin, parentSkin);
					const variants = determineVariants(skinVariants, parentVariants);
					const allClassNames = getClassName(effectiveSkin, className, variants);

					if (allClassNames) {
						rest.className = allClassNames;
					}

					if (prop) {
						rest[prop] = effectiveSkin;
					}

					if (variantsProp) {
						rest[variantsProp] = variants;
					}

					return (
						<SkinContext.Provider value={{parentSkin: effectiveSkin, parentVariants: variants}}>
							<MemoWrapped {...rest} />
						</SkinContext.Provider>
					);
				}}
			</SkinContext.Consumer>
		)
	});
});

export default Skinnable;
export {
	Skinnable
};
