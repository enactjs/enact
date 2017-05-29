import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';
import PropTypes from 'prop-types';

import {SliderFactory} from '../Slider';

import css from './VideoPlayer.less';

const Slider = SliderFactory({css});

/**
 * MediaSlider {@link moonstone/VideoPlayer}.
 *
 * @class MediaSlider
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
const MediaSliderBase = kind({
	name: 'MediaSlider',

	propTypes: /** @lends moonstone/VideoPlayer.MediaSlider.prototype */ {
		/**
		 * Background progress, as a proportion from `0` to `1`
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		backgroundProgress: PropTypes.number,

		/**
		 * When `true`, the component is shown as disabled and does not generate events
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The handler to run when the value is changed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {Number} event.value Value of the slider
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * The value of the slider.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: PropTypes.number
	},

	render: (props) => (
		<div className={css.sliderFrame}>
			<Slider
				{...props}
				className={css.mediaSlider}
				detachedKnob
				min={0}
				max={1}
				step={0.00001}
				knobStep={0.05}
			/>
		</div>
	)
});

const MediaSlider = onlyUpdateForKeys(['backgroundProgress', 'value'])(MediaSliderBase);

export default MediaSlider;
export {
	MediaSlider,
	MediaSliderBase
};
