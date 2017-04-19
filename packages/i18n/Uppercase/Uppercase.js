/**
 * Exports the {@link i18n/Uppercase.Uppercase} Higher-Order Component (HOC)
 *
 * @module i18n/Uppercase
 */

import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import {toCapitalized, toUpperCase, toWordCase} from '../util';

const defaultConfig = {
	sentenceCase: false,
	wordCase: false
};

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
 * @hoc
 * @public
 */
const Uppercase = hoc(defaultConfig, (config, Wrapped) => kind({
	name: 'Uppercase',

	propTypes: /** @lends i18n/Uppercase.Uppercase.prototype */ {
		/**
		 * The children string will be uppercased, unless this is set to true.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		preserveCase: PropTypes.bool
	},

	defaultProps: {
		preserveCase: false
	},

	computed: {
		children: ({children, preserveCase}) => {
			if (!preserveCase && React.Children.count(children) === 1) {
				const content = React.Children.toArray(children)[0];
				if (typeof content == 'string') {
					if (config.wordCase) {
						return toWordCase(content);
					} else if (config.sentenceCase) {
						return toCapitalized(content);
					} else {
						return toUpperCase(content);
					}
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
