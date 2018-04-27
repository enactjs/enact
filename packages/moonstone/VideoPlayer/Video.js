/**
 * Exports the {@link moonstone/VideoPlayer.Video} and
 * {@link moonstone/VideoPlayer.Video} components. The default export is
 * {@link moonstone/VideoPlayer.Video}.
 *
 * @module moonstone/VideoPlayer
 */

import React from 'react';
import Slottable from '@enact/ui/Slottable';

import css from './VideoPlayer.less';

import {compareSources} from './util';
import PropTypes from 'prop-types';

/**
 * Video {@link moonstone/VideoPlayer}.
 *
 * @class VideoBase
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
class VideoBase extends React.Component {
	static propTypes = /** @lends moonstone/VideoPlayer.VideoBase.prototype */ {

		/**
		 * Function to send media events to VideoPlayer
		 *
		 * @type {Function}
		 * @public
		 */
		handleEvent: PropTypes.func,

		/**
		 * Function to run after the preload video is loaded.
		 *
		 * @type {Function}
		 * @public
		 */
		handleLoadStart: PropTypes.func,

		/**
		 * By default, the video will start playing immediately after it's loaded, unless this is set.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoPlay: PropTypes.bool,

		/**
		 * The video source to be preloaded. Expects a `<source>` node.
		 *
		 * @type {String|Node}
		 * @public
		 */
		preloadSource:  PropTypes.node,

		setMedia: PropTypes.func,

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
		videoComponent: 'video'
	}

	constructor (props) {
		super(props);
		this.isPlayerMounted = false;
		this.isPlayVideoPreloaded = false;
		this.preloadSourcePlaying = false;
	}

	componentDidMount () {
		this.isPlayerMounted = true;
		this.setMedia();
	}

	componentWillReceiveProps (nextProps) {
		const {source, preloadSource} = this.props;
		const {source: nextSource, preloadSource: nextPreloadSource} = nextProps;

		if (preloadSource && compareSources(preloadSource, nextSource) && !compareSources(source, nextSource)) {
			this.preloadSourcePlaying = !this.preloadSourcePlaying;
			const currentVideoSource = this.video;
			this.video = this.preloadVideo;
			this.preloadVideo = currentVideoSource;
			this.isPlayVideoPreloaded = true;
		}

		if (nextPreloadSource) {
			const preloadSourcesEqual = preloadSource && compareSources(preloadSource, nextPreloadSource);
			if (!preloadSourcesEqual) {
				this.preloadVideo.load();
			}
		}
	}

	componentDidUpdate (prevProps) {
		const {source, preloadSource} = this.props;
		const {source: prevSource, preloadSource: prevPreloadSource} = prevProps;

		const isPreloadedVideo = source && prevPreloadSource && compareSources(source, prevPreloadSource);
		const isPreloadedSourceSame = preloadSource && prevPreloadSource && compareSources(preloadSource, prevPreloadSource);

		if (!compareSources(source, prevSource) && isPreloadedVideo && isPreloadedSourceSame) {
			this.props.handleLoadStart();
		}

		if (this.props.setMedia !== prevProps.setMedia) {
			this.clearMedia(prevProps);
			this.setMedia();
		}
	}

	componentWillUnmount () {
		this.clearMedia();
	}

	clearMedia ({setMedia} = this.props) {
		if (setMedia) {
			setMedia(null);
		}
	}

	setMedia ({setMedia} = this.props) {
		if (setMedia) {
			setMedia(this);
		}
	}

	getMedia () {
		return this.preloadSourcePlaying ? this.preloadVideo : this.video;
	}

	get buffered () {
		return this.getMedia().buffered;
	}

	get currentTime () {
		return this.getMedia().currentTime;
	}

	set currentTime (currentTime) {
		return (this.getMedia().currentTime = currentTime);
	}

	get duration () {
		return this.getMedia().duration;
	}

	get HAVE_ENOUGH_DATA () {
		return this.getMedia().HAVE_ENOUGH_DATA;
	}

	load () {
		return this.getMedia().load;
	}

	get NETWORK_NO_SOURCE () {
		return this.getMedia().NETWORK_NO_SOURCE;
	}

	get networkState () {
		return this.getMedia().networkState;
	}

	pause () {
		return this.getMedia().pause;
	}

	get paused () {
		return this.getMedia().paused;
	}

	play () {
		return this.getMedia().play;
	}

	get playbackRate () {
		return this.getMedia().playbackRate;
	}

	set playbackRate (playbackRate) {
		return (this.getMedia().playbackRate = playbackRate);
	}

	get readyState () {
		return this.getMedia().readyState;
	}

	// These methods are here because on webOS TVs we can't play a video until after second video
	// player is loaded
	handleVideoLoadStart = () => {
		if (this.isPlayerMounted && this.isPlayVideoPreloaded && this.preloadSourcePlaying) {
			this.props.handleLoadStart();
			this.resetPreloadState();
		}
	}

	handlePreloadVideoLoadStart = () => {
		if (this.isPlayerMounted && this.isPlayVideoPreloaded && !this.preloadSourcePlaying) {
			this.props.handleLoadStart();
			this.resetPreloadState();
		}
	}

	resetPreloadState () {
		this.isPlayVideoPreloaded = false;
	}

	setVideoRef = (node) => {
		this.video = node;
	}

	setPreloadRef = (node) => {
		this.preloadVideo = node;
	}

	render () {
		const {preloadSourcePlaying} = this;

		const {
			handleEvent,
			noAutoPlay,
			preloadSource,
			source,
			videoComponent: VideoComponent,
			...rest
		} = this.props;

		delete rest.handleLoadStart;

		return (
			<React.Fragment>
				<VideoComponent
					{...rest}
					autoPlay={preloadSourcePlaying ? false : !noAutoPlay}
					className={preloadSourcePlaying ? css.preloadVideo : css.video}
					controls={false}
					preload={preloadSourcePlaying ? 'auto' : 'none'}
					onLoadStart={this.handleVideoLoadStart}
					onUpdate={preloadSourcePlaying ? null : handleEvent}
					ref={this.setVideoRef}
				>
					{preloadSourcePlaying ?  preloadSource : source}
				</VideoComponent>
				<VideoComponent
					{...rest}
					autoPlay={preloadSourcePlaying ? !noAutoPlay : false}
					className={preloadSourcePlaying ? css.video : css.preloadVideo}
					controls={false}
					onLoadStart={this.handlePreloadVideoLoadStart}
					onUpdate={preloadSourcePlaying ? handleEvent : null}
					preload={preloadSourcePlaying ? 'none' : 'auto'}
					ref={this.setPreloadRef}
				>
					{preloadSourcePlaying ? source : preloadSource}
				</VideoComponent>
			</React.Fragment>
		);
	}
}

const Video = Slottable(
	{slots: ['source', 'preloadSource']},
	VideoBase
);
Video.defaultSlot = 'videoComponent';

export default Video;
export {
	Video
};
