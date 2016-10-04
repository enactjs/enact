/**
 * Exports the {@link module:@enact/moonstone/Divider~Divider} and {@link module:@enact/moonstone/Divider~DividerBase}
 * components.  The default export is {@link module:@enact/moonstone/Divider~DividerBase}.
 *
 * @module @enact/moonstone/Divider
 */

import kind from '@enact/core/kind';
import {cap} from '@enact/core/util';
import React, {PropTypes} from 'react';

import css from './Divider.less';
import Marquee from '../Marquee';

/**
 * {@link module:@enact/moonstone/Divider~DividerBase} is a simply styled component that may be used as a separator
 * between groups of components.
 *
 * @class DividerBase
 * @ui
 * @public
 */
const DividerBase = kind({
	name: 'Divider',

	propTypes: {
		/**
		 * Set the content of the divider.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		children: PropTypes.string.isRequired
	},

	styles: {
		css,
		className: 'divider divider-text'
	},

	computed: {
		content: ({children}) => children.split(' ').map(cap).join(' ')
	},

	render: ({content, ...rest}) => (
		<Marquee {...rest}>{content}</Marquee>
	)
});

export default DividerBase;
export {DividerBase as Divider, DividerBase};
