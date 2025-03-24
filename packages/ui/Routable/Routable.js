/**
 * Utilities for working with routes.
 *
 * @module ui/Routable
 * @exports Routable
 * @exports Route
 * @exports Link
 * @exports Linkable
 */

import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import invariant from 'invariant';
import PropTypes from 'prop-types';
import warning from 'warning';

import {Link, Linkable} from './Link';
import Route from './Route';
import Router from './Router';
import {RoutablePropTypes, toSegments, RouteContext, resolve} from './util';

/**
 * Default config for {@link ui/Routable.Routable|Routable}.
 *
 * @memberof ui/Routable.Routable
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * The event to listen to for path changes.
	 *
	 * This defines the actual name of the {@link ui/Routable.Routable.navigate|navigate}
	 * property.
	 *
	 * @type {String}
	 * @required
	 * @memberof ui/Routable.Routable.defaultConfig
	 */
	navigate: null
};

/**
 * A higher-order component that provides support for mapping Routes as children of a component
 * which are selected via `path` instead of the usual flat array.
 *
 * When using `Routable` you must specify the `navigate` config option.
 *
 * @class Routable
 * @memberof ui/Routable
 * @hoc
 * @public
 */
const Routable = hoc(defaultConfig, (config, Wrapped) => {
	const {navigate} = config;

	invariant(navigate, 'navigate must be specified with Routable');

	return kind({
		name: 'Routable',

		propTypes: /** @lends ui/Routable.Routable.prototype */ {
			/**
			 * Path to the active panel.
			 *
			 * May either be a URI-style path (`'/app/home/settings'`) or an array
			 * of strings (`['app', 'home', 'settings']`).
			 *
			 * @type {String|String[]}
			 * @required
			 * @public
			 */
			path: RoutablePropTypes.path.isRequired,

			/**
			 * Called when navigating.
			 *
			 * The event object is decorated to add `path`.
			 *
			 * *NOTE*: The actual name of this property is configured in the HOC config.
			 *
			 * @type {Function}
			 */
			[navigate]: PropTypes.func
		},

		handlers: {
			handleNavigate: ({path}, {path: currentPath, [navigate]: handler}) => {
				path = resolve(currentPath, path);

				warning(path, `Path "${path}" was invalid from current path "${currentPath}"`);

				if (path) handler({path});
			},
			// Adds `path` to the payload of navigate handler in the same format (String, or
			// String[]) as the current path prop.
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

		render: ({children, handleNavigate, index, path, ...rest}) => {
			return (
				<RouteContext.Provider value={{navigate: handleNavigate, path}}>
					<Router {...rest} path={path} component={Wrapped} index={index}>
						{children}
					</Router>
				</RouteContext.Provider>
			);
		}
	});
});

export default Routable;
export {
	Link,
	Linkable,
	Routable,
	Route,
	RouteContext
};
