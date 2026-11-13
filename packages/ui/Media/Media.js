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
import {forward, forwardCustom} from '@enact/core/handle';
import {checkPropTypes, setDefaultProps} from '@enact/core/util';
import EnactPropTypes from '@enact/core/internal/prop-types';
import PropTypes from 'prop-types';
import {Children, isValidElement, useImperativeHandle, useLayoutEffect, useRef, useState} from 'react';

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
	if (isValidElement(source)) {
		return Children.toArray(source)
			.filter(s => !!s)
			.map(s => s.props.src)
			.join('+');
	}

	return String(source);
};

/**
 * Maps standard media event `type` values to React-style callback prop names
 *
 * See https://react.dev/reference/react-dom/components/common#common-props
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

const mediaDefaultProps = {
	mediaEventsMap: handledMediaEventsMap
};

/**
 * A component representation of HTMLMediaElement.
 *
 * @class Media
 * @memberof ui/Media
 * @ui
 * @public
 */
const Media = (componentProps) => {
	const props = setDefaultProps(componentProps, mediaDefaultProps);
	checkPropTypes(Media, props);

	const {customMediaEventsMap, mediaComponent: Component, mediaEventsMap, ref, source, ...rest} = props;

	delete rest.onUpdate;

	// Remove the events we manually added so they aren't added twice or fail.
	for (const eventName in customMediaEventsMap) {
		delete rest[customMediaEventsMap[eventName]];
	}

	const mediaRef = useRef(null);
	const propsRef = useRef(props);
	const sourceKey = getKeyFromSource(source);
	const prevSourceKey = useRef(sourceKey);

	const [{customForwards, events}] = useState(() => {
		const forwards = {};
		const mediaEvents = {};

		const handleEvent = (ev) => {
			forwardCustom('onUpdate')(null, propsRef.current);

			// fetch the forward() we generated earlier, using the event type as a key to find the real event name.
			const fwd = forwards[handledMediaEventsMap[ev.type]];
			if (fwd) {
				fwd(ev, propsRef.current);
			}
		};

		// Generate event handling forwarders and a smooth block to pass to <Video>
		for (const key in mediaEventsMap) {
			const eventName = mediaEventsMap[key];
			forwards[eventName] = forward(eventName);
			mediaEvents[eventName] = handleEvent;
		}

		// Generate event handling forwarders for the custom events too
		const customHandlers = {};
		for (const eventName in customMediaEventsMap) {
			const propName = customMediaEventsMap[eventName];
			const forwardEvent = forward(propName);
			customHandlers[eventName] = (ev) => forwardEvent(ev, propsRef.current);
		}

		return {customForwards: customHandlers, events: mediaEvents};
	});

	useLayoutEffect(() => {
		propsRef.current = props;
	});

	useLayoutEffect(() => {
		const node = mediaRef.current;

		for (const eventName in customForwards) {
			on(eventName, customForwards[eventName], node);
		}

		return () => {
			for (const eventName in customForwards) {
				off(eventName, customForwards[eventName], node);
			}
		};
	}, [customForwards]);

	useLayoutEffect(() => {
		if (prevSourceKey.current !== sourceKey) {
			prevSourceKey.current = sourceKey;
			mediaRef.current.load();
		}
	}, [sourceKey]);

	useImperativeHandle(ref, () => ({
		play () {
			return mediaRef.current.play();
		},
		pause () {
			mediaRef.current.pause();
		},
		load () {
			mediaRef.current.load();
		},
		get currentTime () {
			return mediaRef.current.currentTime;
		},
		set currentTime (currentTime) {
			mediaRef.current.currentTime = currentTime;
		},
		get duration () {
			return mediaRef.current.duration;
		},
		get error () {
			return mediaRef.current.networkState === mediaRef.current.NETWORK_NO_SOURCE;
		},
		get loading () {
			return mediaRef.current.readyState < mediaRef.current.HAVE_ENOUGH_DATA;
		},
		get paused () {
			return mediaRef.current.paused;
		},
		get playbackRate () {
			return mediaRef.current.playbackRate;
		},
		set playbackRate (playbackRate) {
			mediaRef.current.playbackRate = playbackRate;
		},
		get proportionLoaded () {
			return mediaRef.current.buffered.length && mediaRef.current.buffered.end(mediaRef.current.buffered.length - 1) / mediaRef.current.duration;
		},
		get proportionPlayed () {
			return mediaRef.current.currentTime / mediaRef.current.duration;
		}
	}), []);

	return (
		<Component
			{...rest}
			{...events}
			ref={mediaRef}
		>
			{source}
		</Component>
	);
};

Media.propTypes = /** @lends ui/Media.Media.prototype */ {
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
};

export default Media;
export {
	getKeyFromSource,
	handledMediaEventsMap,
	Media
};
