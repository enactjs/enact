import {PreloadDecorator} from '@enact/ui/Media';
import UiVideo from '@enact/ui/Video';

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
const Video = PreloadDecorator(UiVideo);
Video.defaultSlot = 'videoComponent';

export default Video;
export {
	Video
};
