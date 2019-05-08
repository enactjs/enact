/**
 * Positions a breadcrumb based on its `data-index` and the current index, `to`
 *
 * @param  {Object} config  Arrangement configuration object
 * @returns {undefined}
 * @method
 * @private
 */
const positionBreadcrumb = (node, index) => {
	const crumbIndex = node.dataset.index;
	const x = (index - crumbIndex);
	const percentX = x * -100;

	return `translateX(${percentX}%)`;
};

const enter = ({node, from, to, reverse}) => {
	let x = reverse ? [
		{transform: positionBreadcrumb(node, to)},
		{transform: positionBreadcrumb(node, from), offset: 0.25},
		{transform: positionBreadcrumb(node, from)}
	] : [
		{transform: positionBreadcrumb(node, from)},
		{transform: positionBreadcrumb(node, from), offset: 0.75},
		{transform: positionBreadcrumb(node, to)}
	];

	return x;
};

const stay = ({node, from, to}) => {
	let x = [
		{transform: positionBreadcrumb(node, from)},
		{transform: positionBreadcrumb(node, to), offset: 0.25},
		{transform: positionBreadcrumb(node, to)}
	];

	return x;
};

/**
 * Arranger for panel breadcrumbs
 *
 * @type {Arranger}
 * @private
 */
const BreadcrumbArranger = {
	enter: enter,
	stay: enter,
	leave: enter
};

export default BreadcrumbArranger;
export {BreadcrumbArranger};
