/**
 * Exports the {@link ui/Skinnable.Skinnable} higher-order component (HOC).
 *
 * This is the base-level implementation of this component. It will typically never be accessed
 * directly, and only be instantiated with a configuration once inside a visual library like
 * {@link moonstone/Skinnable}. Interface libraries will supply a set of supported skins which will
 * be accessible to their components.
 *
 * @module ui/Skinnable
 * @exports Skinnable
 * @exports withSkinnableProps
 * @public
 */

import hoc from '@enact/core/hoc';
import React from 'react';

/**
 * Default config for {@link ui/Skinnable.Skinnable}.
 *
 * @memberof ui/Skinnable.Skinnable
 * @hocconfig
 * @public
 */
const defaultConfig = {
	/**
	 * A hash mapping the available skin names to their CSS class name. The keys are accepted as
	 * the only valid values for the `skin` prop on the wrapped component.
	 *
	 * @type {Object}
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

const SkinContext = React.createContext(null);

/**
 * [Skinnable]{@link ui/Skinnable.Skinnable} is a higher-order component (HOC) that assigns skinning
 * classes for the purposes of styling children components.
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
	const {skins, defaultSkin} = config;

	function determineSkin (authorSkin, parentSkin) {
		return authorSkin || defaultSkin || parentSkin;
	}

	function getClassName (authorSkin, parentSkin, className) {
		const skin = skins[determineSkin(authorSkin, parentSkin)];

		// only apply the skin class if it's set and different from the "current" skin as
		// defined by the value in context
		if (skin) {
			if (className) {
				className = `${skin} ${className}`;
			} else {
				className = skin;
			}
		}

		return className;
	}

	// eslint-disable-next-line
	return function Skinnable ({className, skin, ...rest}) {
		return (
			<SkinContext.Consumer>
				{parentSkin => {
					const effectiveSkin = determineSkin(skin, parentSkin);

					return (
						<SkinContext.Provider value={effectiveSkin}>
							<Wrapped className={getClassName(skin, parentSkin, className)} {...rest} />
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
