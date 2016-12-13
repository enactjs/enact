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
import Video, {Controls, Play, Mute, Seek, Fullscreen, Time, Overlay} from 'react-html5video';
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

const zeroPad = (num) => ((num < 10 && num >= 0) ? '0' + num : num);

const parseTime = (time) => {
	// http://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
	// by powtac on Jun 10 '11 at 23:27
	time = parseInt(time); // don't forget the second param
	const h   = Math.floor(time / 3600),
		m = Math.floor((time - (h * 3600)) / 60),
		s = time - (h * 3600) - (m * 60);

	return {h, m, s};
	// if (h < 10) {
	// 	h = '0' + h;
	// }
	// 	if (m < 10) {
	// 	m = '0' + m;
	// }
	// 	if (s < 10) {
	// 	s = '0' + s;
	// }
	// return (h ? h + ':' : '') + m + ':' + s;
};

const secondsToPeriod = (time) => {
	return 'P' + time + 'S';
	// time = parseTime(time);
	// return 'P' + time.h + 'H' + time.m + 'M' + time.s + 'S';
	// return `PH${h}M${m}S${s}`;
};

const secondsToTime = (time) => {
	time = parseTime(time);
	return (time.h ? time.h + ':' : '') + zeroPad(time.m) + ':' + zeroPad(time.s);
};

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

const VideoPlayerBase = class extends React.Component {
	static displayName = 'VideoPlayerBase';

	static propTypes = {
		infoComponents: React.PropTypes.node,
		jumpBy: React.PropTypes.number,
		leftComponents: React.PropTypes.node,
		rightComponents: React.PropTypes.node,
		title: React.PropTypes.string
	}

	static defaultProps = {
		jumpBy: 100
	}

	constructor (props) {
		super(props);

		// Internal State
		this.currentTime = 0;
		this.percentageLoaded = 0;
		this.percentagePlayed = 0;
		this.scrubbing = false;
		this.scrubbingPassive = false;
		this.totalTime = 0;
		this.video = null;

		// Re-render-necessary State
		this.state = {
			more: false,
			// percentageLoaded: 0,
			// percentagePlayed: 0,
			videoSource: null
		};
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.children) {
			let prevSource, nextSource;

			React.Children.forEach(this.props.children, (child) => {
				// console.log(child, ' at index: ' + i);
				if (child.type === 'source') {
					prevSource = child.props.children || child.props.src;
				}
			});
			React.Children.forEach(nextProps.children, (child) => {
				// console.log(child.type + ' at index: ' + i);
				if (child.type === 'source') {
					nextSource = child.props.children || child.props.src;
				}
			});

			// console.log('selectVideo', (prevSource === nextSource) ? 'no change' : 'NEW SOURCE!!!!!!');
			// shouldLoadNewSource = (prevSource === nextSource);
			if (prevSource !== nextSource) {
				// console.log('Rendering new video:', nextSource);
				this.reloadVideo();
				this.setState({videoSource: nextSource});
			}
		}
	}

	isVideoPresent = () => this.video && this.video.videoEl

	isVideoReady = () => this.video && this.video.videoEl && this.video.videoEl.readyState >= this.video.videoEl.HAVE_ENOUGH_DATA

	// getChildContext = () => {
	// 	return {video: this.video};
	// }

	reloadVideo = () => {
		// When changing a HTML5 video, you have to reload it.
		this.video.load();
		this.video.play();
	}

	send = (action, props) => {
		if (this.isVideoReady()) {
			// console.log('sending', action, props);
			this.video[action](props);
		}
	}

	jump = (distance) => {
		if (this.isVideoReady() && typeof this.video.videoEl.duration === 'number') {
			const el = this.video.videoEl;
			this.video.seek(el.currentTime + distance);
		}
	}

	setVolume = () => {
		this.video.setVolume(this._volumeInput.valueAsNumber);
	}

	onSliderChange = ({value}) => {
		if (this.isVideoReady()) {
			const el = this.video.videoEl;
			this.send('seek', value * el.duration);
		}
	}

	onClickMore = () => {
		this.setState({
			more: !this.state.more
		});
	}

	// Internal Methods
	updateMainState = () => {
		if (this.isVideoReady()) {
			const el = this.video.videoEl;
			// this.percentageLoaded = el.buffered.length && el.buffered.end(el.buffered.length - 1) / el.duration;
			// this.percentagePlayed = el.currentTime / el.duration;
			// this.currentTime = el.currentTime;
			// this.totalTime = el.duration;

			const updatedState = {
				percentageLoaded: el.buffered.length && el.buffered.end(el.buffered.length - 1) / el.duration,
				currentTime: el.currentTime,
				totalTime: el.duration
			};

			if (!this.scrubbingPassive) {
				// If passively scrubbing, don't update the progress of the played state, so we can move around the scrubber without being interrupted.
				updatedState.percentagePlayed = el.currentTime / el.duration;
			}

			this.setState(updatedState);
			// this.setState({
			// 	percentageLoaded: el.buffered.length && el.buffered.end(el.buffered.length - 1) / el.duration,
			// 	percentagePlayed: el.currentTime / el.duration,
			// 	currentTime: el.currentTime,
			// 	totalTime: el.duration

			// 	// currentTimePeriod: this.secondsToPeriod(el.currentTime),
			// 	// currentTime: this.secondsToTime(el.currentTime),
			// 	// totalTimePeriod: this.secondsToPeriod(el.duration),
			// 	// totalTime: this.secondsToTime(el.duration)
			// });
		}
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
	handleDurationChange = (ev) => {
		// this.updateMainState();
		console.log('DurationChange:', ev);
		forwardDurationChange(ev, this.props);
	}
	handleLoadedMetadata = (ev) => {
		// this.updateMainState();
		console.log('LoadedMetadata:', ev);
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
	onSkipBackward  = () => this.send('seek', 0)
	onBackward      = () => this.jump(-1 * this.props.jumpBy)
	onPlay          = () => {
		console.log('onPlay');
		// debugger;
		return this.send('togglePlay');
	}
	onForward       = () => this.jump(this.props.jumpBy)
	onSkipForward   = () => this.send('seek', (this.video ? this.video.videoEl.duration : 0))

	notYetImplemented = () => {
		console.log('Sorry, not yet implemented.');
	}

	render () {
		const {children, title, infoComponents, leftComponents, rightComponents, ...rest} = this.props;
		delete rest.jumpBy;

		// onLoadedMetadata={this.onLoadedMetadata} // loaded new media
		// onDurationChange={this.onLoadedMetadata} // loaded new media
		// onAbort={this.onFinished} // loaded new media

		// Handle some class additions when the "more" button is pressed
		const moreState = (this.state.more) ? ' ' + css.more : '';
		const infoState = (this.state.more) ? ' ' + css.visible : ' ' + css.hidden;
		const withBadges = (this.state.more) ? ' ' + css.withBadges : '';

		return (
			<div className={css.videoPlayer}>
				<Video
					{...rest}
					className={css.videoFrame}
					controls={false}
					ref={video => (this.video = video)}

					// ontimeupdate={this.timeUpdate}
					// onloadedmetadata={this.metadataLoaded} //
					// durationchange={this.durationUpdate} //
					// onloadeddata={this.dataloaded} //
					// // onprogress={this._progress} //
					// onPlay={this._play}
					// onpause={this._pause} //
					// onStart={this._start}
					// onended={this._stop} //
					// onFastforward={this._fastforward}
					// onSlowforward={this._slowforward}
					// onRewind={this._rewind}
					// onSlowrewind={this._slowrewind}
					// onJumpForward={this._jumpForward}
					// onJumpBackward={this._jumpBackward}
					// onratechange={this.playbackRateChange}
					// ontap={this.videoTapped} //
					// oncanplay={this._setCanPlay} //
					// onwaiting={this._waiting} //
					// onerror={this._error} //
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
				{/* onMouseMove={this.mousemove} onClick={this.videoFSTapped} */}
				<div className={css.fullscreen + ' enyo-fit scrim'}>
					<div className={css.bottom}> {/* showing={false} */}
						<div className={css.infoFrame}>
							<div className={css.titleFrame}> {/* hidingDuration={1000} marqueeOnRender */}
								<MarqueeText className={css.title + withBadges}>{title}</MarqueeText>
								<div className={css.infoComponents + infoState}>{infoComponents}</div> {/* showing={false} showingDuration={500} tabIndex={-1} mixins={[ShowingTransitionSupport]} */}
							</div>
							<Times current={this.state.currentTime} total={this.state.totalTime} />
						</div>
						<div className={css.sliderFrame}>
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
							/> {/*
								disabled
								onSeekStart={this.sliderSeekStart}
								onSeek={this.sliderSeek}
								onSeekFinish={this.sliderSeekFinish}
								onEnterTapArea={this.onEnterSlider}
								onLeaveTapArea={this.onLeaveSlider}
								rtl={false}
							*/}
						</div>
						<div className={css.controlsFrame} onClick={this.resetAutoTimeout}>
							<div className={css.leftComponents}>{leftComponents}</div>
							<div className={css.centerComponentsContainer}>
								{/* <Panels index={0} className={css.controlsContainer}>*/}
								<div className={css.centerComponents + moreState}>
									<div className={css.mediaControls}> {/* rtl={false} */}
										<IconButton backgroundOpacity="translucent" onClick={this.onSkipBackward}>skipbackward</IconButton>
										<IconButton backgroundOpacity="translucent" onClick={this.onBackward}>backward</IconButton>
										<IconButton backgroundOpacity="translucent" onClick={this.onPlay}>play</IconButton>
										<IconButton backgroundOpacity="translucent" onClick={this.onForward}>forward</IconButton>
										<IconButton backgroundOpacity="translucent" onClick={this.onSkipForward}>skipforward</IconButton>
									</div>
									<div className={css.moreControls}>{children}</div> {/* rtl={false} */}
								</div>
							</div>
							<div className={css.rightComponents}>
								{rightComponents}
								{(children) ? <IconButton backgroundOpacity="translucent" className={css.moreButton} onClick={this.onClickMore}>ellipsis</IconButton> : null}
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
