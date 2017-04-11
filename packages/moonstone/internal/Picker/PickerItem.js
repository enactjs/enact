import kind from '@enact/core/kind';
import React from 'react';

import {MarqueeText} from '../../Marquee';

import css from './Picker.less';

const PickerItemBase = kind({
	name: 'PickerItem',

	styles: {
		css,
		className: 'item'
	},

	render: (props) => (
		<MarqueeText {...props} marqueeCentered />
	)
});

export default PickerItemBase;
export {PickerItemBase as PickerItem, PickerItemBase};
