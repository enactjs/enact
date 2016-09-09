import kind from 'enact-core/kind';
import React, {PropTypes} from 'react';

import css from './Divider.less';

// From enyo/utils
/**
* Capitalizes a given string.
*
* @param {String} str - The string to capitalize.
* @returns {String} The capitalized string.
* @public
*/
const cap = function (str) {
	return str.slice(0, 1).toUpperCase() + str.slice(1);
};

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
