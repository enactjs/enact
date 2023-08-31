/**
 * A higher-order component for customizing the visual appearance throughout an application.
 *
 * This is the base-level implementation of this component. It will typically never be accessed
 * directly, and only be instantiated with a configuration once inside a visual library.
 * Interface libraries will supply a set of supported skins which will
 * be accessible to their components.
 *
 * @module ui/Skinnable
 * @exports Skinnable
 * @public
 */

import classnames from 'classnames';
import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';

import useSkins from './useSkins';
import {objectify} from './util';

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
	const {prop, skins, defaultSkin, allowedVariants: variants, variantsProp} = config;
	const defaultVariants = objectify(config.defaultVariants);

	// eslint-disable-next-line no-shadow
	function Skinnable ({className, skin, skinVariants, ...rest}) {
		const hook = useSkins({
			defaultSkin,
			defaultVariants,
			skin,
			skins,
			skinVariants,
			variants
		});

		const allClassNames = classnames(hook.className, className);
		if (allClassNames) {
			rest.className = allClassNames;
		}

		if (prop) {
			rest[prop] = hook.skin;
		}

		if (variantsProp) {
			rest[variantsProp] = hook.variants;
		}

		return hook.provideSkins(
			<Wrapped {...rest} />
		);
	}

	Skinnable.propTypes = /** @lends ui/Skinnable.Skinnable.prototype */ {
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
	Skinnable,
	useSkins
};
