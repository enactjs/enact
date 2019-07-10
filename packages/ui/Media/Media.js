/**
 * A representation of `HTMLMediaElement` component with an ability to attach a custom event
 * handler.
 *
 * @module ui/Media
 * @exports	getKeyFromSource
 * @exports	handledMediaEventsMap
 * @exports	Media
 */

import {on, off} from '@enact/core/dispatcher';
import {forward} from '@enact/core/handle';
import EnactPropTypes from '@enact/core/internal/prop-types';
import ForwardRef from '@enact/ui/ForwardRef';
import Slottable from '@enact/ui/Slottable';
import compose from 'ramda/src/compose';
import PropTypes from 'prop-types';
import React from 'react';

import css from './Media.module.less';

/**
 * Generates a key representing the source node or nodes provided
 *
 * Example:
 * ```
 * getKeyFromSource('path/file.mp4'); // 'path/file.mp4'
 * getKeyFromSource(
 * 	<source src="path/file.mp4" type="video/mp4" />
 * ); // 'path/file.mp4'
 * getKeyFromSource([
 * 	<source src="path/file.mp4" type="video/mp4" />,
 * 	<source src="path/file.ogg" type="video/ogg" />,
 * ]); // 'path/file.mp4+path/file.ogg'
 * ```
 *
 * @function
 * @param   {String|Element|Element[]} source URI for a source, `<source>` node, or array of
 *                                     `<source>` nodes
 * @returns {String}                   Key representing sources
 * @memberof ui/Media
 * @public
 */
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
 * Maps standard media event `type` values to React-style callback prop names
 *
 * See https://reactjs.org/docs/events.html#media-events
 *
 * ```
 * {
 *   abort           : 'onAbort',
 *   canplay         : 'onCanPlay',
 *   canplaythrough  : 'onCanPlayThrough',
 *   durationchange  : 'onDurationChange',
 *   emptied         : 'onEmptied',
 *   encrypted       : 'onEncrypted',
 *   ended           : 'onEnded',
 *   error           : 'onError',
 *   loadeddata      : 'onLoadedData',
 *   loadedmetadata  : 'onLoadedMetadata',
 *   loadstart       : 'onLoadStart',
 *   pause           : 'onPause',
 *   play            : 'onPlay',
 *   playing         : 'onPlaying',
 *   progress        : 'onProgress',
 *   ratechange      : 'onRateChange',
 *   seeked          : 'onSeeked',
 *   seeking         : 'onSeeking',
 *   stalled         : 'onStalled',
 *   suspend         : 'onSuspend',
 *   timeupdate      : 'onTimeUpdate',
 *   volumechange    : 'onVolumeChange',
 *   waiting         : 'onWaiting'
 * }
 * ```
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
 * A component representation of HTMLMediaElement.
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
		 * @type {String|Component}
		 * @required
		 * @public
		 */
		mediaComponent: EnactPropTypes.renderable.isRequired,

		/**
		 * An event map object for custom media events.
		 *
		 * List custom events that aren't standard to React. These will be directly added to the media
		 * element and props matching their name will be executed as callback functions when the event fires.
		 *
		 * Example:
		 * ```
		 * {'umsmediainfo': 'onUMSMediaInfo'} // `onUMSMediaInfo` prop function will execute when the `umsmediainfo` event happens
		 * ```
		 *
		 * @type {Object}
		 * @public
		 */
		customMediaEventsMap: PropTypes.object,

		/**
		 * A event map object for media events.
		 *
		 * @type {Object}
		 * @default {@link ui/Media.handledMediaEventsMap}
		 * @public
		 */
		mediaEventsMap: PropTypes.object,

		/**
		 * A function to be run when media updates.
		 *
		 * @type {Function}
		 * @public
		 */
		onUpdate: PropTypes.func,

		/**
		 * Media sources passed as children to `mediaComponent`
		 *
		 * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source
		 *
		 * @type {*}
		 * @public
		 */
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

	componentDidUpdate ({source: prevSource}) {
		const {source} = this.props;

		if (getKeyFromSource(source) !== getKeyFromSource(prevSource)) {
			this.load();
		}
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

	get error () {
		return this.media.networkState === this.media.NETWORK_NO_SOURCE;
	}

	get loading () {
		return this.media.readyState < this.media.HAVE_ENOUGH_DATA;
	}

	get paused () {
		return this.media.paused;
	}

	get playbackRate () {
		return this.media.playbackRate;
	}

	set playbackRate (playbackRate) {
		this.media.playbackRate = playbackRate;
	}

	get proportionLoaded () {
		return this.media.buffered.length && this.media.buffered.end(this.media.buffered.length - 1) / this.media.duration;
	}

	get proportionPlayed () {
		return this.media.currentTime / this.media.duration;
	}

	render () {
		const {customMediaEventsMap, mediaComponent: Component, source, ...rest} = this.props;

		delete rest.mediaEventsMap;
		delete rest.onUpdate;

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

/**
 * Adds support for preloading a media source for `Video` or `Audio`.
 *
 * @class MediaBase
 * @memberof ui/Media
 * @ui
 * @private
 */
const MediaBase = class extends React.Component {
	static displayName = 'MediaBase'

	static propTypes = /** @lends ui/MediaBase.prototype */ {
		/**
		 * Media plays automatically.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		autoPlay: PropTypes.bool,

		/**
		 * Media component to use.
		 *
		 * The default (`'video'`) renders an `HTMLVideoElement`. Custom video components must have
		 * a similar API structure, exposing the following APIs:
		 *
		 * Properties:
		 * * `currentTime` {Number} - Playback index of the media in seconds
		 * * `duration` {Number} - Media's entire duration in seconds
		 * * `error` {Boolean} - `true` if video playback has errored.
		 * * `loading` {Boolean} - `true` if video playback is loading.
		 * * `paused` {Boolean} - Playing vs paused state. `true` means the media is paused
		 * * `playbackRate` {Number} - Current playback rate, as a number
		 * * `proportionLoaded` {Number} - A value between `0` and `1`
		 *	representing the proportion of the media that has loaded
		 * * `proportionPlayed` {Number} - A value between `0` and `1` representing the
		 *	proportion of the media that has already been shown
		 *
		 * Events:
		 * * `onLoadStart` - Called when the video starts to load
		 * * `onPlay` - Sent when playback of the media starts after having been paused
		 * * `onUpdate` - Sent when any of the properties were updated
		 *
		 * Methods:
		 * * `play()` - play video
		 * * `pause()` - pause video
		 * * `load()` - load video
		 *
		 * The [`source`]{@link ui/Video.MediaBase.source} property is passed to
		 * the video component as a child node.
		 *
		 * @type {String|Component|Element}
		 * @default 'video'
		 * @public
		 */
		mediaComponent: EnactPropTypes.renderableOverride,

		/**
		 * The media source to be preloaded. Expects a `<source>` node.
		 *
		 * @type {Node}
		 * @public
		 */
		preloadSource:  PropTypes.node,

		/**
		 * Called with a reference to the active [Media]{@link ui/Media.Media} component.
		 *
		 * @type {Function}
		 * @private
		 */
		setMedia: PropTypes.func,

		/**
		 * The media source to be played.
		 *
		 * Any children `<source>` elements will be sent directly to the `mediaComponent` as video
		 * sources.
		 *
		 * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source
		 *
		 * @type {Node}
		 * @public
		 */
		source: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
	}

	static defaultProps = {
		mediaComponent: 'video'
	}

	componentDidUpdate (prevProps) {
		const {source, preloadSource} = this.props;
		const {source: prevSource, preloadSource: prevPreloadSource} = prevProps;

		const key = getKeyFromSource(source);
		const prevKey = getKeyFromSource(prevSource);
		const preloadKey = getKeyFromSource(preloadSource);
		const prevPreloadKey = getKeyFromSource(prevPreloadSource);

		if (this.props.setMedia !== prevProps.setMedia) {
			this.clearMedia(prevProps);
			this.setMedia();
		}

		if (source) {
			if (key === prevPreloadKey && preloadKey !== prevPreloadKey) {
				// if there's source and it was the preload source

				// if the preloaded video didn't error, notify Video it is ready to reset
				if (this.preloadLoadStart) {
					forward('onLoadStart', this.preloadLoadStart, this.props);
				}

				// emit onUpdate to give Video an opportunity to updates its internal state
				// since it won't receive the onLoadStart or onError event
				forward('onUpdate', {type: 'onUpdate'}, this.props);

				this.autoPlay();
			} else if (key !== prevKey) {
				// if there's source and it has changed.
				this.autoPlay();
			}
		}

		if (preloadSource && preloadKey !== prevPreloadKey) {
			this.preloadLoadStart = null;

			// In the case that the previous source equalled the previous preload (causing the
			// preload video node to not be created) and then the preload source was changed, we
			// need to guard against accessing the preloadVideo node.
			if (this.preloadVideo) {
				this.preloadVideo.load();
			}
		}
	}

	componentWillUnmount () {
		this.clearMedia();
	}

	handlePreloadLoadStart = (ev) => {
		// persist the event so we can cache it to re-emit when the preload becomes active
		ev.persist();
		this.preloadLoadStart = ev;

		// prevent the from bubbling to upstream handlers
		ev.stopPropagation();
	}

	clearMedia ({setMedia} = this.props) {
		if (setMedia) {
			setMedia(null);
		}
	}

	setMedia ({setMedia} = this.props) {
		if (setMedia) {
			setMedia(this.video);
		}
	}

	autoPlay () {
		if (!this.props.autoPlay) return;

		this.video.play();
	}

	setVideoRef = (node) => {
		this.video = node;
		this.setMedia();
	}

	setPreloadRef = (node) => {
		if (node) {
			node.load();
		}
		this.preloadVideo = node;
	}

	render () {
		const {
			preloadSource,
			source,
			mediaComponent,
			...rest
		} = this.props;

		delete rest.setMedia;

		const sourceKey = getKeyFromSource(source);
		let preloadKey = getKeyFromSource(preloadSource);

		// prevent duplicate components by suppressing preload when sources are the same
		if (sourceKey === preloadKey) {
			preloadKey = null;
		}

		return (
			<React.Fragment>
				{sourceKey ? (
					<Media
						{...rest}
						className={css.media}
						controls={false}
						key={sourceKey}
						mediaComponent={mediaComponent}
						preload="none"
						ref={this.setVideoRef}
						source={React.isValidElement(source) ? source : (
							<source src={source} />
						)}
					/>
				) : null}
				{preloadKey ? (
					<Media
						autoPlay={false}
						className={css.preloadMedia}
						controls={false}
						key={preloadKey}
						mediaComponent={mediaComponent}
						onLoadStart={this.handlePreloadLoadStart}
						preload="none"
						ref={this.setPreloadRef}
						source={React.isValidElement(preloadSource) ? preloadSource : (
							<source src={preloadSource} />
						)}
					/>
				) : null}
			</React.Fragment>
		);
	}
};

const MediaDecorator = compose(
	ForwardRef({prop: 'setMedia'}),
	Slottable({slots: ['source', 'preloadSource']})
);

export default Media;
export {
	getKeyFromSource,
	handledMediaEventsMap,
	Media,
	MediaBase,
	MediaDecorator
};
