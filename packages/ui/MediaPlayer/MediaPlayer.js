/**
 * Provides media player and media related components.
 *
 * @module ui/MediaPlayer
 * @exports Audio
 * @exports Video
 * @exports Media
 * @exports MediaPlayer
 */

import ApiDecorator from '@enact/core/internal/ApiDecorator';
import EnactPropTypes from '@enact/core/internal/prop-types';
import {isRenderable} from '@enact/core/util/util';
import Audio from '../Audio';
import Slottable from '../Slottable';
import Media from '../Media';
import Video from '../Video';

import PropTypes from 'prop-types';
import React from 'react';

import Overlay from './Overlay';
import css from './MediaPlayer.module.less';

const MediaPlayerBase = class extends React.Component {
	static displayName = 'MediaPlayerBase';

	static propTypes = /** @lends ui/MediaPlayer.MediaPlayerBase.prototype */ {
		/**
		 * Media component to use.
		 *
		 * Common components to use are [Audio]{@link ui/Audio}, [Media]{@link ui/Media}, or [Video]{@link ui/Video}. Custom media components must have a similar
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
		 * The [`src`]{@link ui/MediaPlayer.MediaPlayerBase.src} property is passed to
		 * the media component as a `<source>` child node.
		 *
		 * @type {Component|Element}
		 * @public
		 */
		mediaComponent: EnactPropTypes.componentOverride,

		/**
		 * Registers the MediaPlayer component with an
		 * {@link core/internal/ApiDecorator.ApiDecorator}.
		 *
		 * @type {Function}
		 * @private
		 */
		setApiProvider: PropTypes.func,

		/**
		 * The address of the media source. [`type`]{@link ui/MediaPlayer.MediaPlayerBase.type} prop or [`mediaComponent`]{@link ui/MediaPlayer.MediaPlayerBase.mediaComponent} is required to load `src`.
		 *
		 * The value of this attribute is ignored when there is `src` prop is set in the [`mediaComponent`]{@link ui/MediaPlayer.MediaPlayerBase.mediaComponent}.
		 *
		 * @type {String}
		 * @public
		 */
		src: PropTypes.string,

		/**
		 * The type of the media source to be used with [`src`]{@link ui/MediaPlayer.MediaPlayerBase.src}.
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

		if (props.setApiProvider) {
			props.setApiProvider(this);
		}
	}

	setMediaRef = (media) => {
		this.media = media;
	}

	/**
	 * Returns the underlying media node currently used by the MediaPlayer
	 *
	 * @function
	 * @memberof ui/MediaPlayer.MediaPlayerBase.prototype
	 * @public
	 */
	getMediaNode = () => {
		return this.media;
	}

	/**
	 * Programmatically plays the current media.
	 *
	 * @function
	 * @memberof ui/MediaPlayer.MediaPlayerBase.prototype
	 * @public
	 */
	play = () => {
		this.media.play();
	}

	/**
	 * Programmatically plays the current media.
	 *
	 * @function
	 * @memberof ui/MediaPlayer.MediaPlayerBase.prototype
	 * @public
	 */
	pause = () => {
		this.media.pause();
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

		delete mediaProps.setApiProvider;

		mediaProps.className = css.media;
		mediaProps.ref = this.setMediaRef;

		let mediaComponent = null;

		if (src) {
			// If `src` and `mediaComponent` without a `<source>` are provided, pass `<source src={src} />` to `mediaComponent`
			// If `src` and `mediaComponent` with a `<source>` are provided, the `mediaSource` takes precedence:
			// <MediaPlayer src={playerSource}>
			//  <Media autoPlay muted>
			//   <source src={mediaSource} type="Media/mp4" />
			//  </Media>
			// </MediaPlayer>
			if (MediaComponent && MediaComponent.props && !MediaComponent.props.children) {
				mediaProps.children = <source src={src} />;
			}

			if (type && !MediaComponent) {
				const mediaType = type.split('/')[0];

				mediaComponent = <Media {...mediaProps} mediaComponent={mediaType} />;
			}
		}

		return (
			<div
				className={`${css.mediaPlayer} enact-fit ${(className ? className : '')}`}
				style={style}
			>
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
 * A standard player.
 *
 * Example simple usage:
 * ```
 *	<MediaPlayer autoPlay src="http://my.cat.sings/meow.mp3" type="audio/mp3" />
 * ```
 * Example advanced usage:
 * ```
 *  import {MediaPlayer, Video} from '@enact/ui/MediaPlayer';
 *  import {Row, Cell} from '@enact/ui/Layout';
 *
 *	<MediaPlayer>
 *		<Video autoPlay>
 *			<source src="http://my.cat.videos/boots/video-to-play-first.mp4" type="video/mp4" />
 *		</Video>
 *		<h1 className="title">Boots the Cat</h1>
 *		<h3 className="subtitle">video about my cat Boots, wearing boots.</h3>
 *		<Row>
 *			<Cell>
 *				<CustomProgressBarControls />
 *			</Cell>
 *			<Cell shrink>
 *				<CustomPlayButton />
 *			</Cell>
 *			<Cell shrink>
 *				<CustomButton>Share this video</CustomButton>
 *			</Cell>
 *		</Row>
 *	</MediaPlayer>
 * ```
 *
 * To invoke methods (e.g.: `play()` or `pause()`) store a
 * ref to the `MediaPlayer` within your component:
 *
 * ```
 * 	...
 *
 * 	setMediaPlayer = (node) => {
 * 		this.mediaPlayer = node;
 * 	}
 *
 * 	play () {
 * 		this.mediaPlayer.play();
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
		'getMediaNode',
		'play',
		'pause'
	]},
	Slottable(
		{slots: ['mediaComponent']},
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
