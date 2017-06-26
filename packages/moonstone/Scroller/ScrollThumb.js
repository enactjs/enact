import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import css from './ScrollThumb.less';

/**
 * {@link moonstone/ScrollThumb.ScrollThumb} is a stateless ScrollThumb with Moonstone styling appied.
 *
 * @class ScrollThumb
 * @memberof moonstone/ScrollThumb
 * @ui
 * @public
 */
const ScrollThumb = kind({
	name: 'ScrollThumb',

	propTypes: /** @lends moonstone/ScrollThumb.ScrollThumb.prototype */ {
		/**
		 * The function to pass a wrapped ref.
		 *
		 * @type {Function}
		 * @public
		 */
		getScrollThumbRef: PropTypes.func,

		/**
		 * If `true`, the scrollbar will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @public
		 */
		vertical: PropTypes.bool
	},

	defaultProps: {
		getScrollThumbRef: null,
		vertical: true
	},

	styles: {
		css,
		className: 'scrollThumb'
	},

	computed: {
		className: ({vertical, styler}) => styler.append({vertical})
	},

	render: ({getScrollThumbRef, ...rest}) => {
		delete rest.vertical;

		return <div {...rest} ref={getScrollThumbRef} />;
	}
});

export default ScrollThumb;
export {
	ScrollThumb
};
