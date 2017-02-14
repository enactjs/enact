import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';

import css from './Feedback.less';
import FeedbackIcon from './FeedbackIcon';

const states = {
	play          : {allowHide: true,   message: null},
	pause         : {allowHide: true,   message: null},
	rewind        : {allowHide: false,  message: 'x'},
	slowRewind    : {allowHide: false,  message: 'x'},
	fastForward   : {allowHide: false,  message: 'x'},
	slowForward   : {allowHide: false,  message: 'x'},
	jumpBackward  : {allowHide: true,   message: null},
	jumpForward   : {allowHide: true,   message: null},
	jumpToStart   : {allowHide: true,   message: null},
	jumpToEnd     : {allowHide: true,   message: null},
	stop          : {allowHide: true,   message: null}
};

/**
 * Feedback {@link moonstone/VideoPlayer}. This displays the media's playback rate and other
 * information.
 *
 * @class Feedback
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
const FeedbackBase = kind({
	name: 'Feedback',

	propTypes: /** @lends moonstone/VideoPlayer.Feedback.prototype */ {
		children: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),

		/**
		 * Refers to one of the following possible media playback states.
		 * "play", "pause", "rewind", "slowRewind", "fastForward", "slowForward", "jumpBackward",
		 * "jumpForward", "jumpToStart", "jumpToEnd", "stop".
		 *
		 * Each state understands where its related icon should be positioned, and whether it should
		 * respond to changes to the `visible` property.
		 *
		 * @type {String}
		 * @public
		 */
		playbackState: React.PropTypes.oneOf(Object.keys(states)),

		/**
		 * If the current `playbackState` allows the this component's visibility to be changed,
		 * this component will be hidden. If not, setting this property will have no effect.
		 * All `playbackState`s respond to this property except the following:
		 * "rewind", "slowRewind", "fastForward", "slowForward".
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		visible: React.PropTypes.bool
	},

	defaultProps: {
		visible: true
	},

	styles: {
		css,
		className: 'feedback'
	},

	computed: {
		className: ({playbackState: s, styler, visible}) => styler.append({hidden: !visible && states[s] && states[s].allowHide}),
		children: ({children, playbackState: s}) => {
			if (states[s]) {
				// Working with a known state
				if (states[s].message && children !== 1) {
					return children + states[s].message;
				}
			} else {
				// Custom Message
				return children;
			}
		}
	},

	render: ({children, playbackState, ...rest}) => {
		delete rest.playbackState;
		delete rest.visible;
		return (
			<div {...rest}>
				<FeedbackIcon position="before" playbackState={playbackState} />
				{children ? <div className={css.message}>{children}</div> : null}
				<FeedbackIcon position="after" playbackState={playbackState} />
			</div>
		);
	}
});

const Feedback = onlyUpdateForKeys(['children', 'playbackState', 'visible'])(FeedbackBase);

export default Feedback;
export {
	Feedback,
	FeedbackBase
};
