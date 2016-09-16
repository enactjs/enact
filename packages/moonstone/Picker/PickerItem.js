import kind from 'enact-core/kind';
import React from 'react';

import css from './Picker.less';

const PickerItemBase = kind({
	name: 'PickerItem',

	styles: {
		css,
		className: 'item'
	},

	render: ({children, ...rest}) => (
		<div {...rest}>
			{children}
		</div>
	)
});

export default PickerItemBase;
export {PickerItemBase as PickerItem, PickerItemBase};
