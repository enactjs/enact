import kind from '@enact/core/kind';
import React from 'react';

import {MarqueeText} from '../../Marquee';
import {isRtlText} from '@enact/i18n';

import css from './Picker.less';

const PickerItemBase = kind({
	name: 'PickerItem',

	propTypes: /* @lends moonstone/Picker.PickerBase.prototype */ {

		/**
		* Children from which to pick
		*
		* @type {Node}
		* @public
		*/
		children: React.PropTypes.node.isRequired
	},

	styles: {
		css,
		className: 'item'
	},

	computed: {
		clientStyle: ({children}) => {
			let rtl = isRtlText(children);
			let direction = 'inherit';
			direction = rtl ? 'rtl' : 'ltr';

			const style = {
				direction
			};

			return style;
		}
	},

	render: ({clientStyle, ...rest}) => (
		<MarqueeText {...rest} style={clientStyle} marqueeCentered />
	)
});

export default PickerItemBase;
export {PickerItemBase as PickerItem, PickerItemBase};
