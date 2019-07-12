import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import EnactPropTypes from '@enact/core/internal/prop-types';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import ForwardRef from '../ForwardRef';
import Slottable from '../Slottable';

import {getKeyFromSource} from './utils';

import css from './Media.module.less';

/**
 * Adds support for preloading a media source for `Video` or `Audio`.
 *
 * @class MediaBase
 * @memberof ui/Media
 * @ui
 * @private
 */
const PreloadSupport = hoc((config, Wrapped) => class extends React.Component {
	static displayName = 'PreloadSupport'

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
					<Wrapped
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
					<Wrapped
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
});

const PreloadDecorator = compose(
	ForwardRef({prop: 'setMedia'}),
	Slottable({slots: ['source', 'preloadSource']}),
	PreloadSupport
);

export default PreloadDecorator;
export {
	PreloadDecorator
};
