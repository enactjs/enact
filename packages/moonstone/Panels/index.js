/**
 * Exports the {@link moonstone/Panels.Panels}, {@link moonstone/Panels.Panel},
 * {@link moonstone/Panels.ActivityPanels}, {@link moonstone/Panels.AlwaysViewingPanels},
 * {@link moonstone/Panels.Breadcrumb}, {@link moonstone/Panels.Header} components. It
 * also exports the {@link moonstone/Panels.Routable} HOC and {@link moonstone/Panels.Route}
 * function. The default export is {@link moonstone/Panels.Panels}.
 *
 * @module moonstone/Panels
 */

import ActivityPanels from './ActivityPanels';
import AlwaysViewingPanels from './AlwaysViewingPanels';
import Breadcrumb from './Breadcrumb';
import Header from './Header';
import Panel from './Panel';
import Panels from './Panels';
import Routable from './Routable';
import {Route} from './Router';

export default Panels;
export {
	ActivityPanels,
	AlwaysViewingPanels,
	Breadcrumb,
	Header,
	Panel,
	Panels,
	Panels as PanelsBase,
	Routable,
	Route
};
