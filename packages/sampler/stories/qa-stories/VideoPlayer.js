import Button from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import VideoPlayer from '@enact/moonstone/VideoPlayer';
import IconButton from '@enact/moonstone/IconButton';


class VideoPlayerStory extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			index: 0,
			preloadSources: [
				{src: 'http://media.w3.org/2010/05/sintel/trailer.mp4', type: 'video/mp4', preload: 'auto'},
				{src: 'http://media.w3.org/2010/05/video/movie_300.mp4', type: 'video/mp4', preload: 'none'}
			]
		};
	}

	onClick = () => {
		if (this.state.index === 2 ) {
			this.setState({
				index: 0
			});
		} else {
			this.setState({
				index: this.state.index + 1
			});
		}
	}

	render () {
		const props = this.props;

		return (
			<div {...props}>
				<Button onClick={this.onClick}>Next Video</Button>
				<VideoPlayer
					autoCloseTimeout={7000}
					backwardIcon={'backward'}
					forwardIcon={'forward'}
					jumpBackwardIcon={'skipbackward'}
					jumpForwardIcon={'skipforward'}
					jumpButtonsDisabled={false}
					rateButtonsDisabled={false}
					muted
					index={this.state.index}
					noAutoPlay={false}
					title={'Moonstone VideoPlayer Sample Video'}
					preloadSources={this.state.preloadSources}
				>
					<source src="http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_h264.mov" type="video/mp4" />
					<infoComponents>A video about some things happening to and around some characters. Very exciting stuff.</infoComponents>
					<leftComponents><IconButton backgroundOpacity="translucent">fullscreen</IconButton></leftComponents>
					<rightComponents><IconButton backgroundOpacity="translucent">flag</IconButton></rightComponents>
					<Button backgroundOpacity="translucent">Add To Favorites</Button>
					<IconButton backgroundOpacity="translucent">star</IconButton>
				</VideoPlayer>
			</div>
		);
	}
}

storiesOf('VideoPlayer')
	.addWithInfo(
		'Cycle through preloaded videos',
		() => (
			<VideoPlayerStory />
		)
	);

