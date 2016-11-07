/**
 * Exports the {@link moonstone/Divider.Divider} component.
 *
 * @module moonstone/Divider
 */

import kind from '@enact/core/kind';
import {cap} from '@enact/core/util';
import React, {PropTypes} from 'react';

import css from './Divider.less';
import {MarqueeDecorator} from '../Marquee';

const MarqueeH3 = MarqueeDecorator('h3');

/**
 * {@link moonstone/Divider.Divider} is a simply styled component that may be used as a separator
 * between groups of components.
 *
 * @class Divider
 * @memberof moonstone/Divider
 * @ui
 * @public
 */
const DividerBase = kind({
	name: 'Divider',

	propTypes: /** @lends moonstone/Divider.Divider.prototype */ {
		/**
		 * The content of the divider.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string
	},

	styles: {
		css,
		className: 'divider'
	},

	computed: {
		content: ({children}) => children ? children.split(' ').map(cap).join(' ') : ''
	},

	render: ({content, ...rest}) => (
		<MarqueeH3 {...rest} marqueeOn="hover">{content}</MarqueeH3>
	)
});

export default DividerBase;
export {DividerBase as Divider, DividerBase};
