import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import css from './ScrollThumb.less';

/**
 * A basic scroll thumb without any behavior.
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
		 * The function to pass a wrapped ref.
		 *
		 * @type {Function}
		 * @public
		 */
		setRef: PropTypes.func,

		/**
		 * If `true`, the scrollbar will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @public
		 */
		vertical: PropTypes.bool
	},

	defaultProps: {
		setRef: null,
		vertical: true
	},

	styles: {
		css,
		className: 'scrollThumb'
	},

	computed: {
		className: ({vertical, styler}) => styler.append({vertical})
	},

	render: ({setRef, ...rest}) => {
		delete rest.vertical;

		return <div {...rest} ref={setRef} />;
	}
});

export default ScrollThumb;
export {
	ScrollThumb
};
