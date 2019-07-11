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

import ApiDecorator from '@enact/core/internal/ApiDecorator';
import EnactPropTypes from '@enact/core/internal/prop-types';
import Audio from '@enact/ui/Audio';
import Slottable from '@enact/ui/Slottable';
import Media from '@enact/ui/Media';
import Video from '@enact/ui/Video';

import PropTypes from 'prop-types';
import React from 'react';

const MediaPlayerBase = class extends React.Component {
	static displayName = 'MediaPlayerBase';

	static propTypes = /** @lends ui/MediaPlayer.MediaPlayerBase.prototype */ {
		/**
		 * Video component to use.
		 *
		 * The default renders an `HTMLVideoElement`. Custom media components must have a similar
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
		 * The media source.
		 *
		 * Any children `<source>` tag elements of [MediaPlayer]{@link ui/MediaPlayer} will
		 * be sent directly to the `mediaComponent` as media sources.
		 *
		 * @type {Node}
		 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source
		 * @public
		 */
		source: PropTypes.node
	}

	constructor (props) {
		super(props)

	}

	render () {
		const {
			className,
			style,
			mediaComponent: MediaComponent,
			...mediaProps
		} = this.props;

		return (
			<div className={className} style={style}>
				{/* Media Section */}
				{
					// Duplicating logic from <ComponentOverride /> until enzyme supports forwardRef
					MediaComponent && (
						(typeof MediaComponent === 'function' || typeof MediaComponent === 'string') && (
							<MediaComponent {...mediaProps} />
						) || React.isValidElement(MediaComponent) && (
							React.cloneElement(MediaComponent, mediaProps)
						)
					) || null
				}
			</div>
		);
	}
};

// import MediaPlayer, {PlayButton, PauseButton, Slider} from '@enact/ui/MediaPlayer';
// import Video from '@enact/ui/Video';
// import {Row, Cell} from '@enact/ui/Layout';
// ...

// <MediaPlayer>
//    <h1>{videoTitle}</h1>
//    <Row>
//       <Cell shrink><PlayButton /></Cell>
//       <Cell shrink><PauseButton /></Cell>
//       <Cell><Slider /></Cell>
//    <Row>
//    <Video>
//       <source>{myVideoURL}</source>
//    </Video>
// </MediaPlayer>

/**
 * A standard player. It behaves, responds to, and operates like a
 * `<audio>` or `<video>` tag in its support for `<source>`.  It also accepts custom tags such as `<MediaControls>`
 * for handling media playback controls and adding more controls.
 *
 * Example simple usage:
 * ```
 *	<MediaPlayer src="http://my.cat.sings/meow.mp3" type="audio/mp3" />
 * ```
 * Example advanced usage:
 * ```
 *  import MediaPlayer, {PlayButton, PauseButton, Slider} from '@enact/ui/MediaPlayer';
 *  import Video from '@enact/ui/Video';
 *  import {Row, Cell} from '@enact/ui/Layout';
 *
 *	<MediaPlayer>
 *		<Video autPlay>
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
const MediaPlayer = ApiDecorator(
	{api: [
		'areControlsVisible',
		'fastForward',
		'getMediaState',
		'getVideoNode',
		'hideControls',
		'jump',
		'pause',
		'play',
		'rewind',
		'seek',
		'showControls',
		'showFeedback',
		'toggleControls'
	]},
	Slottable(
		{slots: ['PlayButton', 'ProgressBarControls', 'source', 'thumbnailComponent', 'videoComponent']},
			MediaPlayerBase
	)
);

export default MediaPlayer;
export {
	Audio,
	Media,
	MediaPlayer,
	Video
};
