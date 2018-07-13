/**
 * An unstyled body text component and behaviors to be customized by a theme or application.
 *
 * @module ui/BodyText
 * @exports BodyText
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import componentCss from './BodyText.less';

/**
 * A basic text-block component without any behaviors applied to it.
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
		 * Applies the `centered` CSS class to the [BodyTextBase]{@link ui/BodyText.BodyTextBase}
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		centered: PropTypes.bool,

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
		centered: false
	},

	styles: {
		css: componentCss,
		className: 'bodyText',
		publicClassNames: true
	},

	computed: {
		className: ({centered, styler}) => styler.append({centered})
	},

	render: (props) => {
		delete props.centered;

		return (
			<p
				{...props}
			/>
		);
	}
});

export default BodyText;
export {
	BodyText
};
