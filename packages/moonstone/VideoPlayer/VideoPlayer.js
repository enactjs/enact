/**
 * Exports the {@link moonstone/VideoPlayer.VideoPlayer} and
 * {@link moonstone/VideoPlayer.VideoPlayerBase} components. The default export is
 * {@link moonstone/VideoPlayer.VideoPlayer}.
 *
 * @module moonstone/VideoPlayer
 */
import React from 'react';
import DurationFmt from '@enact/i18n/ilib/lib/DurationFmt';
import {forward} from '@enact/core/handle';
import ilib from '@enact/i18n';
import {startJob, stopJob} from '@enact/core/jobs';
import {on, off} from '@enact/core/dispatcher';
import Slottable from '@enact/ui/Slottable';
import {Spotlight, Spottable, SpotlightContainerDecorator, getDirection, spotlightDefaultClass} from '@enact/spotlight';
import Video from 'react-html5video';

import Spinner from '../Spinner';

import {calcNumberValueOfPlaybackRate, getNow, secondsToTime} from './util';
import Overlay from './Overlay';
import MediaControls from './MediaControls';
import MediaTitle from './MediaTitle';
import MediaSlider from './MediaSlider';
import Feedback from './Feedback';
import Times from './Times';

import css from './VideoPlayer.less';

const spottableClass = 'spottable';
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


/**
 * Mapping of playback rate names to playback rate values that may be set.
 * ```
 * {
 *	fastForward: ['2', '4', '8', '16'],
 *	rewind: ['-2', '-4', '-8', '-16'],
 *	slowForward: ['1/4', '1/2', '1'],
 *	slowRewind: ['-1/2', '-1']
 * }
 * ```
 *
 * @type {Object}
 * @default {
 *	fastForward: ['2', '4', '8', '16'],
 *	rewind: ['-2', '-4', '-8', '-16'],
 *	slowForward: ['1/4', '1/2'],
 *	slowRewind: ['-1/2', '-1']
 * }
 * @private
 */
const playbackRateHash = {
	fastForward: ['2', '4', '8', '16'],
	rewind: ['-2', '-4', '-8', '-16'],
	slowForward: ['1/4', '1/2'],
	slowRewind: ['-1/2', '-1']
};


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
		autoCloseTimeout: React.PropTypes.number,

		/**
		 * Amount of time (in milliseconds) after which the feedback text/icon part of the slider's
		 * tooltip will automatically hidden after the last action.
		 * Setting this to 0 or `null` disables feedbackHideDelay; feedback will always be present.
		 *
		 * @type {Number}
		 * @default 2000
		 * @public
		 */
		feedbackHideDelay: React.PropTypes.number,

		/**
		 * These components are placed into the slot to the left of the media controls.
		 *
		 * @type {Node}
		 * @public
		 */
		infoComponents: React.PropTypes.node,

		/**
		 * The amount of seconds the player should skip forward or backward when a "jump" button is
		 * pressed.
		 *
		 * @type {Number}
		 * @default 30
		 * @public
		 */
		jumpBy: React.PropTypes.number,

		/**
		 * These components are placed below the title. Typically these will be media descriptor
		 * icons, like how many audio channels, what codec the video uses, but can also be a
		 * description for the video or anything else that seems appropriate to provide information
		 * about the video to the user.
		 *
		 * @type {Node}
		 * @public
		 */
		leftComponents: React.PropTypes.node,

		/**
		 * Disable audio for this video. In a TV context, this is handled by the remote control,
		 * not programatically in the VideoPlayer API.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		muted: React.PropTypes.bool,

		/**
		 * By default, the video will start playing immediately after it's loaded, unless this is set.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoPlay: React.PropTypes.bool,

		/**
		 * Removes the "jump" buttons. The buttons that skip forward or backward in the video.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noJumpButtons: React.PropTypes.bool,

		/**
		 * Removes the "rate" buttons. The buttons that change the playback rate of the video.
		 * Double speed, half speed, reverse 4x speed, etc.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noRateButtons: React.PropTypes.bool,

		/**
		 * Removes the media slider.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noSlider: React.PropTypes.bool,

		/**
		 * An override function for when the user clicks the Backward button.
		 *
		 * @type {Function}
		 * @public
		 */
		onBackwardButtonClick: React.PropTypes.func,

		/**
		 * An override function for when the user clicks the Forward button.
		 *
		 * @type {Function}
		 * @public
		 */
		onForwardButtonClick: React.PropTypes.func,

		/**
		 * An override function for when the user clicks the JumpBackward button.
		 *
		 * @type {Function}
		 * @public
		 */
		onJumpBackwardButtonClick: React.PropTypes.func,

		/**
		 * An override function for when the user clicks the JumpForward button.
		 *
		 * @type {Function}
		 * @public
		 */
		onJumpForwardButtonClick: React.PropTypes.func,

		/**
		 * An override function for when the user clicks the Play button.
		 *
		 * @type {Function}
		 * @public
		 */
		onPlayButtonClick: React.PropTypes.func,

		/**
		 * These components are placed into the slot to the right of the media controls.
		 *
		 * @type {Node}
		 * @public
		 */
		rightComponents: React.PropTypes.node,

		/**
		 * Set a title for the video being played.
		 *
		 * @type {String}
		 * @public
		 */
		title: React.PropTypes.string,

		/**
		 * The amount of time in miliseconds that should pass before the title disappears from the
		 * controls. Setting this to `0` disables the hiding.
		 *
		 * @type {Number}
		 * @default 4000
		 * @public
		 */
		titleHideDelay: React.PropTypes.number
	}

	static defaultProps = {
		autoCloseTimeout: 7000,
		feedbackHideDelay: 2000,
		jumpBy: 30,
		muted: false,
		noAutoPlay: false,
		noJumpButtons: false,
		noRateButtons: false,
		noSlider: false,
		titleHideDelay: 4000
	}

	constructor (props) {
		super(props);

		// Internal State
		this.instanceId = Math.random();
		this.videoReady = false;
		this.video = null;
		this.handledMediaForwards = {};
		this.handledMediaEvents = {};
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
			percentageLoaded: 0,
			percentagePlayed: 0,
			playPauseIcon: 'play',
			sliderScrubbing: false,
			sliderKnobProportion: 0,
			titleVisible: true
		};
	}

	componentDidMount () {
		on('mousemove', this.activityDetected);
		on('keypress', this.activityDetected);
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
		this.stopRewindJob();
		this.stopAutoCloseTimeout();
		this.stopDelayedTitleHide();
		this.stopDelayedFeedbackHide();
	}


	//
	// Media Interaction Methods
	//
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
		if (this.video && this.videoReady) {
			this.video[action](props);
		}
	}

	jump = (distance) => {
		this.showFeedback();
		this.startDelayedFeedbackHide();
		if (this.video && this.videoReady) {
			this.video.seek(this.state.currentTime + distance);
		}
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

	updateMainState = () => {
		if (this.videoReady && this.video && this.video.videoEl && this.video.videoEl != null) {
			const el = this.video.videoEl;
			const updatedState = {
				// Standard video properties
				currentTime: el.currentTime,
				duration: el.duration,
				buffered: el.buffered,
				paused: el.paused,
				playPauseIcon: (el.paused ? 'play' : 'pause'),
				muted: el.muted,
				volume: el.volume,
				playbackRate: el.playbackRate,
				readyState: el.readyState,

				// Non-standard state computed from properties
				percentageLoaded: el.buffered.length && el.buffered.end(el.buffered.length - 1) / el.duration,
				percentagePlayed: el.currentTime / el.duration,
				error: el.networkState === el.NETWORK_NO_SOURCE,
				loading: el.readyState < el.HAVE_ENOUGH_DATA,
				sliderTooltipTime: this.sliderScrubbing ? (this.sliderKnobProportion * el.duration) : el.currentTime
			};

			// If there's an error, we're obviously not loading, no matter what the readyState is.
			if (updatedState.error) updatedState.loading = false;

			updatedState.mediaControlsDisabled = (
				updatedState.more ||
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
	 * Changes the playback speed via [selectPlaybackRate()]{@link moonstone/VideoPlayer.VideoPlayer#selectPlaybackRate}.
	 *
	 * @private
	 */
	fastForward = () => {
		// if (this.video && this.videoReady) {
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
		// if (this.video && this.videoReady) {
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
		this.playbackRates = playbackRateHash[cmd];
	}

	/**
	 * Changes [playbackRate]{@link moonstone/VideoPlayer.VideoPlayer#playbackRate} to a valid value when initiating
	 * fast forward or rewind.
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
		this.send('setPlaybackRate', pbNumber);

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

	/**
	 * Starts rewind job.
	 *
	 * @private
	 */
	startRewindJob = () => {
		this.rewindBeginTime = getNow();
		startJob('rewind' + this.instanceId, this.rewindManually, 100);
	}

	/**
	 * Stops rewind job.
	 *
	 * @private
	 */
	stopRewindJob = () => {
		stopJob('rewind' + this.instanceId);
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

	activityDetected = () => {
		// console.count('ActivityDetected');
		this.startAutoCloseTimeout();
	}

	startAutoCloseTimeout = () => {
		if (this.props.autoCloseTimeout && !this.state.more) {
			startJob('autoClose' + this.instanceId, this.hideControls, this.props.autoCloseTimeout);
		}
	}

	stopAutoCloseTimeout = () => {
		stopJob('autoClose' + this.instanceId);
	}

	showControls = () => {
		this.startDelayedTitleHide();
		this.setState({
			bottomControlsVisible: true,
			titleVisible: true
		});
	}

	hideControls = () => {
		this.stopDelayedTitleHide();
		this.setState({bottomControlsVisible: false, more: false});
	}

	startDelayedTitleHide = () => {
		if (this.props.titleHideDelay) {
			startJob('titleHideDelay' + this.instanceId, this.hideTitle, this.props.titleHideDelay);
		}
	}

	stopDelayedTitleHide = () => {
		stopJob('titleHideDelay' + this.instanceId);
	}

	hideTitle = () => {
		this.setState({titleVisible: false});
	}

	startDelayedFeedbackHide = () => {
		if (this.props.feedbackHideDelay) {
			startJob('feedbackHideDelay' + this.instanceId, this.hideFeedback, this.props.feedbackHideDelay);
		}
	}

	stopDelayedFeedbackHide = () => {
		stopJob('feedbackHideDelay' + this.instanceId);
	}

	showFeedback = () => {
		this.setState({feedbackVisible: true});
	}

	hideFeedback = () => {
		this.setState({feedbackVisible: false});
	}

	//
	// Handled Media events
	//
	handleEvent = (ev) => {
		this.updateMainState();
		// fetch the forward() we generated earlier, using the event type as a key to find the real event name.
		const fwd = this.handledMediaForwards[handledMediaEventsMap[ev.type]];
		if (fwd) {
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
	};

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
		if (value && this.video && this.video.videoEl && this.videoReady) {
			const el = this.video.videoEl;
			this.send('seek', value * el.duration);
		}
	}
	handleKnobMove = (ev) => {
		this.sliderScrubbing = ev.detached;
		this.sliderKnobProportion = ev.proportion;
	}
	onJumpBackward  = () => this.jump(-1 * this.props.jumpBy)
	onBackward      = () => this.rewind()
	onPlay          = () => {
		if (this.state.paused) {
			this.play();
		} else {
			this.pause();
		}
	}
	onForward       = () => this.fastForward()
	onJumpForward   = () => this.jump(this.props.jumpBy)
	onMoreClick     = () => {
		if (this.state.more) {
			this.startAutoCloseTimeout();	// Restore the timer since we are leaving "more.
			// Restore the title-hide now that we're finished with "more".
			this.startDelayedTitleHide();
		} else {
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
		this.videoReady = !!video;
		this.video = video;
	}

	render () {
		const {children, className, infoComponents, leftComponents, noAutoPlay, noJumpButtons, noRateButtons, noSlider, rightComponents, style, title,
			// Assign defaults during destructuring to internal methods (here, instead of defaultProps)
			onBackwardButtonClick = this.onBackward,
			onForwardButtonClick = this.onForward,
			onJumpBackwardButtonClick = this.onJumpBackward,
			onJumpForwardButtonClick = this.onJumpForward,
			onPlayButtonClick = this.onPlay,
			...rest} = this.props;
		delete rest.autoCloseTimeout;
		delete rest.feedbackHideDelay;
		delete rest.jumpBy;
		delete rest.titleHideDelay;

		// Handle some cases when the "more" button is pressed
		const moreDisabled = !(this.state.more);

		return (
			<div className={css.videoPlayer + (className ? ' ' + className : '')} style={style} onKeyDown={this.activityDetected} ref={this.setPlayerRef}>
				{/* Video Section */}
				<Video
					{...rest}
					autoPlay={!noAutoPlay}
					className={css.videoFrame}
					controls={false}
					ref={this.setVideoRef}	// Ref-ing this only once (smarter) turns out to be less safe because now we don't know when `video` is being "unset", so our `videoReady` is no longer genuine. react-html5video component is re-generating this method each render too. This seems to be part of the origin.
					{...this.handledMediaEvents}
				>
					{children}
				</Video>

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
							backgroundProgress={this.state.percentageLoaded}
							value={this.state.percentagePlayed}
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
							leftComponents={leftComponents}
							mediaDisabled={this.state.mediaControlsDisabled}
							moreDisabled={moreDisabled}
							noJumpButtons={noJumpButtons}
							noRateButtons={noRateButtons}
							onBackwardButtonClick={onBackwardButtonClick}
							onClick={this.resetAutoTimeout}
							onForwardButtonClick={onForwardButtonClick}
							onJumpBackwardButtonClick={onJumpBackwardButtonClick}
							onJumpForwardButtonClick={onJumpForwardButtonClick}
							onPlayButtonClick={onPlayButtonClick}
							onToggleMore={this.onMoreClick}
							playPauseIcon={this.state.playPauseIcon}
							rightComponents={rightComponents}
							showMoreComponents={this.state.more}
							onKeyDown={this.handleKeyDownFromControls}
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
const VideoPlayer = Slottable({slots: ['infoComponents', 'leftComponents', 'rightComponents']}, VideoPlayerBase);

export default VideoPlayer;
export {VideoPlayer, VideoPlayerBase};
