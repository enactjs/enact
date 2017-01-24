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
 * @param  {Node} options.node      DOM Node
 * @param  {Number} options.percent Percentage complete between 0 and 1
 *
 * @returns {undefined}
 * @private
 */
const offsetForBreadcrumbs = ({from, to, node}) => {
	const isFirst = node && node.dataset && node.dataset.index === '0';

	// Only use the stylesheet's clipPath when we're transitioning TO a panel that needs a clip (index=1)
	// But don't whenwe're transitioning back to the first one.
	if ((from < to && to != 1) || (from > to && to != 0)) {
		console.log('clip necessary, use the stylesheet rules');
		// node.parentNode IS A TERRIBLE WAY TO GET viewport... BUT it does what is needed here. Suggestions?
		node.parentNode.style.clipPath = null;
	} else {
		console.log('NO need to clip. Make our own rules!');
		node.parentNode.style.clipPath = 'none';
	}
	if (!isFirst) {
		const x = unit(scale(breadcrumbWidth), 'rem');
		appendTransform(`translateX(${x})`, {node});
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
	enter: compose(panelEnter, reverse(offsetForBreadcrumbs)),
	leave: compose(panelLeave, offsetForBreadcrumbs)
};
