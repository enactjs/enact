import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';

import Icon from '../Icon';

import css from './Input.less';

const InputDecoratorIconBase = kind({
	name: 'InputDecoratorIcon',

	propTypes: {
		position: React.PropTypes.oneOf(['start', 'end']).isRequired,
		children: React.PropTypes.string
	},

	styles: {
		css,
		className: 'decoratorIcon'
	},

	computed: {
		className: ({position, styler}) => {
			return styler.append('icon' + (position === 'start' ? 'Start' : 'End'));
		}
	},

	render: ({children, ...rest}) => {
		delete rest.position;

		return children ? (
			<Icon {...rest}>{children}</Icon>
		) : null;
	}
});

const InputDecoratorIcon = onlyUpdateForKeys(['children'])(InputDecoratorIconBase);

export default InputDecoratorIcon;
export {
	InputDecoratorIcon,
	InputDecoratorIconBase
};
