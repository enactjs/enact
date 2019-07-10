import {MediaBase, MediaDecorator} from '@enact/ui/Media';
import React from 'react';

/**
 * Provides support for more advanced Audio configurations for `Audio`.
 * Private for now until we solidify API's and dependencies.
 *
 * Custom Audio Tag
 *
 * ```
 * <Audio mediaComponent="custom-audio-element">
 *   <source src="path/to/source.mp4" />
 * </Audio>
 * ```
 *
 * Preload Audio Source
 *
 * ```
 * <Audio>
 *   <source src="path/to/source.mp3" />
 *   <source src="path/to/preload-source.mp3" slot="preloadSource" />
 * </Audio>
 * ```
 *
 * @class Audio
 * @mixes ui/Slottable
 * @memberof ui/Audio
 * @ui
 * @private
 */
const Audio = MediaDecorator((props) => <MediaBase {...props} mediaComponent="audio" />);
Audio.defaultSlot = 'audioComponent';

export default Audio;
export {
	Audio
};
