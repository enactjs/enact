import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import Slider from '../Slider';

import MediaKnob from './MediaKnob';
import MediaSliderDecorator from './MediaSliderDecorator';

import css from './VideoPlayer.module.less';

/**
 * The base component to render a customized [Slider]{@link moonstone/Slider.Slider} for use in
 * [VideoPlayer]{@link moonstone/VideoPlayer.VideoPlayer}.
 *
 * @class MediaSliderBase
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
const MediaSliderBase = kind({
	name: 'MediaSlider',

	propTypes: /** @lends moonstone/VideoPlayer.MediaSliderBase.prototype */ {

		/**
		 * When `true`, the knob will expand. Note that Slider is a controlled
		 * component. Changing the value would only affect pressed visual and
		 * not the state.
		 *
		 * @type {Boolean}
		 * @public
		 */
		forcePressed: PropTypes.bool,

		/**
		 * Allow moving the knob via pointer or 5-way without emitting `onChange` events
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		preview: PropTypes.bool,

		/**
		 * The position of the knob when in `preview` mode
		 *
		 * @type {Number}
		 * @public
		 */
		previewProportion: PropTypes.number,

		/**
		 * The visibility of the component. When `false`, the component will be hidden.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		visible: PropTypes.bool
	},

	defaultProps: {
		preview: false,
		visible: true
	},

	styles: {
		css,
		className: 'sliderFrame'
	},

	computed: {
		className: ({styler, visible}) => styler.append({hidden: !visible}),
		sliderClassName: ({styler, forcePressed}) => styler.join({
			pressed: forcePressed,
			mediaSlider: true
		})
	},

	render: ({className, preview, previewProportion, sliderClassName, ...rest}) => {
		delete rest.forcePressed;
		delete rest.visible;

		return (
			<div className={className}>
				<Slider
					{...rest}
					aria-hidden="true"
					className={sliderClassName}
					css={css}
					knobComponent={
						<MediaKnob preview={preview} previewProportion={previewProportion} />
					}
					max={1}
					min={0}
					step={0.00001}
				/>
			</div>
		);
	}
});

/**
 * A customized slider suitable for use within
 * [VideoPlayer]{@link moonstone/VideoPlayer.VideoPlayer}.
 *
 * @class MediaSlider
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
const MediaSlider = MediaSliderDecorator(MediaSliderBase);

export default MediaSlider;
export {
	MediaSlider,
	MediaSliderBase
};
