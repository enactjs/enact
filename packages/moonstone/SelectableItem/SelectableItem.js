import kind from 'enact-core/kind';
import React from 'react';

import {ToggleItemBase} from '../ToggleItem';

import css from './SelectableItem.less';

const SelectableItem = kind({
	name: 'SelectableItem',

	propTypes: ToggleItemBase.propTypes,

	defaultProps: ToggleItemBase.defaultProps,

	styles: {css},

	computed: {
		iconClasses: ({checked, styler}) => styler.join(
			css.dot,
			{checked}
		)
	},

	render: (props) => (
		<ToggleItemBase {...props} icon="circle" />
	)
});

export default SelectableItem;
export {SelectableItem, SelectableItem as SelectableItemBase};
