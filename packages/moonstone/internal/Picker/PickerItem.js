import kind from '@enact/core/kind';
import React from 'react';

import {MarqueeText} from '../../Marquee';
import {isRtlText} from '@enact/i18n';

import css from './Picker.less';

const PickerItemBase = kind({
	name: 'PickerItem',

	propTypes: /** @lends moonstone/Picker.PickerBase.prototype */ {

		/**
		 * Children from which to pick
		 *
		 * @type {Node|Node[]}
		 * @public
		 */
		children: React.PropTypes.node,


		/**
		 * Forces the `direction` Picker list. Valid values are `rtl` and `ltr`. This includes non-text elements as well.
		 *
		 * @type {String}
		 * @public
		 */
		forceDirection: React.PropTypes.oneOf(['rtl', 'ltr'])
	},

	styles: {
		css,
		className: 'item'
	},

	computed: {
		forceDirection: ({children}) => isRtlText(children) ? 'rtl' : 'ltr'
	},

	render: (props) => (
		<MarqueeText {...props} marqueeCentered />
	)
});

export default PickerItemBase;
export {PickerItemBase as PickerItem, PickerItemBase};
