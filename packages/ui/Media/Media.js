/**
 * Provides a represetation of HTMLMediaElement component with an ability to attach a custom event
 * handler.
 *
 * @module ui/Media
 * @private
 */

import React from 'react';
import PropTypes from 'prop-types';
import {forward} from '@enact/core/handle';
import {on, off} from '@enact/core/dispatcher';

const getKeyFromSource = (source = '') => {
	if (React.isValidElement(source)) {
		return React.Children.toArray(source)
			.filter(s => !!s)
			.map(s => s.props.src)
			.join('+');
	}

	return String(source);
};

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
 * @private
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
		mediaComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,

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
		 * A function to be run when media updates.
		 *
		 * @type {Function}
		 * @public
		 */
		onUpdate: PropTypes.func,

		source: PropTypes.any
	}

	static defaultProps = {
		mediaEventsMap: handledMediaEventsMap
	}

	constructor (props) {
		super(props);

		this.media = null;

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
		forward('onUpdate', {type: 'onUpdate'}, this.props);

		// fetch the forward() we generated earlier, using the event type as a key to find the real event name.
		const fwd = this.handledMediaForwards[handledMediaEventsMap[ev.type]];
		if (fwd) {
			fwd(ev, this.props);
		}
	}

	mediaRef = (node) => {
		this.media = node;
	}

	play () {
		if (!this.media) return;
		this.media.play();
	}

	pause () {
		if (!this.media) return;
		this.media.pause();
	}

	load () {
		if (!this.media) return;
		this.media.load();
	}

	get currentTime ()  {
		if (!this.media) return;
		return this.media.currentTime;
	}

	set currentTime (currentTime) {
		if (!this.media) return;
		this.media.currentTime = currentTime;
	}

	get duration () {
		if (!this.media) return;
		return this.media.duration;
	}

	get error () {
		if (!this.media) return;
		return this.media.networkState === this.media.NETWORK_NO_SOURCE;
	}

	get loading () {
		if (!this.media) return;
		return this.media.readyState < this.media.HAVE_ENOUGH_DATA;
	}

	get paused () {
		if (!this.media) return;
		return this.media.paused;
	}

	get playbackRate () {
		if (!this.media) return;
		return this.media.playbackRate;
	}

	set playbackRate (playbackRate) {
		if (!this.media) return;
		this.media.playbackRate = playbackRate;
	}

	get proportionLoaded () {
		if (!this.media) return;
		return this.media.buffered.length && this.media.buffered.end(this.media.buffered.length - 1) / this.media.duration;
	}

	get proportionPlayed () {
		if (!this.media) return;
		return this.media.currentTime / this.media.duration;
	}

	render () {
		const {source, ...props} = this.props;
		delete props.mediaEventsMap;
		delete props.onUpdate;

		const {customMediaEventsMap, mediaComponent: Component, ...rest} = props;
		// Remove the events we manually added so they aren't added twice or fail.
		for (let eventName in customMediaEventsMap) {
			delete rest[customMediaEventsMap[eventName]];
		}

		return (
			<Component
				{...rest}
				{...this.handledMediaEvents}
				ref={this.mediaRef}
			>
				{source}
			</Component>
		);
	}
}

export default Media;
export {
	handledMediaEventsMap,
	Media
};
