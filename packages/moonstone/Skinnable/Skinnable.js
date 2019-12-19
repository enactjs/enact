/**
 * Exports the {@link moonstone/Skinnable.Skinnable} higher-order component (HOC).
 *
 * @module moonstone/Skinnable
 * @exports Skinnable
 * @public
 */

import hoc from '@enact/core/hoc';
import SkinnableBase, {configureSkinnable} from '@enact/ui/Skinnable';

const defaultConfig = {
	skins: {
		dark: 'moonstone',
		light: 'moonstone-light'
	},
	defaultVariants: ['highContrast'],
	allowedVariants: ['highContrast', 'largeText', 'grayscale']
};

/**
 * This higher-order component is based on [ui/Skinnable]{@link ui/Skinnable.Skinnable}.
 *
 * `Skinnable` comes pre-configured for Moonstone's supported skins: "dark" (default) and "light".
 * It is used to apply the relevant skinning classes to each component and has been used to
 * pre-select specific skins for some components.
 *
 * Note: This HoC passes `className` to the wrapped component. It must be passed to the main DOM
 * node.
 *
 * @class Skinnable
 * @memberof moonstone/Skinnable
 * @extends ui/Skinnable.Skinnable
 * @hoc
 * @public
 */
const Skinnable = hoc(defaultConfig, SkinnableBase);

/**
 * Select a skin by name by specifying this property.
 *
 * Available Moonstone skins are `"dark"` (default) and `"light"`. This may be changed at runtime.
 * All components already use their defaults, but a skin may be changed via this prop or by using
 * `Skinnable` directly and a config object.
 *
 * Example:
 * ```
 * <Button skin="light">
 * ```
 *
 * @name skin
 * @type {String}
 * @default 'dark'
 * @memberof moonstone/Skinnable.Skinnable
 * @instance
 * @public
 */

const useSkinnable = configureSkinnable(defaultConfig);

export default Skinnable;
export {
	Skinnable,
	useSkinnable
};
