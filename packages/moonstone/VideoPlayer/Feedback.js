import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';
import PropTypes from 'prop-types';

import FeedbackIcon from './FeedbackIcon';
import states from './FeedbackIcons.js';

import css from './Feedback.module.less';

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
		children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

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
		 * If the current `playbackState` allows this component's visibility to be changed,
		 * this component will be hidden. If not, setting this property will have no effect.
		 * All `playbackState`s respond to this property except the following:
		 * `'rewind'`, `'slowRewind'`, `'fastForward'`, `'slowForward'`.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		visible: PropTypes.bool
	},

	defaultProps: {
		visible: true
	},

	styles: {
		css,
		className: 'feedback'
	},

	computed: {
		className: ({styler, visible}) => styler.append({hidden: !visible}),
		children: ({children, playbackState: s}) => {
			if (states[s]) {
				// Working with a known state, treat `children` as playbackRate
				if (states[s].message && children !== 1) {	// `1` represents a playback rate of 1:1
					return children.toString().replace(/^-/, '') + states[s].message;
				}
			} else {
				// Custom Message
				return children;
			}
		}
	},

	render: ({children, playbackState, ...rest}) => {
		delete rest.visible;
		return (
			<div {...rest}>
				{states[playbackState] && states[playbackState].position === 'before' ? <FeedbackIcon>{playbackState}</FeedbackIcon> : null}
				{children ? <div className={css.message}>{children}</div> : null}
				{states[playbackState] && states[playbackState].position === 'after' ? <FeedbackIcon>{playbackState}</FeedbackIcon> : null}
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
