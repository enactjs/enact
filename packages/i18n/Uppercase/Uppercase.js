/**
 * Exports the {@link i18n/Uppercase.Uppercase} Higher-Order Component (HOC)
 *
 * @module i18n/Uppercase
 */

import {kind, hoc} from '@enact/core';
import React from 'react';

import {toUpperCase} from '../';

/**
 * {@link i18n/Uppercase.Uppercase} is a Higher Order Component that is used to wrap
 * an element to provide locale-aware uppercasing of `children`, provided that `children` is a single
 * string. Other values for `children` are unchanged. It supports a `preserveCase` property which can be
 * used to override the uppercase as-needed.
 *
 * There are no configurable options on this HOC.
 *
 * @class Uppercase
 * @memberof i18n/Uppercase
 * @public
 */
const Uppercase = hoc((config, Wrapped) => kind({
	propTypes: /** @lends i18n/Uppercase.Uppercase.prototype */ {
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
					return toUpperCase(content);
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
