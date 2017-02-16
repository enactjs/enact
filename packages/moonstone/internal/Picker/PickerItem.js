import kind from '@enact/core/kind';
import React from 'react';

import {MarqueeText} from '../../Marquee';

import css from './Picker.less';

const PickerItemBase = kind({
	name: 'PickerItem',

	propTypes: {
		disabled: React.PropTypes.bool,
		joined: React.PropTypes.bool
	},

	styles: {
		css,
		className: 'item'
	},

	computed: {
		marqueeControl: ({disabled, joined}) => {
			return !disabled && joined ? 'focus' : 'hover';
		}
	},

	render: ({marqueeControl, ...rest}) => {
		delete rest.disabled;
		delete rest.joined;
		return (
			<MarqueeText {...rest} marqueeCentered marqueeOn={marqueeControl} />
		);
	}
});

export default PickerItemBase;
export {PickerItemBase as PickerItem, PickerItemBase};
