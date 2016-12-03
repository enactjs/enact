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

import Video, {Controls, Play, Mute, Seek, Fullscreen, Time, Overlay} from 'react-html5video';

import css from './VideoPlayer.less';

import IconButton from '../IconButton';
import MarqueeText from '../Marquee/MarqueeText';
import Slider from '../Slider';
import Spinner from '../Spinner';
import Panels from '../Panels';


const $L = text => text; // Dummy placeholder


const VideoPlayerBase = class extends React.Component {
	static displayName = VideoPlayerBase;

	static propTypes = {
		title: React.PropTypes.string
	}

	constructor (props) {
		super(props);
		this.video = null;
		this.state = {
			percentageLoaded: 0,
			percentagePlayed: 0,
			videoSource: null
		};
	}

	reloadVideo = () => {
		// When changing a HTML5 video, you have to reload it.
		this.video.load();
		this.video.play();
	}

	send = (action, props) => () => {
		this.video[action](props);
	}

	setVolume = () => {
		this.video.setVolume(this._volumeInput.valueAsNumber);
	}

	onProgress = () => {
		let el = this.video.videoEl;
		// if (el) {
		this.setState({
			percentageLoaded: el.buffered.length && el.buffered.end(el.buffered.length - 1) / el.duration * 100,
			percentagePlayed: el.currentTime / el.duration * 100
		});
		// }
	}

	notYetImplemented = () => {
		console.log('Sorry, not yet implemented.');
	}

	render () {
		const {children, title, infoBadges, leftComponents, rightComponents, ...rest} = this.props;
		// if (this.state.videoSource !== children) {
		// 	this.reloadVideo();
		// 	this.setState('videoSource', children);
		// }
		return (
			<div className={css.videoPlayer}>
				<Video
					{...rest}
					className={css.videoFrame}
					controls={false}
					ref={video => (this.video = video)}
					onProgress={this.onProgress}
				>
					{children}
					<Overlay>
						<Spinner className={css.spinner}>{$L('Loading')}</Spinner>
					</Overlay>
				</Video>
				<div className={css.fullscreen + ' enyo-fit scrim'} onMouseMove={this.mousemove} onClick={this.videoFSTapped}>
					<div className={css.bottom}> {/* showing={false} */}
						<div className={css.title}> {/* hidingDuration={1000} marqueeOnRender */}
							<MarqueeText className={css.titleText}>{title}</MarqueeText>
							<div className={css.infoBadges}>{infoBadges}</div> {/* showing={false} showingDuration={500} tabIndex={-1} mixins={[ShowingTransitionSupport]} */}
						</div>
						<div className={css.sliderFrame}>
							<Slider
								backgroundPercent={this.state.percentageLoaded}
								min={0}
								max={100}
								value={this.state.percentagePlayed}
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
							<div className={css.premiumPlaceholderLeft + ' ' + css.moonHspacing}>{leftComponents}</div>
							<div className={css.premiumPlaceholderRight}>
								<div className={css.moonHspacing}>{rightComponents}</div>
								<IconButton backgroundOpacity="translucent" className={css.moreButton} onClick={this.notYetImplemented}>ellipsis</IconButton>
							</div>
							<div className={css.controlsFrameCenter}>
								{/* <Panels index={0} className={css.controlsContainer}>*/}
								<div className={css.controlsContainer}>
									<div>
										<div className={css.controlButtons}> {/* rtl={false} */}
											<IconButton backgroundOpacity="translucent" onClick={this.reloadVideo}>skipbackward</IconButton>
											<IconButton backgroundOpacity="translucent" onClick={this.send('seek', (this._seekInput ? this._seekInput.valueAsNumber : null))}>backward</IconButton>
											<IconButton backgroundOpacity="translucent" onClick={this.send('togglePlay')}>play</IconButton>
											<IconButton backgroundOpacity="translucent" onClick={this.send('seek', (this._seekInput ? this._seekInput.valueAsNumber : null))}>forward</IconButton>
											<IconButton backgroundOpacity="translucent" onClick={this.reloadVideo}>skipforward</IconButton>
										</div>
									</div>
									<div className={css.moreControls} /> {/* rtl={false} */}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default VideoPlayerBase;
export {VideoPlayerBase as VideoPlayer, VideoPlayerBase};
