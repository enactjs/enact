import {appendTransform, clearTransform, compose, ease, endBy, reverse, slideIn, slideOut} from '@enact/ui/ViewManager/arrange';
import both from 'ramda/src/both';
import complement from 'ramda/src/complement';
import either from 'ramda/src/either';
import equals from 'ramda/src/equals';
import prop from 'ramda/src/prop';
import quadInOut from 'eases/quad-in-out';
import rCompose from 'ramda/src/compose';
import when from 'ramda/src/when';

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
const offsetForBreadcrumbs = ({node, percent}) => {
	const x = breadcrumbWidth * percent;
	appendTransform(`translateX(${x}px)`, {node});
};

// Set of conditions used to guard offsetForBreadcrumbs. The offset should be applied when
// transitioning to any panel other than the first and also for the leave transition when moving to
// the first panel because the active panel should start at the offset before moving right offscreen
const toFirst = rCompose(equals(0), prop('to'));
const toFirstReverse = both(toFirst, prop('reverseTransition'));
const notToFirst = complement(toFirst);

/**
 * Arranger that slides panels in from the right and out to the left allowing space for the single
 * breadcrumb when `to` index is greater than zero.
 *
 * @type {Arranger}
 * @private
 */
export const ActivityArranger = {
	enter: compose(panelEnter, reverse(when(either(notToFirst, toFirstReverse), offsetForBreadcrumbs))),
	leave: compose(panelLeave, when(notToFirst, offsetForBreadcrumbs))
};
