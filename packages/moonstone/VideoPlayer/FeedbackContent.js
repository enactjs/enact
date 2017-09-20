import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';
import PropTypes from 'prop-types';

import Feedback from './Feedback';
import states from './FeedbackIcons.js';

/**
 * FeedbackContent {@link moonstone/VideoPlayer}. This displays the media's playback rate and other
 * information.
 *
 * @class FeedbackContent
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
const FeedbackContentBase = kind({
	name: 'FeedbackContent',

	propTypes: /** @lends moonstone/VideoPlayer.Feedback.prototype */ {
		/**
		 * If the current `playbackState` allows the feedback component's visibility to be changed,
		 * the feedback component will be hidden. If not, setting this property will have no effect.
		 * All `playbackState`s respond to this property except the following:
		 * `'rewind'`, `'slowRewind'`, `'fastForward'`, `'slowForward'`.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		feedbackVisible: PropTypes.bool,

		/**
		 * Value of the feedback playback rate
		 *
		 * @type {String|Number}
		 * @public
		 */
		playbackRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

		/**
		 * Refers to one of the following possible media playback states.
		 * `'play'`, `'pause'`, `'rewind'`, `'slowRewind'`, `'fastForward'`, `'slowForward'`,
		 * `'jumpBackward'`, `'jumpForward'`, `'jumpToStart'`, `'jumpToEnd'`, `'stop'`.
		 *
		 * Each state understands where its related icon should be positioned, and whether it should
		 * respond to changes to the `visible` property.
		 *
		 * This string feeds directly into {@link moonstone/FeedbackIcon.FeedbackIcon}.
		 *
		 * @type {String}
		 * @public
		 */
		playbackState: PropTypes.oneOf(Object.keys(states)),

		/**
		 * The visibility of the component. When `false`, the component will be hidden.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		visible: PropTypes.bool
	},

	defaultProps: {
		feedbackVisible: true,
		visible: true
	},

	render: ({children, playbackRate, playbackState, feedbackVisible, visible, ...rest}) => {
		return (
			<div {...rest} style={!visible ? {display: 'none'} : null}>
				<Feedback
					playbackState={playbackState}
					visible={feedbackVisible}
				>
					{playbackRate}
				</Feedback>
				{children}
			</div>
		);
	}
});

const FeedbackContent = onlyUpdateForKeys(['children', 'feedbackVisible', 'playbackRate', 'playbackState', 'visible'])(FeedbackContentBase);

export default FeedbackContent;
export {
	FeedbackContent,
	FeedbackContentBase
};
