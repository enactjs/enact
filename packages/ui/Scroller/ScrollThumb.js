import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import css from './ScrollThumb.less';

/**
 * {@link ui/Scroller.ScrollThumb} is a stateless ScrollThumb.
 *
 * @class ScrollThumb
 * @memberof ui/Scroller
 * @ui
 * @public
 */
const ScrollThumb = kind({
	name: 'ScrollThumb',

	propTypes: /** @lends ui/Scroller.ScrollThumb.prototype */ {
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
