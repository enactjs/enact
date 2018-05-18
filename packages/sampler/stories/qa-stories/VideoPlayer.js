import Button from '@enact/moonstone/Button';
import React from 'react';
import VideoPlayer from '@enact/moonstone/VideoPlayer';
import IconButton from '@enact/moonstone/IconButton';
import {storiesOf} from '@storybook/react';
import {button} from '@storybook/addon-knobs';

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
		this.setState({
			cursor: this.state.cursor === this.lastIndex ? 0 : this.state.cursor + 1,
			preloadCursor: this.state.preloadCursor === this.lastIndex ? 0 : this.state.preloadCursor + 1
		});
	}

	differentVideo = () => {
		this.setState({
			cursor: (this.state.cursor + 2) % this.state.playlist.length,
			preloadCursor: (this.state.preloadCursor + 2) % this.state.playlist.length
		});
	}

	nextVideoKeepPreload = () => {
		this.setState({
			cursor: this.state.cursor === this.lastIndex ? 0 : this.state.cursor + 1
		});
	}

	nextPreloadVideoKeepVideo = () => {
		this.setState({
			preloadCursor: this.state.preloadCursor ===  this.lastIndex ? 0 : this.state.preloadCursor + 1
		});
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
				{button('Next Preload Video', this.nextVideo)}
				{button('Non Preload Video', this.differentVideo)}
				{button('Next Preload Video without changing preload', this.nextVideoKeepPreload)}
				{button('Change Preload without changing video', this.nextPreloadVideoKeepVideo)}
				{button('Reset Sources', this.resetSources)}
				<VideoPlayer
					muted
					onJumpBackward={this.differentVideo}
					onJumpForward={this.nextVideo}
					preloadSource={<source src={this.state.playlist[this.state.preloadCursor]} type="video/mp4" />}
					title={this.state.videoTitles[this.state.cursor]}
				>
					<source src={this.state.playlist[this.state.cursor]} type="video/mp4" />
					<infoComponents>A video about some things happening to and around some characters. Very exciting stuff.</infoComponents>

					<Button backgroundOpacity="translucent">Add To Favorites</Button>
					<IconButton backgroundOpacity="translucent">star</IconButton>
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
