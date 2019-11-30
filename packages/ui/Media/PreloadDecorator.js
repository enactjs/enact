import classNames from 'classnames';
import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import ForwardRef from '../ForwardRef';
import Slottable from '../Slottable';

import {getKeyFromSource} from './utils';

import css from './Media.module.less';

const PreloadSupport = hoc((config, Wrapped) => class extends React.Component {
	static displayName = 'PreloadSupport'

	static propTypes = /** @lends ui/Media.PreloadDecorator.prototype */ {
		/**
		 * Media plays automatically.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		autoPlay: PropTypes.bool,

		/**
		 * The media source to be preloaded.
		 *
		 * Expects a [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source)
		 * node.
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
		 * Expects a [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source)
		 * node.
		 *
		 * @type {Node}
		 * @public
		 */
		source: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
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
			setMedia(this.media);
		}
	}

	autoPlay () {
		if (!this.props.autoPlay) return;

		this.media.play();
	}

	setVideoRef = (node) => {
		this.media = node;
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
			className,
			preloadSource,
			source,
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
						className={classNames(className, css.media)}
						controls={false}
						key={sourceKey}
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

/**
 * Adds support for preloading a media source for `Video` or `Audio`.
 *
 * The wrapped component must support the following API:
 *
 * Properties:
 * * `currentTime` {Number} - Playback index of the media in seconds
 * * `duration` {Number} - Media's entire duration in seconds
 * * `error` {Boolean} - `true` if media playback has errored.
 * * `loading` {Boolean} - `true` if media playback is loading.
 * * `paused` {Boolean} - Playing vs paused state. `true` means the media is paused
 * * `playbackRate` {Number} - Current playback rate, as a number
 * * `proportionLoaded` {Number} - A value between `0` and `1` representing the proportion of the
 *   media that has loaded
 * * `proportionPlayed` {Number} - A value between `0` and `1` representing the proportion of the
 *   media that has already been shown
 *
 * Events:
 * * `onLoadStart` - Called when the media starts to load
 * * `onPlay` - Sent when playback of the media starts after having been paused
 * * `onUpdate` - Sent when any of the properties were updated
 *
 * Methods:
 * * `play()` - play media
 * * `pause()` - pause media
 * * `load()` - load media
 *
 * Example:
 * ```
 * const MyVideo = PreloadDecorator(Video);
 *
 * <MyVideo>
 *   <source src="path/to/source.mp4" />
 *   <source src="path/to/preload-source.mp4" slot="preloadSource" />
 * </MyVideo>
 * ```
 *
 * @class PreloadDecorator
 * @memberof ui/Media
 * @ui
 * @private
 */
const PreloadDecorator = compose(
	ForwardRef({prop: 'setMedia'}),
	Slottable({slots: ['source', 'preloadSource']}),
	PreloadSupport
);

export default PreloadDecorator;
export {
	PreloadDecorator
};
