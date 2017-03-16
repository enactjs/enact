/**
 * Exports the {@link moonstone/MoonstoneDecorator.TextSizeDecorator} HOC
 *
 * @module moonstone/MoonstoneDecorator
 */

import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';

/**
 * {@link moonstone/MoonstoneDecorator.TextSizeDecorator} is a Higher-order Component classifies an
 * application with a target set of font sizing rules
 *
 * @class TextSizeDecorator
 * @memberof moonstone/MoonstoneDecorator
 * @hoc
 * @public
 */
const TextSizeDecorator = hoc((config, Wrapped) => kind({
	name: 'TextSizeDecorator',

	propTypes: /** @lends moonstone/MoonstoneDecorator.TextSizeDecorator.prototype */ {
		/**
		 * Set the goal size of the text. The UI library will be responsible for using this
		 * information to adjust the components' text sizes to this preset.
		 * Current presets are `'normal'` (default), and `'large'`.
		 *
		 * @type {String}
		 * @default 'normal'
		 * @public
		 */
		textSize: React.PropTypes.oneOf(['normal', 'large'])
	},

	defaultProps: {
		textSize: 'normal'
	},

	styles: {},	// Empty `styles` tells `kind` that we want to use `styler` later and don't have a base className.

	computed: {
		className: ({textSize, styler}) => styler.append('enact-text-' + textSize)
	},

	render: (props) => {
		delete props.textSize;
		return (
			<Wrapped {...props} />
		);
	}
}));

export default TextSizeDecorator;
export {TextSizeDecorator};
