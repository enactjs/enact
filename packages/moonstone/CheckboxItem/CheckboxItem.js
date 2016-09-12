import React from 'react';
import kind from 'enact-core/kind';

import {ToggleItemBase} from '../ToggleItem';

import css from './CheckboxItem.less';

const CheckboxItem = kind({
	name: 'CheckboxItem',

	propTypes: ToggleItemBase.propTypes,

	defaultProps: ToggleItemBase.defaultProps,

	styles: {
		css,
		className: 'checkboxItem'
	},

	computed: {
		iconClasses: ({checked, styler}) => styler.join(
			css.icon,
			{checked}
		)
	},

	render: (props) => (
		<ToggleItemBase {...props} icon="check" />
	)
});

export default CheckboxItem;
export {CheckboxItem, CheckboxItem as CheckboxItemBase};
