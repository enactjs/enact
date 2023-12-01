import EnactPropTypes from '@enact/core/internal/prop-types';
import PropTypes from 'prop-types';
import React from 'react';
import warning from 'warning';

import ForwardRef from '../ForwardRef';

import {RoutablePropTypes, stringifyRoutes, toSegments} from './util';

/**
 * A Router component for use with [`ViewManager`]{@link ui/ViewManager.ViewManager}
 *
 * @class Router
 * @memberof ui/Routable
 * @mixes ui/ForwardRef.ForwardRef
 * @ui
 * @private
 */
const RouterBase = class extends React.Component {
	static displayName = 'Router';

	static propTypes = /** @lends ui/Routable.Router.prototype */ {
		/**
		 * List of views to render.
		 *
		 * Will be rendered as a flat array of views suitable for use in
		 * Panels and not a hierarchy of views as the path implies.
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
		 * The component wrapping the rendered path.
		 *
		 * @type {String|Component}
		 * @default 'div'
		 * @public
		 */
		component: EnactPropTypes.renderable,

		/**
		 * Called with a reference to [component]{@link ui/Routable.Router#component}.
		 *
		 * @type {Object|Function}
		 * @private
		 */
		componentRef: EnactPropTypes.ref,

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
	};

	static defaultProps = {
		component: 'div'
	};

	constructor (props) {
		super(props);
	}

	/**
	 * Generates a set of routes from `children` and appends them to `routes`.
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
	 * Creates an array of React.elements for the current path.
	 *
	 * @returns {React.element[]} Children to render
	 */
	createChildren () {
		const segments = toSegments(this.props.path);
		const {routes, children} = this.props;
		const computedRoutes = routes || this.createRoutes(children, {});

		let valid = true;
		let route = computedRoutes;
		const childrenElements = segments.map((segment, index) => {
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

		warning(valid, `${this.props.path} does not match the configured routes: ${stringifyRoutes(computedRoutes)}`);

		return valid ? childrenElements : [];
	}

	render () {
		const {component: Component, componentRef, ...rest} = this.props;
		const children = this.createChildren();

		delete rest.path;
		delete rest.routes;

		return <Component ref={componentRef} {...rest}>{children}</Component>;
	}
};

const Router = ForwardRef({prop: 'componentRef'}, RouterBase);

export default Router;
export {
	Router,
	RouterBase
};
