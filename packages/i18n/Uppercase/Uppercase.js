/**
 * Exports the {@link i18n/Uppercase.Uppercase} Higher-Order Component (HOC)
 *
 * @module i18n/Uppercase
 */

import deprecate from '@enact/core/internal/deprecate';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import {toCapitalized, toUpperCase, toWordCase} from '../util';

/**
 * {@link i18n/Uppercase.Uppercase} is a Higher Order Component that is used to wrap
 * an element to provide locale-aware uppercasing of `children`, provided that `children` is a single
 * string. Other values for `children` are unchanged. It supports a `casing` property which can be
 * used to override the uppercase as-needed.
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
		 * Configures the mode of uppercasing that should be performed. Options are:
		 *   `'upper'` to capitalize all characters.
		 *   `'preserve'` to maintain the original casing.
		 *   `'word'` to capitalize the first letter of each word.
		 *   `'sentence'` to capitalize the first letter of the string.
		 *
		 * @type {String}
		 * @default 'upper'
		 * @public
		 */
		casing: PropTypes.oneOf(['upper', 'preserve', 'word', 'sentence']),

		/**
		 * The children string will be uppercased, unless this is set to true.
		 *
		 * @type {Boolean}
		 * @default false
		 * @deprecated replaced by `casing`
		 * @public
		 */
		preserveCase: PropTypes.bool
	},

	defaultProps: {
		casing: 'upper',
		preserveCase: false
	},

	computed: {
		children: ({casing, children, preserveCase}) => {
			if (preserveCase) {
				deprecate({name: 'preserveCase', since: '1.1.0', replacedBy: 'casing'});
				casing = casing || preserveCase && 'preserve';
			}

			return (casing !== 'preserve') ? React.Children.map(children, (child) => {
				if (typeof child == 'string') {
					switch (casing) {
						case 'word':
							return toWordCase(child);
						case 'sentence':
							return toCapitalized(child);
						case 'upper':
							return toUpperCase(child);
					}
				} else {
					return child;
				}
			}) : children;
		}
	},

	render: (props) => {
		delete props.casing;
		delete props.preserveCase;
		return (
			<Wrapped {...props} />
		);
	}
}));

export default Uppercase;
export {Uppercase};
