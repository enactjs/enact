/**
 * Provides Moonstone-themed overlay components and behaviors.
 *
 * @module moonstone/Item
 * @exports Overlay
 */

import kind from '@enact/core/kind';
import UIOverlay from '@enact/ui/Item/Overlay';
import React from 'react';
import PropTypes from 'prop-types';

import componentCSS from './Item.less';

/**
 * A moonstone-styled Overlay without any behavior.
 *
 * @class Overlay
 * @memberof moonstone/Item
 * @ui
 * @public
 */
const Overlay = kind({
	name: 'Overlay',

	propTypes: /** @lends moonstone/Item.Overlay.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `overlay` - The root component class
		 * * `hidden` - Applied when `hidden` prop is true
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * When `true`, the component is no longer visually reprenested on screen.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		hidden: PropTypes.bool
	},

	defaultProps: {
		hidden: false
	},

	styles: {
		css: componentCSS,
		publicClassNames: ['overlay', 'hidden']
	},

	computed: {
		className: ({hidden, styler}) => styler.append({hidden})
	},

	render: ({...rest}) => {
		if (!rest.children) return null;

		return (
			<UIOverlay
				{...rest}
			/>
		);
	}
});

export default Overlay;
export {
	Overlay
};
