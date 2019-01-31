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
		 * Video plays automatically.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		autoPlay: PropTypes.bool,

		/**
		 * Video component to use.
		 *
		 * The default (`'video'`) renders an `HTMLVideoElement`. Custom video components must have
		 * a similar API structure, exposing the following APIs:
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
		 * * `onLoadStart` - Called when the video starts to load
		 * * `onPlay` - Sent when playback of the media starts after having been paused
		 * * `onUpdate` - Sent when any of the properties were updated
		 *
		 * Methods:
		 * * `play()` - play video
		 * * `pause()` - pause video
		 * * `load()` - load video
		 *
		 * The [`source`]{@link moonstone/VideoPlayer.VideoBase.source} property is passed to
		 * the video component as a child node.
		 *
		 * @type {Component|Element}
		 * @default 'video'
		 * @public
		 */
		mediaComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element]),

		/**
		 * The video source to be preloaded. Expects a `<source>` node.
		 *
		 * @type {Node}
		 * @public
		 */
		preloadSource:  PropTypes.node,

		/**
		 * Called with a reference to the active [Media]{@link ui/Media.Media} component.
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
		 * @type {Node}
		 * @public
		 */
		source: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
	}

	static defaultProps = {
		mediaComponent: 'video'
	}

	componentDidUpdate (prevProps) {
		const {source, preloadSource} = this.props;
		const {source: prevSource, preloadSource: prevPreloadSource} = prevProps;

		const key = getKeyFromSource(source);
		const prevKey = getKeyFromSource(prevSource);
		const preloadKey = getKeyFromSource(preloadSource);
		const prevPreloadKey = getKeyFromSource(prevPreloadSource);

		if (this.props.setMedia !== prevProps.setMedia) {
			this.clearMedia(prevProps);
			this.setMedia();
		}

		if (source) {
			if (key === prevPreloadKey && preloadKey !== prevPreloadKey) {
				// if there's source and it was the preload source

				// if the preloaded video didn't error, notify VideoPlayer it is ready to reset
				if (this.preloadLoadStart) {
					forward('onLoadStart', this.preloadLoadStart, this.props);
				}

				// emit onUpdate to give VideoPlayer an opportunity to updates its internal state
				// since it won't receive the onLoadStart or onError event
				forward('onUpdate', {type: 'onUpdate'}, this.props);

				this.autoPlay();
			} else if (key !== prevKey) {
				// if there's source and it has changed.
				this.autoPlay();
			}
		}

		if (preloadSource && preloadKey !== prevPreloadKey) {
			this.preloadLoadStart = null;

			// In the case that the previous source equalled the previous preload (causing the
			// preload video node to not be created) and then the preload source was changed, we
			// need to guard against accessing the preloadVideo node.
			if (this.preloadVideo) {
				this.preloadVideo.load();
			}
		}
	}

	componentWillUnmount () {
		this.clearMedia();
	}

	handlePreloadLoadStart = (ev) => {
		// persist the event so we can cache it to re-emit when the preload becomes active
		ev.persist();
		this.preloadLoadStart = ev;

		// prevent the from bubbling to upstream handlers
		ev.stopPropagation();
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
		if (!this.props.autoPlay) return;

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
						onLoadStart={this.handlePreloadLoadStart}
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
