import React from 'react';
import Media from '@enact/ui/Media';

import css from './VideoPlayer.less';

import {compareSources} from './util';
import PropTypes from 'prop-types';

/**
 * VideoWithPreload {@link moonstone/VideoPlayer}.
 *
 * @class VideoWithPreload
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
class VideoWithPreload extends React.Component {
	static propTypes = /** @lends moonstone/VideoPlayer.VideoWithPreload.prototype */ {

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
		videoComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

		/**
		 * Function passed to video to get the ref of the current playing video.
		 *
		 * @type {Function}
		 * @public
		 */
		videoRef: PropTypes.func
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
		this.props.videoRef(this.video);
	}

	componentWillReceiveProps (nextProps) {
		const {source, preloadSource} = this.props;
		const {source: nextSource, preloadSource: nextPreloadSource} = nextProps;

		if (preloadSource && compareSources(preloadSource, nextSource) && !compareSources(source, nextSource)) {
			this.preloadSourcePlaying = !this.preloadSourcePlaying;
			const currentVideoSource = this.video;
			this.video = this.preloadVideo;
			this.props.videoRef(this.video);
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
		this.props.videoRef(this.video);
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
			videoComponent,
			...rest
		} = this.props;

		delete rest.handleLoadStart;
		delete rest.videoRef;

		return (
			<React.Fragment>
				<Media
					{...rest}
					autoPlay={preloadSourcePlaying ? false : !noAutoPlay}
					className={preloadSourcePlaying ? css.preloadVideo : css.video}
					component={videoComponent}
					controls={false}
					preload={preloadSourcePlaying ? 'auto' : 'none'}
					onLoadStart={this.handleVideoLoadStart}
					onUpdate={preloadSourcePlaying ? null : handleEvent}
					ref={this.setVideoRef}
				>
					{preloadSourcePlaying ?  preloadSource : source}
				</Media>
				<Media
					{...rest}
					autoPlay={preloadSourcePlaying ? !noAutoPlay : false}
					className={preloadSourcePlaying ? css.video : css.preloadVideo}
					component={videoComponent}
					controls={false}
					onLoadStart={this.handlePreloadVideoLoadStart}
					onUpdate={preloadSourcePlaying ? handleEvent : null}
					preload={preloadSourcePlaying ? 'none' : 'auto'}
					ref={this.setPreloadRef}
				>
					{preloadSourcePlaying ? source : preloadSource}
				</Media>
			</React.Fragment>
		);
	}
}

export default VideoWithPreload;
export {VideoWithPreload};
