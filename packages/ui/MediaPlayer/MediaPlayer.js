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
import Audio from '@enact/ui/Audio';
import Slottable from '@enact/ui/Slottable';
import Media from '@enact/ui/Media';
import Video from '@enact/ui/Video';

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
 *	<MediaPlayer autoPlay>
 *		<source src="http://my.cat.videos/boots/video-to-play-first.mp4" type="video/mp4" />
 *		<preloadSource src="http://my.cat.videos/boots/video-to-preload.mp4" type="video/mp4" />
 *		<h1>Boots the Cat</h1>
 *		<h3>video about my cat Boots, wearing boots.</h3>
 *		<ProgressBarControls />
 *		<PlayButton />
 *		<CustomButton>Share this video</CustomButton>
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
			VideoPlayerBase
	)
);

export default MediaPlayer;
export {
	Audio,
	Media,
	MediaPlayer,
	Video
};
