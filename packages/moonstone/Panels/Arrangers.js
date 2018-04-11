import {appendTransform, clearTransform, compose, ease, endBy, reverse, slideIn, slideOut} from '@enact/ui/ViewManager/arrange';
import quadInOut from 'eases/quad-in-out';
import {scale, unit} from '@enact/ui/resolution';

import {breadcrumbWidth} from './Breadcrumb';

/**
 * Panel arrangers have a unique design requirement that varies their transition depending on the
 * direction (reverse) of the transition. This takes the two arrangement functions and returns
 * another function that picks which to call based on the value of `reverseTransition`.
 *
 * @param {Function} f forward function
 * @param {Function} b backward function
 * @returns {Function} Arrangement function
 * @private
 */
const forwardBackward = (f, b) => (config) => {
	const f2 = config.reverseTransition ? b : f;
	f2(config);
};

/**
 * Utility method to apply the same easing and reset the transform before applying `fn`
 *
 * @param   {Function} fn Arrangement function
 * @returns {Function}    Composed arrangement function
 * @private
 */
const base = (fn) => reverse(
	ease(quadInOut,
		compose(clearTransform, fn)
	)
);

// Creating these here since they're composed below in forwardBackward
const slideInRight = base(slideIn('right'));
const slideOutLeft = base(slideOut('left'));

// These are the arrangers for AlwaysViewing but also composed in Activity
const panelEnter = forwardBackward(slideInRight, endBy(0.75, slideInRight));
const panelLeave = forwardBackward(slideOutLeft, endBy(0.75, slideOutLeft));

// Always-Viewing Arranger

/**
 * Arranger that slides panels in from the right and out to the left
 *
 * @type {Arranger}
 * @private
 */
export const AlwaysViewingArranger = {
	enter: panelEnter,
	leave: panelLeave
};

// Actvity Arranger

/**
 * Appends a transform that accounts for a single breadcrumb
 *
 * @param  {Node} node      DOM Node
 *
 * @returns {undefined}
 * @private
 */
const offsetForBreadcrumbs = ({node}) => {
	const isFirst = node && node.dataset && node.dataset.index === '0';

	if (!isFirst) {
		const x = unit(scale(breadcrumbWidth), 'rem');
		appendTransform(`translateX(${x})`, {node});
	}
};

// Adds the data-clip attribute to allow clipping when transitioning between non-zero panels
// CSS is enforced by Panels.less
const clipForBreadcrumbs = ({from, node, percent, to}) => {
	const viewport = node.parentNode;
	if (to === 0 || from === 0 || percent === 0 || percent === 1) {
		// remove clip when moving to or from the first panel and when a transition is completing
		delete viewport.dataset.clip;
	} else {
		viewport.dataset.clip = 'true';
	}
};

/**
 * Arranger that slides panels in from the right and out to the left allowing space for the single
 * breadcrumb when `to` index is greater than zero.
 *
 * @type {Arranger}
 * @private
 */
export const ActivityArranger = {
	enter: compose(panelEnter, reverse(offsetForBreadcrumbs), clipForBreadcrumbs),
	leave: compose(panelLeave, offsetForBreadcrumbs),
	// Need a stay arrangement in case the initial index for ActivityPanels is > 0 so the panel is
	// correctly offset for the breadcrumbs.
	stay: compose(clearTransform, offsetForBreadcrumbs)
};
