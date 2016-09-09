import {ActivityArranger} from './Arrangers';
import BreadcrumbDecorator from './BreadcrumbDecorator';
import Viewport from './Viewport';

/**
* An instance of Panels in which the Panel uses the entire viewable screen with a single breadcrumb
* for the previous panel when viewing any panel beyond the first.
*
* @class ActivityPanels
* @ui
* @public
*/
const ActivityPanels = BreadcrumbDecorator({
	className: 'panels activity enyo-fit',
	max: 1,
	props: {
		arranger: ActivityArranger
	}
}, Viewport);

export default ActivityPanels;
export {ActivityPanels};
