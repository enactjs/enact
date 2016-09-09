import kind from 'enact-core/kind';
import Toggleable from 'enact-ui/Toggleable';
import React from 'react';

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

const SelectableItem = Toggleable({prop: 'checked'}, SelectableItemBase);

export default SelectableItem;
export {SelectableItem, SelectableItemBase};
