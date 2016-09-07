import kind from 'enyo-core/kind';
import React from 'react';

import css from './Picker.less';

const PickerItem = kind({
	name: 'PickerItem',

	styles: {
		css,
		classes: 'item'
	},

	render: ({children, classes, ...rest}) => (
		<div {...rest} className={classes}>
			{children}
		</div>
	)
});

export default PickerItem;
export {PickerItem};
