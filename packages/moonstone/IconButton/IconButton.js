import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import Button from '../Button';
import Icon from '../Icon';

import css from './IconButton.less';

const IconButtonBase = kind({
	name: 'IconButton',

	propTypes: {
		...Button.propTypes,
		children: PropTypes.string.isRequired
	},

	styles: {
		css,
		className: 'iconButton'
	},

	computed: {
		className: ({small, styler}) => styler.append({small})
	},

	render: ({children, small, ...rest}) => {
		return (
			<Button {...rest} small={small} minWidth={false} marqueeDisabled>
				<Icon small={small} className={css.icon}>{children}</Icon>
			</Button>
		);
	}
});

export default IconButtonBase;
export {IconButtonBase as IconButton, IconButtonBase};
