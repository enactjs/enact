import React from 'react';
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
	path: React.PropTypes.oneOfType([
		React.PropTypes.arrayOf(React.PropTypes.string),	// array of path segments
		React.PropTypes.string								// URI-style path
	])
};

const Router = class extends React.Component {
	static displayName = 'Router'

	static propTypes = {
		/**
		 * List of views to render. Will be rendered as a flat array of views suitable for use in
		 * Panels and not a hierarchy of views as the path implies.
		 *
		 * May either be a URI-style path (`'/app/home/settings'`) or an array
		 * of strings (`['app', 'home', 'settings']`)
		 *
		 * @type {String|String[]}
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
		component: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.func
		]),

		/**
		 * Routes defined as an object rather than via JSX. If specified, `routes` will take
		 * precendence over a JSX definition.
		 *
		 * @type {Object}
		 * @public
		 */
		routes: React.PropTypes.object
	}

	static defaultProps = {
		component: 'div'
	}

	constructor (props) {
		super(props);
		this.initRoutes(props);
	}

	componentWillReceiveProps (nextProps) {
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
					key: 'view$/' + subPath
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

		delete rest.routes;
		delete rest.path;

		return <Component {...rest}>{children}</Component>;
	}
};

const Route = () => null;

export default Router;
export {Router, Route, propTypes, toSegments};
