import React, {PropTypes} from 'react';

import {
	computeBarTransform,
	computeKnobTransform
} from '../internal/SliderDecorator/util';

import css from './Slider.less';

/**
 * {@link moonstone/Slider.SliderBar} is private.
 *
 * @class SliderBar
 * @memberof moonstone/Slider
 * @ui
 * @private
 */

class SliderBar extends React.Component {
	static propTypes = /** @lends moonstone/Slider.SliderBar.prototype */{
		/**
		 * The background progress as a proportion.
		 *
		 * @type {Number}
		 * @public
		 */
		proportionBackgroundProgress: PropTypes.number,

		/**
		 * The progress as a percentage.
		 *
		 * @type {String}
		 * @public
		 */
		proportionProgress: PropTypes.number,

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
		this.knobWidth = node && node.offsetHeight / 2;
	}

	getLoaderNode = (node) => {
		this.loaderNode = node;
	}

	getNode = (node) => {
		this.node = node;
	}

	render () {
		const {proportionBackgroundProgress, proportionProgress, vertical, verticalHeight, ...rest} = this.props;

		return (
			<div {...rest} className={css.visibleBar} ref={this.getNode} style={verticalHeight}>
				<div className={css.load} ref={this.getLoaderNode} style={{transform: computeBarTransform(proportionBackgroundProgress, vertical)}} />
				<div className={css.fill} ref={this.getBarNode} style={{transform: computeBarTransform(proportionProgress, vertical)}} />
				<div className={css.knob} ref={this.getKnobNode} style={{transform: computeKnobTransform(proportionProgress, vertical, this.node, this.knobWidth)}} />
			</div>
		);
	}
}

export default SliderBar;
export {
	SliderBar
};
