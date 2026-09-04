import classNames from 'classnames';
import {memo} from 'react';

import css from './ScrollbarTrack.module.less';

export interface ScrollbarTrackProps /** @lends ui/useScroll.ScrollbarTrack.prototype */ {
	/**
	 * Forwards a reference to the DOM element.
	 *
	 * @type {Object}
	 * @private
	 */
	ref: {current: any},

	/**
	 * If `true`, the scrollbar will be oriented vertically.
	 *
	 * @type {Boolean}
	 * @default true
	 * @public
	 */
	vertical: boolean
}

/**
 * An unstyled scroll track without any behavior.
 *
 * @function ScrollbarTrack
 * @memberof ui/useScroll
 * @ui
 * @private
 */
const ScrollbarTrack = (props: ScrollbarTrackProps) => {
	const
		{ref = null, vertical = true, ...rest} = props,
		className = classNames(css.scrollbarTrack, vertical ? css.vertical : null);

	return <div {...rest} className={className} ref={ref} />;
};

const MemoizedScrollbarTrack = memo(ScrollbarTrack);

MemoizedScrollbarTrack.displayName = 'ui:ScrollbarTrack';

export default MemoizedScrollbarTrack;
export {
	MemoizedScrollbarTrack,
	MemoizedScrollbarTrack as ScrollbarTrackBase
};
