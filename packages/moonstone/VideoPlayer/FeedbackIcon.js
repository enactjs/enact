import kind from '@enact/core/kind';
import React from 'react';

import Icon from '../Icon';

import css from './Feedback.less';

const states = {
	play          : {before: null,             after: 'play'},
	pause         : {before: null,             after: 'pause'},
	rewind        : {before: 'backward',       after: null},
	slowRewind    : {before: 'pausebackward',  after: null},
	fastForward   : {before: null,             after: 'forward'},
	slowForward   : {before: null,             after: 'pauseforward'},
	jumpBackward  : {before: 'skipbackward',   after: null},
	jumpForward   : {before: null,             after: 'skipforward'},
	jumpToStart   : {before: 'skipbackward',   after: null},
	jumpToEnd     : {before: null,             after: 'skipforward'},
	stop          : {before: null,             after: null}
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
		playbackState: React.PropTypes.string,
		position: React.PropTypes.string
	},

	styles: {
		css,
		className: 'icon'
	},

	computed: {
		className: ({playbackState, styler}) => styler.append({
			shrink: playbackState === 'play' || playbackState === 'pause'
		})
	},

	render: ({playbackState, position, ...rest}) => {

		const children = states[playbackState] && states[playbackState][position];
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
