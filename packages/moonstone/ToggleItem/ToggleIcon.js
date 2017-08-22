import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
// import {diffClasses} from '@enact/ui/MigrationAid';
import React from 'react';
import {ToggleIconFactory as UiToggleIconFactory} from '@enact/ui/ToggleItem';
import {IconFactory} from '../Icon';

import componentCss from './ToggleItem.less';

/**
 * A factory for customizing the visual style of [ToggleIconBase]{@link moonstone/ToggleItem.ToggleIconBase}.
 *
 * @class ToggleIconBaseFactory
 * @memberof moonstone/ToggleItem
 * @factory
 * @public
 */
const ToggleIconBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon ToggleIcon', componentCss, css);

	const UiToggleIcon = UiToggleIconFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/ToggleItem.ToggleIconFactory.prototype */ {
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

/**
 * A stateless [ToggleIcon]{@link moonstone/ToggleItem.ToggleIcon}, with no HOCs applied.
 *
 * @class ToggleIconBase
 * @extends ui/ToggleIcon.ToggleIconBase
 * @memberof moonstone/ToggleItem
 * @ui
 * @public
 */
const ToggleIconBase = ToggleIconBaseFactory();

/**
 * A factory for customizing the visual style of [ToggleIcon]{@link moonstone/ToggleItem.ToggleIcon}.
 * @see {@link moonstone/ToggleItem.ToggleIconBaseFactory}.
 *
 * @class ToggleIconFactory
 * @memberof moonstone/ToggleItem
 * @factory
 * @public
 */

/**
 * A ready-to-use {@link ui/ToggleIcon}.
 *
 * @class ToggleIcon
 * @memberof moonstone/ToggleItem
 * @extends moonstone/ToggleItem.ToggleIconBase
 * @ui
 * @public
 */

export default ToggleIconBase;
export {
	ToggleIconBase as ToggleIcon,
	ToggleIconBase,
	ToggleIconBaseFactory as ToggleIconFactory,
	ToggleIconBaseFactory
};

