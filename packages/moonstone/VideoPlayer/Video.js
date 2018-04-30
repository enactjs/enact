/**
 * Exports the {@link moonstone/VideoPlayer.Video} and
 * {@link moonstone/VideoPlayer.Video} components. The default export is
 * {@link moonstone/VideoPlayer.Video}.
 *
 * @module moonstone/VideoPlayer
 */

import React from 'react';
import {forward} from '@enact/core/handle';
import Slottable from '@enact/ui/Slottable';

import css from './VideoPlayer.less';

import PropTypes from 'prop-types';

const toKey = (source = '') => {
	if (React.isValidElement(source)) {
		return React.Children.toArray(source)
			.filter(s => !!s)
			.map(s => s.props.src)
			.join('+');
	}

	return String(source);
};

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
		videoComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element])
	}

	static defaultProps = {
		videoComponent: 'video'
	}

	constructor (props) {
		super(props);
		this.isPlayerMounted = false;

		this.loaded = {
			video: false,
			preload: false
		};
	}

	componentDidMount () {
		this.isPlayerMounted = true;
		this.setMedia();
	}

	componentDidUpdate (prevProps) {
		const {source, preloadSource} = this.props;
		const {source: prevSource, preloadSource: prevPreloadSource} = prevProps;

		const key = toKey(source);
		const prevKey = toKey(prevSource);
		const preloadKey = toKey(preloadSource);
		const prevPreloadKey = toKey(prevPreloadSource);

		// if there's source and it has changed and it's not the prior preloaded source
		if (source && key !== prevKey && key !== prevPreloadKey) {
			// flag it as unloaded and load it.
			this.loaded.video = false;
			this.video.load();
		}

		// if there's a preload and it has changed and it's not the prior source
		if (preloadSource && preloadKey !== prevPreloadKey && preloadKey !== prevKey) {
			// flag it unloaded and load it
			this.preloadVideo.load();
			this.loaded.preload = false;
		}

		if (this.props.setMedia !== prevProps.setMedia) {
			this.clearMedia(prevProps);
			this.setMedia();
		}
	}

	componentWillUnmount () {
		this.clearMedia();
	}

	canPlay () {
		return this.isPlayerMounted && this.loaded.video && (
			// video can play if there isn't a preloaded source or there is and it has loaded
			!this.props.preloadSource || this.loaded.preload
		);
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

	get buffered () {
		if (!this.video) return;
		return this.video.buffered;
	}

	get currentTime () {
		if (!this.video) return;
		return this.video.currentTime;
	}

	set currentTime (currentTime) {
		if (!this.video) return;
		return (this.video.currentTime = currentTime);
	}

	get duration () {
		if (!this.video) return;
		return this.video.duration;
	}

	get HAVE_ENOUGH_DATA () {
		if (!this.video) return;
		return this.video.HAVE_ENOUGH_DATA;
	}

	load () {
		if (!this.video) return;
		return this.video.load();
	}

	get NETWORK_NO_SOURCE () {
		if (!this.video) return;
		return this.video.NETWORK_NO_SOURCE;
	}

	get networkState () {
		if (!this.video) return;
		return this.video.networkState;
	}

	pause () {
		if (!this.video) return;
		return this.video.pause();
	}

	get paused () {
		if (!this.video) return;
		return this.video.paused;
	}

	play () {
		if (!this.video) return;
		return this.video.play();
	}

	get playbackRate () {
		if (!this.video) return;
		return this.video.playbackRate;
	}

	set playbackRate (playbackRate) {
		if (!this.video) return;
		return (this.video.playbackRate = playbackRate);
	}

	get readyState () {
		if (!this.video) return;
		return this.video.readyState;
	}

	autoPlay () {
		if (this.props.noAutoPlay || !this.canPlay()) return;

		this.video.play();

		forward('onLoadStart', this.loadStartEvent, this.props);
	}

	// These methods are here because on webOS TVs we can't play a video until after second video
	// player is loaded
	handleVideoLoadStart = (ev) => {
		this.loaded.video = true;
		this.loadStartEvent = {...ev};
		this.autoPlay();
	}

	handlePreloadVideoLoadStart = () => {
		this.loaded.preload = true;
		this.autoPlay();
	}

	setVideoRef = (node) => {
		this.video = node;
	}

	setPreloadRef = (node) => {
		this.preloadVideo = node;
	}

	render () {
		const {
			preloadSource,
			source,
			videoComponent: VideoComponent,
			...rest
		} = this.props;

		delete rest.noAutoPlay;
		delete rest.setMedia;

		const sourceKey = toKey(source);
		let preloadKey = toKey(preloadSource);

		// prevent duplicate components by suppressing preload when sources are the same
		if (sourceKey === preloadKey) {
			preloadKey = null;
		}

		return (
			<React.Fragment>
				{sourceKey ? (
					<VideoComponent
						{...rest}
						autoPlay={false}
						className={css.video}
						controls={false}
						key={sourceKey}
						onLoadStart={this.handleVideoLoadStart}
						preload="none"
						ref={this.setVideoRef}
					>
						{source}
					</VideoComponent>
				) : null}
				{preloadKey ? (
					<VideoComponent
						autoPlay={false}
						className={css.preloadVideo}
						controls={false}
						key={preloadKey}
						onLoadStart={this.handlePreloadVideoLoadStart}
						preload="auto"
						ref={this.setPreloadRef}
					>
						{preloadSource}
					</VideoComponent>
				) : null}
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
