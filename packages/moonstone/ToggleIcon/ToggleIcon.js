/**
 * Provides Moonstone-themed Icon component with interactive togglable capabilities.
 *
 * Moonstone components that uses `ToggleIcon`:
 * [Checkbox]{@link moonstone/Checkbox.Checkbox},
 * [FormCheckbox]{@link moonstone/FormCheckbox.FormCheckbox},
 * [Switch]{@link moonstone/Switch.Switch},
 * [the icon for RadioItem]{@link moonstone/RadioItem.RadioItem}, and
 * [the icon for SelectableItem]{@link moonstone/SelectableItem.SelectableItem}.
 *
 * @module moonstone/ToggleIcon
 * @example
 * <ToggleIcon
 * 	onToggle={(props)=> console.log(props.selected)}>
 * 	check
 * </ToggleIcon>
 * @exports ToggleIcon
 * @exports ToggleIconBase
 * @exports ToggleIconDecorator
 */

import kind from '@enact/core/kind';
import Pure from '@enact/ui/internal/Pure';
import UiToggleIcon from '@enact/ui/ToggleIcon';
import compose from 'ramda/src/compose';
import React from 'react';

import Icon from '../Icon';
import Skinnable from '../Skinnable';

/**
 * A component that indicates a boolean state.
 *
 * @class ToggleIconBase
 * @memberof moonstone/ToggleIcon
 * @extends ui/ToggleIcon.ToggleIcon
 * @ui
 * @public
 */
const ToggleIconBase = kind({
	name: 'ToggleIcon',

	render: (props) => {
		return (
			<UiToggleIcon {...props} iconComponent={Icon} />
		);
	}
});

/**
 * Moonstone-specific behaviors to apply to `ToggleIconBase`.
 *
 * @hoc
 * @memberof moonstone/ToggleIcon
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */
const ToggleIconDecorator = compose(
	Pure,
	Skinnable
);

/**
 * A customizable Moonstone starting point [Icon]{@link moonstone/Icon.Icon} that responds to the
 * `selected` prop.
 *
 * @class ToggleIcon
 * @memberof moonstone/ToggleIcon
 * @extends moonstone/ToggleIcon.ToggleIconBase
 * @mixes moonstone/ToggleIcon.ToggleIconDecorator
 * @ui
 * @public
 */
const ToggleIcon = ToggleIconDecorator(ToggleIconBase);

export default ToggleIcon;
export {
	ToggleIcon,
	ToggleIconBase,
	ToggleIconDecorator
};
