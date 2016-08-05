import kind from 'enyo-core/kind';
import Toggleable from 'enyo-ui/Toggleable';
import React from 'react';

import {ToggleItemBase} from '../ToggleItem';

import css from './RadioItem.less';

const RadioItemBase = kind({
	name: 'RadioItem',

	propTypes: ToggleItemBase.propTypes,

	defaultProps: ToggleItemBase.defaultProps,

	styles: {
		css,
		classes: 'radioItem'
	},

	computed: {
		iconClasses: ({checked, styler}) => styler.join(
			css.dot,
			{checked}
		)
	},

	render: ({classes, ...rest}) => (
		<ToggleItemBase {...rest} className={classes} icon=" " multi={false} />
	)
});

const RadioItem = Toggleable({prop: 'checked'}, RadioItemBase);

export default RadioItem;
export {RadioItem, RadioItemBase};
