/**
 * Provides Moonstone-themed Icon component with interactive toggleable capabilities. It's intended
 * as a fully do-it-yourself sort of component, as in initially, there is no visual change when a
 * user interacts with the control; you the developer must add and extend the mechanics by adding
 * visuals.
 *
 * The following Moonstone components use `ToggleIcon`, and make good examples of various usages.
 *
 * * [Checkbox]{@link moonstone/Checkbox.Checkbox},
 * * [FormCheckbox]{@link moonstone/FormCheckbox.FormCheckbox},
 * * [Switch]{@link moonstone/Switch.Switch},
 * * [RadioItem]{@link moonstone/RadioItem.RadioItem}, and
 * * [SelectableItem]{@link moonstone/SelectableItem.SelectableItem}.
 *
 * In the most common use-case, an [Icon]{@link moonstone/Icon.Icon} is necessary to be sent in as
 * `children`, however, not mandatory. The component, and styling classes, continue function
 * normally even without an icon. This quality allows you to do highly customizable styling by
 * attaching to the pseudo-elements `::before` and `::after` and save a DOM node, by adding styles
 * to the CSS exclucively.
 *
 * @example
 * <ToggleIcon onToggle={(props)=> console.log(props.selected)}>
 *   check
 * </ToggleIcon>
 *
 * @module moonstone/ToggleIcon
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
