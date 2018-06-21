/**
 * Provide higher-order component interface for handling locale-aware uppercasing.
 *
 * @module i18n/Uppercase
 * @exports Uppercase
 */

import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import {toCapitalized, toUpperCase, toWordCase} from '../util';

/**
 * A higher-order component that is used to wrap an element to provide locale-aware uppercasing of
 * `children`, provided that `children` is a single string. Other values for `children` are
 * unchanged. It supports a `casing` property which can be used to override the uppercase as-needed.
 *
 * There are no configurable options on this HOC.
 *
 * @class Uppercase
 * @memberof i18n/Uppercase
 * @hoc
 * @public
 */
const Uppercase = hoc((config, Wrapped) => kind({
	name: 'Uppercase',

	propTypes: /** @lends i18n/Uppercase.Uppercase.prototype */ {
		/**
		 * Configures the mode of uppercasing that should be performed.
		 *
		 * Options are:
		 *   `'upper'` to capitalize all characters.
		 *   `'preserve'` to maintain the original casing.
		 *   `'word'` to capitalize the first letter of each word.
		 *   `'sentence'` to capitalize the first letter of the string.
		 *
		 * @type {String}
		 * @default 'upper'
		 * @public
		 */
		casing: PropTypes.oneOf(['upper', 'preserve', 'word', 'sentence'])
	},

	defaultProps: {
		casing: 'upper'
	},

	computed: {
		children: ({casing, children}) => {
			if (casing !== 'preserve' && React.Children.count(children) === 1) {
				const content = React.Children.toArray(children)[0];
				if (typeof content == 'string') {
					switch (casing) {
						case 'word':
							return toWordCase(content);
						case 'sentence':
							return toCapitalized(content);
						case 'upper':
							return toUpperCase(content);
					}
				}
			}
			return children;
		}
	},

	render: (props) => {
		delete props.casing;
		return (
			<Wrapped {...props} />
		);
	}
}));

export default Uppercase;
export {
	Uppercase
};
