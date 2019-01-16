import React from 'react';
import PropTypes from 'prop-types';
import warning from 'warning';

const toSegments = (path) => Array.isArray(path) ? path : path.split('/').slice(1);

const getPaths = (routes, base) => {
	let result = [];
	Object.keys(routes).filter(s => s[0] !== '$').forEach(p => {
		const path = base + '/' + p;
		result.push(path);
		result = result.concat(getPaths(routes[p], path));
	});

	return result;
};

const stringifyRoutes = (routes) => {
	const pad = '\n\t';
	const paths = getPaths(routes, '');
	return pad + paths.join(pad);
};

const propTypes = {
	path: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.string),	// array of path segments
		PropTypes.string						// URI-style path
	])
};

/**
 * A Router component for use with [`Panels`]{@link moonstone/Panels.Panels}
 *
 * @class Router
 * @memberof moonstone/Panels
 * @ui
 * @public
 */
const Router = class extends React.Component {
	static displayName = 'Router'

	static propTypes = /** @lends moonstone/Panels.Router.prototype */ {
		/**
		 * List of views to render.
		 *
		 * Will be rendered as a flat array of views suitable for use in
		 * Panels and not a hierarchy of views as the path implies.
		 *
		 * May either be a URI-style path (`'/app/home/settings'`) or an array
		 * of strings (`['app', 'home', 'settings']`)
		 *
		 * @type {String|String[]}
		 * @required
		 * @public
		 */
		path: propTypes.path.isRequired,

		/**
		 * The component wrapping the rendered path
		 *
		 * @type {Component}
		 * @default 'div'
		 * @public
		 */
		component: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.func
		]),

		/**
		 * Routes defined as an object rather than via JSX.
		 *
		 * If specified, `routes` will take
		 * precendence over a JSX definition.
		 *
		 * ```JavaScript
		 * const routes = {
		 *   'first': {
		 *     '$props': {
		 *       'title': 'About Routable Panels Pattern'
		 *     },
		 *     '$component': AboutPanel,
		 *     'second': {
		 *       '$props': {
		 *         'next': 'fourth',
		 *         'title': 'Second'
		 *       },
		 *       '$component': MainPanel
		 *     },
		 *     'third': {
		 *       '$props': {
		 *         'next': 'first',
		 *         'title': 'Third'
		 *       },
		 *       '$component': MainPanel,
		 *       'fourth': {
		 *         '$props': {
		 *           'next': 'third',
		 *           'title': 'Fourth'
		 *         },
		 *         '$component': MainPanel
		 *       }
		 *     }
		 *   }
		 * };
		 *
		 *	<Panels path="/app/home/settings" routes={routes} />
		 * ```
		 *
		 * @type {Object}
		 * @public
		 */
		routes: PropTypes.object
	}

	static defaultProps = {
		component: 'div'
	}

	constructor (props) {
		super(props);
		this.initRoutes(props);
	}

	UNSAFE_componentWillReceiveProps (nextProps) {
		this.initRoutes(nextProps);
	}

	/**
	 * Selects either `props.routes` or generates routes from `props.children`
	 *
	 * @param {Object} props Component props
	 *
	 * @returns {undefined}
	 */
	initRoutes (props) {
		this.routes = props.routes || this.createRoutes(props.children, {});
	}

	/**
	 * Generates a set of routes from `children` and appends them to `routes`
	 *
	 * @param  {React.element[]} children Array of children
	 * @param  {Object}          routes   Route configuration object
	 *
	 * @returns {Object}                   Route configuration object
	 */
	createRoutes (children, routes) {
		React.Children.forEach(children, child => {
			const {path, children: grandchildren, component, ...rest} = child.props;
			if (path && component) {
				routes[path] = {
					$component: component,
					$props: rest
				};

				if (grandchildren) {
					this.createRoutes(grandchildren, routes[path]);
				}
			}
		});
		return routes;
	}

	/**
	 * Creates an array of React.elements for the current path
	 *
	 * @returns {React.element[]} Children to render
	 */
	createChildren () {
		const segments = toSegments(this.props.path);

		let valid = true;
		let route = this.routes;
		const children = segments.map((segment, index) => {
			const subPath = segments.slice(0, index + 1).join('/');
			route = route && route[segment];
			if (route && route.$component) {
				return React.createElement(route.$component, {
					...route.$props,
					key: 'view$/' + subPath,
					spotlightId: `panel-${subPath.replace(/\//g, '-')}`
				});
			}

			valid = false;
			return null;
		});

		warning(valid, `${this.props.path} does not match the configured routes: ${stringifyRoutes(this.routes)}`);

		return valid ? children : [];
	}

	render () {
		const {component: Component, ...rest} = this.props;
		const children = this.createChildren();

		delete rest.path;
		delete rest.routes;

		return <Component {...rest}>{children}</Component>;
	}
};

/**
 * Used with {@link moonstone/Panels.Routable} to define the `path` segment and the
 * `component` to render.
 *
 *`Route` elements can be nested to build multiple level paths.
 *
 * In the below example, `Panels` would render `SettingsPanel` with breadcrumbs to
 * navigate `AppPanel` and `HomePanel`.
 *
 * ```
 *	<Panels path="/app/home/settings" onSelectBreadcrumb={this.handleNavigate}>
 *		<Route path="app" component={AppPanel}>
 *			<Route path="home" component={HomePanel}>
 *				<Route path="settings" component={SettingsPanel} />
 *			</Route>
 *		</Route>
 *		<Route path="admin" component={AdminPanel} />
 *		<Route path="help" component={HelpPanel} />
 *	</Panels>
 * ```
 *
 * @class Route
 * @memberof moonstone/Panels
 * @public
 */
const Route = () => null;

Route.propTypes = {
	/**
	 * The component to render when the `path` for this Route matches the path of the
	 * {@link moonstone/Panels.Routable} container.
	 *
	 * @type {String|Function}
	 * @required
	 * @public
	 * @memberof moonstone/Panels.Route.prototype
	 */
	component: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func
	]).isRequired,

	/**
	 * The name of the path segment
	 *
	 * @type {String}
	 * @required
	 * @public
	 * @memberof moonstone/Panels.Route.prototype
	 */
	path: PropTypes.string.isRequired
};

export default Router;
export {Router, Route, propTypes, toSegments};
