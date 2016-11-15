import easing from 'eases/cubic-out';
import {ease, replaceTransform, startAfter} from '@enact/ui/ViewManager/arrange';

/**
 * Panel arrangers have a unique design requirement that varies their transition depending on the
 * direction (reverse) of the transition. This takes the two arrangement functions and returns
 * another function that picks which to call based on the value of `reverseTransition`.
 *
 * @param {Function} f forward function
 * @param {Function} b backward function
 * @returns {Function} Arrangement function
 * @method
 */
const forwardBackward = (f, b) => (config) => {
	const f2 = config.reverseTransition ? b : f;
	f2(config);
};

/**
 * Positions a breadcrumb based on its `data-index` and the current index, `to`
 *
 * @param  {Object} config  Arrangement configuration object
 * @returns {undefined}
 * @method
 */
const positionBreadcrumb = ease(easing, (config) => {
	const {from = 0, node, percent, to} = config;
	const crumbIndex = node.dataset.index;
	const dx = (to - from) * percent;
	const x = (from - crumbIndex);
	const percentX = (x + dx) * -100;

	replaceTransform(`translateX(${percentX}%)`, config);
});

/**
 * Arrangement function for breadcrumbs
 *
 * @param  {Object} config  Arrangement configuration object
 * @returns {undefined}
 * @method
 */
const enter = forwardBackward(
	startAfter(0.75, positionBreadcrumb),
	startAfter(0.5, positionBreadcrumb)
);

/**
 * Arranger for panel breadcrumbs
 *
 * @type {Arranger}
 */
const BreadcrumbArranger = {
	enter: enter,
	stay: enter,
	leave: enter
};

export default BreadcrumbArranger;
export {BreadcrumbArranger};
