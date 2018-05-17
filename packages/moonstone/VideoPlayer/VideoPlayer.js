/**
 * Provides Moonstone-themed video player components.
 *
 * @module moonstone/VideoPlayer
 * @exports VideoPlayer
 * @exports VideoPlayerBase
 * @exports MediaSlider
 * @exports MediaControls
 */

import Announce from '@enact/ui/AnnounceDecorator/Announce';
import ApiDecorator from '@enact/core/internal/ApiDecorator';
import ComponentOverride from '@enact/ui/ComponentOverride';
import equals from 'ramda/src/equals';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import DurationFmt from '@enact/i18n/ilib/lib/DurationFmt';
import {contextTypes, FloatingLayerDecorator} from '@enact/ui/FloatingLayer';
import {adaptEvent, call, forKey, forward, forwardWithPrevent, handle, stopImmediate} from '@enact/core/handle';
import ilib from '@enact/i18n';
import {perfNow, Job} from '@enact/core/util';
import {on, off} from '@enact/core/dispatcher';
import {platform} from '@enact/core/platform';
import {is} from '@enact/core/keymap';
import Media from '@enact/ui/Media';
import Slottable from '@enact/ui/Slottable';
import Touchable from '@enact/ui/Touchable';
import Spotlight from '@enact/spotlight';
import {Spottable, spottableClass} from '@enact/spotlight/Spottable';
import {SpotlightContainerDecorator, spotlightDefaultClass} from '@enact/spotlight/SpotlightContainerDecorator';
import {toUpperCase} from '@enact/i18n/util';

import $L from '../internal/$L';
import Spinner from '../Spinner';
import Skinnable from '../Skinnable';

import {calcNumberValueOfPlaybackRate, compareSources, secondsToTime} from './util';
import Overlay from './Overlay';
import MediaControls from './MediaControls';
import MediaTitle from './MediaTitle';
import MediaSlider from './MediaSlider';
import FeedbackContent from './FeedbackContent';
import FeedbackTooltip from './FeedbackTooltip';
import Times from './Times';
import VideoWithPreload from './VideoWithPreload';

import css from './VideoPlayer.less';

const SpottableDiv = Touchable(Spottable('div'));
const RootContainer = SpotlightContainerDecorator('div');
const ControlsContainer = SpotlightContainerDecorator(
	{
		leaveFor: {down:'', up:'', left:'', right:''},
		enterTo: ''
	},
	'div'
);

const forwardWithState = (type) => adaptEvent(call('addStateToEvent'), forwardWithPrevent(type));

// provide forwarding of events on media controls
const forwardControlsAvailable = forward('onControlsAvailable');
const forwardPlay = forwardWithState('onPlay');
const forwardPause = forwardWithState('onPause');
const forwardRewind = forwardWithState('onRewind');
const forwardFastForward = forwardWithState('onFastForward');
const forwardJumpBackward = forwardWithState('onJumpBackward');
const forwardJumpForward = forwardWithState('onJumpForward');

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
 * @property {Number} playbackRate - Current playback rate, as a number
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

	static contextTypes = contextTypes

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
		 * Removes interactive capability from this component. This includes, but is not limited to,
		 * key-press events, most clickable buttons, and prevents the showing of the controls.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

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
		 * Components placed below the title.
		 *
		 * Typically these will be media descriptor icons, like how many audio channels, what codec
		 * the video uses, but can also be a description for the video or anything else that seems
		 * appropriate to provide information about the video to the user.
		 *
		 * @type {Node}
		 * @public
		 */
		infoComponents: PropTypes.node,

		/**
		 * The number of seconds the player should skip forward or backward when a "jump" button is
		 * pressed.
		 *
		 * @type {Number}
		 * @default 30
		 * @public
		 */
		jumpBy: PropTypes.number,

		/**
		 * Manually set the loading state of the media, in case you have information that
		 * `VideoPlayer` does not have.
		 *
		 * @type {Boolean}
		 * @public
		 */
		loading: PropTypes.bool,

		/**
		 * Overrides the default media control component to support customized behaviors.
		 *
		 * The provided component will receive the following props from `VideoPlayer`:
		 *
		 * * `mediaDisabled`             - `true` when the media controls are not interactive
		 * * `onBackwardButtonClick`     - Called when the rewind button is pressed
		 * * `onFastForward`             - Called when the media is fast forwarded via a key event
		 * * `onForwardButtonClick`      - Called when the fast forward button is pressed
		 * * `onJump`                    - Called when the media jumps either forward or backward
		 * * `onJumpBackwardButtonClick` - Called when the jump backward button is pressed
		 * * `onJumpForwardButtonClick`  - Called when the jump forward button is pressed
		 * * `onKeyDown`                 - Called when a key is pressed
		 * * `onPause`                   - Called when the media is paused via a key event
		 * * `onPlay`                    - Called when the media is played via a key event
		 * * `onRewind`                  - Called when the media is rewound via a key event
		 * * `onToggleMore`              - Called when the more components are hidden or shown
		 * * `paused`                    - `true` when the media is paused
		 * * `spotlightDisabled`         - `true` when spotlight is disabled for the media controls
		 * * `visible`                   - `true` when the media controls should be displayed
		 *
		 * @type {Component|Element}
		 * @default `moonstone/VideoPlayer.MediaControls`
		 * @public
		 */
		mediaControlsComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

		/**
		 * Overries the default media slider component to support customized behaviors.
		 *
		 * The provided component will receive the following props from `VideoPlayer`
		 *
		 * * backgroundProgress - The proportion of the video loaded
		 * * children           - A tooltip component
		 * * disabled           - `true` when the slider is not interactive
		 * * forcePressed       - `true` when the slider's knob should appear pressed
		 * * onBlur             - Called when the slider loses focus
		 * * onChange           - Called when the user has changed the slider's value
		 * * onFocus            - Called when the slider gains focus
		 * * onKeyDown          - Called when a key is pressed
		 * * onKnobMove         - Called when the knob is moved when in preview mode
		 * * onSpotlightUp      - Called when pressing the "up" key
		 * * spotlightDisabled  - `true` when spotlight is disabled for the slider
		 * * value              - The current play time of the video as a proportion of its duration
		 * * visible            - `true` if the slider should be displayed
		 *
		 * @type {Component|Element}
		 * @default `moonstone/VideoPlayer.MediaSlider`
		 * @public
		 */
		mediaSliderComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

		/**
		 * Amount of time (in milliseconds), after the last user action, that the `miniFeedback`
		 * will automatically hide.
		 * Setting this to 0 or `null` disables `miniFeedbackHideDelay`; `miniFeedback` will always
		 * be present.
		 *
		 * @type {Number}
		 * @default 2000
		 * @public
		 */
		miniFeedbackHideDelay: PropTypes.number,

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
		 * Removes the mini feedback.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noMiniFeedback: PropTypes.bool,

		/**
		 * Removes the media slider.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noSlider: PropTypes.bool,

		/**
		 * Removes spinner while loading.
		 *
		 * @type {Boolean}
		 * @public
		 */
		noSpinner: PropTypes.bool,

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
		 * Function executed when the video is fast forwarded
		 *
		 * @type {Function}
		 * @public
		 */
		onFastForward: PropTypes.func,

		/**
		 * Function executed when the user clicks the JumpBackward button. Is passed
		 * a {@link moonstone/VideoPlayer.videoStatus} as the first argument.
		 *
		 * @type {Function}
		 * @public
		 */
		onJumpBackward: PropTypes.func,

		/**
		 * Function executed when the user clicks the JumpForward button. Is passed
		 * a {@link moonstone/VideoPlayer.videoStatus} as the first argument.
		 *
		 * @type {Function}
		 * @public
		 */
		onJumpForward: PropTypes.func,

		/**
		 * Funtion executed when video is paused
		 *
		 * @type {Function}
		 * @public
		 */
		onPause: PropTypes.func,

		/**
		 * Funtion executed when video is played
		 *
		 * @type {Function}
		 * @public
		 */
		onPlay: PropTypes.func,

		/**
		 * Funtion executed when video is rewound
		 *
		 * @type {Function}
		 * @public
		 */
		onRewind: PropTypes.func,

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
		 * Function executed when seek is attemped while `seekDisabled` is true.
		 *
		 * @type {Function}
		 */
		onSeekFailed: PropTypes.func,

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
		 * The video source to be preloaded.
		 *
		 * Expects a `<source>` node.
		 *
		 * @type {String|Node}
		 * @public
		 */
		preloadSource:  PropTypes.node,

		/**
		 * When `true`, seek function is disabled.
		 *
		 * Note that jump by arrow keys will also be disabled when `true`.
		 *
		 * @type {Boolean}
		 * @public
		 */
		seekDisabled: PropTypes.bool,

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
		 * be sent directly to the `videoComponent` as video sources.
		 * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source
		 *
		 * @type {Node}
		 * @public
		 */
		source: PropTypes.node,

		/**
		 * When `true`, the component cannot be navigated using spotlight.
		 *
		 * @type {Boolean}
		 * @public
		 */
		spotlightDisabled: PropTypes.bool,

		/**
		 * Specifies the spotlight container ID for the player
		 *
		 * @type {String}
		 * @public
		 */
		spotlightId: PropTypes.string,

		/**
		 * This component will be used instead of the built-in version. The internal thumbnail style
		 * will not be applied to this component. This component follows the same rules as the built-in
		 * version.
		 *
		 * @type {Node}
		 * @public
		 */
		thumbnailComponent: PropTypes.node,

		/**
		 * Set a thumbnail image source to show on VideoPlayer's Slider knob. This is a standard
		 * {@link moonstone/Image} component so it supports all of the same options for the `src`
		 * property. If no `thumbnailComponent` and no `thumbnailSrc` is set, no tooltip will
		 * display.
		 *
		 * @type {String|Object}
		 * @public
		 */
		thumbnailSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

		/**
		* Enables the thumbnail transition from opaque to translucent.
		*
		* @type {Boolean}
		* @public
		*/
		thumbnailUnavailable: PropTypes.bool,

		/**
		 * Set a title for the video being played.
		 *
		 * @type {String|Node}
		 * @public
		 */
		title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

		/**
		 * The amount of time in milliseconds that should pass before the title disappears from the
		 * controls. Setting this to `0` disables the hiding.
		 *
		 * @type {Number}
		 * @default 5000
		 * @public
		 */
		titleHideDelay: PropTypes.number,

		/**
		 * Video component to use. The default (`'video'`) renders an `HTMLVideoElement`. Custom
		 * video components must have a similar API structure, exposing the following APIs:
		 *
		 * Properties:
		 * * `currentTime` {Number} - Playback index of the media in seconds
		 * * `duration` {Number} - Media's entire duration in seconds
		 * * `error` {Boolean} - `true` if video playback has errored.
		 * * `loading` {Boolean} - `true` if video playback is loading.
		 * * `paused` {Boolean} - Playing vs paused state. `true` means the media is paused
		 * * `playbackRate` {Number} - Current playback rate, as a number
		 * * `proportionLoaded` {Number} - A value between `0` and `1`
		 *	representing the proportion of the media that has loaded
		 * * `proportionPlayed` {Number} - A value between `0` and `1` representing the
		 *	proportion of the media that has already been shown
		 *
		 * Events:
		 * * `onPlay` - Sent when playback of the media starts after having been paused
		 * * `onUpdate` - Sent when any of the properties were updated
		 *
		 * Methods:
		 * * `play()` - play video
		 * * `pause()` - pause video
		 * * `load()` - load video
		 *
		 * The [`source`]{@link moonstone/VideoPlayer.VideoPlayerBase.source} property is passed to the video
		 * component as a child node.
		 *
		 * @type {Component}
		 * @default 'video'
		 * @public
		 */
		videoComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
	}

	static defaultProps = {
		autoCloseTimeout: 5000,
		feedbackHideDelay: 3000,
		jumpBy: 30,
		mediaControlsComponent: MediaControls,
		mediaSliderComponent: MediaSlider,
		miniFeedbackHideDelay: 2000,
		playbackRateHash: {
			fastForward: ['2', '4', '8', '16'],
			rewind: ['-2', '-4', '-8', '-16'],
			slowForward: ['1/4', '1/2'],
			slowRewind: ['-1/2', '-1']
		},
		titleHideDelay: 5000,
		videoComponent: 'video'
	}

	constructor (props) {
		super(props);

		// Internal State
		this.video = null;
		this.pulsedPlaybackRate = null;
		this.pulsedPlaybackState = null;
		this.prevCommand = (props.noAutoPlay ? 'pause' : 'play');
		this.showMiniFeedback = false;
		this.speedIndex = 0;
		this.firstPlayReadFlag = true;
		this.id = this.generateId();
		this.selectPlaybackRates('fastForward');
		this.sliderKnobProportion = 0;

		this.initI18n();

		// Re-render-necessary State
		this.state = {
			announce: AnnounceState.READY,
			currentTime: 0,
			duration: 0,
			error: false,
			loading: false,
			paused: props.noAutoPlay,
			playbackRate: 1,
			titleOffsetHeight: 0,
			bottomOffsetHeight: 0,

			// Non-standard state computed from properties
			bottomControlsRendered: false,
			feedbackIconVisible: true,
			feedbackVisible: false,
			mediaControlsVisible: false,
			miniFeedbackVisible: false,
			mediaSliderVisible: false,
			infoVisible: false,
			proportionLoaded: 0,
			proportionPlayed: 0,
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
		this.startDelayedFeedbackHide();
	}

	componentWillReceiveProps (nextProps) {
		const {source} = this.props;
		const {source: nextSource} = nextProps;

		if (!compareSources(source, nextSource)) {
			this.firstPlayReadFlag = true;
			this.setState({currentTime: 0, proportionPlayed: 0, proportionLoaded: 0});
		}
	}

	shouldComponentUpdate (nextProps, nextState) {
		const {source} = this.props;
		const {source: nextSource} = nextProps;

		if (!compareSources(source, nextSource)) {
			return true;
		}

		if (
			!this.state.miniFeedbackVisible && this.state.miniFeedbackVisible === nextState.miniFeedbackVisible &&
			!this.state.mediaSliderVisible && this.state.mediaSliderVisible === nextState.mediaSliderVisible &&
			this.state.loading === nextState.loading && this.props.loading === nextProps.loading &&
			(
				this.state.currentTime !== nextState.currentTime ||
				this.state.proportionPlayed !== nextState.proportionPlayed ||
				this.state.sliderTooltipTime !== nextState.sliderTooltipTime
			)
		) {
			return false;
		} else {
			return true;
		}
	}

	componentWillUpdate (nextProps) {
		const
			isInfoComponentsEqual = equals(this.props.infoComponents, nextProps.infoComponents),
			{titleOffsetHeight: titleHeight} = this.state,
			shouldCalculateTitleOffset = (
				((!titleHeight && isInfoComponentsEqual) || (titleHeight && !isInfoComponentsEqual)) &&
				this.state.mediaControlsVisible
			);

		this.initI18n();

		if (shouldCalculateTitleOffset) {
			const titleOffsetHeight = this.getHeightForElement('infoComponents');
			if (titleOffsetHeight) {
				this.setState({titleOffsetHeight});
			}
		}
	}

	componentDidUpdate (prevProps, prevState) {
		const {source} = this.props;
		const {source: prevSource, preloadSource: prevPreloadSource} = prevProps;

		if (!compareSources(source, prevSource)) {
			const isPreloadedVideo = source && prevPreloadSource && compareSources(source, prevPreloadSource);
			this.reloadVideo(isPreloadedVideo);
		}

		this.setFloatingLayerShowing(this.state.mediaControlsVisible || this.state.mediaSliderVisible);

		if (!this.state.mediaControlsVisible && prevState.mediaControlsVisible) {
			forwardControlsAvailable({available: false}, this.props);
			this.stopAutoCloseTimeout();

			if (!this.props.spotlightDisabled ) {
				// Set focus to the hidden spottable control - maintaining focus on available spottable
				// controls, which prevents an addiitional 5-way attempt in order to re-show media controls
				Spotlight.focus(`.${css.controlsHandleAbove}`);
			}
		} else if (this.state.mediaControlsVisible && !prevState.mediaControlsVisible) {
			forwardControlsAvailable({available: true}, this.props);
			this.startAutoCloseTimeout();

			if (!this.props.spotlightDisabled ) {
				const current = Spotlight.getCurrent();
				if (!current || this.player.contains(current)) {
					// Set focus within media controls when they become visible.
					this.focusDefaultMediaControl();
				}
			}
		}
	}

	componentWillUnmount () {
		off('mousemove', this.activityDetected);
		off('keypress', this.activityDetected);
		off('keydown', this.handleGlobalKeyDown);
		this.stopRewindJob();
		this.stopAutoCloseTimeout();
		this.stopDelayedTitleHide();
		this.stopDelayedFeedbackHide();
		this.stopDelayedMiniFeedbackHide();
		this.announceJob.stop();
		this.renderBottomControl.stop();
		this.sliderTooltipTimeJob.stop();
		this.slider5WayPressJob.stop();
	}

	//
	// Internal Methods
	//
	announceJob = new Job(msg => (this.announceRef && this.announceRef.announce(msg)), 200)

	announce = (msg) => {
		this.announceJob.start(msg);
	}

	getHeightForElement = (elementName) => {
		const element = this.player.querySelector(`.${css[elementName]}`);
		if (element) {
			return element.offsetHeight;
		} else {
			return 0;
		}
	}

	initI18n = () => {
		const locale = ilib.getLocale();

		if (this.locale !== locale && typeof window === 'object') {
			this.locale = locale;

			this.durfmt = new DurationFmt({length: 'medium', style: 'clock', useNative: false});
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
		if (this.props.autoCloseTimeout && this.state.mediaControlsVisible) {
			this.autoCloseJob.startAfter(this.props.autoCloseTimeout);
		}
	}

	stopAutoCloseTimeout = () => {
		this.autoCloseJob.stop();
	}

	generateId = () => {
		return Math.random().toString(36).substr(2, 8);
	}

	/**
	 * If the announce state is either ready to read the title or ready to read info, advance the
	 * state to "read".
	 *
	 * @returns {Boolean} Returns true to be used in event handlers
	 * @private
	 */
	markAnnounceRead = () => {
		if (this.state.announce === AnnounceState.TITLE) {
			this.setState({announce: AnnounceState.TITLE_READ});
		} else if (this.state.announce === AnnounceState.INFO) {
			this.setState({announce: AnnounceState.DONE});
		}

		return true;
	}

	setFloatingLayerShowing = (showing) => {
		const layer = this.context.getFloatingLayer && this.context.getFloatingLayer();
		if (layer) {
			layer.style.display = showing ? 'block' : 'none';
		}
	}

	/**
	 * Shows media controls.
	 *
	 * @function
	 * @memberof moonstone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
	 */
	showControls = () => {
		if (this.props.disabled) {
			return;
		}
		this.startDelayedFeedbackHide();
		this.startDelayedTitleHide();

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
			feedbackVisible: true,
			mediaControlsVisible: true,
			mediaSliderVisible: true,
			miniFeedbackVisible: false,
			titleVisible: true
		});
	}

	/**
	 * Hides media controls.
	 *
	 * @function
	 * @memberof moonstone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
	 */
	hideControls = () => {
		this.stopDelayedFeedbackHide();
		this.stopDelayedMiniFeedbackHide();
		this.stopDelayedTitleHide();
		this.stopAutoCloseTimeout();
		this.setState({
			feedbackVisible: false,
			mediaControlsVisible: false,
			mediaSliderVisible: false,
			miniFeedbackVisible: false,
			infoVisible: false
		});
		this.markAnnounceRead();
	}

	/**
	 * Toggles the media controls.
	 *
	 * @function
	 * @memberof moonstone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
	 */
	toggleControls = () => {
		if (this.state.mediaControlsVisible) {
			this.hideControls();
		} else {
			this.showControls();
		}
	}

	doAutoClose = () => {
		this.stopDelayedFeedbackHide();
		this.stopDelayedTitleHide();
		this.setState({
			feedbackVisible: false,
			mediaControlsVisible: false,
			mediaSliderVisible: this.state.mediaSliderVisible && this.state.miniFeedbackVisible,
			infoVisible: false
		});
		this.markAnnounceRead();
	}

	autoCloseJob = new Job(this.doAutoClose)

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
		if (this.state.mediaControlsVisible && !this.state.feedbackVisible) {
			this.setState({feedbackVisible: true});
		} else if (!this.state.mediaControlsVisible) {
			const shouldShowSlider = this.pulsedPlaybackState !== null || calcNumberValueOfPlaybackRate(this.playbackRate) !== 1;

			if (this.showMiniFeedback && (!this.state.miniFeedbackVisible || this.state.mediaSliderVisible !== shouldShowSlider)) {
				this.setState({
					mediaSliderVisible: shouldShowSlider,
					miniFeedbackVisible: !(this.state.loading || !this.state.duration || this.state.error)
				});
			}
		}
	}

	hideFeedback = () => {
		if (this.state.feedbackVisible) {
			this.setState({feedbackVisible: false});
		}
	}

	hideFeedbackJob = new Job(this.hideFeedback)

	startDelayedMiniFeedbackHide = (delay = this.props.miniFeedbackHideDelay) => {
		if (delay) {
			this.hideMiniFeedbackJob.startAfter(delay);
		}
	}

	stopDelayedMiniFeedbackHide = () => {
		this.hideMiniFeedbackJob.stop();
	}

	hideMiniFeedback = () => {
		if (this.state.miniFeedbackVisible) {
			this.showMiniFeedback = false;
			this.setState({
				mediaSliderVisible: false,
				miniFeedbackVisible: false
			});
		}
	}

	hideMiniFeedbackJob = new Job(this.hideMiniFeedback)

	handle = handle.bind(this)

	showControlsFromPointer = () => {
		Spotlight.setPointerMode(false);
		this.showControls();
	}

	clearPulsedPlayback = () => {
		this.pulsedPlaybackRate = null;
		this.pulsedPlaybackState = null;
	}

	// only show mini feedback if playback controls are invoked by a key event
	shouldShowMiniFeedback = (ev) => {
		if (ev.type === 'keyup') {
			this.showMiniFeedback = true;
		}
		return true;
	}

	handlePlay = this.handle(
		forwardPlay,
		this.shouldShowMiniFeedback,
		() => this.play()
	)

	handlePause = this.handle(
		forwardPause,
		this.shouldShowMiniFeedback,
		() => this.pause()
	)

	handleRewind = this.handle(
		forwardRewind,
		this.shouldShowMiniFeedback,
		() => this.rewind(),
	)

	handleFastForward = this.handle(
		forwardFastForward,
		this.shouldShowMiniFeedback,
		() => this.fastForward()
	)

	handleJump = ({keyCode}) => {
		if (this.props.seekDisabled) {
			forward('onSeekFailed', {}, this.props);
		} else if (is('left', keyCode)) {
			this.showMiniFeedback = true;
			this.jump(-1 * this.props.jumpBy);
			this.announceJob.startAfter(500, secondsToTime(this.video.currentTime, this.durfmt, {includeHour: true}));
		} else if (is('right', keyCode)) {
			this.showMiniFeedback = true;
			this.jump(this.props.jumpBy);
			this.announceJob.startAfter(500, secondsToTime(this.video.currentTime, this.durfmt, {includeHour: true}));
		}
	}

	handleGlobalKeyDown = this.handle(
		this.activityDetected,
		forKey('down'),
		() => (
			!this.state.mediaControlsVisible &&
			!Spotlight.getCurrent() &&
			Spotlight.getPointerMode() &&
			!this.props.spotlightDisabled
		),
		stopImmediate,
		this.showControlsFromPointer
	)

	//
	// Media Interaction Methods
	//
	handleEvent = () => {
		const el = this.video;
		const updatedState = {
			// Standard media properties
			currentTime: el.currentTime,
			duration: el.duration,
			paused: el.playbackRate !== 1 || el.paused,
			playbackRate: el.playbackRate,

			// Non-standard state computed from properties
			proportionLoaded: el.proportionLoaded,
			proportionPlayed: el.proportionPlayed || 0,
			error: el.error,
			loading: el.loading,
			sliderTooltipTime: this.sliderScrubbing ? (this.sliderKnobProportion * el.duration) : el.currentTime
		};

		// If there's an error, we're obviously not loading, no matter what the readyState is.
		if (updatedState.error) updatedState.loading = false;

		updatedState.mediaControlsDisabled = (
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

	handlePlayEvent = (ev) => {
		forward('onPlay', ev, this.props);
		if (!this.state.bottomControlsRendered) {
			this.renderBottomControl.idle();
		}
	}

	renderBottomControl = new Job(() => {
		this.setState({bottomControlsRendered: true});
	});

	/**
	 * Returns an object with the current state of the media including `currentTime`, `duration`,
	 * `paused`, `playbackRate`, `proportionLoaded`, and `proportionPlayed`.
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
			playbackRate      : this.video.playbackRate,
			proportionLoaded  : this.state.proportionLoaded,
			proportionPlayed  : this.state.proportionPlayed
		};
	}

	reloadVideo = (isPreloaded) => {
		// When changing a HTML5 video, you have to reload it.
		if (!isPreloaded) {
			this.video.load();
		}

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
		this.clearPulsedPlayback();
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
		if (this.firstPlayReadFlag) {
			this.firstPlayReadFlag = false;
		} else {
			this.announce($L('Play'));
		}
		this.startDelayedMiniFeedbackHide(5000);
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
		this.announce($L('Pause'));
		this.stopDelayedMiniFeedbackHide();
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
		if (!this.props.seekDisabled) {
			this.video.currentTime = timeIndex;
		} else {
			forward('onSeekFailed', {}, this.props);
		}
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
		this.pulsedPlaybackRate = toUpperCase(new DurationFmt({length: 'long'}).format({second: this.props.jumpBy}));
		this.pulsedPlaybackState = distance > 0 ? 'jumpForward' : 'jumpBackward';
		this.showFeedback();
		this.startDelayedFeedbackHide();
		this.seek(this.state.currentTime + distance);
		this.startDelayedMiniFeedbackHide();
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
		this.stopDelayedMiniFeedbackHide();
		this.clearPulsedPlayback();
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
		const rateForSlowRewind = this.props.playbackRateHash['slowRewind'];
		let shouldResumePlayback = false,
			command = 'rewind';

		if (this.video.currentTime === 0) {
			// Do not rewind if currentTime is 0. We're already at the beginning.
			return;
		}
		switch (this.prevCommand) {
			case 'slowRewind':
				if (this.speedIndex === this.playbackRates.length - 1) {
					// reached to the end of array => go to rewind
					this.selectPlaybackRates(command);
					this.speedIndex = 0;
					this.prevCommand = command;
				} else {
					this.speedIndex = this.clampPlaybackRate(this.speedIndex + 1);
				}
				break;
			case 'pause':
				// If it's possible to slowRewind, do it, otherwise just leave it as normal rewind : QEVENTSEVT-17386
				if (rateForSlowRewind && rateForSlowRewind.length >= 0) {
					command = 'slowRewind';
				}
				this.selectPlaybackRates(command);
				if (this.state.paused && this.state.duration > this.state.currentTime) {
					shouldResumePlayback = true;
				}
				this.speedIndex = 0;
				this.prevCommand = command;
				break;
			case 'rewind':
				this.speedIndex = this.clampPlaybackRate(this.speedIndex + 1);
				this.prevCommand = command;
				break;
			default:
				this.selectPlaybackRates(command);
				this.speedIndex = 0;
				this.prevCommand = command;
				break;
		}

		this.setPlaybackRate(this.selectPlaybackRate(this.speedIndex));

		if (shouldResumePlayback) this.send('play');

		this.stopDelayedFeedbackHide();
		this.stopDelayedMiniFeedbackHide();
		this.clearPulsedPlayback();
		this.showFeedback();
	}

	// Creates a proxy to the video node if Proxy is supported
	videoProxy = typeof Proxy !== 'function' ? null : new Proxy({}, {
		get: (target, name) => {
			let value = this.video[name];

			if (typeof value === 'function') {
				value = value.bind(this.video);
			}

			return value;
		},
		set: (target, name, value) => {
			return (this.video[name] = value);
		}
	})

	/**
	 * Returns a proxy to the underlying `<video>` node currently used by the VideoPlayer
	 *
	 * @function
	 * @memberof moonstone/VideoPlayer.VideoPlayerBase.prototype
	 * @public
	 */
	getVideoNode = () => {
		return this.videoProxy || this.video;
	}

	areControlsVisible = () => {
		return this.state.mediaControlsVisible;
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

		if (!platform.webos) {
			// ReactDOM throws error for setting negative value for playbackRate
			this.video.playbackRate = pbNumber < 0 ? 0 : pbNumber;

			// For supporting cross browser behavior
			if (pbNumber < 0) {
				this.beginRewind();
			}
		} else {
			// Set native playback rate
			this.video.playbackRate = pbNumber;
		}
	}

	/**
	 * Calculates the time that has elapsed since. This is necessary for browsers until negative
	 * playback rate is directly supported.
	 *
	 * @private
	 */
	rewindManually = () => {
		const now = perfNow(),
			distance = now - this.rewindBeginTime,
			pbRate = calcNumberValueOfPlaybackRate(this.playbackRate),
			adjustedDistance = (distance * pbRate) / 1000;

		this.jump(adjustedDistance);
		this.stopDelayedMiniFeedbackHide();
		this.clearPulsedPlayback();
		this.startRewindJob();	// Issue another rewind tick
	}

	rewindJob = new Job(this.rewindManually, 100)

	/**
	 * Starts rewind job.
	 *
	 * @private
	 */
	startRewindJob = () => {
		this.rewindBeginTime = perfNow();
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

	disablePointerMode = () => {
		Spotlight.setPointerMode(false);
		return true;
	}

	handleKeyDownFromControls = this.handle(
		// onKeyDown is used as a proxy for when the title has been read because it can only occur
		// after the controls have been shown.
		this.markAnnounceRead,
		forKey('down'),
		this.disablePointerMode,
		this.hideControls
	)

	/**
	 * Check for elements with the spotlightDefaultClass, in the following location order:
	 * left components, right components, media controls or more controls (depending on which is
	 * available)
	 *
	 * @return {Node|false} The focused control or `false` if nothing is found.
	 * @private
	 */
	focusDefaultMediaControl = () => {
		const defaultSpottable = `.${spotlightDefaultClass}.${spottableClass}`;
		const defaultControl =
			this.player.querySelector(
				`.${css.leftComponents} ${defaultSpottable}, .${css.rightComponents} ${defaultSpottable}`
			) ||
			'data-media-controls';

		return defaultControl ? Spotlight.focus(defaultControl) : false;
	}

	//
	// Player Interaction events
	//
	onVideoClick = () => {
		this.toggleControls();
	}

	onSliderChange = ({value}) => {
		this.seek(value * this.state.duration);
		this.sliderScrubbing = false;
	}

	sliderTooltipTimeJob = new Job((time) => this.setState({sliderTooltipTime: time}), 20)

	handleKnobMove = (ev) => {
		this.sliderScrubbing = true;

		// prevent announcing repeatedly when the knob is detached from the progress.
		// TODO: fix Slider to not send onKnobMove when the knob hasn't, in fact, moved
		if (this.sliderKnobProportion !== ev.proportion) {
			this.sliderKnobProportion = ev.proportion;
			const seconds = Math.round(this.sliderKnobProportion * this.video.duration);

			if (!isNaN(seconds)) {
				this.sliderTooltipTimeJob.throttle(seconds);
				const knobTime = secondsToTime(seconds, this.durfmt, {includeHour: true});

				forward('onScrub', {...ev, seconds}, this.props);

				this.announce(`${$L('jump to')} ${knobTime}`);
			}
		}
	}

	handleSliderFocus = () => {
		const seconds = Math.round(this.sliderKnobProportion * this.video.duration);
		this.sliderScrubbing = true;

		this.setState({
			feedbackIconVisible: false,
			feedbackVisible: true
		});
		this.stopDelayedFeedbackHide();

		if (!isNaN(seconds)) {
			this.sliderTooltipTimeJob.throttle(seconds);
			const knobTime = secondsToTime(seconds, this.durfmt, {includeHour: true});

			forward('onScrub', {
				detached: this.sliderScrubbing,
				proportion: this.sliderKnobProportion,
				seconds},
			this.props);

			this.announce(`${$L('jump to')} ${knobTime}`);
		}
	}

	handleSliderBlur = () => {
		this.sliderScrubbing = false;
		this.startDelayedFeedbackHide();
		this.setState({
			feedbackIconVisible: true,
			sliderTooltipTime: this.state.currentTime
		});
	}

	slider5WayPressJob = new Job(() => {
		this.setState({slider5WayPressed: false});
	}, 200);

	handleSliderKeyDown = (ev) => {
		if (is('enter', ev.keyCode)) {
			this.setState({
				slider5WayPressed: true
			}, this.slider5WayPressJob.start());
		} else if (is('down', ev.keyCode)) {
			Spotlight.setPointerMode(false);

			if (this.focusDefaultMediaControl()) {
				stopImmediate(ev);
			}
		} else if (is('up', ev.keyCode)) {
			stopImmediate(ev);

			this.handleSliderBlur();
			this.hideControls();
		}
	}

	onJumpBackward = this.handle(
		forwardJumpBackward,
		() => this.jump(-1 * this.props.jumpBy)
	)
	onJumpForward = this.handle(
		forwardJumpForward,
		() => this.jump(this.props.jumpBy)
	)

	handleToggleMore = ({showMoreComponents}) => {
		if (showMoreComponents) {
			this.startAutoCloseTimeout();	// Restore the timer since we are leaving "more.
			// Restore the title-hide now that we're finished with "more".
			this.startDelayedTitleHide();
		} else {
			// Interrupt the title-hide since we don't want it hiding autonomously in "more".
			this.stopDelayedTitleHide();
		}

		this.setState({
			infoVisible: showMoreComponents,
			titleVisible: true,
			announce: this.state.announce < AnnounceState.INFO ? AnnounceState.INFO : AnnounceState.DONE
		});
	}

	setPlayerRef = (node) => {
		// TODO: We've moved SpotlightContainerDecorator up to allow VP to be spottable but also
		// need a ref to the root node to query for children and set CSS variables.
		// eslint-disable-next-line react/no-find-dom-node
		this.player = ReactDOM.findDOMNode(node);
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
		const {
			className,
			disabled,
			infoComponents,
			loading,
			mediaControlsComponent,
			mediaSliderComponent,
			noAutoPlay,
			noMiniFeedback,
			noSlider,
			noSpinner,
			preloadSource,
			source,
			spotlightDisabled,
			spotlightId,
			style,
			thumbnailComponent,
			thumbnailSrc,
			title,
			videoComponent,
			...rest} = this.props;

		delete rest.announce;
		delete rest.autoCloseTimeout;
		delete rest.feedbackHideDelay;
		delete rest.jumpBy;
		delete rest.miniFeedbackHideDelay;
		delete rest.onControlsAvailable;
		delete rest.onFastForward;
		delete rest.onJumpBackward;
		delete rest.onJumpForward;
		delete rest.onPause;
		delete rest.onPlay;
		delete rest.onRewind;
		delete rest.onScrub;
		delete rest.onSeekFailed;
		delete rest.pauseAtEnd;
		delete rest.playbackRateHash;
		delete rest.seekDisabled;
		delete rest.setApiProvider;
		delete rest.thumbnailUnavailable;
		delete rest.titleHideDelay;
		delete rest.videoPath;

		const controlsAriaProps = this.getControlsAriaProps();

		return (
			<RootContainer
				className={css.videoPlayer + ' enact-fit' + (className ? ' ' + className : '')}
				onClick={this.activityDetected}
				onKeyDown={this.activityDetected}
				ref={this.setPlayerRef}
				spotlightDisabled={spotlightDisabled}
				spotlightId={spotlightId}
				style={style}
			>
				{/* Video Section */}
				{this.props.preloadSource ?
					<VideoWithPreload
						{...rest}
						handleEvent={this.handleEvent}
						handleLoadStart={this.handleLoadStart}
						noAutoPlay={noAutoPlay}
						onPlay={this.handlePlayEvent}
						preloadSource={preloadSource}
						source={source}
						videoComponent={videoComponent}
						videoRef={this.setVideoRef}
					/> :
					<Media
						{...rest}
						autoPlay={!noAutoPlay}
						className={css.video}
						component={videoComponent}
						controls={false}
						onPlay={this.handlePlayEvent}
						onUpdate={this.handleEvent}
						ref={this.setVideoRef}
					>
						{source}
					</Media>
				}

				<Overlay
					bottomControlsVisible={this.state.mediaControlsVisible}
					onClick={this.onVideoClick}
				>
					{!noSpinner && (this.state.loading || loading) ? <Spinner centered /> : null}
				</Overlay>

				{this.state.bottomControlsRendered ?
					<div className={css.fullscreen} {...controlsAriaProps}>
						<FeedbackContent
							className={css.miniFeedback}
							playbackRate={this.pulsedPlaybackRate || this.selectPlaybackRate(this.speedIndex)}
							playbackState={this.pulsedPlaybackState || this.prevCommand}
							visible={this.state.miniFeedbackVisible && !noMiniFeedback}
						>
							{secondsToTime(this.state.sliderTooltipTime, this.durfmt)}
						</FeedbackContent>
						<ControlsContainer
							className={css.bottom + (this.state.mediaControlsVisible ? '' : ' ' + css.hidden)}
							spotlightDisabled={spotlightDisabled || !this.state.mediaControlsVisible}
						>
							{/*
								Info Section: Title, Description, Times
								Only render when `this.state.mediaControlsVisible` is true in order for `Marquee`
								to make calculations correctly in `MediaTitle`.
							*/}
							{this.state.mediaSliderVisible ?
								<div className={css.infoFrame}>
									<MediaTitle
										id={this.id}
										infoVisible={this.state.infoVisible}
										style={{'--infoComponentsOffset': this.state.titleOffsetHeight + 'px'}}
										title={title}
										visible={this.state.titleVisible && this.state.mediaControlsVisible}
									>
										{infoComponents}
									</MediaTitle>
									<Times current={this.state.currentTime} total={this.state.duration} formatter={this.durfmt} />
								</div> :
								null
							}

							{noSlider ? null : (
								<ComponentOverride
									backgroundProgress={this.state.proportionLoaded}
									component={mediaSliderComponent}
									disabled={disabled}
									forcePressed={this.state.slider5WayPressed}
									onBlur={this.handleSliderBlur}
									onChange={this.onSliderChange}
									onFocus={this.handleSliderFocus}
									onKeyDown={this.handleSliderKeyDown}
									onKnobMove={this.handleKnobMove}
									onSpotlightUp={this.handleSpotlightUpFromSlider}
									spotlightDisabled={spotlightDisabled || !this.state.mediaControlsVisible}
									value={this.state.proportionPlayed}
									visible={this.state.mediaSliderVisible}
								>
									<FeedbackTooltip
										duration={this.state.duration}
										formatter={this.durfmt}
										noFeedback={!this.state.feedbackIconVisible}
										playbackRate={this.selectPlaybackRate(this.speedIndex)}
										playbackState={this.prevCommand}
										thumbnailComponent={thumbnailComponent}
										thumbnailDeactivated={this.props.thumbnailUnavailable}
										thumbnailSrc={thumbnailSrc}
										hidden={!this.state.feedbackVisible}
									/>
								</ComponentOverride>
							)}

							<ComponentOverride
								component={mediaControlsComponent}
								mediaDisabled={disabled || this.state.mediaControlsDisabled}
								onBackwardButtonClick={this.handleRewind}
								onFastForward={this.handleFastForward}
								onForwardButtonClick={this.handleFastForward}
								onJump={this.handleJump}
								onJumpBackwardButtonClick={this.onJumpBackward}
								onJumpForwardButtonClick={this.onJumpForward}
								onKeyDown={this.handleKeyDownFromControls}
								onPause={this.handlePause}
								onPlay={this.handlePlay}
								onRewind={this.handleRewind}
								onToggleMore={this.handleToggleMore}
								paused={this.state.paused}
								spotlightDisabled={!this.state.mediaControlsVisible || spotlightDisabled}
								visible={this.state.mediaControlsVisible}
							/>
						</ControlsContainer>
					</div> :
					null
				}
				<SpottableDiv
					// This captures spotlight focus for use with 5-way.
					// It's non-visible but lives at the top of the VideoPlayer.
					className={css.controlsHandleAbove}
					onClick={this.showControls}
					onSpotlightDown={this.showControls}
					spotlightDisabled={this.state.mediaControlsVisible || spotlightDisabled}
				/>
				<Announce ref={this.setAnnounceRef} />
			</RootContainer>
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
 * To invoke methods (`fastForward()`, `hideControls()`, `jump()`, `pause()`, `play()`, `rewind()`,
 * `seek()`, 'showControls()') or get the current state (`getMediaState()`), store a ref to the
 * `VideoPlayer` within your component:
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
	{api: [
		'areControlsVisible',
		'fastForward',
		'getMediaState',
		'getVideoNode',
		'hideControls',
		'jump',
		'pause',
		'play',
		'rewind',
		'seek',
		'showControls',
		'showFeedback',
		'toggleControls'
	]},
	Slottable(
		{slots: ['infoComponents', 'mediaControlsComponent', 'mediaSliderComponent', 'source', 'thumbnailComponent']},
		FloatingLayerDecorator(
			{floatLayerId: 'videoPlayerFloatingLayer'},
			Skinnable(
				VideoPlayerBase
			)
		)
	)
);

export default VideoPlayer;
export {
	MediaControls,
	MediaSlider,
	VideoPlayer,
	VideoPlayerBase
};
