/**
 * Display picture in graphics
 *
 * @example
 * <PictureInGraphics>
 *     <source type='' src=''/>
 * </PictureInGraphics>
 *
 * @module moonstone/PictureInGraphics
 * @exports PictureInGraphics
 * @exports PictureInGraphicsBase
 * @exports PictureInGraphicsDecorator
 */

import PropTypes from 'prop-types';
import React from 'react';
import compose from 'ramda/src/compose';

import styles from '@enact/core/kind/styles.js';
import Pure from '@enact/ui/internal/Pure';
import Media from '@enact/ui/Media';
import Slottable from '@enact/ui/Slottable';
import {compareSources} from '@enact/moonstone/VideoPlayer/util';
import Spottable from '@enact/spotlight/Spottable';

import Image from '../Image';
import Skinnable from '../Skinnable';
import {MarqueeController, Marquee} from '../Marquee';

import componentCss from './PictureInGraphics.less';

const defaultPlaceholder =
	'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
	'9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
	'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
	'4NCg==';

const cfgStyles = {
	css: componentCss,
	className: 'pictureInGraphics',
	publicClassNames: ['pictureInGraphics', 'textOverlay']
};

/**
 * picture in graphics {@link moonstone/PictureInGraphics.PictureInGraphicsBase}.
 *
 * @class PictureInGraphicsBase
 * @memberof moonstone/PictureInGraphics
 * @ui
 * @public
 */
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
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `pictureInGraphics` - The root class name
		 * * `textOverlay` - class name for `textOverlayContent`
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Image path for image overlay.
		 * When image is displayed, video is not displayed even though it is playing.
		 *
		 * @type {String}
		 * @public
		 */
		imageOverlaySrc: PropTypes.string,

		/**
		 * Placeholder for image overlay
		 *
		 * @type {String}
		 * @public
		 */
		placeholder: PropTypes.string,

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
		 * Methods:
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
		this.renderStyles = styles(cfgStyles);
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
		let p = Object.assign({}, this.props);
		p = this.renderStyles(p);

		const {
			css,
			source,
			placeholder,
			imageOverlaySrc,
			textOverlayContent,
			videoComponent,
			...rest} = p;

		return (
			<div {...rest}>
				<Media
					autoPlay
					className={css.video}
					component={videoComponent}
					controls={false}
					ref={this.setVideoRef}
				>
					{source}
				</Media>
				{imageOverlaySrc ? <Image className={css.image} placeholder={placeholder} sizing="fit" src={imageOverlaySrc} /> : null}
				{textOverlayContent ? (<Marquee alignment="center" className={css.textOverlay} marqueeOn="render">{textOverlayContent}</Marquee>) : null}
			</div>
		);
	}
}

/**
 * Moonstone-specific behaviors to apply to [PictureInGraphics]{@link moonstone/PictureInGraphics.PictureInGraphicsBase}.
 *
 * @hoc
 * @memberof moonstone/PictureInGraphics
 * @mixes moonstone/Marquee.MarqueeController
 * @mixes spotlight/Spottable.Spottable
 * @mixes ui/Slottable.Slottable
 * @mixes ui/Skinnable.Skinnable
 * @public
 */
const PictureInGraphicsDecorator = compose(
	Pure,
	MarqueeController({marqueeOnFocus: true}),
	Spottable,
	Slottable({slots: ['source']}),
	Skinnable
);

/**
 * A Moonstone-styled PictureInGraphics, ready to use.
 *
 * Usage:
 * ```
 * <PictureInGraphics>
 *     <source type='' src=''/>
 * </PictureInGraphics>
 * ```
 *
 * @class PictureInGraphics
 * @memberof moonstone/PictureInGraphics
 * @mixes moonstone/PictureInGraphics.PictureInGraphicsDecorator
 * @ui
 * @public
 */
const PictureInGraphics = PictureInGraphicsDecorator(PictureInGraphicsBase);

export default PictureInGraphics;
export {
	PictureInGraphics,
	PictureInGraphicsBase,
	PictureInGraphicsDecorator
};
