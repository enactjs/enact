

import hoc from '@enact/core/hoc';
import SkinnableBase, {withSkinnableProps} from '@enact/ui/Skinnable';

const defaultConfig = {
	skins: {
		dark: 'moonstone',
		light: 'moonstone-light'
	}
};

/**

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
