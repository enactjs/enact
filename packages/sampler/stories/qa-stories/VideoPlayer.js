import VideoPlayer, {Video} from '@enact/moonstone/VideoPlayer';
import {button} from '@storybook/addon-knobs';
import {storiesOf} from '@storybook/react';
import React from 'react';

const videoTabLabel = 'VideoPlayer';

class VideoSourceSwap extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			videoTitles: [
				'Big Buck Bunny',
				'Sintel',
				'VideoTest'
			],
			playlist: [
				'http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_h264.mov',
				'http://media.w3.org/2010/05/sintel/trailer.mp4',
				'http://media.w3.org/2010/05/video/movie_300.mp4'
			],
			cursor: 0,
			preloadCursor: 1
		};
		this.lastIndex = this.state.playlist.length - 1;
	}

	nextVideo = () => {
		this.setState(({cursor, preloadCursor}) => ({
			cursor: cursor === this.lastIndex ? 0 : cursor + 1,
			preloadCursor: preloadCursor === this.lastIndex ? 0 : preloadCursor + 1
		}));
	}

	differentVideo = () => {
		this.setState(({cursor, playlist, preloadCursor}) => ({
			cursor: (cursor + 2) % playlist.length,
			preloadCursor: (preloadCursor + 2) % playlist.length
		}));
	}

	nextVideoKeepPreload = () => {
		this.setState(({cursor}) => ({
			cursor: cursor === this.lastIndex ? 0 : cursor + 1
		}));
	}

	nextPreloadVideoKeepVideo = () => {
		this.setState(({preloadCursor}) => ({
			preloadCursor: preloadCursor ===  this.lastIndex ? 0 : preloadCursor + 1
		}));
	}

	resetSources = () => {
		this.setState({
			cursor: 0,
			preloadCursor: 1
		});
	}

	render () {
		return (
			<div>
				{button('Next Preload Video', this.nextVideo, videoTabLabel)}
				{button('Non Preload Video', this.differentVideo, videoTabLabel)}
				{button('Next Preload Video without changing preload', this.nextVideoKeepPreload, videoTabLabel)}
				{button('Change Preload without changing video', this.nextPreloadVideoKeepVideo, videoTabLabel)}
				{button('Reset Sources', this.resetSources, videoTabLabel)}
				<VideoPlayer
					muted
					onJumpBackward={this.differentVideo}
					onJumpForward={this.nextVideo}
					title={this.state.videoTitles[this.state.cursor]}
				>
					<Video>
						<source src={this.state.playlist[this.state.cursor]} />
						<source src={this.state.playlist[this.state.preloadCursor]} slot="preloadSource" />
					</Video>
					<infoComponents>A video about some things happening to and around some characters. Very exciting stuff.</infoComponents>
				</VideoPlayer>
			</div>

		);
	}
}

storiesOf('VideoPlayer', module)
	.add(
		'Preload Videos',
		() => (
			<VideoSourceSwap />
		)
	);
