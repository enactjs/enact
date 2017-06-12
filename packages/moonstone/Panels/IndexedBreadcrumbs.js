import React from 'react';

import Breadcrumb from './Breadcrumb';

/**
 * Generates an array of at most `max` breadcrumbs with zero-padded labels prefixed by <
 *
 * @param {Number} index      Index of active breadcrumb
 * @param {Number} max        Maximum number of breadcrumbs to dispaly
 * @param {Function} onSelect Handler for selecting a breadcrumb
 * @returns {React.element[]} Array of breadcrumbs
 * @private
 */
const IndexedBreadcrumbs = (id, index, max, onSelect) => {
	const breadcrumbs = new Array(index < max ? index : max);
	const start = Math.max(index - max, 0);

	for (let i = start; i < index; i++) {
		const label = (i < 9 ? '0' : '') + (i + 1);

		breadcrumbs[index - i - 1] = (
			<Breadcrumb
				onSelect={onSelect}
				id={`${id}_bc_${i}`}
				index={i}
				key={i}
			>
				&lt; {label}
			</Breadcrumb>
		);
	}

	return breadcrumbs;
};

export default IndexedBreadcrumbs;
export {IndexedBreadcrumbs};
