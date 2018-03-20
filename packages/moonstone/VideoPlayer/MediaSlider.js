import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';
import PropTypes from 'prop-types';

import Slider from '../Slider';

import css from './VideoPlayer.less';

/**
 * MediaSlider for {@link moonstone/VideoPlayer}.
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
		 * Background progress, as a proportion from `0` to `1`.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		backgroundProgress: PropTypes.number,

		/**
		 * When `true`, the component is shown as disabled and does not generate events.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

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
		value: PropTypes.number,

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

	render: ({className, sliderClassName, ...rest}) => {
		delete rest.forcePressed;
		delete rest.visible;

		return (
			<div className={className}>
				<Slider
					{...rest}
					aria-hidden="true"
					className={sliderClassName}
					css={css}
					detachedKnob
					knobStep={0.05}
					max={1}
					min={0}
					step={0.00001}
				/>
			</div>
		);
	}
});

const MediaSlider = onlyUpdateForKeys(['backgroundProgress', 'children', 'forcePressed', 'value', 'visible'])(MediaSliderBase);

export default MediaSlider;
export {
	MediaSlider,
	MediaSliderBase
};
