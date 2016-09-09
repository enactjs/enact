import React from 'react';
import kind from 'enyo-core/kind';
import Toggleable from 'enyo-ui/Toggleable';

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

const CheckboxItem = Toggleable({prop: 'checked'}, CheckboxItemBase);

export default CheckboxItem;
export {CheckboxItem, CheckboxItemBase};
