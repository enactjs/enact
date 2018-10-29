import kind from '@enact/core/kind';
import React from 'react';

import {MarqueeDecorator} from '../../Marquee';
import css from './Picker.less';

const Marquee = MarqueeDecorator('div');

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
