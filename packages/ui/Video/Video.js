import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import ForwardRef from '../ForwardRef';
import Media from '../Media';

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
 * @memberof ui/Video
 * @extends ui/Media.Media
 * @ui
 * @private
 */
const VideoBase = kind({
	name: 'ui:Video',

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

const VideoDecorator = compose(
	// ui/Media provides an imperative API so we must forwarding on the ref to it
	ForwardRef({prop: 'setMedia'})
);

const Video = VideoDecorator(VideoBase);
Video.defaultSlot = 'mediaComponent';

export default Video;
export {
	Video,
	VideoBase,
	VideoDecorator
};
