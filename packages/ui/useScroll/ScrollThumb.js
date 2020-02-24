import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {forwardRef} from 'react';

import css from './ScrollThumb.module.less';

/**
 * An unstyled scroll thumb without any behavior.
 *
 * @function ScrollThumb
 * @memberof ui/Scrollable
 * @ui
 * @private
 */
const ScrollThumb = forwardRef((props, ref) => {
	const
		{vertical, ...rest} = props,
		className = classNames(css.scrollThumb, vertical ? css.vertical : null);

	return <div {...rest} className={className} ref={ref} />;
});

ScrollThumb.displayName = 'ui:ScrollThumb';

ScrollThumb.propTypes = /** @lends ui/Scrollable.ScrollThumb.prototype */ {
	/**
	 * If `true`, the scrollbar will be oriented vertically.
	 *
	 * @type {Boolean}
	 * @default true
	 * @public
	 */
	vertical: PropTypes.bool
};

ScrollThumb.defaultProps = {
	vertical: true
};

export default ScrollThumb;
export {
	ScrollThumb,
	ScrollThumb as ScrollThumbBase
};
