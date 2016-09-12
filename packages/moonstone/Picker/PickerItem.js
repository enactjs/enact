import kind from 'enact-core/kind';
import React from 'react';

import css from './Picker.less';

const PickerItem = kind({
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

export default PickerItem;
export {PickerItem};
