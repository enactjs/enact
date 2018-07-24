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

import ActivityPanels from './ActivityPanels';
import AlwaysViewingPanels from './AlwaysViewingPanels';
import Breadcrumb from './Breadcrumb';
import Header, {HeaderBase} from './Header';
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
	HeaderBase,
	Panel,
	Panels,
	Panels as PanelsBase,
	Routable,
	Route
};
