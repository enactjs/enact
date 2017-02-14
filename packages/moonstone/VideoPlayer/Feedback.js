import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';

import css from './Feedback.less';
import FeedbackIcon from './FeedbackIcon';

const states = {
	play          : {allowHide: true,   message: null,  position: 'after'},
	pause         : {allowHide: true,   message: null,  position: 'after'},
	rewind        : {allowHide: false,  message: 'x',   position: 'before'},
	slowRewind    : {allowHide: false,  message: 'x',   position: 'before'},
	fastForward   : {allowHide: false,  message: 'x',   position: 'after'},
	slowForward   : {allowHide: false,  message: 'x',   position: 'after'},
	jumpBackward  : {allowHide: true,   message: null,  position: 'before'},
	jumpForward   : {allowHide: true,   message: null,  position: 'after'},
	jumpToStart   : {allowHide: true,   message: null,  position: 'before'},
	jumpToEnd     : {allowHide: true,   message: null,  position: 'after'},
	stop          : {allowHide: true,   message: null,  position: null}
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
				{states[playbackState].position === 'before' ? <FeedbackIcon>{playbackState}</FeedbackIcon> : null}
				{children ? <div className={css.message}>{children}</div> : null}
				{states[playbackState].position === 'after' ? <FeedbackIcon>{playbackState}</FeedbackIcon> : null}
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
