import kind from 'enact-core/kind';
import React, {PropTypes} from 'react';

import Item from '../Item';
import Icon from '../Icon';

import css from './ToggleItem.less';

const ToggleItemBase = kind({
	name: 'ToggleItem',

	propTypes: {
		children: PropTypes.string.isRequired,
		checked: PropTypes.bool,
		disabled: PropTypes.bool,
		icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
		iconClasses: PropTypes.string,
		inline: PropTypes.bool
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
		}
	},

	render: ({icon, children, ...rest}) => {
		delete rest.iconClasses;
		delete rest.inline;

		return (
			<Item {...rest}>
				{icon}
				{children}
			</Item>
		);
	}
});

export default ToggleItemBase;
export {ToggleItemBase as ToggleItem, ToggleItemBase};
