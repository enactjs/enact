/**
 * Exports the {@link module:@enact/moonstone/Divider~Divider} component.
 *
 * @module @enact/moonstone/Divider
 */

import kind from '@enact/core/kind';
import {cap} from '@enact/core/util';
import React, {PropTypes} from 'react';

import css from './Divider.less';
import Marquee from '../Marquee';

/**
 * {@link module:@enact/moonstone/Divider~Divider} is a simply styled component that may be used as a separator
 * between groups of components.
 *
 * @class Divider
 * @ui
 * @public
 */
const DividerBase = kind({
	name: 'Divider',

	propTypes: {
		/**
		 * The content of the divider.
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
