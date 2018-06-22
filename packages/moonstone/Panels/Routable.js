import hoc from '@enact/core/hoc';
import invariant from 'invariant';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import {Router, propTypes, toSegments} from './Router';

/**
 * Default config for [`Routable`]{@link moonstone/Panels.Routable}
 *
 * @memberof moonstone/Panels.Routable
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * The event callback invoked when navigating back up the path
	 *
	 * @type {Function}
	 * @required
	 * @memberof moonstone/Panels.Routable.defaultConfig
	 */
	navigate: null
};

/**
 * A Higher-order component that provides support for Routes as children of Panels which are
 * selected via `path` instead of the usual flat array of Panels. When using `Routable` you must
 * specify the `navigate` config option.
 *
 * @class Routable
 * @memberof moonstone/Panels
 * @hoc
 * @public
 */
const Routable = hoc(defaultConfig, (config, Wrapped) => {
	const {navigate} = config;

	invariant(navigate, 'navigate must be specified with Routable');

	return kind({
		name: 'Routable',

		propTypes: /** @lends moonstone/Panels.Routable.prototype */ {
			/**
			 * Path to the active panel
			 *
			 * May either be a URI-style path (`'/app/home/settings'`) or an array
			 * of strings (`['app', 'home', 'settings']`).
			 *
			 * @type {String|String[]}
			 * @required
			 * @public
			 */
			path: propTypes.path.isRequired,

			/**
			 * Decorates payload with path for `index`.
			 *
			 * @type {Function}
			 */
			[navigate]: PropTypes.func
		},

		handlers: {
			// Adds `path` to the payload of navigate handler in the same format (String, or String[])
			// as the current path prop.
			[navigate]: ({index, ...rest}, {path, [navigate]: handler}) => {
				if (handler) {
					const p = toSegments(path).slice(0, index + 1);
					handler({
						...rest,
						index,
						path: Array.isArray(path) ? p : '/' + p.join('/')
					});
				}
			}
		},

		computed: {
			// Determines the `index` as 1 less than the number of segments in the path
			index: ({path}) => toSegments(path).length - 1
		},

		render: ({children, index, path, ...rest}) => (
			<Router {...rest} path={path} component={Wrapped} index={index}>
				{children}
			</Router>
		)
	});
});

export default Routable;
export {Routable};
