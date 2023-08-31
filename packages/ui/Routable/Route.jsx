import EnactPropTypes from '@enact/core/internal/prop-types';
import PropTypes from 'prop-types';

/**
 * Used with {@link ui/Routable.Routable} to define the `path` segment and the
 * `component` to render.
 *
 *`Route` elements can be nested to build multiple level paths.
 *
 * In the below example, `Panels` would render `SettingsPanel` with breadcrumbs to
 * navigate `AppPanel` and `HomePanel`.
 *
 * Example:
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
 * @ui
 * @memberof ui/Routable
 * @public
 */
const Route = () => null;

Route.propTypes = {
	/**
	 * The component to render when the `path` for this Route matches the path of the
	 * {@link ui/Routable.Routable} container.
	 *
	 * @type {String|Component}
	 * @required
	 * @public
	 * @memberof ui/Routable.Route.prototype
	 */
	component: EnactPropTypes.renderable.isRequired,

	/**
	 * The name of the path segment.
	 *
	 * @type {String}
	 * @required
	 * @public
	 * @memberof ui/Routable.Route.prototype
	 */
	path: PropTypes.string.isRequired
};

export default Route;
export {
	Route
};
