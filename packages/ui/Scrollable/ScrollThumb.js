import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import css from './ScrollThumb.module.less';

/**
 * An unstyled scroll thumb without any behavior.
 *
 * @class ScrollThumb
 * @memberof ui/Scrollable
 * @ui
 * @private
 */
const ScrollThumb = kind({
	name: 'ui:ScrollThumb',

	propTypes: /** @lends ui/Scrollable.ScrollThumb.prototype */ {
		/**
		 * If `true`, the scrollbar will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		vertical: PropTypes.bool
	},

	defaultProps: {
		vertical: true
	},

	styles: {
		css,
		className: 'scrollThumb'
	},

	computed: {
		className: ({vertical, styler}) => styler.append({vertical})
	},

	render: (props) => {
		delete props.vertical;

		return <div {...props} />;
	}
});

export default ScrollThumb;
export {
	ScrollThumb,
	ScrollThumb as ScrollThumbBase
};
