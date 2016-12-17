import {ActivityArranger} from './Arrangers';
import BreadcrumbDecorator from './BreadcrumbDecorator';
import PanelsBase from './Panels';

/**
 * An instance of Panels in which the Panel uses the entire viewable screen with a single breadcrumb
 * for the previous panel when viewing any panel beyond the first.
 *
 * @class ActivityPanels
 * @memberof moonstone/Panels
 * @ui
 * @public
 */
const ActivityPanels = BreadcrumbDecorator({
	className: 'panels activity enact-fit',
	max: 1,
	props: {
		arranger: ActivityArranger,
		noFocusManager: true
	}
}, PanelsBase);

export default ActivityPanels;
export {ActivityPanels};
