/**
 * Exports the {@link ui/RadioItem.RadioItem} component.
 *
 * @module ui/RadioItem
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import UiToggleItem from '../ToggleItem';

import componentCss from './RadioItem.less';


/**
 * {@link ui/RadioItem.RadioItemBaseFactory} is Factory wrapper around {@link ui/RadioItem.RadioItemBase}
 * that allows overriding certain classes at design time. The following are properties of the `css`
 * member of the argument to the factory.
 *
 * @class RadioItemBaseFactory
 * @memberof ui/RadioItem
 * @factory
 * @ui
 * @public
 */
const RadioItemBaseFactory = factory({css: componentCss}, ({css}) => {
	/**
	 * {@link ui/RadioItem.RadioItemBase} is a component that
	 * combines a Toggleable radio selector and an Item. It has two selected states
	 * `true` & `false`.
	 *
	 * @class RadioItemBase
	 * @memberof ui/RadioItem
	 * @ui
	 * @public
	 */
	return kind({
		name: 'RadioItem',

		propTypes: /** @lends ui/RadioItem.RadioItemBase.prototype */ {
			/**
			 * The string to be displayed as the main content of the radio item.
			 *
			 * @type {String}
			 * @public
			 */
			children: PropTypes.string.isRequired,

			/**
			 * Applies a disabled visual state to the radio item.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * Applies inline styling to the radio item.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			inline: PropTypes.bool,

			/**
			 * The handler to run when the radio item is toggled.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @param {String} event.selected - Selected value of item.
			 * @param {*} event.value - Value passed from `value` prop.
			 * @public
			 */
			onToggle: PropTypes.func,

			/**
			 * Applies a filled circle icon to the radio item.
			 *
			 * @type {Boolean}
			 * @public
			 */
			selected: PropTypes.bool,

			/**
			 * The ToggleItem component to use as the basis for this component.
			 *
			 * @type {Component}
			 * @default {@link ui/ToggleItem}
			 * @public
			 */
			ToggleItem: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

			/**
			 * The value that will be sent to the `onToggle` handler.
			 *
			 * @type {*}
			 * @default ''
			 * @public
			 */
			value: PropTypes.any
		},

		defaultProps: {
			disabled: false,
			inline: false,
			ToggleItem: UiToggleItem,
			value: ''
		},

		styles: {
			css,
			className: 'radioItem'
		},

		computed: {
			icon: ({selected, styler}) => {
				const className = styler.join(css.dot, {selected});

				return (
					<div className={className} />
				);
			}
		},

		render: ({ToggleItem, ...rest}) => (
			<ToggleItem {...rest} />
		)
	});
});


/**
 * {@link ui/RadioItem.RadioItem} is a component that combines a
 * {@link ui/Toggleable.Toggleable} radio selector and an Item. It has two selected states `true` &
 * `false`.
 *
 * By default, `RadioItem` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onToggle` events.
 *
 * @class RadioItem
 * @memberof ui/RadioItem
 * @mixes ui/Toggleable.Toggleable
 * @ui
 * @public
 */
const RadioItemBase = RadioItemBaseFactory();

export default RadioItemBase;
export {
	RadioItemBase as RadioItem,
	RadioItemBase,
	RadioItemBaseFactory as RadioItemFactory,
	RadioItemBaseFactory
};
