import React from 'react';
import kind from '@enact/core/kind';

import {ToggleItemBase} from '../ToggleItem';

import css from './SelectableItem.less';

const SelectableItemBase = kind({
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

export default SelectableItemBase;
export {SelectableItemBase as SelectableItem, SelectableItemBase};
