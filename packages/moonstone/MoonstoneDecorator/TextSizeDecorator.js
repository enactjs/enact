/**
 * Exports the {@link moonstone/MoonstoneDecorator.TextSizeDecorator} HOC
 *
 * @module moonstone/MoonstoneDecorator
 */

import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';

/**
 * Default config for {@link moonstone/MoonstoneDecorator.TextSizeDecorator}.
 *
 * @memberof moonstone/MoonstoneDecorator
 * @hocconfig
 */
const defaultConfig = {};

/**
 * {@link moonstone/MoonstoneDecorator.TextSizeDecorator} is a Higher-order Component classifies an
 * application with a target set of font sizing rules
 *
 * @class TextSizeDecorator
 * @memberof moonstone/MoonstoneDecorator
 * @hoc
 * @public
 */
const TextSizeDecorator = hoc(defaultConfig, (config, Wrapped) => kind({
	name: 'TextSizeDecorator',

	propTypes: {
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

	styles: {},

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
