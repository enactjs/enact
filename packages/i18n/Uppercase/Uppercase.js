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

/**
 * Default config for {@link i18n/Uppercase.Uppercase}.
 *
 * @memberof i18n/Uppercase
 * @hocconfig
 * @public
 */
const defaultConfig = {
	/**
	 * Configures the mode of uppercasing that should be preformed. Options are:
	 *   'all' to capitalize all characters.
	 *   'word' to capitalize the first letter of each word.
	 *   'sentence' to capitalize the first letter of the string.
	 *
	 * @type {String}
	 * @default 'all'
	 * @memberof i18n/Uppercase.defaultConfig
	 * @public
	 */
	case: 'all'
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
					switch (config.case) {
						case 'word':
							return toWordCase(content);
						case 'sentence':
							return toCapitalized(content);
						default:
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
