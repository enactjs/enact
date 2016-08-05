import kind from 'enyo-core/kind';
import React, {PropTypes} from 'react';

import css from './Header.less';

const Header = kind({
	name: 'Header',

	propTypes: {
		children: PropTypes.string.isRequired,
		subTitleBelow: PropTypes.string,
		titleAbove: PropTypes.string,
		titleBelow: PropTypes.string,
		uppercase: PropTypes.bool
	},

	defaultProps: {
		uppercase: true
	},

	styles: {
		css,
		classes: 'header'
	},

	render: ({children, classes, subTitleBelow, titleAbove, titleBelow, uppercase, ...rest}) => (
		<div {...rest} className={classes}>
			{titleAbove ? <div>{titleAbove}</div> : null}
			<h1>{uppercase ? children.toUpperCase() : children}</h1>
			{titleBelow ? <div>{titleBelow}</div> : null}
			{subTitleBelow ? <div>{subTitleBelow}</div> : null}
		</div>
	)
});

export default Header;
export {Header, Header as HeaderBase};
