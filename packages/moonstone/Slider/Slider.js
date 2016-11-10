import kind from '@enact/core/kind';
import {Spottable} from '@enact/spotlight';
import Pressable from '@enact/ui/Pressable';
import {checkDefaultBounds} from '@enact/ui/validators/PropTypeValidators';
import React, {PropTypes} from 'react';

import SliderDecorator from '../internal/SliderDecorator';
import {
	computeLoadedValue,
	computePercentProgress,
	computeLoaderStyleProp,
	computeFillStyleProp,
	computeKnobStyleProp
} from '../internal/SliderDecorator/util';

import css from './Slider.less';

class VisibleBar extends React.Component {
	static propTypes = {
		/**
		 * The background progress as a percentage.
		 *
		 * @type {String}
		 * @public
		 */
		percentBackgroundProgress: PropTypes.string,

		/**
		 * The progress as a percentage.
		 *
		 * @type {String}
		 * @public
		 */
		percentProgress: PropTypes.string,

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
		 * @type {String}
		 * @public
		 */
		verticalHeight: PropTypes.string
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

	render () {
		const {percentBackgroundProgress, percentProgress, vertical, verticalHeight} = this.props;

		return (
			<div className={css.visibleBar} style={verticalHeight}>
				<div className={css.load} ref={this.getLoaderNode} style={{[computeLoaderStyleProp(vertical)]: percentBackgroundProgress}} />
				<div className={css.fill} ref={this.getBarNode} style={{[computeFillStyleProp(vertical)]: percentProgress}} />
				<div className={css.knob} ref={this.getKnobNode} style={{[computeKnobStyleProp(vertical)]: percentProgress}} />
			</div>
		);
	}
}

const SliderBase = kind({
	name: 'Slider',

	propTypes: {
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
		percentBackgroundProgress: computeLoadedValue,
		percentProgress: computePercentProgress,
		verticalHeight: ({vertical, height}) => (vertical ? {height} : null),
		verticalWidth: ({vertical, height}) => (vertical ? {width: height} : null)
	},

	render: ({inputRef, percentBackgroundProgress, max, min, onChange, percentProgress, sliderRef, step, value, verticalHeight, verticalWidth, visibleBarRef, ...rest}) => {
		const sliderProps = {
			percentBackgroundProgress,
			percentProgress,
			verticalHeight
		};

		delete rest.backgroundPercent;
		delete rest.pressed;
		delete rest.vertical;

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

const SpottableSlider = Pressable(Spottable(SliderDecorator(SliderBase)));

export default SpottableSlider;
export {SpottableSlider as Slider, SliderBase};
