import kind from '@enact/core/kind';
import React from 'react';

import Icon from '../Icon';

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

	propTypes: {
		placement: React.PropTypes.string,
		playbackState: React.PropTypes.string,
		states: React.PropTypes.arrayOf(React.PropTypes.object)
	},

	styles: {
		css,
		className: 'icon'
	},

	computed: {
		children: ({placement, playbackState, states}) => {
			return [playbackState] && states[playbackState][placement];
		},
		className: ({playbackState, styler}) => styler.append({
			shrink: playbackState === 'play' || playbackState === 'pause'
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
