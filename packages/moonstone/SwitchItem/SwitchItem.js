import kind from '@enact/core/kind';
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
		className: 'switchItem'
	},

	computed: {
		iconElem: ({checked, disabled}) => (
			<Switch checked={checked} disabled={disabled} className={css.switch} />
		)
	},

	render: ({iconElem, ...rest}) => (
		<ToggleItemBase {...rest} icon={iconElem} />
	)
});

export default SwitchItemBase;
export {SwitchItemBase as SwitchItem, SwitchItemBase};
