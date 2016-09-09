import kind from 'enyo-core/kind';
import Toggleable from 'enyo-ui/Toggleable';
import React, {PropTypes} from 'react';

import Item from '../Item';
import Icon from '../Icon';

import itemCss from '../Item/Item.less'; // TODO: incorrect styling?
import css from './ToggleItem.less';

const ToggleItemBase = kind({
	name: 'ToggleItem',

	propTypes: {
		children: PropTypes.string.isRequired,
		checked: PropTypes.bool,
		disabled: PropTypes.bool,
		icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
		iconClasses: PropTypes.string,
		inline: PropTypes.bool,
		multi: PropTypes.bool,
		name: PropTypes.string,
		onChange: PropTypes.func,
		value: PropTypes.string
	},

	defaultProps: {
		checked: false,
		disabled: false,
		inline: false,
		multi: true
	},

	styles: {
		css,
		className: 'toggleItem'
	},

	computed: {
		className: ({className, inline, styler}) => styler.append(
			itemCss.item,
			className,
			{inline}
		),
		iconElem: ({checked, icon, iconClasses, styler}) => (
			React.isValidElement(icon) ? icon : <Icon className={styler.join(css.icon, iconClasses, {checked})}>{icon}</Icon>
		),
		type: ({multi}) => (multi ? 'checkbox' : 'radio')
	},

	render: ({className, iconElem, children, ...rest}) => {
		delete rest.icon;
		delete rest.iconClasses;
		delete rest.inline;
		delete rest.multi;

		return (
			<Item tag="label" className={className} disabled={rest.disabled}>
				<input {...rest} />
				{iconElem}
				{children}
			</Item>
		);
	}
});

const ToggleItem = Toggleable({prop: 'checked'}, ToggleItemBase);

export default ToggleItem;
export {ToggleItem, ToggleItemBase};
