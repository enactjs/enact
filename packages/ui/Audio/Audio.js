import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
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
 *   <source src="path/to/source.mp3" />
 * </Audio>
 * ```
 *
 * @class Audio
 * @memberof ui/Audio
 * @extends ui/Media.Media
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
		mediaComponent: 'audio'
	},

	render: ({setMedia, ...rest}) => {
		return (
			<Media {...rest} ref={setMedia} />
		);
	}
});

const AudioDecorator = compose(
	// ui/Media provides an imperative API so we must forwarding on the ref to it
	ForwardRef({prop: 'setMedia'})
);

const Audio = AudioDecorator(AudioBase);
Audio.defaultSlot = 'mediaComponent';

export default Audio;
export {
	Audio,
	AudioBase,
	AudioDecorator
};
