/**
 * Provides Moonstone-themed toggle item components and behaviors. This is not intended to be used
 * directly, but should be extended by a component that will customize this component's appearance
 * by supplying an [iconComponent prop]{@link moonstone/ToggleItem.ToggleItemBase#iconComponent}.
 *
 * @module moonstone/ToggleItem
 * @exports ToggleItem
 * @exports ToggleItemBase
 * @exports ToggleItemDecorator
 */

import kind from '@enact/core/kind';
import Pure from '@enact/ui/internal/Pure';
import React from 'react';
import PropTypes from 'prop-types';
import UiToggleItem from '@enact/ui/ToggleItem';

import SlotItem from '../SlotItem';

import componentCss from './ToggleItem.less';

/**
 * A moonstone-styled toggle item without any behavior.
 *
 * @class ToggleItemBase
 * @memberof moonstone/ToggleItem
 * @ui
 * @public
 */
const ToggleItemBase = kind({
	name: 'ToggleItem',

	propTypes: /** @lends moonstone/ToggleItem.ToggleItemBase.prototype */ {
		/**
		 * The string to be displayed as the main content of the toggle item.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		children: PropTypes.node.isRequired,

		/**
		 * The Icon to render in this item. This component receives the `selected` prop and value,
		 * and must therefore respond to it in some way. It is recommended to use the
		 * [ToggleIcon]{@link moonstone/ToggleIcon} for this.
		 *
		 * @type {Component}
		 * @default null
		 * @required
		 * @public
		 */
		iconComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.func]).isRequired,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `toggleItem` - The root class name
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * An optional prop that lets you override the icon of the `iconComponent` component.
		 * This accepts any string that the [Icon]{@link moonstone/Icon.Icon} component supports,
		 * provided the recomendations of `iconComponent` are followed.
		 *
		 * @type {String}
		 * @public
		 */
		icon: PropTypes.string
	},

	styles: {
		css: componentCss,
		publicClassNames: ['toggleItem']
	},

	render: (props) => {

		return (
			<UiToggleItem
				role="checkbox"
				{...props}
				component={SlotItem}
				css={props.css}
			/>
		);
	}
});

/**
 * Adds interactive functionality to `ToggleItemBase`
 *
 * @class ToggleItemDecorator
 * @memberof moonstone/ToggleItem
 * @hoc
 * @public
 */
const ToggleItemDecorator = Pure;

/**
 * A Moonstone-styled item with built-in support for toggling, marqueed text, and `Spotlight` focus.
 *
 * Usage:
 * ```
 * <ToggleItem icon="lock" iconPosition="before">Toggle Me</ToggleItem>
 * ```
 *
 * @class ToggleItem
 * @memberof moonstone/ToggleItem
 * @extends moonstone/ToggleItem.ToggleItemBase
 * @mixes moonstone/ToggleItem.ToggleItemDecorator
 * @ui
 * @public
 */
const ToggleItem = ToggleItemDecorator(ToggleItemBase);

export default ToggleItem;
export {
	ToggleItem,
	ToggleItemBase,
	ToggleItemDecorator
};
