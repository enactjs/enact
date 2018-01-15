/**
 * Provides unstyled BodyText components and behaviors to be customized by a theme or application.
 *
 * @module ui/BodyText
 * @exports BodyText
 * @exports BodyTextBase
 * @exports BodyTextDecorator
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import componentCss from './BodyText.less';

/**
 * [BodyTextBase]{@link ui/BodyText.BodyTextBase} A basic text-block component
 * without any behaviors applied to it.
 *
 * @class BodyTextBase
 * @memberof ui/BodyText
 * @ui
 * @public
 */
const BodyTextBase = kind({
	name: 'BodyText',

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

	render: ({css, ...rest}) => {
		delete rest.centered;

		return (
			<p
				css={css}
				{...rest}
			/>
		);
	}
});

/**
 * Adds no functionality, but is provided for export-API consistency between components
 *
 * @hoc
 * @memberof ui/BodyText
 * @public
 */
const BodyTextDecorator = (Wrapped) => Wrapped;

/**
 * A minimally-styled BodyText component. (Identical to `BodyTextBase`)
 *
 * @class Spinner
 * @extends ui/Spinner.SpinnerBase
 * @memberof ui/Spinner
 * @mixes ui/Spinner.SpinnerDecorator
 * @ui
 * @public
 */
const BodyText = BodyTextBase;

export default BodyText;

export {
	BodyText,
	BodyTextBase,
	BodyTextDecorator
};
