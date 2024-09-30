import classNames from 'classnames';
import PropTypes from 'prop-types';
import {forwardRef, memo} from 'react';

import css from './ScrollbarTrack.module.scss';

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
		{vertical = true, ...rest} = props,
		className = classNames(css.scrollbarTrack, vertical ? css.vertical : null);

	return <div {...rest} className={className} ref={ref} />;
});

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

const MemoizedScrollbarTrack = memo(ScrollbarTrack);

MemoizedScrollbarTrack.displayName = 'ui:ScrollbarTrack';

export default MemoizedScrollbarTrack;
export {
	MemoizedScrollbarTrack,
	MemoizedScrollbarTrack as ScrollbarTrackBase
};
