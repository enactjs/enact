import Video from '@enact/ui/Video';

/**
 * Provides support for more advanced video configurations for `Video`.
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
 * @memberof moonstone/VideoPlayer
 * @ui
 * @public
 */
export default Video;
export {
	Video
};
