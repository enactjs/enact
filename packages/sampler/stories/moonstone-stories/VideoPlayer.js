import icons from './icons';
import VideoPlayer, {MediaControls} from '@enact/moonstone/VideoPlayer';
import IconButton from '@enact/moonstone/IconButton';
import Button from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, number, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

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
		'onControlsAvailable',
		'onDurationChange',
		'onEmptied',
		'onEncrypted',
		'onEnded',
		'onError',
		'onFastForward',
		'onJumpBackward',
		'onJumpForward',
		'onLoadedData',
		'onLoadedMetadata',
		'onLoadStart',
		'onPause',
		'onPlay',
		'onPlaying',
		'onProgress',
		'onRateChange',
		'onRewind',
		'onSeeked',
		'onSeekFailed',
		'onSeeking',
		'onStalled',
		'onSuspend',
		// 'onTimeUpdate',	// Disabled due to Storybook Actions-reporting having an adverse effect on VideoPlayer performance. Uncomment to view this event.
		'onVolumeChange',
		'onWaiting'
	]
};

const videoSources = {};
for (let index = 0; index < prop.videos.length; index++) {
	if (index != null && prop.videos[index]) {
		videoSources[prop.videos[index].source] = prop.videoTitles[index];
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

const Config = mergeComponentMetadata('VideoPlayer', VideoPlayer);
const MediaControlsConfig = mergeComponentMetadata('MediaControls', MediaControls);
VideoPlayer.displayName = 'VideoPlayer';
MediaControls.displayName = 'MediaControls';

storiesOf('Moonstone', module)
	.add(
		'VideoPlayer',
		withInfo({
			propTablesExclude: [Button, IconButton, MediaControls, VideoPlayer],
			text: 'The basic VideoPlayer'
		})(() => {
			const videoSource = select('source', videoSources, Config, prop.videos[0].source);
			const poster = matchPoster(videoSource);
			return (
				<div
					style={{
						transformOrigin: 'top',
						transform: 'scale(' + number('video scale', 1, {range: true, min: 0.05, max: 1, step: 0.01}) + ')',
						outline: 'teal dashed 1px',
						height: '70vh'
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
						autoCloseTimeout={number('autoCloseTimeout', Config, 7000)}
						disabled={boolean('disabled', Config)}
						feedbackHideDelay={number('feedbackHideDelay', Config, 3000)}
						loop={boolean('loop', Config, true)}
						miniFeedbackHideDelay={number('miniFeedbackHideDelay', Config, 2000)}
						muted={boolean('muted', Config, true)}
						noAutoPlay={boolean('noAutoPlay', Config)}
						noMiniFeedback={boolean('noMiniFeedback', Config)}
						noSlider={boolean('noSlider', Config)}
						pauseAtEnd={boolean('pauseAtEnd', Config)}
						poster={poster}
						seekDisabled={boolean('seekDisabled', Config)}
						spotlightDisabled={boolean('spotlightDisabled', Config)}
						thumbnailSrc={poster}
						thumbnailUnavailable={boolean('thumbnailUnavailable', Config)}
						title={text('title', Config, 'Moonstone VideoPlayer Sample Video')}
						titleHideDelay={number('titleHideDelay', Config, 4000)}
						{...prop.eventActions}
					>
						<source src={videoSource} type="video/mp4" />
						<infoComponents>A video about some things happening to and around some characters. Very exciting stuff.</infoComponents>
						<MediaControls
							backwardIcon={select('backwardIcon', icons, MediaControlsConfig, 'backward')}
							forwardIcon={select('forwardIcon', icons, MediaControlsConfig, 'forward')}
							initialJumpDelay={number('initialJumpDelay', MediaControlsConfig, 400)}
							jumpBackwardIcon={select('jumpBackwardIcon', icons, MediaControlsConfig, 'skipbackward')}
							jumpButtonsDisabled={boolean('jumpButtonsDisabled', MediaControlsConfig)}
							jumpDelay={number('jumpDelay', MediaControlsConfig, 200)}
							jumpForwardIcon={select('jumpForwardIcon', icons, MediaControlsConfig, 'skipforward')}
							moreButtonCloseLabel={text('moreButtonCloseLabel', MediaControlsConfig)}
							moreButtonDisabled={boolean('moreButtonDisabled', MediaControlsConfig)}
							moreButtonLabel={text('moreButtonLabel', MediaControlsConfig)}
							no5WayJump={boolean('no5WayJump', MediaControlsConfig)}
							noJumpButtons={boolean('noJumpButtons', MediaControlsConfig)}
							noRateButtons={boolean('noRateButtons', MediaControlsConfig)}
							pauseIcon={select('pauseIcon', icons, MediaControlsConfig, 'pause')}
							playIcon={select('playIcon', icons, MediaControlsConfig, 'play')}
							rateButtonsDisabled={boolean('rateButtonsDisabled', MediaControlsConfig)}
						>
							<leftComponents><IconButton backgroundOpacity="translucent">fullscreen</IconButton></leftComponents>
							<rightComponents><IconButton backgroundOpacity="translucent">flag</IconButton></rightComponents>
							<Button backgroundOpacity="translucent">Add To Favorites</Button>
							<IconButton backgroundOpacity="translucent">star</IconButton>
						</MediaControls>
					</VideoPlayer>
				</div>
			);
		})
	);
