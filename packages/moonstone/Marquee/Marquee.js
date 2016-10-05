/**
 * Exports the {@link module:@enact/moonstone/Marquee~Marquee} and {@link module:@enact/moonstone/Marquee~MarqueeBase}
 * components. The default export is {@link module:@enact/moonstone/Marquee~Marquee}.
 *
 * @module @enact/moonstone/Marquee
 */

import kind from '@enact/core/kind';
import React from 'react';

import MarqueeDecorator from './MarqueeDecorator';
import css from './Marquee.less';

/**
 * {@link module:@enact/moonstone/Marquee~MarqueeBase} is a stateless text container element which
 * implements a text cut-off followed by an ellipsis character.
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
		 * {@link module:@enact/moonstone/Marquee~Marquee} component.
		 * This prop may be empty in some cases, which is OK.
		 *
		 * @type {Node|Node[]}
		 */
		children: React.PropTypes.node
	},

	styles: {
		css,
		className: 'marquee'
	},

	render: ({children, marqueeRef, ...rest}) => (
		<div {...rest}>
			<div className={css.text} ref={marqueeRef}>
				{children}
			</div>
		</div>
	)
});

const Marquee = MarqueeDecorator('div');

export default Marquee;
export {
	Marquee,
	MarqueeDecorator
};
