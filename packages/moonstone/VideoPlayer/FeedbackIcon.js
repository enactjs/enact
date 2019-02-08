import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import Skinnable from '../Skinnable';

import Icon from '../Icon';
import iconMap from './FeedbackIcons.js';

import css from './Feedback.module.less';


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
		children: PropTypes.oneOf(Object.keys(iconMap))
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

const FeedbackIcon = Skinnable(FeedbackIconBase);

export default FeedbackIcon;
export {
	FeedbackIcon,
	FeedbackIconBase
};
