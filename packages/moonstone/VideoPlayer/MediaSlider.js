import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';

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

	propTypes: {
		/**
		 * Background progress, as a percentage.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		backgroundPercent: React.PropTypes.number,

		/**
		 * When `true`, the component is shown as disabled and does not generate events
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: React.PropTypes.bool,

		/**
		 * The handler to run when the value is changed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {Number} event.value Value of the slider
		 * @public
		 */
		onChange: React.PropTypes.func,

		/**
		 * The value of the slider.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: React.PropTypes.number
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
			/>
		</div>
	)
});

const MediaSlider = onlyUpdateForKeys(['backgroundPercent', 'value'])(MediaSliderBase);

export default MediaSlider;
export {
	MediaSlider,
	MediaSliderBase
};
