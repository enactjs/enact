import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Pure from '@enact/ui/internal/Pure';
import {compareSources} from '@enact/moonstone/VideoPlayer/util';
import Media from '@enact/ui/Media';
import Slottable from '@enact/ui/Slottable';
import Spottable from '@enact/spotlight/Spottable';

import Image from '../Image';
import Skinnable from '../Skinnable';
import {MarqueeController, Marquee} from '../Marquee';

import css from './PictureInGraphics.less';

const defaultPlaceholder =
	'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
	'9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
	'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
	'4NCg==';

class PictureInGraphicsBase extends React.Component {
	static propTypes = {
		/**
		 * Any children `<source>` tag elements will
		 * be sent directly to the `<video>` element as video sources.
		 *
		 * @type {Node}
		 * @public
		 */
		source: PropTypes.node.isRequired,

		/**
		 * Image path for image overlay
		 *
		 * @type {String}
		 * @public
		 */
		imageOverlaySrc: PropTypes.string,

		/**
		 * By default, the video will start playing immediately after it's loaded, unless this is set.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoPlay: PropTypes.bool,

		/**
		 * Placeholder for image overlay
		 *
		 * @type {String}
		 * @public
		 */
		placeholder: PropTypes.string,

		/**
		 * Font color of text overlay. It is a hexadecimal string.
		 *
		 * @type {String}
		 * @public
		 */
		textOverlayColor: PropTypes.string,

		/**
		 * Text of text overlay
		 *
		 * @type {String}
		 * @public
		 */
		textOverlayContent: PropTypes.string,

		/**
		 * Video component to use. The default (`'video'`) renders an `HTMLVideoElement`. Custom
		 * video components must have a similar API structure, exposing the following APIs:
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
		 * Methods:
		 * * `play()` - play video
		 * * `pause()` - pause video
		 * * `load()` - load video
		 *
		 * @type {Component}
		 * @default 'video'
		 * @public
		 */
		videoComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
	}

	static defaultProps = {
		placeholder: defaultPlaceholder,
		videoComponent: 'video'
	}

	constructor (props) {
		super(props);
		this.video = null;
	}

	componentDidMount () {
		this.video.load();
	}

	componentDidUpdate (prevProps) {
		const {source} = this.props;
		const {source: prevSource} = prevProps;

		if (!compareSources(source, prevSource)) {
			this.video.load();
		}
	}

	setVideoRef = (video) => {
		this.video = video;
	}

	render () {
		const {
			className,
			source,
			placeholder,
			imageOverlaySrc,
			textOverlayContent,
			textOverlayColor,
			videoComponent,
			noAutoPlay,
			...rest} = this.props;

		const containerClassName = classNames(className, css.pictureInGraphics);
		const textOverlayStyle = {color: textOverlayColor};

		return (
			<div {...rest} className={containerClassName} >
				<Media
					{...rest}
					autoPlay={!noAutoPlay}
					className={css.video}
					component={videoComponent}
					controls={false}
					ref={this.setVideoRef}
				>
					{source}
				</Media>
				{imageOverlaySrc ? <Image placeholder={placeholder} className={css.image} src={imageOverlaySrc} /> : null}
				{textOverlayContent ? (<Marquee alignment="center" className={css.textOverlay} style={textOverlayStyle}>{textOverlayContent}</Marquee>) : null}
			</div>
		);
	}
}

const PictureInGraphics = Pure(
	MarqueeController({marqueeOnFocus: true},
		Spottable(
			Slottable(
				{slots: ['source']},
				Skinnable(
					PictureInGraphicsBase
				)
			)
		)
	)
);

export default PictureInGraphics;
export {PictureInGraphics, PictureInGraphicsBase};
