import React from 'react';

import {determineSkin, determineVariants, getClassName} from './util';

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
 * @private
 */
const SkinContext = React.createContext(null);

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
function useSkins (config, skin, skinVariants) {
	const {defaultSkin, defaultVariants, skins, variants} = config;

	const {parentSkin, parentVariants} = React.useContext(SkinContext) || {};

	const effectiveSkin = determineSkin(defaultSkin, skin, parentSkin);
	const effectiveVariants = determineVariants(defaultVariants, variants, skinVariants, parentVariants);
	const className = getClassName(skins, effectiveSkin, effectiveVariants);

	const provideSkins = React.useCallback((children) => {
		const value = {parentSkin: effectiveSkin, parentVariants: effectiveVariants};
		return (
			<SkinContext.Provider value={value}>
				{children}
			</SkinContext.Provider>
		);
	}, [effectiveSkin, effectiveVariants]);

	return {
		className,
		skin: effectiveSkin,
		variants: effectiveVariants,
		provideSkins
	};
}

export default useSkins;
export {
	useSkins
};
