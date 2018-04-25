/**
 * Provides a media component with image and text overlay support.
 *
 * @module moonstone/MediaOverlay
 * @exports MediaOverlay
 * @exports MediaOverlayBase
 * @exports MediaOverlayDecorator
 */

import styles from '@enact/core/kind/styles';
import Spottable from '@enact/spotlight/Spottable';
import {Layout, Cell} from '@enact/ui/Layout';
import Media from '@enact/ui/Media';
import Pure from '@enact/ui/internal/Pure';
import Slottable from '@enact/ui/Slottable';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import Image from '../Image';
import {MarqueeController, Marquee} from '../Marquee';
import Skinnable from '../Skinnable';
import {compareSources} from '../VideoPlayer/util';

import componentCss from './MediaOverlay.less';

const renderStyles = styles({
	css: componentCss,
	className: 'mediaOverlay',
	publicClassNames: ['mediaOverlay', 'image', 'textLayout']
});

/**
 * A media component with image and text overlay support.
 *
 * @class MediaOverlayBase
 * @memberof moonstone/MediaOverlay
 * @ui
 * @public
 */
class MediaOverlayBase extends React.Component {
	static propTypes = /** @lends moonstone/MediaOverlay.MediaOverlayBase.prototype */ {
		/**
		 * Any children `<source>` tag elements will be sent directly to the media element as
		 * sources.
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
		 * * `image` - class name for image
		 * * `textLayout` - class name for text layout
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
		 * @type {String | Object}
		 * @public
		 */
		imageOverlay: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

		/**
		 * Media component to use.
		 *
		 * The default (`'video'`) renders an `HTMLVideoElement`. Custom media components must have
		 * a similar API structure, exposing the following APIs:
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
		text: PropTypes.string,

		/**
		 * Aligns the `text` vertically within the component.
		 *
		 * Allowed values are:
		 *
		 * * `"center"`, the default, aligns the text in the middle
		 * * `"start"` aligns the text to the top
		 * * `"end"` aligns the text to the bottom
		 *
		 * @type {String}
		 * @public
		 * @default "center"
		 */
		textAlign: PropTypes.string
	}

	static defaultProps = {
		mediaComponent: 'video',
		textAlign: 'center'
	}

	constructor (props) {
		super(props);

		this.media = null;
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
		const props = renderStyles(Object.assign({}, this.props));
		const {css, imageOverlay, mediaComponent, placeholder, source, text, textAlign, ...rest} = props;

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
				{imageOverlay ? (
					<Image
						className={css.image}
						placeholder={placeholder}
						sizing="fill"
						src={imageOverlay}
					/>
				) : null}
				{text ? (
					<Layout align={textAlign} className={css.textLayout}>
						<Cell component={Marquee} alignment="center" className={css.text} marqueeOn="render">
							{text}
						</Cell>
					</Layout>
				) : null}
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
