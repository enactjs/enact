import kind from '@enact/core/kind';
import {MarqueeText} from '@enact/ui/MarqueeDecorator';
import React from 'react';

import css from './Picker.less';

const PickerItemBase = kind({
	name: 'PickerItem',

	styles: {
		css,
		className: 'item'
	},

	render: (props) => (
		<MarqueeText {...props} alignment="center" />
	)
});

export default PickerItemBase;
export {PickerItemBase as PickerItem, PickerItemBase};
