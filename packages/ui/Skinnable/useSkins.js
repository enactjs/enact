import {createContext, useContext, useCallback, useMemo} from 'react';

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
 * @private
 */
const SkinContext = createContext(null);

/**
 * Configuration for `useSkins`
 *
 * @typedef {Object} useSkinsConfig
 * @memberof ui/Skinnable
 * @property {String}   defaultSkin       Default skin name when none has been specified or inherited.
 * @property {String[]} [defaultVariants] Default variants when none have been specified or inherited.
 * @property {String}   [skin]            Specific skin to apply to this instance which will take precedence over the default or the inherited value.
 * @property {String[]} skins             List of allowed skins
 * @property {String[]} [skinVariants]    Specific variants to apply to this instance which will take precedence over the default or the inherited value.
 * @property {String[]} [variants]        List of allowed variants
 * @private
 */

/**
 * Object returned by `useSkins`
 *
 * @typedef {Object} useSkinsInterface
 * @memberof ui/Skinnable
 * @property {String}   className    CSS classes for the effective skin and variants.
 * @property {String}   skin         Effective skin based on the allowed skins, the configured.
 *                                   `skin`, the default skin, and the inherited `skin` from up the
 *                                   component tree.
 * @property {String[]} variants     Effective skins variant based on the allowed variants, the
 *                                   configured variants, the default variants, and the inherited
 *                                   variants from up the component tree.
 * @property {Function} provideSkins Wraps a component tree with a skin provider to allow that tree
 *                                   to inherit the effective skin configured at this level.
 * @private
 */

/**
 * Determines the effective skin and skin variants for a component and provides a method to provide
 * those values to other contained components in this subtree.
 *
 * ```
 * function ComponentDecorator (props) {
 *   const skins = useSkins({
 *     defaultSkin: 'neutral',
 *     defaultVariants: [],
 *     skins: ['neutral', 'bold'],
 *     variants: ['highContrast'],
 *     skin: props.skin,
 *     skinVariants: props.skinVariants
 *   });
 *
 *   return skins.provideSkins(
 *     <Component className={classnames(props.className, skins.className)} />
 *   );
 * }
 * ```
 *
 * @param {useSkinsConfig} config Configuration options
 * @returns {useSkinsInterface}
 * @private
 */
function useSkins (config) {
	const {defaultSkin, defaultVariants, skin, skins, skinVariants, variants} = config;

	const {parentSkin, parentVariants} = useContext(SkinContext) || {};

	const effectiveSkin = determineSkin(defaultSkin, skin, parentSkin);
	const effectiveVariants = useMemo(() => determineVariants(defaultVariants, variants, skinVariants, parentVariants), [defaultVariants, variants, skinVariants, parentVariants]);
	const className = getClassName(skins, effectiveSkin, effectiveVariants);
	const value = useMemo(() => ({parentSkin: effectiveSkin, parentVariants: effectiveVariants}), [effectiveSkin, effectiveVariants]);

	const provideSkins = useCallback((children) => {
		return (
			<SkinContext value={value}>
				{children}
			</SkinContext>
		);
	}, [value]);

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
