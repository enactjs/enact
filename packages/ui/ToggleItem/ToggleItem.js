/**
 * Provides Moonstone-themed toggle item components and behaviors. This is not intended to be used
 * directly, but should be extended by a component that will customize this component's appearance
 * by supplying an [iconComponent prop]{@link ui/ToggleItem.ToggleItemBase#iconComponent}.
 *
 * @module ui/ToggleItem
 * @exports ToggleItem
 * @exports ToggleItemBase
 * @exports ToggleItemDecorator
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';

import ComponentOverride from '../ComponentOverride';
import Toggleable from '../Toggleable';
import {RemeasurableDecorator} from '../Remeasurable';
import Touchable from '../Touchable';

import componentCss from './ToggleItem.less';

// eslint-disable-next-line
const iconCreator = (position) => ({disabled, icon, iconComponent, selected, iconPosition}) => {
	if (iconPosition === position) {
		return (
			<ComponentOverride
				component={iconComponent}
				disabled={disabled}
				selected={selected}
			>
				{icon}
			</ComponentOverride>
		);
	}
};

/**
 * A minimally styled toggle item without any behavior, ripe for extension.
 *
 * @class ToggleItemBase
 * @memberof ui/ToggleItem
 * @ui
 * @public
 */
const ToggleItemBase = kind({
	name: 'ui:ToggleItem',

	propTypes: /** @lends ui/ToggleItem.ToggleItemBase.prototype */ {
		/**
		 * The string to be displayed as the main content of the toggle item.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		children: PropTypes.node.isRequired,

		/**
		 * The type of component to use to render as root element. This receives the `css` prop for
		 * theme extension and therefore must be a custom component and not a simple HTML DOM node.
		 * Recommended component or themed derivitive: [SlotItem]{@link ui/SlotItem.SlotItem}
		 *
		 * @type {Component}
		 * @required
		 * @public
		 */
		component: PropTypes.func.isRequired,

		/**
		 * The Icon to render in this item. This component receives the `selected` prop and value,
		 * and must therefore respond to it in some way. It is recommended to use
		 * [ToggleIcon]{@link ui/ToggleIcon} for this.
		 *
		 * @type {Component}
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
		 * Applies a disabled visual state to the toggle item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * An optional prop that lets you override the icon of the `iconComponent` component.
		 * This accepts any string that the [Icon]{@link ui/Icon.Icon} component supports, provided
		 * the recommendations of `iconComponent` are followed.
		 *
		 * @type {String|Object}
		 * @public
		 */
		icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

		/**
		 * Specifies on which side (`before` or `after`) of the text the icon appears.
		 *
		 * @type {String}
		 * @default 'before'
		 * @public
		 */
		iconPosition: PropTypes.oneOf(['before', 'after']),

		/**
		 * The handler to run when the toggle item is toggled. Developers should
		 * generally use `onToggle` instead.
		 *
		 * @type {Function}
		 */
		onTap: PropTypes.func,

		/**
		 * The handler to run when the toggle item is toggled.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {String} event.selected - Selected value of item.
		 * @param {*} event.value - Value passed from `value` prop.
		 * @public
		 */
		onToggle: PropTypes.func,

		/**
		 * Applies the provided `icon` when the this is `true`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * The value that will be sent to the `onToggle` handler.
		 * @type {*}
		 * @default null
		 * @public
		 */
		value: PropTypes.any
	},

	defaultProps: {
		disabled: false,
		iconPosition: 'before',
		selected: false,
		value: null
	},

	styles: {
		css: componentCss,
		className: 'toggleItem',
		publicClassNames: true
	},

	computed: {
		slotBefore: iconCreator('before'),
		slotAfter: iconCreator('after')
	},

	render: ({component: Component, css, children, onToggle, selected, ...rest}) => {
		delete rest.iconComponent;
		delete rest.iconPosition;
		delete rest.value;

		return (
			<Component
				role="checkbox"
				{...rest}
				css={css}
				aria-checked={selected}
				onTap={onToggle}
			>
				{children}
			</Component>
		);
	}
});

/**
 * Adds interactive functionality to `ToggleItemBase`
 *
 * @class ToggleItemDecorator
 * @memberof ui/ToggleItem
 * @mixes ui/Remeasurable.RemeasurableDecorator
 * @mixes ui/Touchable.Touchable
 * @mixes ui/Toggleable.Toggleable
 * @hoc
 * @public
 */
const ToggleItemDecorator = compose(
	RemeasurableDecorator({trigger: 'selected'}),
	Touchable,
	Toggleable
);

/**
 * A Moonstone-styled item with built-in support for toggling, marqueed text, and `Spotlight` focus.
 *
 * Usage:
 * ```
 * <ToggleItem icon="lock" iconPosition="before">Toggle Me</ToggleItem>
 * ```
 *
 * @class ToggleItem
 * @memberof ui/ToggleItem
 * @extends ui/ToggleItem.ToggleItemBase
 * @mixes ui/ToggleItem.ToggleItemDecorator
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
