import {hoc, kind} from '@enact/core';
import React from 'react';

import {Router, propTypes, toSegments} from './Router';

/**
 * Adds support for Routes as children of Panels which are selected via `path` instead of the usual
 * flat array of Panels.
 *
 * @class Routable
 * @memberof moonstone/Panels
 * @hoc
 * @public
 */
const Routable = hoc((config, Wrapped) => kind({
	name: 'Routable',

	propTypes: /** @lends moonstone/Panels.Routable.prototype */ {
		/**
		 * Path of this element.
		 *
		 * May either be a URI-style path (`'/app/home/settings'`) or an array
		 * of strings (`['app', 'home', 'settings']`)
		 *
		 * @type {String|String[]}
		 * @public
		 */
		path: propTypes.path.isRequired,

		/**
		 * Decorates payload with path for `index`
		 *
		 * @type {Function}
		 */
		onSelectBreadcrumb: React.PropTypes.func
	},

	computed: {
		// Determines the `index` as 1 less than the number of segments in the path
		index: ({path}) => toSegments(path).length - 1,

		// Adds `path` to the payload of onSelectBreadcrumb in the same format (String, or String[])
		// as the current path prop.
		onSelectBreadcrumb: ({path, onSelectBreadcrumb: handler}) => {
			if (handler) {
				return ({index, ...rest}) => {
					const p = toSegments(path).slice(0, index + 1);
					handler({
						...rest,
						index,
						path: Array.isArray(path) ? p : '/' + p.join('/')
					});
				};
			}
		}
	},

	render: ({children, index, path, ...rest}) => (
		<Router {...rest} path={path} component={Wrapped} index={index}>
			{children}
		</Router>
	)
}));

export default Routable;
export {Routable};
