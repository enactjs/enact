import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import css from './VideoPlayer.less';

const preloadProps = {
	autoPlay: false,
	style: {
		display: 'none'
	}
};

const VideoBase = kind({
	name: 'Video',

	propTypes: {
		index: PropTypes.number,
		noAutoPlay: PropTypes.bool,
		setActiveVideo: PropTypes.func,
		sources: PropTypes.arrayOf(PropTypes.object)
	},

	defaultProps: {
		index: 0
	},

	computed: {
		activeProps: ({noAutoPlay, setActiveVideo}) => {
			return {
				autoPlay: !noAutoPlay,
				className: css.video,
				controls: false,
				ref: setActiveVideo
			};
		}
	},

	render: ({activeProps, index, sources, ...rest}) => {
		delete rest.setActiveVideo;
		delete rest.sources;
		delete rest.noAutoPlay;

		return (
			<div>
				{sources.map(({preload, ...source}, i) => {
					if (!source) return null;

					const props = index === i ? activeProps : preloadProps;

					return (
						<video {...rest} {...props} preload={preload} key={i}>
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
