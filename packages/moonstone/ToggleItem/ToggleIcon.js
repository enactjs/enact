/**
* Exports the {@link moonstone/ToggleIcon.ToggleIcon} and {@link moonstone/ToggleIcon.ToggleIconBase}
* components.  The default export is {@link moonstone/ToggleIcon.ToggleIconBase}.
*
* @module moonstone/ToggleIcon
*/

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
// import {diffClasses} from '@enact/ui/MigrationAid';
import React from 'react';
import {ToggleIconFactory as UiToggleIconFactory} from '@enact/ui/ToggleItem';
import {IconFactory} from '../Icon';

import componentCss from './ToggleItem.less';

/**
* {@link moonstone/ToggleIcon.ToggleIconFactory} is Factory wrapper around
* {@link moonstone/ToggleIcon.ToggleIcon} that allows overriding certain classes of the base
* `Button` component at design time. See {@link moonstone/Button.ButtonBaseFactory}.
*
* @class ToggleIconFactory
* @memberof moonstone/ToggleIcon
* @factory
* @private
*/
const ToggleIconBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon ToggleIcon', componentCss, css);

	const UiToggleIcon = UiToggleIconFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/ToggleIcon.ToggleIconFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			ToggleIcon: css.ToggleIcon
		}
	});
	const Icon = IconFactory({css});

	/**
	 * Utility component to render the {@link moonstone/Icon.Icon} for
	 * {@link moonstone/ToggleItem.ToggleItem}.
	 *
	 * @class ToggleIcon
	 * @memberof moonstone/ToggleItem
	 * @ui
	 * @private
	 */
	return kind({
		name: 'MoonstoneToggleIcon',

		styles: {
			css: css,
			className: 'icon'
		},

		render: (props) => {
			return (
				<UiToggleIcon {...props} Icon={Icon} />
			);
		}
	});
});

const ToggleIconBase = ToggleIconBaseFactory();

export default ToggleIconBase;
export {
	ToggleIconBase as ToggleIcon,
	ToggleIconBase,
	ToggleIconBaseFactory as ToggleIconFactory,
	ToggleIconBaseFactory
};

