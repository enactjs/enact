import {ActivityArranger} from './Arrangers';
import BreadcrumbDecorator from './BreadcrumbDecorator';
import kind from '@enact/core/kind';
import {PanelsBase} from './Panels';
import React from 'react';
import ViewManager from '@enact/ui/ViewManager';

import css from './Panels.less';

const BreadcrumbViewManager = kind({
	name: 'BreadcrumbViewManager',

	styles: {
		css
	},

	computed: {
		// Hide the breadcrumbs when navigating to the first panel
		className: ({index, styler}) => styler.append({
			hidden: index < 0
		})
	},

	render: (props) => (
		<ViewManager {...props} />
	)
});

/**
 * An instance of Panels in which the Panel uses the entire viewable screen with a single breadcrumb
 * for the previous panel when viewing any panel beyond the first.
 *
 * **Note** ActivityPanels requires that the `data-index` property that all panels variations add to
 * its children be applied to the root DOM node of each child in order to manage layout correctly.
 * It is recommended that you spread any extra props on the root node but you may also handle this
 * property explicitly if necessary.
 *
 * @class ActivityPanels
 * @memberof moonstone/Panels
 * @ui
 * @public
 */
const ActivityPanels = BreadcrumbDecorator({
	BreadcrumbViewManager,
	className: 'panels activity enact-fit',
	max: 1,
	panelArranger: ActivityArranger
}, PanelsBase);

export default ActivityPanels;
export {ActivityPanels};
