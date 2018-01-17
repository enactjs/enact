import kind from '@enact/core/kind';
import Marquee from '@enact/ui/Marquee';
import React from 'react';

import css from './Picker.less';

const PickerItemBase = kind({
	name: 'PickerItem',

	styles: {
		css,
		className: 'item'
	},

	render: (props) => (
		<Marquee {...props} alignment="center" />
	)
});

export default PickerItemBase;
export {PickerItemBase as PickerItem, PickerItemBase};
