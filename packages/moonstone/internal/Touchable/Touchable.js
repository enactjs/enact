/**
 * @module moonstone/internal/Touchable
 * @private
 */

import {Touchable, configure} from '@enact/ui/Touchable';

/**
 * Default config for {@link moonstone/internal/Touchable.Touchable}
 *
 * @memberof moonstone/internal/Touchable.Touchable
 * @hocconfig
 * @private
 */
configure({
	hold: {
		events: [
			{name: 'hold', time: 400}
		]
	}
});

export default Touchable;
