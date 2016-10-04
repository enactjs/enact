import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';
import {contextTypes} from '@enact/i18n/I18nDecorator';

import Item from '../Item';
import Icon from '../Icon';

import css from './ToggleItem.less';

const ToggleItemBase = kind({
	name: 'ToggleItem',

	propTypes: {
		/**
		 * Children is a string to display.
		 *
		 * @type {string}
		 * @public
		 */
		children: PropTypes.string.isRequired,

		/**
		 * Value of checked property. True will show checked icon, false will not
		 *
		 * @type {boolean}
		 * @public
		 */
		checked: PropTypes.bool,

		/**
		 * When `true`, the ToggleItem is shown as disabled and does not
		 * generate tap events.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Icon property accepts a string or an Icon Element. This is the icon that
		 * will display when checked.
		 *
		 * @type {String}
		 * @public
		 */
		icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

		/**
		 * CSS classes for Icon
		 *
		 * @type {String}
		 * @public
		 */
		iconClasses: PropTypes.string,

		/**
		 * Display component inline
		 *
		 * @type {Boolean}
		 * @public
		 */
		inline: PropTypes.bool,

		/**
		 * Function that fires onToggle event/callback.
		 *
		 * @type {Function}
		 * @public
		 */
		onToggle: PropTypes.func,

		/**
		 * Value is a property that gets sent on an onToggle event.
		 *
		 * @type {Any}
		 * @public
		 */
		value: PropTypes.any
	},

	styles: {
		css,
		className: 'toggleItem'
	},

	computed: {
		className: ({inline, styler}) => styler.append({inline}),
		icon: ({checked, icon, iconClasses, styler}) => {
			if (React.isValidElement(icon)) {
				return icon;
			}

			return <Icon className={styler.join(css.icon, iconClasses, {checked})}>{icon}</Icon>;
		},
		onToggle: ({onToggle, onClick, checked, value}) => {
			if (onToggle || onClick) {
				return (ev) => {
					if (onToggle) onToggle({checked: !checked, value});
					if (onClick) onClick(ev);
				};
			}
		}
	},

	render: ({children, icon, onToggle, ...rest}, {rtl}) => {
		delete rest.iconClasses;
		delete rest.inline;

		return (
			<Item {...rest} onClick={onToggle} style={{direction: rtl ? 'rtl' : 'ltr'}}>
				{icon}
				{children}
			</Item>
		);
	}
});

ToggleItemBase.contextTypes = contextTypes;

export default ToggleItemBase;
export {ToggleItemBase as ToggleItem, ToggleItemBase};
