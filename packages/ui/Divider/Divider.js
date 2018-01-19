/**
 * Provides unstyled divider components and behaviors to be customized by a theme or application.
 *
 * @module ui/Divider
 * @exports Divider
 * @exports DividerBase
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
		 * The type of component to use to render the item. May be a DOM node name (e.g 'div',
		 * 'span', etc.) or a custom component.
		 *
		 * @type {Component}
		 * @default 'div'
		 * @public
		 */
		component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `'divider'` - The root component class
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
		spacing: PropTypes.string
	},

	defaultProps: {
		component: 'h3'
	},

	styles: {
		css: componentCss,
		className: 'divider',
		publicClassNames: true
	},

	computed: {
		className: ({spacing, styler}) => styler.append(spacing)
	},

	render: ({children, component:Component, ...rest}) => {
		delete rest.spacing;

		return (
			<Component {...rest}>{children}</Component>
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

export default Divider;
export {
	DividerBase,
	Divider
};
