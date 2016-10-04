import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import Button from '../Button';
import Icon from '../Icon';

import css from './IconButton.less';

const IconButtonBase = kind({
	name: 'IconButton',

	propTypes: {
		...Button.propTypes,
		children: PropTypes.string.isRequired,
		src: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
	},

	styles: {
		css,
		className: 'iconButton'
	},

	computed: {
		className: ({small, styler}) => styler.append({small})
	},

	render: ({children, small, src, ...rest}) => {
		return (
			<Button {...rest} small={small} minWidth={false}>
				<Icon small={small} className={css.icon} src={src}>{children}</Icon>
			</Button>
		);
	}
});

export default IconButtonBase;
export {IconButtonBase as IconButton, IconButtonBase};
