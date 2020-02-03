/**
 * Unstyled toggle item components and behaviors.
 *
 * This is not intended to be used directly, but should be extended by a component that will
 * customize this component's appearance by supplying an
 * [iconComponent prop]{@link ui/ToggleItem.ToggleItemBase#iconComponent}.
 *
 * @module ui/ToggleItem
 * @exports ToggleItem
 * @exports ToggleItemBase
 * @exports ToggleItemDecorator
 */

import kind from '@enact/core/kind';
import EnactPropTypes from '@enact/core/internal/prop-types';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React, {Fragment} from 'react';

import ComponentOverride from '../ComponentOverride';
import ForwardRef from '../ForwardRef';
import Toggleable from '../Toggleable';
import Touchable from '../Touchable';

import componentCss from './ToggleItem.module.less';

// eslint-disable-next-line enact/display-name,enact/prop-types
const iconCreator = (position) => ({disabled, icon, iconComponent, iconPosition, itemIcon, itemIconPosition, selected}) => {

	if (position === 'before') {
		return (
			<Fragment>
				{itemIconPosition === 'before' && itemIcon}
				{iconPosition === 'before' ?
					<ComponentOverride
						component={iconComponent}
						disabled={disabled}
						selected={selected}
					>
						{icon}
					</ComponentOverride> : null
				}
				{itemIconPosition === 'beforeChildren' && itemIcon}
			</Fragment>
		);
	} else {
		return (
			<Fragment>
				{itemIconPosition === 'afterChildren' && itemIcon}
				{iconPosition === 'after' ?
					<ComponentOverride
						component={iconComponent}
						disabled={disabled}
						selected={selected}
					>
						{icon}
					</ComponentOverride> : null
				}
				{itemIconPosition === 'after' && itemIcon}
			</Fragment>
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
		 * The main content of the toggle item.
		 *
		 * @type {Node}
		 * @required
		 * @public
		 */
		children: PropTypes.node.isRequired,

		/**
		 * The type of component to use to render as root element.
		 *
		 * This receives the `css` prop for theme extension and therefore must be a custom
		 * component and not a simple HTML DOM node. Recommended component or themed
		 * derivative: [SlotItem]{@link ui/SlotItem.SlotItem}
		 *
		 * @type {Component}
		 * @required
		 * @public
		 */
		component: EnactPropTypes.component.isRequired,

		/**
		 * The `Icon` to render in this item.
		 *
		 * This component receives the `selected` prop and value,
		 * and must therefore respond to it in some way. It is recommended to use
		 * [ToggleIcon]{@link ui/ToggleIcon} for this.
		 *
		 * @type {Component|Element}
		 * @required
		 * @public
		 */
		iconComponent: EnactPropTypes.componentOverride.isRequired,

		/**
		 * Called with a reference to [component]{@link ui/ToggleItem.ToggleItemBase#component}
		 *
		 * @type {Function}
		 * @private
		 */
		componentRef: PropTypes.func,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
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
		 *
		 * This accepts any string that the [Icon]{@link ui/Icon.Icon} component supports, provided
		 * the recommendations of `iconComponent` are followed.
		 *
		 * @type {String|Object}
		 * @public
		 */
		icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

		/**
		 * Specifies on which side (`'before'` or `'after'`) of `children` the icon appears.
		 *
		 * @type {('before'|'after')}
		 * @default 'before'
		 * @public
		 */
		iconPosition: PropTypes.oneOf(['before', 'after']),

		/**
		 * An additional customizable icon component.
		 *
		 * Supports more granular positioning rules. This should only be used *after* specifying the
		 * `icon` property, as the positioning for this offers the ability to place this in front of
		 * or behind the existing `icon`. See `itemIconPosition` for options.
		 *
		 * @type {Node}
		 * @public
		 */
		itemIcon: PropTypes.node,

		/**
		 * Specifies where `itemIcon` appears.
		 *
		 * * `'before'` - first element in the item
		 * * `'beforeChildren'` - before `children`. If `iconPosition` is `'before'`, `icon` will be
		 *	before `itemIcon`
		 * * `'afterChildren'` - after `children`. If iconPosition` is `'after'`, `icon` will be
		 *	after `itemIcon`
		 * * `'after'` - the last element in the item
		 *
		 * @type {('before'|'beforeChildren'|'afterChildren'|'after')}
		 * @default 'afterChildren'
		 * @public
		 */
		itemIconPosition: PropTypes.oneOf(['before', 'beforeChildren', 'afterChildren', 'after']),

		/**
		 * Called when the toggle item is toggled. Developers should generally use `onToggle` instead.
		 *
		 * @type {Function}
		 * @public
		 */
		onTap: PropTypes.func,

		/**
		 * Called when the toggle item is toggled.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {String} event.selected - Selected value of item.
		 * @param {*} event.value - Value passed from `value` prop.
		 * @public
		 */
		onToggle: PropTypes.func,

		/**
		 * Applies the provided `icon`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * The value that will be sent to the `onToggle` handler.
		 *
		 * @type {*}
		 * @default null
		 * @public
		 */
		value: PropTypes.any
	},

	defaultProps: {
		disabled: false,
		iconPosition: 'before',
		itemIconPosition: 'afterChildren',
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

	render: ({component: Component, componentRef, css, children, selected, ...rest}) => {
		delete rest.iconComponent;
		delete rest.iconPosition;
		delete rest.itemIcon;
		delete rest.itemIconPosition;
		delete rest.value;

		return (
			<Component
				ref={componentRef}
				role="checkbox"
				{...rest}
				css={css}
				aria-checked={selected}
			>
				{children}
			</Component>
		);
	}
});

/**
 * Adds interactive functionality to `ToggleItemBase`.
 *
 * @class ToggleItemDecorator
 * @memberof ui/ToggleItem
 * @mixes ui/ForwardRef.ForwardRef
 * @mixes ui/Touchable.Touchable
 * @mixes ui/Toggleable.Toggleable
 * @hoc
 * @public
 */
const ToggleItemDecorator = compose(
	ForwardRef({prop: 'componentRef'}),
	Toggleable({toggleProp: 'onTap', eventProps: ['value']}),
	Touchable
);

/**
 * An unstyled item with built-in support for toggling.
 *
 * Example:
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
