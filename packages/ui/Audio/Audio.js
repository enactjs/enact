import kind from '@enact/core/kind';
import compose from 'ramda/src/compose';
import PropTypes from 'prop-types';
import React from 'react';

import ForwardRef from '../ForwardRef';
import Media from '../Media';

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
const AudioBase = kind({
	name: 'ui:Audio',

	propTypes: {
		mediaComponent: PropTypes.string,
		setMedia: PropTypes.func
	},

	defaultProps: {
		mediaComponent: 'video'
	},

	render: ({setMedia, ...rest}) => {
		return (
			<Media {...rest} ref={setMedia} />
		);
	}
});

// const Audio = MediaDecorator((props) => <MediaBase {...props} mediaComponent="audio" />);
// Audio.defaultSlot = 'audioComponent';
const AudioDecorator = compose(
	ForwardRef({prop: 'setMedia'})
);

const Audio = AudioDecorator(AudioBase);
Audio.defaultSlot = 'mediaComponent';

export default Audio;
export {
	Audio
};
