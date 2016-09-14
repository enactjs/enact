import kind from 'enact-core/kind';
import React from 'react';

import {ToggleItemBase} from '../ToggleItem';

import css from './RadioItem.less';

const RadioItem = kind({
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

export default RadioItem;
export {RadioItem, RadioItem as RadioItemBase};
