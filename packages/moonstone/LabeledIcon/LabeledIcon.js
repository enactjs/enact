/**
 * Provides unstyled LabeledIcon components to be customized by a theme or application.
 *
 * @module ui/LabeledIcon
 * @exports LabeledIcon
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';
import compose from 'ramda/src/compose';
import Pure from '@enact/ui/internal/Pure';
import UiLabeledIcon from '@enact/ui/LabeledIcon';

import Icon from '../Icon';
import Skinnable from '../Skinnable';

import componentCss from './LabeledIcon.less';

/**
 * A basic LabeledIcon component structure without any behaviors applied to it.
 *
 * @class LabeledIconBase
 * @memberof ui/LabeledIcon
 * @ui
 * @public
 */
const LabeledIconBase = kind({
	name: 'LabeledIcon',

	propTypes: /** @lends ui/LabeledIcon.LabeledIconBase.prototype */ {
		/**
		 * The LabeledIcon content.
		 *
		 * May be specified as either:
		 *
		 * * A string that represents an LabeledIcon from the [LabeledIconList]{@link ui/LabeledIcon.LabeledIconBase.LabeledIconList},
		 * * An HTML entity string, Unicode reference or hex value (in the form '0x...'),
		 * * A URL specifying path to an LabeledIcon image, or
		 * * An object representing a resolution independent resource (See {@link ui/resolution}).
		 *
		 * @type {String|Object}
		 * @public
		 */
		children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `labeledIcon` - The root component class
		 * * `label` - The label component class
		 * * `icon` - The icon component class
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object
	},

	styles: {
		css: componentCss,
		className: 'labeledIcon',
		publicClassNames: ['labeledIcon', 'icon', 'label']
	},

	render: ({css, children, ...rest}) => {
		return (
			<UiLabeledIcon
				iconComponent={Icon}
				{...rest}
				css={css}
			>
				{children}
			</UiLabeledIcon>
		);
	}
});

const LabeledIconDecorator = compose(
	Pure,
	Skinnable
);

const LabeledIcon = LabeledIconDecorator(LabeledIconBase);

export default LabeledIcon;
export {
	LabeledIcon,
	LabeledIconBase,
	LabeledIconDecorator
};
