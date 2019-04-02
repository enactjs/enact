import {scale} from '@enact/ui/resolution';
import Slottable from '@enact/ui/Slottable';

import Skinnable from '../Skinnable';

import {AlwaysViewingArranger} from './Arrangers';
import {breadcrumbWidth} from './Breadcrumb';
import BreadcrumbDecorator from './BreadcrumbDecorator';
import Viewport from './Viewport';

/*
 * Calculates the number of breadcrumbs that would fit in half of the viewport
 *
 * @param {Number} viewportWidth inner width of the viewport (usually the window)
 * @param {Number} width         width of a breadcrumb
 *
 * @returns {Number} Number of breadcrumbs that can completely fit in that space
 * @private
 */
const calcMax = () => {
	if (typeof window === 'object') {
		return Math.floor(window.innerWidth / 2 / scale(breadcrumbWidth));
	}
};

/**
 * An instance of [`Panels`]{@link moonstone/Panels.Panels} which restricts the `Panel` to the right
 * half of the screen with the left half used for breadcrumbs that allow navigating to previous
 * panels. Typically used for overlaying panels over a screen.
 *
 * @class AlwaysViewingPanels
 * @memberof moonstone/Panels
 * @ui
 * @public
 */
const AlwaysViewingPanels = Slottable({slots: ['controls']},
	Skinnable(BreadcrumbDecorator({
		className: 'panels alwaysViewing enact-fit',
		max: calcMax,
		panelArranger: AlwaysViewingArranger
	}, Viewport))
);

export default AlwaysViewingPanels;
export {AlwaysViewingPanels};
