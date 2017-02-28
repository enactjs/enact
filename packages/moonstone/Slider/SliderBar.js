import factory from '@enact/core/factory';
import React, {PropTypes} from 'react';

import {
	computeBarTransform,
	computeKnobTransform
} from '../internal/SliderDecorator/util';

const SliderBarFactory = factory(({css}) => {

	/**
	 * {@link moonstone/Slider.SliderBar} is private.
	 *
	 * @class SliderBar
	 * @memberof moonstone/Slider
	 * @ui
	 * @private
	 */

	return class extends React.Component {
		static displayName = 'SliderBar'

		static propTypes = /** @lends moonstone/Slider.SliderBar.prototype */{
			/**
			 * The slider can change its behavior to have the knob follow the cursor as it moves
			 * across the slider, without applying the position. A click or drag behaves the same.
			 * This is primarily used by media playback. Setting this to `true` enables this behavior.
			 *
			 * @type {Boolean}
			 * @default false
			 * @private
			 */
			detachedKnob: PropTypes.bool,

			/**
			 * The background progress as a proportion.
			 *
			 * @type {Number}
			 * @public
			 */
			proportionBackgroundProgress: PropTypes.number,

			/**
			 * The proportion of progress as a number between 0 and 1.
			 *
			 * @type {Number}
			 * @public
			 */
			proportionProgress: PropTypes.number,

			/**
			 * `scrubbing` only has an effect with a datachedKnob, and is a performance optimization
			 * to not allow re-assignment of the knob's value (and therefore position) during direct
			 * user interaction.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			scrubbing: PropTypes.bool,

			/**
			 * If `true` the slider will be oriented vertically.
			 *
			 * @type {Boolean}
			 * @public
			 */
			vertical: PropTypes.bool,

			/**
			 * Height, in standard CSS units, of the vertical slider. Only takes
			 * effect on a vertical oriented slider, and will be `null` otherwise.
			 *
			 * @type {Object}
			 * @public
			 */
			verticalHeight: PropTypes.object
		}

		getBarNode = (node) => {
			this.barNode = node;
		}

		getKnobNode = (node) => {
			this.knobNode = node;
		}

		getLoaderNode = (node) => {
			this.loaderNode = node;
		}

		getNode = (node) => {
			this.node = node;
		}

		render () {
			const {detachedKnob, proportionBackgroundProgress, proportionProgress, scrubbing, vertical, ...rest} = this.props;

			return (
				<div {...rest} className={css.sliderBar} ref={this.getNode}>
					<div className={css.load} ref={this.getLoaderNode} style={{transform: computeBarTransform(proportionBackgroundProgress, vertical)}} />
					<div className={css.fill} ref={this.getBarNode} style={{transform: computeBarTransform(proportionProgress, vertical)}} />
					<div className={css.knob} ref={this.getKnobNode} style={(detachedKnob && !scrubbing) ? {transform: computeKnobTransform(proportionProgress, vertical, this.node)} : null} />
				</div>
			);
		}
	};
});

export default SliderBarFactory;
export {SliderBarFactory};
