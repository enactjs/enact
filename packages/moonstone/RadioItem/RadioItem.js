import kind from 'enact-core/kind';
import Toggleable from 'enact-ui/Toggleable';
import React from 'react';

import {ToggleItemBase} from '../ToggleItem';

import css from './RadioItem.less';

const RadioItemBase = kind({
	name: 'RadioItem',

	propTypes: ToggleItemBase.propTypes,

	defaultProps: ToggleItemBase.defaultProps,

	styles: {
		css,
		className: 'radioItem'
	},

	computed: {
		iconClasses: ({checked, styler}) => styler.join(
			css.dot,
			{checked}
		)
	},

	render: (props) => (
		<ToggleItemBase {...props} icon=" " multi={false} />
	)
});

const RadioItem = Toggleable({prop: 'checked'}, RadioItemBase);

export default RadioItem;
export {RadioItem, RadioItemBase};
