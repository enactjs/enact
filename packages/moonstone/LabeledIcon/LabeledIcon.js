/**
 * Provides unstyled LabeledIcon components to be customized by a theme or application.
 *
 * @module ui/LabeledIcon
 * @exports LabeledIcon
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import Icon from '../Icon';
import UiLabeledIcon from '@enact/ui/LabeledIcon';

import componentCss from './LabeledIcon.less';

/**
 * A basic LabeledIcon component structure without any behaviors applied to it.
 *
 * @class LabeledIconBase
 * @memberof ui/LabeledIcon
 * @ui
 * @public
 */
const LabeledIcon = kind({
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

	defaultProps: {
	// 	LabeledIconList: {},
	// 	pressed: false,
	// 	small: false
	},

	styles: {
		css: componentCss,
		className: 'labeledIcon',
		publicClassNames: ['labeledIcon', 'icon', 'label']
	},

	// computed: {
	// iconComponent: ({icon}) => (typeof icon === 'string' ? <Icon>{icon}</Icon> : icon)
	// 	className: ({children: LabeledIcon, LabeledIconList, pressed, small, styler}) => styler.append({
	// 		// If the LabeledIcon isn't in our known set, apply our custom font class
	// 		dingbat: !(LabeledIcon in LabeledIconList),
	// 		pressed,
	// 		small
	// 	})
	// },

	render: ({css, children, ...rest}) => {
		// delete rest.small;

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

export default LabeledIcon;
export {
	LabeledIcon
};
