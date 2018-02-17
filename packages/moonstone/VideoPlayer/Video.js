import React from 'react';
import PropTypes from 'prop-types';
import {forward} from '@enact/core/handle';
import {on, off} from '@enact/core/dispatcher';

// Set-up event forwarding map. These are all of the supported media events
const handledMediaEventsMap = {
	abort           : 'onAbort',
	canplay         : 'onCanPlay',
	canplaythrough  : 'onCanPlayThrough',
	durationchange  : 'onDurationChange',
	emptied         : 'onEmptied',
	encrypted       : 'onEncrypted',
	ended           : 'onEnded',
	error           : 'onError',
	loadeddata      : 'onLoadedData',
	loadedmetadata  : 'onLoadedMetadata',
	loadstart       : 'onLoadStart',
	pause           : 'onPause',
	play            : 'onPlay',
	playing         : 'onPlaying',
	progress        : 'onProgress',
	ratechange      : 'onRateChange',
	seeked          : 'onSeeked',
	seeking         : 'onSeeking',
	stalled         : 'onStalled',
	suspend         : 'onSuspend',
	timeupdate      : 'onTimeUpdate',
	volumechange    : 'onVolumeChange',
	waiting         : 'onWaiting'
};

class Video extends React.Component {
	static propTypes = /** @lends moonstone/VideoPlayer.Video.prototype */ {
		/**
		 * A event map object for custom media events. List custom events that aren't standard to
		 * React. These will be directly added to the video element and props matching their name
		 * will be executed as callback functions when the event fires.
		 *
		 * Example: {'umsmediainfo': 'onUMSMediaInfo'}
		 * "onUMSMediaInfo" prop function will execute when the "umsmediainfo" event happens.
		 *
		 * @type {Object}
		 * @public
		 */
		customMediaEventsMap: PropTypes.object,

		/**
		 * A event map object for HTML5 video events.
		 *
		 * @type {Object}
		 * @public
		 * @default handledMediaEventsMap
		 */
		mediaEventsMap: PropTypes.object,

		/**
		 * A function to be run when media is updated.
		 *
		 * @type {Function}
		 */
		onUpdate: PropTypes.func
	}

	static defaultProps = {
		mediaEventsMap: handledMediaEventsMap
	}

	constructor (props) {
		super(props);

		this.handledMediaForwards = {};
		this.handledMediaEvents = {};
		this.handledCustomMediaForwards = {};

		// Generate event handling forwarders and a smooth block to pass to <Video>
		for (let key in props.mediaEventsMap) {
			const eventName = props.mediaEventsMap[key];
			this.handledMediaForwards[eventName] = forward(eventName);
			this.handledMediaEvents[eventName] = this.handleEvent;
		}

		// Generate event handling forwarders for the custom events too
		for (let eventName in props.customMediaEventsMap) {
			const propName = props.customMediaEventsMap[eventName];
			const forwardEvent = forward(propName);
			this.handledCustomMediaForwards[eventName] = ev => forwardEvent(ev, this.props);
		}
	}

	componentDidMount () {
		this.attachCustomMediaEvents();
	}

	componentWillUnmount () {
		this.detachCustomMediaEvents();
	}

	attachCustomMediaEvents = () => {
		for (let eventName in this.handledCustomMediaForwards) {
			on(eventName, this.handledCustomMediaForwards[eventName], this.video);
		}
	}

	detachCustomMediaEvents = () => {
		for (let eventName in this.handledCustomMediaForwards) {
			off(eventName, this.handledCustomMediaForwards[eventName], this.video);
		}
	}

	handleEvent = (ev) => {
		const updatedState = {
			// Standard video properties
			currentTime: this.video.currentTime,
			duration: this.video.duration,
			buffered: this.video.buffered,
			paused: this.video.playbackRate !== 1 || this.video.paused,
			muted: this.video.muted,
			volume: this.video.volume,
			playbackRate: this.video.playbackRate,
			readyState: this.video.readyState,

			// Non-standard state computed from properties
			proportionLoaded: this.video.buffered.length && this.video.buffered.end(this.video.buffered.length - 1) / this.video.duration,
			proportionPlayed: this.video.currentTime / this.video.duration || 0,
			error: this.video.networkState === this.video.NETWORK_NO_SOURCE,
			loading: this.video.readyState < this.video.HAVE_ENOUGH_DATA,
			sliderTooltipTime: this.sliderScrubbing ? (this.sliderKnobProportion * this.video.duration) : this.video.currentTime
		};

		forward('onUpdate', {...ev, mediaStates: {...updatedState}}, this.props);

		// fetch the forward() we generated earlier, using the event type as a key to find the real event name.
		const fwd = this.handledMediaForwards[handledMediaEventsMap[ev.type]];
		if (fwd) {
			// TODO: clean this up. we don't want a duplicate of `getMediaState()` here.
			fwd({
				type: ev.type,
				currentTime       : updatedState.currentTime,
				duration          : updatedState.duration,
				paused            : updatedState.paused,
				playbackRate      : updatedState.playbackRate,
				proportionLoaded  : updatedState.proportionLoaded,
				proportionPlayed  : updatedState.proportionPlayed
			}, this.props);
		}
	}

	videoRef = (node) => {
		this.video = node;
	}

	play = () => {
		this.video.play();
	}

	pause = () => {
		this.video.pause();
	}

	load = () => {
		this.video.load();
	}

	get currentTime ()  {
		return this.video.currentTime;
	}

	set currentTime (currentTime) {
		this.video.currentTime = currentTime;
	}

	get duration () {
		return this.video.duration;
	}

	get playbackRate () {
		return this.video.playbackRate;
	}

	set playbackRate (playbackRate) {
		// ReactDOM throws error for setting negative value for playbackRate
		this.video.playbackRate = playbackRate < 0 ? 0 : playbackRate;
	}

	render () {
		const props = Object.assign({}, this.props);
		delete props.mediaEventsMap;
		delete props.onUpdate;

		// Remove the events we manually added so they aren't added twice or fail.
		for (let eventName in props.customMediaEventsMap) {
			delete props[props.customMediaEventsMap[eventName]];
		}
		delete props.customMediaEventsMap;

		return (
			<video
				{...props}
				ref={this.videoRef}
				{...this.handledMediaEvents}
			/>
		);
	}
}

export default Video;
export {
	handledMediaEventsMap,
	Video
};
