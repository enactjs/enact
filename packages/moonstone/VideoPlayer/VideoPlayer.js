/**
 * Exports the {@link moonstone/VideoPlayer.VideoPlayer} and
 * {@link moonstone/VideoPlayer.VideoPlayerBase} components. The default export is
 * {@link moonstone/VideoPlayer.VideoPlayer}.
 *
 * @module moonstone/VideoPlayer
 */
import Announce from '@enact/ui/AnnounceDecorator/Announce';
import ApiDecorator from '@enact/core/internal/ApiDecorator';
import equals from 'ramda/src/equals';
import React from 'react';
import PropTypes from 'prop-types';
import DurationFmt from '@enact/i18n/ilib/lib/DurationFmt';
import {forKey, forward, forwardWithPrevent, handle, stopImmediate} from '@enact/core/handle';
import ilib from '@enact/i18n';
import {Job} from '@enact/core/util';
import {on, off} from '@enact/core/dispatcher';
import {platform} from '@enact/core/platform';
import Slottable from '@enact/ui/Slottable';
import {getDirection, Spotlight} from '@enact/spotlight';
import {Spottable, spottableClass} from '@enact/spotlight/Spottable';
import {SpotlightContainerDecorator, spotlightDefaultClass} from '@enact/spotlight/SpotlightContainerDecorator';

import $L from '../internal/$L';
import Spinner from '../Spinner';
import Skinnable from '../Skinnable';

import {calcNumberValueOfPlaybackRate, getNow, secondsToTime} from './util';
import Overlay from './Overlay';
import MediaControls from './MediaControls';
import MediaTitle from './MediaTitle';
import MediaSlider from './MediaSlider';
import FeedbackTooltip from './FeedbackTooltip';
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
const forwardJumpBackwardButtonClick = forwardWithPrevent('onJumpBackwardButtonClick');
const forwardJumpForwardButtonClick = forwardWithPrevent('onJumpForwardButtonClick');
const forwardPlayButtonClick = forward('onPlayButtonClick');

// localized strings
const playLabel = 'Play';
const pauseLabel = 'Pause';

const AnnounceState = {
	// Video is loaded but additional announcements have not been made
	READY: 0,

	// The title should be announced
	TITLE: 1,

	// The title has been announce
	TITLE_READ: 2,

	// The infoComponents should be announce
	INFO: 3,

	// All announcements have been made
	DONE: 4
};

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
 * A set of playback rates when media fast forwards, rewinds, slow-fowards, or slow-rewinds.
 *
 * The number used for each operation is proportional to the normal playing speed, 1. If the rate
 * is less than 1, it will play slower than normal speed, and, if it is larger than 1, it will play
 * faster. If it is negative, it will play backward.
 *
 * The order of numbers represents the incremental order of rates that will be used for each
 * operation. Note that all rates are expressed as strings and fractions are used rather than decimals
 * (e.g.: `'1/2'`, not `'0.5'`).
 *
 * @typedef {Object} playbackRateHash
 * @memberof moonstone/VideoPlayer
 * @property {String[]} fastForward - An array of playback rates when media fast forwards
 * @property {String[]} rewind - An array of playback rates when media rewinds
 * @property {String[]} slowForward - An array of playback rates when media slow-forwards
 * @property {String[]} slowRewind - An array of playback rates when media slow-rewinds
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
		 * passed by AnnounceDecorator for accessibility
		 *
		 * @type {Function}
		 * @private
		 */
		announce: PropTypes.func,

		/**
		 * Amount of time (in milliseconds) after which control buttons are automatically hidden.
		 * Setting this to 0 or `null` disables autoClose, requiring user input to open and close.
		 *
		 * @type {Number}
		 * @default 5000
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
		 * @default 3000
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
		 * not programmatically in the VideoPlayer API.
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
		 * Function executed when the user is moving the VideoPlayer's Slider knob independently of
		 * the current playback position. It is passed an object with a `seconds` key (float value) to
		 * indicate the current time index. It can be used to update the `thumbnailSrc` to the reflect
		 * the current scrub position.
		 *
		 * @type {Function}
		 * @public
		 */
		onScrub: PropTypes.func,

		/**
		 * When `true`, the video will pause when it reaches either the start or the end of the
		 * video during rewind, slow rewind, fast forward, or slow forward.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		pauseAtEnd: PropTypes.bool,

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
		 * @type {moonstone/VideoPlayer.playbackRateHash}
		 * @default {
		 *	fastForward: ['2', '4', '8', '16'],
		 *	rewind: ['-2', '-4', '-8', '-16'],
		 *	slowForward: ['1/4', '1/2'],
		 *	slowRewind: ['-1/2', '-1']
		 * }
		 * @public
		 */
		playbackRateHash: PropTypes.shape({
			fastForward: PropTypes.arrayOf(PropTypes.string),
			rewind: PropTypes.arrayOf(PropTypes.string),
			slowForward: PropTypes.arrayOf(PropTypes.string),
			slowRewind: PropTypes.arrayOf(PropTypes.string)
		}),

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
		 * Registers the VideoPlayer component with an
		 * {@link core/internal/ApiDecorator.ApiDecorator}.
		 *
		 * @type {Function}
		 * @private
		 */
		setApiProvider: PropTypes.func,

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
		 * Set a thumbnail image source to show on VideoPlayer's Slider knob. This is a standard
		 * {@link moonstone/Image} component so it supports all of the same options for the `src`
		 * property. If no `thumbnailSrc` is set, no tooltip will display.
		 *
		 * @type {String|Object}
		 * @public
		 */
		thumbnailSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

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
		 * @default 5000
		 * @public
		 */
		titleHideDelay: PropTypes.number,

		/**
		 * The amount of time in miliseconds that should pass before the tooltip disappears from the
		 * controls. Setting this to `0` disables the hiding.
		 *
		 * @type {Number}
		 * @default 3000
		 * @public
		 */
		tooltipHideDelay: PropTypes.number
	}

	static defaultProps = {
		autoCloseTimeout: 5000,
		backwardIcon: 'backward',
		feedbackHideDelay: 3000,
		forwardIcon: 'forward',
		jumpBackwardIcon: 'skipbackward',
		jumpBy: 30,
		jumpForwardIcon: 'skipforward',
		muted: false,
		noAutoPlay: false,
		noJumpButtons: false,
		pauseAtEnd: false,
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
		titleHideDelay: 5000,
		tooltipHideDelay: 3000
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
		this.id = this.generateId();
		this.titleOffsetCalculated = false;
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
			announce: AnnounceState.READY,
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
			bottomControlsRendered: false,
			bottomControlsVisible: false,
			feedbackVisible: true,
			more: false,
			proportionLoaded: 0,
			proportionPlayed: 0,
			sliderScrubbing: false,
			sliderKnobProportion: 0,
			titleVisible: true
		};

		if (props.setApiProvider) {
			props.setApiProvider(this);
		}
	}

	componentDidMount () {
		on('mousemove', this.activityDetected);
		on('keypress', this.activityDetected);
		on('keydown', this.handleGlobalKeyDown);
		this.attachCustomMediaEvents();
		this.startDelayedFeedbackHide();
		this.renderBottomControl.idle();
		this.calculateMaxComponentCount();
	}

	componentWillReceiveProps (nextProps) {
		// Detect if the number of components has changed
		if (
			React.Children.count(this.props.leftComponents) !== React.Children.count(nextProps.leftComponents) ||
			React.Children.count(this.props.rightComponents) !== React.Children.count(nextProps.rightComponents) ||
			React.Children.count(this.props.children) !== React.Children.count(nextProps.children)
		) {
			this.calculateMaxComponentCount();
		}
	}

	componentWillUpdate (nextProps, nextState) {
		const
			isInfoComponentsEqual = equals(this.props.infoComponents, nextProps.infoComponents),
			shouldCalculateTitleOffset = (
				((!this.titleOffsetCalculated && isInfoComponentsEqual) || (this.titleOffsetCalculated && !isInfoComponentsEqual)) &&
				this.state.bottomControlsVisible
			);

		this.initI18n();

		if (
			this.state.bottomControlsVisible &&
			!nextState.bottomControlsVisible &&
			(!Spotlight.getCurrent() || this.player.contains(Spotlight.getCurrent()))
		) {
			// set focus to the hidden spottable control - maintaining focus on available spottable
			// controls, which prevents an addiitional 5-way attempt in order to re-show media controls
			Spotlight.focus(`.${css.controlsHandleAbove}`);
		}

		if (shouldCalculateTitleOffset) {
			this.calculateTitleOffset();
		}
	}

	componentDidUpdate (prevProps, prevState) {
		const {source} = this.props;
		const {source: prevSource} = prevProps;

		// Detect a change to the video source and reload if necessary.
		if (prevSource !== source && !equals(source, prevSource)) {
			this.reloadVideo();
		}

		// Added to set default focus on the media control (play) when controls become visible.
		if (
			this.state.bottomControlsVisible &&
			!prevState.bottomControlsVisible &&
			(!Spotlight.getCurrent() || this.player.contains(Spotlight.getCurrent()))
		) {
			this.focusDefaultMediaControl();
		}

		if (this.state.more !== prevState.more) {
			this.refocusMoreButton.start();
		}
	}

	componentWillUnmount () {
		off('mousemove', this.activityDetected);
		off('keypress', this.activityDetected);
		off('keydown', this.handleGlobalKeyDown);
		this.detachCustomMediaEvents();
		this.stopRewindJob();
		this.stopAutoCloseTimeout();
		this.stopDelayedTitleHide();
		this.stopDelayedFeedbackHide();
		this.renderBottomControl.stop();
		this.refocusMoreButton.stop();
	}

	//
	// Internal Methods
	//
	announceJob = new Job(msg => (this.announceRef && this.announceRef.announce(msg)), 200)

	announce = (msg) => {
		this.announceJob.start(msg);
	}

	calculateTitleOffset = () => {
		// calculate how far the title should animate up when infoComponents appear.
		const titleElement = this.player.querySelector(`.${css.title}`);
		const infoComponents = this.player.querySelector(`.${css.infoComponents}`);

		if (titleElement && infoComponents) {
			const infoHeight = infoComponents.offsetHeight;

			titleElement.style.setProperty('--infoComponentsOffset', infoHeight + 'px');
			this.titleOffsetCalculated = true;
		}
	}

	calculateMaxComponentCount = () => {
		let leftCount = React.Children.count(this.props.leftComponents),
			rightCount = React.Children.count(this.props.rightComponents),
			childrenCount = React.Children.count(this.props.children);

		// If the "more" button is present, automatically add it to the right's count.
		if (childrenCount) {
			rightCount += 1;
		}

		const max = Math.max(leftCount, rightCount);

		this.player.style.setProperty('--moon-video-player-max-side-components', max);
	}

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

	generateId = () => {
		return Math.random().toString(36).substr(2, 8);
	}

	showControls = () => {
		this.startDelayedFeedbackHide();
		this.startDelayedTitleHide();
		forwardControlsAvailable({available: true}, this.props);

		let {announce} = this.state;
		if (announce === AnnounceState.READY) {
			// if we haven't read the title yet, do so this time
			announce = AnnounceState.TITLE;
		} else if (announce === AnnounceState.TITLE) {
			// if we have read the title, advance to INFO so title isn't read again
			announce = AnnounceState.TITLE_READ;
		}

		this.setState({
			announce,
			bottomControlsRendered: true,
			bottomControlsVisible: true,
			feedbackVisible: true,
			titleVisible: true
		});
	}

	hideControls = () => {
		this.stopDelayedFeedbackHide();
		this.stopDelayedTitleHide();
		forwardControlsAvailable({available: false}, this.props);
		this.setState({bottomControlsVisible: false, more: false});
	}

	autoCloseJob = new Job(this.hideControls)

	refocusMoreButton = new Job(() => {
		// Readout 'more' or 'back' button explicitly.
		let selectedButton = Spotlight.getCurrent();
		selectedButton.blur();
		selectedButton.focus();
	}, 100)

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

	handle = handle.bind(this)

	handleLeft = () => {
		this.jump(-1 * this.props.jumpBy);
	}

	handleRight = () => {
		this.jump(this.props.jumpBy);
	}

	showControlsFromPointer = () => {
		Spotlight.setPointerMode(false);
		this.showControls();
	}

	handleGlobalKeyDown = this.handle(
		forKey('down'),
		() => (
			!this.state.bottomControlsVisible &&
			!Spotlight.getCurrent() &&
			Spotlight.getPointerMode()
		),
		stopImmediate,
		this.showControlsFromPointer
	)

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
			paused: el.playbackRate !== 1 || el.paused,
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

		const isRewind = this.prevCommand === 'rewind' || this.prevCommand === 'slowRewind';
		const isForward = this.prevCommand === 'fastForward' || this.prevCommand === 'slowForward';
		if (this.props.pauseAtEnd && (el.currentTime === 0 && isRewind || el.currentTime === el.duration && isForward)) {
			this.pause();
		}

		this.setState(updatedState);
	}

	/**
	 * Returns an object with the current state of the media including `currentTime`, `duration`,
	 * `paused`, `proportionLoaded`, and `proportionPlayed`.
	 *
	 * @function
	 * @memberof moonstone/VideoPlayer.VideoPlayerBase.prototype
	 * @returns {Object}
	 * @public
	 */
	getMediaState = () => {
		return {
			currentTime       : this.state.currentTime,
			duration          : this.state.duration,
			paused            : this.state.paused,
			proportionLoaded  : this.state.proportionLoaded,
			proportionPlayed  : this.state.proportionPlayed
		};
	}

	reloadVideo = () => {
		// When changing a HTML5 video, you have to reload it.
		this.video.load();
		this.setState({
			announce: AnnounceState.READY
		});
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
	 * Programmatically plays the current media.
	 *
	 * @function
	 * @memberof moonstone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
	 */
	play = () => {
		this.speedIndex = 0;
		this.setPlaybackRate(1);
		this.send('play');
		this.prevCommand = 'play';
	}

	/**
	 * Programmatically plays the current media.
	 *
	 * @function
	 * @memberof moonstone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
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
	 * @function
	 * @memberof moonstone/VideoPlayer.VideoPlayerBase.prototype
	 * @param {Number} timeIndex - Time index to seek
	 * @public
	 */
	seek = (timeIndex) => {
		this.video.currentTime = timeIndex;
	}

	/**
	 * Step a given amount of time away from the current playback position.
	 * Like [seek]{@link moonstone/VideoPlayer.VideoPlayer#seek} but relative.
	 *
	 * @function
	 * @memberof moonstone/VideoPlayer.VideoPlayerBase.prototype
	 * @param {Number} distance - Time value to jump
	 * @public
	 */
	jump = (distance) => {
		this.showFeedback();
		this.startDelayedFeedbackHide();
		this.seek(this.state.currentTime + distance);
	}

	/**
	 * Changes the playback speed via [selectPlaybackRate()]{@link moonstone/VideoPlayer.VideoPlayer#selectPlaybackRate}.
	 *
	 * @function
	 * @memberof moonstone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
	 */
	fastForward = () => {
		let shouldResumePlayback = false;

		switch (this.prevCommand) {
			case 'slowForward':
				if (this.speedIndex === this.playbackRates.length - 1) {
					// reached to the end of array => fastforward
					this.selectPlaybackRates('fastForward');
					this.speedIndex = 0;
					this.prevCommand = 'fastForward';
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
			case 'fastForward':
				this.speedIndex = this.clampPlaybackRate(this.speedIndex + 1);
				this.prevCommand = 'fastForward';
				break;
			default:
				this.selectPlaybackRates('fastForward');
				this.speedIndex = 0;
				this.prevCommand = 'fastForward';
				if (this.state.paused) {
					shouldResumePlayback = true;
				}
				break;
		}

		this.setPlaybackRate(this.selectPlaybackRate(this.speedIndex));

		if (shouldResumePlayback) this.send('play');

		this.stopDelayedFeedbackHide();

		this.showFeedback();
	}

	/**
	 * Changes the playback speed via [selectPlaybackRate()]{@link moonstone/VideoPlayer.VideoPlayer#selectPlaybackRate}.
	 *
	 * @function
	 * @memberof moonstone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
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

		this.stopDelayedFeedbackHide();

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

		if (!platform.webos) {
			// For supporting cross browser behavior
			if (pbNumber < 0) {
				this.beginRewind();
			}
		}
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
			type: ev.type,
			// Specific state variables are included in the outgoing calback payload, not all of them
			...this.getMediaState()
		};
	}

	handleEvent = (ev) => {
		this.updateMainState();
		if (ev.type === 'onLoadStart') {
			this.handleLoadStart(ev);
		}

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

	handleSpotlightUpFromSlider = handle(
		stopImmediate,
		this.hideControls
	);

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
		this.sliderScrubbing = false;
	}
	handleKnobMove = (ev) => {
		this.sliderScrubbing = ev.detached;

		// prevent announcing repeatedly when the knob is detached from the progress.
		// TODO: fix Slider to not send onKnobMove when the knob hasn't, in fact, moved
		if (this.sliderKnobProportion !== ev.proportion) {
			this.sliderKnobProportion = ev.proportion;
			const seconds = Math.round(this.sliderKnobProportion * this.video.duration);

			if (this.sliderScrubbing && !isNaN(seconds)) {
				const knobTime = secondsToTime(seconds, this.durfmt, {includeHour: true});

				forward('onScrub', {...ev, seconds}, this.props);

				this.announce(`${$L('jump to')} ${knobTime}`);
			}
		}
	}
	handleMouseOver = () => {
		this.setState({
			mouseOver: true,
			feedbackVisible: true
		});
		this.stopDelayedFeedbackHide();
	}
	handleMouseOut = () => {
		this.setState({mouseOver: false});
		this.startDelayedFeedbackHide();
	}
	onJumpBackward = this.handle(
		(ev, props) => forwardJumpBackwardButtonClick(this.addStateToEvent(ev), props),
		() => this.jump(-1 * this.props.jumpBy)
	)
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
			this.announce($L(playLabel));
		} else {
			this.pause();
			this.announce($L(pauseLabel));
		}
	}
	onForward = (ev) => {
		ev = this.addStateToEvent(ev);
		forwardForwardButtonClick(ev, this.props);
		this.fastForward();
	}
	onJumpForward = this.handle(
		(ev, props) => forwardJumpForwardButtonClick(this.addStateToEvent(ev), props),
		() => this.jump(this.props.jumpBy)
	)
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
			titleVisible: true,
			announce: this.state.announce < AnnounceState.INFO ? AnnounceState.INFO : AnnounceState.DONE
		});
	}

	setPlayerRef = (node) => {
		this.player = node;
	}

	setVideoRef = (video) => {
		this.video = video;
	}

	setAnnounceRef = (node) => {
		this.announceRef = node;
	}

	handleLoadStart = () => {
		if (!this.props.noAutoPlay) {
			this.video.play();
		}
	}

	renderBottomControl = new Job(() => {
		this.setState({bottomControlsRendered: true});
	});

	getControlsAriaProps () {
		if (this.state.announce === AnnounceState.TITLE) {
			return {
				role: 'alert',
				'aria-live': 'off',
				'aria-labelledby': `${this.id}_title`
			};
		} else if (this.state.announce === AnnounceState.INFO) {
			return {
				role: 'alert',
				'aria-live': 'off',
				'aria-labelledby': `${this.id}_info`
			};
		}

		return null;
	}

	render () {
		const {backwardIcon, children, className, forwardIcon, infoComponents, jumpBackwardIcon, jumpButtonsDisabled, jumpForwardIcon, leftComponents, noAutoPlay, noJumpButtons, noRateButtons, noSlider, pauseIcon, playIcon, rateButtonsDisabled, rightComponents, source, style, thumbnailSrc, title, ...rest} = this.props;
		delete rest.announce;
		delete rest.autoCloseTimeout;
		delete rest.feedbackHideDelay;
		delete rest.jumpBy;
		delete rest.onControlsAvailable;
		delete rest.onBackwardButtonClick;
		delete rest.onForwardButtonClick;
		delete rest.onJumpBackwardButtonClick;
		delete rest.onJumpForwardButtonClick;
		delete rest.onPlayButtonClick;
		delete rest.onScrub;
		delete rest.pauseAtEnd;
		delete rest.playbackRateHash;
		delete rest.setApiProvider;
		delete rest.titleHideDelay;
		delete rest.tooltipHideDelay;

		// Remove the events we manually added so they aren't added twice or fail.
		for (let eventName in handledCustomMediaEventsMap) {
			delete rest[handledCustomMediaEventsMap[eventName]];
		}

		// Handle some cases when the "more" button is pressed
		const moreDisabled = !(this.state.more);
		const controlsAriaProps = this.getControlsAriaProps();

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

				{this.state.bottomControlsRendered ?
					<div className={css.fullscreen + ' enyo-fit scrim'} style={{display: this.state.bottomControlsVisible ? 'block' : 'none'}} {...controlsAriaProps}>
						<Container className={css.bottom} data-container-disabled={!this.state.bottomControlsVisible}>
							{/* Info Section: Title, Description, Times */}
							<div className={css.infoFrame}>
								<MediaTitle
									id={this.id}
									infoVisible={this.state.more}
									title={title}
									visible={this.state.titleVisible}
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
								onMouseOver={this.handleMouseOver}
								onMouseOut={this.handleMouseOut}
								onSpotlightUp={this.handleSpotlightUpFromSlider}
								onSpotlightDown={this.handleSpotlightDownFromSlider}
							>
								<FeedbackTooltip
									noFeedback={this.state.mouseOver}
									playbackState={this.prevCommand}
									playbackRate={this.selectPlaybackRate(this.speedIndex)}
									thumbnailSrc={thumbnailSrc}
									visible={this.state.feedbackVisible}
								>
									{secondsToTime(this.state.sliderTooltipTime, this.durfmt)}
								</FeedbackTooltip>
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
								pauseLabel={pauseLabel}
								playIcon={playIcon}
								playLabel={playLabel}
								rateButtonsDisabled={rateButtonsDisabled}
								rightComponents={rightComponents}
								showMoreComponents={this.state.more}
							>
								{children}
							</MediaControls>
						</Container>
					</div> :
					null
				}
				<SpottableDiv
					// This captures spotlight focus for use with 5-way.
					// It's non-visible but lives at the top of the VideoPlayer.
					className={css.controlsHandleAbove}
					onSpotlightDown={this.showControls}
					onSpotlightLeft={this.handleLeft}
					onSpotlightRight={this.handleRight}
					onClick={this.showControls}
				/>
				<Announce ref={this.setAnnounceRef} />
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
 * To invoke methods (`fastForward()`, `jump()`, `pause()`, `play()`, `rewind()`, `seek()`) or get
 * the current state (`getMediaState()`), store a ref to the `VideoPlayer` within your component:
 *
 * ```
 * 	...
 *
 * 	setVideoPlayer = (node) => {
 * 		this.videoPlayer = node;
 * 	}
 *
 * 	play () {
 * 		this.videoPlayer.play();
 * 	}
 *
 * 	render () {
 * 		return (
 * 			<VideoPlayer ref={this.setVideoPlayer} />
 * 		);
 * 	}
 * ```
 *
 * @class VideoPlayer
 * @memberof moonstone/VideoPlayer
 * @mixes ui/Slottable.Slottable
 * @ui
 * @public
 */
const VideoPlayer = ApiDecorator(
	{api: ['fastForward', 'getMediaState', 'jump', 'pause', 'play', 'rewind', 'seek']},
	Slottable(
		{slots: ['infoComponents', 'leftComponents', 'rightComponents', 'source']},
		Skinnable(
			VideoPlayerBase
		)
	)
);

export default VideoPlayer;
export {VideoPlayer, VideoPlayerBase};
