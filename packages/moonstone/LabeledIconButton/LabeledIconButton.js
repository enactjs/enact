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
import Touchable from '@enact/ui/Touchable';

import Skinnable from '../Skinnable';
import {IconBase} from '../Icon';

import buttonCss from '../Button/Button.less';
import uiButtonCss from '@enact/ui/Button/Button.less';
import iconButtonCss from '../IconButton/IconButton.less';

// This refers to the LabeledIcon styling, since they're the same.
// If this fact changes in the future, we can simply create a new less file in this component and
// either copy or less-import the styling rules from LabeledIcon. (Whichever is more appropriate.)
import componentCss from '../LabeledIcon/LabeledIcon.less';

// Tamper with the class names so they map to our class names (all in the name of perf)
componentCss.icon += ' ' + buttonCss.button;
componentCss.icon += ' ' + iconButtonCss.iconButton;
// buttonCss.icon = buttonCss.button;
// delete buttonCss.button;
// iconButtonCss.icon = iconButtonCss.iconButton;
// delete iconButtonCss.iconButton;

// componentCss.icon = componentCss.icon + ' ' + buttonCss.icon + ' ' + iconButtonCss.icon;

console.log('comonentCss:', componentCss);

const Icon = compose(
	Touchable({activeProp: 'pressed'}),
	Spottable,
	Skinnable
)(IconBase);

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
		 * The readable label. This accepts strings, DOM, and Components, if you need more elaborate
		 * features.
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
		 * * `LabeledIconButton` - The root component class
		 * * `label` - The label component class
		 * * `icon` - The icon component class
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object
	},

	styles: {
		css: {...componentCss, ...buttonCss, ...iconButtonCss},
		className: 'labeledIconButton',
		publicClassNames: ['labeledIconButton', 'icon', 'label']
	},

	computed: {
		simulatedIcon: ({css}) => (props) => (
			<div className={buttonCss.button}>
				<div className={buttonCss.bg} />
				<div className={buttonCss.client}><Icon {...props} /></div>
			</div>
		)
	},

	render: ({css, children, simulatedIcon, ...rest}) => {
		return (
			<UiLabeledIcon
				iconComponent={simulatedIcon}
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
