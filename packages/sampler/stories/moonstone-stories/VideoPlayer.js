import icons from './icons';
import VideoPlayer, {VideoPlayerBase} from '@enact/moonstone/VideoPlayer';
import IconButton from '@enact/moonstone/IconButton';
import Button from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, number, select, text} from '@kadira/storybook-addon-knobs';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('VideoPlayer', VideoPlayerBase, VideoPlayer);

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
		'onBackwardButtonClick',
		'onCanPlay',
		'onCanPlayThrough',
		'onControlsAvailable',
		'onDurationChange',
		'onEmptied',
		'onEncrypted',
		'onEnded',
		'onError',
		'onForwardButtonClick',
		'onJumpBackwardButtonClick',
		'onJumpForwardButtonClick',
		'onLoadedData',
		'onLoadedMetadata',
		'onLoadStart',
		'onPause',
		'onPlay',
		'onPlayButtonClick',
		'onPlaying',
		'onProgress',
		'onRateChange',
		'onSeeked',
		'onSeeking',
		'onStalled',
		'onSuspend',
		'onTimeUpdate',
		'onUMSMediaInfo',	// Custom webOS media event
		'onVolumeChange',
		'onWaiting'
	]
};

let videoSource = {};
for (let index = 0; index < prop.videos.length; index++) {
	if (index != null && prop.videos[index]) {
		videoSource[prop.videos[index].source] = prop.videoTitles[index];
	}
}

const matchPoster = (src) => {
	for (let index = 0; index < prop.videos.length; index += 1) {
		if (prop.videos[index].source === src) {
			return prop.videos[index].poster;
		}
	}
	return '';
};

prop.eventActions = {};
prop.events.forEach( (ev) => {
	prop.eventActions[ev] = action(ev);
});

storiesOf('VideoPlayer')
	.addWithInfo(
		' ',
		'The basic VideoPlayer',
		() => {
			const video = select('test-source', videoSource, prop.videos[0].source);
			const poster = matchPoster(video);
			return (
				<div
					style={{
						transformOrigin: 'top',
						transform: 'scale(' + number('video scale', 1, {range: true, min: 0.05, max: 1, step: 0.01}) + ')',
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
						autoCloseTimeout={number('autoCloseTimeout', 7000)}
						backwardIcon={select('backwardIcon', icons, 'backward')}
						forwardIcon={select('forwardIcon', icons, 'forward')}
						jumpBackwardIcon={select('jumpBackwardIcon', icons, 'skipbackward')}
						jumpForwardIcon={select('jumpForwardIcon', icons, 'skipforward')}
						jumpButtonsDisabled={boolean('jumpButtonsDisabled', false)}
						rateButtonsDisabled={boolean('rateButtonsDisabled', false)}
						loop={boolean('loop', true)}
						muted={boolean('muted', true)}
						noAutoPlay={boolean('noAutoPlay', false)}
						noJumpButtons={boolean('noJumpButtons', false)}
						noRateButtons={boolean('noRateButtons', false)}
						noSlider={boolean('noSlider', false)}
						pauseIcon={select('pauseIcon', icons, 'pause')}
						playIcon={select('playIcon', icons, 'play')}
						poster={poster}
						title={text('title', 'Moonstone VideoPlayer Sample Video')}
						titleHideDelay={number('titleHideDelay', 4000)}
						{...prop.eventActions}
					>
						<source src={video} type="video/mp4" />
						<infoComponents>A video about some things happening to and around some characters. Very exciting stuff.</infoComponents>
						<leftComponents><IconButton backgroundOpacity="translucent">fullscreen</IconButton></leftComponents>
						<rightComponents><IconButton backgroundOpacity="translucent">flag</IconButton></rightComponents>

						<Button backgroundOpacity="translucent">Add To Favorites</Button>
						<IconButton backgroundOpacity="translucent">star</IconButton>
					</VideoPlayer>
				</div>
			);
		},
		{propTables: [Config]}
	);
