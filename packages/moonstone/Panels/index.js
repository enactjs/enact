/**
 * Panels provides a way to manage different screens of an app.
 *
 * @module moonstone/Panels
 * @exports ActivityPanels
 * @exports AlwaysViewingPanels
 * @exports Breadcrumb
 * @exports Header
 * @exports Panel
 * @exports Panels
 * @exports PanelsBase
 * @exports Routable
 * @exports Route
 */

import Routable, {Route} from '@enact/ui/Routable';

import ActivityPanels from './ActivityPanels';
import AlwaysViewingPanels from './AlwaysViewingPanels';
import Breadcrumb from './Breadcrumb';
import Header, {HeaderBase} from './Header';
import MinimizeController, {MinimizeControllerContext} from './HeaderController';
import Panel from './Panel';
import Panels from './Panels';


export default Panels;
export {
	ActivityPanels,
	AlwaysViewingPanels,
	Breadcrumb,
	Header,
	HeaderBase,
	MinimizeController,
	MinimizeControllerContext,
	Panel,
	Panels,
	Panels as PanelsBase,

	/**
	 * A higher-order component that provides support for mapping Routes as children of a component
	 * which are selected via `path` instead of the usual flat array.
	 *
	 * @see {@link ui/Routable.Routable}
	 * @hoc
	 * @name Routable
	 * @extends ui/Routable.Routable
	 * @memberof moonstone/Panels
	 * @public
	 */
	Routable,

	/**
	 * Used with {@link moonstone/Panels.Routable} to define the `path` segment and the
	 * `component` to render.
	 *
	 * @see {@link ui/Routable.Route}
	 * @ui
	 * @name Route
	 * @extends ui/Routable.Route
	 * @memberof moonstone/Panels
	 * @public
	 */
	Route
};
