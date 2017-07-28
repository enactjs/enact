import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import css from './VideoPlayer.less';

const VideoBase = kind({
	name: 'Video',

	propTypes: {
		index: PropTypes.number,
		noAutoPlay: PropTypes.bool,
		preload: PropTypes.string,
		setActiveVideo: PropTypes.func,
		sources: PropTypes.arrayOf(PropTypes.object)
	},

	defaultProps: {
		index: 0,
		preload: 'metadata'
	},

	computed: {
		activeProps: ({noAutoPlay, setActiveVideo, ...rest}) => {
			delete rest.preload;
			delete rest.index;
			delete rest.noAutoPlay;
			delete rest.setActiveVideo;
			delete rest.sources;

			return {
				...rest,
				autoPlay: !noAutoPlay,
				className: css.video,
				controls: false,
				ref: setActiveVideo
			};
		},
		preloadProps: ({preload}) => ({
			autoPlay: false,
			preload,
			style: {
				display: 'none'
			}
		})
	},

	render: ({activeProps, index, preloadProps, sources}) => {
		return (
			<div>
				{sources.map(({preload, ...source}, i) => {
					if (!source) return null;

					const props = index === i ? activeProps : preloadProps;

					return (
						<video {...props} preload={preload} key={i}>
							<source {...source} />
						</video>
					);
				})}
			</div>
		);
	}
});

export default VideoBase;
export {
	VideoBase as Video,
	VideoBase
};
