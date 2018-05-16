import {forward} from '@enact/core/handle';
import ForwardRef from '@enact/ui/ForwardRef';
import {Media, getKeyFromSource} from '@enact/ui/Media';
import Slottable from '@enact/ui/Slottable';
import compose from 'ramda/src/compose';
import React from 'react';

import css from './VideoPlayer.less';

import PropTypes from 'prop-types';

/**
 * Adds support for preloading a video source for `VideoPlayer`.
 *
 * @class VideoBase
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
const VideoBase = class extends React.Component {
	static displayName = 'Video'

	static propTypes = /** @lends moonstone/VideoPlayer.Video.prototype */ {

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
		 * The [`source`]{@link moonstone/VideoPlayer.VideoBase.source} property is passed to
		 * the video component as a child node.
		 *
		 * @type {String | Element | Component}
		 * @default 'video'
		 * @public
		 */
		mediaComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element]),

		/**
		 * Disable automatically playing the video after it has loaded
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
		 * Called with a reference to the active [Media]{@link ui/Media.Media} component
		 *
		 * @type {Function}
		 * @private
		 */
		setMedia: PropTypes.func,

		/**
		 * The video source to be played.
		 *
		 * Any children `<source>` elements will be sent directly to the `mediaComponent` as video
		 * sources.
		 *
		 * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source
		 *
		 * @type {String | Node}
		 * @public
		 */
		source: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
	}

	static defaultProps = {
		mediaComponent: 'video'
	}

	componentDidMount () {
		this.setMedia();
	}

	componentDidUpdate (prevProps) {
		const {source, preloadSource} = this.props;
		const {source: prevSource, preloadSource: prevPreloadSource} = prevProps;

		const key = getKeyFromSource(source);
		const prevKey = getKeyFromSource(prevSource);
		const preloadKey = getKeyFromSource(preloadSource);
		const prevPreloadKey = getKeyFromSource(prevPreloadSource);

		if (source) {
			if (key === prevPreloadKey) {
				// if there's source and it was the preload source
				// emit onUpdate to give VideoPlayer an opportunity to updates its internal state
				// since it won't receive the onLoadStart or onError event
				forward('onUpdate', {type: 'onUpdate'}, this.props);

				this.autoPlay();
			} else if (key !== prevKey) {
				// if there's source and it has changed.
				this.autoPlay();
			}

			this.autoPlay();
		}

		if (preloadSource && preloadKey !== prevPreloadKey) {
			// In the case that the previous source equalled the previous preload (causing the
			// preload video node to not be created) and then the preload source was changed, we
			// need to guard against accessing the preloadVideo node.
			if (this.preloadVideo) {
				this.preloadVideo.load();
			}
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
			setMedia(this.video);
		}
	}

	autoPlay () {
		if (this.props.noAutoPlay) return;

		this.video.play();
	}

	setVideoRef = (node) => {
		this.video = node;
		this.setMedia();
	}

	setPreloadRef = (node) => {
		if (node) {
			node.load();
		}
		this.preloadVideo = node;
	}

	render () {
		const {
			noAutoPlay,
			preloadSource,
			source,
			mediaComponent,
			...rest
		} = this.props;

		delete rest.setMedia;

		const sourceKey = getKeyFromSource(source);
		let preloadKey = getKeyFromSource(preloadSource);

		// prevent duplicate components by suppressing preload when sources are the same
		if (sourceKey === preloadKey) {
			preloadKey = null;
		}

		return (
			<React.Fragment>
				{sourceKey ? (
					<Media
						{...rest}
						autoPlay={!noAutoPlay}
						className={css.video}
						controls={false}
						key={sourceKey}
						mediaComponent={mediaComponent}
						preload="none"
						ref={this.setVideoRef}
						source={React.isValidElement(source) ? source : (
							<source src={source} />
						)}
					/>
				) : null}
				{preloadKey ? (
					<Media
						autoPlay={false}
						className={css.preloadVideo}
						controls={false}
						key={preloadKey}
						mediaComponent={mediaComponent}
						preload="none"
						ref={this.setPreloadRef}
						source={React.isValidElement(preloadSource) ? preloadSource : (
							<source src={preloadSource} />
						)}
					/>
				) : null}
			</React.Fragment>
		);
	}
};

const VideoDecorator = compose(
	ForwardRef({prop: 'setMedia'}),
	Slottable({slots: ['source', 'preloadSource']})
);

/**
 * Provides support for more advanced video configurations for `VideoPlayer`.
 *
 * Custom Video Tag
 *
 * ```
 * <VideoPlayer>
 *   <Video mediaComponent="custom-video-element">
 *     <source src="path/to/source.mp4" />
 *   </Video>
 * </VideoPlayer>
 * ```
 *
 * Preload Video Source
 *
 * ```
 * <VideoPlayer>
 *   <Video>
 *     <source src="path/to/source.mp4" />
 *     <source src="path/to/preload-source.mp4" slot="preloadSource" />
 *   </Video>
 * </VideoPlayer>
 * ```
 *
 * @class Video
 * @extends {moonstone/VideoPlayer.VideoBase}
 * @mixes ui/Slottable
 * @memberof moonstone/VideoPlayer
 * @ui
 * @public
 */
const Video = VideoDecorator(VideoBase);
Video.defaultSlot = 'videoComponent';

export default Video;
export {
	Video
};
