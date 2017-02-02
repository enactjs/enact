import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';
import Icon from '../Icon';

import css from './VideoPlayer.less';

const states = {
	play			: {iconStart: null,				iconEnd: 'play',			message: null},
	pause			: {iconStart: null,				iconEnd: 'pause',			message: null},
	rewind			: {iconStart: 'backward',		iconEnd: null,				message: 'x'},
	slowRewind		: {iconStart: 'pausebackward',	iconEnd: null,				message: 'x'},
	fastForward		: {iconStart: null,				iconEnd: 'forward',			message: 'x'},
	slowForward		: {iconStart: null,				iconEnd: 'pauseforward',	message: 'x'},
	jumpBackward	: {iconStart: 'skipbackward',	iconEnd: null,				message: null},
	jumpForward		: {iconStart: null,				iconEnd: 'skipforward',		message: null},
	jumpToStart		: {iconStart: 'skipbackward',	iconEnd: null,				message: null},
	jumpToEnd		: {iconStart: null,				iconEnd: 'skipforward',		message: null},
	stop			: {iconStart: null,				iconEnd: null,				message: null}
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
		children: React.PropTypes.string,
		state: React.PropTypes.oneOf(Object.keys(states))
	},

	styles: {
		css,
		className: 'feedback'
	},

	computed: {
		iconStart: ({state}) => (states[state] && states[state].iconStart ? <Icon className={css.icon}>{states[state].iconStart}</Icon> : null),
		iconEnd: ({state}) => (states[state] && states[state].iconEnd ? <Icon className={css.icon}>{states[state].iconEnd}</Icon> : null),
		children: ({children, state}) => ((children !== 1 ? children : '') + (states[state] && states[state].message ? states[state].message : ''))
	},

	render: ({children, iconStart, iconEnd, ...rest}) => (
		<div {...rest}>
			{iconStart}
			{children ? <div className={css.message}>{children}</div> : null}
			{iconEnd}
		</div>
	)
});

const Feedback = onlyUpdateForKeys(['children', 'state'])(FeedbackBase);

export default Feedback;
export {
	Feedback,
	FeedbackBase
};

/**
 * Sets the current state for a {@link module:moonstone-extra/VideoFeedback~VideoFeedback} control.
 *
 * @param {String} msg - The string to display.
 * @param {moon.VideoTransportSlider~FeedbackParameterObject} params - A
 *	[hash]{@glossary Object} of parameters accompanying the message.
 * @param {Boolean} persist - If `true`, the [feedback]{@link module:moonstone-extra/VideoFeedback~VideoFeedback}
 * control will not be automatically hidden.
 * @param {String} leftSrc - The source url for the image displayed on the left side
 *	of the feedback control.
 * @param {String} rightSrc - The source url for the image displayed on the right
 *	side of the feedback control.
 * @param {Boolean} preview - Specify `true` to put the
 * [video player]{@link module:moonstone-extra/VideoPlayer~VideoPlayer} in preview mode; otherwise, `false`.
 * @public
 */
const feedback = function (msg, params, persist, leftSrc, rightSrc, preview) {
	let customMessage = false;
	msg = msg || '';
	params = params || {};

	switch (msg) {
		case 'Play':
			msg = '';
			rightSrc = this.retrieveImgOrIconPath(this._playImg);
			break;

		case 'Pause':
			msg = '';
			rightSrc = this.retrieveImgOrIconPath(this._pauseImg);
			break;

		case 'Rewind':
			msg = Math.abs(params.playbackRate) + 'x';
			leftSrc = this.retrieveImgOrIconPath(this._rewindImg);
			break;

		case 'Slowrewind':
			msg = params.playbackRate.split('-')[1] + 'x';
			leftSrc = this.retrieveImgOrIconPath(this._pauseBackImg);
			break;

		case 'Fastforward':
			msg = params.playbackRate + 'x';
			rightSrc = this.retrieveImgOrIconPath(this._fastForwardImg);
			break;

		case 'Slowforward':
			msg = params.playbackRate + 'x';
			rightSrc = this.retrieveImgOrIconPath(this._pauseForwardImg);
			break;

		case 'JumpBackward':
			msg = '';
			leftSrc = this.retrieveImgOrIconPath(this._pauseJumpBackImg);
			break;

		case 'JumpForward':
			msg = '';
			rightSrc = this.retrieveImgOrIconPath(this._pauseJumpForwardImg);
			break;

		case 'JumpToStart':
			msg = '';
			leftSrc = this.retrieveImgOrIconPath(this._pauseJumpBackImg);
			break;

		case 'JumpToEnd':
			msg = '';
			rightSrc = this.retrieveImgOrIconPath(this._pauseJumpForwardImg);
			break;

		case 'Stop':
			msg = '';
			rightSrc = '';
			break;

	// If the user sends in a custom message, block other messages until it's hidden
		default:
			customMessage = true;
			this._showingFeedback = true;
			break;
	}

	// Don't show feedback if we are showing custom feedback already, unless this is a new custom message
	if (!customMessage && this._showingFeedback) return;
	// If msg is '', we do not need to show
	this.$.feedText.set('showing', !!msg);
	// Set content as _inMessage_
	this.$.feedText.setContent( this.get('uppercase') ? util.toUpperCase(msg) : msg);

	// Show output controls when video player is not preview mode
	if (!preview) this.showFeedback();

	// Show icons as appropriate
	this.updateIcons(leftSrc, rightSrc);

	//* Don't set up hide timer if _inPersistShowing_ is true
	if (persist) this.resetAutoTimer();
	else this.setAutoTimer();

	this.inPersistShowing = persist;
};
