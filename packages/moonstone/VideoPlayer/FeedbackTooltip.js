import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';
import PropTypes from 'prop-types';

import Image from '../Image';
import Skinnable from '../Skinnable';

import Feedback from './Feedback';
import states from './FeedbackIcons.js';

import css from './FeedbackTooltip.less';

/**
 * FeedbackTooltip {@link moonstone/VideoPlayer}. This displays the media's playback rate and
 * time information.
 *
 * @class FeedbackTooltip
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
const FeedbackTooltipBase = kind({
	name: 'FeedbackTooltip',

	propTypes: /** @lends moonstone/VideoPlayer.FeedbackTooltip.prototype */ {
		/**
		 * When `true`, only time would appear in tooltip.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noFeedback: PropTypes.bool,

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
		 * `true` if Slider knob is scrubbing.
		 *
		 * @type {Boolean}
		 * @public
		 */
		scrubbing: PropTypes.bool,

		/**
		 * Set a thumbnail image source to show on VideoPlayer's Slider knob. This is a standard
		 * {@link moonstone/Image} component so it supports all of the same options for the `src`
		 * property. If no `thumbnailSrc` is set, no tooltip will display.
		 *
		 * @type {String|Object}
		 * @public
		 */
		thumbnailSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

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
		noFeedback: false,
		scrubbing: false,
		visible: true
	},

	styles: {
		css,
		className: 'feedbackTooltip'
	},

	computed: {
		className: ({playbackState: s, scrubbing, styler, visible}) => styler.append({
			hidden: !visible && states[s] && states[s].allowHide,
			scrubbing
		})
	},

	render: ({children, noFeedback, playbackState, playbackRate, thumbnailSrc, ...rest}) => {
		delete rest.visible;
		delete rest.scrubbing;
		return (
			<div {...rest}>
				{thumbnailSrc ? <div className={css.thumbnail} style={!noFeedback ? {display: 'none'} : null}>
					<Image src={thumbnailSrc} className={css.image} />
				</div> : null}
				<div className={css.content}>
					<Feedback
						playbackState={playbackState}
						visible={!noFeedback}
					>
						{playbackRate}
					</Feedback>
					{children}
				</div>
			</div>
		);
	}
});

const FeedbackTooltip = onlyUpdateForKeys(
	['children', 'noFeedback', 'playbackState', 'playbackRate', 'scrubbing', 'thumbnailSrc', 'visible']
)(
	Skinnable(
		FeedbackTooltipBase
	)
);

export default FeedbackTooltip;
export {
	FeedbackTooltip,
	FeedbackTooltipBase
};
