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
import Toggleable from '@enact/ui/Toggleable';
import ToggleIcon from '@enact/ui/ToggleIcon';
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {RemeasurableDecorator} from '@enact/ui/Remeasurable';
import Touchable from '@enact/ui/Touchable';

import SlotItem from '../SlotItem';
import Touchable from '@enact/ui/Touchable';

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
		 * [ToggleIcon]{@link ui/ToggleIcon} for this.
		 *
		 * @type {String|Component}
		 * @default null
		 * @required
		 * @public
		 */
		iconComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `selected` - Applied to a `selected` toggle item
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

	computed: {
		iconBefore: ({icon, iconClasses, iconPosition, selected}) => {
			if (iconPosition === 'before') {
				return (
					<ToggleIcon slot="slotBefore" className={iconClasses} selected={selected}>
						{icon}
					</ToggleIcon>
				);
			}
		},
		iconAfter: ({icon, iconClasses, iconPosition, selected}) => {
			if (iconPosition === 'after') {
				return (
					<ToggleIcon slot="slotAfter" className={iconClasses} selected={selected}>
						{icon}
					</ToggleIcon>
				);
			}
		}
	},

	render: ({css, children, iconAfter, iconBefore, onToggle, selected, ...rest}) => {
		delete rest.iconComponent;
		delete rest.iconPosition;
		delete rest.value;

		return (
			<SlotItem
				role="checkbox"
				css={css}
				{...rest}
				aria-checked={selected}
				onTap={onToggle}
			>
				{iconBefore}
				{children}
				{iconAfter}
			</SlotItem>
		);
	}
});

/**
 * Adds interactive functionality to `ToggleItemBase`
 *
 * @class ToggleItemDecorator
 * @memberof moonstone/ToggleItem
 * @mixes ui/Toggleable.Toggleable
 * @hoc
 * @public
 */
const ToggleItemDecorator = compose(
	Pure,
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
