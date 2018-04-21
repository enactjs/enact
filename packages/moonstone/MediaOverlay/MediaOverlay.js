/**
 * Provides a media component with image and text overlay support.
 *
 * @module moonstone/MediaOverlay
 * @exports MediaOverlay
 * @exports MediaOverlayBase
 * @exports MediaOverlayDecorator
 */

import {compareSources} from '@enact/moonstone/VideoPlayer/util';
import compose from 'ramda/src/compose';
import Media from '@enact/ui/Media';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';
import React from 'react';
import Slottable from '@enact/ui/Slottable';
import Spottable from '@enact/spotlight/Spottable';
import styles from '@enact/core/kind/styles.js';

import Image from '../Image';
import Skinnable from '../Skinnable';
import {MarqueeController, Marquee} from '../Marquee';

import componentCss from './MediaOverlay.less';

const defaultPlaceholder =
	'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
	'9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
	'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
	'4NCg==';

const cfgStyles = {
	css: componentCss,
	className: 'mediaOverlay',
	publicClassNames: ['mediaOverlay', 'text']
};

/**
 * A media component with image and text overlay support.
 *
 * @class MediaOverlayBase
 * @memberof moonstone/MediaOverlay
 * @ui
 * @public
 */
class MediaOverlayBase extends React.Component {
	static propTypes = {
		/**
		 * Any children `<source>` tag elements will be sent directly to the media element as sources.
		 *
		 * @type {Node}
		 * @public
		 */
		source: PropTypes.node.isRequired,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `mediaOverlay` - The root class name
		 * * `text` - class name for `text`
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Image path for image overlay.
		 *
		 * NOTE: When image is displayed, media is not displayed even though it is playing.
		 *
		 * @type {String}
		 * @public
		 */
		imageOverlay: PropTypes.string,

		/**
		 * Media component to use. The default (`'video'`) renders an `HTMLVideoElement`. Custom
		 * media components must have a similar API structure, exposing the following APIs:
		 *
		 * Methods:
		 * * `load()` - load media
		 *
		 * @type {Component}
		 * @default 'video'
		 * @public
		 */
		mediaComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

		/**
		 * Placeholder for image overlay
		 *
		 * @type {String}
		 * @public
		 */
		placeholder: PropTypes.string,

		/**
		 * Text to display over media
		 *
		 * @type {String}
		 * @public
		 */
		text: PropTypes.string
	}

	static defaultProps = {
		placeholder: defaultPlaceholder,
		mediaComponent: 'video'
	}

	constructor (props) {
		super(props);
		this.media = null;
		this.renderStyles = styles(cfgStyles);
	}

	componentDidUpdate (prevProps) {
		const {source} = this.props;
		const {source: prevSource} = prevProps;

		if (!compareSources(source, prevSource)) {
			this.media.load();
		}
	}

	setMediaRef = (media) => {
		this.media = media;
	}

	render () {
		const props = this.renderStyles(Object.assign({}, this.props));

		const {
			css,
			imageOverlay,
			mediaComponent,
			placeholder,
			source,
			text,
			...rest} = props;

		return (
			<div {...rest}>
				<Media
					autoPlay
					className={css.media}
					component={mediaComponent}
					controls={false}
					muted
					ref={this.setMediaRef}
				>
					{source}
				</Media>
				{imageOverlay ? <Image className={css.image} placeholder={placeholder} sizing="fit" src={imageOverlay} /> : null}
				{text ? (<Marquee alignment="center" className={css.text} marqueeOn="render">{text}</Marquee>) : null}
			</div>
		);
	}
}

/**
 * Moonstone-specific behaviors to apply to [MediaOverlay]{@link moonstone/MediaOverlay.MediaOverlayBase}.
 *
 * @hoc
 * @memberof moonstone/MediaOverlay
 * @mixes moonstone/Marquee.MarqueeController
 * @mixes spotlight/Spottable.Spottable
 * @mixes ui/Slottable.Slottable
 * @mixes ui/Skinnable.Skinnable
 * @public
 */
const MediaOverlayDecorator = compose(
	Pure,
	MarqueeController({marqueeOnFocus: true}),
	Spottable,
	Slottable({slots: ['source']}),
	Skinnable
);

/**
 * A Moonstone-styled `Media` component.
 *
 * Usage:
 * ```
 * <MediaOverlay>
 *     <source type='' src=''/>
 * </MediaOverlay>
 * ```
 *
 * @class MediaOverlay
 * @memberof moonstone/MediaOverlay
 * @mixes moonstone/MediaOverlay.MediaOverlayDecorator
 * @ui
 * @public
 */
const MediaOverlay = MediaOverlayDecorator(MediaOverlayBase);

export default MediaOverlay;
export {
	MediaOverlay,
	MediaOverlayBase,
	MediaOverlayDecorator
};
