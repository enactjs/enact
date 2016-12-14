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

import kind from '@enact/core/kind';
import Video, {Overlay} from 'react-html5video';
import {withArgs as handle, forward} from '@enact/core/handle';
import {$L} from '@enact/i18n';
// import {childrenEquals} from '@enact/core/util';
import shouldUpdate from 'recompose/shouldUpdate';

import IconButton from '../IconButton';
import MarqueeText from '../Marquee/MarqueeText';
import {SliderFactory} from '../Slider';
import Spinner from '../Spinner';
import Slottable from '@enact/ui/Slottable';

import css from './VideoPlayer.less';

const MediaSlider = shouldUpdate((props, nextProps) => {
	return (
		props.backgroundPercent !== nextProps.backgroundPercent
		|| props.value !== nextProps.value
	);
})(SliderFactory({css}));

// Set-up event forwarding
// Leaving lots of commented out, ready-to-use methods here in case we want/need them later.
const
	// forwardAbort           = forward('onAbort'),
	// forwardCanPlay         = forward('onCanPlay'),
	// forwardCanPlayThrough  = forward('onCanPlayThrough'),
	// forwardDurationChange  = forward('onDurationChange'),
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
* @public
*/
const playbackRateHash = {
	fastForward: ['2', '4', '8', '16'],
	rewind: ['-2', '-4', '-8', '-16'],
	slowForward: ['1/4', '1/2'],
	slowRewind: ['-1/2', '-1']
};


// const debug = (msg, val) => {
// 	// if (typeof val === 'boolean' || )
// 	console.log('%c' + msg + ': ' + (val ? 'FOUND!!!' : 'NOT FOUND'), 'color:' + (val ? 'green' : 'red'));
// };

// const zeroPad = (num) => ((num < 10 && num >= 0) ? '0' + num : num);
const padDigit = (val) => {
	if (val) {
		return (String(val).length < 2) ? '0' + val : val;
	}
	return '00';
};

const parseTime = (time) => {
	// http://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
	// by powtac on Jun 10 '11 at 23:27
	time = parseInt(time); // don't forget the second param
	const h   = Math.floor(time / 3600),
		m = Math.floor((time - (h * 3600)) / 60),
		s = time - (h * 3600) - (m * 60);

	return {h, m, s};
};

const secondsToPeriod = (time) => {
	return 'P' + time + 'S';
};

const secondsToTime = (time) => {
	time = parseTime(time);
	return (time.h ? time.h + ':' : '') + padDigit(time.m) + ':' + padDigit(time.s);
};

//
// Times Module
//  - Used in VideoPlayer
//
const TimesBase = kind({
	name: 'Times',

	propTypes: /** @lends moonstone/BodyText.BodyText.prototype */ {
		/**
		 * The current time in seconds of the video source.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		current: React.PropTypes.number,

		/**
		 * The total time (duration) in seconds of the loaded video source.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		total: React.PropTypes.number
	},

	defaultProps: {
		current: 0,
		total: 0
	},

	styles: {
		css,
		className: 'times'
	},

	computed: {
		currentPeriod:   ({current}) => secondsToPeriod(current),
		currentReadable: ({current}) => secondsToTime(current),
		totalPeriod:     ({total}) => secondsToPeriod(total),
		totalReadable:   ({total}) => secondsToTime(total)
	},

	render: ({currentPeriod, currentReadable, totalPeriod, totalReadable, ...rest}) => {
		delete rest.current;
		delete rest.total;

		return (
			<div {...rest}>
				<time className={css.currentTime} dateTime={currentPeriod}>{currentReadable}</time>
				<span className={css.separator}>/</span>
				<time className={css.totalTime} dateTime={totalPeriod}>{totalReadable}</time>
			</div>
		);
	}
});

const Times = shouldUpdate((props, nextProps) => {
	return (
		props.current !== nextProps.current
		|| props.total !== nextProps.total
	);
})(TimesBase);

//
// VideoPlayer
//
const VideoPlayerBase = class extends React.Component {
	static displayName = 'VideoPlayerBase';

	static propTypes = {
		autoPlay: React.PropTypes.bool,
		infoComponents: React.PropTypes.node,
		jumpBy: React.PropTypes.number,
		leftComponents: React.PropTypes.node,
		muted: React.PropTypes.bool,
		noSlider: React.PropTypes.bool,
		onBackwardButtonClick: React.PropTypes.func,
		onForwardButtonClick: React.PropTypes.func,
		onPlayButtonClick: React.PropTypes.func,
		onSkipBackwardButtonClick: React.PropTypes.func,
		onSkipForwardButtonClick: React.PropTypes.func,
		rightComponents: React.PropTypes.node,
		title: React.PropTypes.string
	}

	static defaultProps = {
		autoPlay: true,
		jumpBy: 100,
		muted: false,
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
		if (nextProps.children) {
			let prevSource, nextSource;

			React.Children.forEach(this.props.children, (child) => {
				if (child.type === 'source') {
					prevSource = child.props.children || child.props.src;
				}
			});
			React.Children.forEach(nextProps.children, (child) => {
				if (child.type === 'source') {
					nextSource = child.props.children || child.props.src;
				}
			});

			if (prevSource !== nextSource) {
				// console.log('Rendering new video:', nextSource);
				this.reloadVideo();
				this.setState({videoSource: nextSource});
			}
		}
	}

	// getChildContext = () => {
	// 	return {video: this.video};
	// }

	reloadVideo = () => {
		// When changing a HTML5 video, you have to reload it.
		this.video.load();
		this.videoReady = false;
		this.video.play();
	}

	send = (action, props) => {
		if (this.video && this.videoReady) {
			// console.log('sending', action, props);
			this.video[action](props);
		}
	}

	jump = (distance) => {
		if (this.video && this.videoReady) {
			this.video.seek(this.state.currentTime + distance);
		}
	}

	setVolume = () => {
		this.video.setVolume(this._volumeInput.valueAsNumber);
	}

	// Internal Methods
	updateMainState = () => {
		if (this.video && this.videoReady) {
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
	 * Calculates numeric value of playback rate (with support for fractions).
	 *
	 * @private
	 */
	calcNumberValueOfPlaybackRate = (rate) => {
		const pbArray = String(rate).split('/');
		return (pbArray.length > 1) ? parseInt(pbArray[0]) / parseInt(pbArray[1]) : parseInt(rate);
	}

	/**
	 * Changes the playback speed via [selectPlaybackRate()]{@link module:enyo/Video~Video#selectPlaybackRate}.
	 *
	 * @public
	 */
	fastForward = () => {
		if (this.video && this.videoReady) {
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
		}
	}

	/**
	 * Changes the playback speed via [selectPlaybackRate()]{@link module:enyo/Video~Video#selectPlaybackRate}.
	 *
	 * @public
	 */
	rewind = () => {
		if (this.video && this.videoReady) {
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
		}
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
		// NYI
		// this.stopRewindJob();

		// Make sure rate is a string
		this.playbackRate = rate = String(rate);
		const pbNumber = this.calcNumberValueOfPlaybackRate(rate);
		console.log('setPlaybackRate:', rate, pbNumber);

		// Set native playback rate
		this.send('setPlaybackRate', pbNumber);

		// NYI
		// if (!(platform.webos || global.PalmSystem)) {
		// 	// For supporting cross browser behavior
		// 	if (pbNumber < 0) {
		// 		this.beginRewind();
		// 	}
		// }
	}

	//
	// Handled local events
	//
	onScrubPassive = (ev) => {
		console.log('onScrubPassive:', ev.type);
		// debugger;
		this.scrubbingPassive = (ev.type === 'mouseenter');
	}

	onScrub = (ev) => {
		console.log('onScrub:', ev.type);
		this.scrubbing = (ev.type === 'mousedown');
	}

	//
	// Handled Media events
	//
	// handleDurationChange = (ev) => {
	// 	// this.updateMainState();
	// 	console.log('DurationChange:', ev);
	// 	this.setState({videoPresent: true});
	// 	forwardDurationChange(ev, this.props);
	// }
	handleLoadedMetadata = (ev) => {
		// this.updateMainState();
		// console.log('LoadedMetadata:', this.video.videoEl);
		this.videoReady = true;
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
		if (this.video && this.videoReady && !this.scrubbingPassive) {
			const el = this.video && this.video.videoEl;
			// debug('videoEl', el);
			this.send('seek', value * el.duration);
		}
	}
	onSkipBackward  = () => this.jump(-1 * this.props.jumpBy)
	onBackward      = () => this.rewind()
	onPlay          = () => {
		console.log('onPlay');
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
	onSkipForward   = () => this.jump(this.props.jumpBy)
	onMoreClick     = () => {
		this.setState({
			more: !this.state.more
		});
	}

	setVideoRef = (video) => {
		this.videoReady = !!video;
		this.video = video;
		console.log('videoReady:', video);
	}


	notYetImplemented = () => {
		console.log('Sorry, not yet implemented.');
	}

	render () {
		const {children, className, noSlider, title, infoComponents, leftComponents, rightComponents, style,
			// Assign defaults during destructuring to internal methods (here, instead of defaultProps)
			onBackwardButtonClick = this.onBackward,
			onForwardButtonClick = this.onForward,
			onPlayButtonClick = this.onPlay,
			onSkipBackwardButtonClick = this.onSkipBackward,
			onSkipForwardButtonClick = this.onSkipForward,
			...rest} = this.props;
		delete rest.jumpBy;

		// Handle some class additions when the "more" button is pressed
		const moreState = (this.state.more) ? ' ' + css.more : '';
		const infoState = (this.state.more) ? ' ' + css.visible : ' ' + css.hidden;
		const withBadges = (this.state.more) ? ' ' + css.withBadges : '';

		return (
			<div className={css.videoPlayer + (className ? ' ' + className : '')} style={style}>
				{/* Video Section */}
				<Video
					{...rest}
					className={css.videoFrame}
					controls={false}
					// ref={this.setVideoRef}	// Ref-ing this only once (smarter) turns out to be less safe because now we don't know when `video` is being "unset", so our `videoReady` is no longer genuine. react-html5video component is re-generating this method each render too. This seems to be part of the origin.
					ref={video => {
						// debug('video ref', video);
						this.videoReady = !!video;
						this.video = video;
					}}
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
						{noSlider ? null : <div className={css.sliderFrame}>
							<MediaSlider
								className={css.mediaSlider}
								backgroundPercent={this.state.percentageLoaded}
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
									<div className={css.mediaControls}> {/* rtl={false} */}
										<IconButton backgroundOpacity="translucent" onClick={onSkipBackwardButtonClick}>skipbackward</IconButton>
										<IconButton backgroundOpacity="translucent" onClick={onBackwardButtonClick}>backward</IconButton>
										<IconButton backgroundOpacity="translucent" onClick={onPlayButtonClick}>{this.state.playPauseIcon}</IconButton>
										<IconButton backgroundOpacity="translucent" onClick={onForwardButtonClick}>forward</IconButton>
										<IconButton backgroundOpacity="translucent" onClick={onSkipForwardButtonClick}>skipforward</IconButton>
									</div>
									<div className={css.moreControls}>{children}</div> {/* rtl={false} */}
								</div>
							</div>
							<div className={css.rightComponents}>
								{rightComponents}
								{(children) ? <IconButton backgroundOpacity="translucent" className={css.moreButton} onClick={this.onMoreClick}>ellipsis</IconButton> : null}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

VideoPlayerBase.contextTypes = {
	video: React.PropTypes.object
};
const VideoPlayer = Slottable({slots: ['infoComponents', 'leftComponents', 'rightComponents']}, VideoPlayerBase);

export default VideoPlayer;
export {VideoPlayer, VideoPlayerBase};
