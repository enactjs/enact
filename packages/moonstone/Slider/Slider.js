/**
 * Exports the {@link moonstone/Slider.Slider}
 *
 * @module moonstone/Slider
 */

import kind from '@enact/core/kind';
import {Spottable} from '@enact/spotlight';
import Pressable from '@enact/ui/Pressable';
import {checkDefaultBounds} from '@enact/ui/validators/PropTypeValidators';
import React, {PropTypes} from 'react';

import SliderDecorator from '../internal/SliderDecorator';
import {
	computeProportionBackground,
	computeProportionProgress,
	computeBarTransform,
	computeKnobTransform
} from '../internal/SliderDecorator/util';

import css from './Slider.less';

class VisibleBar extends React.Component {
	static propTypes = /** @lends moonstone/Slider.VisibleBar.prototype */{
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

/**
 * {@link moonstone/Slider.SliderBase} is a stateless Slider. In most 
 * circumstances, you will want to use the stateful version.
 * {@link moonstone/Slider.Slider}
 *
 * @class SliderBase
 * @memberof moonstone/Slider
 * @ui
 * @public
 */
const SliderBase = kind({
	name: 'Slider',

	propTypes: /** @lends moonstone/Slider.SliderBase.prototype */{
		/**
		 * Background progress, as a percentage.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		backgroundPercent: PropTypes.number,

		/**
		 * Height, in standard CSS units, of the vertical slider. Only takes
		 * effect on a vertical oriented slider.
		 *
		 * @type {String}
		 * @default '300px'
		 * @public
		 */
		height: PropTypes.string,

		/**
		 * The method to run when the input mounts, giving a reference to the DOM.
		 *
		 * @type {Function}
		 * @private
		 */
		inputRef: PropTypes.func,

		/**
		 * The maximum value of the slider.
		 *
		 * @type {Number}
		 * @default 100
		 * @public
		 */
		max: PropTypes.number,

		/**
		 * The minimum value of the slider.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		min: PropTypes.number,

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
		 * When `true`, a pressed visual effect is applied
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * The method to run when mounted, giving a reference to the DOM.
		 *
		 * @type {Function}
		 * @private
		 */
		sliderRef: PropTypes.func,

		/**
		 * The amount to increment or decrement the value.
		 *
		 * @type {Number}
		 * @default 1
		 * @public
		 */
		step: PropTypes.number,

		/**
		 * The value of the slider.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: checkDefaultBounds,

		/**
		 * If `true` the slider will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		vertical: PropTypes.bool,

		/**
		 * The method to run when the visible bar component mounts, giving a reference to the DOM.
		 *
		 * @type {Function}
		 * @private
		 */
		visibleBarRef: PropTypes.func
	},

	defaultProps: {
		backgroundPercent: 0,
		height: '300px',
		max: 100,
		min: 0,
		pressed: false,
		step: 1,
		value: 0,
		vertical: false
	},

	styles: {
		css: css,
		className: 'slider'
	},

	computed: {
		className: ({pressed, vertical, styler}) => styler.append({pressed, vertical, horizontal: !vertical}),
		proportionBackgroundProgress: computeProportionBackground,
		proportionProgress: computeProportionProgress,
		verticalHeight: ({vertical, height}) => (vertical ? {height} : null),
		verticalWidth: ({vertical, height}) => (vertical ? {width: height} : null)
	},

	render: ({inputRef, max, min, onChange, proportionBackgroundProgress, proportionProgress, sliderRef, step, value, vertical, verticalHeight, verticalWidth, visibleBarRef, ...rest}) => {
		const sliderProps = {
			proportionBackgroundProgress,
			proportionProgress,
			vertical,
			verticalHeight
		};

		delete rest.backgroundPercent;
		delete rest.pressed;

		return (
			<div {...rest} ref={sliderRef}>
				<VisibleBar {...sliderProps} ref={visibleBarRef} />
				<input
					className={css.sliderBar}
					type="range"
					ref={inputRef}
					max={max}
					min={min}
					step={step}
					onChange={onChange}
					value={value}
					style={verticalWidth}
				/>
			</div>
		);
	}
});

/**
 * {@link moonstone/Slider.Slider} is a Slider with 
 * Moonstone styling, Spottable, Pressable and SliderDecorator applied. It is a 
 * stateful Slider.
 *
 * @class Slider
 * @memberof moonstone/Slider
 * @mixes spotlight/Spottable
 * @mixes ui/Pressable
 * @ui
 * @public
 */
const SpottableSlider = Pressable(Spottable(SliderDecorator(SliderBase)));

export default SpottableSlider;
export {SpottableSlider as Slider, SliderBase};
