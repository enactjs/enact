import kind from 'enyo-core/kind';
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
		classes: 'iconButton'
	},

	render: ({children, classes, small, ...rest}) => {
		return (
			<Button {...rest} className={classes} small={small} minWidth={false}>
				<Icon small={small} className={css.icon}>{children}</Icon>
			</Button>
		);
	}
});

export default IconButton;
export {IconButton, IconButton as IconButtonBase};
