import kind from 'enact-core/kind';
import React, {PropTypes} from 'react';

import Button from '../Button';
import Icon from '../Icon';

import css from './IconButton.less';

const IconButton = kind({
	name: 'IconButton',

	propTypes: {
		...Button.propTypes,
		children: PropTypes.string.isRequired
	},

	styles: {
		css,
		className: 'iconButton'
	},

	render: ({children, small, ...rest}) => {
		return (
			<Button {...rest} small={small} minWidth={false}>
				<Icon small={small} className={css.icon}>{children}</Icon>
			</Button>
		);
	}
});

export default IconButton;
export {IconButton, IconButton as IconButtonBase};
