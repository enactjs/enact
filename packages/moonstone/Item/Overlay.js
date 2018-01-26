// This is a sub-component to moonstone/Item, so it does not have a @module declaration
import kind from '@enact/core/kind';
import UIOverlay from '@enact/ui/Item/Overlay';
import React from 'react';
import PropTypes from 'prop-types';

import componentCss from './Item.less';

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
		css: PropTypes.object
	},

	defaultProps: {
		hidden: false
	},

	styles: {
		css: componentCss,
		className: 'overlay',
		publicClassNames: ['overlay', 'hidden']
	},

	render: ({css, ...rest}) => {
		if (!rest.children) return null;

		return (
			<UIOverlay
				{...rest}
				css={css}
			/>
		);
	}
});

export default Overlay;
export {
	Overlay
};
