/**
 * Provides unstyled LabeledIcon components to be customized by a theme or application.
 *
 * @module moonstone/LabeledIcon
 * @exports LabeledIcon
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import Pure from '@enact/ui/internal/Pure';
import UiLabeledIcon from '@enact/ui/LabeledIcon';

import {IconBase} from '../Icon';
import Skinnable from '../Skinnable';

import componentCss from './LabeledIcon.less';

// Make a basic Icon. This cuts `Pure` out of icon for a small gain.
const Icon = Skinnable(IconBase);

/**
 * A basic LabeledIcon component structure without any behaviors applied to it.
 *
 * @class LabeledIconBase
 * @memberof moonstone/LabeledIcon
 * @ui
 * @public
 */
const LabeledIconBase = kind({
	name: 'LabeledIcon',

	propTypes: /** @lends moonstone/LabeledIcon.LabeledIconBase.prototype */ {
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

	render: (props) => {
		return UiLabeledIcon.inline({
			...props,
			iconComponent: Icon,
			css: props.css
		});
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
