/**
 * Exports the {@link moonstone/VideoPlayer.VideoPlayer} and
 * {@link moonstone/VideoPlayer.VideoPlayerBase} components. The default export is
 * {@link moonstone/VideoPlayer.VideoPlayer}.
 *
 * @module moonstone/VideoPlayer
 */
import React from 'react';
import PropTypes from 'prop-types';
import DurationFmt from '@enact/i18n/ilib/lib/DurationFmt';
import {forward} from '@enact/core/handle';
import ilib from '@enact/i18n';
import {Job} from '@enact/core/util';
import {on, off} from '@enact/core/dispatcher';
import Slottable from '@enact/ui/Slottable';
import {getDirection, Spotlight} from '@enact/spotlight';
import {Spottable, spottableClass} from '@enact/spotlight/Spottable';
import {SpotlightContainerDecorator, spotlightDefaultClass} from '@enact/spotlight/SpotlightContainerDecorator';

import Spinner from '../Spinner';

import {calcNumberValueOfPlaybackRate, getNow, secondsToTime} from './util';
import Overlay from './Overlay';
import MediaControls from './MediaControls';
import MediaTitle from './MediaTitle';
import MediaSlider from './MediaSlider';
import Feedback from './Feedback';
import Times from './Times';

import css from './VideoPlayer.less';

const SpottableDiv = Spottable('div');
const Container = SpotlightContainerDecorator({enterTo: ''}, 'div');

// Video ReadyStates
// - Commented are currently unused.
//
// const HAVE_NOTHING      = 0;  // no information whether or not the audio/video is ready
// const HAVE_METADATA     = 1;  // metadata for the audio/video is ready
// const HAVE_CURRENT_DATA = 2;  // data for the current playback position is available, but not enough data to play next frame/millisecond
// const HAVE_FUTURE_DATA  = 3;  // data for the current and at least the next frame is available
const HAVE_ENOUGH_DATA  = 4;  // enough data available to start playing


// Set-up event forwarding map. These are all of the supported media events
const handledMediaEventsMap = {
	abort           : 'onAbort',
	canplay         : 'onCanPlay',
	canplaythrough  : 'onCanPlayThrough',
	durationchange  : 'onDurationChange',
	emptied         : 'onEmptied',
	encrypted       : 'onEncrypted',
	ended           : 'onEnded',
	error           : 'onError',
	loadeddata      : 'onLoadedData',
	loadedmetadata  : 'onLoadedMetadata',
	loadstart       : 'onLoadStart',
	pause           : 'onPause',
	play            : 'onPlay',
	playing         : 'onPlaying',
	progress        : 'onProgress',
	ratechange      : 'onRateChange',
	seeked          : 'onSeeked',
	seeking         : 'onSeeking',
	stalled         : 'onStalled',
	suspend         : 'onSuspend',
	timeupdate      : 'onTimeUpdate',
	volumechange    : 'onVolumeChange',
	waiting         : 'onWaiting'
};

// List custom events that aren't standard to React. These will be directly added to the video
// element and props matching their name will be executed as callback functions when the event fires.
// "umsmediainfo" prop function will execute when the "umsmediainfo" event happens.
const handledCustomMediaEventsMap = {
	'umsmediainfo'  : 'onUMSMediaInfo'
};

// provide forwarding of events on media controls
const forwardControlsAvailable = forward('onControlsAvailable');
const forwardBackwardButtonClick = forward('onBackwardButtonClick');
const forwardForwardButtonClick = forward('onForwardButtonClick');
const forwardJumpBackwardButtonClick = forward('onJumpBackwardButtonClick');
const forwardJumpForwardButtonClick = forward('onJumpForwardButtonClick');
const forwardPlayButtonClick = forward('onPlayButtonClick');

/**
 * Every callback sent by [VideoPlayer]{@link moonstone/VideoPlayer} receives a status package,
 * which includes an object with the following key/value pairs as the first argument:
 *
 * @typedef {Object} videoStatus
 * @memberof moonstone/VideoPlayer
 * @property {String} type - Type of event that triggered this callback
 * @property {Number} currentTime - Playback index of the media in seconds
 * @property {Number} duration - Media's entire duration in seconds
 * @property {Boolean} paused - Playing vs paused state. `true` means the media is paused
 * @property {Number} proportionLoaded - A value between `0` and `1` representing the proportion of the media that has loaded
 * @property {Number} proportionPlayed - A value between `0` and `1` representing the proportion of the media that has already been shown
 *
 * @public
 */

/**
 * A player for video {@link moonstone/VideoPlayer.VideoPlayerBase}.
 *
 * @class VideoPlayerBase
 * @memberof moonstone/VideoPlayer
 * @ui
 * @public
 */
const VideoPlayerBase = class extends React.Component {
	static displayName = 'VideoPlayerBase'

	static propTypes = /** @lends moonstone/VideoPlayer.VideoPlayerBase.prototype */ {
		/**
		 * Amount of time (in milliseconds) after which control buttons are automatically hidden.
		 * Setting this to 0 or `null` disables autoClose, requiring user input to open and close.
		 *
		 * @type {Number}
		 * @default 7000
		 * @public
		 */
		autoCloseTimeout: PropTypes.number,

		/**
		 * A string which is sent to the `backward` icon of the player controls. This can be
		 * anything that is accepted by {@link moonstone/Icon}.
		 *
		 * @type {String}
		 * @default 'backward'
		 * @public
		 */
		backwardIcon: PropTypes.string,

		/**
		 * Amount of time (in milliseconds) after which the feedback text/icon part of the slider's
		 * tooltip will automatically hidden after the last action.
		 * Setting this to 0 or `null` disables feedbackHideDelay; feedback will always be present.
		 *
		 * @type {Number}
		 * @default 2000
		 * @public
		 */
		feedbackHideDelay: PropTypes.number,

		/**
		 * A string which is sent to the `forward` icon of the player controls. This can be anything
		 * that is accepted by {@link moonstone/Icon}.
		 *
		 * @type {String}
		 * @default 'forward'
		 * @public
		 */
		forwardIcon: PropTypes.string,

		/**
		 * These components are placed into the slot to the left of the media controls.
		 *
		 * @type {Node}
		 * @public
		 */
		infoComponents: PropTypes.node,

		/**
		 * A string which is sent to the `jumpBackward` icon of the player controls. This can be
		 * anything that is accepted by {@link moonstone/Icon}.
		 *
		 * @type {String}
		 * @default 'skipbackward'
		 * @public
		 */
		jumpBackwardIcon: PropTypes.string,

		/**
		 * Sets the `disabled` state on the media "jump" buttons; the outer pair.
		 *
		 * @type {Boolean}
		 * @public
		 */
		jumpButtonsDisabled: PropTypes.bool,

		/**
		 * The amount of seconds the player should skip forward or backward when a "jump" button is
		 * pressed.
		 *
		 * @type {Number}
		 * @default 30
		 * @public
		 */
		jumpBy: PropTypes.number,

		/**
		 * A string which is sent to the `jumpForward` icon of the play controls. This can be
		 * anything that is accepted by {@link moonstone/Icon}.
		 *
		 * @type {String}
		 * @default 'skipforward'
		 * @public
		 */
		jumpForwardIcon: PropTypes.string,

		/**
		 * These components are placed below the title. Typically these will be media descriptor
		 * icons, like how many audio channels, what codec the video uses, but can also be a
		 * description for the video or anything else that seems appropriate to provide information
		 * about the video to the user.
		 *
		 * @type {Node}
		 * @public
		 */
		leftComponents: PropTypes.node,

		/**
		 * Disable audio for this video. In a TV context, this is handled by the remote control,
		 * not programatically in the VideoPlayer API.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		muted: PropTypes.bool,

		/**
		 * By default, the video will start playing immediately after it's loaded, unless this is set.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoPlay: PropTypes.bool,

		/**
		 * Removes the "jump" buttons. The buttons that skip forward or backward in the video.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noJumpButtons: PropTypes.bool,

		/**
		 * Removes the "rate" buttons. The buttons that change the playback rate of the video.
		 * Double speed, half speed, reverse 4x speed, etc.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noRateButtons: PropTypes.bool,

		/**
		 * Removes the media slider.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noSlider: PropTypes.bool,

		/**
		 * Function executed when the user clicks the Backward button. Is passed
		 * a {@link moonstone/VideoPlayer.videoStatus} as the first argument.
		 *
		 * @type {Function}
		 * @public
		 */
		onBackwardButtonClick: PropTypes.func,

		/**
		 * Function executed when the player's controls change availability, whether they are shown
		 * or hidden. The current status is sent as the first argument in an object with a key
		 * `available` which will be either true or false. `onControlsAvailable({available: true})`
		 *
		 * @type {Function}
		 * @public
		 */
		onControlsAvailable: PropTypes.func,

		/**
		 * Function executed when the user clicks the Forward button. Is passed
		 * a {@link moonstone/VideoPlayer.videoStatus} as the first argument.
		 *
		 * @type {Function}
		 * @public
		 */
		onForwardButtonClick: PropTypes.func,

		/**
		 * Function executed when the user clicks the JumpBackward button. Is passed
		 * a {@link moonstone/VideoPlayer.videoStatus} as the first argument.
		 *
		 * @type {Function}
		 * @public
		 */
		onJumpBackwardButtonClick: PropTypes.func,

		/**
		 * Function executed when the user clicks the JumpForward button. Is passed
		 * a {@link moonstone/VideoPlayer.videoStatus} as the first argument.
		 *
		 * @type {Function}
		 * @public
		 */
		onJumpForwardButtonClick: PropTypes.func,

		/**
		 * Function executed when the user clicks the Play button. Is passed
		 * a {@link moonstone/VideoPlayer.videoStatus} as the first argument.
		 *
		 * @type {Function}
		 * @public
		 */
		onPlayButtonClick: PropTypes.func,

		/**
		 * A string which is sent to the `pause` icon of the player controls. This can be anything
		 * that is accepted by {@link moonstone/Icon}.
		 *
		 * @type {String}
		 * @default 'pause'
		 * @public
		 */
		pauseIcon: PropTypes.string,

		/**
		 * Mapping of playback rate names to playback rate values that may be set.
		 *
		 * @type {Object}
		 * @default {
		 *	fastForward: ['2', '4', '8', '16'],
		 *	rewind: ['-2', '-4', '-8', '-16'],
		 *	slowForward: ['1/4', '1/2'],
		 *	slowRewind: ['-1/2', '-1']
		 * }
		 * @public
		 */
		playbackRateHash: PropTypes.object,

		/**
		 * A string which is sent to the `play` icon of the player controls. This can be anything
		 * that is accepted by {@link moonstone/Icon}.
		 *
		 * @type {String}
		 * @default 'play'
		 * @public
		 */
		playIcon: PropTypes.string,

		/**
		 * Sets the `disabled` state on the media playback-rate control buttons; the inner pair.
		 *
		 * @type {Boolean}
		 * @public
		 */
		rateButtonsDisabled: PropTypes.bool,

		/**
		 * These components are placed into the slot to the right of the media controls.
		 *
		 * @type {Node}
		 * @public
		 */
		rightComponents: PropTypes.node,

		/**
		 * Any children `<source>` tag elements of [VideoPlayer]{@link moonstone/VideoPlayer} will
		 * be sent directly to the `<video>` element as video sources.
		 * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source
		 *
		 * @type {Node}
		 * @public
		 */
		source: PropTypes.node,

		/**
		 * Set a title for the video being played.
		 *
		 * @type {String}
		 * @public
		 */
		title: PropTypes.string,

		/**
		 * The amount of time in miliseconds that should pass before the title disappears from the
		 * controls. Setting this to `0` disables the hiding.
		 *
		 * @type {Number}
		 * @default 4000
		 * @public
		 */
		titleHideDelay: PropTypes.number
	}

	static defaultProps = {
		autoCloseTimeout: 7000,
		backwardIcon: 'backward',
		feedbackHideDelay: 2000,
		forwardIcon: 'forward',
		jumpBackwardIcon: 'skipbackward',
		jumpBy: 30,
		jumpForwardIcon: 'skipforward',
		muted: false,
		noAutoPlay: false,
		noJumpButtons: false,
		noRateButtons: false,
		noSlider: false,
		pauseIcon: 'pause',
		playbackRateHash: {
			fastForward: ['2', '4', '8', '16'],
			rewind: ['-2', '-4', '-8', '-16'],
			slowForward: ['1/4', '1/2'],
			slowRewind: ['-1/2', '-1']
		},
		playIcon: 'play',
		titleHideDelay: 4000
	}

	constructor (props) {
		super(props);

		// Internal State
		this.video = null;
		this.handledMediaForwards = {};
		this.handledMediaEvents = {};
		this.handledCustomMediaForwards = {};
		this.moreInProgress = false;	// This only has meaning for the time between clicking "more" and the official state is updated. To get "more" state, only look at the state value.
		this.prevCommand = (props.noAutoPlay ? 'pause' : 'play');
		this.speedIndex = 0;
		this.selectPlaybackRates('fastForward');

		this.initI18n();

		// Generate event handling forwarders and a smooth block to pass to <Video>
		for (let key in handledMediaEventsMap) {
			const eventName = handledMediaEventsMap[key];
			this.handledMediaForwards[eventName] = forward(eventName);
			this.handledMediaEvents[eventName] = this.handleEvent;
		}
		// Generate event handling forwarders for the custom events too
		for (let eventName in handledCustomMediaEventsMap) {
			const propName = handledCustomMediaEventsMap[eventName];
			const forwardEvent = forward(propName);
			this.handledCustomMediaForwards[eventName] = ev => forwardEvent(ev, this.props);
		}

		// Re-render-necessary State
		this.state = {
			buffered: 0,
			currentTime: 0,
			duration: 0,
			error: false,
			loading: false,
			muted: !!props.muted,
			paused: props.noAutoPlay,
			playbackRate: 1,
			readyState: 0,
			volume: 1,

			// Non-standard state computed from properties
			bottomControlsVisible: false,
			feedbackVisible: true,
			more: false,
			proportionLoaded: 0,
			proportionPlayed: 0,
			sliderScrubbing: false,
			sliderKnobProportion: 0,
			titleVisible: true
		};
	}

	componentDidMount () {
		on('mousemove', this.activityDetected);
		on('keypress', this.activityDetected);
		this.attachCustomMediaEvents();
		this.startDelayedFeedbackHide();
	}

	componentWillReceiveProps (nextProps) {
		// Detect a change to the video source and reload if necessary.
		if (nextProps.children) {
			let prevSource, nextSource;

			React.Children.forEach(this.props.children, (child) => {
				if (child.type === 'source') {
					prevSource = child.props.src;
				}
			});
			React.Children.forEach(nextProps.children, (child) => {
				if (child.type === 'source') {
					nextSource = child.props.src;
				}
			});

			if (prevSource !== nextSource) {
				this.reloadVideo();
			}
		}
	}

	componentWillUpdate (nextProps, nextState) {
		this.initI18n();

		if (
			this.state.bottomControlsVisible &&
			!nextState.bottomControlsVisible &&
			this.player.contains(Spotlight.getCurrent())
		) {
			// set focus to the hidden spottable control - maintaining focus on available spottable
			// controls, which prevents an addiitional 5-way attempt in order to re-show media controls
			Spotlight.focus(this.player.querySelector(`.${css.controlsHandleAbove}.${spottableClass}`));
		}
	}

	// Added to set default focus on the media control (play) when controls become visible.
	componentDidUpdate (prevProps, prevState) {
		if (
			this.state.bottomControlsVisible &&
			!prevState.bottomControlsVisible &&
			this.player.contains(Spotlight.getCurrent())
		) {
			this.focusDefaultMediaControl();
		}
	}

	componentWillUnmount () {
		off('mousemove', this.activityDetected);
		off('keypress', this.activityDetected);
		this.detachCustomMediaEvents();
		this.stopRewindJob();
		this.stopAutoCloseTimeout();
		this.stopDelayedTitleHide();
		this.stopDelayedFeedbackHide();
	}

	//
	// Internal Methods
	//
	initI18n = () => {
		const locale = ilib.getLocale();

		if (this.locale !== locale && typeof window === 'object') {
			this.locale = locale;

			this.durfmt = new DurationFmt({length: 'medium', style: 'clock', useNative: false});
		}
	}

	attachCustomMediaEvents = () => {
		for (let eventName in this.handledCustomMediaForwards) {
			on(eventName, this.handledCustomMediaForwards[eventName], this.video);
		}
	}

	detachCustomMediaEvents = () => {
		for (let eventName in this.handledCustomMediaForwards) {
			off(eventName, this.handledCustomMediaForwards[eventName], this.video);
		}
	}

	activityDetected = () => {
		// console.count('activityDetected');
		this.startAutoCloseTimeout();
	}

	startAutoCloseTimeout = () => {
		// If this.state.more is used as a reference for when this function should fire, timing for
		// detection of when "more" is pressed vs when the state is updated is mismatched. Using an
		// instance variable that's only set and used for this express purpose seems cleanest.
		if (this.props.autoCloseTimeout && !this.moreInProgress) {
			this.autoCloseJob.startAfter(this.props.autoCloseTimeout);
		}
	}

	stopAutoCloseTimeout = () => {
		this.autoCloseJob.stop();
	}

	showControls = () => {
		this.startDelayedTitleHide();
		forwardControlsAvailable({available: true}, this.props);
		this.setState({
			bottomControlsVisible: true,
			titleVisible: true
		});
	}

	hideControls = () => {
		this.stopDelayedTitleHide();
		forwardControlsAvailable({available: false}, this.props);
		this.setState({bottomControlsVisible: false, more: false});
	}

	autoCloseJob = new Job(this.hideControls)

	startDelayedTitleHide = () => {
		if (this.props.titleHideDelay) {
			this.hideTitleJob.startAfter(this.props.titleHideDelay);
		}
	}

	stopDelayedTitleHide = () => {
		this.hideTitleJob.stop();
	}

	hideTitle = () => {
		this.setState({titleVisible: false});
	}

	hideTitleJob = new Job(this.hideTitle)

	startDelayedFeedbackHide = () => {
		if (this.props.feedbackHideDelay) {
			this.hideFeedbackJob.startAfter(this.props.feedbackHideDelay);
		}
	}

	stopDelayedFeedbackHide = () => {
		this.hideFeedbackJob.stop();
	}

	showFeedback = () => {
		this.setState({feedbackVisible: true});
	}

	hideFeedback = () => {
		this.setState({feedbackVisible: false});
	}

	hideFeedbackJob = new Job(this.hideFeedback)

	showFeedback = () => {
		this.setState({feedbackVisible: true});
	}

	hideFeedback = () => {
		this.setState({feedbackVisible: false});
	}

	//
	// Media Interaction Methods
	//
	updateMainState = () => {
		const el = this.video;
		const updatedState = {
			// Standard video properties
			currentTime: el.currentTime,
			duration: el.duration,
			buffered: el.buffered,
			paused: el.paused,
			muted: el.muted,
			volume: el.volume,
			playbackRate: el.playbackRate,
			readyState: el.readyState,

			// Non-standard state computed from properties
			proportionLoaded: el.buffered.length && el.buffered.end(el.buffered.length - 1) / el.duration,
			proportionPlayed: el.currentTime / el.duration,
			error: el.networkState === el.NETWORK_NO_SOURCE,
			loading: el.readyState < el.HAVE_ENOUGH_DATA,
			sliderTooltipTime: this.sliderScrubbing ? (this.sliderKnobProportion * el.duration) : el.currentTime
		};

		// If there's an error, we're obviously not loading, no matter what the readyState is.
		if (updatedState.error) updatedState.loading = false;

		updatedState.mediaControlsDisabled = (
			updatedState.readyState < HAVE_ENOUGH_DATA ||
			!updatedState.duration ||
			updatedState.error
		);

		// If we're ff or rw and hit the end, just pause the media.
		if ((el.currentTime === 0 && this.prevCommand === 'rewind') ||
				(el.currentTime === el.duration && this.prevCommand === 'fastForward')) {
			this.pause();
		}
		this.setState(updatedState);
	}

	reloadVideo = () => {
		// When changing a HTML5 video, you have to reload it.
		this.video.load();
		this.video.play();
	}

	/**
	 * The primary means of interacting with the `<video>` element.
	 *
	 * @param  {String} action The method to preform.
	 * @param  {Multiple} props  The arguments, in the format that the action method requires.
	 *
	 * @private
	 */
	send = (action, props) => {
		this.showFeedback();
		this.startDelayedFeedbackHide();
		this.video[action](props);
	}

	/**
	 * Programatically plays the current media.
	 *
	 * @private
	 */
	play = () => {
		this.speedIndex = 0;
		this.setPlaybackRate(1);
		this.send('play');
		this.prevCommand = 'play';
	}

	/**
	 * Programatically plays the current media.
	 *
	 * @private
	 */
	pause = () => {
		this.speedIndex = 0;
		this.setPlaybackRate(1);
		this.send('pause');
		this.prevCommand = 'pause';
	}

	/**
	 * Set the media playback time index
	 *
	 * @private
	 */
	seek = (timeIndex) => {
		this.video.currentTime = timeIndex;
	}

	/**
	 * Step a given amount of time away from the current playback position.
	 * Like [seek]{@link moonstone/VideoPlayer.VideoPlayer#seek} but relative.
	 *
	 * @private
	 */
	jump = (distance) => {
		this.showFeedback();
		this.startDelayedFeedbackHide();
		this.seek(this.state.currentTime + distance);
	}

	/**
	 * Changes the playback speed via [selectPlaybackRate()]{@link moonstone/VideoPlayer.VideoPlayer#selectPlaybackRate}.
	 *
	 * @private
	 */
	fastForward = () => {
		let shouldResumePlayback = false;

		switch (this.prevCommand) {
			case 'slowForward':
				if (this.speedIndex === this.playbackRates.length - 1) {
						// reached to the end of array => go to play
					this.send('play');
					return;
				} else {
					this.speedIndex = this.clampPlaybackRate(this.speedIndex + 1);
				}
				break;
			case 'pause':
				this.selectPlaybackRates('slowForward');
				if (this.state.paused) {
					shouldResumePlayback = true;
				}
				this.speedIndex = 0;
				this.prevCommand = 'slowForward';
				break;
			case 'rewind':
				this.send('play');
				this.selectPlaybackRates('fastForward');
				this.speedIndex = 0;
				this.prevCommand = 'fastForward';
				break;
			case 'slowRewind':
				this.selectPlaybackRates('slowForward');
				this.speedIndex = 0;
				this.prevCommand = 'slowForward';
				break;
			case 'fastForward':
				this.speedIndex = this.clampPlaybackRate(this.speedIndex + 1);
				this.prevCommand = 'fastForward';
				break;
			default:
				this.selectPlaybackRates('fastForward');
				this.speedIndex = 0;
				this.prevCommand = 'fastForward';
				break;
		}

		this.setPlaybackRate(this.selectPlaybackRate(this.speedIndex));

		if (shouldResumePlayback) this.send('play');
		else this.stopDelayedFeedbackHide();

		this.showFeedback();
	}

	/**
	 * Changes the playback speed via [selectPlaybackRate()]{@link moonstone/VideoPlayer.VideoPlayer#selectPlaybackRate}.
	 *
	 * @private
	 */
	rewind = () => {
		let shouldResumePlayback = false;

		switch (this.prevCommand) {
			case 'slowRewind':
				if (this.speedIndex === this.playbackRates.length - 1) {
						// reached to the end of array => go to rewind
					this.selectPlaybackRates('rewind');
					this.speedIndex = 0;
					this.prevCommand = 'rewind';
				} else {
					this.speedIndex = this.clampPlaybackRate(this.speedIndex + 1);
				}
				break;
			case 'fastForward':
				this.selectPlaybackRates('rewind');
				this.speedIndex = 0;
				this.prevCommand = 'rewind';
				break;
			case 'slowForward':
				this.selectPlaybackRates('slowRewind');
				this.speedIndex = 0;
				this.prevCommand = 'slowRewind';
				break;
			case 'pause':
				this.selectPlaybackRates('slowRewind');
				if (this.state.paused && this.state.duration > this.state.currentTime) {
					shouldResumePlayback = true;
				}
				this.speedIndex = 0;
				this.prevCommand = 'slowRewind';
				break;
			case 'rewind':
				this.speedIndex = this.clampPlaybackRate(this.speedIndex + 1);
				this.prevCommand = 'rewind';
				break;
			default:
				this.selectPlaybackRates('rewind');
				this.speedIndex = 0;
				this.prevCommand = 'rewind';
				break;
		}

		this.setPlaybackRate(this.selectPlaybackRate(this.speedIndex));

		if (shouldResumePlayback) this.send('play');
		else this.stopDelayedFeedbackHide();

		this.showFeedback();
	}

	/**
	 * Sets the playback rate type (from the [keys]{@glossary Object.keys} of
	 * [playbackRateHash]{@link moonstone/VideoPlayer.VideoPlayer#playbackRateHash}).
	 *
	 * @param {String} cmd - Key of the playback rate type.
	 * @private
	 */
	selectPlaybackRates = (cmd) => {
		this.playbackRates = this.props.playbackRateHash[cmd];
	}

	/**
	 * Changes [playbackRate]{@link moonstone/VideoPlayer.VideoPlayer#playbackRate} to a valid value
	 * when initiating fast forward or rewind.
	 *
	 * @param {Number} idx - The index of the desired playback rate.
	 * @private
	 */
	clampPlaybackRate = (idx) => {
		if (!this.playbackRates) {
			return;
		}

		return idx % this.playbackRates.length;
	}

	/**
	 * Retrieves the playback rate name.
	 *
	 * @param {Number} idx - The index of the desired playback rate.
	 * @returns {String} The playback rate name.
	 * @private
	 */
	selectPlaybackRate = (idx) => {
		return this.playbackRates[idx];
	}

	/**
	 * Sets [playbackRate]{@link moonstone/VideoPlayer.VideoPlayer#playbackRate}.
	 *
	 * @param {String} rate - The desired playback rate.
	 * @private
	 */
	setPlaybackRate = (rate) => {
		// Stop rewind (if happenning)
		this.stopRewindJob();

		// Make sure rate is a string
		this.playbackRate = rate = String(rate);
		const pbNumber = calcNumberValueOfPlaybackRate(rate);

		// Set native playback rate
		this.video.playbackRate = pbNumber;

		// NYI - Supporting plat detection means we can leverage native negative playback rate on webOS instead of simulating it
		// if (!(platform.webos || global.PalmSystem)) {
		//	// For supporting cross browser behavior
		if (pbNumber < 0) {
			this.beginRewind();
		}
		// }
	}

	/**
	 * Calculates the time that has elapsed since. This is necessary for browsers until negative
	 * playback rate is directly supported.
	 *
	 * @private
	 */
	rewindManually = () => {
		const now = getNow(),
			distance = now - this.rewindBeginTime,
			pbRate = calcNumberValueOfPlaybackRate(this.playbackRate),
			adjustedDistance = (distance * pbRate) / 1000;

		this.jump(adjustedDistance);
		this.startRewindJob();	// Issue another rewind tick
	}

	rewindJob = new Job(this.rewindManually, 100)

	/**
	 * Starts rewind job.
	 *
	 * @private
	 */
	startRewindJob = () => {
		this.rewindBeginTime = getNow();
		this.rewindJob.start();
	}

	/**
	 * Stops rewind job.
	 *
	 * @private
	 */
	stopRewindJob = () => {
		this.rewindJob.stop();
	}

	/**
	 * Implements custom rewind functionality (until browsers support negative playback rate).
	 *
	 * @private
	 */
	beginRewind = () => {
		this.send('pause');
		this.startRewindJob();
	}

	//
	// Handled Media events
	//
	addStateToEvent = (ev) => {
		return {
			// More props from `ev` may be added here as needed, but a full copy via `...ev`
			// overloads Storybook's Action Logger and likely has other perf fallout.
			type              : ev.type,
			// Specific state variables are included in the outgoing calback payload, not all of them
			currentTime       : this.state.currentTime,
			duration          : this.state.duration,
			paused            : this.state.paused,
			proportionLoaded  : this.state.proportionLoaded,
			proportionPlayed  : this.state.proportionPlayed
		};
	}

	handleEvent = (ev) => {
		this.updateMainState();
		// fetch the forward() we generated earlier, using the event type as a key to find the real event name.
		const fwd = this.handledMediaForwards[handledMediaEventsMap[ev.type]];
		if (fwd) {
			ev = this.addStateToEvent(ev);
			fwd(ev, this.props);
		}
	}

	handleKeyDownFromControls = (ev) => {
		if (getDirection(ev.keyCode) === 'down') {
			this.hideControls();
		}
	}

	handleSpotlightDownFromSlider = (ev) => {
		if (!this.state.mediaControlsDisabled && !this.state.more) {
			ev.preventDefault();
			ev.stopPropagation();
			Spotlight.setPointerMode(false);
			this.focusDefaultMediaControl();
		}
	}

	focusDefaultMediaControl = () => {
		return Spotlight.focus(this.player.querySelector(`.${css.bottom} .${spotlightDefaultClass}.${spottableClass}`));
	}

	//
	// Player Interaction events
	//
	onVideoClick = () => {
		if (this.state.bottomControlsVisible) {
			this.hideControls();
		} else {
			this.showControls();
		}
	}
	onSliderChange = ({value}) => {
		this.seek(value * this.state.duration);
	}
	handleKnobMove = (ev) => {
		this.sliderScrubbing = ev.detached;
		this.sliderKnobProportion = ev.proportion;
	}
	onJumpBackward = (ev) => {
		ev = this.addStateToEvent(ev);
		forwardJumpBackwardButtonClick(ev, this.props);
		this.jump(-1 * this.props.jumpBy);
	}
	onBackward = (ev) => {
		ev = this.addStateToEvent(ev);
		forwardBackwardButtonClick(ev, this.props);
		this.rewind();
	}
	onPlay = (ev) => {
		ev = this.addStateToEvent(ev);
		forwardPlayButtonClick(ev, this.props);
		if (this.state.paused) {
			this.play();
		} else {
			this.pause();
		}
	}
	onForward = (ev) => {
		ev = this.addStateToEvent(ev);
		forwardForwardButtonClick(ev, this.props);
		this.fastForward();
	}
	onJumpForward = (ev) => {
		ev = this.addStateToEvent(ev);
		forwardJumpForwardButtonClick(ev, this.props);
		this.jump(this.props.jumpBy);
	}
	onMoreClick = () => {
		if (this.state.more) {
			this.moreInProgress = false;
			this.startAutoCloseTimeout();	// Restore the timer since we are leaving "more.
			// Restore the title-hide now that we're finished with "more".
			this.startDelayedTitleHide();
		} else {
			this.moreInProgress = true;
			this.stopAutoCloseTimeout();	// Interupt the timer since controls should not hide while viewing "more".
			// Interrupt the title-hide since we don't want it hiding autonomously in "more".
			this.stopDelayedTitleHide();
		}
		this.setState({
			more: !this.state.more,
			titleVisible: true
		});
	}

	setPlayerRef = (node) => {
		this.player = node;
	}

	setVideoRef = (video) => {
		this.video = video;
	}

	render () {
		const {backwardIcon, children, className, forwardIcon, infoComponents, jumpBackwardIcon, jumpButtonsDisabled, jumpForwardIcon, leftComponents, noAutoPlay, noJumpButtons, noRateButtons, noSlider, pauseIcon, playIcon, rateButtonsDisabled, rightComponents, source, style, title, ...rest} = this.props;
		delete rest.autoCloseTimeout;
		delete rest.feedbackHideDelay;
		delete rest.jumpBy;
		delete rest.onControlsAvailable;
		delete rest.onBackwardButtonClick;
		delete rest.onForwardButtonClick;
		delete rest.onJumpBackwardButtonClick;
		delete rest.onJumpForwardButtonClick;
		delete rest.onPlayButtonClick;
		delete rest.playbackRateHash;
		delete rest.titleHideDelay;

		// Remove the events we manually added so they aren't added twice or fail.
		for (let eventName in handledCustomMediaEventsMap) {
			delete rest[handledCustomMediaEventsMap[eventName]];
		}

		// Handle some cases when the "more" button is pressed
		const moreDisabled = !(this.state.more);

		return (
			<div className={css.videoPlayer + (className ? ' ' + className : '')} style={style} onClick={this.activityDetected} onKeyDown={this.activityDetected} ref={this.setPlayerRef}>
				{/* Video Section */}
				<video
					{...rest}
					autoPlay={!noAutoPlay}
					className={css.video}
					controls={false}
					ref={this.setVideoRef}
					{...this.handledMediaEvents}
				>
					{source}
				</video>

				<Overlay onClick={this.onVideoClick}>
					{this.state.loading ? <Spinner centered /> : null}
				</Overlay>

				{this.state.bottomControlsVisible ? <div className={css.fullscreen + ' enyo-fit scrim'}>
					<Container className={css.bottom}>
						{/* Info Section: Title, Description, Times */}
						<div className={css.infoFrame}>
							<MediaTitle
								title={title}
								visible={this.state.titleVisible}
								infoVisible={this.state.more}
							>
								{infoComponents}
							</MediaTitle>
							<Times current={this.state.currentTime} total={this.state.duration} formatter={this.durfmt} />
						</div>

						{noSlider ? null : <MediaSlider
							backgroundProgress={this.state.proportionLoaded}
							value={this.state.proportionPlayed}
							onChange={this.onSliderChange}
							onKnobMove={this.handleKnobMove}
							onSpotlightUp={this.hideControls}
							onSpotlightDown={this.handleSpotlightDownFromSlider}
						>
							<div className={css.sliderTooltip}>
								<Feedback playbackState={this.prevCommand} visible={this.state.feedbackVisible} >
									{this.selectPlaybackRate(this.speedIndex)}
								</Feedback>
								{secondsToTime(this.state.sliderTooltipTime, this.durfmt)}
							</div>
						</MediaSlider>}

						<MediaControls
							backwardIcon={backwardIcon}
							forwardIcon={forwardIcon}
							jumpBackwardIcon={jumpBackwardIcon}
							jumpButtonsDisabled={jumpButtonsDisabled}
							jumpForwardIcon={jumpForwardIcon}
							leftComponents={leftComponents}
							mediaDisabled={this.state.mediaControlsDisabled}
							moreDisabled={moreDisabled}
							noJumpButtons={noJumpButtons}
							noRateButtons={noRateButtons}
							onBackwardButtonClick={this.onBackward}
							onClick={this.resetAutoTimeout}
							onForwardButtonClick={this.onForward}
							onJumpBackwardButtonClick={this.onJumpBackward}
							onJumpForwardButtonClick={this.onJumpForward}
							onKeyDown={this.handleKeyDownFromControls}
							onPlayButtonClick={this.onPlay}
							onToggleMore={this.onMoreClick}
							paused={this.state.paused}
							pauseIcon={pauseIcon}
							playIcon={playIcon}
							rateButtonsDisabled={rateButtonsDisabled}
							rightComponents={rightComponents}
							showMoreComponents={this.state.more}
						>
							{children}
						</MediaControls>
					</Container>
				</div> : null}
				<SpottableDiv
					// This captures spotlight focus for use with 5-way.
					// It's non-visible but lives at the top of the VideoPlayer.
					className={css.controlsHandleAbove}
					onSpotlightDown={this.showControls}
					onClick={this.showControls}
				/>
			</div>
		);
	}
};

/**
 * {@link moonstone/VideoPlayer.VideoPlayer} is a standard HTML5 video player for Moonstone. It
 * behaves, responds to, and operates like a standard `<video>` tag in its support for `<source>`s
 * and accepts several additional custom tags like `<infoComponents>`, `<leftComponents>`, and
 * `<rightComponents>`. Any additional children will be rendered into the "more" controls area.
 *
 * Example usage:
 * ```
 *	<VideoPlayer title="Hilarious Cat Video" poster="http://my.cat.videos/boots-poster.jpg">
 *		<source src="http://my.cat.videos/boots.mp4" type="video/mp4" />
 *		<infoComponents>A video about my cat Boots, wearing boots.</infoComponents>
 *		<leftComponents><IconButton backgroundOpacity="translucent">star</IconButton></leftComponents>
 *		<rightComponents><IconButton backgroundOpacity="translucent">flag</IconButton></rightComponents>
 *
 *		<Button backgroundOpacity="translucent">Add To Favorites</Button>
 *		<IconButton backgroundOpacity="translucent">search</IconButton>
 *	</VideoPlayer>
 * ```
 *
 * @class VideoPlayer
 * @memberof moonstone/VideoPlayer
 * @mixes ui/Slottable.Slottable
 * @ui
 * @public
 */
const VideoPlayer = Slottable({slots: ['infoComponents', 'leftComponents', 'rightComponents', 'source']}, VideoPlayerBase);

export default VideoPlayer;
export {VideoPlayer, VideoPlayerBase};
