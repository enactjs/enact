/**
 * Exports the {@link module:enact-moonstone/Marquee~Marquee} and {@link module:enact-moonstone/Marquee~MarqueeBase}
 * components. The default export is {@link module:enact-moonstone/Marquee~Marquee}.
 *
 * @module enact-moonstone/Button
 */

import kind from 'enact-core/kind';
import React, {PropTypes} from 'react';

import css from './Marquee.less';

/**
 * {@link module:enact-moonstone/Marquee~MarqueeBase} is a stateless text container element which
 * implements a text cutt-off followed by an ellipsis character.
 *
 * @class MarqueeBase
 * @ui
 * @public
 */
const MarqueeBase = kind({
	name: 'Marquee',

	propTypes: {
		/**
		 * `children` is the text or components that should be scrolled by the
		 * {@link module:enact-moonstone/Marquee~Marquee} component.
		 * This prop may be empty in some cases, which is OK.
		 *
		 * @type {Node|Node[]}
		 */
		children: PropTypes.node
	},

	styles: {
		css,
		className: 'marquee'
	},

	render: (props) => (
		<div {...props} />
	)
});

export default MarqueeBase;
export {MarqueeBase as Marquee, MarqueeBase};
