import {MediaBase, MediaDecorator} from '../Media';

/**
 * Provides support for more advanced video configurations for `Video`.
 * Private for now until we solidify API's and dependencies.
 *
 * Custom Video Tag
 *
 * ```
 * <Video mediaComponent="custom-video-element">
 *   <source src="path/to/source.mp4" />
 * </Video>
 * ```
 *
 * Preload Video Source
 *
 * ```
 * <Video>
 *   <source src="path/to/source.mp4" />
 *   <source src="path/to/preload-source.mp4" slot="preloadSource" />
 * </Video>
 * ```
 *
 * @class Video
 * @mixes ui/Slottable
 * @memberof ui/Video
 * @ui
 * @private
 */
const Video = MediaDecorator(MediaBase);
Video.defaultSlot = 'mediaComponent';

export default Video;
export {
	Video,
	MediaBase,
	MediaDecorator
};
