/**
 * Provides a media component with image and text overlay support.
 *
 * @example
 * <MediaOverlay text="overlay">
 *   <source src="http://media.w3.org/2010/05/sintel/trailer.mp4" />
 * </MediaOverlay>
 *
 * @module moonstone/MediaOverlay
 * @exports MediaOverlay
 * @exports MediaOverlayBase
 * @exports MediaOverlayDecorator
 */

import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import {Layout, Cell} from '@enact/ui/Layout';
import Media from '@enact/ui/Media';
import Pure from '@enact/ui/internal/Pure';
import Slottable from '@enact/ui/Slottable';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import Image from '../Image';
import {Marquee} from '../Marquee';
import Skinnable from '../Skinnable';

import componentCss from './MediaOverlay.module.less';

/**
 * A media component with image and text overlay support.
 *
 * @class MediaOverlayBase
 * @memberof moonstone/MediaOverlay
 * @ui
 * @public
 */
const MediaOverlayBase = kind({
	name: 'MediaOverlay',

	propTypes: /** @lends moonstone/MediaOverlay.MediaOverlayBase.prototype */ {
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
		 * @type {String|Object}
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
		 * Placeholder for image overlay.
		 *
		 * @type {String}
		 * @public
		 */
		placeholder: PropTypes.string,

		/**
		 * Text to display over media.
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
	},

	defaultProps: {
		mediaComponent: 'video',
		textAlign: 'center'
	},

	styles: {
		css: componentCss,
		className: 'mediaOverlay',
		publicClassNames: ['mediaOverlay', 'image', 'textLayout']
	},

	render: ({css, imageOverlay, mediaComponent, placeholder, source, text, textAlign, ...rest}) => {
		return (
			<div {...rest}>
				<Media
					autoPlay
					className={css.media}
					controls={false}
					mediaComponent={mediaComponent}
					muted
					source={source}
				/>
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
});

/**
 * A higher-order component that adds Moonstone specific behaviors to `MediaOverlay`.
 *
 * @hoc
 * @memberof moonstone/MediaOverlay
 * @mixes spotlight/Spottable.Spottable
 * @mixes ui/Slottable.Slottable
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */
const MediaOverlayDecorator = compose(
	Pure,
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
 * @extends moonstone/mediaOverlay.MediaOverlayBase
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
