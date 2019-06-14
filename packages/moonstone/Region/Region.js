/**
 * This component provides a labeled region to a group of components.
 *
 * @example
 * <Region title="Select an Option">
 * </Region>
 *
 * @module moonstone/Region
 * @exports Region
 * @exports RegionBase
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import Heading from '../Heading';

/**
 * A component for grouping other components.
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
		 * Title placed within an instance of [Heading]{@link moonstone/Heading.Heading} before the
		 * children.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		title: PropTypes.string.isRequired,

		/**
		 * The aria-label for the region.
		 *
		 * If unset, it defaults to the value of `title`
		 *
		 * @memberof moonstone/Region.Region.prototype
		 * @type {String}
		 * @public
		 */
		'aria-label': PropTypes.string,

		/**
		 * Contents of the region.
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
				<Heading showLine>{title}</Heading>
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
