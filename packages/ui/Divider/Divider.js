/**
 * Provides unstyled divider components and behaviors to be customized by a theme or application.
 *
 * @module ui/Divider
 * @exports Divider
 * @exports DividerBase
 * @exports DividerDecorator
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import css from './Divider.less';

/**
 * [DividerBase]{@link ui/Divider.DividerBase} is a basic component that may be used as a separator
 * between groups of components.
 *
 * @class DividerBase
 * @memberof ui/Divider
 * @ui
 * @public
 */
const DividerBase = kind({
	name: 'DividerUI',

	propTypes: /** @lends ui/Divider.DividerBase.prototype */ {
		/**
		 * The content of the divider
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * The placeholder for the size of the spacing around the divider
		 *
		 * @type {String}
		 * @public
		 */
		spacing: PropTypes.oneOf(['normal', 'small', 'medium', 'large', 'none'])
	},

	styles: {
		css,
		className: 'divider'
	},

	computed: {
		className: ({spacing, styler}) => styler.append(spacing)
	},

	render: ({children, ...rest}) => {
		delete rest.spacing;

		return (
			<h3 {...rest}>{children}</h3>
		);
	}
});

const Divider = DividerBase;
const DivderDecorator = (Wrapped) => (Wrapped);

export default Divider;
export {
	DividerBase,
	Divider,
	DivderDecorator
};
