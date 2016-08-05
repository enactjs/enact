import kind from 'enyo-core/kind';
import Toggleable from 'enyo-ui/Toggleable';
import React from 'react';

import {ToggleItemBase} from '../ToggleItem';
import Switch from '../Switch';

import css from './SwitchItem.less';

const SwitchItemBase = kind({
	name: 'SwitchItem',

	propTypes: ToggleItemBase.propTypes,

	defaultProps: ToggleItemBase.defaultProps,

	styles: {
		css,
		classes: 'switchItem'
	},

	computed: {
		iconElem: ({checked, disabled}) => (
			<Switch checked={checked} disabled={disabled} className={css.switch} />
		)
	},

	render: ({classes, iconElem, ...rest}) => (
		<ToggleItemBase {...rest} className={classes} icon={iconElem} />
	)
});

const SwitchItem = Toggleable({prop: 'checked'}, SwitchItemBase);

export default SwitchItem;
export {SwitchItem, SwitchItemBase};
