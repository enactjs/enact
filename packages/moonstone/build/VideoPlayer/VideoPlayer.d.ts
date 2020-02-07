// Type definitions for moonstone/VideoPlayer

import * as React from "react";
import { CancelableProps as ui_Cancelable_CancelableProps } from "@enact/ui/Cancelable";
import { SlottableProps as ui_Slottable_SlottableProps } from "@enact/ui/Slottable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface VideoProps {
  /**
   * Video plays automatically.
   */
  autoPlay?: boolean;
  /**
 * Video component to use.
 * 
 * The default ( `'video'` ) renders an  `HTMLVideoElement` . Custom video components must have
a similar API structure, exposing the following APIs:
 * 
 * Properties:
 * *  `currentTime`  {Number} - Playback index of the media in seconds
 * *  `duration`  {Number} - Media's entire duration in seconds
 * *  `error`  {Boolean} -  `true`  if video playback has errored.
 * *  `loading`  {Boolean} -  `true`  if video playback is loading.
 * *  `paused`  {Boolean} - Playing vs paused state.  `true`  means the media is paused
 * *  `playbackRate`  {Number} - Current playback rate, as a number
 * *  `proportionLoaded`  {Number} - A value between  `0`  and  `1` 
representing the proportion of the media that has loaded
 * *  `proportionPlayed`  {Number} - A value between  `0`  and  `1`  representing the
proportion of the media that has already been shown
 * 
 * Events:
 * *  `onLoadStart`  - Called when the video starts to load
 * *  `onPlay`  - Sent when playback of the media starts after having been paused
 * *  `onUpdate`  - Sent when any of the properties were updated
 * 
 * Methods:
 * *  `play()`  - play video
 * *  `pause()`  - pause video
 * *  `load()`  - load video
 * 
 * The  `source`   property is passed to
the video component as a child node.
 */
  mediaComponent?: string | React.ComponentType | JSX.Element;
  /**
   * The video source to be preloaded. Expects a  `<source>`  node.
   */
  preloadSource?: React.ReactNode;
  /**
 * The video source to be played.
 * 
 * Any children  `<source>`  elements will be sent directly to the  `mediaComponent`  as video
sources.
 * 
 * See:  
 */
  source?: React.ReactNode;
}
/**
 * Provides support for more advanced video configurations for  `VideoPlayer` .
 * 
 * Custom Video Tag
 * ```
<VideoPlayer>
  <Video mediaComponent="custom-video-element">
    <source src="path/to/source.mp4" />
  </Video>
</VideoPlayer>
```
 
 * Preload Video Source
 * ```
<VideoPlayer>
  <Video>
    <source src="path/to/source.mp4" />
    <source src="path/to/preload-source.mp4" slot="preloadSource" />
  </Video>
</VideoPlayer>
```
 */

export class Video extends React.Component<
  VideoProps & React.HTMLProps<HTMLElement>
> {}

export interface MediaControlsProps extends ui_Cancelable_CancelableProps {
  /**
 * Reverse-playback  icon   name. Accepts any
 icon   component type.
 */
  backwardIcon?: string;
  /**
 * Forward  icon   name. Accepts any
 icon   component type.
 */
  forwardIcon?: string;
  /**
 * Jump backward  icon   name. Accepts any
 icon   component type.
 */
  jumpBackwardIcon?: string;
  /**
   * Disables state on the media "jump" buttons; the outer pair.
   */
  jumpButtonsDisabled?: boolean;
  /**
 * Jump forward  icon   name. Accepts any
 icon   component type.
 */
  jumpForwardIcon?: string;
  /**
 * These components are placed below the title. Typically these will be media descriptor
icons, like how many audio channels, what codec the video uses, but can also be a
description for the video or anything else that seems appropriate to provide information
about the video to the user.
 */
  leftComponents?: React.ReactNode;
  /**
   * Disables the media buttons.
   */
  mediaDisabled?: boolean;
  /**
 * The label for the "more" button for when the "more" tray is open.
This will show on the tooltip.
 */
  moreButtonCloseLabel?: string;
  /**
 * The color of the underline beneath more icon button.
 * 
 * This property accepts one of the following color names, which correspond with the
colored buttons on a standard remote control:  `'red'` ,  `'green'` ,  `'yellow'` ,  `'blue'` .
 */
  moreButtonColor?: string;
  /**
   * Disables the media "more" button.
   */
  moreButtonDisabled?: boolean;
  /**
   * The label for the "more" button. This will show on the tooltip.
   */
  moreButtonLabel?: string;
  /**
   * A custom more button ID to use with Spotlight.
   */
  moreButtonSpotlightId?: string;
  /**
   * Removes the "jump" buttons. The buttons that skip forward or backward in the video.
   */
  noJumpButtons?: boolean;
  /**
 * Removes the "rate" buttons. The buttons that change the playback rate of the video.
Double speed, half speed, reverse 4x speed, etc.
 */
  noRateButtons?: boolean;
  /**
   * Called when the user clicks the Backward button.
   */
  onBackwardButtonClick?: Function;
  /**
   * Called when cancel/back key events are fired.
   */
  onClose?: Function;
  /**
   * Called when the user clicks the Forward button.
   */
  onForwardButtonClick?: Function;
  /**
   * Called when the user clicks the JumpBackward button
   */
  onJumpBackwardButtonClick?: Function;
  /**
   * Called when the user clicks the JumpForward button.
   */
  onJumpForwardButtonClick?: Function;
  /**
   * Called when the user clicks the More button.
   */
  onMoreClick?: Function;
  /**
   * Called when the user clicks the Play button.
   */
  onPlayButtonClick?: Function;
  /**
   * `true`  when the video is paused.
   */
  paused?: boolean;
  /**
 * A string which is sent to the  `pause`  icon of the player controls. This can be
anything that is accepted by  Icon  . This will be temporarily replaced by
the  playIcon   when the
 paused   boolean is  `false` .
 */
  pauseIcon?: string;
  /**
 * A string which is sent to the  `play`  icon of the player controls. This can be
anything that is accepted by   . This will be temporarily replaced by
the  pauseIcon   when the
 paused   boolean is  `true` .
 */
  playIcon?: string;
  /**
   * Disables the media "play"/"pause" button.
   */
  playPauseButtonDisabled?: boolean;
  /**
   * Disables the media playback-rate control buttons; the inner pair.
   */
  rateButtonsDisabled?: boolean;
  /**
   * These components are placed into the slot to the right of the media controls.
   */
  rightComponents?: React.ReactNode;
  /**
   * `true`  controls are disabled from Spotlight.
   */
  spotlightDisabled?: boolean;
  /**
   * The spotlight ID for the media controls container.
   */
  spotlightId?: string;
  /**
   * The visibility of the component. When  `false` , the component will be hidden.
   */
  visible?: boolean;
}
/**
 * A set of components for controlling media playback and rendering additional components.
 * 
 * This uses  Slottable   to accept the custom tags,  `<leftComponents>` 
and  `<rightComponents>` , to add components to the left and right of the media
controls. Any additional children will be rendered into the "more" controls area causing the
"more" button to appear. Showing the additional components is handled by  `MediaControls`  when the
user taps the "more" button.
 */

export class MediaControls extends React.Component<
  MediaControlsProps & React.HTMLProps<HTMLElement>
> {}

/**
 * Every callback sent by  VideoPlayer   receives a status package,
which includes an object with the following key/value pairs as the first argument:
 */
export interface videoStatus {
  /**
   * Type of event that triggered this callback
   */
  type: string
  /**
   * Playback index of the media in seconds
   */;
  currentTime: number
  /**
   * Media's entire duration in seconds
   */;
  duration: number
  /**
   * Playing vs paused state.  `true`  means the media is paused
   */;
  paused: boolean
  /**
   * Current playback rate, as a number
   */;
  playbackRate: number
  /**
   * A value between  `0`  and  `1`  representing the proportion of the media that has loaded
   */;
  proportionLoaded: number
  /**
   * A value between  `0`  and  `1`  representing the proportion of the media that has already been shown
   */;
  proportionPlayed: number;
}
/**
 * A set of playback rates when media fast forwards, rewinds, slow-fowards, or slow-rewinds.
 * 
 * The number used for each operation is proportional to the normal playing speed, 1. If the rate
is less than 1, it will play slower than normal speed, and, if it is larger than 1, it will play
faster. If it is negative, it will play backward.
 * 
 * The order of numbers represents the incremental order of rates that will be used for each
operation. Note that all rates are expressed as strings and fractions are used rather than decimals
(e.g.:  `'1/2'` , not  `'0.5'` ).
 */
export interface playbackRateHash {
  /**
   * An array of playback rates when media fast forwards
   */
  fastForward: string[]
  /**
   * An array of playback rates when media rewinds
   */;
  rewind: string[]
  /**
   * An array of playback rates when media slow-forwards
   */;
  slowForward: string[]
  /**
   * An array of playback rates when media slow-rewinds
   */;
  slowRewind: string[];
}
export interface VideoPlayerBaseProps {
  /**
   * The time (in milliseconds) before the control buttons will hide.
   *
   * Setting this to 0 or  `null`  disables closing, requiring user input to open and close.
   */
  autoCloseTimeout?: number;
  /**
 * Removes interactive capability from this component. This includes, but is not limited to,
key-press events, most clickable buttons, and prevents the showing of the controls.
 */
  disabled?: boolean;
  /**
 * Amount of time (in milliseconds) after which the feedback text/icon part of the slider's
tooltip will automatically hidden after the last action.
Setting this to 0 or  `null`  disables feedbackHideDelay; feedback will always be present.
 */
  feedbackHideDelay?: number;
  /**
 * Components placed below the title.
 * 
 * Typically these will be media descriptor icons, like how many audio channels, what codec
the video uses, but can also be a description for the video or anything else that seems
appropriate to provide information about the video to the user.
 */
  infoComponents?: React.ReactNode;
  /**
 * The number of seconds the player should skip forward or backward when a "jump" button is
pressed.
 */
  jumpBy?: number;
  /**
 * Manually set the loading state of the media, in case you have information that
 `VideoPlayer`  does not have.
 */
  loading?: boolean;
  /**
 * The current locale as a
  .
 */
  locale?: string;
  /**
   * Overrides the default media control component to support customized behaviors.
   *
   * The provided component will receive the following props from  `VideoPlayer` :
   * *  `mediaDisabled`  -  `true`  when the media controls are not interactive
   * *  `onBackwardButtonClick`  - Called when the rewind button is pressed
   * *  `onClose`  - Called when cancel key is pressed when the media controls are visible
   * *  `onFastForward`  - Called when the media is fast forwarded via a key event
   * *  `onForwardButtonClick`  - Called when the fast forward button is pressed
   * *  `onJump`  - Called when the media jumps either forward or backward
   * *  `onJumpBackwardButtonClick`  - Called when the jump backward button is pressed
   * *  `onJumpForwardButtonClick`  - Called when the jump forward button is pressed
   * *  `onKeyDown`  - Called when a key is pressed
   * *  `onPause`  - Called when the media is paused via a key event
   * *  `onPlay`  - Called when the media is played via a key event
   * *  `onRewind`  - Called when the media is rewound via a key event
   * *  `onToggleMore`  - Called when the more components are hidden or shown
   * *  `paused`  -  `true`  when the media is paused
   * *  `spotlightId`  - The spotlight container Id for the media controls
   * *  `spotlightDisabled`  -  `true`  when spotlight is disabled for the media controls
   * *  `visible`  -  `true`  when the media controls should be displayed
   */
  mediaControlsComponent?: React.ComponentType | JSX.Element;
  /**
 * Amount of time (in milliseconds), after the last user action, that the  `miniFeedback` 
will automatically hide.
Setting this to 0 or  `null`  disables  `miniFeedbackHideDelay` ;  `miniFeedback`  will always
be present.
 */
  miniFeedbackHideDelay?: number;
  /**
 * Disable audio for this video.
 * 
 * In a TV context, this is handled by the remote control, not programmatically in the
VideoPlayer API.
 */
  muted?: boolean;
  /**
   * Prevents the default behavior of playing a video immediately after it's loaded.
   */
  noAutoPlay?: boolean;
  /**
   * Prevents the default behavior of showing media controls immediately after it's loaded.
   */
  noAutoShowMediaControls?: boolean;
  /**
   * Hides media slider feedback when fast forward or rewind while media controls are hidden.
   */
  noMediaSliderFeedback?: boolean;
  /**
   * Removes the mini feedback.
   */
  noMiniFeedback?: boolean;
  /**
   * Removes the media slider.
   */
  noSlider?: boolean;
  /**
   * Removes spinner while loading.
   */
  noSpinner?: boolean;
  /**
 * Called when the player's controls change availability, whether they are shown
or hidden.
 * 
 * The current status is sent as the first argument in an object with a key  `available` 
which will be either  `true`  or  `false` . (e.g.:  `onControlsAvailable({available: true})` )
 */
  onControlsAvailable?: Function;
  /**
   * Called when the video is fast forwarded.
   */
  onFastForward?: Function;
  /**
   * Called when the user clicks the JumpBackward button.
   *
   * Is passed a    as the first argument.
   */
  onJumpBackward?: Function;
  /**
   * Called when the user clicks the JumpForward button.
   *
   * Is passed a    as the first argument.
   */
  onJumpForward?: Function;
  /**
   * Called when video is paused
   */
  onPause?: Function;
  /**
   * Called when video is played
   */
  onPlay?: Function;
  /**
   * Called when video is rewound.
   */
  onRewind?: Function;
  /**
 * Called when the user is moving the VideoPlayer's Slider knob independently of
the current playback position.
 * 
 * It is passed an object with a  `seconds`  key (float value) to indicate the current time
index. It can be used to update the  `thumbnailSrc`  to the reflect the current scrub
position.
 */
  onScrub?: Function;
  /**
   * Called when seek is attempted while  `seekDisabled`  is true.
   */
  onSeekFailed?: Function;
  /**
 * Called when seeking outside of the current  `selection`  range.
 * 
 * By default, the seek will still be performed. Calling  `preventDefault()`  on the event
will prevent the seek operation.
 */
  onSeekOutsideSelection?: Function;
  /**
 * Pauses the video when it reaches either the start or the end of the video during rewind,
slow rewind, fast forward, or slow forward.
 */
  pauseAtEnd?: boolean;
  /**
   * Mapping of playback rate names to playback rate values that may be set.
   */
  playbackRateHash?: playbackRateHash;
  /**
   * Disables seek function.
   *
   * Note that jump by arrow keys will also be disabled when  `true` .
   */
  seekDisabled?: boolean;
  /**
 * A range of the video to display as selected.
 * 
 * The value of  `selection`  may either be:
 * *  `null`  or  `undefined`  for no selection,
 * *  a single-element array with the start time of the selection
 * *  a two-element array containing both the start and end time of the selection in seconds
 * 
 * When the start time is specified, the media slider will show filled starting at that
time to the current time.
 * 
 * When the end time is specified, the slider's background will be filled between the two
times.
 */
  selection?: number[];
  /**
 * The video source.
 * 
 * Any children  `<source>`  tag elements of  VideoPlayer   will
be sent directly to the  `videoComponent`  as video sources.
 */
  source?: React.ReactNode;
  /**
   * Disables spotlight navigation into the component.
   */
  spotlightDisabled?: boolean;
  /**
   * The spotlight container ID for the player.
   */
  spotlightId?: string;
  /**
 * The thumbnail component to be used instead of the built-in version.
 * 
 * The internal thumbnail style will not be applied to this component. This component
follows the same rules as the built-in version.
 */
  thumbnailComponent?: string | React.ComponentType | JSX.Element;
  /**
 * Thumbnail image source to show on the slider knob.
 * 
 * This is a standard    component so it supports all of the same
options for the  `src`  property. If no  `thumbnailComponent`  and no  `thumbnailSrc`  is set,
no tooltip will display.
 */
  thumbnailSrc?: string | object;
  /**
   * Enables the thumbnail transition from opaque to translucent.
   */
  thumbnailUnavailable?: boolean;
  /**
   * Title for the video being played.
   */
  title?: React.ReactNode;
  /**
   * The time (in milliseconds) before the title disappears from the controls.
   *
   * Setting this to  `0`  disables hiding.
   */
  titleHideDelay?: number;
  /**
 * Video component to use.
 * 
 * The default renders an  `HTMLVideoElement` . Custom video components must have a similar
API structure, exposing the following APIs:
 * 
 * Properties:
 * *  `currentTime`  {Number} - Playback index of the media in seconds
 * *  `duration`  {Number} - Media's entire duration in seconds
 * *  `error`  {Boolean} -  `true`  if video playback has errored.
 * *  `loading`  {Boolean} -  `true`  if video playback is loading.
 * *  `paused`  {Boolean} - Playing vs paused state.  `true`  means the media is paused
 * *  `playbackRate`  {Number} - Current playback rate, as a number
 * *  `proportionLoaded`  {Number} - A value between  `0`  and  `1` 
representing the proportion of the media that has loaded
 * *  `proportionPlayed`  {Number} - A value between  `0`  and  `1`  representing the
proportion of the media that has already been shown
 * 
 * Events:
 * *  `onLoadStart`  - Called when the video starts to load
 * *  `onUpdate`  - Sent when any of the properties were updated
 * 
 * Methods:
 * *  `play()`  - play video
 * *  `pause()`  - pause video
 * *  `load()`  - load video
 * 
 * The  `source`   property is passed to
the video component as a child node.
 */
  videoComponent?: React.ComponentType | JSX.Element;
}
/**
 * A player for video   .
 */

export class VideoPlayerBase extends React.Component<
  VideoPlayerBaseProps & React.HTMLProps<HTMLElement>
> {
  /**
   * Shows media controls.
   */
  showControls(): void;
  /**
   * Hides media controls.
   */
  hideControls(): void;
  /**
   * Toggles the media controls.
   */
  toggleControls(): void;
  /**
 * Returns an object with the current state of the media including  `currentTime` ,  `duration` ,
 `paused` ,  `playbackRate` ,  `proportionLoaded` , and  `proportionPlayed` .
 */
  getMediaState(): object;
  /**
   * Programmatically plays the current media.
   */
  play(): void;
  /**
   * Programmatically plays the current media.
   */
  pause(): void;
  /**
   * Set the media playback time index
   */
  seek(timeIndex: number): void;
  /**
 * Step a given amount of time away from the current playback position.
Like  seek   but relative.
 */
  jump(distance: number): void;
  /**
   * Changes the playback speed via  selectPlaybackRate()  .
   */
  fastForward(): void;
  /**
   * Changes the playback speed via  selectPlaybackRate()  .
   */
  rewind(): void;
  /**
   * Returns a proxy to the underlying  `<video>`  node currently used by the VideoPlayer
   */
  getVideoNode(): void;
}

export interface VideoPlayerProps extends ui_Slottable_SlottableProps {}
/**
 * A standard HTML5 video player for Moonstone. It behaves, responds to, and operates like a
 `<video>`  tag in its support for  `<source>` .  It also accepts custom tags such as
 `<infoComponents>`  for displaying additional information in the title area and  `<MediaControls>` 
for handling media playback controls and adding more controls.
 * 
 * Example usage:
 * ```
<VideoPlayer title="Hilarious Cat Video" poster="http://my.cat.videos/boots-poster.jpg">
	<source src="http://my.cat.videos/boots.mp4" type="video/mp4" />
	<infoComponents>A video about my cat Boots, wearing boots.</infoComponents>
	<MediaControls>
		<leftComponents><IconButton backgroundOpacity="translucent">star</IconButton></leftComponents>
		<rightComponents><IconButton backgroundOpacity="translucent">flag</IconButton></rightComponents>

		<Button backgroundOpacity="translucent">Add To Favorites</Button>
		<IconButton backgroundOpacity="translucent">search</IconButton>
	</MediaControls>
</VideoPlayer>
```
 
 * To invoke methods (e.g.:  `fastForward()` ) or get the current state ( `getMediaState()` ), store a
ref to the  `VideoPlayer`  within your component:
 * ```
	...

	setVideoPlayer = (node) => {
		this.videoPlayer = node;
	}

	play () {
		this.videoPlayer.play();
	}

	render () {
		return (
			<VideoPlayer ref={this.setVideoPlayer} />
		);
	}
```
 */

export class VideoPlayer extends React.Component<
  VideoPlayerProps & React.HTMLProps<HTMLElement>
> {}

export default VideoPlayer;
