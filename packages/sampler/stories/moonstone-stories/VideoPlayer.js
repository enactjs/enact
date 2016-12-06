import VideoPlayer, {VideoPlayerBase} from '@enact/moonstone/VideoPlayer';
import IconButton from '@enact/moonstone/IconButton';
import Button from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';

VideoPlayerBase.propTypes = Object.assign({}, VideoPlayerBase.propTypes, VideoPlayer.propTypes);
VideoPlayerBase.defaultProps = Object.assign({}, VideoPlayerBase.defaultProps, VideoPlayer.defaultProps);
VideoPlayerBase.displayName = 'VideoPlayer';

// Set up some defaults for info and knobs
const prop = {
	videoTitles: [
		'Sintel',
		'Big Buck Bunny',
		'VideoTest',
		'Bad Video Source'
	],
	videos: [
		{
			poster: 'http://media.w3.org/2010/05/sintel/poster.png',
			source: 'http://media.w3.org/2010/05/sintel/trailer.mp4'
		},
		{
			poster: 'http://media.w3.org/2010/05/bunny/poster.png',
			source: 'http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_h264.mov'
		},
		{
			poster: 'http://media.w3.org/2010/05/video/poster.png',
			source: 'http://media.w3.org/2010/05/video/movie_300.mp4'
		},
		{
			poster: 'http://media.w3.org/2010/05/video/poster.png',
			// Purposefully not a video to demonstrate source error state
			source: 'https://github.com/mderrick/react-html5video'
		}
	],
	events: [
		'onAbort',
		'onCanPlay',
		'onCanPlayThrough',
		'onDurationChange',
		'onEmptied',
		'onEncrypted',
		'onEnded',
		'onError',
		'onLoadedData',
		'onLoadedMetadata',
		'onLoadStart',
		'onPause',
		'onPlay',
		'onPlaying',
		'onProgress',
		'onRateChange',
		'onSeeked',
		'onSeeking',
		'onStalled',
		'onSuspend',
		'onTimeUpdate',
		'onVolumeChange',
		'onWaiting'
	]
};

let videoData;
const selectVideo = (index) => {
	// console.log('selectVideo:', index);
	if (index != null && prop.videos[index]) {
		videoData = (prop.videos[index]) ? prop.videos[index] : {};
		return prop.videoTitles[index].title;
	}
};

prop.eventActions = {};
prop.events.forEach( (ev) => {
	prop.eventActions[ev] = action(ev);
});

storiesOf('VideoPlayer')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic VideoPlayer',
		() => (
			<div
				style={{
					outline: 'teal dashed 1px',
					position: 'relative'
				}}
			>
				<label
					style={{
						outline: 'teal dashed 1px',
						backgroundColor: 'rgba(0, 128, 128, 0.5)',
						color: '#0bb',
						position: 'absolute',
						transform: 'translateY(-100%)',
						borderBottomWidth: 0,
						padding: '0.1em 1em',
						fontWeight: 100,
						fontStyle: 'italic',
						fontSize: '16px'
					}}
				>VideoPlayer Edge</label>
				<VideoPlayer
					autoPlay={boolean('autoPlay', true)}
					loop={boolean('loop', true)}
					muted={boolean('muted', true)}
					title={selectVideo(select('video', prop.videoTitles, 0))}
					poster={videoData.poster}
					{...prop.eventActions}
				>
					<source src={videoData.source} type="video/mp4" />
					<infoComponents>A video about some things happening to and around some characters. Very exciting stuff.</infoComponents>
					<leftComponents><IconButton backgroundOpacity="translucent">fullscreen</IconButton></leftComponents>
					<rightComponents><IconButton backgroundOpacity="translucent">flag</IconButton></rightComponents>

					<Button backgroundOpacity="translucent">Add To Favorites</Button>
					<IconButton backgroundOpacity="translucent">star</IconButton>
				</VideoPlayer>
			</div>
		)
	);
