/**
 * Provides media player and media related components.
 *
 * @module ui/MediaPlayer
 * @exports Audio
 * @exports Video
 * @exports Media
 * @exports MediaPlayer
 * @exports MediaPlayerBase
 * @exports MediaControls
 */

import EnactPropTypes from '@enact/core/internal/prop-types';
import Audio from '@enact/ui/Audio';
import Slottable from '@enact/ui/Slottable';
import Media from '@enact/ui/Media';
import Video from '@enact/ui/Video';

import PropTypes from 'prop-types';
import React from 'react';

import Overlay from './Overlay';
import css from './MediaPlayer.module.less';
import {isRenderable} from '@enact/core/util/util';

const MediaPlayerBase = class extends React.Component {
	static displayName = 'MediaPlayerBase';

	static propTypes = /** @lends ui/MediaPlayer.MediaPlayerBase.prototype */ {
		/**
		 * Media component to use.
		 *
		 * Common components to use are `<Audio>` and `<M>`. Custom media components must have a similar
		 * API structure, exposing the following APIs:
		 *
		 * Properties:
		 * * `currentTime` {Number} - Playback index of the media in seconds
		 * * `duration` {Number} - Media's entire duration in seconds
		 * * `error` {Boolean} - `true` if media playback has errored.
		 * * `loading` {Boolean} - `true` if media playback is loading.
		 * * `paused` {Boolean} - Playing vs paused state. `true` means the media is paused
		 * * `playbackRate` {Number} - Current playback rate, as a number
		 * * `proportionLoaded` {Number} - A value between `0` and `1`
		 *	representing the proportion of the media that has loaded
		 * * `proportionPlayed` {Number} - A value between `0` and `1` representing the
		 *	proportion of the media that has already been shown
		 *
		 * Events:
		 * * `onLoadStart` - Called when the media starts to load
		 * * `onUpdate` - Sent when any of the properties were updated
		 *
		 * Methods:
		 * * `play()` - play media
		 * * `pause()` - pause media
		 * * `load()` - load media
		 *
		 * The [`source`]{@link ui/MediaPlayer.MediaPlayerBase.source} property is passed to
		 * the media component as a child node.
		 *
		 * @type {Component|Element}
		 * @default {@link ui/Media.Media}
		 * @public
		 */
		mediaComponent: EnactPropTypes.componentOverride,

		/**
		 * The address of the media source. The `type` prop or `mediaComponent` is required to load `src`.
		 *
		 * The value of this attribute is ignored when the [Audio]{@link ui/Audio}, [Media]{@link ui/Media}, or [Video]{@link ui/Video} element is placed inside of [MediaPlayer]{@link ui/MediaPlayer}
		 *
		 * @type {String}
		 * @public
		 */
		src: PropTypes.string,

		/**
		 * The type of the media source.
		 *
		 * The MIME-type of the resource, optionally with a codecs parameter. See RFC 4281 for information about how to specify codecs.
		 *
		 * @type {String}
		 * @see https://tools.ietf.org/html/rfc4281
		 * @public
		 */
		type: PropTypes.string
	}

	constructor (props) {
		super(props);

	}

	render () {
		const {
			children,
			className,
			mediaComponent: MediaComponent,
			style,
			src,
			type,
			...mediaProps
		} = this.props;

		let mediaComponent = null;

		if (src) {
			// If `src` and `mediaComponent` wihtout a `<source>` are provided, pass `<source src={src} />` to `mediaComponent`
			// If `src` and `mediaComponent` with a `<source>` are provided, the `mediaSource` takes precedence:
			// <MediaPlayer src={playerSource}>
			//  <Media autoPlay muted>
			//   <source src={mediaSource} type="Media/mp4" />
			//  </Media>
			// </MediaPlayer>
			if (!MediaComponent.props.children) {
				mediaProps.children = <source src={src} />;
			}

			if (type && !MediaComponent) {
				const mediaType = type.split('/')[0];
				if (mediaType === 'audio') {
					mediaComponent = <Audio {...mediaProps} />;
				} else if (mediaType === 'video') {
					mediaComponent = <Video {...mediaProps} />;
				}
			}
		}

		return (
			<div className={`${css.mediaPlayer} enact-fit ${(className ? className : '')}`} style={style}>
				{/* Media Section */}
				{
					// Duplicating logic from <ComponentOverride /> until enzyme supports forwardRef
					MediaComponent && (
						isRenderable(MediaComponent) && (
							<MediaComponent {...mediaProps} />
						) || React.isValidElement(MediaComponent) && (
							React.cloneElement(MediaComponent, mediaProps)
						)
					) || mediaComponent
				}
				<Overlay>
					{children}
				</Overlay>
			</div>
		);
	}
};

/**
 * A standard player. It behaves, responds to, and operates like a
 * `<audio>` or `<video>` tag in its support for `<source>`.
 *
 * Example simple usage:
 * ```
 *	<MediaPlayer autoPlay src="http://my.cat.sings/meow.mp3" type="audio/mp3" />
 * ```
 * Example advanced usage:
 * ```
 *  import MediaPlayer, {PlayButton, PauseButton, Slider} from '@enact/ui/MediaPlayer';
 *  import Video from '@enact/ui/Video';
 *  import {Row, Cell} from '@enact/ui/Layout';
 *
 *	<MediaPlayer>
 *		<Video autoPlay>
 *			<source src="http://my.cat.videos/boots/video-to-play-first.mp4" type="video/mp4" />
 *			<preloadSource src="http://my.cat.videos/boots/video-to-preload.mp4" type="video/mp4" />
 *		</Video>
 *		<h1>Boots the Cat</h1>
 *		<h3>video about my cat Boots, wearing boots.</h3>
 *		<Row>
 *			<Cell>
 *				<ProgressBarControls />
 *			</Cell>
 *			<Cell shrink>
 *				<PlayButton />
 *			</Cell>
 *			<Cell shrink>
 *				<CustomButton>Share this video</CustomButton>
 *			</Cell>
 *		</Row>
 *	</MediaPlayer>
 * ```
 *
 * To invoke methods (e.g.: `fastForward()`) or get the current state (`getMediaState()`), store a
 * ref to the `MediaPlayer` within your component:
 *
 * ```
 * 	...
 *
 * 	setMediaPlayer = (node) => {
 * 		this.videoPlayer = node;
 * 	}
 *
 * 	play () {
 * 		this.videoPlayer.play();
 * 	}
 *
 * 	render () {
 * 		return (
 * 			<MediaPlayer ref={this.setMediaPlayer} />
 * 		);
 * 	}
 * ```
 *
 * @class MediaPlayer
 * @memberof ui/MediaPlayer
 * @mixes ui/Slottable.Slottable
 * @ui
 * @public
 */
const MediaPlayer = Slottable(
	{slots: ['mediaComponent']},
		MediaPlayerBase
);

export default MediaPlayer;
export {
	Audio,
	Media,
	MediaPlayer,
	Video
};
