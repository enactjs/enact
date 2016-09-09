import {scale} from 'enact-ui/resolution';
import R from 'ramda';

import {AlwaysViewingArranger} from './Arrangers';
import {breadcrumbWidth} from './Breadcrumb';
import BreadcrumbDecorator from './BreadcrumbDecorator';
import Viewport from './Viewport';

/**
 * Calculates the number of breadcrumbs that would fit in half of the viewport
 *
 * @param {Number} viewportWidth inner width of the viewport (usually the window)
 * @param {Number} width         width of a breadcrumb
 *
 * @returns {Number} Number of breadcrumbs that can completely fit in that space
 */
const calcMax = R.memoize((viewportWidth, width) => Math.floor(viewportWidth / 2 / scale(width)));

/**
* An instance of Panels in which the Panel uses the right half of the viewable screen with
* breadcrumbs to the left for any panels prior to the active panel.
*
* @class AlwaysViewingPanels
* @ui
* @public
*/
const AlwaysViewingPanels = BreadcrumbDecorator({
	className: 'panels alwaysViewing enact-fit',
	max: () => calcMax(window.innerWidth, breadcrumbWidth),
	props: {
		arranger: AlwaysViewingArranger
	}
}, Viewport);

export default AlwaysViewingPanels;
export {AlwaysViewingPanels};
