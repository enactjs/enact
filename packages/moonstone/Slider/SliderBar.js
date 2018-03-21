import React from 'react';
import PropTypes from 'prop-types';

import {
	computeBarTransform,
	computeKnobTransform
} from '../internal/SliderDecorator/util';


/**
 * The componenrt used to establish the DOM and structure of the Slider.
 *
 * @class SliderBar
 * @memberof moonstone/Slider
 * @ui
 * @private
 */
class SliderBar extends React.Component {
	static displayName = 'SliderBar'

	static propTypes = /** @lends moonstone/Slider.SliderBar.prototype */{

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 *  The following classes are supported:
		 *
		 * * `sliderBar` - The root class name
		 * * `load` - The background progress bar node
		 * * `fill` - The progress bar node
		 * * `knob` - The knob node
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * The slider can change its behavior to have the knob follow the cursor as it moves
		 * across the slider, without applying the position. A click or drag behaves the same.
		 * This is primarily used by media playback. Setting this to `true` enables this behavior.
		 *
		 * @type {Boolean}
		 * @private
		 */
		detachedKnob: PropTypes.bool,

		/**
		 * Sets the orientation of the slider, whether the slider moves left and right or up and
		 * down. Must be either `'horizontal'` or `'vertical'`.
		 *
		 * @type {String}
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

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
		 * @public
		 */
		scrubbing: PropTypes.bool
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
		const {children, css, detachedKnob, orientation, proportionBackgroundProgress, proportionProgress, scrubbing, ...rest} = this.props;

		return (
			<div {...rest} className={css.sliderBar} ref={this.getNode}>
				<div className={css.load} ref={this.getLoaderNode} style={{transform: computeBarTransform(proportionBackgroundProgress, (orientation === 'vertical'))}} />
				<div className={css.fill} ref={this.getBarNode} style={{transform: computeBarTransform(proportionProgress, (orientation === 'vertical'))}} />
				<div className={css.knob} ref={this.getKnobNode} style={(detachedKnob && !scrubbing) ? {transform: computeKnobTransform(proportionProgress, (orientation === 'vertical'), this.node)} : null}>
					{children}
				</div>
			</div>
		);
	}
}

export default SliderBar;
export {
	SliderBar
};
