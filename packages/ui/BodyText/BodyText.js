/**
 * Text block component to be customized by a theme or application.
 *
 * @module ui/BodyText
 * @exports BodyText
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import componentCss from './BodyText.module.less';

/**
 * A simple, unstyled text block component.
 *
 * @class BodyText
 * @memberof ui/BodyText
 * @ui
 * @public
 */
const BodyText = kind({
	name: 'ui:BodyText',

	propTypes: /** @lends ui/BodyText.BodyText.prototype */ {
		/**
		 * Centers the contents.
		 *
		 * Applies the `centered` CSS class which can be customized by
		 * [theming]{@link /docs/developer-guide/theming/}.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		centered: PropTypes.bool,

		/**
		 * The type of component to use to render the item. May be a DOM node name (e.g 'div',
		 * 'p', etc.) or a custom component.
		 *
		 * @type {Component}
		 * @default 'p'
		 * @public
		 */
		component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `bodyText` - The root class name
		 * * `centered` - Applied when `centered` prop is `true`
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object
	},

	defaultProps: {
		centered: false,
		component: 'p'
	},

	styles: {
		css: componentCss,
		className: 'bodyText',
		publicClassNames: true
	},

	computed: {
		className: ({centered, styler}) => styler.append({centered})
	},

	render: ({component: Component, ...rest}) => {
		delete rest.centered;

		return (
			<Component
				{...rest}
			/>
		);
	}
});

export default BodyText;
export {
	BodyText
};
