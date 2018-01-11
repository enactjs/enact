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

import componentCss from './Divider.less';

/**
 * [DividerBase]{@link ui/Divider.DividerBase} is a basic component that may be used as
 * a separator between groups of components.
 *
 * @class DividerBase
 * @memberof ui/Divider
 * @ui
 * @public
 */
const DividerBase = kind({
	name: 'ui:Divider',

	propTypes: /** @lends ui/Divider.DividerBase.prototype */ {
		/**
		 * The content of the divider
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `'normal'` - Applied when `spacing` prop is `normal`
		 * * `'small'` - Applied when `spacing` prop is `small`
		 * * `'medium'` - Applied when `spacing` prop is `medium`
		 * * `'large'` - Applied when `spacing` prop is `large`
		 * * `'none'` - Applied when `spacing` prop is `none`
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * The placeholder for the size of the spacing around the divider
		 *
		 * @type {String}
		 * @public
		 */
		spacing: PropTypes.oneOf(['normal', 'small', 'medium', 'large', 'none'])
	},

	styles: {
		css: componentCss,
		className: 'divider',
		publicClassNames: true
	},

	computed: {
		className: ({spacing, styler}) => styler.append(spacing)
	},

	render: ({children, css, ...rest}) => {
		delete rest.spacing;

		return (
			<h3 css={css} {...rest}>{children}</h3>
		);
	}
});

/**
 * [Divider]{@link ui/Divider.Divider} is a basic component that may be used as
 * a separator between groups of components.
 *
 * @class Divider
 * @extends ui/Divider.DividerBase
 * @memberof ui/Divider
 * @ui
 * @public
 */
const Divider = DividerBase;

/**
 * Adds no functionality, but is provided for export-API consistency between components
 *
 * @hoc
 * @memberof ui/Divider
 * @public
 */
const DivderDecorator = (Wrapped) => (Wrapped);

export default Divider;
export {
	DividerBase,
	Divider,
	DivderDecorator
};
