/**
 * Provides unstyled LabeledIconButton components to be customized by a theme or application.
 *
 * @module ui/LabeledIconButton
 * @exports LabeledIconButton
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';
import compose from 'ramda/src/compose';
import Spottable from '@enact/spotlight/Spottable';
import Pure from '@enact/ui/internal/Pure';
import UiLabeledIcon from '@enact/ui/LabeledIcon';
import {IconButtonDecorator as UiIconButtonDecorator} from '@enact/ui/IconButton';

import Skinnable from '../Skinnable';
import {IconButtonBase} from '../IconButton';

import componentCss from './LabeledIconButton.less';


const IconButton = compose(
	Pure,
	UiIconButtonDecorator,
	Spottable,
	Skinnable
)(IconButtonBase);

/**
 * A basic LabeledIconButton component structure without any behaviors applied to it.
 *
 * @class LabeledIconButtonBase
 * @memberof ui/LabeledIconButton
 * @ui
 * @public
 */
const LabeledIconButtonBase = kind({
	name: 'LabeledIconButton',

	propTypes: /** @lends ui/LabeledIconButton.LabeledIconButtonBase.prototype */ {
		/**
		 * The LabeledIconButton content.
		 *
		 * May be specified as either:
		 *
		 * * A string that represents an LabeledIconButton from the [LabeledIconList]{@link ui/LabeledIconButton.LabeledIconButtonBase.LabeledIconList},
		 * * An HTML entity string, Unicode reference or hex value (in the form '0x...'),
		 * * A URL specifying path to an LabeledIconButton image, or
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
		 * * `LabeledIconButton` - The root component class
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
		className: 'labeledIconButton',
		publicClassNames: ['labeledIconButton', 'icon', 'label']
	},

	computed: {
		iconComponent: ({icon}) => (typeof icon === 'string' ? <IconButton>{icon}</IconButton> : icon)
	// 	className: ({children: LabeledIconButton, LabeledIconList, pressed, small, styler}) => styler.append({
	// 		// If the LabeledIconButton isn't in our known set, apply our custom font class
	// 		dingbat: !(LabeledIconButton in LabeledIconList),
	// 		pressed,
	// 		small
	// 	})
	},

	render: ({css, children, iconComponent, ...rest}) => {
		// delete rest.small;

		return (
			<UiLabeledIcon
				iconComponent={iconComponent}
				{...rest}
				css={css}
			>
				{children}
			</UiLabeledIcon>
		);
	}
});

const LabeledIconButtonDecorator = compose(
	Pure,
	Skinnable
);

const LabeledIconButton = LabeledIconButtonDecorator(LabeledIconButtonBase);

export default LabeledIconButton;
export {
	LabeledIconButton,
	LabeledIconButtonBase,
	LabeledIconButtonDecorator
};
