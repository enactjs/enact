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
		 * A function to be run when media updates.
		 *
		 * @type {Function}
		 * @public
		 */
		onUpdate: PropTypes.func
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
		forward('onUpdate', ev, this.props);

		// fetch the forward() we generated earlier, using the event type as a key to find the real event name.
		const fwd = this.handledMediaForwards[handledMediaEventsMap[ev.type]];
		if (fwd) {
			fwd(ev, this.props);
		}
	}

	mediaRef = (node) => {
		this.media = node;
	}

	getNode () {
		return this.media;
	}

	play () {
		this.media.play();
	}

	pause () {
		this.media.pause();
	}

	load () {
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
		this.media.playbackRate = playbackRate;
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
