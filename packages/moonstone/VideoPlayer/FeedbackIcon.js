import kind from '@enact/core/kind';
import React from 'react';

import Icon from '../Icon';
import iconMap from './FeedbackIcons.js';

import css from './Feedback.less';


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

	propTypes: /** @lends moonstone/VideoPlayer.FeedbackIcon.prototype */ {
		/**
		 * Refers to one of the following possible media playback states.
		 * `'play'`, `'pause'`, `'rewind'`, `'slowRewind'`, `'fastForward'`, `'slowForward'`,
		 * `'jumpBackward'`, `'jumpForward'`, `'jumpToStart'`, `'jumpToEnd'`, `'stop'`.
		 *
		 * @type {String}
		 * @public
		 */
		children: React.PropTypes.oneOf(Object.keys(iconMap))
	},

	styles: {
		css,
		className: 'icon'
	},

	computed: {
		children: ({children}) => children && iconMap[children] && iconMap[children].icon,
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
