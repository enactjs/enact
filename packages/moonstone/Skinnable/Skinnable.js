/**
 * Exports the {@link moonstone/Skinnable.Skinnable} higher-order component (HOC).
 *
 * @module moonstone/Skinnable
 * @public
 */

import hoc from '@enact/core/hoc';
import SkinnableBase, {withSkinnableProps} from '@enact/ui/Skinnable';

const defaultConfig = {
	skins: {
		dark: 'moonstone',
		light: 'moonstone-light'
	}
};

/**
 * This higher-order component is based on [ui/Skinnable]{@link ui/Skinnable.Skinnable} and comes
 * pre-configured for Moonstone's supported skins: "dark" (default) and "light". It is used to apply
 * the relevant skinning classes to each component and has been used to pre-select specific skins
 * for some components.
 *
 * @class Skinnable
 * @memberof moonstone/Skinnable
 * @hoc
 * @public
 */
const Skinnable = hoc(defaultConfig, SkinnableBase);

/**
 * Select a skin by name by specifying this property. Available Moonstone skins are
 * `"dark"` (default) and `"light"`. This may be changed at runtime. All components already use
 * their defaults, but a skin may be changed via this prop or by using {@link moonstone/Skinnable}
 * directly and a config object.
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

export default Skinnable;
export {
	Skinnable,
	withSkinnableProps
};
