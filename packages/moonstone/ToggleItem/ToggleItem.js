/**
 * A Moonstone-themed [Item]{@link moonstone/Item} used as the basis for other stylized toggle item
 * components.
 *
 * Note: This is not intended to be used directly, but should be extended by a component that will
 * customize this component's appearance by supplying an
 * [iconComponent prop]{@link moonstone/ToggleItem.ToggleItemBase#iconComponent}.
 *
 * @example
 * <ToggleItem
 * 	iconComponent={Checkbox}
 * 	iconPosition='before'>
 * 	Toggle me
 * </ToggleItem>
 *
 * @module moonstone/ToggleItem
 * @exports ToggleItem
 * @exports ToggleItemBase
 * @exports ToggleItemDecorator
 */

import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import Pure from '@enact/ui/internal/Pure';
import React from 'react';
import PropTypes from 'prop-types';
import {ToggleItemBase as UiToggleItem, ToggleItemDecorator as UiToggleItemDecorator} from '@enact/ui/ToggleItem';
import Spottable from '@enact/spotlight/Spottable';
import compose from 'ramda/src/compose';

import {MarqueeDecorator} from '../Marquee';
import Skinnable from '../Skinnable';
import {SlotItemBase} from '../SlotItem';

import componentCss from './ToggleItem.less';

/**
 * A Moonstone-styled toggle [Item]{@link moonstone/Item} without any behavior.
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
		 * The content to be displayed as the main content of the toggle item.
		 *
		 * @type {Node}
		 * @required
		 * @public
		 */
		children: PropTypes.node.isRequired,

		/**
		 * The icon component to render in this item.
		 *
		 * This component receives the `selected` prop and value, and must therefore respond to it in some
		 * way. It is recommended to use [ToggleIcon]{@link moonstone/ToggleIcon} for this.
		 *
		 * @type {Component|Element}
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
		 * Overrides the icon of the `iconComponent` component.
		 *
		 * This accepts any string that the [Icon]{@link moonstone/Icon.Icon} component supports,
		 * provided the recommendations of `iconComponent` are followed.
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
				component={SlotItemBase}
				css={props.css}
			/>
		);
	}
});

/**
 * Default config for {@link moonstone/ToggleItem.ToggleItemDecorator}.
 *
 * @memberof moonstone/ToggleItem.ToggleItemDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Invalidate the distance of marquee text if any property (like 'inline') changes.
	 * Expects an array of props which on change trigger invalidateMetrics.
	 *
	 * @type {Array}
	 * @default ['inline']
	 * @memberof moonstone/ToggleItem.ToggleItemDecorator.defaultConfig
	 */
	invalidateProps: ['inline']
};

/**
 * Adds interactive functionality to `ToggleItemBase`.
 *
 * @class ToggleItemDecorator
 * @memberof moonstone/ToggleItem
 * @mixes ui/ToggleItem.ToggleItemDecorator
 * @mixes spotlight/Spottable.Spottable
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @mixes moonstone/Skinnable
 * @hoc
 * @public
 */
const ToggleItemDecorator = hoc(defaultConfig, ({invalidateProps}, Wrapped) => {
	return compose(
		Pure,
		UiToggleItemDecorator,
		Spottable,
		MarqueeDecorator({className: componentCss.content, invalidateProps}),
		Skinnable
	)(Wrapped);
});

/**
 * A Moonstone-styled item with built-in support for toggling, marqueed text, and `Spotlight` focus.
 *
 * This is not intended to be used directly, but should be extended by a component that will
 * customize this component's appearance by supplying an `iconComponent` prop.
 *
 * @class ToggleItem
 * @memberof moonstone/ToggleItem
 * @extends moonstone/ToggleItem.ToggleItemBase
 * @mixes moonstone/ToggleItem.ToggleItemDecorator
 * @ui
 * @public
 */
const ToggleItem = ToggleItemDecorator(ToggleItemBase);

/**
 * The Icon to render in this item.
 *
 * This component receives the `selected` prop and value, and must therefore respond to it in some
 * way. It is recommended to use [ToggleIcon]{@link moonstone/ToggleIcon} for this.
 *
 * @name iconComponent
 * @memberof moonstone/ToggleItem.ToggleItem.prototype
 * @type {Component|Element}
 * @default null
 * @required
 * @public
 */

export default ToggleItem;
export {
	ToggleItem,
	ToggleItemBase,
	ToggleItemDecorator
};
