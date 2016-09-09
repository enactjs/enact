import {kind, hoc} from 'enact-core';
import React from 'react';

const Uppercase = hoc((config, Wrapped) => kind({
	propTypes: {
		/**
		 * The children string will be uppercased, unless this is set to true.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		preserveCase: React.PropTypes.bool
	},

	defaultProps: {
		preserveCase: false
	},

	computed: {
		children: ({children, preserveCase}) => {
			if (!preserveCase && React.Children.count(children) === 1) {
				const content = React.Children.toArray(children)[0];
				if (typeof content == 'string') {
					return content.toUpperCase();
				}
			}
			return children;
		}
	},

	render: (props) => {
		delete props.preserveCase;
		return (
			<Wrapped {...props} />
		);
	}
}));

export default Uppercase;
export {Uppercase};
