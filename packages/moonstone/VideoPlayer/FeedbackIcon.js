import kind from '@enact/core/kind';
import React from 'react';

import Icon from '../Icon';

import css from './Feedback.less';

const iconMap = {
	play          : 'play',
	pause         : 'pause',
	rewind        : 'backward',
	slowRewind    : 'pausebackward',
	fastForward   : 'forward',
	slowForward   : 'pauseforward',
	jumpBackward  : 'skipbackward',
	jumpForward   : 'skipforward',
	jumpToStart   : 'skipbackward',
	jumpToEnd     : 'skipforward',
	stop          : null
};

/**
 * Feedback Icon for {@link moonstone/VideoPlayer.Feedback}.
 *
 * @class FeedbackIcon
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
const FeedbackIconBase = kind({
	name: 'FeedbackIcon',

	propTypes: {
		children: React.PropTypes.string
	},

	styles: {
		css,
		className: 'icon'
	},

	computed: {
		children: ({children}) => children && iconMap[children],
		className: ({children, styler}) => styler.append({
			shrink: children === 'play' || children === 'pause'
		})
	},

	render: ({children, ...rest}) => {
		if (children) {
			return (
				<Icon {...rest}>{children}</Icon>
			);
		}

		return null;
	}
});

export default FeedbackIconBase;
export {
	FeedbackIconBase as FeedbackIcon,
	FeedbackIconBase
};
