import classNames from 'classnames';
import PropTypes from 'prop-types';
import {forwardRef} from 'react';

import css from './ScrollbarTrack.module.less';

/**
 * An unstyled scroll track without any behavior.
 *
 * @function ScrollbarTrack
 * @memberof ui/useScroll
 * @ui
 * @private
 */
const ScrollbarTrack = forwardRef((props, ref) => {
	const
		{vertical, ...rest} = props,
		className = classNames(css.scrollbarTrack, vertical ? css.vertical : null);

	return <div {...rest} className={className} ref={ref} />;
});

ScrollbarTrack.displayName = 'ui:ScrollbarTrack';

ScrollbarTrack.propTypes = /** @lends ui/useScroll.ScrollbarTrack.prototype */ {
	/**
	 * If `true`, the scrollbar will be oriented vertically.
	 *
	 * @type {Boolean}
	 * @default true
	 * @public
	 */
	vertical: PropTypes.bool
};

ScrollbarTrack.defaultProps = {
	vertical: true
};

export default ScrollbarTrack;
export {
	ScrollbarTrack,
	ScrollbarTrack as ScrollbarTrackBase
};
