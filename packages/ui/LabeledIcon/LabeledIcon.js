/**
 * Provides unstyled LabeledIcon components to be customized by a theme or application.
 *
 * @module ui/LabeledIcon
 * @exports LabeledIcon
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

// import ComponentOverride from '../ComponentOverride';
import Layout, {Cell} from '../Layout';

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
	name: 'ui:LabeledIcon',

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
		css: PropTypes.object,
		icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		iconComponent: PropTypes.node,
		labelPosition: PropTypes.oneOf(['above', 'after', 'before', 'below', 'left', 'right']),

		/**
		 * Applies the `pressed` CSS class to the [IconBase]{@link ui/Icon.IconBase}
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * Applies the `small` CSS class to the [IconBase]{@link ui/Icon.IconBase}
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		small: PropTypes.bool
	},

	defaultProps: {
		labelPosition: 'below'
	},

	styles: {
		css: componentCss,
		className: 'labeledIcon',
		publicClassNames: true
	},

	computed: {
		className: ({labelPosition, styler}) => styler.append(labelPosition, {
			// If the LabeledIcon isn't in our known set, apply our custom font class
			// dingbat: !(LabeledIcon in LabeledIconList),
			// pressed,
			// small
		}),
		orientation: ({labelPosition}) => (labelPosition === 'above' || labelPosition === 'below') ? 'vertical' : 'horizontal'
	},
	// computed: {
	// 	iconComponent: ({css, iconComponent}) => (
	// 		<ComponentOverride
	// 			component={iconComponent}
	//
	// 		/>
	// 	)
	// },

	render: ({css, children, icon, iconComponent, pressed, small, ...rest}) => {
		delete rest.labelPosition;

		return (
			<Layout
				align="center center"
				{...rest}
			>
				<Cell shrink size="100%" component={iconComponent} className={css.icon} pressed={pressed} small={small}>{icon}</Cell>
				<Cell shrink component="label" className={css.label}>{children}</Cell>
			</Layout>
		);
	}
});

export default LabeledIcon;
export {
	LabeledIcon
};
