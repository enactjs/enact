import hoc from '@enact/core/hoc';
import UiTouchable from '@enact/ui/Touchable';

/**
 * Default config for {@link moonstone/internal/Touchable.Touchable}
 *
 * @memberof moonstone/internal/Touchable.Touchable
 * @hocconfig
 * @private
 */
const defaultConfig = {
	holdConfig: {
		events: [
			{name: 'hold', time: 400}
		]
	}
};

/**
 * {@link moonstone/internal/Touchable.Touchable} is a Higher-order Component that applies a
 * 'Touchable' behavior to its wrapped component, providing methods that fire when a hold
 * behavior is detected.
 *
 * @class Touchable
 * @memberof moonstone/internal/Touchable
 * @hoc
 * @private
 */
const Touchable = hoc(defaultConfig, UiTouchable);

export default Touchable;
