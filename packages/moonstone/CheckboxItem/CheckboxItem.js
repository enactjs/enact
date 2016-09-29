import React from 'react';
import kind from '@enact/core/kind';

import {ToggleItemBase} from '../ToggleItem';

import css from './CheckboxItem.less';

const CheckboxItemBase = kind({
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

export default CheckboxItemBase;
export {CheckboxItemBase as CheckboxItem, CheckboxItemBase};
