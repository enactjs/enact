import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

/**
 * {@link moonstone/MoonstoneDecorator.AccessibilityDecorator} is a Higher-order Component that
 * classifies an application with a target set of font sizing rules
 *
 * @class AccessibilityDecorator
 * @memberof moonstone/MoonstoneDecorator
 * @hoc
 * @public
 */
const AccessibilityDecorator = hoc((config, Wrapped) => kind({
	name: 'AccessibilityDecorator',

	propTypes: /** @lends moonstone/MoonstoneDecorator.AccessibilityDecorator.prototype */ {
		/**
		 * Enables additional features to help users visually differentiate components.
		 * The UI library will be responsible for using this information to adjust
		 * the components' contrast to this preset.
		 *
		 * @type {Boolean}
		 * @public
		 */
		highContrast: PropTypes.bool,

		/**
		 * Set the goal size of the text. The UI library will be responsible for using this
		 * information to adjust the components' text sizes to this preset.
		 * Current presets are `'normal'` (default), and `'large'`.
		 *
		 * @type {String}
		 * @default 'normal'
		 * @public
		 */
		textSize: PropTypes.oneOf(['normal', 'large'])
	},

	defaultProps: {
		highContrast: false,
		textSize: 'normal'
	},

	styles: {},	// Empty `styles` tells `kind` that we want to use `styler` later and don't have a base className.

	computed: {
		className: ({highContrast, textSize, styler}) => styler.append({
			['enact-a11y-high-contrast']: highContrast,
			['enact-text-' + (textSize)]: textSize
		})
	},

	render: (props) => {
		delete props.highContrast;
		delete props.textSize;
		return (
			<Wrapped {...props} />
		);
	}
}));

export default AccessibilityDecorator;
export {AccessibilityDecorator};
