/**
 * Provides a represetation of HTMLMediaElement component with an ability to attach a custom event
 * handler.
 *
 * @module ui/Media
 * @exports handledMediaEventsMap
 * @exports readyState
 * @exports Media
 */

import React from 'react';
import PropTypes from 'prop-types';
import {forward} from '@enact/core/handle';
import {on, off} from '@enact/core/dispatcher';

import readyState from './readyState';

/**
 * Event forwarding map for all of the supported media events. See https://reactjs.org/docs/events.html#media-events
 *
 * @typedef {Object} handledMediaEventsMap
 * @memberof ui/Media
 * @public
 */
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

/**
 * {@link ui/Media.Media} is a class representation of HTMLMediaElement.
 *
 * @class Media
 * @memberof ui/Media
 * @ui
 * @public
 */
class Media extends React.Component {
	static propTypes = /** @lends ui/Media.Media.prototype */ {
		/**
		 * A type of media component.
		 *
		 * @type {Component}
		 * @required
		 * @public
		 */
		component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,

		/**
		 * A event map object for custom media events. List custom events that aren't standard to
		 * React. These will be directly added to the media element and props matching their name
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
		 * A event map object for media events.
		 *
		 * @type {Object}
		 * @public
		 * @default {@link ui/Media.handledMediaEventsMap}
		 */
		mediaEventsMap: PropTypes.object,

		/**
		 * A function to be run when media is updated.
		 *
		 * The event will include the following properties:
		 *
		 * A set of standard HTMLMediaElement properties
		 * * currentTime
		 * * duration
		 * * buffered
		 * * paused
		 * * muted
		 * * volume
		 * * playbackRate
		 * * readyState
		 *
		 * Non-standard computed properties
		 * * proportionLoaded
		 * * proportionPlayed
		 * * error
		 * * loading
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
			on(eventName, this.handledCustomMediaForwards[eventName], this.media);
		}
	}

	detachCustomMediaEvents = () => {
		for (let eventName in this.handledCustomMediaForwards) {
			off(eventName, this.handledCustomMediaForwards[eventName], this.media);
		}
	}

	handleEvent = (ev) => {
		const updatedState = {
			// Standard media properties
			currentTime: this.media.currentTime,
			duration: this.media.duration,
			buffered: this.media.buffered,
			paused: this.media.playbackRate !== 1 || this.media.paused,
			muted: this.media.muted,
			volume: this.media.volume,
			playbackRate: this.media.playbackRate,
			readyState: this.media.readyState,

			// Non-standard state computed from properties
			proportionLoaded: this.media.buffered.length && this.media.buffered.end(this.media.buffered.length - 1) / this.media.duration,
			proportionPlayed: this.media.currentTime / this.media.duration || 0,
			error: this.media.networkState === this.media.NETWORK_NO_SOURCE,
			loading: this.media.readyState < this.media.HAVE_ENOUGH_DATA
		};

		forward('onUpdate', {...ev, mediaStates: updatedState}, this.props);
	}

	mediaRef = (node) => {
		this.media = node;
	}

	play = () => {
		this.media.play();
	}

	pause = () => {
		this.media.pause();
	}

	load = () => {
		this.media.load();
	}

	get currentTime ()  {
		return this.media.currentTime;
	}

	set currentTime (currentTime) {
		this.media.currentTime = currentTime;
	}

	get duration () {
		return this.media.duration;
	}

	get playbackRate () {
		return this.media.playbackRate;
	}

	set playbackRate (playbackRate) {
		// ReactDOM throws error for setting negative value for playbackRate
		this.media.playbackRate = playbackRate < 0 ? 0 : playbackRate;
	}

	render () {
		const props = Object.assign({}, this.props);
		delete props.mediaEventsMap;
		delete props.onUpdate;

		const {customMediaEventsMap, component: Component, ...rest} = props;
		// Remove the events we manually added so they aren't added twice or fail.
		for (let eventName in customMediaEventsMap) {
			delete rest[customMediaEventsMap[eventName]];
		}

		return (
			<Component
				{...rest}
				ref={this.mediaRef}
				{...this.handledMediaEvents}
			/>
		);
	}
}

export default Media;
export {
	handledMediaEventsMap,
	readyState,
	Media
};
