/**
 * Exports the {@link moonstone/Region.Region} component.
 *
 * @module moonstone/Region
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import Divider from '../Divider';

/**
 * {@link moonstone/Region.Region} provides a labeled region to group components. The `title` is
 * wrapped by a {@link moonstone/Divider.Divider} which precedes any `children`.
 *
 * ```
 * <Region title="Select an Option">
 *   <Group childComponent={CheckboxItem} selectedProp="selected">
 *     {items}
 *   </Group>
 * </Region>
 * ```
 *
 * @class Region
 * @memberof moonstone/Region
 * @ui
 * @public
 */
const RegionBase = kind({
	name: 'Region',

	propTypes: /** @lends moonstone/Region.Region.prototype */ {
		/**
		 * The title of the region placed within an instance of {@link moonstone/Divider.Divider}
		 * before the children.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		title: PropTypes.string.isRequired,

		/**
		 * Sets the aria-label for the region. If unset, it defaults to the value of `title`
		 *
		 * @memberof moonstone/Region.Region.prototype
		 * @type {String}
		 * @public
		 */
		'aria-label': PropTypes.string,

		/**
		 * The contents of the region
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node
	},

	computed: {
		'aria-label': ({'aria-label': ariaLabel, title}) => ariaLabel || title
	},

	render: ({'aria-label': ariaLabel, children, title, ...rest}) => {
		return (
			<div {...rest} role="region" aria-label={ariaLabel}>
				<Divider>{title}</Divider>
				{children}
			</div>
		);
	}
});

export default RegionBase;
export {
	RegionBase as Region,
	RegionBase
};
