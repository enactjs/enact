import Video from '@enact/ui/Video';
import React from 'react';
import {button} from '@storybook/addon-knobs';
import {storiesOf} from '@storybook/react';

const playlist = [
	'http://media.w3.org/2010/05/sintel/trailer.mp4',
	'http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_h264.mov'
]

class VideoSourceSwap extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			currentIndex: 0,
			preloadIndex: 1
		};
		this.lastIndex = playlist.length - 1;
	}

	nextVideo = () => {
		this.setState(({currentIndex, preloadIndex}) => ({
			currentIndex: currentIndex === this.lastIndex ? 0 : currentIndex + 1,
			preloadIndex: preloadIndex === this.lastIndex ? 0 : preloadIndex + 1
		}));
	}

	onEnded = () => {
		this.nextVideo();
	}

	render () {
		return (
			<div>
				{button('Next Preload Video', this.nextVideo, 'Video')}
				<Video autoPlay muted onEnded={this.onEnded}>
					<source src={playlist[this.state.currentIndex]} />
					<source src={playlist[this.state.preloadIndex]} slot="preloadSource" />
				</Video>
			</div>
		);
	}
}

storiesOf('UI', module)
	.add(
		'Video',
		() => {
			return (
				<VideoSourceSwap />
			);
		},
		{
			info: {
				text: 'Basic Video'
			}
		}
	);
