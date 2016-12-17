/**
 * A player for video
 * {@link moonstone/VideoPlayer}.
 *
 * @class VideoPlayer
 * @memberOf moonstone/VideoPlayer
 * @ui
 * @private
 */
import React from 'react';

import Video, {Overlay} from 'react-html5video';
import {forward} from '@enact/core/handle';
import {startJob, stopJob} from '@enact/core/jobs';
import {$L} from '@enact/i18n';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

import {calcNumberValueOfPlaybackRate, getNow} from './util';
import Times from './Times';

import IconButton from '../IconButton';
import MarqueeText from '../Marquee/MarqueeText';
import {SliderFactory} from '../Slider';
import Spinner from '../Spinner';
import Slottable from '@enact/ui/Slottable';
import {SpotlightContainerDecorator} from '@enact/spotlight';

import css from './VideoPlayer.less';

const MediaSlider = onlyUpdateForKeys(['backgroundPercent', 'value'])(SliderFactory({css}));

const Container = SpotlightContainerDecorator('div');

// Set-up event forwarding
// Leaving lots of commented out, ready-to-use methods here in case we want/need them later.
const
	// forwardAbort           = forward('onAbort'),
	// forwardCanPlay         = forward('onCanPlay'),
	// forwardCanPlayThrough  = forward('onCanPlayThrough'),
	forwardDurationChange  = forward('onDurationChange'),
	// forwardEmptied         = forward('onEmptied'),
	// forwardEncrypted       = forward('onEncrypted'),
	// forwardEnded           = forward('onEnded'),
	// forwardError           = forward('onError'),
	// forwardLoadedData      = forward('onLoadedData'),
	forwardLoadedMetadata  = forward('onLoadedMetadata'),
	// forwardLoadStart       = forward('onLoadStart'),
	// forwardPause           = forward('onPause'),
	// forwardPlay            = forward('onPlay'),
	// forwardPlaying         = forward('onPlaying'),
	forwardProgress        = forward('onProgress'),
	// forwardRateChange      = forward('onRateChange'),
	// forwardSeeked          = forward('onSeeked'),
	// forwardSeeking         = forward('onSeeking'),
	// forwardStalled         = forward('onStalled'),
	// forwardSuspend         = forward('onSuspend'),
	forwardTimeUpdate      = forward('onTimeUpdate')
	// forwardVolumeChange    = forward('onVolumeChange'),
	// forwardWaiting         = forward('onWaiting')
	;

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


//
// VideoPlayer
//
/**
 * {@link moonstone/VideoPlayer.VideoPlayerBase} is a standard HTML5 video player for Moonstone. It
 * behaves, responds to, and operates like a standard `<video>` tag in its support for `<source>`s
 * and accepts several additional custom tags like `<infoComponents>`, `<leftComponents>`, and
 * `<rightComponents>`. Any additional children will be rendered into the "more" controls area.
 *
 * Example usage:
 * ```
 * 	<VideoPlayer title="Hilarious Cat Video" poster="http://my.cat.videos/boots-poster.jpg">
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
 *
 * @class VideoPlayerBase
 * @memberof moonstone/VideoPlayer
 * @ui
 * @public
 */
const VideoPlayerBase = class extends React.Component {
	static displayName = 'VideoPlayerBase';

	static propTypes = {
		/**
		 * The video will start playing immedietly after it's loaded.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		autoPlay: React.PropTypes.bool,

		/**
		 * These components are placed into the slot to the left of the media controls.
		 *
		 * @type {Node}
		 * @public
		 */
		infoComponents: React.PropTypes.node,

		/**
		 * Background progress, as a percentage.
		 *
		 * @type {Number}
		 * @default 0
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
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		rightComponents: React.PropTypes.node,

		/**
		 * Set a title for the video being played.
		 *
		 * @type {String}
		 * @public
		 */
		title: React.PropTypes.string
	}

	static defaultProps = {
		autoPlay: true,
		jumpBy: 100,
		muted: false,
		noJumpButtons: false,
		noRateButtons: false,
		noSlider: false
	}

	constructor (props) {
		super(props);

		// Internal State
		this.videoReady = false;
		this.scrubbing = false;
		this.scrubbingPassive = false;
		this.video = null;

		// Re-render-necessary State
		this.state = {
			buffered: 0,
			currentTime: 0,
			duration: 0,
			error: false,
			loading: false,
			muted: !!props.muted,
			paused: !props.autoPlay,
			playbackRate: 1,
			readyState: 0,
			volume: 1,

			// Non-standard state computed from properties
			more: false,
			percentageLoaded: 0,
			percentagePlayed: 0,
			playPauseIcon: 'play',
			videoSource: null
		};
	}

	componentWillReceiveProps (nextProps) {
		// Detect a change to the ideo source and reload if necessary.
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
				this.setState({videoSource: nextSource});
			}
		}
	}


	//
	// Media Interaction Methods
	//
	reloadVideo = () => {
		// When changing a HTML5 video, you have to reload it.
		this.video.load();
		this.videoReady = false;
		this.video.play();
	}

	/**
	 * The primary means of interacting with the `<video>` element.
	 *
	 * @param  {String} action The method to preform.
	 * @param  {Multiple} props  The arguments, in the format that the action method requires.
	 *
	 * @public
	 */
	send = (action, props) => {
		if (this.video && this.videoReady) {
			this.video[action](props);
		}
	}

	jump = (distance) => {
		if (this.video && this.videoReady) {
			this.video.seek(this.state.currentTime + distance);
		}
	}


	//
	// Internal Methods
	//
	updateMainState = () => {
		if (this.videoReady && this.video && this.video.videoEl && this.video.videoEl.duration != null) {
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
				error: el.networkState === el.NETWORK_NO_SOURCE,
				loading: el.readyState < el.HAVE_ENOUGH_DATA
			};

			if (!this.scrubbingPassive) {
				// If passively scrubbing, don't update the progress of the played state, so we can move around the scrubber without being interrupted.
				updatedState.percentagePlayed = el.currentTime / el.duration;
			}

			this.setState(updatedState);
		}
	}

	/**
	 * Changes the playback speed via [selectPlaybackRate()]{@link module:enyo/Video~Video#selectPlaybackRate}.
	 *
	 * @public
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
		// }
	}

	/**
	 * Changes the playback speed via [selectPlaybackRate()]{@link module:enyo/Video~Video#selectPlaybackRate}.
	 *
	 * @public
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
		// }
	}

	/**
	 * Sets the playback rate type (from the [keys]{@glossary Object.keys} of
	 * [playbackRateHash]{@link module:enyo/Video~Video#playbackRateHash}).
	 *
	 * @param {String} cmd - Key of the playback rate type.
	 * @public
	 */
	selectPlaybackRates = (cmd) => {
		this.playbackRates = playbackRateHash[cmd];
	}

	/**
	 * Changes [playbackRate]{@link module:enyo/Video~Video#playbackRate} to a valid value when initiating
	 * fast forward or rewind.
	 *
	 * @param {Number} idx - The index of the desired playback rate.
	 * @public
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
	 * @public
	 */
	selectPlaybackRate = (idx) => {
		return this.playbackRates[idx];
	}

	/**
	 * Sets [playbackRate]{@link module:enyo/Video~Video#playbackRate}.
	 *
	 * @param {String} rate - The desired playback rate.
	 * @public
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
		startJob('rewind', this.rewindManually, 100);
	}

	/**
	 * Stops rewind job.
	 *
	 * @private
	 */
	stopRewindJob = () => {
		stopJob('rewind');
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
	// Handled local events
	//
	onScrubPassive = (ev) => {
		this.scrubbingPassive = (ev.type === 'mouseenter');
	}
	onScrub = (ev) => {
		// This will be wired up to tooltip when that piece is ready.,
		// Currently just a placeholder to verify this aspect works.
		this.scrubbing = (ev.type === 'mousedown');
	}


	//
	// Handled Media events
	//
	handleDurationChange = (ev) => {
		this.updateMainState();
		forwardDurationChange(ev, this.props);
	}
	handleLoadedMetadata = (ev) => {
		this.updateMainState();
		forwardLoadedMetadata(ev, this.props);
	}
	handleProgress = (ev) => {
		this.updateMainState();
		forwardProgress(ev, this.props);
	}
	handleTimeUpdate = (ev) => {
		this.updateMainState();
		forwardTimeUpdate(ev, this.props);
	}


	//
	// Player Button controls
	//
	onSliderChange = ({value}) => {
		if (value && this.video && this.videoReady && this.scrubbingPassive) {
			const el = this.video.videoEl;
			this.send('seek', value * el.duration);
		}
	}
	onJumpBackward  = () => this.jump(-1 * this.props.jumpBy)
	onBackward      = () => this.rewind()
	onPlay          = () => {
		this.speedIndex = 0;
		this.setPlaybackRate(1);
		if (this.state.paused) {
			this.send('play');
			this.prevCommand = 'play';
		} else {
			this.send('pause');
			this.prevCommand = 'pause';
		}
	}
	onForward       = () => this.fastForward()
	onJumpForward   = () => this.jump(this.props.jumpBy)
	onMoreClick     = () => {
		this.setState({
			more: !this.state.more
		});
	}

	setVideoRef = (video) => {
		this.videoReady = !!video;
		this.video = video;
	}

	render () {
		const {children, className, infoComponents, leftComponents, noJumpButtons, noRateButtons, noSlider, rightComponents, title, style,
			// Assign defaults during destructuring to internal methods (here, instead of defaultProps)
			onBackwardButtonClick = this.onBackward,
			onForwardButtonClick = this.onForward,
			onPlayButtonClick = this.onPlay,
			onJumpBackwardButtonClick = this.onJumpBackward,
			onJumpForwardButtonClick = this.onJumpForward,
			...rest} = this.props;
		delete rest.jumpBy;

		const scrubbingClass = (this.scrubbingPassive) ? ' ' + css.scrubbing : '';

		// Handle some class additions when the "more" button is pressed
		const moreState  = (this.state.more) ? ' ' + css.more : '';
		const infoState  = (this.state.more) ? ' ' + css.visible : ' ' + css.hidden;
		const withBadges = (this.state.more) ? ' ' + css.withBadges : '';
		const moreIcon   = (this.state.more) ? 'arrowhookleft' : 'ellipsis';
		const mediaDisabled = !!(this.state.more);
		const moreDisabled = !(this.state.more);

		return (
			<div className={css.videoPlayer + (className ? ' ' + className : '')} style={style}>
				{/* Video Section */}
				<Video
					{...rest}
					className={css.videoFrame}
					controls={false}
					ref={this.setVideoRef}	// Ref-ing this only once (smarter) turns out to be less safe because now we don't know when `video` is being "unset", so our `videoReady` is no longer genuine. react-html5video component is re-generating this method each render too. This seems to be part of the origin.
					// ref={video => {
					// 	// debug('video ref', video);
					// 	this.videoReady = !!video;
					// 	this.video = video;
					// }}
					onDurationChange={this.handleDurationChange}
					onLoadedMetadata={this.handleLoadedMetadata}
					onTimeUpdate={this.handleTimeUpdate}
					onProgress={this.handleProgress}
				>
					{children}
					<Overlay>
						<Spinner className={css.spinner}>{$L('Loading')}</Spinner>
					</Overlay>
				</Video>

				<div className={css.fullscreen + ' enyo-fit scrim'}>
					<div className={css.bottom}> {/* showing={false} */}
						{/* Info Section: Title, Description, Times */}
						<div className={css.infoFrame}>
							<div className={css.titleFrame}> {/* hidingDuration={1000} marqueeOnRender */}
								<MarqueeText className={css.title + withBadges}>{title}</MarqueeText>
								<div className={css.infoComponents + infoState}>{infoComponents}</div> {/* showing={false} showingDuration={500} tabIndex={-1} mixins={[ShowingTransitionSupport]} */}
							</div>
							<Times current={this.state.currentTime} total={this.state.duration} />
						</div>

						{/* Slider Section */}
						{noSlider ? null : <div className={css.sliderFrame + scrubbingClass}>
							<MediaSlider
								className={css.mediaSlider}
								backgroundPercent={this.state.percentageLoaded}
								detachedKnob
								min={0}
								max={1}
								value={this.state.percentagePlayed}
								step={0.00001}
								onChange={this.onSliderChange}
								onMouseEnter={this.onScrubPassive}
								onMouseLeave={this.onScrubPassive}
								onMouseDown={this.onScrub}
								onMouseUp={this.onScrub}
							/>
						</div>}

						{/* Media Controls Section: Left, Center, Right, and More Controls */}
						<div className={css.controlsFrame} onClick={this.resetAutoTimeout}>
							<div className={css.leftComponents}>{leftComponents}</div>
							<div className={css.centerComponentsContainer}>
								<div className={css.centerComponents + moreState}>
									<Container className={css.mediaControls} data-container-disabled={mediaDisabled}> {/* rtl={false} */}
										{noJumpButtons ? null : <IconButton backgroundOpacity="translucent" onClick={onJumpBackwardButtonClick}>skipbackward</IconButton>}
										{noRateButtons ? null : <IconButton backgroundOpacity="translucent" onClick={onBackwardButtonClick}>backward</IconButton>}
										<IconButton backgroundOpacity="translucent" onClick={onPlayButtonClick}>{this.state.playPauseIcon}</IconButton>
										{noRateButtons ? null : <IconButton backgroundOpacity="translucent" onClick={onForwardButtonClick}>forward</IconButton>}
										{noJumpButtons ? null : <IconButton backgroundOpacity="translucent" onClick={onJumpForwardButtonClick}>skipforward</IconButton>}
									</Container>
									<Container className={css.moreControls} data-container-disabled={moreDisabled}>{children}</Container> {/* rtl={false} */}
								</div>
							</div>
							<div className={css.rightComponents}>
								{rightComponents}
								{(children) ? <IconButton backgroundOpacity="translucent" className={css.moreButton} onClick={this.onMoreClick}>{moreIcon}</IconButton> : null}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

const VideoPlayer = Slottable({slots: ['infoComponents', 'leftComponents', 'rightComponents']}, VideoPlayerBase);

export default VideoPlayer;
export {VideoPlayer, VideoPlayerBase};
