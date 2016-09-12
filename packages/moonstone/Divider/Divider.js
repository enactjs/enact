import kind from 'enact-core/kind';
import {cap} from 'enact-core/util';
import React, {PropTypes} from 'react';

import css from './Divider.less';

const Divider = kind({
	name: 'Divider',

	propTypes: {
		/**
		 * Set the content of the divider.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		children: PropTypes.string.isRequired
	},

	styles: {
		css,
		className: 'divider'
	},

	computed: {
		content: ({children}) => children.split(' ').map(cap).join(' ')
	},

	render: ({content, ...rest}) => (
		<h3 {...rest}>{content}</h3>
	)
});

export default Divider;
export {Divider, Divider as DividerBase};
